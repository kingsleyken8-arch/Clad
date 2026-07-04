import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { roundedPath, Pt } from "../lib/shape";

/*
 * LOST — cyber-editorial hero.
 *
 * The whole composition is laid out on a fixed 1600×900 design stage that is
 * uniformly scaled to fit the viewport. That guarantees the poster's cut
 * shapes, notches and curves hold their exact proportions at every screen
 * size — nothing reflows, nothing distorts.
 */

const STAGE_W = 1600;
const STAGE_H = 900;

// Transparent-PNG hero asset (chrome hand + rose), generated on Higgsfield
// and background-removed there. Overridable for local dev via VITE_HAND_SRC.
const HAND_SRC =
  (import.meta.env.VITE_HAND_SRC as string | undefined) ??
  "https://d8j0ntlcm91z4.cloudfront.net/user_3A4FMCrm8jYjCnPYN9rbcZn81hc/hf_20260704_143303_c01b1a8a-3021-4cd5-b84e-4edb4eb3840e.png";
const HAND_SRC_FALLBACK =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3A4FMCrm8jYjCnPYN9rbcZn81hc/hf_20260704_143306_eba45f90-a7a4-4bc2-bcce-708eb731e3f8.png";

/* ------------------------------------------------------------------ */
/* Card geometry                                                       */
/* ------------------------------------------------------------------ */

// Main "LOST" card — 520×620. Clockwise from the top-left corner:
// tag notch on the top edge, big chamfer cut at top-right, a bitten
// slot on the right edge, and a slot on the left edge for "EAST BLUE".
const LOST_CARD: Pt[] = [
  { x: 0, y: 0, r: 30 },
  { x: 150, y: 0, r: 12 },
  { x: 172, y: 46, r: 16 },
  { x: 248, y: 46, r: 16 },
  { x: 270, y: 0, r: 12 },
  { x: 426, y: 0, r: 16 },
  { x: 520, y: 104, r: 30 },
  { x: 520, y: 288, r: 12 },
  { x: 494, y: 302, r: 14 },
  { x: 494, y: 384, r: 14 },
  { x: 520, y: 398, r: 12 },
  { x: 520, y: 620, r: 34 },
  { x: 0, y: 620, r: 34 },
  { x: 0, y: 470, r: 10 },
  { x: 20, y: 470, r: 12 },
  { x: 20, y: 392, r: 12 },
  { x: 0, y: 392, r: 10 },
];

// "COUNTING ON YOU" card — 460×560. Chamfered top-left, angled cut
// bottom-right, bitten slot on the left edge.
const COUNT_CARD: Pt[] = [
  { x: 96, y: 0, r: 18 },
  { x: 460, y: 0, r: 30 },
  { x: 460, y: 452, r: 26 },
  { x: 376, y: 560, r: 24 },
  { x: 0, y: 560, r: 30 },
  { x: 0, y: 342, r: 10 },
  { x: 22, y: 342, r: 12 },
  { x: 22, y: 252, r: 12 },
  { x: 0, y: 252, r: 10 },
  { x: 0, y: 92, r: 18 },
];

// Dark steel mid-layer shapes peeking through the cuts.
const STEEL_A: Pt[] = [
  { x: 0, y: 0, r: 36 },
  { x: 440, y: 0, r: 20 },
  { x: 560, y: 104, r: 30 },
  { x: 560, y: 330, r: 36 },
  { x: 0, y: 330, r: 36 },
];
const STEEL_B: Pt[] = [
  { x: 0, y: 0, r: 36 },
  { x: 440, y: 0, r: 36 },
  { x: 440, y: 470, r: 36 },
  { x: 112, y: 470, r: 24 },
  { x: 0, y: 372, r: 32 },
];

// Hang-tag sitting inside the top notch of the LOST card, with a
// punched round hole (evenodd) showing the dark backdrop through it.
const TAG: Pt[] = [
  { x: 0, y: 0, r: 8 },
  { x: 108, y: 0, r: 8 },
  { x: 88, y: 42, r: 12 },
  { x: 20, y: 42, r: 12 },
];

// "color tone." plate — pill-ish with a stepped left edge.
const TONE_CARD: Pt[] = [
  { x: 26, y: 0, r: 26 },
  { x: 400, y: 0, r: 40 },
  { x: 400, y: 104, r: 40 },
  { x: 26, y: 104, r: 26 },
  { x: 0, y: 78, r: 14 },
  { x: 0, y: 26, r: 14 },
];

