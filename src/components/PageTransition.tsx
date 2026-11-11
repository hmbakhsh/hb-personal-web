"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createShader, type ShaderController } from "glimm";
import { domToCanvas } from "modern-screenshot";
import { createWaterShader, type WaterShader } from "@/lib/waterShader";

const MAX_DPR = 2;
const SWEEP_MS = 1050;
const COMMIT_TIMEOUT_MS = 4000;
const SNAPSHOT_FRESH_MS = 2500;
const PREPARE_DELAY_MS = 100;

const BAND_START = -0.35;
const BAND_END = 1.35;
const FADE_DISTANCE = 0.25;
const BAND_CURVE = 0.12;
const WATER_BAND_WIDTH = 0.16;
// glimm's shader runs a full-viewport band this far past the screen.
const SHADER_OVERSCAN = 0.2;

const OVERLAY_ATTRIBUTE = "data-page-transition";
const SNAPSHOT_SKIP_ATTRIBUTE = "data-snapshot-skip";

// If scripts haven't finished by then, the page shows without the intro.
const INTRO_DEADLINE_MS = process.env.NODE_ENV === "development" ? 15000 : 3500;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoothstep = (t: number) => t * t * (3 - 2 * t);
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

const renderDpr = () => Math.min(MAX_DPR, window.devicePixelRatio || 1);

// Excludes a classic scrollbar, matching the box the fixed overlay fills.
const viewportSize = () => ({
  width: document.documentElement.clientWidth,
  height: document.documentElement.clientHeight,
});

// A picture of what's on screen now, the same size as the viewport.
async function snapshotViewport() {
  // The clone would replay the entrance from opacity 0, so settle it first.
  document.documentElement.dataset.navigated = "";

  const dpr = renderDpr();
  const page = await domToCanvas(document.body, {
    scale: dpr,
    backgroundColor: getComputedStyle(document.body).backgroundColor,
    // Without this the clone picks up the browser's default 8px body margin.
    style: { margin: "0" },
    filter: (node) =>
      !(node instanceof Element) ||
      !(
        node.hasAttribute(OVERLAY_ATTRIBUTE) ||
        node.hasAttribute(SNAPSHOT_SKIP_ATTRIBUTE) ||
        node.tagName === "NEXTJS-PORTAL"
      ),
  });

  const viewport = document.createElement("canvas");
  const { width, height } = viewportSize();
  viewport.width = Math.round(width * dpr);
  viewport.height = Math.round(height * dpr);
  const ctx = viewport.getContext("2d");
  if (!ctx) throw new Error("no 2d context for page snapshot");
  ctx.fillStyle = getComputedStyle(document.body).backgroundColor;
  ctx.fillRect(0, 0, viewport.width, viewport.height);
  ctx.drawImage(page, 0, -Math.round(window.scrollY * dpr));
  return viewport;
}

function solidImage(color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 2;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 2, 2);
  }
  return canvas;
}

function playBand(water: WaterShader, band: ShaderController | null) {
  return new Promise<void>((resolve) => {
    const start = performance.now();
    const tick = (now: number) => {
      const raw = clamp01((now - start) / SWEEP_MS);
      const position = BAND_START + (BAND_END - BAND_START) * easeInOutSine(raw);
      const fadeIn = clamp01((position - BAND_START) / FADE_DISTANCE);
      const fadeOut = clamp01((BAND_END - position) / FADE_DISTANCE);
      const strength = smoothstep(fadeIn) * smoothstep(fadeOut);
      water.draw(position, strength, (now - start) / 1000);
      band?.setProgress(clamp01((position + SHADER_OVERSCAN) / (1 + 2 * SHADER_OVERSCAN)));
      band?.setAlpha(strength);
      if (raw < 1) requestAnimationFrame(tick);
      else resolve();
    };
    requestAnimationFrame(tick);
  });
}

