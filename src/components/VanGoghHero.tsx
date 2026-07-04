import { useEffect, useState } from "react";

/*
 * Van Gogh — creative-studio hero.
 *
 * Full-bleed textured artwork (Higgsfield-generated 16:9 image), a compact
 * floating white pill nav centered at the top, a two-line Inter Display
 * headline with tight tracking, sub-copy pinned bottom-left and the CTA
 * pinned bottom-right. Fluid/responsive with the content constrained to a
 * max width.
 */

// 16:9 textured-artwork background, generated on Higgsfield from the
// user's reference (text removed, canvas extended to widescreen).
const BG_IMG =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3A4FMCrm8jYjCnPYN9rbcZn81hc/hf_20260704_172803_01efc6b3-8f47-466f-8092-1d0e0951efdd.png";
// Fallback: the imported source artwork (pre-extension), in case the
// primary render URL is ever unreachable.
const BG_IMG_FALLBACK =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_3A4FMCrm8jYjCnPYN9rbcZn81hc/c020be43-b724-4913-9559-9e70c8a94f30.png";
// Static image hero — no video.
const BG_VIDEO = "";

const NAV_LINKS = ["Home", "About", "Services", "Blog", "FAQ"];

export default function VanGoghHero() {
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
          onError={(e) => {
            const el = e.currentTarget;
            if (el.src !== BG_IMG_FALLBACK) el.src = BG_IMG_FALLBACK;
          }}
        />
      )}
      {/* fitted dark scrim over the video so the copy stays fully legible */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "rgba(0,0,0,0.3)" }}
      />
      {/* soft extra gradient along the bottom, behind the copy */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%]"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.28), rgba(0,0,0,0))",
        }}
      />

      {/* ---------- floating pill nav, top middle ---------- */}
      {/* compact pill nav, sized to its content and centered */}
      <header className="absolute left-1/2 top-4 z-30 w-[calc(100%-24px)] -translate-x-1/2 md:top-8 md:w-auto md:max-w-[calc(100%-48px)]">
        <nav className="flex items-center justify-between gap-4 rounded-2xl bg-white py-2.5 pl-6 pr-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.18)] md:justify-start md:gap-10 md:pl-8">
          <a
            href="#/vangogh"
            className="text-[22px] font-medium tracking-[-0.02em] text-[#1d211c] md:text-[24px]"
          >
            Van Gogh.
          </a>

          <div className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((l, i) => (
              <a
                key={l}
                href="#/vangogh"
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
              href="#/vangogh"
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
                href="#/vangogh"
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
            Painting the future of
            <br />
            <span className="text-white/70">creative expression</span>
          </h1>

          <div className="mt-14 flex flex-col justify-between gap-8 md:mt-24 md:flex-row md:items-end">
            <p className="max-w-[460px] text-[15px] leading-[1.45] tracking-[-0.01em] text-white/95 md:text-[17px]">
              Van Gogh is a creative studio where timeless artistry meets
              modern craft &#8212; turning bold ideas into vivid, textured
              experiences for brands that dare to be felt.
            </p>
            <a
              href="#/vangogh"
              className="self-start whitespace-nowrap rounded-xl bg-white px-7 py-4 text-[16px] tracking-[-0.01em] text-[#161616] shadow-[0_10px_40px_rgba(0,0,0,0.2)] transition-transform hover:scale-[1.03] md:self-end md:text-[17px]"
            >
              Explore The Gallery
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
