import type { LucideIcon } from "lucide-react";
import { Bike, Cog, ShoppingBag } from "lucide-react";
import { Reveal } from "./Reveal";

const CDN =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3A4FMCrm8jYjCnPYN9rbcZn81hc";

const KIDS_IMAGE = `${CDN}/hf_20260614_170442_4a1e0271-0506-4127-b922-d2c4807ed96f.png`;
const ACCESSORIES_IMAGE = `${CDN}/hf_20260614_143449_e78988c9-e9e9-48dd-9632-05533ab47c3b.png`;

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Cog,
    title: "Complete Overhaul",
    description:
      "A full strip-down, service and rebuild so your bike runs factory-fresh — every bearing cleaned, every bolt torqued to spec.",
  },
  {
    icon: ShoppingBag,
    title: "Custom Parts & Accessories",
    description:
      "Hand-picked upgrades and accessories, fitted and dialed in to match exactly how and where you ride.",
  },
  {
    icon: Bike,
    title: "Bike Fitting & Delivery",
    description:
      "Pro fitting for all-day comfort and power, then delivered to your door built, tuned and ready to ride.",
  },
];

/** Square icon frame with corner brackets, like the reference. */
function BracketIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
      <span className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-neutral-300" />
      <span className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-neutral-300" />
      <span className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-neutral-300" />
      <span className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-neutral-300" />
      <Icon className="h-11 w-11 text-red-600" strokeWidth={1.25} />
    </div>
  );
}

interface PromoProps {
  title: string;
  subtitle: string;
  image: string;
  alt: string;
}

function PromoPanel({ title, subtitle, image, alt }: PromoProps) {
  return (
    <div className="relative flex min-h-[320px] items-center overflow-hidden bg-[#f1f1f1] lg:min-h-[380px]">
      {/* Image bleeds in from the right (no gradient) */}
      <img
        src={image}
        alt={alt}
        loading="lazy"
        className="absolute right-0 top-0 h-full w-1/2 object-cover"
      />

      {/* Copy */}
      <div className="relative z-10 max-w-[55%] px-8 py-12 sm:px-12 lg:px-16">
        <h3 className="font-podium text-3xl uppercase tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
          {title}
        </h3>
        <p className="mt-3 font-inter text-sm text-neutral-500">{subtitle}</p>
        <a
          href="#"
          className="mt-6 inline-flex items-center border-2 border-red-600 px-7 py-3 font-inter text-[11px] font-semibold uppercase tracking-widest text-neutral-900 transition-colors hover:bg-red-600 hover:text-white"
        >
          Shop Now
        </a>
      </div>
    </div>
  );
}

export default function Facilities() {
  return (
    <section id="facilities" className="w-full bg-white text-neutral-900">
      {/* ---- Features ---- */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:px-16 lg:py-28">
        <div className="text-center">
          <Reveal>
            <span className="font-inter text-xs font-semibold uppercase tracking-[0.3em] text-red-600">
              Your Ride Starts Here.
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-5 font-podium text-[clamp(2.6rem,7vw,6rem)] uppercase leading-[0.95] tracking-tight text-neutral-900">
              Our Facilities &amp; Features
            </h2>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-0">
          {FEATURES.map((feature, i) => (
            <Reveal
              key={feature.title}
              delay={i * 120}
              className={`px-0 text-center md:px-8 ${
                i > 0 ? "md:border-l md:border-neutral-200" : ""
              }`}
            >
              <BracketIcon icon={feature.icon} />
              <h3 className="mt-7 font-podium text-2xl uppercase tracking-tight text-neutral-900">
                {feature.title}
              </h3>
              <p className="mx-auto mt-4 max-w-xs font-inter text-sm leading-relaxed text-neutral-500">
                {feature.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ---- Promo band ---- */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <PromoPanel
          title="Kids Bikes"
          subtitle="Close-out pricing on dozens of products"
          image={KIDS_IMAGE}
          alt="Kids mountain bike"
        />
        <PromoPanel
          title="Accessories"
          subtitle="Close-out pricing on dozens of products"
          image={ACCESSORIES_IMAGE}
          alt="Cyclist wearing helmet and accessories"
        />
      </div>
    </section>
  );
}
