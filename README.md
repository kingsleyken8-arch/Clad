# 🎾 Ace Breaker — Tennis Brick-Breaker Campaign

An original, fully playable **tennis brick-breaker** built with **Vite + React +
TypeScript** and a hand-written **HTML5 Canvas** game engine. Inspired by the
"play-to-win" brand-game format — rebuilt from scratch with original art, sound
and code (no third-party assets or IP).

## ▶️ Play

**https://kingsleyken8-arch.github.io/Clad/**

Rebuilds automatically on every push via GitHub Actions.

## What's in it (the "full campaign")

- **Canvas game engine** (`src/game/engine.ts`) — fixed-timestep physics, ball
  ↔ paddle ↔ brick collisions, angle control off the racket, particles, screen
  shake, motion trails and a clay-court render.
- **6-round tournament campaign** (`src/game/levels.ts`) — Round 1 → Quarter /
  Semi / Final → Championship Point, with escalating speed, multi-hit bricks and
  unbreakable net posts.
- **Power-ups** — multiball, wide racket, slow-mo, lasers, sticky grip and extra
  life, all dropped from special bricks and caught with the racket.
- **Scoring & combos** — chained breaks build a score multiplier; round-clear and
  banked-lives bonuses.
- **Prize tiers** (`src/game/prizes.ts`) — Qualifier → Bronze → Silver → Gold →
  Grand Slam, unlocked by final score, revealed on the results screen.
- **Leaderboard** (`src/game/leaderboard.ts`) — top scores persisted in
  `localStorage` (shaped like a REST payload so it can be swapped for a backend),
  with name entry, rank and a Web-Share / clipboard share.
- **Synthesised SFX** (`src/game/sound.ts`) — WebAudio, no audio files.
- **Controls** — mouse, touch-drag, or keyboard (`← →`, `Space`, `P`/`Esc`).

## Project layout

```
src/
  game/
    engine.ts        # the game loop, physics & rendering
    levels.ts        # tournament round / brick layouts
    prizes.ts        # prize-tier logic
    leaderboard.ts   # localStorage scores
    sound.ts         # WebAudio SFX
    types.ts         # shared types
    ace-breaker.css  # campaign UI styling
  components/
    AceBreaker.tsx   # React orchestrator: screens, HUD, input
  App.tsx            # renders <AceBreaker/>
```

## Run it locally

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build for production

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build
```
