import BikeShowcase from "./BikeShowcase";
import { Reveal } from "./Reveal";

export default function Compartments() {
  return (
    <div className="relative w-full bg-black">
      {/* ---- Intro ---- */}
      <div className="px-6 pt-24 pb-10 text-center sm:px-10 lg:px-16 lg:pt-32">
        <Reveal>
          <span className="font-inter text-xs uppercase tracking-[0.3em] text-red-500">
            Engineered To Conquer
          </span>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mx-auto mt-5 max-w-4xl font-podium text-[clamp(2.6rem,7vw,6rem)] uppercase leading-[0.95] tracking-tight text-white">
            Anatomy of a<br />
            Vanguard
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="mx-auto mt-6 max-w-xl font-inter text-sm leading-relaxed text-white/60 sm:text-base">
            Every component engineered to a single obsession — domination of the
            trail. Scroll to explore the machine, part by part.
          </p>
        </Reveal>
      </div>

      {/* ---- Pinned scroll showcase ---- */}
      <BikeShowcase />
    </div>
  );
}
