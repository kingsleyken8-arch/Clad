import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Tag } from "./clinicShared";
import { MEDIA } from "../data/programs";

const TRIPS = [
  {
    n: "01",
    title: "Aurora Chase",
    desc: "This journey is all about chasing the northern lights — where travelers drift far north to stand beneath skies that dance in color.",
    expanded: true,
  },
  { n: "02", title: "Desert Crossing", expanded: false },
  { n: "03", title: "Island Hopper", expanded: false },
  { n: "04", title: "Summit Weekend", expanded: false },
];

export default function ScheduleSection() {
  return (
    <section className="relative z-10 bg-white px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="border-t border-black/10 pt-10">
          <Tag n="02" label="Schedule" />
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          {/* Left */}
          <div>
            <h2 className="font-inter text-[clamp(28px,3.6vw,42px)] font-normal leading-[1.1] tracking-tight text-[#2c2c2c]">
              <span className="text-[#e8743b]">Set off:</span>
              <br />
              Upcoming departures
            </h2>
            <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-[#8a8a8a]">
              Don't miss a single sunrise. Check out our upcoming departures to
              stay on top of dates, destinations and fellow wanderers.
            </p>
            <div className="mt-6 overflow-hidden rounded-3xl">
              <video
                src={MEDIA.video}
                autoPlay
                muted
                loop
                playsInline
                className="h-64 w-full object-cover"
              />
            </div>
          </div>

          {/* Right list */}
          <div className="flex flex-col">
            {TRIPS.map((t) => (
              <div key={t.n} className="border-b border-black/10 py-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-baseline gap-4">
                    <span className="text-[12px] text-[#b0b0b0]">{t.n}</span>
                    <span className="font-inter text-[19px] text-[#2c2c2c]">
                      {t.title}
                    </span>
                  </div>
                  <ChevronRight size={18} className="text-[#b0b0b0]" />
                </div>

                {t.expanded && (
                  <div className="mt-4 flex items-start gap-4 pl-8">
                    <div className="flex-1">
                      <p className="text-[13px] leading-relaxed text-[#8a8a8a]">
                        {t.desc}
                      </p>
                      <button className="mt-4 rounded-full border border-black/15 px-5 py-2 text-[12px] font-medium text-[#3a3a3a] transition-colors hover:bg-black/5">
                        View Details
                      </button>
                    </div>
                    <img
                      src={MEDIA.milo}
                      alt={t.title}
                      loading="lazy"
                      className="h-20 w-24 shrink-0 rounded-xl object-cover"
                    />
                  </div>
                )}
              </div>
            ))}

            <div className="mt-6 flex justify-end">
              <button className="group inline-flex items-center gap-2 rounded-full bg-black py-2 pl-5 pr-2 text-[13px] font-medium text-white">
                Join us
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-black transition-transform group-hover:translate-x-0.5">
                  <ArrowUpRight size={14} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
