import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Check,
  LayoutGrid,
  MessageSquare,
  Palette,
  Sparkles,
  Star,
} from "lucide-react";

/**
 * VertexAI — a full single-page marketing website built around the
 * Higgsfield oil-painting portrait. Desktop-first, smooth-scroll nav.
 */
const HERO_IMAGE =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3A4FMCrm8jYjCnPYN9rbcZn81hc/hf_20260628_075958_0f7beaf6-e2e0-4792-8154-1f0b846b6ace.png";

const NAV = [
  { label: "Product", href: "#product" },
  { label: "Platform", href: "#platform" },
  { label: "Customers", href: "#customers" },
  { label: "Company", href: "#company" },
];

export default function VertexSite() {
  return (
    <div className="min-h-screen scroll-smooth bg-[#f4f0e9] font-body text-[#1c1a17] antialiased">
      <Nav />
      <Hero />
      <Marquee />
      <Product />
      <Platform />
      <Showcase />
      <Customers />
      <CTA />
      <Footer />
    </div>
  );
}

/* ------------------------------------------------------------------ NAV */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#f4f0e9]/85 py-3 shadow-[0_1px_0_rgba(0,0,0,0.06)] backdrop-blur-md"
          : "py-5"
      }`}
    >
      <div className="mx-auto flex max-w-[88rem] items-center justify-between px-6 lg:px-10">
        <a href="#top" className="flex items-center gap-2.5">
          <Logo dark={scrolled} />
          <span
            className={`text-lg font-semibold tracking-tight ${
              scrolled ? "text-[#1c1a17]" : "text-white"
            }`}
          >
            VertexAI
          </span>
        </a>

        <nav
          className={`flex items-center gap-2 rounded-2xl p-2 pl-4 ring-1 transition ${
            scrolled
              ? "bg-black/[0.04] ring-black/10"
              : "bg-black/25 ring-white/10 backdrop-blur-md"
          }`}
        >
          <ul className="hidden items-center gap-2 md:flex lg:gap-3">
            {NAV.map((n) => (
              <li key={n.label}>
                <a
                  href={n.href}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    scrolled
                      ? "text-[#5b554c] hover:bg-black/5 hover:text-[#1c1a17]"
                      : "text-white/85 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#cta"
            className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-white/90"
          >
            Login
          </a>
        </nav>
      </div>
    </header>
  );
}

/* ----------------------------------------------------------------- HERO */
function Hero() {
  return (
    <section id="top" className="px-2 pt-2 sm:px-4 sm:pt-4">
      <div className="relative h-[calc(100vh-1rem)] min-h-[640px] w-full overflow-hidden rounded-[28px]">
        <img
          src={HERO_IMAGE}
          alt="Oil-painting portrait — Redefine space with intelligent design"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/45" />

        <div className="relative z-10 flex h-full flex-col">
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <span className="mb-6 inline-flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-white ring-1 ring-white/25 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" /> Interior intelligence
            </span>
            <h1 className="font-body text-4xl font-medium leading-[1.04] tracking-tight text-white drop-shadow-sm sm:text-6xl lg:text-7xl">
              Meet VertexAI.
              <br />
              <span className="font-display italic">Redefine space</span> with
              <br />
              intelligent design
            </h1>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#cta"
                className="inline-flex items-center rounded-2xl bg-white px-7 py-3.5 text-sm font-semibold text-neutral-900 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-white/95 sm:text-base"
              >
                Start free decoration
              </a>
              <a
                href="#platform"
                className="inline-flex items-center gap-1.5 rounded-2xl px-6 py-3.5 text-sm font-semibold text-white ring-1 ring-white/35 backdrop-blur-md transition hover:bg-white/10 sm:text-base"
              >
                See how it works <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <footer className="pb-6 sm:pb-9">
            <div className="mx-auto flex max-w-[88rem] flex-col gap-5 px-6 sm:flex-row sm:items-end sm:justify-between lg:px-10">
            <p className="max-w-md text-sm leading-relaxed text-white/85 drop-shadow-sm sm:text-[15px]">
              It helps you imagine, plan, and refine spaces through natural
              conversations. From choosing colors and layouts to suggesting
              furniture and décor, it adapts to your taste.
            </p>
            <div className="flex items-end gap-2.5">
              <a
                href="#product"
                aria-label="Explore"
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-white ring-1 ring-white/30 backdrop-blur-md transition hover:bg-white/10"
              >
                <ArrowUpRight className="h-5 w-5" />
              </a>
              <div className="flex flex-col gap-2.5">
                <HeroPill href="#platform">Solutions for complex spaces</HeroPill>
                <HeroPill href="#product">Conversational &amp; Action</HeroPill>
              </div>
            </div>
            </div>
          </footer>
        </div>
      </div>
    </section>
  );
}

function HeroPill({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      className="rounded-2xl px-5 py-3 text-sm font-medium text-white ring-1 ring-white/30 backdrop-blur-md transition hover:bg-white/10"
    >
      {children}
    </a>
  );
}

/* -------------------------------------------------------------- MARQUEE */
function Marquee() {
  const names = ["AALTO", "Studio Møller", "HEARTH", "Casa Verde", "NORDLY", "Atelier 9"];
  return (
    <section className="border-y border-black/5 bg-[#efe9df]">
      <div className="mx-auto flex max-w-[88rem] flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6 py-7 lg:px-10">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#8a8275]">
          Trusted by design studios
        </span>
        {names.map((n) => (
          <span
            key={n}
            className="text-lg font-semibold tracking-tight text-[#1c1a17]/45"
          >
            {n}
          </span>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- PRODUCT */
const FEATURES = [
  {
    icon: MessageSquare,
    title: "Conversational design",
    body: "Describe the feeling you want and VertexAI proposes layouts, palettes and pieces — refining with every reply.",
  },
  {
    icon: Palette,
    title: "Colour & material sense",
    body: "Tasteful, coherent palettes pulled from your inspiration, lighting and the bones of the room itself.",
  },
  {
    icon: LayoutGrid,
    title: "Plans that fit",
    body: "Furniture and circulation laid out to scale, so what looks good on screen actually works in the space.",
  },
  {
    icon: Sparkles,
    title: "Adapts to your taste",
    body: "It learns what you reach for and what you reject, getting closer to ‘you’ with every iteration.",
  },
];

function Product() {
  return (
    <section id="product" className="mx-auto max-w-[88rem] scroll-mt-24 px-6 py-24 lg:px-10">
      <SectionHead
        kicker="Product"
        title={
          <>
            Everything you need to <span className="font-display italic">imagine</span>,
            plan and refine.
          </>
        }
        sub="One calm workspace that turns a vague idea into a finished, livable room."
      />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="group rounded-3xl border border-black/[0.07] bg-[#faf7f1] p-7 transition hover:-translate-y-1 hover:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.25)]"
          >
            <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1c1a17] text-[#f4f0e9]">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#5b554c]">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- PLATFORM */
const STEPS = [
  {
    n: "01",
    title: "Describe the room",
    body: "Snap a photo or just talk. Tell VertexAI the vibe, the budget and what has to stay.",
  },
  {
    n: "02",
    title: "Explore directions",
    body: "Get distinct, fully-considered concepts — palettes, plans and curated pieces — in seconds.",
  },
  {
    n: "03",
    title: "Refine & shop",
    body: "Nudge anything in plain language, then export the shopping list and floor plan.",
  },
];

function Platform() {
  return (
    <section id="platform" className="scroll-mt-24 bg-[#1c1a17] text-[#f4f0e9]">
      <div className="mx-auto grid max-w-[88rem] gap-14 px-6 py-24 lg:grid-cols-2 lg:px-10">
        <div>
          <SectionHead
            dark
            kicker="Platform"
            title={
              <>
                From conversation to a finished{" "}
                <span className="font-display italic">space</span>.
              </>
            }
            sub="A guided flow that does the heavy lifting while you stay in control."
          />
          <div className="mt-12 space-y-10">
            {STEPS.map((s) => (
              <div key={s.n} className="flex gap-5">
                <span className="font-display text-3xl italic text-[#cdbf9c]">
                  {s.n}
                </span>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-1.5 max-w-md text-sm leading-relaxed text-white/65">
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm">
            <ul className="space-y-4">
              {[
                "Solutions for complex, irregular spaces",
                "Conversational & action — it edits, not just suggests",
                "Real product matches within your budget",
                "Exports: floor plan, palette, shopping list",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-md bg-[#cdbf9c] text-[#1c1a17]">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[15px] text-white/85">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- SHOWCASE */
function Showcase() {
  return (
    <section className="mx-auto max-w-[88rem] px-6 py-24 lg:px-10">
      <div className="relative overflow-hidden rounded-[32px] border border-black/[0.06]">
        <img src={HERO_IMAGE} alt="" className="h-[420px] w-full object-cover sm:h-[520px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-14">
          <p className="max-w-xl font-display text-3xl italic leading-snug text-white sm:text-4xl">
            “It felt less like software and more like a designer who actually
            listened.”
          </p>
          <p className="mt-5 text-sm font-medium uppercase tracking-[0.16em] text-white/75">
            Elise Moreau · Interior Architect
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ CUSTOMERS */
const QUOTES = [
  {
    quote:
      "We cut early-concept time from days to an afternoon. Clients see options instantly and we still own the taste.",
    name: "Jonas Pike",
    role: "Founder, Studio Møller",
  },
  {
    quote:
      "The palette and material suggestions are genuinely tasteful. It’s the first tool that didn’t feel generic.",
    name: "Amara Hale",
    role: "Principal, HEARTH",
  },
  {
    quote:
      "Plans that respect real dimensions. The shopping list export alone pays for itself.",
    name: "Theo Vance",
    role: "Lead Designer, NORDLY",
  },
];

function Customers() {
  return (
    <section id="customers" className="scroll-mt-24 bg-[#efe9df]">
      <div className="mx-auto max-w-[88rem] px-6 py-24 lg:px-10">
        <SectionHead
          kicker="Customers"
          title={
            <>
              Loved by the studios who set the{" "}
              <span className="font-display italic">standard</span>.
            </>
          }
        />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {QUOTES.map((q) => (
            <figure
              key={q.name}
              className="flex flex-col rounded-3xl border border-black/[0.07] bg-[#faf7f1] p-7"
            >
              <div className="mb-4 flex gap-0.5 text-[#c9803f]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="flex-1 text-[15px] leading-relaxed text-[#3a352e]">
                “{q.quote}”
              </blockquote>
              <figcaption className="mt-6">
                <div className="font-semibold tracking-tight">{q.name}</div>
                <div className="text-sm text-[#8a8275]">{q.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ CTA */
function CTA() {
  return (
    <section id="cta" className="mx-auto max-w-[88rem] scroll-mt-24 px-6 py-24 lg:px-10">
      <div className="rounded-[32px] bg-[#1c1a17] px-8 py-16 text-center text-[#f4f0e9] sm:px-16 sm:py-20">
        <h2 className="mx-auto max-w-2xl font-body text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
          Redefine your space, <span className="font-display italic">today</span>.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/70">
          Start a free decoration and watch a blank room become somewhere you
          actually want to be.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#top"
            className="inline-flex items-center rounded-2xl bg-white px-7 py-3.5 text-sm font-semibold text-neutral-900 transition hover:-translate-y-0.5 hover:bg-white/95 sm:text-base"
          >
            Start free decoration
          </a>
          <a
            href="#customers"
            className="inline-flex items-center gap-1.5 rounded-2xl px-6 py-3.5 text-sm font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/10 sm:text-base"
          >
            Talk to sales <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- FOOTER */
function Footer() {
  const cols = [
    { h: "Product", links: ["Overview", "Platform", "Pricing", "Changelog"] },
    { h: "Company", links: ["About", "Customers", "Careers", "Contact"] },
    { h: "Resources", links: ["Blog", "Guides", "Help center", "Status"] },
  ];
  return (
    <footer id="company" className="scroll-mt-24 border-t border-black/[0.07] bg-[#f4f0e9]">
      <div className="mx-auto grid max-w-[88rem] gap-10 px-6 py-16 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:px-10">
        <div>
          <div className="flex items-center gap-2.5">
            <Logo dark />
            <span className="text-lg font-semibold tracking-tight">VertexAI</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#5b554c]">
            Redefine space with intelligent design. Imagine, plan and refine
            through natural conversation.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a8275]">
              {c.h}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#top" className="text-sm text-[#3a352e] transition hover:text-[#1c1a17]">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-black/[0.06]">
        <div className="mx-auto flex max-w-[88rem] flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-[#8a8275] sm:flex-row lg:px-10">
          <span>© {new Date().getFullYear()} VertexAI. All rights reserved.</span>
          <span className="flex gap-6">
            <a href="#top" className="hover:text-[#1c1a17]">Privacy</a>
            <a href="#top" className="hover:text-[#1c1a17]">Terms</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

/* --------------------------------------------------------------- SHARED */
function SectionHead({
  kicker,
  title,
  sub,
  dark,
}: {
  kicker: string;
  title: React.ReactNode;
  sub?: string;
  dark?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      <span
        className={`text-xs font-semibold uppercase tracking-[0.18em] ${
          dark ? "text-[#cdbf9c]" : "text-[#c9803f]"
        }`}
      >
        {kicker}
      </span>
      <h2
        className={`mt-4 font-body text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.75rem] ${
          dark ? "text-[#f4f0e9]" : "text-[#1c1a17]"
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={`mt-4 text-[15px] leading-relaxed ${
            dark ? "text-white/65" : "text-[#5b554c]"
          }`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

function Logo({ dark }: { dark?: boolean }) {
  return (
    <span className="grid grid-cols-2 gap-0.5">
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-[3px] ${dark ? "bg-[#1c1a17]" : "bg-white"}`}
        />
      ))}
    </span>
  );
}
