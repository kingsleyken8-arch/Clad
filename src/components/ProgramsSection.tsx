import { useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Plus, Bot } from "lucide-react";
import { Tag } from "./clinicShared";
import { MEDIA } from "../data/programs";
import { useReveal } from "../lib/anim";

interface Plan {
  name: string;
  tags: string[];
  blurb: string;
  img: string;
}

const PLANS: Plan[] = [
  { name: "Milo Free", tags: ["Free", "Personal"], img: MEDIA.meadow, blurb: "Everything one person needs to put an AI agent to work — no card required." },
  { name: "Milo Pro", tags: ["Popular", "Pro"], img: MEDIA.milo, blurb: "Advanced automations and more horsepower for power users and creators." },
  { name: "Milo Teams", tags: ["Teams", "Scale"], img: MEDIA.meadow, blurb: "Shared agents, roles and controls for your whole team to move faster." },
  { name: "Milo Enterprise", tags: ["Custom", "Secure"], img: MEDIA.milo, blurb: "Custom security, SSO and dedicated support for organizations at scale." },
];

export default function ProgramsSection() {
  const [i, setI] = useState(0);
  const n = PLANS.length;
  const featured = PLANS[i];
  const small1 = PLANS[(i + 1) % n];
  const small2 = PLANS[(i + 2) % n];
  const move = (d: number) => setI((p) => (p + d + n) % n);
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section ref={ref} id="plans" className="relative z-10 bg-white px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 border-t border-black/10 pt-10 md:flex-row md:items-start md:justify-between">
          <div data-reveal>
            <Tag n="01" label="Plans" />
          </div>
          <h2 data-reveal className="max-w-md font-inter text-[clamp(26px,3.4vw,38px)] font-normal leading-tight tracking-tight text-[#2c2c2c] md:text-right">
            Built for every kind of work
          </h2>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {/* Featured */}
          <article data-reveal className="group relative h-[24rem] overflow-hidden rounded-3xl">
            <img
              key={featured.img + i}
              src={featured.img}
              alt={featured.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-black/20" />
            <div className="absolute left-6 top-6 flex gap-2">
              {featured.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/40 bg-white/10 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md"
                >
                  {t}
                </span>
              ))}
            </div>
            <h3 className="absolute bottom-6 left-6 font-inter text-4xl font-normal text-white">
              {featured.name}
            </h3>
            <a
              href="#"
              aria-label={`Choose ${featured.name}`}
              className="absolute bottom-6 right-6 grid h-11 w-11 place-items-center rounded-full bg-white text-[#2c2c2c] transition-transform group-hover:scale-105"
            >
              <ArrowUpRight size={18} />
            </a>
          </article>

          {/* Right column */}
          <div data-reveal className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-5">
              <article className="group relative h-[12rem] overflow-hidden rounded-3xl">
                <img
                  key={small1.img + i}
                  src={small1.img}
                  alt={small1.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                <div className="absolute left-4 top-4 grid h-7 w-7 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md">
                  <Plus size={14} />
                </div>
                <span className="absolute bottom-4 left-4 font-inter text-[15px] text-white">
                  {small1.name}
                </span>
              </article>
              <article className="relative h-[12rem] overflow-hidden rounded-3xl bg-gradient-to-br from-[#2f2a3a] to-[#191620]">
                <Bot className="absolute right-4 top-4 h-7 w-7 text-white/70" strokeWidth={1.5} />
                <span className="absolute bottom-4 left-4 font-inter text-[15px] text-white">
                  {small2.name}
                </span>
              </article>
            </div>

            <p className="text-[14px] leading-relaxed text-[#8a8a8a]">{featured.blurb}</p>

            <div className="flex gap-2">
              <button
                onClick={() => move(-1)}
                aria-label="Previous plan"
                className="grid h-10 w-10 place-items-center rounded-full border border-black/15 text-[#3a3a3a] transition-colors hover:bg-black/5"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => move(1)}
                aria-label="Next plan"
                className="grid h-10 w-10 place-items-center rounded-full bg-black text-white transition-transform hover:scale-105"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
