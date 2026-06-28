import type { BrickType, RoundDef } from "./types";

// Brick strength tiers. Colors evoke a clay-court Grand Slam palette:
// terracotta clay, tournament green, and a chartreuse tennis-ball pop.
export const BRICK_TYPES: Record<string, BrickType> = {
  "1": { hp: 1, score: 100, color: "#e8643c" }, // clay
  "2": { hp: 2, score: 175, color: "#1f9d6b" }, // court green
  "3": { hp: 3, score: 250, color: "#3b6fb0" }, // deco blue
  P: { hp: 1, score: 150, color: "#d8f24a" }, // power brick (tennis-ball lime)
  S: { hp: Infinity, score: 0, color: "#3a3f47", solid: true }, // net post
};

/**
 * The campaign: a Roland-Garros-style run from the opening round to the
 * Championship Point. Layouts get denser, faster and more fortified.
 * Grids are 13 columns wide (matched in the engine).
 */
export const ROUNDS: RoundDef[] = [
  {
    name: "Round 1",
    subtitle: "Opening serve",
    speed: 1.0,
    grid: [
      "             ",
      "  1111111111 ",
      "  1111111111 ",
      "  11P1111P11 ",
      "             ",
    ],
  },
  {
    name: "Round 2",
    subtitle: "Finding rhythm",
    speed: 1.08,
    grid: [
      " 2222222222  ",
      " 21111111112 ",
      " 211P111P112 ",
      " 21111111112 ",
      " 2222222222  ",
    ],
  },
  {
    name: "Quarter-Final",
    subtitle: "The net tightens",
    speed: 1.16,
    grid: [
      "  S       S  ",
      "  2222222222 ",
      "  21P2222P12 ",
      "  2222222222 ",
      "  S 11111 S  ",
      "    1P1P1    ",
    ],
  },
  {
    name: "Semi-Final",
    subtitle: "Break point",
    speed: 1.24,
    grid: [
      " 33       33 ",
      " 322222222 3 ",
      " 32 1111 23  ",
      " 32 1PP1 23  ",
      " 32 1111 23  ",
      " 322222222 3 ",
      " 33  PP   33 ",
    ],
  },
  {
    name: "Final",
    subtitle: "Centre court",
    speed: 1.32,
    grid: [
      " S3333333333S",
      " 3222222222 3",
      " 32S111111S 3",
      " 321P3333P12 ",
      " 32S111111S 3",
      " 3222222222 3",
      " S3 PPPPPP 3S",
    ],
  },
  {
    name: "Championship Point",
    subtitle: "Lift the trophy",
    speed: 1.42,
    grid: [
      "S3 3 3 3 3 3S",
      " 33333333333 ",
      " 32222222223 ",
      " 32S1PP1S23  ",
      " 32 13331 23 ",
      " 32S1PP1S23  ",
      " 32222222223 ",
      " 33333333333 ",
    ],
  },
];

export const GRID_COLS = 13;
