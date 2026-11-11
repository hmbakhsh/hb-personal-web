"use client";

import { useEffect, useRef } from "react";
import { createShader, type ShaderController } from "glimm";
import { renderHalftone } from "@/lib/halftone";
import { createWaterShader, type WaterShader } from "@/lib/waterShader";

const SIZE_PX = 68;
const RENDER_DPR = 2;

const SMOOTH_TIME_S = 0.75;
const MAX_FRAME_S = 1 / 30;
const SETTLED = 0.0005;

const BAND_TIGHT = 10;
// Matches how far glimm's shader runs a contained band past the box.
const SHADER_OVERSCAN = Math.max(0.2, Math.sqrt(4.6 / BAND_TIGHT));

// Band centre, in box heights from the bottom, at rest on each side.
const BAND_START = -0.5;
const BAND_END = 1.5;
const FADE_DISTANCE = 0.35;

const WATER_STRENGTH = 0.3;
const WATER_BAND_WIDTH = 0.22;
const BAND_CURVE = 0.05;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoothstep = (t: number) => t * t * (3 - 2 * t);

// A critically damped spring: no pop on start, and reversing keeps the velocity.
function dampTowards(position: number, velocity: number, target: number, dt: number) {
  const omega = 2 / SMOOTH_TIME_S;
  const x = omega * dt;
  const decay = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const offset = position - target;
  const step = (velocity + omega * offset) * dt;
  return {
    position: target + (offset + step) * decay,
    velocity: (velocity - omega * step) * decay,
  };
}

function cropPhoto(photo: HTMLImageElement, size: number) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const side = Math.min(photo.naturalWidth, photo.naturalHeight);
  canvas.getContext("2d")?.drawImage(
    photo,
    (photo.naturalWidth - side) / 2,
    (photo.naturalHeight - side) / 2,
    side,
    side,
    0,
    0,
    size,
    size,
  );
  return canvas;
}

export default function Avatar() {
  const photoRef = useRef<HTMLImageElement>(null);
  const waterCanvasRef = useRef<HTMLCanvasElement>(null);
  const bandCanvasRef = useRef<HTMLCanvasElement>(null);
  const motion = useRef({ position: 0, velocity: 0, target: 0, frame: 0, last: 0, elapsed: 0 });
  const waterRef = useRef<WaterShader | null>(null);
  const bandRef = useRef<ShaderController | null>(null);
  const startingRef = useRef(false);

  useEffect(
    () => () => {
      cancelAnimationFrame(motion.current.frame);
      waterRef.current?.destroy();
      bandRef.current?.destroy();
    },
    [],
  );

  const render = () => {
    const state = motion.current;
    const band = BAND_START + (BAND_END - BAND_START) * state.position;
    const fadeIn = clamp01((band - BAND_START) / FADE_DISTANCE);
    const fadeOut = clamp01((BAND_END - band) / FADE_DISTANCE);
    const strength = smoothstep(fadeIn) * smoothstep(fadeOut);

    waterRef.current?.draw(band, strength, state.elapsed);
    bandRef.current?.setProgress((band + SHADER_OVERSCAN) / (1 + 2 * SHADER_OVERSCAN));
    bandRef.current?.setAlpha(strength);
  };

  const tick = (now: number) => {
    const state = motion.current;
    const dt = Math.min((now - state.last) / 1000, MAX_FRAME_S);
    state.last = now;
    state.elapsed += dt;
    Object.assign(state, dampTowards(state.position, state.velocity, state.target, dt));

    const settled =
      Math.abs(state.target - state.position) < SETTLED && Math.abs(state.velocity) < SETTLED;
    if (settled) {
      state.position = state.target;
      state.velocity = 0;
    }
    render();
    state.frame = settled ? 0 : requestAnimationFrame(tick);
  };

  // Created on first hover, so an unhovered page never pays for two WebGL contexts.
  const startShaders = async () => {
    const photo = photoRef.current;
    const waterCanvas = waterCanvasRef.current;
    const bandCanvas = bandCanvasRef.current;
    if (!photo?.complete || !waterCanvas || !bandCanvas) return false;

    const size = SIZE_PX * RENDER_DPR;
    const halftone = await renderHalftone(photo, SIZE_PX);
    const water = createWaterShader(waterCanvas, {
      cssWidth: SIZE_PX,
      cssHeight: SIZE_PX,
      dpr: RENDER_DPR,
      strength: WATER_STRENGTH,
      bandWidth: WATER_BAND_WIDTH,
      curve: BAND_CURVE,
    });
    if (!water) return false;

    water.setImages(cropPhoto(photo, size), halftone);
    waterRef.current = water;
    bandRef.current = createShader({
      canvas: bandCanvas,
      direction: "btt",
      bandTight: BAND_TIGHT,
      curve: BAND_CURVE,
      feather: 0,
      rippleAmount: 0.4,
      waveSpeed: 0.6,
    });
    render();
    waterCanvas.style.visibility = "visible";
    photo.style.visibility = "hidden";
    return true;
  };

  const fadePhoto = () => {
    const photo = photoRef.current;
    if (!photo) return;
    photo.style.transition = "opacity 200ms ease";
    photo.style.opacity = motion.current.target ? "0" : "1";
  };

  const runMotion = () => {
    const state = motion.current;
    if (state.frame) return;
    state.last = performance.now();
    state.frame = requestAnimationFrame(tick);
  };

  const moveTo = (target: number) => (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    motion.current.target = target;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      fadePhoto();
    } else if (waterRef.current) {
      runMotion();
    } else if (!startingRef.current) {
      startingRef.current = true;
      startShaders()
        .then((started) => (started ? runMotion() : fadePhoto()))
        .catch((error) => {
          console.error("avatar shader failed", error);
          fadePhoto();
        })
        .finally(() => {
          startingRef.current = false;
        });
    }
  };

  return (
    <div
      className="relative h-[68px] w-[68px] select-none overflow-hidden rounded-[15px]"
      onPointerEnter={moveTo(1)}
      onPointerLeave={moveTo(0)}
    >
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#8d919b] to-[#6a6e75]"
      >
        <span
          className="text-[27px] font-semibold leading-none tracking-[-0.02em] text-white"
        >
          HB
        </span>
      </div>
      <img
        ref={photoRef}
        src="/haroon.jpg"
        alt="Haroon Bakhsh"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <canvas
        ref={waterCanvasRef}
        aria-hidden
        className="invisible pointer-events-none absolute inset-0 h-full w-full"
      />
      <canvas
        ref={bandCanvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
    </div>
  );
}
