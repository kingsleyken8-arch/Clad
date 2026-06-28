import { BRICK_TYPES, GRID_COLS, ROUNDS } from "./levels";
import { sfx } from "./sound";
import type {
  EngineCallbacks,
  GameStatus,
  HudState,
  PowerKind,
} from "./types";

// Logical playfield resolution. The canvas is scaled to fit its container while
// drawing happens in these stable coordinates (with devicePixelRatio applied).
const W = 780;
const H = 600;

const PADDLE_W = 120;
const PADDLE_H = 16;
const PADDLE_Y = H - 46;
const BALL_R = 8;
const BASE_SPEED = 360; // px/s
const MAX_SPEED = 720;

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  stuck: boolean; // resting on the racket before launch
}
interface Brick {
  x: number;
  y: number;
  w: number;
  h: number;
  hp: number;
  maxHp: number;
  score: number;
  color: string;
  solid: boolean;
  power: boolean;
  alive: boolean;
}
interface Power {
  x: number;
  y: number;
  kind: PowerKind;
  vy: number;
}
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  color: string;
  size: number;
}
interface Laser {
  x: number;
  y: number;
}

const POWER_META: Record<
  PowerKind,
  { color: string; glyph: string; duration: number }
> = {
  multiball: { color: "#d8f24a", glyph: "✦", duration: 0 },
  widen: { color: "#1f9d6b", glyph: "↔", duration: 12 },
  slow: { color: "#3b6fb0", glyph: "≈", duration: 8 },
  laser: { color: "#e8643c", glyph: "↑", duration: 10 },
  life: { color: "#ff5d73", glyph: "♥", duration: 0 },
  magnet: { color: "#b07bd8", glyph: "◗", duration: 12 },
};

export class GameEngine {
  private ctx: CanvasRenderingContext2D;
  private raf = 0;
  private last = 0;
  private acc = 0;
  private readonly step = 1 / 120; // physics sub-step

  private status: GameStatus = "ready";
  private score = 0;
  private lives = 3;
  private roundIndex = 0;
  private combo = 0;
  private comboTimer = 0;

  private balls: Ball[] = [];
  private bricks: Brick[] = [];
  private powers: Power[] = [];
  private particles: Particle[] = [];
  private lasers: Laser[] = [];

  private paddleX = W / 2;
  private targetPaddleX = W / 2;
  private paddleW = PADDLE_W;

  private activePowers: Partial<Record<PowerKind, number>> = {};
  private laserCooldown = 0;
  private shake = 0;
  private shakeT = 0;
  private bgPhase = 0;

  private lastHud = "";

  constructor(
    private canvas: HTMLCanvasElement,
    private cb: EngineCallbacks
  ) {
    const c = canvas.getContext("2d");
    if (!c) throw new Error("2D canvas unavailable");
    this.ctx = c;
    this.resize();
    this.loadRound(0);
  }

