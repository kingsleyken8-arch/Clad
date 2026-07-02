/*
 * STEM-biotech hero — pixel-dissolve composition.
 *
 * The lab photograph sits full-bleed behind a grid of cells. Light cells paint
 * the paper canvas, dark cells are transparent windows onto the photo, and any
 * light cell touching a dark one shows its minesweeper-style neighbour count.
 * The whole map is deterministic (seeded PRNG) so every load is identical.
 */

const COLS = 48;
const ROWS = 30;

// paper #e9e8e3 and number grey #96958e live in index.css (.hero-cell styles)
const INK = "#161613";

const HERO_IMG =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3A4FMCrm8jYjCnPYN9rbcZn81hc/hf_20260702_114937_465f0607-1a5f-4c8f-8d69-06c02373cd29.png";

/* ------------------------- deterministic map ------------------------- */

// mulberry32 — tiny seeded PRNG so the pixel map never changes between loads.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Per-column row where the dark (photo) mass begins — hand-tuned to the
// reference: low on the left, rising through the centre, high on the right.
// prettier-ignore
const BOUNDARY = [
  22, 22, 21, 21, 22, 22, 21, 21, 22, 22,
  23, 23, 22, 21, 20, 19, 18, 17, 16, 16,
  15, 15, 14, 15, 16, 16, 17, 16, 16, 15,
  15, 14, 14, 13, 12, 11, 10, 8, 7, 6,
  6, 6, 7, 6, 6, 7, 6, 6,
];

// Bottom-right corner returns to paper (the paragraph sits there).
function lightAgainRow(c: number) {
  if (c < 33) return ROWS + 1;
  return 29 - Math.round((c - 33) * 0.9);
}

// Explicit clusters copied from the reference composition.
const DARK_ISLANDS: Array<[number, number]> = [
  // small cluster breaking into the nav area, top centre
  [20, 0], [21, 0], [21, 1], [20, 1], [21, 2],
  // mid-left floating cells
  [19, 4], [20, 5], [19, 6],
  // stray pair mid-canvas
  [30, 10], [31, 11],
  // singles in the white field near the boundary
  [3, 17], [7, 19], [14, 16], [1, 20],
];

const LIGHT_ISLANDS: Array<[number, number]> = [
  // bottom-left pockets
  [6, 24], [8, 23], [10, 25], [12, 21], [13, 22], [7, 26],
  // bottom-centre staircase streak
  [23, 24], [24, 25], [25, 25], [24, 26], [26, 27], [22, 27],
  [25, 28], [27, 28], [23, 29], [28, 26], [30, 27], [29, 29],
  // top-right constellation inside the photo mass
  [42, 7], [43, 8], [44, 8], [41, 9], [45, 9], [43, 10],
  [46, 10], [42, 11], [44, 12], [45, 13],
  // right flank, lower
  [37, 15], [39, 17], [41, 20], [43, 21], [44, 19],
];

function buildMap(): boolean[][] {
  const rand = mulberry32(20260702);
  const dark: boolean[][] = [];

  for (let r = 0; r < ROWS; r++) {
    dark.push([]);
    for (let c = 0; c < COLS; c++) {
      let d = r >= BOUNDARY[c] && r < lightAgainRow(c);
      // staircase jitter right on the edge so the border never reads straight
      if (r === BOUNDARY[c] - 1 && rand() < 0.3) d = true;
      if (r === BOUNDARY[c] && rand() < 0.18) d = false;
      dark[r].push(d);
    }
  }

  // sprinkle: stray photo pixels floating just above the boundary…
  for (let c = 0; c < COLS; c++) {
    for (let r = Math.max(0, BOUNDARY[c] - 4); r < BOUNDARY[c] - 1; r++) {
      if (rand() < 0.05) dark[r][c] = true;
    }
    // …and paper pixels sunk just below it
    const lar = lightAgainRow(c);
    for (let r = BOUNDARY[c] + 2; r < Math.min(ROWS, BOUNDARY[c] + 6); r++) {
      if (r < lar && rand() < 0.04) dark[r][c] = false;
    }
    // jitter on the bottom-right return edge — but keep the paragraph
    // pocket (cols 36+) clean so the copy always sits on paper
    if (c < 36 && lar <= ROWS && rand() < 0.4 && lar - 1 > BOUNDARY[c]) {
      dark[Math.min(ROWS - 1, lar)][c] = true;
    }
  }

  for (const [c, r] of DARK_ISLANDS) if (dark[r]) dark[r][c] = true;
  for (const [c, r] of LIGHT_ISLANDS) if (dark[r]) dark[r][c] = false;

  return dark;
}

