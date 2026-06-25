import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

const CDN =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3A4FMCrm8jYjCnPYN9rbcZn81hc";

const BENTO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3A4FMCrm8jYjCnPYN9rbcZn81hc/hf_20260614_064935_718e8f10-d996-4ce3-915c-48940bd4de11.mp4";

interface CardProps {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
  media: ReactNode;
}

/** A bento tile: full-bleed media with a frosted-glass caption panel. */
function BentoCard({ eyebrow, title, description, className = "", media }: CardProps) {
  return (
    <div
      className={`group relative min-h-[16rem] overflow-hidden rounded-2xl border border-white/10 ${className}`}
    >
      {/* Media */}
      <div className="absolute inset-0">{media}</div>

      {/* Darkening for legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      {/* Glassmorphism caption */}
      <div className="absolute inset-x-3 bottom-3 rounded-xl border border-white/15 bg-white/[0.07] p-5 backdrop-blur-md sm:inset-x-4 sm:bottom-4">
        <span className="font-inter text-[10px] uppercase tracking-[0.3em] text-red-400">
          {eyebrow}
        </span>
        <h3 className="mt-2 font-podium text-2xl uppercase leading-[0.95] tracking-tight text-white sm:text-3xl">
          {title}
        </h3>
        {/* Subtext stays hidden until the card is hovered (or focused) */}
        <div className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-500 ease-out group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100">
          <p className="min-h-0 overflow-hidden font-inter text-sm leading-relaxed text-white/70 transition-[margin] duration-500 ease-out group-hover:mt-2 group-focus-within:mt-2">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

const cardImg = (src: string, alt: string) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
  />
);

export default function Bento() {
  return (
    <section id="why" className="relative w-full bg-black px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      {/* Heading */}
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <span className="font-inter text-xs uppercase tracking-[0.3em] text-red-500">
            Why Vanguard
          </span>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mx-auto mt-5 font-podium text-[clamp(2.6rem,7vw,6rem)] uppercase leading-[0.95] tracking-tight text-white">
            Born To Ride,
            <br />
            Not To Wrench
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="mx-auto mt-6 max-w-xl font-inter text-sm leading-relaxed text-white/60 sm:text-base">
            Every system is dialed at the factory, so nothing stands between you
            and the trail. This is what you actually get.
          </p>
        </Reveal>
      </div>

      {/* Bento grid */}
      <Reveal delay={120} className="mx-auto mt-14 max-w-7xl">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-fr lg:[grid-template-rows:repeat(2,minmax(0,1fr))] lg:h-[44rem]">
          {/* 1 — 360 video (large) */}
          <BentoCard
            className="sm:col-span-2 lg:col-span-2 lg:row-span-2"
            eyebrow="In Its Element"
            title="Built To Conquer"
            description="Watch the machine do what it was born to do — devour the trail."
            media={
              <video
                src={BENTO_VIDEO}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />
            }
          />

          {/* 2 — Carbon frame */}
          <BentoCard
            eyebrow="Featherweight"
            title="Carbon Where It Counts"
            description="1,899g of monocoque carbon — light enough to fly, brutal enough to land."
            media={cardImg(
              `${CDN}/hf_20260614_093838_10096b5e-6227-40a7-bc7e-e3773766d0e5.png`,
              "Carbon frame"
            )}
          />

          {/* 3 — Suspension */}
          <BentoCard
            eyebrow="Bottomless"
            title="160mm Of Travel"
            description="Devours roots and rock so the trail simply disappears beneath you."
            media={cardImg(
              `${CDN}/hf_20260614_093841_0033a166-70f3-4f40-9a0c-676887d2975a.png`,
              "Suspension fork"
            )}
          />

          {/* 4 — Drivetrain */}
          <BentoCard
            eyebrow="Relentless"
            title="12-Speed Drive"
            description="Every pedal stroke becomes forward fury, even over the roughest ground."
            media={cardImg(
              `${CDN}/hf_20260614_093842_b8c62628-1dc1-4111-9bca-39a3c9983ae9.png`,
              "Drivetrain"
            )}
          />

          {/* 5 — Brakes */}
          <BentoCard
            eyebrow="Authority"
            title="Stop On A Dime"
            description="Four-piston bite on 203mm rotors — instant, modulated, total control."
            media={cardImg(
              `${CDN}/hf_20260614_093844_357eb9ac-a4e2-490b-bb35-a3bc9bcc3fb1.png`,
              "Brakes"
            )}
          />
        </div>
      </Reveal>
    </section>
  );
}
