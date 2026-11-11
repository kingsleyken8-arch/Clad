/*
 * Plaster wall renderer.
 *
 * One fixed full-screen canvas draws everything behind the page:
 *
 *  - the day wall: plaster running the length of the page, with sculpted
 *    relief panels that stay flat until a "pressure" mask says otherwise. The
 *    mask is a low-res texture the pointer (or an idle wanderer) stamps into,
 *    that scrolls with the page and slowly drains, so carvings swell out of
 *    the wall near the cursor and sink back behind it;
 *  - the night wall: the same carving in black stone, with light breaking
 *    through in slivers under the pointer;
 *  - and the way one becomes the other. Page changes are not drawn on top of
 *    the scene, they are part of it: a plain dissolve (`mix`), a fade through
 *    flat paper (`intro`) or black (`black`), and a torn, smoke-edged front
 *    that carries the night wall in from the top-right corner (`sweep`).
 *
 * Each wall keeps its own scroll position and camera, so the page underneath
 * can be swapped mid-transition without either picture jumping.
 *
 * Raw WebGL1, no dependencies.
 */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

/* ---- pressure simulation: advect with scroll, diffuse, drain, stamp ---- */
const SIM_FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uPrev;
uniform vec2 uTexel;
uniform float uScrollDelta;   // in uv units, + = content moved up
uniform float uDrain;         // amount removed this step
uniform vec2 uAspect;         // scales uv so distances are isotropic
uniform vec3 uStampA;         // xy = uv, z = strength
uniform vec3 uStampB;
uniform float uRadius;

float prev(vec2 uv) {
  if (uv.y < 0.0 || uv.y > 1.0) return 0.0;
  return texture2D(uPrev, uv).r;
}

float stamp(vec3 s) {
  float d = length((vUv - s.xy) * uAspect);
  return s.z * smoothstep(uRadius, 0.0, d);
}