/* ------------------------------------------------------------------ */
/* Small parts                                                         */
/* ------------------------------------------------------------------ */

function ShapedCard({
  pts,
  w,
  h,
  fill,
  className,
  style,
  shadow,
  children,
}: {
  pts: Pt[];
  w: number;
  h: number;
  fill: string;
  className?: string;
  style?: React.CSSProperties;
  shadow?: string;
  children?: React.ReactNode;
}) {
  const d = useMemo(() => roundedPath(pts), [pts]);
  return (
    <div className={className} style={{ position: "absolute", width: w, height: h, ...style }}>
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        style={{ position: "absolute", inset: 0, filter: shadow, overflow: "visible" }}
        aria-hidden
      >
        <path d={d} fill={fill} />
      </svg>
      <div style={{ position: "absolute", inset: 0 }}>{children}</div>
    </div>
  );
}

// Deterministic fake barcode.
function Barcode({
  w,
  h,
  seed,
  color = "#161616",
  style,
}: {
  w: number;
  h: number;
  seed: number;
  color?: string;
  style?: React.CSSProperties;
}) {
  const bars = useMemo(() => {
    let s = seed;
    const rnd = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
    const out: { x: number; bw: number }[] = [];
    let x = 0;
    while (x < w - 2) {
      const bw = 1 + Math.floor(rnd() * 4);
      if (rnd() > 0.42) out.push({ x, bw });
      x += bw + 1;
    }
    return out;
  }, [w, seed]);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={style} aria-hidden>
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={0} width={b.bw} height={h} fill={color} />
      ))}
    </svg>
  );
}

function Asterisk({ size = 22 }: { size?: number }) {
  return (
    <span
      className="grid place-items-center rounded-full border border-dashed border-white/80"
      style={{ width: size, height: size, fontSize: size * 0.52, lineHeight: 1 }}
    >
      ✳
    </span>
  );
}

