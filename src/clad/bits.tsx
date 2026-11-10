import { CSSProperties, ElementType, forwardRef, ReactNode, useEffect, useRef } from "react";
import { textEditProps } from "./Editable";
import { useContent } from "./store";

/** The studio mark: a plaster niche, one arch set inside another. */
export function Mark() {
  return (
    <svg viewBox="0 0 20 27" fill="none" stroke="currentColor" strokeWidth="1.15" aria-hidden>
      <path d="M1 26.4V10a9 9 0 0 1 18 0v16.4z" />
      <path d="M5.4 26.4V10.2a4.6 4.6 0 0 1 9.2 0v16.2" />
    </svg>
  );
}

export function Logo() {
  const { brand } = useContent().text;
  return (
    <span className="cl-logo">
      <Mark />
      <span className="cl-logo__name" {...textEditProps("brand")}>
        {brand}
      </span>
    </span>
  );
}

/**
 * Text that arrives word by word. Pass `id` to bind it to an editable text
 * slot, or `text` for fixed copy.
 */
export function Words({
  id,
  text,
  as: Tag = "p",
  className,
}: {
  id?: string;
  text?: string;
  as?: ElementType;
  className?: string;
}) {
  const stored = useContent().text;
  const value = (id ? stored[id] : text) ?? "";
  let n = 0;
  return (
    <Tag className={className} data-reveal="words" {...(id ? textEditProps(id) : {})}>
      {value.split(/(\s+)/).map((part, i) =>
        /^\s+$/.test(part) ? (
          part.includes("\n") ? <br key={i} /> : " "
        ) : part ? (
          <span key={i} className="cl-w" style={{ "--i": n++ } as CSSProperties}>
            {part}
          </span>
        ) : null,
      )}
    </Tag>
  );
}

/** Logo | baseline | side note — the row shared by the preloader and the home hero. */
export const IntroRow = forwardRef<HTMLDivElement, { side: ReactNode }>(function IntroRow({ side }, ref) {
  const { baseline } = useContent().text;
  const words = baseline.trim().split(/\s+/);
  return (
    <div className="cl-grid" ref={ref}>
      <div className="cl-intro__logo">
        <Logo />
      </div>
      <div className="cl-intro__base">
        <div className="cl-intro__words" {...textEditProps("baseline")}>
          {words.map((w, i) => (
            <span key={i}>{i < words.length - 1 ? `${w} ` : w}</span>
          ))}
        </div>
      </div>
      <div className="cl-intro__side">{side}</div>
    </div>
  );
});

/** Small dot that trails the pointer and names what it is over. */
export function Cursor() {
  const el = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = el.current!;
    let x = -100;
    let y = -100;
    let tx = x;
    let ty = y;
    let raf = 0;
    let seen = false;

    const loop = () => {
      x += (tx - x) * 0.28;
      y += (ty - y) * 0.28;
      node.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.05 ? requestAnimationFrame(loop) : 0;
    };

    const read = (target: EventTarget | null) => {
      const t = target instanceof Element ? target : null;
      const named = t?.closest<HTMLElement>("[data-cursor-label]");
      const link = t?.closest("a, button, [role='button'], input, textarea");
      const text = named?.dataset.cursorLabel ?? "";
      if (text) label.current!.textContent = text;
      node.classList.toggle("has-label", !!text);
      node.classList.toggle("is-link", !!link);
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      tx = e.clientX;
      ty = e.clientY;
      if (!seen) {
        seen = true;
        x = tx;
        y = ty;
        node.classList.add("is-on");
      }
      read(e.target);
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const leave = () => node.classList.remove("is-on");
    const enter = () => seen && node.classList.add("is-on");
    // labels can change under a still pointer (e.g. "Copied")
    const refresh = (e: Event) => read((e as CustomEvent<Element>).detail ?? null);

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);
    window.addEventListener("cl:cursor", refresh);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
      window.removeEventListener("cl:cursor", refresh);
    };
  }, []);

  return (
    <div className="cl-cursor" ref={el} aria-hidden>
      <span className="cl-cursor__dot" />
      <span className="cl-cursor__label" ref={label} />
    </div>
  );
}

/** Ask the cursor to re-read the label of the element it is resting on. */
export const refreshCursor = (el: Element | null) =>
  window.dispatchEvent(new CustomEvent("cl:cursor", { detail: el }));