void main() {
  vec2 uv = vUv - vec2(0.0, uScrollDelta);
  float c = prev(uv);
  float n = prev(uv + vec2(uTexel.x, 0.0)) + prev(uv - vec2(uTexel.x, 0.0))
          + prev(uv + vec2(0.0, uTexel.y)) + prev(uv - vec2(0.0, uTexel.y));
  float m = mix(c, n * 0.25, 0.22);
  m = max(0.0, m - uDrain);
  m = max(m, stamp(uStampA));
  m = max(m, stamp(uStampB));
  gl_FragColor = vec4(m, m, m, 1.0);
}`;

/* ---- final image ---- */
const RENDER_FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uMask;
uniform sampler2D uWall;
uniform sampler2D uReliefA;
uniform sampler2D uReliefB;
uniform sampler2D uReliefC;
uniform sampler2D uNoise;   // tileable cloud noise, 4 cycles across
uniform vec2 uRes;          // css px
uniform vec2 uTile;         // css px (w, h)
uniform float uOffsetY;     // css px, where panel 0 starts
uniform float uTime;

// day wall
uniform float uUseDay;
uniform float uScrollD;     // css px
uniform float uShiftD;      // which panel sits first
uniform float uZoomD;
uniform float uIntro;       // 0 = flat paper, 1 = wall
uniform float uDim;         // 0..1, sinks the day wall towards black

// night wall
uniform float uUseNight;
uniform float uScrollN;
uniform float uShiftN;
uniform float uZoomN;
uniform float uRollN;       // radians
uniform float uBlack;       // 0..1, fades the night wall to black
uniform float uLight;       // 1 = the pointer may break light through the stone

// how the two meet
uniform float uMix;         // plain dissolve: 0 = day, 1 = night
uniform float uSweep;       // 0.35 = closed .. 3.2 = night has taken the whole screen

const float TONE = 0.80;
const float SWEEP_SHUT = 0.35;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
vec2 hash2(vec2 p) {
  return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}
float nz(vec2 p) { return texture2D(uNoise, p).r; }

// x: distance to nearest shard edge, y: random per shard, zw: offset to the shard's centre
vec4 shards(vec2 p) {
  vec2 n = floor(p), f = fract(p);
  vec2 mg, mr;
  float md = 8.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j));
    vec2 o = hash2(n + g);
    vec2 r = g + o - f;
    float d = dot(r, r);
    if (d < md) { md = d; mr = r; mg = g; }
  }
  md = 8.0;
  for (int j = -2; j <= 2; j++) for (int i = -2; i <= 2; i++) {
    vec2 g = mg + vec2(float(i), float(j));
    vec2 o = hash2(n + g);
    vec2 r = g + o - f;
    if (dot(mr - r, mr - r) > 0.00001) md = min(md, dot(0.5 * (mr + r), normalize(r - mr)));
  }
  return vec4(md, hash(n + mg), mr);
}

// Where a screen pixel lands on a wall that has its own scroll and camera.
// x: across the tile (0..1), y: css px down the wall
vec2 place(vec2 px, float scroll, float zoom, float roll) {
  vec2 c = uRes * 0.5;
  vec2 d = (px - c) / zoom;
  float cs = cos(roll), sn = sin(roll);
  d = vec2(cs * d.x - sn * d.y, sn * d.x + cs * d.y);
  return vec2((c.x + d.x - (uRes.x - uTile.x) * 0.5) / uTile.x, c.y + d.y + scroll);
}

// mirrored repeat, so the plaster never seams
float wallAt(float u, float worldY) {
  float wv = worldY / uTile.y;
  wv = abs(fract(wv * 0.5) * 2.0 - 1.0);
  return texture2D(uWall, vec2(u, wv)).r;
}

// x: relief shading relative to flat plaster, y: 0 at the seams between panels
vec2 reliefAt(float u, float ty, float shift) {
  float idx = floor(ty) + shift;
  float v = fract(ty);
  float cycle = floor(idx / 3.0);
  float which = idx - cycle * 3.0;
  vec2 ruv = vec2(mod(cycle, 2.0) > 0.5 ? 1.0 - u : u, v);
  float r;
  if (which < 0.5) r = texture2D(uReliefA, ruv).r;
  else if (which < 1.5) r = texture2D(uReliefB, ruv).r;
  else r = texture2D(uReliefC, ruv).r;
  return vec2(r / TONE, smoothstep(0.0, 0.09, v) * smoothstep(1.0, 0.91, v));
}

// The cloud the front is torn out of. q runs from the top-right corner in
// screen heights; "stretch" pulls the noise into fingers along the direction
// of travel.
float sweepNoise(vec2 q, float stretch) {
  vec2 dir = normalize(vec2(uRes.x / uRes.y, 1.0));
  vec2 r = vec2(dir.y * q.x - dir.x * q.y, (dir.x * q.x + dir.y * q.y) * stretch);
  float drift = uTime * 0.012;
  float a = nz(r + vec2(0.2 + drift, -0.3));
  float b = nz(r + vec2(-0.2 + 0.06 * cos(r.y * 2.2), 0.3 - drift));
  float fine = nz(r * 3.7 + vec2(0.61, 0.17));
  float finer = nz(r * 9.3 + vec2(0.13, 0.71));
  return clamp(0.5 + ((a + b) * 0.5 - 0.5) * 1.45 + (fine - 0.5) * 0.2 + (finer - 0.5) * 0.09, 0.0, 1.0);
}

// 1 where the front has passed. d: distance from the corner, a: how far the
// front has come, t: softness of the edge.
float sweepMask(float d, float noise, float a, float t, float b) {
  float shape = smoothstep(a, a - 0.6 + b, d);
  float cover = smoothstep(a, a - 0.9, d);
  return smoothstep(0.5, 0.5 + t, noise * shape + cover * 0.7);
}

void main() {
  vec2 px = vec2(vUv.x * uRes.x, (1.0 - vUv.y) * uRes.y);   // from top-left
  float m = texture2D(uMask, vUv).r;
  float tileAsp = uTile.y / uTile.x;

  // ---------------- day: plaster, reliefs rise under pressure ----------------
  vec3 day = vec3(0.910);                                   // #e8e8e8 paper
  if (uUseDay > 0.5) {
    vec2 st = place(px, uScrollD, uZoomD, 0.0);
    float ty = (st.y - uOffsetY) / uTile.y;
    float wall = wallAt(st.x, st.y);
    float lit = wall;
    if (m > 0.004 && uIntro > 0.001) {
      float grain = nz(vec2(st.x, ty * tileAsp) * 1.25);
      vec2 rl = reliefAt(st.x, ty, uShiftD);
      float rise = smoothstep(0.12, 0.6, m + (grain - 0.5) * 0.42 * smoothstep(0.0, 0.25, m));
      rise *= rl.y * step(0.0, ty);
      // relief is stored as shading relative to flat plaster; shallower relief = weaker shading
      lit = wall * mix(1.0, rl.x, rise * (0.55 + 0.45 * rise));
      // a soft contact shadow while a form is only partly risen
      lit *= 1.0 - 0.2 * rise * (1.0 - rise);
    }
    day = vec3(mix(0.910, lit * 0.965, uIntro)) * (1.0 - uDim);
  }

  // ---------------- night: black stone, light breaks through cracks ----------------
  vec3 night = vec3(0.0);
  if (uUseNight > 0.5) {
    vec2 st = place(px, uScrollN, uZoomN, uRollN);
    float ty = (st.y - uOffsetY) / uTile.y;
    vec2 nq = vec2(st.x, ty * tileAsp);
    float grain = nz(nq * 1.25);
    vec2 rl = reliefAt(st.x, ty, uShiftN);
    float stone = wallAt(st.x, st.y) * mix(1.0, rl.x, rl.y);
    float body = pow(clamp(stone, 0.0, 1.35), 3.2) * 0.115;
    // pale mineral veins
    float vein = smoothstep(0.74, 0.86, nz(nq * 2.25 + grain * 0.4 + 0.37)) * 0.035;
    vec3 warm = vec3(1.0, 0.955, 0.86);
    night = vec3(body + vein) * vec3(1.03, 1.0, 0.95);
    if (m > 0.004 && uLight > 0.5) {
      // the glow behind the wall lifts the carving near the pointer
      night += warm * body * m * m * 5.0;
      // Small slivers of stone. Neighbours that give way together read as one
      // jagged break, so the lattice is fine and skewed rather than pebble-like.
      const float S = 27.0;
      vec2 sp = nq * S;
      vec4 sh = shards(vec2(0.82 * sp.x + 0.57 * sp.y, -0.42 * sp.x + 1.1 * sp.y));
      // offset to the sliver's centre, back in screen space (inverse of the skew)
      vec2 off = vec2(1.1 * sh.z - 0.57 * sh.w, 0.42 * sh.z + 0.82 * sh.w) / 1.1414;
      vec2 centre = vUv + vec2(off.x * uTile.x / (S * uRes.x), -off.y * uTile.x / (S * uRes.y));
      // each sliver gives way as a whole, judged by the pressure at its centre
      float mc = texture2D(uMask, centre).r;
      float open = smoothstep(0.0, 0.035, mc - (0.63 + 0.5 * sh.y));
      float edge = 1.0 - smoothstep(0.0, 0.02, sh.x);
      // hairline light along fractures close to the break
      float leak = edge * smoothstep(0.5, 0.95, m) * 0.2 * (1.0 - open);
      // bloom spilling out of the break onto the stone around it
      float glow = smoothstep(0.4, 1.0, m);
      night += warm * (leak + glow * glow * 0.36 * (1.0 - open));
      night = mix(night, warm * 1.25, open);
    }
    night *= 1.0 - uBlack;
  }

  // ---------------- where they meet ----------------
  float k = uMix;
  vec3 over = night;
  if (uSweep > SWEEP_SHUT + 0.0005) {
    // The night wall arrives behind a torn front: a white-hot edge, smoke
    // thinning to black behind it, and only then the stone itself.
    vec2 q = (vUv - 1.0) * vec2(uRes.x / uRes.y, 1.0);
    float d = length(q);
    float t = uSweep;
    float pct = clamp((t - SWEEP_SHUT) / (3.2 - SWEEP_SHUT), 0.0, 1.0);
    float n = sweepNoise(q, 0.5);
    float ns = sweepNoise(q, 0.1);
    float lag = 0.10 + 0.10 * (1.0 - clamp((pct - 0.1) / 0.2, 0.0, 1.0));
    float m1 = sweepMask(d, n, t, 0.02, 0.0);
    float m2 = sweepMask(d, n, t - 0.022, 0.035, 0.0);
    float m3 = sweepMask(d, n, t - 0.06, 0.16, 0.0);
    float m4 = sweepMask(d, n, t - lag, 0.30, 0.0);
    float m5 = sweepMask(d, ns, t - lag - 0.4, 0.6, 0.2);
    m5 = mix(m5, 1.0, smoothstep(3.1, 3.2, t));
    vec3 col = vec3(0.7);
    col = mix(col, vec3(0.97), m1);
    col = mix(col, vec3(0.4), m2);
    col = mix(col, vec3(0.2), m3);
    col = mix(col, mix(night, vec3(0.03), 0.7), m4);
    col = mix(col, night, m5);
    over = col;
    // the edge throws a little light onto the wall it is about to take
    float halo = sweepMask(d, n, t + 0.04, 0.4, 0.0) * (1.0 - m1);
    day = mix(day, vec3(0.97), halo * 0.5);
    k = max(k, m1);
  }

  vec3 c = mix(day, over, k);
  // fine film grain keeps large flat areas from banding
  c += (hash(px + uTime) - 0.5) * mix(0.012, 0.02, k);
  gl_FragColor = vec4(c, 1.0);
}`;

