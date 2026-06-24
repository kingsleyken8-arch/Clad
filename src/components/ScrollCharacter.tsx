import { useEffect, useRef, useState } from "react";
import { POSES } from "../data/assets";

/**
 * The travelling tennis player.
 *
 * One fixed figure begins as the giant hero centerpiece, then — as you scroll —
 * literally moves down the page and "turns" into a new throw/catch pose each
 * time a new section reaches the middle of the viewport. Implemented as a single
 * fixed layer so it reads as the very same image from the hero continuing down.
 *
 * Hidden below `lg`: on small screens the hero renders its own inline figure and
 * the floating companion would crowd the layout.
 */

// Per-stage placement. Stage 0 (hero) is large and centred-right; later stages
// tuck the figure into a reserved right-hand lane beside the content.
const STAGES = [
  { right: "4vw", height: "84vh", maxWidth: "44vw" }, // hero — leaping
  { right: "0vw", height: "60vh", maxWidth: "27vw" }, // about — serve toss
  { right: "0vw", height: "60vh", maxWidth: "27vw" }, // training — catch
  { right: "1vw", height: "62vh", maxWidth: "27vw" }, // activity — ready
];

export default function ScrollCharacter() {
  const [stage, setStage] = useState(0);
  const [parallax, setParallax] = useState(0);
  const [faded, setFaded] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-pose-stage]")
    );
    const footer = document.querySelector<HTMLElement>("[data-character-end]");

    const update = () => {
      ticking.current = false;
      const center = window.scrollY + window.innerHeight / 2;

      // Pick the stage whose vertical band contains the viewport centre.
      let active = 0;
      let withinProgress = 0;
      for (let i = 0; i < sections.length; i++) {
        const el = sections[i];
        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;
        if (center >= top && center < bottom) {
          active = Math.min(i, STAGES.length - 1);
          withinProgress = (center - top) / el.offsetHeight; // 0..1
          break;
        }
        if (center >= bottom) active = Math.min(i, STAGES.length - 1);
      }
      setStage(active);
      // Subtle drift within a section so she keeps moving as you scroll.
      setParallax((withinProgress - 0.5) * 46);

      // Retire the companion once the closing/footer area is reached.
      if (footer) {
        const fadeStart = footer.offsetTop - window.innerHeight * 0.75;
        setFaded(window.scrollY > fadeStart);
      }
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  const cfg = STAGES[stage];

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-0 z-30 hidden lg:block"
      style={{
        right: cfg.right,
        height: cfg.height,
        width: cfg.maxWidth,
        opacity: faded ? 0 : 1,
        transform: `translateY(${faded ? 40 : parallax}px)`,
        transition:
          "right 0.9s cubic-bezier(0.22,1,0.36,1), height 0.9s cubic-bezier(0.22,1,0.36,1), width 0.9s cubic-bezier(0.22,1,0.36,1), opacity 0.6s ease, transform 0.3s linear",
      }}
    >
      <div className="animate-float relative h-full w-full">
        {POSES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className="drop-shadow-figure absolute inset-0 mx-auto h-full w-full object-contain object-bottom"
            style={{
              opacity: i === stage ? 1 : 0,
              transform: `scale(${i === stage ? 1 : 0.92}) rotate(${
                i === stage ? 0 : -3
              }deg)`,
              transition: "opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