type Sweep = { navigate: () => void; downward: boolean; restoreScrollTo?: number };
type Transition = { prepare: () => void; go: (href: string) => void };
const TransitionContext = createContext<Transition | null>(null);

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const waterCanvasRef = useRef<HTMLCanvasElement>(null);
  const bandCanvasRef = useRef<HTMLCanvasElement>(null);
  const introCoverRef = useRef<HTMLDivElement>(null);
  const introStarted = useRef(false);
  const onCommit = useRef<(() => void) | null>(null);
  const prepared = useRef<{ shot: Promise<HTMLCanvasElement>; at: number; scrollY: number } | null>(null);
  const busy = useRef(false);
  const currentPath = useRef(pathname);
  const scrollByPath = useRef(new Map<string, number>());
  // The site's own history, to tell the browser's back from its forward.
  const visited = useRef({ paths: [pathname], cursor: 0 });

  useLayoutEffect(() => {
    currentPath.current = pathname;
    onCommit.current?.();
    onCommit.current = null;
  }, [pathname]);

  const currentShot = useCallback(() => {
    const ready = prepared.current;
    if (ready && ready.scrollY === window.scrollY && Date.now() - ready.at < SNAPSHOT_FRESH_MS) {
      return ready.shot;
    }
    const shot = snapshotViewport();
    prepared.current = { shot, at: Date.now(), scrollY: window.scrollY };
    return shot;
  }, []);

  const prepare = useCallback(() => {
    if (busy.current || prefersReducedMotion()) return;
    currentShot().catch((error) => console.error("page snapshot failed", error));
  }, [currentShot]);

  const sweep = useCallback(
    async ({ navigate, downward, restoreScrollTo }: Sweep) => {
      busy.current = true;
      scrollByPath.current.set(currentPath.current, window.scrollY);
      const overlay = overlayRef.current;
      const waterCanvas = waterCanvasRef.current;
      const bandCanvas = bandCanvasRef.current;
      let navigated = false;
      let destroy = () => {};

      try {
        if (!overlay || !waterCanvas || !bandCanvas) throw new Error("transition overlay missing");

        const before = await currentShot();
        const { width, height } = viewportSize();
        const water = createWaterShader(waterCanvas, {
          cssWidth: width,
          cssHeight: height,
          dpr: renderDpr(),
          strength: 1,
          bandWidth: WATER_BAND_WIDTH,
          curve: BAND_CURVE,
          downward,
        });
        if (!water) throw new Error("webgl2 unavailable");
        const band = createShader({
          canvas: bandCanvas,
          direction: downward ? "ttb" : "btt",
          bandTight: 8,
          curve: BAND_CURVE,
          brightness: 0.8,
          rippleAmount: 0.5,
          waveSpeed: 0.6,
          feather: 0,
        });
        destroy = () => {
          water.destroy();
          band?.destroy();
        };

        // Holds the old page on screen while the new one renders underneath.
        water.setImages(before, before);
        water.draw(BAND_START, 0, 0);
        overlay.style.display = "block";

        const committed = new Promise<void>((resolve) => {
          onCommit.current = resolve;
          window.setTimeout(resolve, COMMIT_TIMEOUT_MS);
        });
        navigated = true;
        navigate();
        await committed;
        await nextFrame();
        if (restoreScrollTo !== undefined) {
          window.scrollTo({ top: restoreScrollTo, behavior: "instant" });
        }
        await nextFrame();

        water.setImages(before, await snapshotViewport());

        await playBand(water, band);
      } catch (error) {
        console.error("page transition failed", error);
        if (!navigated) navigate();
      } finally {
        if (overlay) overlay.style.display = "none";
        destroy();
        prepared.current = null;
        busy.current = false;
      }
    },
    [currentShot],
  );

  // First load: the page is hidden behind a plain cover until it can be photographed.
  useEffect(() => {
    if (introStarted.current) return;
    introStarted.current = true;

    const cover = introCoverRef.current;
    const overlay = overlayRef.current;
    const waterCanvas = waterCanvasRef.current;
    const bandCanvas = bandCanvasRef.current;
    if (!cover || !overlay || !waterCanvas || !bandCanvas || prefersReducedMotion()) return;

    let destroy = () => {};
    (async () => {
      busy.current = true;
      try {
        await document.fonts.ready;
        await Promise.all([...document.images].map((image) => image.decode().catch(() => {})));

        const { width, height } = viewportSize();
        const water = createWaterShader(waterCanvas, {
          cssWidth: width,
          cssHeight: height,
          dpr: renderDpr(),
          strength: 1,
          bandWidth: WATER_BAND_WIDTH,
          curve: BAND_CURVE,
        });
        if (!water) return;
        const band = createShader({
          canvas: bandCanvas,
          direction: "btt",
          bandTight: 8,
          curve: BAND_CURVE,
          brightness: 0.8,
          rippleAmount: 0.5,
          waveSpeed: 0.6,
          feather: 0,
        });
        destroy = () => {
          water.destroy();
          band?.destroy();
        };

        const page = await snapshotViewport();
        if (performance.now() > INTRO_DEADLINE_MS) return;

        water.setImages(solidImage(getComputedStyle(document.body).backgroundColor), page);
        water.draw(BAND_START, 0, 0);
        overlay.style.display = "block";
        cover.style.display = "none";
        await playBand(water, band);
      } catch (error) {
        console.error("intro transition failed", error);
      } finally {
        cover.style.display = "none";
        overlay.style.display = "none";
        destroy();
        busy.current = false;
      }
    })();
  }, []);

  const go = useCallback(
    (href: string) => {
      if (busy.current) return;
      const history = visited.current;
      history.paths = [...history.paths.slice(0, history.cursor + 1), href];
      history.cursor += 1;
      if (prefersReducedMotion()) {
        router.push(href);
        return;
      }
      sweep({ navigate: () => router.push(href), downward: false });
    },
    [router, sweep],
  );

  // Back and forward. The URL has already changed, but holding Next's own popstate
  // handler back keeps the old page on screen long enough to photograph it.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let releasing = false;

    const setManualScroll = () => {
      window.history.scrollRestoration = "manual";
    };
    const setBrowserScroll = () => {
      window.history.scrollRestoration = "auto";
    };

    const onPopState = (event: PopStateEvent) => {
      const path = window.location.pathname;
      if (releasing || busy.current || path === currentPath.current) return;
      event.stopImmediatePropagation();

      const history = visited.current;
      const isForward =
        history.paths[history.cursor + 1] === path && history.paths[history.cursor - 1] !== path;
      if (isForward) {
        history.cursor += 1;
      } else if (history.cursor === 0) {
        history.paths.unshift(path);
      } else {
        history.cursor -= 1;
      }

      sweep({
        downward: !isForward,
        restoreScrollTo: scrollByPath.current.get(path) ?? 0,
        navigate: () => {
          releasing = true;
          window.dispatchEvent(new PopStateEvent("popstate", { state: event.state }));
          releasing = false;
        },
      });
    };

    setManualScroll();
    window.addEventListener("popstate", onPopState, { capture: true });
    window.addEventListener("pagehide", setBrowserScroll);
    window.addEventListener("pageshow", setManualScroll);
    return () => {
      setBrowserScroll();
      window.removeEventListener("popstate", onPopState, { capture: true });
      window.removeEventListener("pagehide", setBrowserScroll);
      window.removeEventListener("pageshow", setManualScroll);
    };
  }, [sweep]);

  const value = useMemo(() => ({ prepare, go }), [prepare, go]);

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <div
        ref={overlayRef}
        {...{ [OVERLAY_ATTRIBUTE]: "" }}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[9999] hidden"
      >
        <canvas ref={waterCanvasRef} className="absolute inset-0 h-full w-full" />
        <canvas ref={bandCanvasRef} className="absolute inset-0 h-full w-full" />
      </div>
      <div
        ref={introCoverRef}
        {...{ [OVERLAY_ATTRIBUTE]: "" }}
        aria-hidden
        className="intro-cover"
        style={{ animationDelay: `${INTRO_DEADLINE_MS}ms` }}
      />
    </TransitionContext.Provider>
  );
}

export function PageLink({
  href,
  onClick,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
  ...props
}: ComponentProps<typeof Link> & { href: string }) {
  const transition = useContext(TransitionContext);
  const hoverTimer = useRef<number | undefined>(undefined);

  return (
    <Link
      {...props}
      href={href}
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        hoverTimer.current = window.setTimeout(() => transition?.prepare(), PREPARE_DELAY_MS);
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        window.clearTimeout(hoverTimer.current);
      }}
      onPointerDown={(e) => {
        onPointerDown?.(e);
        transition?.prepare();
      }}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || !transition) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        transition.go(href);
      }}
    />
  );
}
