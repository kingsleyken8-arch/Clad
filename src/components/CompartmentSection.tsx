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
      id={data.id}
      className="relative grid scroll-mt-24 grid-cols-1 items-center gap-6 px-6 py-12 sm:px-10 sm:py-20 lg:grid-cols-2 lg:gap-12 lg:px-16 lg:py-28"
    >
      {/* Image — edges feathered into the page, no box */}
      <div className={reverse ? "lg:order-2" : "lg:order-1"}>
        <div
          className={`reveal reveal-zoom group relative ${
            visible ? "is-visible" : ""
          }`}
        >
          <img
            src={data.image}
            alt={`${data.name} of the VANGUARD mountain bike`}
            loading="lazy"
            className="image-bleed w-full object-contain transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
          />
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
