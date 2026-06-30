import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, Sparkles } from "lucide-react";
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
      <Shift />
      <Slideshow />
      <ScrollStory />
      <Faq />
      <Footer />
    </div>
  );
}

/* ------------------------------------------------------------------ NAV */
function Nav() {
  // `scrolled` = past the hero (switch to the light variant)
  // `hidden`   = hide on scroll-down, reveal on scroll-up (only past the hero)
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const heroEnd = window.innerHeight * 0.85;
      const past = y > heroEnd;
      setScrolled(past);
      if (!past) {
        setHidden(false); // always visible over the hero
      } else if (y > lastY.current + 6) {
        setHidden(true); // scrolling down → hide
      } else if (y < lastY.current - 6) {
        setHidden(false); // scrolling up → reveal
      }
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${
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
      </div>

      {/* carousel — full-bleed, edge to edge (no max width) */}
      <div
        ref={trackRef}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-smooth pb-2"
      >
        {SLIDES.map((s) => (
          <figure
            key={s.id}
            data-card
            className="w-[86%] shrink-0 snap-start sm:w-[58%] lg:w-[39%] xl:w-[30%]"
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

      <div className="mx-auto max-w-[88rem] px-6 lg:px-10">
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
    <section id="work" className="relative overflow-hidden bg-[#f4f0e9] pb-20 pt-24 lg:pb-28 lg:pt-28">
      {/* corner labels */}
      <span className="absolute left-6 top-[30%] hidden text-xs font-semibold uppercase leading-relaxed tracking-[0.16em] text-[#1c1a17] lg:block lg:left-10">
        Vertex
        <br />
        Studio
      </span>
      <span className="absolute right-6 top-[46%] hidden text-right text-xs font-semibold uppercase leading-relaxed tracking-[0.16em] text-[#1c1a17] lg:block lg:right-10">
        Selected work
        <br />
        from 2021–2025
      </span>

      {/* headline cluster — sized to match the hero H1 */}
      <Reveal className="relative z-10 mx-auto max-w-[88rem] px-6 text-center lg:px-10">
        <p className="ar text-xs font-semibold uppercase tracking-[0.26em] text-[#1c1a17]" style={si(0)}>
          Welcome to the
        </p>
        <h2 className="mx-auto mt-5 max-w-6xl font-body text-[3.15rem] font-extrabold uppercase leading-[1.0] tracking-tight text-[#1c1a17] sm:text-[5.25rem] lg:text-[6.3rem]">
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

      {/* images band + paragraph — images bleed to the screen edges */}
      <Reveal className="relative mt-16 flex flex-col items-center gap-10 lg:mt-20 lg:block lg:min-h-[600px] lg:gap-0">
        {/* left image — flush to the left edge on desktop (animates second) */}
        <div className="ar aspect-[4/3] w-full max-w-md overflow-hidden bg-[#e7e0d4] lg:absolute lg:bottom-0 lg:left-0 lg:aspect-auto lg:h-[420px] lg:w-[28%] lg:max-w-none" style={si(2)}>
          <img src={INTRO_IMAGES.left} alt="" className="h-full w-full object-cover" />
        </div>

        {/* intro paragraph — nudged left of centre */}
        <p className="max-w-md px-6 font-display text-[1.5rem] italic leading-snug text-[#1c1a17] sm:text-[1.7rem] lg:absolute lg:left-[40%] lg:top-1/2 lg:w-[26%] lg:max-w-xs lg:-translate-x-1/2 lg:-translate-y-1/2 lg:px-0">
          We're VertexAI — award-winning design intelligence with many moons of
          experience. We craft spaces that captivate and resonate with purpose.
        </p>

        {/* right image — flush to the right edge on desktop, larger (animates first) */}
        <div className="ar aspect-[3/4] w-full max-w-md overflow-hidden bg-[#e7e0d4] lg:absolute lg:bottom-0 lg:right-0 lg:aspect-auto lg:h-[620px] lg:w-[38%] lg:max-w-none" style={si(0)}>
          <img src={INTRO_IMAGES.right} alt="" className="h-full w-full object-cover" />
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------------------------------------------------------- SHIFT */
// Image used to fill the giant "WHAT WE SHIFT" display text (background-clip).
const SHIFT_TEXT_IMAGE = HERO_IMAGE;

function Shift() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "America/New_York",
        }).format(new Date())
      );
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="approach" className="relative overflow-hidden bg-[#f4f0e9] pt-20 lg:pt-28">
      <div className="mx-auto max-w-[88rem] px-6 lg:px-10">
        {/* top meta row */}
        <div className="flex items-start justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1c1a17] sm:text-xs">
          <span className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 bg-[#1f5130]" />
            Studio Positioning
          </span>
          <span className="text-right tabular-nums">/ New York, USA — {time}</span>
        </div>
        <div className="mt-2 flex justify-end text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1c1a17] sm:text-xs">
          <span>02</span>
        </div>
        {/* divider with centre tick */}
        <div className="relative mt-3 border-t border-[#1c1a17]/40">
          <span className="absolute left-1/2 top-0 h-2 w-px -translate-x-1/2 bg-[#1c1a17]/40" />
        </div>

        {/* headline + services subtext */}
        <Reveal>
          <h2
            className="ar ml-auto mt-12 max-w-4xl text-balance text-right font-body text-[clamp(1.55rem,3.7vw,2.8rem)] font-extrabold leading-[1.12] tracking-[-1px] text-[#1c1a17] lg:mt-16"
            style={si(0)}
          >
            A design{" "}
            <span className="font-display font-normal italic">intelligence</span>{" "}
            studio. Where{" "}
            <span className="font-display font-normal italic">imagination</span>,
            play, and storytelling shape what comes next.
          </h2>
          <p
            className="ar mt-12 max-w-xl text-base font-semibold leading-snug text-[#1c1a17] lg:text-lg"
            style={si(1)}
          >
            We craft spaces shown at international showcases. We build immersive
            rooms and installations. We guide brands through the intersection of
            design and technology. We produce work across many mediums. We host
            workshops and retreats for teams and communities. We gather people
            around intimate dinners, salons, and curated gatherings.
          </p>
        </Reveal>

        {/* giant image-filled display text — centred, always fits the width */}
        <h3
          className="mx-auto mt-20 max-w-full select-none break-words bg-clip-text text-center font-body text-[clamp(2.4rem,8.4vw,7.5rem)] font-black uppercase leading-[0.92] tracking-[-2px] text-transparent lg:mt-28"
          style={{
            backgroundImage: `url(${SHIFT_TEXT_IMAGE})`,
            backgroundSize: "cover",
            backgroundPosition: "center 35%",
            WebkitBackgroundClip: "text",
          }}
        >
          Future is Black
        </h3>
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

/* ------------------------------------------------------------------ FAQ */
const FAQS = [
  {
    q: "What exactly is VertexAI?",
    a: "A design-intelligence studio. We combine the most advanced tools with a designer's eye to imagine, plan and refine spaces — guiding you from a vague idea to a finished, livable room.",
  },
  {
    q: "How does the design process work?",
    a: "You describe the feeling you want — by photo or simply in conversation. We propose distinct directions: palettes, layouts and curated pieces. You nudge anything in plain language, then export the plan, palette and shopping list.",
  },
  {
    q: "What kinds of spaces can you design?",
    a: "Anything from a single room to complex, irregular and commercial spaces. The harder the brief, the more our tooling helps — circulation, scale and light are all handled to real dimensions.",
  },
  {
    q: "Can I use my own inspiration and budget?",
    a: "Always. VertexAI adapts to your taste, learns what you reach for and what you reject, and keeps every suggestion within the budget you set.",
  },
  {
    q: "Do you work with brands and studios?",
    a: "Yes — we partner with studios and brands on immersive installations, showcases and large-scale fit-outs, and we license the platform for teams.",
  },
  {
    q: "How do I get started?",
    a: "Start a free decoration from the top of the page. No commitment — watch a blank room become somewhere you actually want to be.",
  },
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="scroll-mt-24 bg-[#f4f0e9] py-24 lg:py-28">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <Reveal className="text-center">
          <span className="ar block text-xs font-semibold uppercase tracking-[0.22em] text-[#c9803f]" style={si(0)}>
            Questions
          </span>
          <h2 className="ar mt-4 font-body text-3xl font-medium tracking-tight text-[#1c1a17] sm:text-4xl lg:text-[2.75rem]" style={si(1)}>
            Frequently <span className="font-display italic">asked</span>.
          </h2>
        </Reveal>

        <div className="mt-12 border-b border-black/10">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <span className="text-lg font-semibold tracking-tight text-[#1c1a17]">
                    {f.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 flex-none text-[#1c1a17] transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid overflow-hidden transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"
                  }`}
                >
                  <p className="min-h-0 max-w-xl text-[15px] leading-relaxed text-[#5b554c]">
                    {f.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- FOOTER */
// Full-bleed painterly landscape at the base of the footer (cream sky to
// match the site background). Swapped to the generated image once ready.
const FOOTER_IMAGE =
  CDN + "hf_20260629_173227_2bee134e-66a0-4919-8a39-ade7a8669cb1.png";

const FOOTER_COLS = [
  {
    h: "Explore",
    links: [
      { label: "The Work", href: "#work" },
      { label: "Lookbook", href: "#lookbook" },
      { label: "Process", href: "#work" },
      { label: "Pricing", href: "#top" },
    ],
  },
  {
    h: "Studio",
    links: [
      { label: "About", href: "#top" },
      { label: "Team", href: "#top" },
      { label: "Careers", href: "#top" },
      { label: "Contact", href: "#top" },
    ],
  },
  {
    h: "Resources",
    links: [
      { label: "Journal", href: "#top" },
      { label: "Guides", href: "#top" },
      { label: "Help centre", href: "#top" },
      { label: "Status", href: "#top" },
    ],
  },
  {
    h: "Social",
    links: [
      { label: "Instagram", href: "#top" },
      { label: "X / Twitter", href: "#top" },
      { label: "LinkedIn", href: "#top" },
      { label: "Behance", href: "#top" },
    ],
  },
];

function Footer() {
  return (
    <footer id="company" className="scroll-mt-24 border-t border-black/[0.08] bg-[#f4f0e9] text-[#1c1a17]">
      <div className="mx-auto max-w-[88rem] px-6 pb-16 pt-20 lg:px-10 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          {/* brand + newsletter */}
          <div className="lg:pr-8">
            <div className="flex items-center gap-2.5">
              <Logo dark />
              <span className="text-lg font-semibold tracking-tight">VertexAI</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#5b554c]">
              Redefine space with intelligent design. Imagine, plan and refine
              through natural conversation.
            </p>
            <form
              className="mt-6 flex max-w-xs items-center gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder="Your email"
                className="min-w-0 flex-1 border-b border-black/20 bg-transparent py-2 text-sm outline-none placeholder:text-[#8a8275] focus:border-[#1c1a17]"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#1c1a17] px-4 py-2 text-sm font-semibold text-[#f4f0e9] transition hover:bg-[#000]"
              >
                Join
              </button>
            </form>
          </div>

          {/* link columns */}
          {FOOTER_COLS.map((c) => (
            <div key={c.h}>
              <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a8275]">
                {c.h}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-[#3a352e] transition hover:text-[#1c1a17]"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-black/[0.08] pt-6 text-sm text-[#8a8275] sm:flex-row">
          <span>© {new Date().getFullYear()} VertexAI. All rights reserved.</span>
          <span className="flex gap-6">
            <a href="#top" className="transition hover:text-[#1c1a17]">Privacy</a>
            <a href="#top" className="transition hover:text-[#1c1a17]">Terms</a>
            <a href="#top" className="transition hover:text-[#1c1a17]">Cookies</a>
          </span>
        </div>
      </div>

      {/* full-bleed painterly landscape at the base */}
      <div className="w-full overflow-hidden">
        <img
          src={FOOTER_IMAGE}
          alt=""
          className="block h-[28vw] max-h-[420px] min-h-[200px] w-full object-cover"
        />
      </div>
    </footer>
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
