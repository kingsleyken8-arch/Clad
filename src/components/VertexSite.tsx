import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import "./vertex-anim.css";

/* ----------------------------- reveal helpers ----------------------------- */
/** Observe an element and report when it first scrolls into view. */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

/**
 * Wraps content and adds `.is-in` to trigger child `.ar` / `.ar-line`
 * reveals. `appear` plays on mount (hero); otherwise it plays on scroll.
 */
function Reveal({
  children,
  className = "",
  appear = false,
}: {
  children: ReactNode;
  className?: string;
  appear?: boolean;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, []);
  const shown = appear ? mounted : inView;
  return (
    <div ref={ref} className={`${shown ? "is-in" : ""} ${className}`}>
      {children}
    </div>
  );
}

/** Inline `--i` stagger index helper. */
const si = (i: number) => ({ "--i": i } as CSSProperties);

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
      <Intro />
      <Slideshow />
      <ScrollStory />
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

        <Reveal appear className="relative z-10 flex h-full flex-col">
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <span
              className="ar mb-6 inline-flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-white ring-1 ring-white/25 backdrop-blur-md"
              style={si(0)}
            >
              <Sparkles className="h-3.5 w-3.5" /> Interior intelligence
            </span>
            <h1 className="font-body text-4xl font-medium leading-[1.04] tracking-tight text-white drop-shadow-sm sm:text-6xl lg:text-7xl">
              <span className="ar-line" style={si(1)}>
                <span>Meet VertexAI.</span>
              </span>
              <span className="ar-line" style={si(2)}>
                <span>
                  <span className="font-display italic">Redefine space</span> with
                </span>
              </span>
              <span className="ar-line" style={si(3)}>
                <span>intelligent design</span>
              </span>
            </h1>
            <div className="ar mt-9 flex flex-wrap items-center justify-center gap-3" style={si(4)}>
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
            <p className="ar max-w-md text-sm leading-relaxed text-white/85 drop-shadow-sm sm:text-[15px]" style={si(5)}>
              It helps you imagine, plan, and refine spaces through natural
              conversations. From choosing colors and layouts to suggesting
              furniture and décor, it adapts to your taste.
            </p>
            <div className="ar flex items-end gap-2.5" style={si(6)}>
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
        </Reveal>
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

/* ------------------------------------------------------------- SLIDESHOW */
const CDN =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3A4FMCrm8jYjCnPYN9rbcZn81hc/";

const SLIDES = [
  { id: "01", title: "Lunar Repose", img: "hf_20260629_061854_5e775d59-57dc-48f6-9dfb-e2c90dd93474.png" },
  { id: "02", title: "Afternoon Confidences", img: "hf_20260629_061857_7a50203f-c522-4cc6-8efa-4b9ca150bac8.png" },
  { id: "03", title: "The Conservatory", img: "hf_20260629_061900_f47c53b3-3bcd-4aca-8bca-7ebf4aedde05.png" },
  { id: "04", title: "Promenade", img: "hf_20260629_061903_24be92aa-7003-4b42-9778-988aa5dc0585.png" },
  { id: "05", title: "Nocturne", img: "hf_20260629_062050_208c6861-3c49-4d13-8b95-9f2955878aeb.png" },
  { id: "06", title: "In Motion", img: "hf_20260629_062054_e1093e72-2fcb-4486-9de5-a7ab318a2da6.png" },
  { id: "07", title: "The Reading Room", img: "hf_20260629_062057_ccaa0c50-8ba2-4ebf-a7ab-4457ffad98b4.png" },
  { id: "08", title: "Heirlooms", img: "hf_20260629_062100_28ebc3bc-84df-496a-9cba-aa4852420c3a.png" },
];

