import { BadgeCheck, Star } from "lucide-react";
import { Reveal } from "./Reveal";

const CDN =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3A4FMCrm8jYjCnPYN9rbcZn81hc";

interface Testimonial {
  type: "video" | "image";
  src: string;
  poster?: string;
  name: string;
  location: string;
  quote: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    type: "video",
    src: `${CDN}/hf_20260614_071259_43402115-9e68-4435-9866-8c570b89c789.mp4`,
    poster: `${CDN}/hf_20260614_070953_c225070d-f0cb-44a5-965e-0f721708567d.jpeg`,
    name: "Marcus Thorne",
    location: "Miami, USA",
    quote: "The climbing is unreal — did my usual loop way faster, barely winded.",
  },
  {
    type: "image",
    src: `${CDN}/hf_20260614_070959_07ff7833-b550-4219-9e3e-915f3295bed7.png`,
    name: "Camille Renaud",
    location: "Paris, FR",
    quote: "It turns every ride into the best part of my day. I'm obsessed.",
  },
  {
    type: "video",
    src: `${CDN}/hf_20260614_071248_ec1e8023-d981-4dea-be1e-938f12978033.mp4`,
    poster: `${CDN}/hf_20260614_070948_8065db6b-a632-4184-aac1-ebcee2d04ed5.jpeg`,
    name: "Lukas Nielsen",
    location: "Copenhagen, DK",
    quote: "Skeptical about full-suspension at this price. Then I rode it.",
  },
];

function Stars() {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-red-500 text-red-500" />
      ))}
    </div>
  );
}

export default function SocialProof() {
  return (
    <section id="riders" className="relative w-full bg-black px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      {/* Heading */}
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <span className="font-inter text-xs uppercase tracking-[0.3em] text-red-500">
            Real Riders. Real Trails.
          </span>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mx-auto mt-5 font-podium text-[clamp(2.6rem,7vw,6rem)] uppercase leading-[0.95] tracking-tight text-white">
            Already Out There
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="mx-auto mt-6 max-w-xl font-inter text-sm leading-relaxed text-white/60 sm:text-base">
            From Miami boulevards to Copenhagen bike lanes — riders are already
            living on the VANGUARD. Here's what it looks like.
          </p>
        </Reveal>
      </div>

      {/* Cards — three vertical, side by side */}
      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 120}>
            <figure className="group relative aspect-[9/16] overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
              {t.type === "video" ? (
                <video
                  src={t.src}
                  poster={t.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <img
                  src={t.src}
                  alt={`${t.name}, ${t.location}`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
              )}

              {/* Legibility gradient */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30" />

              {/* Verified tag */}
              <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1 backdrop-blur-md">
                <BadgeCheck className="h-3.5 w-3.5 text-red-500" />
                <span className="font-inter text-[10px] uppercase tracking-widest text-white/80">
                  Verified Rider
                </span>
              </div>

              {/* Caption */}
              <figcaption className="absolute inset-x-0 bottom-0 p-5">
                <Stars />
                <p className="mt-3 font-inter text-sm leading-relaxed text-white">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-4">
                  <div className="font-podium text-lg uppercase tracking-wide text-white">
                    {t.name}
                  </div>
                  <div className="font-inter text-[11px] uppercase tracking-widest text-white/50">
                    {t.location}
                  </div>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
