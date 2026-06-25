import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";

const CTA_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3A4FMCrm8jYjCnPYN9rbcZn81hc/hf_20260614_064935_718e8f10-d996-4ce3-915c-48940bd4de11.mp4";

export default function ClosingCTA() {
  return (
    <section
      id="cta"
      className="relative flex min-h-[88vh] w-full items-center justify-center overflow-hidden bg-black px-6 py-28 text-center"
    >
      {/* Cinematic bike video backdrop */}
      <video
        src={CTA_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-50"
      />

      {/* Darkening + red glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-black/55 to-black" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/20 blur-[130px]" />

      {/* Oversized ghost wordmark */}
      <span className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-podium text-[22vw] uppercase leading-none tracking-tighter text-white/[0.04]">
        Vanguard
      </span>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl">
        <Reveal>
          <span className="font-inter text-xs uppercase tracking-[0.3em] text-red-500">
            One Machine. Zero Compromise.
          </span>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mx-auto mt-6 font-podium text-[clamp(3.2rem,11vw,9rem)] uppercase leading-[0.88] tracking-tight text-white">
            Built To Lead.
          </h2>
        </Reveal>
        <Reveal delay={170}>
          <p className="mx-auto mt-6 max-w-xl font-inter text-sm leading-relaxed text-white/60 sm:text-base">
            Configure your geometry, choose your build, and ride away on the
            machine that refuses to back down.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a
              href="#"
              className="group flex items-center gap-2 bg-red-600 px-7 py-4 font-inter text-xs uppercase tracking-widest text-white transition-colors hover:bg-red-700 sm:px-9"
            >
              Build Your Vanguard
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <a
              href="#"
              className="flex items-center gap-2 border border-white/30 px-7 py-4 font-inter text-xs uppercase tracking-widest text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/10 sm:px-9"
            >
              Book a Test Ride
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
