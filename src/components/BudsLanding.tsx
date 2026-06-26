import { useState } from "react";
import {
  ArrowRight,
  Heart,
  Instagram,
  Menu,
  Play,
  ShoppingBag,
  Twitter,
  Youtube,
  X,
} from "lucide-react";
import { BUDS } from "../data/buds";

const NAV = ["Home", "Products", "About", "Contact"];

export default function BudsLanding() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-full bg-ink font-sans text-white">
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-[#232030] via-[#1b1924] to-[#121017] px-5 pb-16 pt-5 sm:px-8 lg:px-14">
        {/* Faint ghost wordmark */}
        <span className="pointer-events-none absolute left-0 top-24 select-none font-poppins text-[18vw] font-extrabold leading-[0.8] tracking-tight text-white/[0.03] sm:text-[12vw]">
          galaxy
          <br />
          buds pro
        </span>

        {/* Nav */}
        <nav className="relative z-30 mx-auto flex max-w-7xl items-center justify-between py-3">
          <div className="hidden items-center gap-9 md:flex">
            {NAV.map((n, i) => (
              <a
                key={n}
                href="#"
                className={`text-sm transition-colors ${
                  i === 0 ? "text-white" : "text-white/55 hover:text-white"
                }`}
              >
                {n}
              </a>
            ))}
          </div>
          <span className="font-poppins text-lg font-bold md:hidden">Galaxy Buds</span>
          <div className="flex items-center gap-4">
            <button aria-label="Wishlist" className="text-white/70 transition-colors hover:text-white">
              <Heart className="h-5 w-5" />
            </button>
            <button aria-label="Cart" className="text-white/70 transition-colors hover:text-white">
              <ShoppingBag className="h-5 w-5" />
            </button>
            <button
              aria-label="Menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="text-white/80 md:hidden"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="relative z-30 mx-auto mt-2 flex max-w-7xl flex-col gap-1 md:hidden">
            {NAV.map((n) => (
              <a
                key={n}
                href="#"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-2 py-2 text-white/70 hover:bg-white/5 hover:text-white"
              >
                {n}
              </a>
            ))}
          </div>
        )}

        {/* Floating single bud, top-right */}
        <img
          src={BUDS.darkSingle}
          alt=""
          aria-hidden="true"
          className="animate-float pointer-events-none absolute right-2 top-0 z-10 hidden w-44 rotate-12 object-contain mix-blend-screen sm:block lg:w-56"
          style={{ "--rot": "12deg" } as React.CSSProperties}
        />

        {/* Hero grid */}
        <div className="relative z-20 mx-auto grid max-w-7xl items-center gap-6 pt-6 lg:grid-cols-2 lg:pt-10">
          {/* Big case-open buds */}
          <div className="relative order-2 lg:order-1">
            <img
              src={BUDS.caseOpen}
              alt="Galaxy Buds Pro charging case open"
              className="mx-auto w-[88%] max-w-xl object-contain drop-shadow-[0_30px_60px_rgba(124,99,216,0.35)] sm:w-[78%] lg:w-full"
            />
          </div>

          {/* Copy */}
          <div className="order-1 lg:order-2">
            <h1 className="font-poppins text-[2.7rem] font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              Samsung
              <br />
              <span className="text-lilac">galaxy</span> buds <span>pro</span>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/55 sm:text-base">
              These are wireless headphones with professional-grade technology
              for an incredible immersion in immersive sound.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <a
                href="#"
                className="rounded-full bg-gradient-to-r from-lilac-light via-lilac to-lilac-deep px-9 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(124,99,216,0.9)] transition-transform hover:-translate-y-0.5"
              >
                Buy now
              </a>
              <button
                aria-label="Add to wishlist"
                className="grid h-12 w-12 place-items-center rounded-full border border-white/25 text-white/80 transition-colors hover:border-white/60 hover:text-white"
              >
                <Heart className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer row of hero */}
        <div className="relative z-20 mx-auto mt-10 flex max-w-7xl items-end justify-between">
          <span className="text-xs tracking-widest text-white/40">Samsung</span>
          {/* Video chip */}
          <a
            href="#"
            className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-2 pr-5 backdrop-blur-md transition-colors hover:bg-white/[0.08]"
          >
            <span className="relative h-12 w-16 overflow-hidden rounded-xl">
              <img src={BUDS.lifestyle} alt="" className="h-full w-full object-cover" />
              <span className="absolute inset-0 grid place-items-center bg-black/30">
                <Play className="h-4 w-4 fill-white text-white" />
              </span>
            </span>
            <span className="hidden text-xs text-white/70 sm:block">Watch the film</span>
          </a>
        </div>
      </section>

      {/* ============== NOISE REDUCTION (light) ============== */}
      <section className="bg-taupe text-[#2a2730]">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:gap-12 lg:py-20">
          <div className="overflow-hidden rounded-3xl">
            <img
              src={BUDS.woman}
              alt="Woman enjoying noise cancellation"
              className="h-[26rem] w-full object-cover object-top sm:h-[32rem]"
            />
          </div>
          <div>
            <h2 className="font-poppins text-4xl font-bold leading-[1.05] text-white sm:text-5xl">
              Control the level of noise reduction.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-[#4a4650] sm:text-base">
              Galaxy Buds Pro's active noise canceling technology eliminates up
              to 99% of ambient noise. Indoor and outdoor microphones track
              noise in real time. Choose a noise canceling level with an
              intelligent algorithm that suppresses noise based on your
              surroundings: set it high on a noisy bus, or use a low level in the
              library reading room.
            </p>
            <button
              aria-label="Next"
              className="mt-8 grid h-12 w-12 place-items-center rounded-full border border-[#2a2730]/40 text-[#2a2730] transition-colors hover:bg-[#2a2730] hover:text-taupe"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ============== DISSOLVE IN STUDIO SOUND (dark) ============== */}
      <section className="relative overflow-hidden bg-ink">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-24">
          <div>
            <h2 className="font-poppins text-4xl font-bold leading-[1.05] sm:text-5xl">
              Dissolve in
              <br />
              studio sound.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/55 sm:text-base">
              Galaxy Buds Pro offer the most immersive sound experience of any
              Galaxy Buds, whether you're listening to a new album or an
              audiobook on the go.
            </p>
            <a
              href="#"
              className="mt-8 inline-block rounded-full bg-gradient-to-r from-lilac-light via-lilac to-lilac-deep px-9 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(124,99,216,0.9)] transition-transform hover:-translate-y-0.5"
            >
              Buy now
            </a>
          </div>

          <div className="relative h-72 sm:h-96 lg:h-[28rem]">
            <img
              src={BUDS.hero3q}
              alt="Galaxy Buds Pro close-up"
              className="animate-float absolute bottom-0 right-0 w-[80%] max-w-md object-contain drop-shadow-[0_30px_60px_rgba(124,99,216,0.4)]"
            />
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="px-5 py-16 sm:px-8 lg:py-20">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-lilac-deep via-[#6f5bc8] to-[#4b3aa0] px-7 py-16 text-center sm:px-12 lg:py-20">
          <img
            src={BUDS.darkSingle}
            alt=""
            aria-hidden="true"
            className="animate-float pointer-events-none absolute -right-6 -top-6 hidden w-48 rotate-[18deg] object-contain mix-blend-screen opacity-80 sm:block"
            style={{ "--rot": "18deg" } as React.CSSProperties}
          />
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
            Sound without limits
          </span>
          <h2 className="mx-auto mt-4 max-w-3xl font-poppins text-4xl font-extrabold leading-[1.05] sm:text-6xl">
            Hear every detail. Feel every beat.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
            Studio-grade audio, intelligent noise control and all-day comfort —
            the Galaxy Buds Pro are made to move with you.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#"
              className="rounded-full bg-white px-9 py-3.5 text-sm font-semibold text-lilac-deep transition-transform hover:-translate-y-0.5"
            >
              Buy now
            </a>
            <a
              href="#"
              className="rounded-full border border-white/40 px-9 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Learn more
            </a>
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="border-t border-white/10 bg-ink px-5 pb-10 pt-16 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <span className="font-poppins text-2xl font-extrabold">
              Galaxy <span className="text-lilac">Buds Pro</span>
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              Professional-grade wireless sound, engineered for total immersion
              wherever life takes you.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/50 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Products" links={["Buds Pro", "Buds2", "Buds Live", "Accessories"]} />
          <FooterCol title="Company" links={["About", "Careers", "Press", "Sustainability"]} />
          <FooterCol title="Support" links={["Help Center", "Warranty", "Contact", "Track Order"]} />
        </div>

        <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Galaxy Buds Pro. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-white/40">
            <a href="#" className="hover:text-white/70">Privacy</a>
            <a href="#" className="hover:text-white/70">Terms</a>
            <a href="#" className="hover:text-white/70">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
        {title}
      </h4>
      <ul className="mt-4 space-y-3">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="text-sm text-white/65 transition-colors hover:text-white">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
