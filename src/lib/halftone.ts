import {
  HalftoneDotsGrids,
  HalftoneDotsTypes,
  ShaderFitOptions,
  ShaderMount,
  getShaderColorFromString,
  halftoneDotsFragmentShader,
} from "@paper-design/shaders";

const RENDER_PIXEL_RATIO = 2;
const MAX_WAIT_FRAMES = 20;

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

// Renders an image through Paper's halftone shader once and returns the result as a canvas.
export async function renderHalftone(image: HTMLImageElement, cssSize: number) {
  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "");
  host.setAttribute("data-snapshot-skip", "");
  host.style.cssText = `position:fixed;left:-9999px;top:0;width:${cssSize}px;height:${cssSize}px`;
  document.body.appendChild(host);

  const mount = new ShaderMount(
    host,
    halftoneDotsFragmentShader,
    {
      u_image: image,
      u_colorFront: getShaderColorFromString("#4a4845"),
      u_colorBack: getShaderColorFromString("#eeece4"),
      u_size: 0.5,
      u_radius: 1.2,
      u_contrast: 0.36,
      u_originalColors: false,
      u_inverted: false,
      u_grainMixer: 0.1,
      u_grainOverlay: 0.1,
      u_grainSize: 0.5,
      u_grid: HalftoneDotsGrids.hex,
      u_type: HalftoneDotsTypes.gooey,
      u_fit: ShaderFitOptions.cover,
      u_rotation: 0,
      u_scale: 1,
      u_offsetX: 0,
      u_offsetY: 0,
      u_originX: 0.5,
      u_originY: 0.5,
      u_worldWidth: 0,
      u_worldHeight: 0,
    },
    { preserveDrawingBuffer: true },
    0,
    0,
    RENDER_PIXEL_RATIO,
  );

  try {
    const source = mount.canvasElement;
    const target = Math.round(cssSize * RENDER_PIXEL_RATIO);
    for (let i = 0; i < MAX_WAIT_FRAMES && source.width !== target; i++) await nextFrame();
    await nextFrame();
    await nextFrame();

    const result = document.createElement("canvas");
    result.width = result.height = target;
    result.getContext("2d")?.drawImage(source, 0, 0, target, target);
    return result;
  } finally {
    mount.dispose();
    host.remove();
  }
}
