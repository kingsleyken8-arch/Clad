import { ArrowUpRight, ChevronLeft, ChevronRight, Plus, Compass } from "lucide-react";
import { Tag } from "./clinicShared";
import { MEDIA } from "../data/programs";

export default function ProgramsSection() {
  return (
    <section className="relative z-10 bg-white px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col gap-6 border-t border-black/10 pt-10 md:flex-row md:items-start md:justify-between">
          <Tag n="01" label="Programs" />
          <h2 className="max-w-md font-inter text-[clamp(26px,3.4vw,38px)] font-normal leading-tight tracking-tight text-[#2c2c2c] md:text-right">
            Trips designed for every explorer
          </h2>
        </div>

        {/* Content */}
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {/* Big featured card */}
          <article className="group relative h-[24rem] overflow-hidden rounded-3xl">
            <img
              src={MEDIA.meadow}
              alt="Wander Lite journey"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-black/20" />
            <div className="absolute left-6 top-6 flex gap-2">
              {["Beginner", "Easygoing"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/40 bg-white/10 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md"
                >
                  {t}
                </span>
              ))}
            </div>
            <h3 className="absolute bottom-6 left-6 font-inter text-4xl font-normal text-white">
              Wander Lite
            </h3>
            <button
              aria-label="Explore Wander Lite"
              className="absolute bottom-6 right-6 grid h-11 w-11 place-items-center rounded-full bg-white text-[#2c2c2c] transition-transform group-hover:scale-105"
            >
              <ArrowUpRight size={18} />
            </button>
          </article>

          {/* Right column */}
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-5">
              {/* small image card */}
              <article className="group relative h-[12rem] overflow-hidden rounded-3xl">
                <img
                  src={MEDIA.milo}
                  alt="Weekend Wander"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                <div className="absolute left-4 top-4 grid h-7 w-7 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md">
                  <Plus size={14} />
                </div>
                <span className="absolute bottom-4 left-4 font-inter text-[15px] text-white">
                  Weekend Wander
                </span>
              </article>
              {/* small plain card */}
              <article className="relative h-[12rem] overflow-hidden rounded-3xl bg-gradient-to-br from-[#2f3a2c] to-[#1d241b]">
                <Compass className="absolute right-4 top-4 h-7 w-7 text-white/70" strokeWidth={1.5} />
                <span className="absolute bottom-4 left-4 font-inter text-[15px] text-white">
                  Grand Voyage
                </span>
              </article>
            </div>

            <p className="text-[14px] leading-relaxed text-[#8a8a8a]">
              Discover the ideal journey tailored to your pace, your style and
              your sense of adventure — the perfect fit for every traveler, from
              first escape to grand expedition.
            </p>

            <div className="flex gap-2">
              <button
                aria-label="Previous"
                className="grid h-10 w-10 place-items-center rounded-full border border-black/15 text-[#3a3a3a] transition-colors hover:bg-black/5"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                aria-label="Next"
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
