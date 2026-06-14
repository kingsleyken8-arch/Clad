import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";

export default function ClosingCTA() {
  return (
    <div className="relative bg-black px-6 py-24 text-center sm:px-10 lg:px-16 lg:py-36">
      <Reveal>
        <span className="font-inter text-xs uppercase tracking-[0.3em] text-white/50">
          One Machine. Zero Compromise.
        </span>
      </Reveal>
      <Reveal delay={100}>
        <h2 className="mx-auto mt-5 max-w-3xl font-podium text-[clamp(2.8rem,8vw,7rem)] uppercase leading-[0.92] tracking-tight text-white">
          Built To Lead.
        </h2>
      </Reveal>
      <Reveal delay={200}>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <a
            href="#"
            className="group flex items-center gap-2 bg-red-600 px-6 py-4 font-inter text-xs uppercase tracking-widest text-white transition-colors hover:bg-red-700 sm:px-8"
          >
            Build Your Vanguard
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <a
            href="#"
            className="flex items-center gap-2 border border-white/30 px-6 py-4 font-inter text-xs uppercase tracking-widest text-white transition-all hover:border-white/60 hover:bg-white/10 sm:px-8"
          >
            Book a Test Ride
          </a>
        </div>
      </Reveal>
    </div>
  );
}