export type PlasterAssets = { wall: string; reliefs: [string, string, string]; noise: string };

/** The front's travel: shut, the peek shown while Menu is hovered, fully open. */
export const SWEEP = { shut: 0.35, peek: 0.76, open: 3.2 } as const;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(s) || "shader compile failed");
  }
  return s;
}

function program(gl: WebGLRenderingContext, frag: string) {
  const p = gl.createProgram()!;
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, frag));
  gl.bindAttribLocation(p, 0, "aPos");
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(p) || "program link failed");
  }
  const uniforms: Record<string, WebGLUniformLocation | null> = {};
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS) as number;
  for (let i = 0; i < n; i++) {
    const info = gl.getActiveUniform(p, i)!;
    uniforms[info.name] = gl.getUniformLocation(p, info.name);
  }
  return { p, u: uniforms };
}

function loadTexture(gl: WebGLRenderingContext, url: string, repeat: boolean, onLoad: () => void) {
  const tex = gl.createTexture()!;
  const params = () => {
    const wrap = repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
  };
  gl.bindTexture(gl.TEXTURE_2D, tex);
  // 1px placeholder, usable as it stands: a picture that never arrives leaves flat plaster, not black
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, 1, 1, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, new Uint8Array([repeat ? 128 : 204]));
  params();
  const img = new Image();
  img.decoding = "async";
  img.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, gl.LUMINANCE, gl.UNSIGNED_BYTE, img);
    params();
    onLoad();
  };
  img.onerror = onLoad;
  img.src = url;
  return tex;
}

