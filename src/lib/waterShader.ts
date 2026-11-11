// Draws two images with a wave passing between them: the crest pushes the picture
// along, a trough springs it back, and a soft blur travels just behind the crest.
// The crest, trough and blur shape are adapted from glimm's page effect (MIT).

const VERTEX_SHADER = `#version 300 es
in vec2 position;
out vec2 vUV;
void main() {
  vUV = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
in vec2 vUV;
out vec4 outColor;

uniform sampler2D uOld;
uniform sampler2D uNew;
uniform vec2 uRes;
uniform float uDpr;
uniform float uStrength;
uniform float uWidth;
uniform float uCurve;
uniform float uFront;
uniform float uRing;
uniform float uTime;
uniform float uDown;

vec3 page(vec2 p, bool isNew, float lod) {
  vec2 uv = clamp(p / uRes, vec2(0.0), vec2(1.0));
  return (isNew ? textureLod(uNew, uv, lod) : textureLod(uOld, uv, lod)).rgb;
}

vec3 soft(vec2 p, bool isNew, float radius) {
  if (radius < 0.4) return page(p, isNew, 0.0);
  float lod = max(0.0, log2(radius * uDpr / 2.5));
  vec3 sum = page(p, isNew, lod);
  for (int i = 1; i < 16; i++) {
    float fi = float(i);
    float angle = fi * 2.39996;
    sum += page(p + vec2(cos(angle), sin(angle)) * sqrt(fi / 16.0) * radius, isNew, lod);
  }
  return sum / 16.0;
}

void main() {
  vec2 px = vUV * uRes;
  float height = uRes.y;

  float across = (px.x / uRes.x - 0.5) * 2.0;
  float front = uFront * height - uCurve * across * across * height;
  float travel = uDown > 0.5 ? height - px.y : px.y;
  float u = (travel - front) / uWidth;

  float crest = exp(-u * u);
  float trough = exp(-pow((u + 2.6) / 1.4, 2.0));
  float push = (crest * 22.0 - trough * 8.0) * uRing * uStrength;

  // Slow crossing ripples, so the surface reads as water rather than a straight wipe.
  float wake = (crest + 0.6 * exp(-pow((u + 1.4) / 1.6, 2.0))) * uRing * uStrength;
  vec2 ripple = vec2(
    sin(px.y * 0.019 + uTime * 1.7) + sin(px.y * 0.034 - px.x * 0.008 - uTime * 1.1),
    sin(px.x * 0.021 + uTime * 1.3) + sin(px.x * 0.013 + px.y * 0.011 + uTime * 0.9)
  ) * wake * 4.0;

  vec2 sampleAt = px - vec2(0.0, uDown > 0.5 ? -push : push) + ripple;
  float blur = 18.0 * uStrength * uRing * exp(-pow((u * 0.5 + 0.2) / 0.9, 2.0));

  float zone = uWidth * 1.2;
  float mixNew = 1.0 - smoothstep(-zone, zone, travel - front);
  vec3 color = mix(soft(sampleAt, false, blur), soft(sampleAt, true, blur), mixNew);

  // A hairline of colour either side of the crest, like light through the edge of a wave.
  float split = crest * uRing * 2.0 * uStrength;
  if (split > 0.3) {
    float lod = max(0.0, log2(blur * uDpr / 2.5));
    vec2 offset = vec2(0.0, split);
    color.r = mix(page(sampleAt + offset, false, lod).r, page(sampleAt + offset, true, lod).r, mixNew);
    color.b = mix(page(sampleAt - offset, false, lod).b, page(sampleAt - offset, true, lod).b, mixNew);
  }

  outColor = vec4(color, 1.0);
}`;

export type WaterShader = {
  setImages: (before: TexImageSource, after: TexImageSource) => void;
  /** front: how far the crest has travelled, as a fraction of the box. ring: wave strength, 0..1. */
  draw: (front: number, ring: number, timeSeconds: number) => void;
  destroy: () => void;
};

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  console.error(gl.getShaderInfoLog(shader));
  return null;
}

function upload(gl: WebGL2RenderingContext, unit: number, texture: WebGLTexture, image: TexImageSource) {
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

export function createWaterShader(
  canvas: HTMLCanvasElement,
  options: {
    cssWidth: number;
    cssHeight: number;
    dpr: number;
    strength: number;
    bandWidth: number;
    curve: number;
    downward?: boolean;
  },
): WaterShader | null {
  const { cssWidth, cssHeight, dpr, strength, bandWidth, curve, downward = false } = options;
  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);

  const gl = canvas.getContext("webgl2", { alpha: false, antialias: false });
  if (!gl) return null;

  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uniform = (name: string) => gl.getUniformLocation(program, name);
  gl.uniform1i(uniform("uOld"), 0);
  gl.uniform1i(uniform("uNew"), 1);
  gl.uniform2f(uniform("uRes"), cssWidth, cssHeight);
  gl.uniform1f(uniform("uDpr"), dpr);
  gl.uniform1f(uniform("uStrength"), strength);
  gl.uniform1f(uniform("uWidth"), bandWidth * cssHeight);
  gl.uniform1f(uniform("uCurve"), curve);
  gl.uniform1f(uniform("uDown"), downward ? 1 : 0);
  const uFront = uniform("uFront");
  const uRing = uniform("uRing");
  const uTime = uniform("uTime");

  const oldTexture = gl.createTexture();
  const newTexture = gl.createTexture();
  if (!oldTexture || !newTexture) return null;

  return {
    setImages(before, after) {
      upload(gl, 0, oldTexture, before);
      upload(gl, 1, newTexture, after);
    },
    draw(front, ring, timeSeconds) {
      gl.uniform1f(uFront, front);
      gl.uniform1f(uRing, ring);
      gl.uniform1f(uTime, timeSeconds);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    destroy() {
      gl.deleteTexture(oldTexture);
      gl.deleteTexture(newTexture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    },
  };
}
