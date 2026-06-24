import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { IMG } from "../data/assets";

const CARDS = [
  { img: IMG.trainBalls, title: "Beginner Training", coach: "Phillip Kenter", arrows: false },
  { img: IMG.trainBeginner, title: "Intermediate Drills", coach: "Sofia Marin", arrows: true },
  { img: IMG.trainAdvanced, title: "Advanced Training", coach: "James Curtis", arrows: false },
];

export default function Training() {
  return (
    <section
      id="training"
      data-pose-stage="training"
      className="relative bg-paper pb-24 pt-4 sm:pb-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="grid h-8 w-8 place-items-center rounded-full border border-ink/30 font-inter text-xs font-semibold">
              B
            </span>
            <span className="font-inter text-sm text-ink/60">Training Program</span>
            <span className="h-px flex-1 bg-ink/10" />
          </div>
        </Reveal>

        <Reveal>
          <h2 className="mt-8 max-w-2xl font-display text-[clamp(2rem,4.4vw,3.4rem)] uppercase leading-[0.95] tracking-tight text-ink">
            Programs for every level of play
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 110} variant="up">
              <article className="group relative overflow-hidden rounded-3xl">
                <img
                  src={c.img}
                  alt={c.title}
                  className="h-[24rem] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />

                {c.arrows && (
                  <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink">
                      <ArrowLeft className="h-4 w-4" />
                    </span>
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                )}

                <div className="absolute inset-x-5 bottom-5">
                  <p className="font-inter text-xs uppercase tracking-widest text-lime">
                    {c.coach}
                  </p>
                  <h3 className="mt-1 font-archivo text-2xl font-extrabold text-white">
                    {c.title}
                  </h3>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
