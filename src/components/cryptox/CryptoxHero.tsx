import { useRef, useState } from "react";
import {
  ArrowRight,
  Bell,
  Wallet,
  Menu,
  Maximize2,
  ChevronDown,
  ArrowDownUp,
} from "lucide-react";
import { useReveal } from "../../lib/anim";

/* ---------- tiny chart helpers ---------- */
function Spark({ color = "#ff6a2b", up = true }: { color?: string; up?: boolean }) {
  const pts = up
    ? "0,18 12,14 24,16 36,8 48,11 60,4 72,6"
    : "0,6 12,9 24,5 36,13 48,10 60,16 72,14";
  return (
    <svg viewBox="0 0 72 22" className="h-6 w-16" fill="none">
      <polyline points={pts} stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const FLOAT_PILLS = [
  { label: "Bitora", cls: "left-2 top-24 sm:left-6", delay: "0s", color: "#ff6a2b" },
  { label: "Chainly", cls: "left-6 top-44 sm:left-16", delay: "1.2s", color: "#5b8cff" },
  { label: "Conza", cls: "right-2 top-24 sm:right-6", delay: "0.6s", color: "#ff6a2b" },
  { label: "Nexbit", cls: "right-6 top-44 sm:right-16", delay: "1.8s", color: "#e23b3b" },
];

const MARKETS = [
  { sym: "BTA", color: "#3b82f6", up: true },
  { sym: "CHY", color: "#ef5b2b", up: false },
  { sym: "NXB", color: "#2b6bef", up: true },
];

const TABS = ["Home", "Leverage", "Earn", "HFT"];

export default function CryptoxHero() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, { selector: "[data-reveal]", stagger: 0.07 });
  const [tab, setTab] = useState(0);

  return (
    <section ref={ref} id="home" className="relative overflow-hidden px-5 pb-10 pt-6 sm:px-8">
      {/* Glow */}
      <div className="hero-glow pointer-events-none absolute left-1/2 top-[-120px] -z-0 h-[760px] w-[1200px] max-w-none -translate-x-1/2" />

      {/* Floating pills */}
      {FLOAT_PILLS.map((p) => (
        <div
          key={p.label}
          className={`animate-floaty absolute z-10 hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-white/80 backdrop-blur-md sm:flex ${p.cls}`}
          style={{ animationDelay: p.delay }}
        >
          <span className="grid h-4 w-4 place-items-center rounded-full" style={{ background: p.color }}>
            <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
          </span>
          {p.label}
        </div>
      ))}

      {/* Heading */}
      <div className="relative z-20 mx-auto max-w-3xl pt-10 text-center sm:pt-16">
        <h1
          data-reveal
          className="font-poppins text-[clamp(34px,6vw,58px)] font-bold leading-[1.08] tracking-tight text-white"
        >
          Step Into The Future Of
          <br />
          Crypto Trading
        </h1>
        <p data-reveal className="mx-auto mt-4 max-w-md text-[13px] text-white/55">
          AI-optimized sales teams with human-grade decision-making
        </p>
        <div data-reveal className="mt-7 flex justify-center">
          <a
            href="#features"
            className="group inline-flex items-center gap-2 rounded-full bg-brand py-3 pl-6 pr-2 text-sm font-medium text-white shadow-[0_12px_30px_-10px_rgba(255,106,43,0.8)] transition-transform hover:-translate-y-0.5"
          >
            Get Started
            <span className="grid h-7 w-7 place-items-center rounded-full bg-white/20 transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </a>
        </div>
      </div>

      {/* Dashboard cards */}
      <div className="relative z-20 mx-auto mt-14 flex max-w-5xl flex-col items-stretch justify-center gap-5 lg:flex-row lg:items-start">
        {/* Markets */}
        <div data-reveal className="rounded-2xl border border-white/[0.07] bg-card/90 p-4 backdrop-blur-md lg:mt-6 lg:w-[280px] lg:translate-x-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-white">Markets</span>
            <span className="text-[11px] font-medium text-brand">See All</span>
          </div>
          <div className="mt-4 space-y-3">
            {MARKETS.map((m) => (
              <div key={m.sym} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-full text-[10px] font-bold text-white" style={{ background: m.color }}>
                    {m.sym[0]}
                  </span>
                  <div className="leading-tight">
                    <div className="text-[12px] font-semibold text-white">{m.sym}</div>
                    <div className="text-[9px] text-white/40">/USD</div>
                  </div>
                </div>
                <Spark color={m.up ? "#22c55e" : "#ef4444"} up={m.up} />
                <div className="text-right leading-tight">
                  <div className="text-[11px] font-semibold text-white">$28,659.35</div>
                  <div className={`text-[9px] ${m.up ? "text-green-400" : "text-red-400"}`}>
                    {m.up ? "+1.24%" : "-0.84%"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center trading card */}
        <div data-reveal className="z-30 rounded-2xl border border-white/10 bg-[#17161d] p-4 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9)] lg:-mt-2 lg:w-[300px] lg:scale-[1.04]">
          <div className="flex items-center justify-between">
            <Menu className="h-4 w-4 text-white/60" />
            <div className="flex items-center gap-1 rounded-full bg-white/[0.05] p-0.5">
              {TABS.map((t, i) => (
                <button
                  key={t}
                  onClick={() => setTab(i)}
                  className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors ${
                    tab === i ? "bg-brand text-white" : "text-white/55 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <Wallet className="h-4 w-4" />
              <Bell className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-5">
            <div className="font-poppins text-2xl font-bold text-white">
              $15,4.75 <span className="text-xs font-medium text-white/40">USD</span>
            </div>
          </div>

          {/* line chart */}
          <svg viewBox="0 0 260 90" className="mt-3 h-24 w-full" fill="none">
            <polyline
              points="0,70 20,60 38,66 56,40 74,52 92,30 110,44 130,22 150,38 170,18 190,40 210,28 232,46 260,34"
              stroke="#ffffff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="0,80 24,74 48,78 72,66 96,72 120,58 150,66 180,54 210,62 240,52 260,58"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>

          <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3">
            <span className="text-[11px] text-white/45">Total Balance</span>
            <span className="text-[11px] font-semibold text-white">
              +$432.49 <span className="text-brand">(+12%)</span>
            </span>
          </div>
        </div>

        {/* Crypto Exchange */}
        <div data-reveal className="rounded-2xl border border-white/[0.07] bg-card/90 p-4 backdrop-blur-md lg:mt-6 lg:w-[280px] lg:-translate-x-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-white">Crypto Exchange</span>
            <Maximize2 className="h-3.5 w-3.5 text-white/50" />
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-white/[0.04] px-3 py-2">
            <span className="text-[12px] font-semibold text-white">USDETH</span>
            <span className="text-[9px] text-white/40">Order in · 36 min</span>
          </div>

          <div className="relative mt-3 space-y-3">
            <ExchangeRow color="#3b82f6" sym="BTA" big="40.679" small="67.143" />
            <div className="flex justify-center">
              <span className="grid h-7 w-7 place-items-center rounded-full border border-white/10 bg-[#1b1a22] text-white/70">
                <ArrowDownUp className="h-3.5 w-3.5" />
              </span>
            </div>
            <ExchangeRow color="#ef5b2b" sym="NXB" big="1230.365" small="90.143" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ExchangeRow({ color, sym, big, small }: { color: string; sym: string; big: string; small: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2.5">
      <div className="flex items-center gap-2">
        <span className="grid h-6 w-6 place-items-center rounded-full text-[9px] font-bold text-white" style={{ background: color }}>
          {sym[0]}
        </span>
        <span className="flex items-center gap-1 text-[12px] font-semibold text-white">
          {sym} <ChevronDown className="h-3 w-3 text-white/40" />
        </span>
      </div>
      <div className="text-right leading-tight">
        <div className="text-[13px] font-semibold text-white">{big}</div>
        <div className="text-[9px] text-white/40">Vol {small}</div>
      </div>
    </div>
  );
}
