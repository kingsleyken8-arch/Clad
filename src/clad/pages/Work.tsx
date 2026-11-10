import { useEffect, useMemo, useRef, useState } from "react";
import { PROJECTS } from "../content";
import { Media } from "../Editable";
import { refreshCursor } from "../bits";
import { Link } from "../shell";
import { useContent } from "../store";

/** Every project as a plain list. Click a category to narrow it. */
export default function Work() {
  const text = useContent().text;
  const [filter, setFilter] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  const shown = useRef(hover);
  if (hover) shown.current = hover;

  const rows = useMemo(() => [...PROJECTS].sort((a, b) => a.title.localeCompare(b.title)), []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const el = preview.current;
      if (!el) return;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      // keep clear of the names: the picture rides to the right of the list
      const x = Math.min(Math.max(e.clientX + 48, window.innerWidth * 0.69), window.innerWidth - w - 16);
      const y = Math.min(Math.max(e.clientY - h / 2, 16), window.innerHeight - h - 16);
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div className="cl-worklist">
      <h1 className="cl-sr">All projects</h1>
      <ul className="cl-worklist__rows">
        {rows.map((p) => {
          const out = filter !== null && p.type !== filter;
          return (
            <li key={p.slug} className={out ? "is-out" : ""} aria-hidden={out || undefined}>
              <button
                type="button"
                className="type"
                tabIndex={out ? -1 : 0}
                aria-pressed={filter === p.type}
                data-cursor-label={filter === p.type ? "Click to clear" : "Click to filter"}
                onClick={(e) => {
                  setFilter((f) => (f === p.type ? null : p.type));
                  const el = e.currentTarget;
                  requestAnimationFrame(() => refreshCursor(el));
                }}
              >
                {p.type}
              </button>
              <Link
                to={`/work/${p.slug}`}
                className="name"
                tabIndex={out ? -1 : 0}
                onPointerEnter={() => setHover(p.key)}
                onPointerLeave={() => setHover((h) => (h === p.key ? null : h))}
              >
                {text[`${p.key}.title`]}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className={`cl-worklist__preview ${hover ? "is-on" : ""}`} ref={preview} aria-hidden>
        {shown.current && <Media id={`${shown.current}a`} eager />}
      </div>
    </div>
  );
}
