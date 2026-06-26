import { ArrowUpRight, ChevronRight, Quote, Hexagon, Building2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Tag, Avatar } from "./clinicShared";
import { MEDIA } from "../data/programs";

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
    quote: "The trip planning here completely changed how I travel. I'm more confident and free every mile of the way.",
    name: "Kristin Watson",
    role: "Nomad Collective",
    initials: "KW",
  },
  {
    brand: "Trailhead LLC.",
    brandIcon: Building2,
    quote: "My family loved the Milo adventures. It's incredible to see them explore and learn together.",
    name: "Cody Fisher",
    role: "Trailhead LLC",
    initials: "CF",
  },
];

export default function CommunitySection() {
  return (
    <>
      <section className="relative z-10 bg-white px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="border-t border-black/10 pt-10">
            <Tag n="04" label="Testimonial" />
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            {/* Left */}
            <div>
              <div className="overflow-hidden rounded-3xl">
                <img
                  src={MEDIA.meadow}
                  alt="Wanderful community"
                  loading="lazy"
                  className="h-52 w-full object-cover"
                />
              </div>
              <h2 className="mt-6 font-inter text-[clamp(28px,3.6vw,40px)] font-normal leading-[1.05] tracking-tight text-[#2c2c2c]">
                From Our
                <br />
                Traveler
                <br />
                Community
              </h2>
              <button
                aria-label="Next testimonial"
                className="mt-6 grid h-10 w-10 place-items-center rounded-full bg-black text-white transition-transform hover:scale-105"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Right cards */}
            <div className="grid gap-5 sm:grid-cols-2">
              {TESTIMONIALS.map((t) => (
                <article
                  key={t.name}
                  className="flex flex-col rounded-3xl bg-[#f4f3f1] p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <t.brandIcon size={18} className="text-[#2c2c2c]" />
                      <span className="text-[13px] font-medium text-[#2c2c2c]">
                        {t.brand}
                      </span>
                    </div>
                    <Avatar initials={t.initials} />
                  </div>

                  <Quote className="mt-6 h-6 w-6 text-[#e8743b]" fill="currentColor" />
                  <p className="mt-3 flex-1 font-inter text-[17px] leading-snug text-[#2c2c2c]">
                    {t.quote}
                  </p>

                  <div className="mt-6">
                    <div className="text-[13px] font-semibold text-[#2c2c2c]">
                      {t.name}
                    </div>
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
          <button className="group absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-black py-2 pl-5 pr-2 text-[13px] font-medium text-white">
            Join us
            <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-black transition-transform group-hover:translate-x-0.5">
              <ArrowUpRight size={14} />
            </span>
          </button>
        </div>
      </section>
    </>
  );
}