export class Plaster {
  private gl: WebGLRenderingContext;
  private sim: ReturnType<typeof program>;
  private render: ReturnType<typeof program>;
  private fbos: { fb: WebGLFramebuffer; tex: WebGLTexture }[] = [];
  private simSize = { w: 2, h: 2 };
  private texWall: WebGLTexture;
  private texRelief: WebGLTexture[];
  private texNoise: WebGLTexture;
  private raf = 0;
  private last = 0;
  private drainAcc = 0;
  private read = 0;
  private w = 1;
  private h = 1;
  private dpr = 1;
  private quality = 1;
  private slow = 0;
  private drawn = 0;
  private lastScroll = 0;
  private pointer = { x: 0.5, y: 0.5, lastMove: -1e9, has: false };
  private wanderT = Math.random() * 100;
  private lastEnergy = 0;
  private lastSig = NaN;
  private coarse: boolean;
  private pending = 5;

  /* ---- what the picture is made of: plain numbers, meant to be tweened ---- */

  /** Day wall: 0 = flat paper, 1 = plaster. */
  intro = 1;
  /** Day wall: 0..1 sinks it towards black. */
  dim = 0;
  /** Day wall camera. Keep at 1 or above. */
  zoomDay = 1;
  /** Which relief panel leads on the day wall. */
  shiftDay = 0;
  /** Scroll the day wall is drawn at; null follows the page. */
  scrollDay: number | null = null;

  /** Night wall: 0..1 fades it to black. */
  black = 0;
  /** Night wall camera. Keep at 1 or above. */
  zoomNight = 1;
  /** Night wall camera roll, radians. */
  rollNight = 0;
  shiftNight = 0;
  scrollNight: number | null = null;

  /** Plain dissolve between the walls: 0 = day, 1 = night. */
  mix = 0;
  /** The torn front that carries the night wall in: SWEEP.shut .. SWEEP.open. */
  sweep: number = SWEEP.shut;

  /** Resolves once every texture has arrived (or failed). */
  ready: Promise<void>;
  /** 0..1 as textures arrive. */
  onProgress?: (p: number) => void;
  /** Supplies the page scroll in css px each frame. */
  getScroll: () => number = () => window.scrollY;

  constructor(private canvas: HTMLCanvasElement, assets: PlasterAssets) {
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) throw new Error("WebGL unavailable");
    this.gl = gl;
    this.coarse = window.matchMedia("(pointer: coarse)").matches;

