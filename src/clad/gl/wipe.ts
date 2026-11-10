/*
 * Page-transition wipe.
 *
 * A transparent canvas above the page. During a transition an organic,
 * smoke-edged front spreads from the click point and fills the screen with
 * the next page's ground colour; once the page underneath has been swapped,
 * the fill fades away. Renders only while a transition is running.
 */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() { vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform float uP;       // 0..1 how far the front has travelled
uniform float uFade;    // 1 = present, 0 = gone
uniform vec2 uOrigin;   // uv, y up
uniform vec2 uAspect;
uniform vec3 uColor;
uniform float uTime;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.02 + 11.3; a *= 0.5; }
  return v;
}

void main() {
  vec2 q = vUv * uAspect;
  vec2 o = uOrigin * uAspect;
  float far = length(max(uOrigin, 1.0 - uOrigin) * uAspect);
  float d = length(q - o) / far;

  // ragged, slowly boiling edge: broad lobes, then finer and finer tearing
  float n = fbm(q * 3.2 + vec2(0.0, uTime * 0.05));
  float n2 = fbm(q * 13.0 - vec2(uTime * 0.12, 0.0));
  float n3 = fbm(q * 37.0 + vec2(uTime * 0.2, uTime * 0.07));
  float field = d + (n - 0.5) * 0.42 + (n2 - 0.5) * 0.11 + (n3 - 0.5) * 0.035;
  float front = mix(-0.3, 1.36, uP);
  float e = field - front;              // < 0 behind the front

  float cover = smoothstep(0.004, -0.004, e);
  float lit = smoothstep(0.0, 0.2, uP) * smoothstep(1.0, 0.86, uP);
  float churn = fbm(q * 9.0 + vec2(uTime * 0.35, -uTime * 0.22));
  // smoke curling ahead of the front
  float smoke = exp(-max(e, 0.0) * 20.0) * (0.3 + 0.95 * churn) * lit * (1.0 - cover);
  // the front itself burns white, and its glow reaches back into what it has covered
  float line = exp(-abs(e) * 210.0) * lit;
  float ember = exp(-max(-e, 0.0) * 46.0) * (0.25 + 0.9 * churn) * lit;

  vec3 fill = mix(uColor, vec3(1.0), clamp(ember * 0.8 + line, 0.0, 1.0));
  float a = clamp(smoke * 0.8 + line, 0.0, 1.0) * (1.0 - cover);
  // premultiplied: ground behind the front, smoke ahead of it
  vec3 rgb = fill * cover + mix(vec3(0.86), vec3(1.0), line) * a;
  float alpha = cover + a;
  gl_FragColor = vec4(rgb, alpha) * uFade;
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader");
  return s;
}

export class Wipe {
  private gl: WebGLRenderingContext;
  private u: Record<string, WebGLUniformLocation | null> = {};
  private raf = 0;
  private state = { p: 0, fade: 0, origin: [1, 1] as [number, number], color: [0, 0, 0] as [number, number, number] };

  constructor(private canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) throw new Error("WebGL unavailable");
    this.gl = gl;
    const p = gl.createProgram()!;
    gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.bindAttribLocation(p, 0, "aPos");
    gl.linkProgram(p);
    gl.useProgram(p);
    for (const name of ["uP", "uFade", "uOrigin", "uAspect", "uColor", "uTime"]) this.u[name] = gl.getUniformLocation(p, name);
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.clearColor(0, 0, 0, 0);
    this.resize();
    window.addEventListener("resize", this.resize);
  }

  private resize = () => {
    // half resolution is plenty for smoke and keeps the fill-rate low
    const s = Math.min(window.devicePixelRatio || 1, 1.25) * 0.75;
    this.canvas.width = Math.round(window.innerWidth * s);
    this.canvas.height = Math.round(window.innerHeight * s);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  };

  private draw = (now: number) => {
    const gl = this.gl;
    const { p, fade, origin, color } = this.state;
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (fade > 0.001) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      gl.uniform1f(this.u.uP, p);
      gl.uniform1f(this.u.uFade, fade);
      gl.uniform2f(this.u.uOrigin, origin[0], origin[1]);
      gl.uniform2f(this.u.uAspect, w >= h ? w / h : 1, w >= h ? 1 : h / w);
      gl.uniform3f(this.u.uColor, color[0], color[1], color[2]);
      gl.uniform1f(this.u.uTime, (now * 0.001) % 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      this.raf = requestAnimationFrame(this.draw);
    } else {
      this.raf = 0;
    }
  };

  private kick() {
    if (!this.raf) this.raf = requestAnimationFrame(this.draw);
  }

  /**
   * Sweep the front across the screen. `origin` is in client px.
   * Resolves when the screen is fully covered.
   */
  cover(origin: { x: number; y: number }, color: [number, number, number], duration = 1500): Promise<void> {
    this.state.origin = [origin.x / window.innerWidth, 1 - origin.y / window.innerHeight];
    this.state.color = color;
    this.state.fade = 1;
    this.state.p = 0;
    this.kick();
    const start = performance.now();
    return new Promise((resolve) => {
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        // sine in-out: an unhurried start and finish
        this.state.p = 0.5 - 0.5 * Math.cos(Math.PI * t);
        if (t < 1) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    });
  }

  /** Let go of the screen once the new page is in place. */
  release(duration = 700): Promise<void> {
    const start = performance.now();
    return new Promise((resolve) => {
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        this.state.fade = 1 - (0.5 - 0.5 * Math.cos(Math.PI * t));
        if (t < 1) requestAnimationFrame(step);
        else {
          this.state.fade = 0;
          resolve();
        }
      };
      requestAnimationFrame(step);
    });
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.resize);
    this.gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}
