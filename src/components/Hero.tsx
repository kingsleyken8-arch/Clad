import { ArrowLeft, ArrowRight } from "lucide-react";
import Nav from "./Nav";
import { IMG } from "../data/assets";

/**
 * Fullscreen sky hero (matches the reference): a photographic clouds background,
 * a giant wide "PLAY STRONG." wordmark, and the large background-removed tennis
 * player filling nearly the full width in front of it, plus the bottom-left
 * "Since 1998" info card.
 */
export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-[#5ea4e6]"
    >
      {/* Photographic clouds background */}
      <img
        src={IMG.heroSky}
        alt=""
        aria-hidden="true"
        className="animate-sky-pan absolute inset-0 h-full w-full object-cover"
      />
      {/* Soft brightening near the base so the page blends into white */}
      <div className="absolute inset-x-0 bottom-0 z-[5] h-1/3 bg-gradient-to-b from-transparent to-white/30" />

      <Nav />

      {/* Giant display headline — sits behind the player */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <h1 className="w-full select-none px-3 text-center font-display uppercase leading-[0.9] tracking-tight text-white">
          <span className="block whitespace-nowrap text-[clamp(3.5rem,16.5vw,16rem)] drop-shadow-[0_10px_40px_rgba(0,0,0,0.22)]">
            Play&nbsp;Strong<span className="text-lime">.</span>
          </span>
        </h1>
      </div>

      {/* The player — nearly full width, centred, standing on the section base */}
      <img
        src={IMG.heroWide}
        alt="Tennis player leaping for a forehand"
        className="animate-hero-drop pointer-events-none absolute bottom-0 left-1/2 z-20 w-[94vw] max-w-[1600px] -translate-x-1/2 object-contain object-bottom drop-shadow-figure"
      />

      {/* Bottom-left info card */}
      <div className="absolute bottom-8 left-4 z-30 sm:left-8 sm:bottom-12">
        <div className="animate-fade-up-delay-2 max-w-[16rem] rounded-2xl bg-white/15 p-5 backdrop-blur-md ring-1 ring-white/25">
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
    </section>
  );
}
