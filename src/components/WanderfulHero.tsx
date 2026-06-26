import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Lock } from "lucide-react";

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3A4FMCrm8jYjCnPYN9rbcZn81hc/hf_20260626_144824_263da7e2-a322-4e93-a6d9-b8098092d02f.mp4";

const NAV_LINKS = ["JOURNEY", "BENEFITS", "JOURNAL", "GUIDEBOOK"];

export default function WanderfulHero() {
  const videoBgRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    const el = videoBgRef.current;
    if (!el) return;
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0, raf = 0;
    const onMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetX = ((e.clientX - cx) / cx) * 20;
      targetY = ((e.clientY - cy) / cy) * 20;
    };
    const tick = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      gsap.set(el, { x: currentX, y: currentY });
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMouseMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Background video (fixed, full screen) */}
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
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-10 py-8">
        <a href="#" className="text-[17px] font-semibold tracking-tight text-white">
          Wanderful<sup>TM</sup>
        </a>
        <nav className="liquid-glass hidden items-center gap-1 rounded-full px-2 py-2 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="rounded-full px-4 py-1.5 text-[11px] font-medium tracking-[0.12em] text-white/90 transition-colors duration-200 hover:text-white"
            >
              {link}
            </a>
          ))}
        </nav>
        <a
          href="#"
          className="liquid-glass rounded-full px-5 py-2.5 text-[11px] font-medium tracking-[0.12em] text-white/90 transition-colors hover:text-white"
        >
          GET ROAMING
        </a>
      </header>

      {/* Hero (one viewport tall, transparent so the video shows through) */}
      <section className="relative z-10 h-screen">
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
            <span className="block text-white">Venture without edges.</span>
            <span className="block" style={{ color: "rgba(255,255,255,0.55)" }}>
              Uncover with keen instinct.
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
              Our smart itineraries shape around you — your rhythm, your vibe,
              your hunger for adventure.
            </span>
            <span className="text-white/55">
              {" "}
              Each getaway is tailored, seamless, and wholly yours.
            </span>
          </p>
          <button
            type="button"
            className="rounded-full bg-white px-8 py-3.5 text-[15px] font-medium text-black transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_32px_4px_rgba(255,255,255,0.2)] active:scale-[0.97]"
          >
            Plan my escape today
          </button>
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