    this.sim = program(gl, SIM_FRAG);
    this.render = program(gl, RENDER_FRAG);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    let resolve!: () => void;
    this.ready = new Promise<void>((r) => (resolve = r));
    const total = this.pending;
    const one = () => {
      this.pending--;
      this.onProgress?.(1 - this.pending / total);
      this.lastEnergy = performance.now();
      if (this.pending === 0) resolve();
    };
    this.texWall = loadTexture(gl, assets.wall, false, one);
    this.texRelief = assets.reliefs.map((r) => loadTexture(gl, r, false, one));
    this.texNoise = loadTexture(gl, assets.noise, true, one);

    this.resize();
    window.addEventListener("resize", this.resize);
    window.addEventListener("pointermove", this.onPointer, { passive: true });
    window.addEventListener("pointerdown", this.onPointer, { passive: true });
    this.raf = requestAnimationFrame(this.frame);
  }

  /** Wipes all pressure from the wall (used between pages). */
  clear() {
    const gl = this.gl;
    this.fbos.forEach((f) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, f.fb);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
    });
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.lastScroll = this.getScroll();
    this.lastEnergy = performance.now();
  }

  /** Tell the wall the page has jumped, so the jump is not read as scrolling. */
  rebase() {
    this.lastScroll = this.getScroll();
  }

  private onPointer = (e: PointerEvent) => {
    this.pointer.x = e.clientX / this.w;
    this.pointer.y = e.clientY / this.h;
    this.pointer.lastMove = performance.now();
    this.pointer.has = true;
  };

  private sizeCanvas() {
    this.dpr = Math.min(window.devicePixelRatio || 1, this.w < 800 ? 2 : 1.5) * this.quality;
    this.canvas.width = Math.max(2, Math.round(this.w * this.dpr));
    this.canvas.height = Math.max(2, Math.round(this.h * this.dpr));
  }

  private resize = () => {
    const gl = this.gl;
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.sizeCanvas();

    // pressure texture: ~220px on the long side keeps edges soft and cheap
    const long = 220;
    const sw = this.w >= this.h ? long : Math.max(2, Math.round((long * this.w) / this.h));
    const sh = this.w >= this.h ? Math.max(2, Math.round((long * this.h) / this.w)) : long;
    this.simSize = { w: sw, h: sh };
    this.fbos.forEach((f) => {
      gl.deleteFramebuffer(f.fb);
      gl.deleteTexture(f.tex);
    });
    this.fbos = [0, 1].map(() => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, sw, sh, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const fb = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return { fb, tex };
    });
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.lastEnergy = performance.now();
  };

  private tile() {
    const tw = Math.max(this.w, this.h * 1.2);
    return { tw, th: (tw * 9) / 16 };
  }

  private frame = (now: number) => {
    this.raf = requestAnimationFrame(this.frame);
    const dt = Math.min(64, now - (this.last || now));
    const rawDt = now - (this.last || now);
    this.last = now;

    const scroll = this.getScroll();
    const dScroll = scroll - this.lastScroll;
    this.lastScroll = scroll;

    const night = this.mix > 0.5;
    const sweeping = this.sweep > SWEEP.shut + 0.0005;

    // ---- decide who is pressing on the wall this frame ----
    const idle = now - this.pointer.lastMove;
    const scrolling = Math.abs(dScroll) > 0.5;
    let a: [number, number, number] = [0, 0, 0];
    let b: [number, number, number] = [0, 0, 0];
    if (this.pointer.has && (idle < 140 || (scrolling && !this.coarse))) {
      a = [this.pointer.x, 1 - this.pointer.y, 1];
    }
    // An unhurried wanderer keeps the day wall alive when nobody is touching it
    // (never the night wall: there the light only answers the pointer).
    const nearTop = scroll < this.h * 0.9;
    const wander = !night && !sweeping && this.intro > 0.5 && nearTop && (this.coarse ? true : idle > 1600);
    if (wander) {
      this.wanderT += dt * 0.001;
      const t = this.wanderT;
      const wx = 0.5 + 0.36 * Math.sin(t * 0.37 + 1.3) + 0.08 * Math.sin(t * 0.91);
      const wy = 0.5 + 0.3 * Math.sin(t * 0.29 + 0.4) + 0.06 * Math.cos(t * 0.73);
      b = [wx, wy, 0.92];
    }

    // anything that changes the picture keeps it drawing
    const sig =
      this.intro + this.dim * 3 + this.zoomDay * 5 + this.shiftDay * 7 + this.black * 11 + this.zoomNight * 13 +
      this.rollNight * 17 + this.shiftNight * 19 + this.mix * 23 + this.sweep * 29 +
      (this.scrollDay ?? -1) * 0.001 + (this.scrollNight ?? -1) * 0.0013;
    const moving = sig !== this.lastSig;
    this.lastSig = sig;
    if (a[2] > 0 || b[2] > 0 || scrolling || moving || sweeping) this.lastEnergy = now;
    // nothing pressing and the mask has fully drained: stop drawing
    if (now - this.lastEnergy > 8000) return;

    // ---- keep up on slower machines: trade resolution for frame rate ----
    this.drawn++;
    if (this.drawn > 90 && rawDt < 250) {
      this.slow = rawDt > 24 ? this.slow + 1 : Math.max(0, this.slow - 0.5);
      if (this.slow > 24 && this.quality > 0.56) {
        this.quality = Math.max(0.55, this.quality - 0.15);
        this.slow = 0;
        this.drawn = 30;
        this.sizeCanvas();
      }
    }

    const gl = this.gl;
    const { w: sw, h: sh } = this.simSize;

    // drain in whole 8-bit steps so the mask reaches exactly zero
    // (light on the night wall is quicker to close up again)
    this.drainAcc += dt;
    const stepMs = night ? 12 : 21;
    const steps = Math.floor(this.drainAcc / stepMs);
    this.drainAcc -= steps * stepMs;

    const write = 1 - this.read;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbos[write].fb);
    gl.viewport(0, 0, sw, sh);
    gl.useProgram(this.sim.p);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.fbos[this.read].tex);
    gl.uniform1i(this.sim.u.uPrev, 0);
    gl.uniform2f(this.sim.u.uTexel, 1 / sw, 1 / sh);
    gl.uniform1f(this.sim.u.uScrollDelta, dScroll / this.h);
    gl.uniform1f(this.sim.u.uDrain, steps / 255);
    const asp = this.w / this.h;
    gl.uniform2f(this.sim.u.uAspect, asp >= 1 ? asp : 1, asp >= 1 ? 1 : 1 / asp);
    gl.uniform3f(this.sim.u.uStampA, a[0], a[1], a[2]);
    gl.uniform3f(this.sim.u.uStampB, b[0], b[1], b[2]);
    gl.uniform1f(this.sim.u.uRadius, this.coarse ? 0.46 : 0.4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    this.read = write;

    // ---- final image ----
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.useProgram(this.render.p);
    const u = this.render.u;
    const bind = (unit: number, tex: WebGLTexture, loc: WebGLUniformLocation | null) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(loc, unit);
    };
    bind(0, this.fbos[this.read].tex, u.uMask);
    bind(1, this.texWall, u.uWall);
    bind(2, this.texRelief[0], u.uReliefA);
    bind(3, this.texRelief[1], u.uReliefB);
    bind(4, this.texRelief[2], u.uReliefC);
    bind(5, this.texNoise, u.uNoise);
    const { tw, th } = this.tile();
    gl.uniform2f(u.uRes, this.w, this.h);
    gl.uniform2f(u.uTile, tw, th);
    gl.uniform1f(u.uOffsetY, (this.h - th) * 0.5);
    gl.uniform1f(u.uTime, (now * 0.001) % 100);

    // only the walls that can be seen are worked out
    gl.uniform1f(u.uUseDay, this.mix < 0.999 ? 1 : 0);
    gl.uniform1f(u.uUseNight, this.mix > 0.001 || sweeping ? 1 : 0);

    gl.uniform1f(u.uScrollD, this.scrollDay ?? scroll);
    gl.uniform1f(u.uShiftD, this.shiftDay);
    gl.uniform1f(u.uZoomD, Math.max(1, this.zoomDay));
    gl.uniform1f(u.uIntro, this.intro);
    gl.uniform1f(u.uDim, this.dim);

    gl.uniform1f(u.uScrollN, this.scrollNight ?? scroll);
    gl.uniform1f(u.uShiftN, this.shiftNight);
    gl.uniform1f(u.uZoomN, Math.max(1, this.zoomNight));
    gl.uniform1f(u.uRollN, this.rollNight);
    gl.uniform1f(u.uBlack, this.black);
    gl.uniform1f(u.uLight, night && !sweeping ? 1 : 0);

    gl.uniform1f(u.uMix, this.mix);
    gl.uniform1f(u.uSweep, this.sweep);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  destroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.resize);
    window.removeEventListener("pointermove", this.onPointer);
    window.removeEventListener("pointerdown", this.onPointer);
    this.gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}
