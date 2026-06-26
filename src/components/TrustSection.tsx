import type { LucideIcon } from "lucide-react";
import { Zap, Users, Star, Plug } from "lucide-react";

interface Stat {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
}

const STATS: Stat[] = [
  { label: "Tasks", value: "1M+", sub: "Tasks automated", icon: Zap },
  { label: "Users", value: "10,000+", sub: "Teams onboard", icon: Users },
  { label: "Rating", value: "4.9", sub: "Average user score", icon: Star },
  { label: "Integrations", value: "50+", sub: "Connected tools", icon: Plug },
];

export default function TrustSection() {
  return (
    <section id="why" className="relative z-10 bg-white px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-inter text-[clamp(28px,4vw,44px)] font-normal tracking-tight text-[#2c2c2c]">
          Why teams <span className="text-[#e8743b]">trust Milo</span>
        </h2>

        <div className="mt-6 max-w-[640px] space-y-4 text-[14px] leading-relaxed text-[#6f6f6f]">
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
          {STATS.map(({ label, value, sub, icon: Icon }) => (
            <div key={label} className="rounded-2xl bg-[#f4f3f1] p-6 sm:p-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <span className="text-[12px] font-medium text-[#5f5f5f]">{label}</span>
                <Icon size={14} strokeWidth={1.75} className="text-[#e8743b]" />
              </div>
              <div className="mt-8 font-inter text-[clamp(32px,4.5vw,52px)] font-normal leading-none text-[#2c2c2c]">
                {value}
              </div>
              <div className="mt-3 text-[12px] text-[#8a8a8a]">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
