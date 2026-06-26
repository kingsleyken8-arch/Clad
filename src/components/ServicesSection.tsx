import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { MEDIA } from "../data/programs";
import { useReveal } from "../lib/anim";

interface Card {
  title: string;
  tag: string;
  img?: string;
}

const CARDS: Card[] = [
  { title: "Research & summarize", tag: "Knowledge" },
  { title: "Draft & edit content", tag: "Writing", img: MEDIA.meadow },
  { title: "Automate workflows", tag: "Automation" },
  { title: "Manage your inbox", tag: "Productivity", img: MEDIA.milo },
  { title: "Plan & schedule", tag: "Planning" },
  { title: "Connect your tools", tag: "Integrations", img: MEDIA.meadow },
];

function Wave() {
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 top-1/2 w-full -translate-y-1/2"
      viewBox="0 0 400 140"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {[0, 14, 28, 42].map((o) => (
        <path
          key={o}
          d={`M0 ${49 + o} C 90 ${9 + o}, 150 ${89 + o}, 250 ${49 + o} S 400 ${9 + o}, 400 ${49 + o}`}
          stroke="#dcdad6"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

export default function ServicesSection() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section ref={ref} id="features" className="relative z-10 bg-white px-6 pb-24 pt-4 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <h2 data-reveal className="font-inter text-[clamp(28px,4vw,44px)] font-normal tracking-tight text-[#8f8f8f]">
          What Milo can do
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c) =>
            c.img ? (
              <a
                key={c.title}
                href="#plans"
                data-reveal
                className="group relative block h-[15.5rem] overflow-hidden rounded-2xl"
              >
                <img
                  src={c.img}
                  alt={c.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/30" />
                <h3 className="absolute left-6 top-6 max-w-[78%] font-inter text-[17px] font-normal leading-snug text-white drop-shadow">
                  {c.title}
                </h3>
                <span className="absolute bottom-6 left-6 text-[13px] font-medium text-white/90 drop-shadow">
                  {c.tag}
                </span>
                <span className="absolute bottom-5 right-5 grid h-10 w-10 place-items-center rounded-full bg-white text-[#e8743b] transition-transform group-hover:scale-105">
                  <ArrowUpRight size={16} />
                </span>
              </a>
            ) : (
              <a
                key={c.title}
                href="#plans"
                data-reveal
                className="group relative block h-[15.5rem] overflow-hidden rounded-2xl bg-[#f4f3f1]"
              >
                <Wave />
                <h3 className="absolute left-6 top-6 max-w-[80%] font-inter text-[17px] font-normal leading-snug text-[#2c2c2c]">
                  {c.title}
                </h3>
                <span className="absolute bottom-6 left-6 text-[13px] font-medium text-[#8a8a8a]">
                  {c.tag}
                </span>
                <span className="absolute bottom-5 right-5 grid h-10 w-10 place-items-center rounded-full bg-[#e8743b] text-white transition-transform group-hover:scale-105">
                  <ArrowUpRight size={16} />
                </span>
              </a>
            )
          )}
        </div>
      </div>
    </section>
  );
}
