import { useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { Zap, Users, Star, Plug } from "lucide-react";
import { useReveal, useCountUp } from "../lib/anim";

interface Stat {
  label: string;
  count: number;
  decimals: number;
  suffix: string;
  comma?: boolean;
  sub: string;
  icon: LucideIcon;
}

const STATS: Stat[] = [
  { label: "Tasks", count: 1, decimals: 0, suffix: "M+", sub: "Tasks automated", icon: Zap },
  { label: "Users", count: 10000, decimals: 0, suffix: "+", comma: true, sub: "Teams onboard", icon: Users },
  { label: "Rating", count: 4.9, decimals: 1, suffix: "", sub: "Average user score", icon: Star },
  { label: "Integrations", count: 50, decimals: 0, suffix: "+", sub: "Connected tools", icon: Plug },
];

export default function TrustSection() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  useCountUp(ref);

  return (
    <section ref={ref} id="why" className="relative z-10 bg-white px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 data-reveal className="font-inter text-[clamp(28px,4vw,44px)] font-normal tracking-tight text-[#2c2c2c]">
          Why teams <span className="text-[#e8743b]">trust Milo</span>
        </h2>

        <div data-reveal className="mt-6 max-w-[640px] space-y-4 text-[14px] leading-relaxed text-[#6f6f6f]">
          <p>
            Milo has handled millions of real tasks for teams of every size —
            reliably, securely, and around the clock. It plugs into the tools you
            already use and gets to work in minutes.
          </p>
          <p>
            More than 10,000 teams already trust Milo to take the busywork off
            their plate, with enterprise-grade security and a 99.9% uptime track
            record.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
          {STATS.map(({ label, count, decimals, suffix, comma, sub, icon: Icon }) => (
            <div key={label} data-reveal className="rounded-2xl bg-[#f4f3f1] p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <span className="text-[12px] font-medium text-[#5f5f5f]">{label}</span>
                <Icon size={14} strokeWidth={1.75} className="text-[#e8743b]" />
              </div>
              <div
                className="mt-8 font-inter text-[clamp(32px,4.5vw,52px)] font-normal leading-none text-[#2c2c2c]"
                data-count={count}
                data-decimals={decimals}
                data-suffix={suffix}
                data-comma={comma ? "1" : "0"}
              >
                0{suffix}
              </div>
              <div className="mt-3 text-[12px] text-[#8a8a8a]">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
