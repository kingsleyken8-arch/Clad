import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Lock, Menu, X } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3A4FMCrm8jYjCnPYN9rbcZn81hc/hf_20260626_144824_263da7e2-a322-4e93-a6d9-b8098092d02f.mp4";

const NAV_LINKS = [
  { label: "FEATURES", href: "#features" },
  { label: "HOW IT WORKS", href: "#how" },
  { label: "PLANS", href: "#plans" },
  { label: "REVIEWS", href: "#community" },
];

export default function WanderfulHero() {
  const videoBgRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // Header turns solid/dark once we pass the hero
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.82);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // GSAP mouse parallax
  useEffect(() => {
    const el = videoBgRef.current;
    if (!el) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const onMove = (e: MouseEvent) => {
      const mx = window.innerWidth / 2;
      const my = window.innerHeight / 2;
      tx = ((e.clientX - mx) / mx) * 20;
      ty = ((e.clientY - my) / my) * 20;
    };
    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      gsap.set(el, { x: cx, y: cy });
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Subtle scroll-zoom on the hero video
  useEffect(() => {
    const el = videoBgRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scale: 1.08 },
        {
          scale: 1.22,
          ease: "none",
          scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: true },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const link = scrolled
    ? "text-black/70 hover:text-black"
    : "text-white/90 hover:text-white";
  const pill = scrolled
    ? "border border-black/10 bg-black/[0.04]"
    : "liquid-glass";

  return (
    <>
      {/* Background video */}
      <div ref={videoBgRef} className="fixed inset-0 z-0 origin-center scale-[1.08]">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          onLoadedMetadata={() => {
            if (videoRef.current) videoRef.current.playbackRate = 1.25;
          }}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Header */}
      <header
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 transition-all duration-300 sm:px-10 ${
          scrolled
            ? "bg-white/85 py-4 shadow-[0_1px_0_rgba(0,0,0,0.06)] backdrop-blur-md"
            : "bg-transparent py-7"
        }`}
      >
        <a
          href="#top"
          className={`text-[17px] font-semibold tracking-tight transition-colors ${
            scrolled ? "text-[#16151c]" : "text-white"
          }`}
        >
          Milo<sup>TM</sup>
        </a>

        <nav className={`hidden items-center gap-1 rounded-full px-2 py-2 md:flex ${pill}`}>
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={`rounded-full px-4 py-1.5 text-[11px] font-medium tracking-[0.12em] transition-colors duration-200 ${link}`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#plans"
            className={`rounded-full px-5 py-2.5 text-[11px] font-medium tracking-[0.12em] transition-colors ${pill} ${link}`}
          >
            GET STARTED
          </a>
          <button
            aria-label="Menu"
            onClick={() => setMenuOpen((v) => !v)}
            className={`md:hidden ${scrolled ? "text-black" : "text-white"}`}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-black/95 backdrop-blur-md md:hidden">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-2xl font-medium tracking-wide text-white"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#plans"
            onClick={() => setMenuOpen(false)}
            className="mt-2 rounded-full bg-white px-7 py-3 text-sm font-medium text-black"
          >
            Get started
          </a>
        </div>
      )}

      {/* Hero */}
      <section id="top" className="relative z-10 h-screen">
        <div
          className={`absolute inset-x-0 px-6 text-center transition-all duration-1000 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ top: "120px" }}
        >
          <h1
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(40px, 5.4vw, 72px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            <span className="block text-white">Meet Milo, your AI agent.</span>
            <span className="block" style={{ color: "rgba(255,255,255,0.55)" }}>
              It plans, decides, and gets it done.
            </span>
          </h1>
        </div>

        <div
          className={`absolute inset-x-0 bottom-14 flex flex-col items-center gap-6 px-6 transition-all delay-300 duration-1000 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <p className="max-w-[620px] text-center text-[15px] leading-relaxed">
            <span className="text-white">
              Milo understands your goals and takes action across your tools —
              researching, writing, and automating the busywork.
            </span>
            <span className="text-white/55">
              {" "}
              Always on, always learning, entirely yours.
            </span>
          </p>
          <a
            href="#plans"
            className="rounded-full bg-white px-8 py-3.5 text-[15px] font-medium text-black transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_32px_4px_rgba(255,255,255,0.2)] active:scale-[0.97]"
          >
            Try Milo free
          </a>
          <div className="flex items-center gap-2">
            <Lock size={13} strokeWidth={1.5} className="text-white/70" />
            <span className="text-[11px] font-medium tracking-[0.14em] text-white/70">
              SECURE BY DESIGN. ZERO DATA LEAKS.
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
