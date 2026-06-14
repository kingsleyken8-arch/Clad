import { useReveal } from "../hooks/useReveal";
import type { Compartment } from "../data/compartments";

interface Props {
  data: Compartment;
  reverse: boolean;
}

export default function CompartmentSection({ data, reverse }: Props) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="relative grid grid-cols-1 items-center gap-10 border-t border-white/10 px-6 py-16 sm:px-10 sm:py-24 lg:grid-cols-2 lg:gap-16 lg:px-16 lg:py-32"
    >
      {/* Image */}
      <div className={reverse ? "lg:order-2" : "lg:order-1"}>
        <div
          className={`reveal reveal-zoom group relative overflow-hidden rounded-sm ${
            visible ? "is-visible" : ""
          }`}
        >
          <img
            src={data.image}
            alt={`${data.name} of the VANGUARD mountain bike`}
            loading="lazy"
            className="aspect-[3/2] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          />
          {/* legibility veil */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          {/* oversized index watermark */}
          <span className="pointer-events-none absolute bottom-1 left-3 font-podium text-7xl leading-none text-white/15 sm:text-8xl">
            {data.index}
          </span>
        </div>
      </div>

      {/* Text */}
      <div className={reverse ? "lg:order-1" : "lg:order-2"}>
        <div
          className={`reveal ${reverse ? "reveal-left" : "reveal-right"} ${
            visible ? "is-visible" : ""
          }`}
          style={{ transitionDelay: "140ms" }}
        >
          {/* eyebrow */}
          <div className="flex items-center gap-3">
            <span className="font-inter text-xs font-semibold tracking-[0.3em] text-red-500">
              {data.index}
            </span>
            <span className="h-px w-10 bg-red-500/60" />
            <span className="font-inter text-xs uppercase tracking-[0.3em] text-white/50">
              {data.tagline}
            </span>
          </div>

          {/* name */}
          <h3 className="mt-5 font-podium text-[clamp(2.4rem,6vw,4.5rem)] uppercase leading-[0.95] tracking-tight text-white">
            {data.name}
          </h3>

          {/* description */}
          <p className="mt-5 max-w-md font-inter text-sm leading-relaxed text-white/70 sm:text-base">
            {data.description}
          </p>

          {/* specs */}
          <div className="mt-8 flex flex-wrap gap-6 sm:gap-10">
            {data.specs.map((spec) => (
              <div key={spec.label}>
                <div className="font-inter text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {spec.value}
                </div>
                <div className="mt-1 text-[9px] uppercase tracking-widest text-white/50 sm:text-[10px]">
                  {spec.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
