import { useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  Sparkle,
  Star,
  X,
} from "lucide-react";
import { TREK } from "../data/trek";

const NAV_LINKS = ["Bookings", "Trekking Map", "Packages", "Instructor", "Contact"];

const CARDS = [
  { img: TREK.manali, title: "Manali Trek", meta: "7 Days/6 Night" },
  { img: TREK.sikkim, title: "Sikkim, India", meta: "7 Days/6 Night" },
  { img: TREK.snow, title: "Manali Trek", meta: "7 Days/6 Night" },
  { img: TREK.sikkim, title: "Sikkim, India", meta: "7 Days/6 Night" },
];

const AVATARS = ["#ef7a52", "#5b9bd5", "#2f9e7e"];

export default function TrekcaveHero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollCards = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen w-full bg-white font-sans text-gray-900">
      {/* ============================ Navbar ============================ */}
      <header className="border-b border-gray-100">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <a href="#" className="font-poppins text-2xl font-extrabold tracking-tight">
            <span className="text-brand">Trek</span>cave
          </a>

          <div className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="text-[15px] font-medium text-gray-700 transition-colors hover:text-brand"
              >
                {link}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#"
              className="hidden rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_-8px_rgba(239,122,82,0.7)] transition-transform hover:-translate-y-0.5 sm:inline-block"
            >
              Want To Go
            </a>
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 text-gray-700 lg:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="border-t border-gray-100 px-5 py-4 lg:hidden">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link}
                  href="#"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 font-medium text-gray-700 hover:bg-gray-50 hover:text-brand"
                >
                  {link}
                </a>
              ))}
              <a
                href="#"
                className="mt-2 rounded-full bg-brand px-6 py-3 text-center text-sm font-semibold text-white"
              >
                Want To Go
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ============================= Hero ============================= */}
      <section className="relative mx-auto max-w-7xl px-5 pb-10 pt-10 sm:px-8 lg:pb-16 lg:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Left copy */}
          <div className="relative">
            <Sparkle
              className="absolute -top-4 right-6 h-6 w-6 text-brand"
              fill="currentColor"
            />
            <h1 className="font-poppins text-[3.2rem] font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              Trekking &amp;
              <br />
              Camping
            </h1>
            <p className="mt-6 max-w-xs text-lg leading-relaxed text-gray-500">
              A perfect guide to your snow peak adventures
            </p>

            <a
              href="#"
              className="mt-9 inline-flex items-center gap-4 rounded-full bg-gradient-to-r from-brand-light to-brand py-2 pl-9 pr-2 text-white shadow-[0_18px_35px_-12px_rgba(239,122,82,0.8)] transition-transform hover:-translate-y-0.5"
            >
              <span className="text-base font-semibold uppercase tracking-wide">
                Book Now
              </span>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-brand">
                <ChevronRight className="h-5 w-5" strokeWidth={3} />
              </span>
            </a>

            <Sparkle
              className="absolute -bottom-2 left-1/2 h-7 w-7 text-gray-900"
              fill="currentColor"
            />
          </div>

          {/* Right visual */}
          <div className="relative">
            <Sparkle
              className="absolute -top-3 left-6 z-20 h-7 w-7 text-gray-900"
              fill="currentColor"
            />
            <div className="relative overflow-hidden rounded-[2.5rem] rounded-tl-[7rem] bg-brand-light/20">
              <img
                src={TREK.hero}
                alt="Mountain peak at sunset"
                className="h-[24rem] w-full object-cover sm:h-[30rem] lg:h-[34rem]"
              />

              {/* Dotted trail overlay */}
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <polyline
                  points="14,92 40,66 52,52 62,40 80,30"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.7"
                  strokeDasharray="2 2"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              {/* trail pins */}
              <Pin className="bottom-[6%] left-[12%] bg-brand" />
              <Pin className="top-[48%] left-[50%] bg-white" />
              <Pin className="top-[28%] left-[60%] bg-white" />
              <Pin className="top-[22%] left-[78%] bg-brand" />
            </div>

            {/* Floating "Trekking KM" pill */}
            <div className="absolute right-3 top-10 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-2.5 shadow-card backdrop-blur lg:right-[-1.5rem]">
              <span className="h-9 w-9 rounded-full bg-gradient-to-br from-brand to-brand-dark" />
              <div className="leading-tight">
                <p className="text-sm font-semibold text-gray-900">Trekking KM</p>
                <p className="text-xs text-gray-400">70 KM</p>
              </div>
            </div>

            {/* Floating "100k explored" card */}
            <div className="absolute bottom-5 right-4 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-card backdrop-blur lg:right-6">
              <div className="flex -space-x-2.5">
                {AVATARS.map((c) => (
                  <span
                    key={c}
                    className="h-8 w-8 rounded-full ring-2 ring-white"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <div className="leading-tight">
                <p className="font-poppins text-lg font-extrabold text-gray-900">
                  100k
                </p>
                <p className="text-[11px] text-gray-400">People have explored</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= Trek cards ========================== */}
      <section className="bg-gray-50/80">
        <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8">
          {/* arrows */}
          <button
            type="button"
            aria-label="Previous"
            onClick={() => scrollCards(-1)}
            className="absolute left-1 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-gray-500 shadow-card transition-colors hover:text-brand sm:grid"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => scrollCards(1)}
            className="absolute right-1 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-brand text-white shadow-card transition-transform hover:-translate-y-[55%] sm:grid"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            ref={trackRef}
            className="no-scrollbar flex gap-5 overflow-x-auto scroll-smooth px-0 sm:px-12"
          >
            {CARDS.map((c, i) => (
              <article
                key={i}
                className="flex min-w-[19rem] flex-1 items-center gap-4 rounded-2xl bg-white p-3 shadow-card"
              >
                <img
                  src={c.img}
                  alt={c.title}
                  className="h-20 w-24 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0">
                  <h3 className="font-poppins text-lg font-bold text-gray-900">
                    {c.title}
                  </h3>
                  <p className="text-sm text-gray-500">{c.meta}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star
                          key={s}
                          className="h-3.5 w-3.5 text-brand"
                          fill="currentColor"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">( 70 Review )</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Pin({ className = "" }: { className?: string }) {
  return (
    <span
      className={`absolute h-3.5 w-3.5 rounded-full ring-4 ring-white/40 ${className}`}
    />
  );
}