const MAP = buildMap();

// Displayed value: orthogonal dark-neighbour count (caps at 4, like the
// reference); cells touching dark only diagonally still read "1".
function neighbourCount(c: number, r: number): number {
  const at = (cc: number, rr: number) =>
    rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS && MAP[rr][cc] ? 1 : 0;
  const ortho = at(c - 1, r) + at(c + 1, r) + at(c, r - 1) + at(c, r + 1);
  if (ortho > 0) return ortho;
  const diag = at(c - 1, r - 1) + at(c + 1, r - 1) + at(c - 1, r + 1) + at(c + 1, r + 1);
  return diag > 0 ? 1 : 0;
}

/* ------------------------------ pieces ------------------------------ */

function PixelHeart() {
  // 1 = filled pixel; classic chunky heart mark
  const rows = [
    [0, 1, 1, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
  ];
  return (
    <svg viewBox="0 0 7 6" className="h-8 w-9" aria-hidden="true">
      {rows.flatMap((row, y) =>
        row.map((v, x) =>
          v ? <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={INK} /> : null,
        ),
      )}
    </svg>
  );
}

function PixelGrid() {
  const cells = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const isDark = MAP[r][c];
      const n = isDark ? 0 : neighbourCount(c, r);
      cells.push(
        <div
          key={`${c}-${r}`}
          className={isDark ? "hero-cell hero-cell--photo" : "hero-cell hero-cell--paper"}
        >
          {n > 0 ? <span>{n}</span> : null}
        </div>,
      );
    }
  }
  return (
    <div
      className="absolute inset-0 grid"
      style={{
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
      }}
    >
      {cells}
    </div>
  );
}

/* ------------------------------- hero ------------------------------- */

export default function BiotechHero() {
  return (
    <section
      className="relative h-screen min-h-[640px] w-full overflow-hidden font-[Helvetica_Neue,Helvetica,Arial,sans-serif]"
      style={{ backgroundColor: INK }}
    >
      {/* the generated lab photograph, revealed through the dark cells */}
      <img
        src={HERO_IMG}
        alt="Scientist in clear goggles working in a biotech lab"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <PixelGrid />

      {/* copy layer */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {/* nav */}
        <header className="flex items-start justify-between px-6 pt-7 md:px-10">
          <a href="#" className="pointer-events-auto flex items-center gap-3">
            <PixelHeart />
            <span
              className="text-[13px] font-bold leading-[1.15] tracking-tight"
              style={{ color: INK }}
            >
              Stemline
              <br />
              Biotech Labs
            </span>
          </a>
          <nav className="pointer-events-auto flex items-center gap-8 pt-2">
            {["Services", "About", "Contact"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-[12px] uppercase tracking-[0.08em] transition-opacity hover:opacity-60"
                style={{ color: INK }}
              >
                {l}
              </a>
            ))}
          </nav>
        </header>

        {/* headline */}
        <h1
          className="absolute left-6 top-[26%] text-[13vw] leading-[1.04] tracking-[-0.02em] md:left-10 md:text-[64px]"
          style={{ color: INK }}
        >
          Discovery
          <br />
          is hard.
        </h1>

        {/* supporting copy, bottom right on the paper pocket */}
        <p
          className="absolute bottom-[7%] right-6 max-w-[280px] text-[13px] leading-[1.5] md:right-10"
          style={{ color: INK }}
        >
          Helping scientists take stem-cell research from bench to bedside
          (therapies, diagnostics… who knows) and move medicine a tiny bit
          further.
        </p>
      </div>
    </section>
  );
}
