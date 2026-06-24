import { ArrowLeft, ArrowRight } from "lucide-react";
import Nav from "./Nav";
import { POSES, IMG } from "../data/assets";

/**
 * Fullscreen sky hero (matches the reference): photographic clouds background,
 * a giant full-width "PLAY STRONG." wordmark, and the large background-removed
 * tennis player placed centre-right, leaping in front of the text — her legs
 * and red shoe overflow past the bottom of the blue hero and overlap into the
 * white section below. Bottom-left "Since 1998" info card.
 *
 * `overflow-visible` on the section lets the player break the bottom boundary;
 * the sky lives in its own clipped wrapper so it stays inside the hero.
 */
export default function Hero() {
  return (
    <section
      id="home"
      className="relative z-20 min-h-screen w-full bg-[#5ea4e6]"
    >
      {/* Clipped sky background */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={IMG.heroSky}
          alt=""
          aria-hidden="true"
          className="animate-sky-pan absolute inset-0 h-full w-full object-cover"
        />
        {/* Blend the base of the sky into the white section below */}
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-b from-transparent to-white" />
      </div>

      <Nav />

      {/* Giant display headline — behind the player */}
      <div className="absolute inset-x-0 top-[15%] z-10 sm:top-[16%]">
        <h1 className="select-none px-3 text-center font-display uppercase leading-none tracking-tight text-white">
          <span className="block whitespace-nowrap text-[clamp(3rem,16vw,15rem)] drop-shadow-[0_10px_40px_rgba(0,0,0,0.22)]">
            Play&nbsp;Strong<span className="text-lime">.</span>
          </span>
        </h1>
      </div>

      {/* The player — centre-right, large, overflowing the hero bottom edge */}
      <img
        src={POSES[0]}
        alt="Tennis player leaping for a forehand"
        className="animate-hero-drop pointer-events-none absolute bottom-[-5vh] left-[56%] z-20 h-[92vh] max-w-none -translate-x-1/2 object-contain object-bottom drop-shadow-figure sm:h-[101vh]"
      />

      {/* Bottom-left info card */}
      <div className="absolute bottom-10 left-4 z-30 sm:left-8 sm:bottom-14">
        <div className="animate-fade-up-delay-2 max-w-[15rem] rounded-2xl bg-white/15 p-5 backdrop-blur-md ring-1 ring-white/25">
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
