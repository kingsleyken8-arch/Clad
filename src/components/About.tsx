import { ArrowUpRight, Check } from "lucide-react";
import { Reveal } from "./Reveal";
import { IMG } from "../data/assets";

const PERKS = [
  "Professional certified coaches",
  "Modern tennis courts",
  "Personalized training programs",
];

export default function About() {
  return (
    <section
      id="about"
      data-pose-stage="about"
      className="relative bg-paper py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:pr-[27vw]">
        {/* Section label row */}
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="grid h-8 w-8 place-items-center rounded-full border border-ink/30 font-inter text-xs font-semibold">
              A
            </span>
            <span className="font-inter text-sm text-ink/60">About</span>
            <span className="h-px flex-1 bg-ink/10" />
          </div>
        </Reveal>

        {/* Heading + intro */}
        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className="font-anton text-[clamp(2.2rem,5vw,4rem)] uppercase leading-[0.95] tracking-tight text-ink">
              Building Champions On and Off the Court
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <div className="font-inter text-[15px] leading-relaxed text-ink/70">
              <p>
                Our tennis academy provides world-class training programs designed
                for players of all levels. From beginners learning the basics to
                advanced athletes competing at national tournaments, our coaches
                focus on technique, fitness, and match strategy.
              </p>
              <p className="mt-4">
                We combine modern training methods, performance analytics, and
                professional coaching to help every player reach their full
                potential.
              </p>
              <a
                href="#"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-ink py-3 pl-5 pr-3 font-inter text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                Book a Lesson
                <span className="grid h-6 w-6 place-items-center rounded-lg bg-lime text-ink">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </a>
            </div>
          </Reveal>
        </div>

        {/* Collage */}
        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          {/* Big feature image with stat chips */}
          <Reveal variant="zoom" className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl">
              <img
                src={IMG.aboutMan}
                alt="Player mid backswing"
                className="h-[26rem] w-full object-cover sm:h-[34rem]"
              />
              {/* arrow box */}
              <span className="absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-xl bg-white/90 text-ink">
                <ArrowUpRight className="h-5 w-5" />
              </span>
              {/* stat chips */}
              <div className="absolute inset-x-5 bottom-5 flex gap-3">
                <StatChip value="500+" label="Active Players" />
                <StatChip value="20+" label="Professional Coaches" />
              </div>
            </div>
          </Reveal>

          {/* Right column: small image + 15 years */}
          <div className="flex flex-col gap-5 lg:col-span-5">
            <Reveal variant="right">
              <img
                src={IMG.aboutGirlCourt}
                alt="Player on court"
                className="h-52 w-full rounded-3xl object-cover sm:h-60"
              />
            </Reveal>
            <Reveal variant="right" delay={120}>
              <div className="rounded-3xl bg-white p-7 shadow-card">
                <div className="flex items-end gap-3">
                  <span className="font-anton text-7xl leading-none text-lime-600">
                    15
                  </span>
                  <span className="mb-1 font-archivo text-xl font-extrabold uppercase leading-none text-ink">
                    Years of
                    <br />
                    Excellence
                  </span>
                </div>
                <ul className="mt-6 space-y-3">
                  {PERKS.map((p) => (
                    <li
                      key={p}
                      className="flex items-center gap-3 font-inter text-sm text-ink/80"
                    >
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-lime/30 text-lime-700">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatChip({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-1 rounded-2xl bg-ink/55 px-4 py-3 backdrop-blur-md">
      <div className="font-archivo text-2xl font-extrabold text-lime">{value}</div>
      <div className="font-inter text-xs text-white/80">{label}</div>
    </div>
  );
}