  // ---- public API --------------------------------------------------------
  start() {
    if (this.raf) return;
    this.last = performance.now();
    this.loop(this.last);
  }
  destroy() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }
  pause() {
    if (this.status === "playing" || this.status === "ready") {
      this.prevStatus = this.status;
      this.status = "paused";
      this.pushHud(true);
    }
  }
  private prevStatus: GameStatus = "ready";
  resume() {
    if (this.status === "paused") {
      this.status = this.prevStatus;
      this.last = performance.now();
      this.pushHud(true);
    }
  }
  togglePause() {
    this.status === "paused" ? this.resume() : this.pause();
  }

  /** Move racket to a normalised x (0..1 across the playfield). */
  setPaddleNorm(n: number) {
    this.targetPaddleX = Math.max(0, Math.min(1, n)) * W;
  }
  nudge(dir: -1 | 1) {
    this.targetPaddleX = Math.max(
      0,
      Math.min(W, this.targetPaddleX + dir * 60)
    );
  }
  launch() {
    if (this.status === "paused") return;
    if (this.status === "ready") {
      this.status = "playing";
      sfx.launch();
    }
    for (const b of this.balls) {
      if (b.stuck) {
        b.stuck = false;
        const speed = BASE_SPEED * ROUNDS[this.roundIndex].speed;
        const angle = -Math.PI / 2 + (Math.random() * 0.4 - 0.2);
        b.vx = Math.cos(angle) * speed;
        b.vy = Math.sin(angle) * speed;
      }
    }
    // laser fire
    if (this.activePowers.laser && this.laserCooldown <= 0) {
      this.lasers.push({ x: this.paddleX, y: PADDLE_Y });
      this.laserCooldown = 0.25;
      sfx.laser();
    }
  }

  getStatus() {
    return this.status;
  }

  // ---- round setup -------------------------------------------------------
  private loadRound(i: number) {
    this.roundIndex = i;
    const round = ROUNDS[i];
    this.bricks = [];
    const cols = GRID_COLS;
    const marginX = 40;
    const top = 70;
    const bw = (W - marginX * 2) / cols;
    const bh = 26;
    round.grid.forEach((row, r) => {
      for (let cIdx = 0; cIdx < cols; cIdx++) {
        const ch = row[cIdx];
        if (!ch || ch === " ") continue;
        const t = BRICK_TYPES[ch];
        if (!t) continue;
        this.bricks.push({
          x: marginX + cIdx * bw + 2,
          y: top + r * (bh + 6),
          w: bw - 4,
          h: bh,
          hp: t.hp,
          maxHp: t.hp === Infinity ? 1 : t.hp,
          score: t.score,
          color: t.color,
          solid: !!t.solid,
          power: ch === "P",
          alive: true,
        });
      }
    });
    this.resetBall();
    this.powers = [];
    this.lasers = [];
    this.activePowers = {};
    this.paddleW = PADDLE_W;
    this.status = "ready";
    this.pushHud(true);
  }

  private resetBall() {
    this.balls = [
      { x: this.paddleX, y: PADDLE_Y - BALL_R - 2, vx: 0, vy: 0, stuck: true },
    ];
  }

  // ---- main loop ---------------------------------------------------------
  private loop = (t: number) => {
    this.raf = requestAnimationFrame(this.loop);
    let dt = (t - this.last) / 1000;
    this.last = t;
    if (dt > 0.05) dt = 0.05; // clamp after tab-switch
    this.bgPhase += dt;

    if (this.status === "playing") {
      this.acc += dt;
      while (this.acc >= this.step) {
        this.update(this.step);
        this.acc -= this.step;
      }
    }
    this.updateCosmetic(dt);
    this.render();
    this.pushHud(false);
  };

  // cosmetic-only updates run even when not actively playing
  private updateCosmetic(dt: number) {
    if (this.shakeT > 0) {
      this.shakeT -= dt;
      if (this.shakeT <= 0) this.shake = 0;
    }
    for (const p of this.particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 600 * dt;
      p.life -= dt;
    }
    this.particles = this.particles.filter((p) => p.life > 0);
    // smooth racket follow
    const ease = 1 - Math.pow(0.0008, dt);
    this.paddleX += (this.targetPaddleX - this.paddleX) * ease;
  }

  private update(dt: number) {
    // power timers
    for (const k of Object.keys(this.activePowers) as PowerKind[]) {
      const v = this.activePowers[k];
      if (v === undefined) continue;
      const nv = v - dt;
      if (nv <= 0) {
        delete this.activePowers[k];
        if (k === "widen") this.paddleW = PADDLE_W;
      } else this.activePowers[k] = nv;
    }
    if (this.laserCooldown > 0) this.laserCooldown -= dt;
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) this.combo = 0;
    }

    const speedScale = this.activePowers.slow ? 0.6 : 1;

    // balls
    for (const b of this.balls) {
      if (b.stuck) {
        b.x = this.paddleX;
        b.y = PADDLE_Y - BALL_R - 2;
        continue;
      }
      b.x += b.vx * dt * speedScale;
      b.y += b.vy * dt * speedScale;

      // walls
      if (b.x - BALL_R < 0) {
        b.x = BALL_R;
        b.vx = Math.abs(b.vx);
        sfx.wall();
      } else if (b.x + BALL_R > W) {
        b.x = W - BALL_R;
        b.vx = -Math.abs(b.vx);
        sfx.wall();
      }
      if (b.y - BALL_R < 0) {
        b.y = BALL_R;
        b.vy = Math.abs(b.vy);
        sfx.wall();
      }

      // paddle
      if (
        b.vy > 0 &&
        b.y + BALL_R >= PADDLE_Y &&
        b.y - BALL_R <= PADDLE_Y + PADDLE_H &&
        b.x >= this.paddleX - this.paddleW / 2 - BALL_R &&
        b.x <= this.paddleX + this.paddleW / 2 + BALL_R
      ) {
        this.bouncePaddle(b);
      }

      // bricks
      this.collideBricks(b);
    }

    // remove fallen balls
    const before = this.balls.length;
    this.balls = this.balls.filter((b) => b.y - BALL_R < H);
    if (this.balls.length === 0 && before > 0) this.loseLife();

    // power-ups falling
    for (const p of this.powers) p.y += p.vy * dt;
    this.powers = this.powers.filter((p) => {
      if (
        p.y >= PADDLE_Y - 6 &&
        p.y <= PADDLE_Y + PADDLE_H + 10 &&
        p.x >= this.paddleX - this.paddleW / 2 &&
        p.x <= this.paddleX + this.paddleW / 2
      ) {
        this.applyPower(p.kind);
        return false;
      }
      return p.y < H + 20;
    });

    // lasers
    for (const l of this.lasers) l.y -= 700 * dt;
    this.lasers = this.lasers.filter((l) => {
      if (l.y < -10) return false;
      for (const br of this.bricks) {
        if (
          br.alive &&
          !br.solid &&
          l.x >= br.x &&
          l.x <= br.x + br.w &&
          l.y <= br.y + br.h &&
          l.y >= br.y
        ) {
          this.hitBrick(br, l.x, l.y);
          return false;
        }
      }
      return true;
    });

    if (this.bricks.every((b) => b.solid || !b.alive)) this.clearRound();
  }

  private bouncePaddle(b: Ball) {
    const rel = (b.x - this.paddleX) / (this.paddleW / 2); // -1..1
    const speed = Math.min(
      MAX_SPEED,
      Math.hypot(b.vx, b.vy) * 1.012 // slight ramp each rally
    );
    const angle = (-Math.PI / 2) + rel * (Math.PI / 3); // up to ±60°
    b.vx = Math.cos(angle) * speed;
    b.vy = Math.sin(angle) * speed;
    b.y = PADDLE_Y - BALL_R - 1;
    if (this.activePowers.magnet) b.stuck = true;
    sfx.paddle();
  }

  private collideBricks(b: Ball) {
    for (const br of this.bricks) {
      if (!br.alive) continue;
      if (
        b.x + BALL_R < br.x ||
        b.x - BALL_R > br.x + br.w ||
        b.y + BALL_R < br.y ||
        b.y - BALL_R > br.y + br.h
      )
        continue;
      // resolve along the smallest overlap axis
      const overlapL = b.x + BALL_R - br.x;
      const overlapR = br.x + br.w - (b.x - BALL_R);
      const overlapT = b.y + BALL_R - br.y;
      const overlapB = br.y + br.h - (b.y - BALL_R);
      const minX = Math.min(overlapL, overlapR);
      const minY = Math.min(overlapT, overlapB);
      if (minX < minY) {
        b.vx = overlapL < overlapR ? -Math.abs(b.vx) : Math.abs(b.vx);
      } else {
        b.vy = overlapT < overlapB ? -Math.abs(b.vy) : Math.abs(b.vy);
      }
      this.hitBrick(br, b.x, b.y);
      break; // one brick per sub-step keeps things stable
    }
  }

  private hitBrick(br: Brick, hx: number, hy: number) {
    if (br.solid) {
      sfx.wall();
      this.spawnParticles(hx, hy, "#5a616b", 4);
      return;
    }
    br.hp -= 1;
    if (br.hp > 0) {
      sfx.brickHard();
      this.spawnParticles(hx, hy, br.color, 4);
      this.shakeFx(2);
      return;
    }
    // broken
    br.alive = false;
    this.combo += 1;
    this.comboTimer = 1.6;
    const mult = 1 + Math.floor(this.combo / 4) * 0.5; // x1, x1.5, x2 ...
    const gained = Math.round(br.score * mult);
    this.score += gained;
    sfx.brick(this.combo);
    this.spawnParticles(br.x + br.w / 2, br.y + br.h / 2, br.color, 12);
    this.shakeFx(4);
    if (this.combo >= 4 && this.combo % 4 === 0) {
      this.cb.onPopup?.(`COMBO ×${mult}`, "combo");
    }
    if (br.power) this.dropPower(br.x + br.w / 2, br.y + br.h / 2);
  }

  private dropPower(x: number, y: number) {
    const pool: PowerKind[] = [
      "multiball",
      "widen",
      "slow",
      "laser",
      "magnet",
      "life",
    ];
    // weight 'life' lower
    const kind =
      Math.random() < 0.12
        ? "life"
        : pool[Math.floor(Math.random() * (pool.length - 1))];
    this.powers.push({ x, y, kind, vy: 130 });
  }

  private applyPower(kind: PowerKind) {
    sfx.power();
    const meta = POWER_META[kind];
    this.cb.onPopup?.(`${meta.glyph} ${kind.toUpperCase()}`, "power");
    switch (kind) {
      case "multiball": {
        const src = this.balls.find((b) => !b.stuck) ?? this.balls[0];
        if (src) {
          for (let i = 0; i < 2; i++) {
            const sp = Math.hypot(src.vx, src.vy) || BASE_SPEED;
            const ang = -Math.PI / 2 + (i === 0 ? -0.5 : 0.5);
            this.balls.push({
              x: src.x,
              y: src.y,
              vx: Math.cos(ang) * sp,
              vy: Math.sin(ang) * sp,
              stuck: false,
            });
          }
        }
        break;
      }
      case "widen":
        this.paddleW = Math.min(220, PADDLE_W * 1.6);
        this.activePowers.widen = meta.duration;
        break;
      case "slow":
        this.activePowers.slow = meta.duration;
        break;
      case "laser":
        this.activePowers.laser = meta.duration;
        break;
      case "magnet":
        this.activePowers.magnet = meta.duration;
        break;
      case "life":
        this.lives += 1;
        break;
    }
  }

  private loseLife() {
    this.lives -= 1;
    this.combo = 0;
    sfx.lose();
    this.shakeFx(10);
    // dropped power-ups are forfeited
    this.powers = [];
    if (this.lives <= 0) {
      this.status = "gameover";
      this.pushHud(true);
      this.cb.onResult({
        score: this.score,
        won: false,
        roundsCleared: this.roundIndex,
      });
      return;
    }
    this.resetBall();
    this.activePowers = {};
    this.paddleW = PADDLE_W;
    this.status = "ready";
    this.pushHud(true);
  }

  private clearRound() {
    const last = this.roundIndex >= ROUNDS.length - 1;
    // round bonus: leftover lives reward
    this.score += 500 + this.lives * 250;
    if (last) {
      this.status = "won";
      sfx.win();
      this.pushHud(true);
      this.cb.onResult({
        score: this.score,
        won: true,
        roundsCleared: ROUNDS.length,
      });
    } else {
      this.status = "roundclear";
      sfx.clear();
      this.pushHud(true);
      this.cb.onRoundClear(this.roundIndex, ROUNDS[this.roundIndex + 1].name);
    }
  }

  /** Advance to the next round (called by UI after the round-clear banner). */
  nextRound() {
    if (this.roundIndex < ROUNDS.length - 1) this.loadRound(this.roundIndex + 1);
  }

  // ---- fx ----------------------------------------------------------------
  private spawnParticles(x: number, y: number, color: string, n: number) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 60 + Math.random() * 180;
      this.particles.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 60,
        life: 0.5 + Math.random() * 0.4,
        max: 0.9,
        color,
        size: 2 + Math.random() * 3,
      });
    }
  }
  private shakeFx(amount: number) {
    this.shake = Math.max(this.shake, amount);
    this.shakeT = 0.18;
  }

  // ---- HUD bridge --------------------------------------------------------
  private buildHud(): HudState {
    const round = ROUNDS[this.roundIndex];
    const breakable = this.bricks.filter((b) => !b.solid);
    const dead = breakable.filter((b) => !b.alive).length;
    const powers: Partial<Record<PowerKind, number>> = {};
    for (const k of Object.keys(this.activePowers) as PowerKind[]) {
      powers[k] = Math.ceil(this.activePowers[k] ?? 0);
    }
    return {
      status: this.status,
      score: this.score,
      lives: this.lives,
      roundIndex: this.roundIndex,
      roundName: round.name,
      combo: this.combo,
      powers,
      progress: breakable.length ? dead / breakable.length : 1,
    };
  }
  private pushHud(force: boolean) {
    const hud = this.buildHud();
    const sig = JSON.stringify(hud);
    if (!force && sig === this.lastHud) return;
    this.lastHud = sig;
    this.cb.onHud(hud);
  }

  // ---- rendering ---------------------------------------------------------
  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = W * dpr;
    this.canvas.height = H * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  private render() {
    const ctx = this.ctx;
    ctx.save();
    if (this.shake > 0) {
      ctx.translate(
        (Math.random() - 0.5) * this.shake,
        (Math.random() - 0.5) * this.shake
      );
    }
    this.drawCourt(ctx);
    this.drawBricks(ctx);
    this.drawPowers(ctx);
    this.drawLasers(ctx);
    this.drawPaddle(ctx);
    this.drawBalls(ctx);
    this.drawParticles(ctx);
    ctx.restore();
  }

  private drawCourt(ctx: CanvasRenderingContext2D) {
    // clay gradient
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#c2502f");
    g.addColorStop(1, "#9c3f25");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    // subtle moving court texture lines
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
      const y = ((i * 60 + this.bgPhase * 18) % (H + 60)) - 30;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    // court boundary + service line
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 3;
    ctx.strokeRect(16, 16, W - 32, H - 32);
    ctx.beginPath();
    ctx.moveTo(W / 2, 16);
    ctx.lineTo(W / 2, H - 32);
    ctx.stroke();
  }

  private drawBricks(ctx: CanvasRenderingContext2D) {
    for (const br of this.bricks) {
      if (!br.alive) continue;
      const dmg = br.solid ? 1 : br.hp / br.maxHp;
      ctx.save();
      ctx.fillStyle = br.color;
      ctx.globalAlpha = br.solid ? 1 : 0.55 + dmg * 0.45;
      this.roundRect(ctx, br.x, br.y, br.w, br.h, 5);
      ctx.fill();
      // top sheen
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = "#ffffff";
      this.roundRect(ctx, br.x, br.y, br.w, br.h * 0.4, 5);
      ctx.fill();
      ctx.restore();
      if (br.power) {
        ctx.fillStyle = "#1d2530";
        ctx.font = "bold 14px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("✦", br.x + br.w / 2, br.y + br.h / 2 + 1);
      }
    }
  }

  private drawPaddle(ctx: CanvasRenderingContext2D) {
    const x = this.paddleX - this.paddleW / 2;
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.4)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    const g = ctx.createLinearGradient(0, PADDLE_Y, 0, PADDLE_Y + PADDLE_H);
    g.addColorStop(0, "#f4f7fb");
    g.addColorStop(1, "#c4ccd6");
    ctx.fillStyle = g;
    this.roundRect(ctx, x, PADDLE_Y, this.paddleW, PADDLE_H, 8);
    ctx.fill();
    // racket string hint
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(40,46,54,0.25)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 6; i++) {
      const sx = x + (this.paddleW / 6) * i;
      ctx.beginPath();
      ctx.moveTo(sx, PADDLE_Y + 2);
      ctx.lineTo(sx, PADDLE_Y + PADDLE_H - 2);
      ctx.stroke();
    }
    if (this.activePowers.laser) {
      ctx.fillStyle = "#e8643c";
      ctx.fillRect(x + 4, PADDLE_Y - 4, 4, 4);
      ctx.fillRect(x + this.paddleW - 8, PADDLE_Y - 4, 4, 4);
    }
    ctx.restore();
  }

  private drawBalls(ctx: CanvasRenderingContext2D) {
    for (const b of this.balls) {
      // trail
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = "#d8f24a";
      ctx.beginPath();
      ctx.arc(b.x - b.vx * 0.012, b.y - b.vy * 0.012, BALL_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      // ball
      const g = ctx.createRadialGradient(
        b.x - 3,
        b.y - 3,
        1,
        b.x,
        b.y,
        BALL_R
      );
      g.addColorStop(0, "#f4ff9e");
      g.addColorStop(1, "#cfe53f");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(b.x, b.y, BALL_R, 0, Math.PI * 2);
      ctx.fill();
      // seam
      ctx.strokeStyle = "rgba(255,255,255,0.8)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(b.x - 2, b.y, BALL_R + 1, -0.6, 0.9);
      ctx.stroke();
    }
  }

  private drawPowers(ctx: CanvasRenderingContext2D) {
    for (const p of this.powers) {
      const meta = POWER_META[p.kind];
      ctx.save();
      ctx.fillStyle = meta.color;
      ctx.shadowColor = meta.color;
      ctx.shadowBlur = 12;
      this.roundRect(ctx, p.x - 13, p.y - 10, 26, 20, 6);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#16202b";
      ctx.font = "bold 13px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(meta.glyph, p.x, p.y + 1);
      ctx.restore();
    }
  }

  private drawLasers(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#ffce5d";
    for (const l of this.lasers) ctx.fillRect(l.x - 2, l.y - 12, 4, 12);
  }

  private drawParticles(ctx: CanvasRenderingContext2D) {
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.max);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  static get width() {
    return W;
  }
  static get height() {
    return H;
  }
}
