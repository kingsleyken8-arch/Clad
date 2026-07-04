/*
 * Rounded-polygon path generator.
 *
 * Every cut card shape on the page (chamfered corners, tag notches, edge
 * bites) is described as a simple list of polygon points, each with its own
 * corner radius. This helper turns that list into an SVG path whose corners
 * are smooth quadratic arcs — so the "curvy, not straightened-out" edge
 * language of the design stays consistent everywhere, at any size.
 */

export type Pt = { x: number; y: number; r?: number };

const unit = (from: Pt, to: Pt) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: dx / len, y: dy / len };
};

export function roundedPath(pts: Pt[]): string {
  const n = pts.length;
  const segs: string[] = [];

  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const prev = pts[(i + n - 1) % n];
    const next = pts[(i + 1) % n];
    const r = p.r ?? 0;

    if (r <= 0) {
      segs.push(`${i === 0 ? "M" : "L"} ${p.x} ${p.y}`);
      continue;
    }

    // Clamp the radius so neighbouring corners never overlap.
    const rr = Math.min(
      r,
      Math.hypot(p.x - prev.x, p.y - prev.y) / 2,
      Math.hypot(p.x - next.x, p.y - next.y) / 2
    );
    const vin = unit(p, prev);
    const vout = unit(p, next);
    const a = { x: p.x + vin.x * rr, y: p.y + vin.y * rr };
    const b = { x: p.x + vout.x * rr, y: p.y + vout.y * rr };

    segs.push(
      `${i === 0 ? "M" : "L"} ${a.x.toFixed(2)} ${a.y.toFixed(2)}`,
      `Q ${p.x} ${p.y} ${b.x.toFixed(2)} ${b.y.toFixed(2)}`
    );
  }

  return segs.join(" ") + " Z";
}
