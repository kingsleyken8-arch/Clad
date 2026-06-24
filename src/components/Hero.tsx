import { ArrowLeft, ArrowRight } from "lucide-react";
import Nav from "./Nav";
import { POSES } from "../data/assets";

/** Fullscreen sky hero. The desktop figure is the fixed <ScrollCharacter>; a
 *  static inline figure is shown on mobile where the floating one is hidden. */
export default function Hero() {
  return (
    <section
      id="home"
      data-pose-stage="hero"
      className="sky-gradient relative flex min-h-screen w-full flex-col overflow-hidden"
    >
      {/* Drifting clouds */}
      <Cloud className="animate-cloud-slow left-[-6%] top-[18%] h-40 w-[40rem] opacity-80" />
      <Cloud className="animate-cloud-fast right-[-8%] top-[38%] h-32 w-[34rem] opacity-70" />
      <Cloud className="animate-cloud-slow left-[10%] bottom-[12%] h-28 w-[30rem] opacity-60" />

      <Nav />

      {/* Giant display headline */}
      <div className="relative z-20 flex flex-1 items-center">
        <h1 className="animate-fade-up w-full select-none px-4 text-center font-anton uppercase leading-[0.82] tracking-tight text-white sm:px-8">
          <span className="block text-[clamp(3.2rem,15vw,13rem)] drop-shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
            Play Strong<span className="text-lime">.</span>
          </span>
        </h1>
      </div>

      {/* Mobile inline figure (desktop uses the fixed ScrollCharacter) */}
      <img
        src={POSES[0]}
        alt="Tennis player leaping for a forehand"
        className="animate-hero-drop pointer-events-none absolute bottom-0 left-1/2 z-10 h-[58vh] -translate-x-1/2 object-contain object-bottom drop-shadow-figure lg:hidden"
      />

      {/* Info card */}
      <div className="animate-fade-up-delay-2 relative z-30 mb-10 px-4 sm:mb-14 sm:px-8">
        <div className="max-w-xs rounded-2xl bg-white/15 p-5 backdrop-blur-md ring-1 ring-white/25">
          <p className="font-inter text-[11px] uppercase tracking-[0.25em] text-white/80">
            — Since 1998
          </p>
          <p className="mt-3 font-archivo text-lg font-bold leading-snug text-white">
            Building Champions On and Off the Court
          </p>
          <div className="mt-5 flex gap-2">
            <button
              type="button"
              aria-label="Previous"
              className="grid h-10 w-10 place-items-center rounded-xl bg-white/20 text-white transition-colors hover:bg-white/30"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next"
              className="grid h-10 w-10 place-items-center rounded-xl bg-white text-ink transition-colors hover:bg-lime"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Soft fade into the next (white) section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-b from-transparent to-paper" />
    </section>
  );
}

function Cloud({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute rounded-full bg-white blur-2xl ${className}`}
      style={{ filter: "blur(40px)" }}
    />
  );
}
