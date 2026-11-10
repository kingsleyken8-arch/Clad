import { useEffect, useRef } from "react";
import gsap from "gsap";
import { IntroRow } from "./bits";

/** Shortest time the counter may take, so it reads as a count rather than a flash. */
const MIN_MS = 2200;

/**
 * Opening screen: the intro row on flat paper. The mark is wiped in, the
 * baseline arrives word by word and a counter follows the real load. At 100
 * the paper dissolves into the wall behind it.
 *
 * `onReveal` fires as the paper starts to lift, `onDone` once the overlay
 * can be removed.
 */
export function Preloader({
  dark,
  home,
  progress,
  onReveal,
  onDone,
}: {
  dark: boolean;
  /** On the home page the row hands over to the identical hero row beneath it. */
  home: boolean;
  progress: () => number;
  onReveal: () => void;
  onDone: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const cb = useRef({ progress, onReveal, onDone });
  cb.current = { progress, onReveal, onDone };

  useEffect(() => {
    const el = root.current!;
    const q = <T extends Element>(s: string) => el.querySelector<T>(s)!;
    const bg = q<HTMLElement>(".cl-loader__bg");
    const logo = q<HTMLElement>(".cl-logo");
    const words = el.querySelectorAll<HTMLElement>(".cl-intro__words > span");
    const count = q<HTMLElement>(".cl-count");
    const hint = q<HTMLElement>(".cl-hint");

    let raf = 0;
    let shown = 0;
    let started = 0;
    const ctx = gsap.context(() => {
      gsap.set(logo, { "--wipe": 0 });
      gsap.set([words, count, hint], { opacity: 0 });

      const leave = () => {
        cb.current.onReveal();
        const out = gsap.timeline({ onComplete: () => cb.current.onDone() });
        out.to(bg, { opacity: 0, duration: 1.2, ease: "sine.inOut" }, 0);
        out.to(count, { opacity: 0, duration: 0.5, ease: "sine.inOut" }, 0);
        if (home) {
          // the counter turns into the scroll cue, then the hero row takes over in place
          out.to(hint, { opacity: 0.6, duration: 0.8, ease: "sine.inOut" }, 0.45);
          out.to({}, { duration: 0.15 });
        } else {
          out.to(logo, { opacity: 0, duration: 0.5, ease: "sine.inOut" }, 0.7);
          out.to(words, { opacity: 0, duration: 1, ease: "sine.inOut", stagger: 0.1 }, 0.7);
        }
      };

      const tick = () => {
        const elapsed = performance.now() - started;
        const target = Math.min(cb.current.progress(), elapsed / MIN_MS) * 100;
        shown += (target - shown) * 0.1;
        if (target >= 100 && shown > 99.3) shown = 100;
        count.textContent = String(Math.round(shown));
        if (shown < 100) raf = requestAnimationFrame(tick);
        else leave();
      };

      gsap
        .timeline({
          delay: 0.6,
          onStart: () => {
            started = performance.now();
            raf = requestAnimationFrame(tick);
          },
        })
        .to(logo, { "--wipe": 1, duration: 2.5, ease: "quart.out" }, 0)
        .to(words, { opacity: 1, duration: 1, ease: "sine.inOut", stagger: 0.1 }, 0.3)
        .to(count, { opacity: 0.6, duration: 0.8, ease: "sine.inOut" }, 0.3);
    }, el);

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [home]);

  return (
    <div className={`cl-loader ${dark ? "is-dark" : ""}`} ref={root} aria-hidden>
      <div className="cl-loader__bg" />
      <div className="cl-intro">
        <IntroRow
          side={
            <span className="cl-loader__side">
              <span className="cl-count">0</span>
              <span className="cl-hint">Scroll down</span>
            </span>
          }
        />
      </div>
    </div>
  );
}
