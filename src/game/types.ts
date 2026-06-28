// Shared types for the Ace Breaker game engine.

export type GameStatus =
  | "ready" // waiting to launch the ball (ball sits on racket)
  | "playing"
  | "paused"
  | "roundclear"
  | "gameover"
  | "won";

export type PowerKind =
  | "multiball"
  | "widen"
  | "slow"
  | "laser"
  | "life"
  | "magnet";

export interface BrickType {
  /** hit points required to break */
  hp: number;
  /** base score for the final breaking hit */
  score: number;
  /** hex fill */
  color: string;
  /** indestructible wall brick */
  solid?: boolean;
}

/** A single round (level) in the tournament campaign. */
export interface RoundDef {
  /** Tournament-style name, e.g. "Round 1", "Final". */
  name: string;
  subtitle: string;
  /** Ball speed multiplier for this round. */
  speed: number;
  /**
   * Brick layout. Each string is a row; each char a cell:
   *  ' ' empty, '1'..'3' brick strength, 'S' solid (unbreakable),
   *  'P' brick that always drops a power-up.
   */
  grid: string[];
}

/** Snapshot the engine pushes to the React HUD (only when values change). */
export interface HudState {
  status: GameStatus;
  score: number;
  lives: number;
  roundIndex: number;
  roundName: string;
  combo: number;
  /** active power-ups -> remaining seconds (rounded) */
  powers: Partial<Record<PowerKind, number>>;
  /** 0..1 progress of bricks cleared this round */
  progress: number;
}

export interface GameResult {
  score: number;
  won: boolean;
  roundsCleared: number;
}

export interface EngineCallbacks {
  onHud: (hud: HudState) => void;
  onRoundClear: (roundIndex: number, nextRoundName: string | null) => void;
  onResult: (result: GameResult) => void;
  /** transient floating point/combo popups for flavour */
  onPopup?: (text: string, kind: "score" | "power" | "combo") => void;
}
