// Client-side leaderboard. Persisted in localStorage so the campaign works as a
// fully static deploy (GitHub Pages). The shape matches a typical REST payload,
// so swapping `loadBoard`/`submitScore` for `fetch` calls to a backend later is
// a drop-in change.

export interface ScoreEntry {
  name: string;
  score: number;
  round: number; // rounds cleared
  prize: string;
  date: number; // epoch ms
}

const KEY = "ace-breaker:leaderboard";
const MAX = 25;

export function loadBoard(): ScoreEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    const list = JSON.parse(raw) as ScoreEntry[];
    if (!Array.isArray(list)) return seed();
    return list.sort((a, b) => b.score - a.score).slice(0, MAX);
  } catch {
    return seed();
  }
}

export function submitScore(entry: ScoreEntry): ScoreEntry[] {
  const list = loadBoard().filter((e) => !isSeed(e));
  list.push(entry);
  const sorted = list.sort((a, b) => b.score - a.score).slice(0, MAX);
  try {
    localStorage.setItem(KEY, JSON.stringify(sorted));
  } catch {
    /* storage may be unavailable (private mode) — game still works */
  }
  return sorted;
}

/** Rank (1-based) a score would earn, for the results screen. */
export function rankFor(score: number): number {
  const list = loadBoard().filter((e) => !isSeed(e));
  return list.filter((e) => e.score > score).length + 1;
}

// --- demo seed so the board is never empty on first play ---
const SEED_FLAG = "__seed__";
function isSeed(e: ScoreEntry) {
  return e.name.startsWith(SEED_FLAG);
}
function seed(): ScoreEntry[] {
  const names = ["RAFA", "SERENA", "NOVAK", "IGA", "CARLOS", "COCO"];
  const base = [13800, 11200, 9100, 7400, 5200, 3300];
  return names.map((n, i) => ({
    name: `${SEED_FLAG}${n}`,
    score: base[i],
    round: 6 - Math.min(i, 5),
    prize: "—",
    date: Date.now() - i * 86400000,
  }));
}

/** Strip the seed flag for display. */
export function displayName(e: ScoreEntry): string {
  return e.name.startsWith(SEED_FLAG) ? e.name.slice(SEED_FLAG.length) : e.name;
}
