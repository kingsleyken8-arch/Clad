import type { LucideIcon } from "lucide-react";
import { Briefcase, MapPin, Star, Users } from "lucide-react";

interface Stat {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
}

const STATS: Stat[] = [
  { label: "Experience", value: "12+", sub: "Years on the road", icon: Briefcase },
  { label: "Travelers", value: "10,000+", sub: "Happy explorers", icon: Users },
  { label: "Rating", value: "4.9", sub: "Average traveler score", icon: Star },
  { label: "Guides", value: "4", sub: "Expert local guides", icon: MapPin },
];

export default function TrustSection() {
  return (
    <section className="relative z-10 bg-white px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-inter text-[clamp(28px,4vw,44px)] font-normal tracking-tight text-[#2c2c2c]">
          Why travelers <span className="text-[#e8743b]">trust us</span>
        </h2>

        <div className="mt-6 max-w-[640px] space-y-4 text-[14px] leading-relaxed text-[#6f6f6f]">
          <p>
            For over 12 years, Wanderful has crafted journeys that feel
            effortless and entirely your own. Our guides make sure every trip
            becomes the adventure you dreamed of.
          </p>
          <p>
            More than 10,000 travelers have already explored the world with us.
            Our team are seasoned explorers with over 15 years of experience.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
          {STATS.map(({ label, value, sub, icon: Icon }) => (
            <div
              key={label}
              className="rounded-2xl bg-[#f4f3f1] p-6 sm:p-7"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <span className="text-[12px] font-medium text-[#5f5f5f]">
                  {label}
                </span>
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
