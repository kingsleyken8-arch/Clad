import { useRef, useState } from "react";
import { ArrowRight, ShieldCheck, TrendingUp } from "lucide-react";
import { useReveal } from "../../lib/anim";

const RANGES = ["1H", "1D", "1W", "1M", "ALL"];

const PEOPLE = [
  { name: "Robert Brian", price: "$28,659.35", chg: "+2.4%", up: true, c: "#3b82f6" },
  { name: "Courtney Henry", price: "$1,856.20", chg: "+1.1%", up: true, c: "#a855f7" },
  { name: "Cody Fisher", price: "$0.51", chg: "-0.8%", up: false, c: "#ef5b2b" },
  { name: "Darlene Robertson", price: "$100.75", chg: "+4.2%", up: true, c: "#22c55e" },
];

export default function Features() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, { stagger: 0.08 });
  const [range, setRange] = useState(2);

  return (
    <section ref={ref} id="features" className="relative px-5 py-20 sm:px-8 lg:py-28">
      {/* soft edge blooms */}
      <div className="pointer-events-none absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-brand/20 blur-[140px]" />
      <div className="pointer-events-none absolute -left-40 top-2/3 h-96 w-96 rounded-full bg-brand/10 blur-[140px]" />

      <div className="relative mx-auto max-w-5xl">
        {/* Heading */}
        <div className="text-center">
          <h2 data-reveal className="font-poppins text-[clamp(26px,4vw,44px)] font-bold leading-[1.12] tracking-tight text-white">
            Powerful Features
            <br />
            For Smarter Crypto Trading
          </h2>
          <p data-reveal className="mx-auto mt-4 max-w-md text-[13px] text-white/50">
            AI-optimized sales teams with human-grade decision-making
          </p>
        </div>

        {/* Big feature card */}
        <div
          data-reveal
          className="mt-12 grid gap-8 overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-[#161318] to-[#1b1410] p-7 sm:p-9 lg:grid-cols-2 lg:items-center"
        >
          <div>
            <h3 className="font-poppins text-[clamp(22px,2.6vw,30px)] font-bold leading-tight text-white">
              Tools For Better
              <br />
              Cryptocurrency Trading
            </h3>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-white/50">
              Smart platforms designed to help you analyze markets and make
              informed decisions.
            </p>
            <a
              href="#"
              className="group mt-7 inline-flex items-center gap-2 rounded-full bg-brand py-2.5 pl-6 pr-2 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
            >
              Get Started
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white/20 transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </a>
          </div>

          {/* Area chart */}
          <div className="rounded-2xl border border-white/[0.06] bg-black/30 p-5">
            <svg viewBox="0 0 320 150" className="h-40 w-full" fill="none" preserveAspectRatio="none">
              <defs>
                <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff6a2b" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#ff6a2b" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,110 C30,90 50,120 80,95 C110,70 130,118 160,80 C190,45 210,95 240,60 C270,30 295,70 320,40 L320,150 L0,150 Z"
                fill="url(#area)"
              />
              <path
                d="M0,110 C30,90 50,120 80,95 C110,70 130,118 160,80 C190,45 210,95 240,60 C270,30 295,70 320,40"
                stroke="#ff6a2b"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-1 rounded-full bg-white/[0.05] p-0.5">
                {RANGES.map((r, i) => (
                  <button
                    key={r}
                    onClick={() => setRange(i)}
                    className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors ${
                      range === i ? "bg-brand text-white" : "text-white/50 hover:text-white"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/40">Your balance</span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold text-white">
                  0.000000 ETH
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Two cards */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* People list card */}
          <div data-reveal className="rounded-3xl border border-white/[0.07] bg-card p-6">
            <div className="space-y-2">
              {PEOPLE.map((p) => (
                <div key={p.name} className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-3 py-2.5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full text-[11px] font-semibold text-white" style={{ background: p.c }}>
                      {p.name.split(" ").map((w) => w[0]).join("")}
                    </span>
                    <div className="leading-tight">
                      <div className="text-[12px] font-semibold text-white">{p.name}</div>
                      <div className={`text-[10px] ${p.up ? "text-green-400" : "text-red-400"}`}>{p.chg}</div>
                    </div>
                  </div>
                  <div className="text-[13px] font-semibold text-white">{p.price}</div>
                </div>
              ))}
            </div>
            <h3 className="mt-6 flex items-center gap-2 font-poppins text-lg font-semibold text-white">
              <TrendingUp className="h-4 w-4 text-brand" /> Advanced Charting &amp; Analytics
            </h3>
            <p className="mt-2 text-[12px] leading-relaxed text-white/45">
              Track top movers in real time with precise, AI-assisted market insights.
            </p>
          </div>

          {/* Risk node card */}
          <div data-reveal className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-card p-6">
            <div className="relative grid h-44 place-items-center">
              {/* connecting lines */}
              <svg viewBox="0 0 300 170" className="absolute inset-0 h-full w-full" fill="none">
                <path d="M150,140 L60,40" stroke="rgba(255,106,43,0.35)" strokeWidth="1.5" />
                <path d="M150,140 L150,30" stroke="rgba(255,106,43,0.35)" strokeWidth="1.5" />
                <path d="M150,140 L240,40" stroke="rgba(255,106,43,0.35)" strokeWidth="1.5" />
              </svg>
              {/* top nodes */}
              <div className="absolute left-6 top-3 h-7 w-24 rounded-full border border-white/10 bg-white/[0.05]" />
              <div className="absolute left-1/2 top-0 h-7 w-20 -translate-x-1/2 rounded-full border border-white/10 bg-white/[0.05]" />
              <div className="absolute right-6 top-3 h-7 w-24 rounded-full border border-white/10 bg-white/[0.05]" />
              {/* center node */}
              <span className="relative z-10 mt-10 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-brand-light to-brand-dark shadow-[0_0_40px_rgba(255,106,43,0.6)]">
                <ShieldCheck className="h-7 w-7 text-white" />
              </span>
            </div>
            <h3 className="mt-6 flex items-center gap-2 font-poppins text-lg font-semibold text-white">
              <ShieldCheck className="h-4 w-4 text-brand" /> Smart Risk Management
            </h3>
            <p className="mt-2 text-[12px] leading-relaxed text-white/45">
              Automated safeguards route every trade through layered, intelligent checks.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