// The sliced "LOST / LOST" glitch logotype.
function LostLogo() {
  const word = "LOST";
  return (
    <div className="font-display select-none" style={{ color: "#181818" }}>
      {/* glitched top line: two horizontal slices, offset against each other */}
      <div style={{ position: "relative", height: 86, width: 260 }}>
        <span
          className="font-display absolute left-0 top-0"
          style={{
            fontSize: 96,
            lineHeight: "86px",
            letterSpacing: "-0.01em",
            clipPath: "inset(0 0 52% 0)",
            transform: "translateX(10px)",
          }}
        >
          {word}
        </span>
        <span
          className="font-display absolute left-0 top-0"
          style={{
            fontSize: 96,
            lineHeight: "86px",
            letterSpacing: "-0.01em",
            clipPath: "inset(48% 0 0 0)",
          }}
        >
          {word}
        </span>
      </div>
      <div style={{ fontSize: 96, lineHeight: "88px", letterSpacing: "-0.01em" }}>{word}</div>
    </div>
  );
}

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export default function LostHero() {
  const frameRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [tone, setTone] = useState(0);

  // Uniform contain-fit of the 1600×900 stage.
  useEffect(() => {
    const fit = () =>
      setScale(Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // Entrance + idle animation, and a light mouse parallax.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    // Skip animation for reduced-motion users and static captures (?noanim).
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      new URLSearchParams(window.location.search).has("noanim")
    )
      return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".js-steel", { opacity: 0, scale: 0.96, duration: 0.9, stagger: 0.08 })
        .from(".js-card", { y: 60, opacity: 0, duration: 1, stagger: 0.14 }, "-=0.5")
        .from(".js-hand", { y: 160, opacity: 0, duration: 1.4, ease: "power4.out" }, "-=0.7")
        .from(".js-glass", { opacity: 0, x: -30, duration: 0.9 }, "-=0.9")
        .from(".js-pill", { scale: 0.7, opacity: 0, duration: 0.6, ease: "back.out(2)" }, "-=0.8")
        .from(".js-rail", { opacity: 0, duration: 1, stagger: 0.06 }, "-=0.8")
        .from(".js-tone", { y: 40, opacity: 0, duration: 0.8 }, "-=0.6");

      gsap.to(".js-hand", {
        y: -12,
        duration: 3.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 2.8,
      });
    }, stage);

    const moveHand = gsap.quickTo(".js-hand", "x", { duration: 0.8, ease: "power3.out" });
    const moveGhost = gsap.quickTo(".js-ghost", "x", { duration: 1.2, ease: "power3.out" });
    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      moveHand(nx * 14);
      moveGhost(nx * -22);
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      ctx.revert();
    };
  }, []);

  const swatches = ["#c0392f", "#f3e3d7", "#141414", "#ffffff"];

  return (
    <div
      ref={frameRef}
      className="flex h-screen w-screen items-center justify-center overflow-hidden bg-[#0c0c0c]"
    >
      <div
        style={{
          width: STAGE_W * scale,
          height: STAGE_H * scale,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          ref={stageRef}
          style={{
            width: STAGE_W,
            height: STAGE_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            position: "absolute",
            top: 0,
            left: 0,
            background: "#111",
          }}
        >
          {/* ---------------- backdrop ---------------- */}
          <div className="halftone absolute inset-0 opacity-90" />
          <div
            className="halftone-fine absolute inset-0"
            style={{
              maskImage:
                "radial-gradient(700px 500px at 82% 18%, black, transparent 70%), radial-gradient(600px 500px at 8% 80%, black, transparent 70%)",
              WebkitMaskImage:
                "radial-gradient(700px 500px at 82% 18%, black, transparent 70%), radial-gradient(600px 500px at 8% 80%, black, transparent 70%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(1200px 800px at 50% 45%, transparent 55%, rgba(0,0,0,0.55))",
            }}
          />

          {/* ---------------- ghost typography ---------------- */}
          <div
            className="js-ghost font-display absolute select-none"
            style={{
              left: 70,
              top: -42,
              fontSize: 230,
              letterSpacing: "0.04em",
              color: "#242424",
              zIndex: 1,
            }}
          >
            ROSES
          </div>
          <div
            className="js-ghost font-display absolute select-none"
            style={{
              left: 430,
              top: 596,
              fontSize: 230,
              letterSpacing: "0.06em",
              color: "#232323",
              zIndex: 1,
            }}
          >
            POSSESSÉ
          </div>

          {/* ---------------- steel mid-layer ---------------- */}
          <ShapedCard
            pts={STEEL_A}
            w={560}
            h={330}
            fill="#3d3d3d"
            className="js-steel"
            style={{ left: 700, top: 64, zIndex: 4 }}
          >
            <div className="halftone-fine absolute inset-0 opacity-40" style={{ borderRadius: 36 }} />
          </ShapedCard>
          <ShapedCard
            pts={STEEL_B}
            w={440}
            h={470}
            fill="#383838"
            className="js-steel"
            style={{ left: 856, top: 396, zIndex: 4 }}
          />

          {/* decorative marks on the dark layer */}
          <div
            className="js-rail absolute font-mono"
            style={{ left: 470, top: 52, fontSize: 11, letterSpacing: "0.28em", color: "#cfcfcf", zIndex: 6 }}
          >
            ┌ FAIL CODE : 11121120012 ┐
          </div>
          <div
            className="js-rail absolute font-mono"
            style={{ left: 884, top: 848, fontSize: 11, letterSpacing: "0.3em", color: "#9a9a9a", zIndex: 6 }}
          >
            XYZ001928761
          </div>
          <div
            className="absolute rounded-full bg-white"
            style={{ left: 836, top: 852, width: 14, height: 14, zIndex: 6 }}
          />
          <div
            className="js-rail absolute font-mono"
            style={{ left: 116, top: 836, fontSize: 10, letterSpacing: "0.3em", color: "#5f5f5f", zIndex: 6 }}
          >
            ARCHIVE 00/89 — SONATA ARC
          </div>
          <div className="absolute font-mono" style={{ left: 128, top: 646, fontSize: 18, color: "#3c3c3c", zIndex: 2 }}>
            +
          </div>
          <div className="absolute font-mono" style={{ left: 252, top: 758, fontSize: 18, color: "#3c3c3c", zIndex: 2 }}>
            +
          </div>

          {/* ---------------- LOST card ---------------- */}
          <ShapedCard
            pts={LOST_CARD}
            w={520}
            h={620}
            fill="url(#paperGradLost)"
            className="js-card"
            style={{ left: 300, top: 90, zIndex: 10 }}
            shadow="drop-shadow(0 34px 50px rgba(0,0,0,0.55))"
          >
            {/* paper gradient def */}
            <svg width="0" height="0" style={{ position: "absolute" }}>
              <defs>
                <linearGradient id="paperGradLost" x1="0" y1="0" x2="0.7" y2="1">
                  <stop offset="0%" stopColor="#fbfaf8" />
                  <stop offset="100%" stopColor="#e8e6e2" />
                </linearGradient>
              </defs>
            </svg>

            {/* hang tag in the top notch, with punched hole */}
            <svg width={108} height={42} viewBox="0 0 108 42" style={{ position: "absolute", left: 156, top: 2 }} aria-hidden>
              <path d={`${roundedPath(TAG)} M 66 21 A 12 12 0 1 1 42 21 A 12 12 0 1 1 66 21 Z`} fill="#454545" fillRule="evenodd" />
            </svg>

            <LostLogoBlock />
            <LostCardSmallPrint />
          </ShapedCard>

          {/* red status pill — floats across the card edge */}
          <div
            className="js-pill absolute flex cursor-pointer items-center gap-4 rounded-full px-5 transition-transform duration-300 hover:scale-[1.04]"
            style={{
              left: 592,
              top: 116,
              width: 318,
              height: 58,
              zIndex: 12,
              background: "linear-gradient(180deg, #cf4a38 0%, #b03226 100%)",
              boxShadow: "0 14px 34px rgba(176,50,38,0.45), inset 0 1px 0 rgba(255,255,255,0.35)",
            }}
            title="status: 404"
          >
            <div className="flex items-center gap-1.5">
              <Asterisk />
              <Asterisk />
              <Asterisk />
            </div>
            <div>
              <div className="font-mono" style={{ fontSize: 14, letterSpacing: "0.22em", fontWeight: 600 }}>
                0204 0504 0304
              </div>
              <div style={{ fontSize: 6.5, lineHeight: "8px", color: "rgba(255,255,255,0.75)", maxWidth: 190 }}>
                {LOREM}
              </div>
            </div>
          </div>

          {/* 251024 vertical on the card */}
          <div
            className="rail-text font-head absolute select-none"
            style={{ left: 762, top: 408, fontSize: 26, fontWeight: 600, letterSpacing: "0.3em", color: "#1c1c1c", zIndex: 11 }}
          >
            251024
          </div>

          {/* ---------------- COUNTING card ---------------- */}
          <ShapedCard
            pts={COUNT_CARD}
            w={460}
            h={560}
            fill="url(#paperGradCount)"
            className="js-card"
            style={{ left: 840, top: 250, zIndex: 10 }}
            shadow="drop-shadow(0 34px 50px rgba(0,0,0,0.55))"
          >
            <svg width="0" height="0" style={{ position: "absolute" }}>
              <defs>
                <linearGradient id="paperGradCount" x1="0" y1="0" x2="0.6" y2="1">
                  <stop offset="0%" stopColor="#fbfaf8" />
                  <stop offset="100%" stopColor="#e9e7e3" />
                </linearGradient>
              </defs>
            </svg>
            <CountingContent />
          </ShapedCard>

          {/* ---------------- robotic hand + rose ---------------- */}
          <img
            className="js-hand absolute select-none"
            src={HAND_SRC}
            alt="Chrome robotic hand holding a pink rose"
            draggable={false}
            onError={(e) => {
              const el = e.currentTarget;
              if (el.src !== HAND_SRC_FALLBACK) el.src = HAND_SRC_FALLBACK;
            }}
            style={{
              left: 462,
              top: 148,
              height: 800,
              zIndex: 20,
              transform: "rotate(-3deg)",
              filter: "drop-shadow(-24px 30px 40px rgba(0,0,0,0.55))",
            }}
          />

          {/* ---------------- glassmorphism panel ---------------- */}
          <div
            className="js-glass glass absolute"
            style={{ left: 352, top: 452, width: 268, height: 330, borderRadius: 22, zIndex: 30 }}
          >
            <div
              className="absolute font-mono"
              style={{ left: 18, top: 16, fontSize: 9, letterSpacing: "0.3em", color: "rgba(255,255,255,0.8)" }}
            >
              BLUR / 12PX
            </div>
            <div
              className="absolute rounded-full border border-white/50"
              style={{ right: 16, top: 14, width: 22, height: 22 }}
            />
            <div
              className="absolute"
              style={{ left: 18, bottom: 14, right: 18, height: 1, background: "rgba(255,255,255,0.35)" }}
            />
          </div>

          {/* ---------------- color tone plate ---------------- */}
          <ShapedCard
            pts={TONE_CARD}
            w={400}
            h={104}
            fill="#fdfdfc"
            className="js-tone"
            style={{ left: 1100, top: 776, zIndex: 40 }}
            shadow="drop-shadow(0 20px 36px rgba(0,0,0,0.5))"
          >
            <div className="flex h-full items-center gap-4 pl-10 pr-7">
              <div className="grid shrink-0 grid-cols-2 gap-1.5">
                {swatches.map((c, i) => (
                  <button
                    key={c}
                    onClick={() => setTone(i)}
                    className="transition-transform duration-200 hover:scale-110"
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 7,
                      background: c,
                      border: c === "#ffffff" ? "1px solid #d8d5d0" : "none",
                      outline: tone === i ? "2px solid #c0392f" : "none",
                      outlineOffset: 2,
                    }}
                    aria-label={`color ${i + 1}`}
                  />
                ))}
              </div>
              <div>
                <div className="font-head" style={{ fontSize: 22, fontWeight: 800, color: "#141414", lineHeight: 1 }}>
                  color tone.
                </div>
                <div style={{ fontSize: 7.5, lineHeight: "10px", color: "#8b877f", marginTop: 5, maxWidth: 210 }}>
                  {LOREM}
                </div>
              </div>
            </div>
          </ShapedCard>

          {/* ---------------- rails ---------------- */}
          <LeftRail />
          <RightRail />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card innards                                                        */
/* ------------------------------------------------------------------ */

function LostLogoBlock() {
  return (
    <div style={{ position: "absolute", left: 38, top: 104 }}>
      <LostLogo />
      <div
        className="font-mono"
        style={{ marginTop: 22, fontSize: 12, letterSpacing: "0.32em", color: "#5a564f" }}
      >
        CONCEPT NOT FOUND
        <br />
        <span style={{ color: "#8b877f" }}>404 - TRY AGAIN</span>
      </div>
    </div>
  );
}

function LostCardSmallPrint() {
  return (
    <>
      {/* left-edge slot label */}
      <div style={{ position: "absolute", left: 34, top: 400 }}>
        <Barcode w={96} h={22} seed={7} />
        <div className="font-mono" style={{ fontSize: 9, letterSpacing: "0.3em", color: "#3a3a3a", marginTop: 5 }}>
          EAST BLUE
        </div>
      </div>
      {/* tiny legal block bottom-left */}
      <div
        style={{
          position: "absolute",
          left: 38,
          bottom: 30,
          width: 150,
          fontSize: 7,
          lineHeight: "9.5px",
          color: "#98948c",
        }}
      >
        {LOREM}
      </div>
    </>
  );
}

function CountingContent() {
  return (
    <div className="absolute inset-0">
      {/* SEND / PROCESS cluster */}
      <div style={{ position: "absolute", right: 44, top: 46, textAlign: "left", width: 150 }}>
        <button
          className="font-mono transition-colors duration-200 hover:bg-[#141414] hover:text-white"
          style={{
            fontSize: 12,
            letterSpacing: "0.24em",
            padding: "3px 10px",
            border: "1.5px solid #141414",
            borderRadius: 4,
            color: "#141414",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          SEND
        </button>
        <div className="font-head" style={{ fontSize: 15, fontWeight: 800, letterSpacing: "0.1em", color: "#141414", marginTop: 7 }}>
          PROCESS
        </div>
        <div style={{ fontSize: 7, lineHeight: "9.5px", color: "#98948c", marginTop: 6 }}>{LOREM}</div>
      </div>

      {/* divider + header */}
      <div style={{ position: "absolute", left: 42, right: 42, top: 236, height: 1.5, background: "#141414" }} />
      <div
        className="font-head"
        style={{ position: "absolute", left: 42, top: 250, fontSize: 19, fontWeight: 800, letterSpacing: "0.14em", color: "#141414" }}
      >
        COUNTING ON YOU
      </div>
      <div style={{ position: "absolute", left: 42, top: 284, width: 370, fontSize: 7.5, lineHeight: "10px", color: "#98948c" }}>
        {LOREM} {LOREM}
      </div>

      {/* the big 89 */}
      <div
        className="font-head select-none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 300,
          textAlign: "center",
          fontSize: 220,
          fontWeight: 300,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          color: "#161616",
        }}
      >
        89
      </div>

      <div
        className="font-mono"
        style={{ position: "absolute", left: 42, bottom: 26, fontSize: 9, letterSpacing: "0.34em", color: "#8b877f" }}
      >
        IMPERFECTION
      </div>
      <Barcode w={80} h={18} seed={23} style={{ position: "absolute", right: 100, bottom: 24 }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Rails                                                               */
/* ------------------------------------------------------------------ */

function LeftRail() {
  return (
    <div className="absolute inset-y-0 left-0" style={{ width: 90, zIndex: 50 }}>
      <div
        className="js-rail rail-text-up font-display absolute select-none"
        style={{ left: 22, top: 36, fontSize: 42, letterSpacing: "0.08em", color: "#f4f3f1" }}
      >
        FLOWERS
      </div>
      <div className="js-rail absolute" style={{ left: 34, top: 380 }}>
        <div className="rail-text-up font-mono" style={{ fontSize: 10, letterSpacing: "0.34em", color: "rgba(244,243,241,0.85)" }}>
          SAN SEBASTIAN
        </div>
      </div>
      <div className="js-rail absolute" style={{ left: 52, top: 402 }}>
        <div className="rail-text-up font-mono" style={{ fontSize: 10, letterSpacing: "0.34em", color: "rgba(244,243,241,0.6)" }}>
          SONATA ARC
        </div>
      </div>
      {/* circular chips */}
      <div className="js-rail absolute grid place-items-center rounded-full border-2 border-white/90" style={{ left: 26, top: 652, width: 38, height: 38 }}>
        <div className="rounded-sm border-2 border-white/90" style={{ width: 12, height: 12 }} />
      </div>
      <div className="js-rail absolute grid place-items-center rounded-full border-2 border-white/90" style={{ left: 26, top: 700, width: 38, height: 38 }}>
        <div className="rounded-full bg-white" style={{ width: 10, height: 10 }} />
      </div>
      <div
        className="js-rail rail-text-up font-head absolute select-none"
        style={{ left: 30, top: 760, fontSize: 13, fontWeight: 700, letterSpacing: "0.32em", color: "#f4f3f1" }}
      >
        HOLIGRAFICT
      </div>
    </div>
  );
}

function RightRail() {
  return (
    <div className="absolute inset-y-0 right-0" style={{ width: 90, zIndex: 50 }}>
      <div
        className="js-rail rail-text font-head absolute select-none"
        style={{ right: 28, top: 36, fontSize: 20, fontWeight: 800, letterSpacing: "0.26em", color: "#f4f3f1" }}
      >
        FRIDAY 25
      </div>
      {/* vertical barcode */}
      <div className="js-rail absolute" style={{ right: 16, top: 330 }}>
        <Barcode w={150} h={44} seed={99} color="#e9e7e3" style={{ transform: "rotate(90deg) translateY(-100%)", transformOrigin: "top left" }} />
      </div>
      <div
        className="js-rail rail-text font-head absolute select-none"
        style={{ right: 28, top: 540, fontSize: 20, fontWeight: 800, letterSpacing: "0.3em", color: "#f4f3f1" }}
      >
        PAUSED
      </div>
      <div className="js-rail absolute" style={{ right: 44, bottom: 30 }}>
        <div className="rail-text font-mono" style={{ fontSize: 10, letterSpacing: "0.3em", color: "rgba(244,243,241,0.85)" }}>
          RECOGNIZE
        </div>
      </div>
      <div className="js-rail absolute" style={{ right: 26, bottom: 30 }}>
        <div className="rail-text font-mono" style={{ fontSize: 10, letterSpacing: "0.3em", color: "rgba(244,243,241,0.6)" }}>
          APOLOGIZE
        </div>
      </div>
    </div>
  );
}
