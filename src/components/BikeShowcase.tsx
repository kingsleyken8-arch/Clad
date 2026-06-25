import { useEffect, useRef, useState } from "react";
import { BIKE_IMAGE, BIKE_PARTS } from "../data/bikeParts";

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const STEPS = BIKE_PARTS.length;

export default function BikeShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ scale: 1, ox: 50, oy: 52 });
  // Continuous position along the steps (0 .. STEPS-1).
  const [pos, setPos] = useState(0);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const progress = clamp(-rect.top / Math.max(total, 1), 0, 1);
      const p = progress * (STEPS - 1);

      const i = clamp(Math.floor(p), 0, STEPS - 2);
      const frac = easeInOutCubic(clamp(p - i, 0, 1));
      const a = BIKE_PARTS[i];
      const b = BIKE_PARTS[i + 1];

      setView({
        scale: lerp(a.scale, b.scale, frac),
        ox: lerp(a.origin[0], b.origin[0], frac),
        oy: lerp(a.origin[1], b.origin[1], frac),
      });
      setPos(p);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="anatomy"
      className="relative bg-black"
      style={{ height: `${STEPS * 100}vh` }}
    >
      {/* Pinned stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/*
          Aspect-locked 16:9 frame, centered and sized to fit the viewport.
          Because the image exactly fills this box, transform-origin percentages
          map 1:1 to positions on the image on every screen — so "Saddle"
          really centers the saddle, "Handlebar" the handlebar, etc.
        */}
        <div className="absolute left-1/2 top-1/2 aspect-video w-full max-w-[177.78vh] -translate-x-1/2 -translate-y-1/2">
          <img
            src={BIKE_IMAGE}
            alt="The VANGUARD mountain bike"
            className="h-full w-full object-cover will-change-transform"
            style={{
              transform: `scale(${view.scale})`,
              transformOrigin: `${view.ox}% ${view.oy}%`,
              transition: "transform 250ms ease-out",
            }}
          />
        </div>

        {/* Edge vignette to anchor the text */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-black/80 to-transparent" />

        {/* Progress rail */}
        <div className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-3 sm:flex lg:right-10">
          {BIKE_PARTS.map((part, idx) => {
            const active = Math.round(pos) === idx;
            return (
              <div key={part.id} className="flex items-center gap-3">
                <span
                  className={`font-inter text-[10px] tracking-widest transition-colors duration-300 ${
                    active ? "text-white" : "text-white/30"
                  }`}
                >
                  {part.index || "00"}
                </span>
                <span
                  className={`h-px transition-all duration-300 ${
                    active ? "w-8 bg-red-500" : "w-4 bg-white/20"
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Text panels — each fades in as its step becomes active */}
        {BIKE_PARTS.map((part, idx) => {
          const dist = Math.abs(pos - idx);
          const opacity = clamp(1 - dist / 0.55, 0, 1);
          return (
            <div
              key={part.id}
              className="pointer-events-none absolute bottom-16 left-6 z-10 max-w-md sm:bottom-20 sm:left-10 lg:left-16"
              style={{
                opacity,
                transform: `translateY(${(1 - opacity) * 24}px)`,
              }}
            >
              <div className="flex items-center gap-3">
                {part.index && (
                  <span className="font-inter text-xs font-semibold tracking-[0.3em] text-red-500">
                    {part.index}
                  </span>
                )}
                <span className="h-px w-10 bg-red-500/60" />
                <span className="font-inter text-xs uppercase tracking-[0.3em] text-white/60">
                  {part.label}
                </span>
              </div>

              <h3 className="mt-4 font-podium text-[clamp(2.4rem,7vw,5rem)] uppercase leading-[0.95] tracking-tight text-white">
                {part.name}
              </h3>

              <p className="mt-4 max-w-sm font-inter text-sm leading-relaxed text-white/75 sm:text-base">
                {part.description}
              </p>

              {part.specs.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-6 sm:gap-10">
                  {part.specs.map((spec) => (
                    <div key={spec.label}>
                      <div className="font-inter text-xl font-bold tracking-tight text-white sm:text-2xl">
                        {spec.value}
                      </div>
                      <div className="mt-1 text-[9px] uppercase tracking-widest text-white/50">
                        {spec.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Scroll hint (fades out after the first step) */}
        <div
          className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 sm:hidden"
          style={{ opacity: clamp(1 - pos, 0, 1) }}
        >
          <span className="font-inter text-[10px] uppercase tracking-[0.3em] text-white/50">
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
}
