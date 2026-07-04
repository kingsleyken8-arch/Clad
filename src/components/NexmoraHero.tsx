import { useEffect, useState } from "react";

/*
 * Nexmora — smart-manufacturing hero.
 *
 * Full-bleed monochrome machine footage (Higgsfield video with an image
 * poster/fallback), a floating white pill nav centered at the top, a
 * two-line Inter Display headline with tight tracking, sub-copy pinned
 * bottom-left and the CTA pinned bottom-right. Fluid/responsive with the
 * content constrained to a max width.
 */

const BG_IMG =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3A4FMCrm8jYjCnPYN9rbcZn81hc/hf_20260704_160703_f823d425-0139-4c83-8505-7882f0308669.png";
const BG_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3A4FMCrm8jYjCnPYN9rbcZn81hc/hf_20260704_161224_0267978a-9c04-408b-a556-ff5153a39689.mp4";

const NAV_LINKS = ["Home", "About", "Services", "Blog", "FAQ"];

export default function NexmoraHero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [videoOk, setVideoOk] = useState(true);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const showVideo = Boolean(BG_VIDEO) && videoOk && !reducedMotion;

  // Close the mobile menu when resizing up to desktop.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  return (
    <div
      className="font-interdisplay relative min-h-screen w-full overflow-hidden bg-[#818181] text-white"
      style={{ minHeight: "100dvh" }}
    >
      {/* ---------- background media ---------- */}
      {showVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={BG_VIDEO}
          poster={BG_IMG}
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoOk(false)}
        />
      ) : (
        <img
          className="absolute inset-0 h-full w-full select-none object-cover"
          src={BG_IMG}
          alt=""
          draggable={false}
        />
      )}
      {/* soft legibility gradient along the bottom */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%]"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.38), rgba(0,0,0,0))",
        }}
      />

      {/* ---------- floating pill nav, top middle ---------- */}
      <header className="absolute left-1/2 top-4 z-30 w-[min(1460px,calc(100%-24px))] -translate-x-1/2 md:top-8 md:w-[min(1460px,calc(100%-96px))]">
        <nav className="flex items-center justify-between rounded-2xl bg-white py-2.5 pl-6 pr-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.18)] md:pl-9">
          <a
            href="#/nexmora"
            className="text-[22px] font-medium tracking-[-0.02em] text-[#1d211c] md:text-[24px]"
          >
            Nexmora.
          </a>

          <div className="hidden items-center gap-9 md:flex">
            {NAV_LINKS.map((l, i) => (
              <a
                key={l}
                href="#/nexmora"
                className={
                  "text-[16px] tracking-[-0.01em] transition-colors " +
                  (i === 0
                    ? "text-[#1d211c] underline decoration-[1.5px] underline-offset-[6px]"
                    : "text-[#3f423e] hover:text-[#1d211c]")
                }
              >
                {l}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#/nexmora"
              className="rounded-xl bg-[#2e3a2c] px-6 py-3 text-[16px] tracking-[-0.01em] text-white transition-colors hover:bg-[#232c22] md:px-7 md:py-3.5"
            >
              Contact Us
            </a>
            {/* mobile hamburger */}
            <button
              className="grid h-11 w-11 place-items-center rounded-xl text-[#1d211c] md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <div className="space-y-1.5">
                <span
                  className={`block h-[2px] w-5 bg-current transition-transform ${menuOpen ? "translate-y-[7.5px] rotate-45" : ""}`}
                />
                <span className={`block h-[2px] w-5 bg-current ${menuOpen ? "opacity-0" : ""}`} />
                <span
                  className={`block h-[2px] w-5 bg-current transition-transform ${menuOpen ? "-translate-y-[7.5px] -rotate-45" : ""}`}
                />
              </div>
            </button>
          </div>
        </nav>

        {/* mobile dropdown */}
        {menuOpen && (
          <div className="mt-2 flex flex-col gap-1 rounded-2xl bg-white p-4 shadow-[0_10px_40px_rgba(0,0,0,0.18)] md:hidden">
            {NAV_LINKS.map((l, i) => (
              <a
                key={l}
                href="#/nexmora"
                onClick={() => setMenuOpen(false)}
                className={
                  "rounded-lg px-3 py-2.5 text-[16px] " +
                  (i === 0 ? "bg-[#f1f2f0] text-[#1d211c]" : "text-[#3f423e]")
                }
              >
                {l}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* ---------- hero copy ---------- */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="mx-auto w-full max-w-[1920px] px-5 pb-8 md:px-12 md:pb-12">
          {/* exactly two lines, tight tracking + line-height */}
          <h1
            className="font-light text-white"
            style={{
              fontSize: "clamp(2.4rem, 6.4vw, 6.5rem)",
              lineHeight: 1.07,
              letterSpacing: "-0.038em",
            }}
          >
            Engineering the future of
            <br />
            <span className="text-white/70">smart manufacturing</span>
          </h1>

          <div className="mt-14 flex flex-col justify-between gap-8 md:mt-24 md:flex-row md:items-end">
            <p className="max-w-[460px] text-[15px] leading-[1.45] tracking-[-0.01em] text-white/95 md:text-[17px]">
              Nexmora Industries integrates automation, robotics, and
              real&#8209;time data intelligence to create scalable,
              high&#8209;performance production ecosystems for global
              enterprises.
            </p>
            <a
              href="#/nexmora"
              className="self-start whitespace-nowrap rounded-xl bg-white px-7 py-4 text-[16px] tracking-[-0.01em] text-[#161616] shadow-[0_10px_40px_rgba(0,0,0,0.2)] transition-transform hover:scale-[1.03] md:self-end md:text-[17px]"
            >
              Explore Our Solutions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
