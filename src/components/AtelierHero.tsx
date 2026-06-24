import { useState } from "react";
import { ArrowRight, Play } from "lucide-react";

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_204103_f607742e-09da-4cf5-bb06-4e67b0a531de.mp4";

const NAV_LINKS = ["Projects", "Expertise", "Studio", "Insights"];
const MENU_LINKS = ["Projects", "Expertise", "Studio", "Insights", "Reach Out"];

const EASE = "cubic-bezier(0.76,0,0.24,1)";

export default function AtelierHero() {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={VIDEO_SRC}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Content layer */}
      <div className="relative z-10 flex h-full flex-col">
        {/* ---------------------------------------------------------------- */}
        {/* Navbar                                                           */}
        {/* ---------------------------------------------------------------- */}
        <nav className="flex items-center justify-between px-6 py-5 md:px-12 md:py-6 lg:px-16">
          {/* Left: logo + desktop links */}
          <div className="flex items-center gap-10">
            <span className="font-sans text-lg font-semibold tracking-tight text-white">
              Atelier
            </span>
            <div className="hidden items-center gap-8 md:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="font-light text-sm text-white/80 transition-colors duration-200 hover:text-white"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Right: reach out + button + hamburger */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="hidden font-light text-sm text-white/80 transition-colors duration-200 hover:text-white md:inline"
            >
              Reach Out
            </a>
            <a
              href="#"
              className="hidden rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition-opacity duration-200 hover:opacity-90 md:inline-block"
            >
              Let&apos;s Talk
            </a>

            {/* Hamburger (mobile only) */}
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="relative h-5 w-6 md:hidden"
            >
              <span
                className={`absolute left-0 top-0 h-0.5 w-6 rounded-full bg-white transition-all duration-500 ${
                  open ? "top-1/2 -translate-y-1/2 rotate-45" : ""
                }`}
                style={{ transitionTimingFunction: EASE }}
              />
              <span
                className={`absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 rounded-full bg-white transition-all duration-500 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
                style={{ transitionTimingFunction: EASE }}
              />
              <span
                className={`absolute bottom-0 left-0 h-0.5 w-6 rounded-full bg-white transition-all duration-500 ${
                  open ? "bottom-1/2 translate-y-1/2 -rotate-45" : ""
                }`}
                style={{ transitionTimingFunction: EASE }}
              />
            </button>
          </div>
        </nav>

        {/* ---------------------------------------------------------------- */}
        {/* Hero content                                                     */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex flex-1 flex-col items-center justify-start px-6 pt-4 text-center sm:pt-6 md:pt-8 lg:pt-10">
          <h1 className="max-w-5xl font-instrument-serif text-3xl leading-[1.1] text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            UX <span className="font-instrument-serif italic">and</span> APP
            <br />
            DESIGN <span className="font-instrument-serif italic">for</span> BOLD
            <br />
            VENTURES
          </h1>

          <p className="mt-4 max-w-md font-light text-sm leading-relaxed text-white/70 md:mt-5 md:text-base">
            We shape digital products that define brands
            <br className="hidden sm:block" />
            and unlock exponential growth.
          </p>

          <div className="mt-5 flex flex-col items-center gap-4 sm:flex-row md:mt-6">
            <a
              href="#"
              className="group flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-medium text-black"
            >
              See Cases
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
            <a
              href="#"
              className="flex items-center gap-2 rounded-full border border-white/40 px-7 py-3 text-sm font-medium text-white transition-colors duration-200 hover:border-white/60 hover:bg-white/10"
            >
              <Play className="h-4 w-4" />
              Watch Reel
            </a>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Mobile menu overlay                                              */}
      {/* ---------------------------------------------------------------- */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity duration-700 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionTimingFunction: EASE }}
          onClick={() => setOpen(false)}
        />

        {/* Content */}
        <div
          className={`relative flex h-full flex-col transition-opacity duration-700 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionTimingFunction: EASE }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5">
            <span className="font-sans text-lg font-semibold tracking-tight text-white">
              Atelier
            </span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="relative h-6 w-6"
            >
              <span
                className="absolute left-0 top-1/2 h-0.5 w-6 -translate-y-1/2 rotate-45 rounded-full bg-white"
              />
              <span
                className="absolute left-0 top-1/2 h-0.5 w-6 -translate-y-1/2 -rotate-45 rounded-full bg-white"
              />
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-1 flex-col justify-center px-6">
            {MENU_LINKS.map((link, i) => (
              <a
                key={link}
                href="#"
                onClick={() => setOpen(false)}
                className={`border-b border-white/10 py-4 font-instrument-serif text-4xl text-white transition-all duration-700 hover:pl-4 sm:text-5xl ${
                  open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
                style={{
                  transitionTimingFunction: EASE,
                  transitionDelay: open ? `${150 + i * 80}ms` : "0ms",
                }}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 pb-8">
            <a
              href="#"
              onClick={() => setOpen(false)}
              className={`block w-full rounded-full bg-white py-4 text-center text-sm font-medium text-black transition-all duration-700 ${
                open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{
                transitionTimingFunction: EASE,
                transitionDelay: open ? "550ms" : "0ms",
              }}
            >
              Let&apos;s Talk
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
