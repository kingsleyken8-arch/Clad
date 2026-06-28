// Tiny synthesised sound effects via the WebAudio API — no asset downloads,
// no IP. Created lazily on first user gesture so autoplay policies are happy.

let ctx: AudioContext | null = null;
let muted = false;

function ac(): AudioContext | null {
  if (muted) return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function blip(
  freq: number,
  dur: number,
  type: OscillatorType = "sine",
  gain = 0.18
) {
  const c = ac();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  osc.connect(g).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + dur);
}

export const sfx = {
  paddle: () => blip(220, 0.06, "triangle", 0.22),
  wall: () => blip(160, 0.04, "sine", 0.12),
  brick: (combo = 1) =>
    blip(360 + Math.min(combo, 12) * 40, 0.07, "square", 0.14),
  brickHard: () => blip(140, 0.08, "sawtooth", 0.12),
  power: () => {
    blip(523, 0.09, "triangle", 0.2);
    setTimeout(() => blip(784, 0.12, "triangle", 0.2), 70);
  },
  lose: () => {
    blip(200, 0.2, "sawtooth", 0.2);
    setTimeout(() => blip(120, 0.3, "sawtooth", 0.18), 120);
  },
  launch: () => blip(440, 0.08, "square", 0.16),
  clear: () => {
    [523, 659, 784, 1046].forEach((f, i) =>
      setTimeout(() => blip(f, 0.16, "triangle", 0.2), i * 90)
    );
  },
  win: () => {
    [523, 659, 784, 1046, 1318].forEach((f, i) =>
      setTimeout(() => blip(f, 0.25, "triangle", 0.22), i * 130)
    );
  },
  laser: () => blip(900, 0.05, "sawtooth", 0.1),
};

export function toggleMute(): boolean {
  muted = !muted;
  return muted;
}
export function isMuted() {
  return muted;
}
/** Call on a user gesture to unlock audio. */
export function primeAudio() {
  ac();
}
