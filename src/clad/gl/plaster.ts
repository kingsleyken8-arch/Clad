/*
 * Plaster wall renderer.
 *
 * A fixed full-screen canvas draws a plaster wall that runs the length of the
 * page. Sculpted relief panels are tiled down that wall but stay flat until a
 * "pressure" mask says otherwise: the mask is a low-res texture that the
 * pointer (or an idle wanderer) stamps into, that scrolls with the page, and
 * that slowly drains — so reliefs swell out of the wall near the cursor and
 * sink back behind it.
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
uniform vec2 uRes;        // css px
uniform float uScroll;    // css px
uniform vec2 uTile;       // css px (w, h)
uniform float uOffsetY;   // css px, where tile 0 starts
uniform float uIntro;     // 0 = flat paper colour, 1 = wall
uniform float uNight;     // 0 = plaster, 1 = black stone
uniform float uShift;     // which panel sits first
uniform float uTime;

const float TONE = 0.80;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
vec2 hash2(vec2 p) {
  return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; }
  return v;
}
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

void main() {
  vec2 px = vec2(vUv.x * uRes.x, (1.0 - vUv.y) * uRes.y);   // from top-left
  float worldY = px.y + uScroll;

  // horizontal placement: tiles are centred and cover the width
  float u = (px.x - (uRes.x - uTile.x) * 0.5) / uTile.x;

  // wall: mirrored repeat so it never seams
  float wv = worldY / uTile.y;
  wv = abs(fract(wv * 0.5) * 2.0 - 1.0);
  float wall = texture2D(uWall, vec2(u, wv)).r;

  // relief tile under this pixel
  float ty = (worldY - uOffsetY) / uTile.y;
  float idx = floor(ty) + uShift;
  float v = fract(ty);
  float cycle = floor(idx / 3.0);
  float which = idx - cycle * 3.0;
  float ru = mod(cycle, 2.0) > 0.5 ? 1.0 - u : u;
  vec2 ruv = vec2(ru, v);
  float relief = which < 0.5 ? texture2D(uReliefA, ruv).r
               : which < 1.5 ? texture2D(uReliefB, ruv).r
               : texture2D(uReliefC, ruv).r;
  float shade = relief / TONE;
  // keep seams between panels flat
  float seam = smoothstep(0.0, 0.09, v) * smoothstep(1.0, 0.91, v);

  float m = texture2D(uMask, vUv).r;
  float grain = fbm(vec2(u * 5.0, ty * 5.0 * uTile.y / uTile.x));

  // ---------------- day: plaster, reliefs rise under pressure ----------------
  float rise = smoothstep(0.12, 0.6, m + (grain - 0.5) * 0.42 * smoothstep(0.0, 0.25, m));
  rise *= seam * step(0.0, ty);
  // relief is stored as shading relative to flat plaster; shallower relief = weaker shading
  float lit = wall * mix(1.0, shade, rise * (0.55 + 0.45 * rise));
  // a soft contact shadow while a form is only partly risen
  lit *= 1.0 - 0.05 * rise * (1.0 - rise) * 4.0;
  float paper = 0.910;                        // #e8e8e8
  vec3 day = vec3(mix(paper, lit * 0.965, uIntro));

  // ---------------- night: black stone, light breaks through cracks ----------------
  float stone = wall * mix(1.0, shade, seam);
  float body = pow(clamp(stone, 0.0, 1.35), 3.2) * 0.115;
  // pale mineral veins
  float vein = smoothstep(0.62, 0.72, fbm(vec2(u * 9.0, ty * 9.0 * uTile.y / uTile.x) + grain * 2.0)) * 0.035;
  vec3 warm = vec3(1.0, 0.955, 0.86);
  vec3 night = vec3(body + vein) * vec3(1.03, 1.0, 0.95);
  // the glow behind the wall lifts the carving near the pointer
  night += warm * body * m * m * 5.0;
  // Small slivers of stone. Neighbours that give way together read as one
  // jagged break, so the lattice is fine and skewed rather than pebble-like.
  const float S = 27.0;
  vec2 sp = vec2(u * S, ty * S * uTile.y / uTile.x);
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

  vec3 c = mix(day, night, uNight);
  // fine film grain keeps large flat areas from banding
  c += (hash(px + uTime) - 0.5) * mix(0.012, 0.02, uNight);
  gl_FragColor = vec4(c, 1.0);
}`;

export type PlasterAssets = { wall: string; reliefs: [string, string, string] };

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

function loadTexture(gl: WebGLRenderingContext, url: string, onLoad: () => void) {
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  // 1px mid-grey until the image arrives
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, 1, 1, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, new Uint8Array([204]));
  const img = new Image();
  img.decoding = "async";
  img.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, gl.LUMINANCE, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
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
  private raf = 0;
  private last = 0;
  private drainAcc = 0;
  private read = 0;
  private w = 1;
  private h = 1;
  private dpr = 1;
  private scroll = 0;
  private lastScroll = 0;
  private pointer = { x: 0.5, y: 0.5, lastMove: -1e9, has: false };
  private wanderT = Math.random() * 100;
  private lastEnergy = 0;
  private visible = true;
  private introValue = 0;
  private nightValue = 0;
  private shiftValue = 0;
  private coarse: boolean;
  private pending = 4;

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
    this.texWall = loadTexture(gl, assets.wall, one);
    this.texRelief = assets.reliefs.map((r) => loadTexture(gl, r, one));

    this.resize();
    window.addEventListener("resize", this.resize);
    window.addEventListener("pointermove", this.onPointer, { passive: true });
    window.addEventListener("pointerdown", this.onPointer, { passive: true });
    this.raf = requestAnimationFrame(this.frame);
  }

  /** 0 = flat paper, 1 = wall. Tween this from outside. */
  set intro(v: number) {
    this.introValue = v;
    this.lastEnergy = performance.now();
  }
  get intro() {
    return this.introValue;
  }

  /** 0 = plaster, 1 = black stone. */
  set night(v: number) {
    this.nightValue = v;
    this.lastEnergy = performance.now();
  }
  get night() {
    return this.nightValue;
  }

  /** Rotates which relief panel comes first, so pages don't all open on the same carving. */
  set shift(v: number) {
    this.shiftValue = v;
    this.lastEnergy = performance.now();
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

  setVisible(v: boolean) {
    this.visible = v;
    if (v) this.lastEnergy = performance.now();
  }

  private onPointer = (e: PointerEvent) => {
    this.pointer.x = e.clientX / this.w;
    this.pointer.y = e.clientY / this.h;
    this.pointer.lastMove = performance.now();
    this.pointer.has = true;
  };

  private resize = () => {
    const gl = this.gl;
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, this.w < 800 ? 2 : 1.5);
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);

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
    this.last = now;
    if (!this.visible) return;

    this.scroll = this.getScroll();
    const dScroll = this.scroll - this.lastScroll;
    this.lastScroll = this.scroll;

    // ---- decide who is pressing on the wall this frame ----
    const idle = now - this.pointer.lastMove;
    const scrolling = Math.abs(dScroll) > 0.5;
    let a: [number, number, number] = [0, 0, 0];
    let b: [number, number, number] = [0, 0, 0];
    if (this.pointer.has && (idle < 140 || (scrolling && !this.coarse))) {
      a = [this.pointer.x, 1 - this.pointer.y, 1];
    }
    // an unhurried wanderer keeps the wall alive when nobody is touching it
    const nearTop = this.scroll < this.h * 0.9;
    // (never on the night wall: there the light only answers the pointer)
    const wander = this.nightValue < 0.5 && nearTop && (this.coarse ? true : idle > 1600);
    if (wander) {
      this.wanderT += dt * 0.001;
      const t = this.wanderT;
      const wx = 0.5 + 0.36 * Math.sin(t * 0.37 + 1.3) + 0.08 * Math.sin(t * 0.91);
      const wy = 0.5 + 0.3 * Math.sin(t * 0.29 + 0.4) + 0.06 * Math.cos(t * 0.73);
      b = [wx, wy, 0.92];
    }
    const pressing = a[2] > 0 || b[2] > 0;
    if (pressing || scrolling) this.lastEnergy = now;
    // nothing pressing and the mask has fully drained: stop drawing
    if (now - this.lastEnergy > 8000) return;

    const gl = this.gl;
    const { w: sw, h: sh } = this.simSize;

    // drain in whole 8-bit steps so the mask reaches exactly zero
    this.drainAcc += dt;
    // (light on the night wall is quicker to close up again)
    const stepMs = this.nightValue > 0.5 ? 12 : 21;
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
    const bind = (unit: number, tex: WebGLTexture, loc: WebGLUniformLocation | null) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(loc, unit);
    };
    bind(0, this.fbos[this.read].tex, this.render.u.uMask);
    bind(1, this.texWall, this.render.u.uWall);
    bind(2, this.texRelief[0], this.render.u.uReliefA);
    bind(3, this.texRelief[1], this.render.u.uReliefB);
    bind(4, this.texRelief[2], this.render.u.uReliefC);
    const { tw, th } = this.tile();
    gl.uniform2f(this.render.u.uRes, this.w, this.h);
    gl.uniform1f(this.render.u.uScroll, this.scroll);
    gl.uniform2f(this.render.u.uTile, tw, th);
    gl.uniform1f(this.render.u.uOffsetY, (this.h - th) * 0.5);
    gl.uniform1f(this.render.u.uIntro, this.introValue);
    gl.uniform1f(this.render.u.uNight, this.nightValue);
    gl.uniform1f(this.render.u.uShift, this.shiftValue);
    gl.uniform1f(this.render.u.uTime, (now * 0.001) % 100);
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
