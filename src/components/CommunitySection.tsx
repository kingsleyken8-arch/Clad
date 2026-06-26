import { useRef, useState } from "react";
import { ArrowUpRight, ChevronRight, Quote, Hexagon, Building2, Sparkles, Rocket } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Tag, Avatar } from "./clinicShared";
import { MEDIA } from "../data/programs";
import { useReveal } from "../lib/anim";

interface T {
  brand: string;
  brandIcon: LucideIcon;
  quote: string;
  name: string;
  role: string;
  initials: string;
}

const TESTIMONIALS: T[] = [
  {
    brand: "Nomad Co.",
    brandIcon: Hexagon,
    quote: "Milo completely changed how our team works. It handles the busywork so we focus on what actually matters.",
    name: "Kristin Watson",
    role: "Nomad Collective",
    initials: "KW",
  },
  {
    brand: "Trailhead LLC.",
    brandIcon: Building2,
    quote: "Milo feels like a teammate that never sleeps. It's incredible how much it gets done on its own.",
    name: "Cody Fisher",
    role: "Trailhead LLC",
    initials: "CF",
  },
  {
    brand: "Brightloop",
    brandIcon: Sparkles,
    quote: "We automated half of our weekly ops in a single afternoon. Milo just figures things out.",
    name: "Wade Warren",
    role: "Brightloop",
    initials: "WW",
  },
  {
    brand: "Northstar",
    brandIcon: Rocket,
    quote: "Setup took minutes and Milo was useful immediately. Genuinely the most capable agent we've tried.",
    name: "Esther Howard",
    role: "Northstar",
    initials: "EH",
  },
];

export default function CommunitySection() {
  const [page, setPage] = useState(0);
  const pages = Math.ceil(TESTIMONIALS.length / 2);
  const shown = TESTIMONIALS.slice(page * 2, page * 2 + 2);
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <>
      <section ref={ref} id="community" className="relative z-10 bg-white px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div data-reveal className="border-t border-black/10 pt-10">
            <Tag n="04" label="Reviews" />
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div data-reveal>
              <div className="overflow-hidden rounded-3xl">
                <img
                  src={MEDIA.meadow}
                  alt="The Milo community"
                  loading="lazy"
                  className="h-52 w-full object-cover"
                />
              </div>
              <h2 className="mt-6 font-inter text-[clamp(28px,3.6vw,40px)] font-normal leading-[1.05] tracking-tight text-[#2c2c2c]">
                Loved by
                <br />
                modern
                <br />
                teams
              </h2>
              <button
                onClick={() => setPage((p) => (p + 1) % pages)}
                aria-label="Next reviews"
                className="mt-6 grid h-10 w-10 place-items-center rounded-full bg-black text-white transition-transform hover:scale-105"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {shown.map((t) => (
                <article key={t.name} data-reveal className="flex flex-col rounded-3xl bg-[#f4f3f1] p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <t.brandIcon size={18} className="text-[#2c2c2c]" />
                      <span className="text-[13px] font-medium text-[#2c2c2c]">{t.brand}</span>
                    </div>
                    <Avatar initials={t.initials} />
                  </div>
                  <Quote className="mt-6 h-6 w-6 text-[#e8743b]" fill="currentColor" />
                  <p className="mt-3 flex-1 font-inter text-[17px] leading-snug text-[#2c2c2c]">
                    {t.quote}
                  </p>
                  <div className="mt-6">
                    <div className="text-[13px] font-semibold text-[#2c2c2c]">{t.name}</div>
                    <div className="text-[11px] text-[#9a9a9a]">{t.role}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Join band */}
      <section className="relative z-10 bg-white px-6 pb-24 sm:px-10 lg:px-16">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl">
          <video
            src={MEDIA.video}
            autoPlay
            muted
            loop
            playsInline
            className="h-72 w-full object-cover sm:h-80"
          />
          <div className="pointer-events-none absolute inset-0 bg-black/20" />
          <a
            href="#plans"
            className="group absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-black py-2 pl-5 pr-2 text-[13px] font-medium text-white"
          >
            Get started
            <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-black transition-transform group-hover:translate-x-0.5">
              <ArrowUpRight size={14} />
            </span>
          </a>
        </div>
      </section>
    </>
  );
}
