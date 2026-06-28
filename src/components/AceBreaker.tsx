import { useCallback, useEffect, useRef, useState } from "react";
import { GameEngine } from "../game/engine";
import { ROUNDS } from "../game/levels";
import {
  displayName,
  loadBoard,
  rankFor,
  submitScore,
  type ScoreEntry,
} from "../game/leaderboard";
import { nextTier, prizeForScore } from "../game/prizes";
import { isMuted, primeAudio, toggleMute } from "../game/sound";
import type { GameResult, HudState, PowerKind } from "../game/types";
import "../game/ace-breaker.css";

type Screen = "intro" | "howto" | "game" | "leaderboard";

interface Popup {
  id: number;
  text: string;
  kind: "score" | "power" | "combo";
}

const POWER_LABEL: Record<PowerKind, string> = {
  multiball: "MULTI",
  widen: "WIDE",
  slow: "SLOW",
  laser: "LASER",
  life: "LIFE",
  magnet: "GRIP",
};

export default function AceBreaker() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [hud, setHud] = useState<HudState | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [roundClear, setRoundClear] = useState<{ next: string | null } | null>(
    null
  );
  const [popups, setPopups] = useState<Popup[]>([]);
  const [muted, setMuted] = useState(isMuted());
  const [board, setBoard] = useState<ScoreEntry[]>(() => loadBoard());

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const popupId = useRef(0);

  const pushPopup = useCallback((text: string, kind: Popup["kind"]) => {
    const id = popupId.current++;
    setPopups((p) => [...p, { id, text, kind }]);
    setTimeout(() => setPopups((p) => p.filter((x) => x.id !== id)), 1000);
  }, []);

  // ---- engine lifecycle (only while the game screen is mounted) ----
  useEffect(() => {
    if (screen !== "game") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new GameEngine(canvas, {
      onHud: setHud,
      onRoundClear: (_i, next) => setRoundClear({ next }),
      onResult: (r) => setResult(r),
      onPopup: pushPopup,
    });
    engineRef.current = engine;
    engine.start();

    const onResize = () => engine.resize();
    window.addEventListener("resize", onResize);

    // keyboard
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") {
        engine.nudge(-1);
        e.preventDefault();
      } else if (e.key === "ArrowRight" || e.key === "d") {
        engine.nudge(1);
        e.preventDefault();
      } else if (e.key === " ") {
        primeAudio();
        engine.launch();
        e.preventDefault();
      } else if (e.key === "p" || e.key === "Escape") {
        engine.togglePause();
        setHud((h) => (h ? { ...h } : h));
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
      engine.destroy();
      engineRef.current = null;
    };
  }, [screen, pushPopup]);

  // ---- pointer / touch control ----
  const pointerMove = useCallback((e: React.PointerEvent) => {
    const engine = engineRef.current;
    const canvas = canvasRef.current;
    if (!engine || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    engine.setPaddleNorm((e.clientX - rect.left) / rect.width);
  }, []);
  const pointerDown = useCallback(
    (e: React.PointerEvent) => {
      primeAudio();
      pointerMove(e);
      engineRef.current?.launch();
    },
    [pointerMove]
  );

  const startGame = () => {
    primeAudio();
    setResult(null);
    setRoundClear(null);
    setHud(null);
    setScreen("game");
  };

  const continueRound = () => {
    setRoundClear(null);
    engineRef.current?.nextRound();
  };

  const onMute = () => {
    toggleMute();
    setMuted(isMuted());
  };

  const refreshBoard = () => setBoard(loadBoard());

  return (
    <div className="ab-root">
      <div className="ab-noise" />

      <header className="ab-bar">
        <div className="ab-brand">
          <span className="dot" />
          ACE&nbsp;BREAKER <small>TENNIS CAMPAIGN</small>
        </div>
        <div className="ab-bar-actions">
          <button className="ab-btn icon ghost" onClick={onMute} title="Sound">
            {muted ? "🔇" : "🔊"}
          </button>
          {screen === "game" && (
            <button
              className="ab-btn icon ghost"
              onClick={() => engineRef.current?.togglePause()}
              title="Pause"
            >
              ⏸
            </button>
          )}
          <button
            className="ab-btn ghost"
            onClick={() => {
              refreshBoard();
              setScreen("leaderboard");
            }}
          >
            🏆 Ranks
          </button>
        </div>
      </header>

      {/* ---------------- GAME ---------------- */}
      {screen === "game" && (
        <div className="ab-stage">
          <div className="ab-canvas-wrap">
            <canvas
              ref={canvasRef}
              onPointerMove={pointerMove}
              onPointerDown={pointerDown}
            />

            {hud && <Hud hud={hud} />}

            <div className="ab-popups">
              {popups.map((p) => (
                <span key={p.id} className={`ab-pop ${p.kind}`}>
                  {p.text}
                </span>
              ))}
            </div>

            {/* ready / launch prompt — must not block the serve click */}
            {hud?.status === "ready" && !roundClear && !result && (
              <div
                className="ab-overlay"
                style={{ background: "transparent", pointerEvents: "none" }}
              >
                <div className="ab-kicker">{hud.roundName}</div>
                <h1 style={{ fontSize: "clamp(28px,6vw,48px)" }}>
                  {ROUNDS[hud.roundIndex].subtitle}
                </h1>
                <p className="tag">Click, tap or press Space to serve.</p>
              </div>
            )}

            {hud?.status === "paused" && (
              <div className="ab-overlay">
                <div className="ab-kicker">Time-out</div>
                <h1>Paused</h1>
                <div className="row">
                  <button
                    className="ab-btn primary"
                    onClick={() => engineRef.current?.resume()}
                  >
                    Resume
                  </button>
                  <button
                    className="ab-btn ghost"
                    onClick={() => setScreen("intro")}
                  >
                    Quit
                  </button>
                </div>
              </div>
            )}

            {roundClear && (
              <div className="ab-overlay">
                <div className="ab-kicker">Game won</div>
                <h1>
                  Round <span className="pop">cleared</span>
                </h1>
                <p className="tag">
                  {roundClear.next
                    ? `Up next — ${roundClear.next}. Lives banked for bonus.`
                    : "Final point coming up."}
                </p>
                <button className="ab-btn primary" onClick={continueRound}>
                  Continue →
                </button>
              </div>
            )}

            {result && (
              <ResultScreen
                result={result}
                onSaved={(b) => setBoard(b)}
                onReplay={startGame}
                onBoard={() => {
                  refreshBoard();
                  setScreen("leaderboard");
                }}
                onHome={() => setScreen("intro")}
              />
            )}
          </div>
        </div>
      )}

      {/* ---------------- INTRO ---------------- */}
      {screen === "intro" && (
        <div className="ab-stage">
          <div className="ab-canvas-wrap">
            <div className="ab-overlay">
              <div className="ab-kicker">PLAY · SMASH · WIN</div>
              <h1>
                Ace <span className="pop">Breaker</span>
              </h1>
              <p className="tag">
                Six tournament rounds. Break every brick on Centre Court, chase
                combos and climb the bracket to win the Grand Slam tier.
              </p>
              <div className="row">
                <button className="ab-btn primary" onClick={startGame}>
                  ▶ Play campaign
                </button>
                <button
                  className="ab-btn"
                  onClick={() => setScreen("howto")}
                >
                  How to play
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- HOW TO ---------------- */}
      {screen === "howto" && (
        <div className="ab-stage">
          <div className="ab-canvas-wrap">
            <div className="ab-overlay">
              <div className="ab-kicker">Rules of the rally</div>
              <h1 style={{ fontSize: "clamp(30px,7vw,54px)" }}>How to play</h1>
              <div className="ab-how">
                <div className="item">
                  <span className="k">Move</span>
                  <span className="d">
                    Drag, move the mouse, or use <b>← →</b> to slide the racket.
                  </span>
                </div>
                <div className="item">
                  <span className="k">Serve</span>
                  <span className="d">
                    Click / tap / <b>Space</b> to launch and to fire lasers.
                  </span>
                </div>
                <div className="item">
                  <span className="k">Combo</span>
                  <span className="d">
                    Chain brick breaks for up to <b>×2+</b> score multipliers.
                  </span>
                </div>
                <div className="item">
                  <span className="k">✦</span>
                  <span className="d">
                    Catch drops: <b>multiball, wide, slow, laser, grip, life</b>.
                  </span>
                </div>
                <div className="item">
                  <span className="k">Win</span>
                  <span className="d">
                    Clear all 6 rounds. Higher scores unlock better prize tiers.
                  </span>
                </div>
              </div>
              <div className="row">
                <button className="ab-btn primary" onClick={startGame}>
                  ▶ Start
                </button>
                <button
                  className="ab-btn ghost"
                  onClick={() => setScreen("intro")}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- LEADERBOARD ---------------- */}
      {screen === "leaderboard" && (
        <div className="ab-stage">
          <div className="ab-canvas-wrap">
            <div className="ab-overlay" style={{ justifyContent: "flex-start", paddingTop: 30 }}>
              <div className="ab-kicker">The draw</div>
              <h1 style={{ fontSize: "clamp(30px,7vw,54px)" }}>Leaderboard</h1>
              <Board board={board} />
              <div className="row">
                <button className="ab-btn primary" onClick={startGame}>
                  ▶ Play
                </button>
                <button
                  className="ab-btn ghost"
                  onClick={() => setScreen("intro")}
                >
                  Home
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="ab-foot">
        An original tennis brick-breaker · built with React + Canvas
      </footer>
    </div>
  );
}

/* ----------------------------- HUD ----------------------------- */
function Hud({ hud }: { hud: HudState }) {
  return (
    <>
      <div className="ab-hud">
        <div className="chip">
          <span className="label">SCORE</span>
          <span className="score">{hud.score.toLocaleString()}</span>
        </div>
        <div className="chip" style={{ textAlign: "center" }}>
          <span className="label">MATCH</span>
          <span className="ab-round-name">{hud.roundName}</span>
        </div>
        <div className="chip" style={{ textAlign: "right" }}>
          <span className="label">LIVES</span>
          <span className="lives">{"🎾".repeat(Math.max(0, hud.lives))}</span>
        </div>
      </div>

      <div className="ab-powers">
        {(Object.keys(hud.powers) as PowerKind[]).map((k) => (
          <span className="pwr" key={k}>
            {POWER_LABEL[k]} {hud.powers[k]}s
          </span>
        ))}
      </div>

      <div className="ab-progress">
        <i style={{ width: `${Math.round(hud.progress * 100)}%` }} />
      </div>
    </>
  );
}

/* ----------------------------- RESULT ----------------------------- */
function ResultScreen({
  result,
  onSaved,
  onReplay,
  onBoard,
  onHome,
}: {
  result: GameResult;
  onSaved: (b: ScoreEntry[]) => void;
  onReplay: () => void;
  onBoard: () => void;
  onHome: () => void;
}) {
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);
  const prize = prizeForScore(result.score);
  const rank = rankFor(result.score);
  const nudge = nextTier(result.score);

  const save = () => {
    const entry: ScoreEntry = {
      name: (name.trim() || "YOU").slice(0, 10).toUpperCase(),
      score: result.score,
      round: result.roundsCleared,
      prize: prize.label,
      date: Date.now(),
    };
    onSaved(submitScore(entry));
    setSaved(true);
  };

  const share = async () => {
    const text = `I scored ${result.score.toLocaleString()} on Ace Breaker and unlocked the ${prize.label} tier (${prize.prize})! 🎾`;
    try {
      if (navigator.share) await navigator.share({ text });
      else {
        await navigator.clipboard.writeText(text);
        alert("Result copied to clipboard!");
      }
    } catch {
      /* user dismissed */
    }
  };

  return (
    <div className="ab-overlay" style={{ justifyContent: "center" }}>
      <div className="ab-kicker">{result.won ? "Champion" : "Match over"}</div>
      <h1 style={{ fontSize: "clamp(30px,8vw,60px)" }}>
        {result.won ? (
          <>
            You <span className="pop">won it</span>
          </>
        ) : (
          <>
            Game, <span className="pop">set</span>
          </>
        )}
      </h1>

      <div className="ab-prize" style={{ borderColor: prize.color }}>
        <div className="icon">{prize.icon}</div>
        <div className="tier">{prize.label.toUpperCase()} TIER</div>
        <div className="name">{prize.prize}</div>
        <div className="blurb">{prize.blurb}</div>
      </div>

      <div className="ab-stats">
        <div className="s">
          <b>{result.score.toLocaleString()}</b>
          <span>SCORE</span>
        </div>
        <div className="s">
          <b>#{rank}</b>
          <span>RANK</span>
        </div>
        <div className="s">
          <b>
            {result.roundsCleared}/{ROUNDS.length}
          </b>
          <span>ROUNDS</span>
        </div>
      </div>

      {nudge && (
        <p className="tag" style={{ marginTop: -4 }}>
          {nudge.needed.toLocaleString()} more points for the{" "}
          <b style={{ color: "var(--lime)" }}>{nudge.tier.label}</b> tier —
          {" "}{nudge.tier.prize}.
        </p>
      )}

      {!saved ? (
        <div className="ab-name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="YOUR NAME"
            maxLength={10}
            onKeyDown={(e) => e.key === "Enter" && save()}
          />
          <button className="ab-btn primary" onClick={save}>
            Save score
          </button>
        </div>
      ) : (
        <p className="tag" style={{ color: "var(--lime)" }}>
          Saved to the leaderboard at #{rank}.
        </p>
      )}

      <div className="row">
        <button className="ab-btn primary" onClick={onReplay}>
          ↻ Play again
        </button>
        <button className="ab-btn" onClick={share}>
          ↗ Share
        </button>
        <button className="ab-btn ghost" onClick={onBoard}>
          🏆 Ranks
        </button>
        <button className="ab-btn ghost" onClick={onHome}>
          Home
        </button>
      </div>
    </div>
  );
}

/* ----------------------------- BOARD ----------------------------- */
function Board({ board }: { board: ScoreEntry[] }) {
  const recent = Math.max(...board.map((e) => e.date), 0);
  return (
    <div className="ab-board">
      <div className="rowl head">
        <span>#</span>
        <span>PLAYER</span>
        <span>RD</span>
        <span>SCORE</span>
      </div>
      {board.slice(0, 12).map((e, i) => (
        <div
          className={`rowl ${e.date === recent && !e.name.startsWith("__seed__") ? "me" : ""}`}
          key={`${e.name}-${e.date}-${i}`}
        >
          <span className="rank">{i + 1}</span>
          <span className="nm">{displayName(e)}</span>
          <span className="rd">{e.round}/{ROUNDS.length}</span>
          <span className="sc">{e.score.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}