function Slideshow() {
  const trackRef = useRef<HTMLDivElement>(null);

  const move = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const gap = 10;
    const step = card ? card.offsetWidth + gap : el.clientWidth * 0.8;
    const max = el.scrollWidth - el.clientWidth;
    // wrap around at the edges so it behaves like a continuous slideshow
    let target = el.scrollLeft + dir * step;
    if (dir > 0 && el.scrollLeft >= max - 4) target = 0;
    else if (dir < 0 && el.scrollLeft <= 4) target = max;
    el.scrollTo({ left: Math.max(0, Math.min(max, target)), behavior: "smooth" });
  };

  return (
    <section id="lookbook" className="scroll-mt-24 bg-[#f4f0e9] py-20 lg:py-28">
      <div className="mx-auto max-w-[88rem] px-6 lg:px-10">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <span className="ar block text-xs font-semibold uppercase tracking-[0.18em] text-[#c9803f]" style={si(0)}>
              The Lookbook
            </span>
            <h2 className="ar mt-4 font-body text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.75rem]" style={si(1)}>
              The collection, in <span className="font-display italic">oils</span>.
            </h2>
          </div>
          <p className="ar max-w-sm text-[15px] leading-relaxed text-[#5b554c]" style={si(2)}>
            Eight characters, one painterly world. Hand-painted editorial
            portraits — drift through the campaign.
          </p>
        </Reveal>

        {/* carousel */}
        <div
          ref={trackRef}
          className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-smooth pb-2"
        >
          {SLIDES.map((s) => (
            <figure
              key={s.id}
              data-card
              className="w-[82%] shrink-0 snap-start sm:w-[47%] lg:w-[31%] xl:w-[23.5%]"
            >
              <div className="overflow-hidden border border-black/[0.06] bg-[#e7e0d4]">
                <img
                  src={CDN + s.img}
                  alt={s.title}
                  loading="lazy"
                  className="aspect-[3/4] h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                />
              </div>
              <figcaption className="mt-4 flex items-baseline gap-3">
                <span className="font-display text-lg italic text-[#c9803f]">{s.id}</span>
                <span className="text-lg font-medium tracking-tight text-[#1c1a17]">{s.title}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* controls */}
        <div className="mt-12 flex flex-col items-center gap-7">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => move(-1)}
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-[#1c1a17] ring-1 ring-black/15 transition hover:-translate-y-0.5 hover:bg-black/[0.05]"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => move(1)}
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-[#1c1a17] ring-1 ring-black/15 transition hover:-translate-y-0.5 hover:bg-black/[0.05]"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
          <a
            href="#lookbook"
            className="inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-[#1c1a17] ring-1 ring-black/15 transition hover:bg-black/[0.05]"
          >
            See the full lookbook <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- INTRO */
// Two flanking images. Swapped to the user-uploaded crops once available.
const INTRO_IMAGES = {
  left: CDN + "hf_20260629_171347_ea258f82-2c56-4210-87a4-ab831fbe1c1d.png", // owl among leaves
  right: CDN + "hf_20260629_061900_f47c53b3-3bcd-4aca-8bca-7ebf4aedde05.png", // conservatory (green knit + owl)
};

function Intro() {
  return (
    <section id="work" className="relative overflow-hidden bg-[#f4f0e9]">
      {/* Nominee badge */}
      <div className="absolute right-0 top-0 z-20 hidden flex-col items-center gap-3 bg-[#1c1a17] px-3 py-4 text-[#f4f0e9] sm:flex">
        <span className="text-lg font-bold leading-none">W.</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] [writing-mode:vertical-rl]">
          Nominee
        </span>
      </div>

      <div className="relative mx-auto max-w-[88rem] px-6 pb-24 pt-24 lg:px-10 lg:pb-28 lg:pt-28">
        {/* corner labels */}
        <span className="absolute left-6 top-28 hidden text-xs font-semibold uppercase leading-relaxed tracking-[0.16em] text-[#1c1a17] lg:block lg:left-10">
          Vertex
          <br />
          Studio
        </span>
        <span className="absolute right-10 top-1/2 hidden text-right text-xs font-semibold uppercase leading-relaxed tracking-[0.16em] text-[#1c1a17] lg:block">
          Selected work
          <br />
          from 2021–2025
        </span>

        {/* headline cluster */}
        <Reveal className="relative z-10 text-center">
          <p className="ar text-xs font-semibold uppercase tracking-[0.26em] text-[#1c1a17]" style={si(0)}>
            Welcome to the
          </p>
          <h2 className="mx-auto mt-5 max-w-5xl font-body text-[clamp(2.6rem,9vw,7rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.01em] text-[#1c1a17]">
            <span className="ar-line" style={si(1)}>
              <span>
                Collection <span className="font-display lowercase italic font-normal">of</span>
              </span>
            </span>
            <span className="ar-line" style={si(2)}>
              <span>
                <span className="font-display lowercase italic font-normal">my</span> Recent
              </span>
            </span>
            <span className="ar-line" style={si(3)}>
              <span>Work</span>
            </span>
          </h2>
          <p className="ar mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#1c1a17]/70" style={si(4)}>
            aka the lookbook
          </p>
        </Reveal>

        {/* images + intro paragraph */}
        <div className="relative z-10 mt-16 grid grid-cols-1 items-end gap-12 lg:mt-24 lg:grid-cols-3">
          <div className="order-2 aspect-[4/3] w-full max-w-md overflow-hidden bg-[#e7e0d4] lg:order-1 lg:max-w-none">
            <img src={INTRO_IMAGES.left} alt="" className="h-full w-full object-cover" />
          </div>
          <p className="order-1 max-w-md justify-self-center font-display text-[1.6rem] italic leading-snug text-[#1c1a17] sm:text-[1.8rem] lg:order-2 lg:px-2">
            We're VertexAI — award-winning design intelligence with many moons of
            experience. We craft spaces that captivate and resonate with purpose.
          </p>
          <div className="order-3 aspect-[3/4] w-full max-w-sm overflow-hidden bg-[#e7e0d4] lg:order-3 lg:max-w-none lg:justify-self-end">
            <img src={INTRO_IMAGES.right} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ SCROLLSTORY */
/**
 * Pinned scroll-storytelling section. The centered text stays put while four
 * images rise into place one after another as the user scrolls; then the final
 * image expands to fill the whole viewport before the page moves on.
 * Driven by a sticky stage + scroll-progress scrub (no extra libraries).
 */
const STORY_IMAGES = {
  a: CDN + "hf_20260629_061857_7a50203f-c522-4cc6-8efa-4b9ca150bac8.png", // tea
  b: CDN + "hf_20260629_062057_ccaa0c50-8ba2-4ebf-a7ab-4457ffad98b4.png", // reader
  c: CDN + "hf_20260629_062054_e1093e72-2fcb-4486-9de5-a7ab318a2da6.png", // dancer
  d: HERO_IMAGE, // painted woman in coral fur — expands to fill the screen
};

function ScrollStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const r1 = useRef<HTMLDivElement>(null);
  const r2 = useRef<HTMLDivElement>(null);
  const r3 = useRef<HTMLDivElement>(null);
  const exRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
    const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    let raf = 0;

    const rise = (el: HTMLElement | null, reveal: number) => {
      if (!el) return;
      el.style.opacity = String(reveal);
      el.style.transform = `translateY(${(1 - reveal) * 72}px)`;
    };

    const render = () => {
      raf = 0;
      const total = section.offsetHeight - window.innerHeight;
      const p = total > 0 ? clamp(-section.getBoundingClientRect().top / total) : 0;

      let R1 = seg(p, 0.04, 0.18);
      let R2 = seg(p, 0.18, 0.32);
      let R3 = seg(p, 0.32, 0.46);
      let R4 = seg(p, 0.46, 0.6); // expander rises like the others
      let E = seg(p, 0.64, 0.98); // …then expands to fullscreen
      if (reduce) {
        R1 = R2 = R3 = R4 = 1;
        E = 0; // static composition, no pinned expansion
      }

      rise(r1.current, R1);
      rise(r2.current, R2);
      rise(r3.current, R3);

      const ex = exRef.current;
      if (ex) {
        ex.style.opacity = String(R4);
        ex.style.transform = `translateY(${(1 - R4) * 72}px)`;
        ex.style.left = lerp(70, 0, E) + "%";
        ex.style.top = lerp(58, 0, E) + "%";
        ex.style.width = lerp(13, 100, E) + "%";
        ex.style.height = lerp(26, 100, E) + "%";
      }
      if (textRef.current) textRef.current.style.opacity = String(1 - E);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };
    render();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    section.querySelectorAll("img").forEach((im) => {
      if (!(im as HTMLImageElement).complete)
        im.addEventListener("load", onScroll, { once: true });
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#f4f0e9]" style={{ height: "480vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* text — stays in place */}
        <div
          ref={textRef}
          className="absolute inset-0 z-20 mx-auto flex max-w-3xl flex-col items-center justify-center px-6 text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c9803f]">
            Designed around you
          </span>
          <h2 className="mt-6 font-body text-3xl font-medium leading-[1.18] tracking-tight text-[#1c1a17] sm:text-4xl lg:text-[2.6rem]">
            Mastery of the most advanced design tools, combined with tailor-made
            care — to guide you through a space shaped entirely around{" "}
            <span className="font-display italic">your</span> needs.
          </h2>
          <a
            href="#lookbook"
            className="mt-10 inline-flex items-center rounded-2xl px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-[#1c1a17] ring-1 ring-black/20 transition hover:bg-black/[0.05]"
          >
            Our process
          </a>
        </div>

        {/* risers */}
        <div ref={r1} className="absolute z-10 overflow-hidden shadow-lg shadow-black/10" style={{ left: "20%", top: "12%", width: 156, height: 200, opacity: 0 }}>
          <img src={STORY_IMAGES.a} alt="" className="h-full w-full object-cover" />
        </div>
        <div ref={r2} className="absolute z-10 overflow-hidden shadow-lg shadow-black/10" style={{ left: "75%", top: "34%", width: 156, height: 208, opacity: 0 }}>
          <img src={STORY_IMAGES.b} alt="" className="h-full w-full object-cover" />
        </div>
        <div ref={r3} className="absolute z-10 overflow-hidden shadow-lg shadow-black/10" style={{ left: "11%", top: "58%", width: 168, height: 216, opacity: 0 }}>
          <img src={STORY_IMAGES.c} alt="" className="h-full w-full object-cover" />
        </div>

        {/* expander — rises, then fills the screen */}
        <div ref={exRef} className="absolute z-30 overflow-hidden shadow-2xl shadow-black/20" style={{ left: "70%", top: "58%", width: "13%", height: "26%", opacity: 0 }}>
          <img src={STORY_IMAGES.d} alt="" className="h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- SHARED */
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
