import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

const LINKS = ["Home", "Training", "Programs", "Coaches", "Tournaments", "Membership"];

/** Translucent floating navbar that overlays the hero sky. */
export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <nav className="mx-auto mt-4 flex max-w-7xl items-center justify-between rounded-2xl bg-white/15 px-4 py-2.5 backdrop-blur-md ring-1 ring-white/25 sm:mt-6 sm:px-5">
        {/* Brand */}
        <a href="#home" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-ink">
            <span className="font-archivo text-sm font-black leading-none">A+</span>
          </span>
          <span className="font-archivo text-lg font-extrabold uppercase tracking-tight text-white">
            Acetennis
          </span>
        </a>

        {/* Center links */}
        <div className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l}
              href="#"
              className="font-inter text-[13px] font-medium text-white/85 transition-colors hover:text-white"
            >
              {l}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-2">
          <a
            href="#"
            className="hidden items-center gap-2 rounded-xl bg-white py-2 pl-4 pr-2 font-inter text-[13px] font-semibold text-ink transition-transform hover:-translate-y-0.5 sm:flex"
          >
            Book a Lesson
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-lime text-ink">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </a>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-xl bg-white/20 text-white lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-50 bg-ink/95 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <span className="font-archivo text-lg font-extrabold uppercase tracking-tight text-white">
            Acetennis
          </span>
          <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
            <X className="h-7 w-7 text-white" />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center gap-7 pt-16">
          {LINKS.map((l) => (
            <a
              key={l}
              href="#"
              onClick={() => setOpen(false)}
              className="font-archivo text-3xl font-extrabold uppercase text-white"
            >
              {l}
            </a>
          ))}
          <a
            href="#"
            onClick={() => setOpen(false)}
            className="mt-4 flex items-center gap-2 rounded-xl bg-lime px-6 py-3 font-inter font-semibold text-ink"
          >
            Book a Lesson <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
