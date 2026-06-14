import { ArrowRight, Plus } from "lucide-react";
import { Reveal } from "./Reveal";

const CDN =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3A4FMCrm8jYjCnPYN9rbcZn81hc";

const IMG_COCKPIT = `${CDN}/hf_20260614_171802_a80a25f1-0675-4aa4-9e20-16901e212223.png`;
const IMG_SEAT = `${CDN}/hf_20260614_171804_d3a59a15-48e4-456c-bd15-192d4f863316.png`;
const IMG_HEADTUBE = `${CDN}/hf_20260614_171805_5747d63e-4990-45e5-8ed5-3efcf19667ec.png`;
const IMG_HERO = `${CDN}/hf_20260614_171806_5d440653-58ae-4b21-8ddd-aec663af3a0f.png`;

const FEATURES = [
  { label: "Brake Style", value: "4-piston hydraulic disc" },
  { label: "Ideal terrain", value: "Singletrack, technical descents & bike park" },
  { label: "Tire Clearance", value: "Up to 29 × 2.5″" },
  { label: "Materials", value: "Monocoque Carbon or Carbon-Alloy" },
];

function DetailImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`overflow-hidden bg-[#e9e9e9] ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out hover:scale-105"
      />
    </div>
  );
}

export default function CustomBike() {
  return (
    <section
      id="custom-bike"
      className="relative w-full bg-white px-6 py-24 text-neutral-900 sm:px-10 lg:px-16 lg:py-28"
    >
      <div className="relative mx-auto max-w-7xl">
        {/* Pagination marker */}
        <span className="absolute right-0 top-0 font-inter text-xs tracking-widest text-neutral-400">
          01 / 07
        </span>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:grid-rows-[auto_auto_auto]">
          {/* Tall cockpit detail — left, spans two rows */}
          <Reveal className="lg:col-start-1 lg:row-start-1 lg:row-span-2">
            <DetailImage
              src={IMG_COCKPIT}
              alt="VANGUARD cockpit detail"
              className="aspect-[3/4] h-full"
            />
          </Reveal>

          {/* Two top detail images */}
          <Reveal delay={80} className="lg:col-start-2 lg:row-start-1">
            <DetailImage src={IMG_SEAT} alt="Seat cluster detail" className="aspect-[4/3]" />
          </Reveal>
          <Reveal delay={160} className="lg:col-start-3 lg:row-start-1">
            <DetailImage src={IMG_HEADTUBE} alt="Head tube and fork detail" className="aspect-[4/3]" />
          </Reveal>

          {/* Title + meta block */}
          <div className="lg:col-start-2 lg:col-span-2 lg:row-start-2">
            <Reveal>
              <h2 className="font-podium text-[clamp(2.6rem,6vw,5rem)] uppercase leading-[0.9] tracking-tight text-neutral-900">
                The New
                <br />
                Custom Bike
              </h2>
              <p className="mt-3 font-podium text-[clamp(1.8rem,4vw,3rem)] uppercase tracking-tight text-red-600">
                &ldquo;VGD&nbsp;0087&rdquo;
              </p>
            </Reveal>

            <Reveal delay={120}>
              <div className="mt-8 flex flex-wrap gap-x-16 gap-y-6">
                <div>
                  <div className="font-inter text-xs text-neutral-500">
                    Frameset price, Carbon:
                  </div>
                  <div className="font-inter text-2xl font-bold text-neutral-900">
                    $4,900
                  </div>
                </div>
                <div>
                  <div className="font-inter text-xs text-neutral-500">
                    Frameset price, Carbon&nbsp;LTD:
                  </div>
                  <div className="font-inter text-2xl font-bold text-neutral-900">
                    $6,900
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-8 flex items-center justify-between">
                <a
                  href="#"
                  className="group inline-flex items-center gap-2 bg-red-600 px-6 py-3 font-inter text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-red-700"
                >
                  Add to Cart
                  <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                </a>
                <a
                  href="#"
                  className="group inline-flex items-center gap-2 font-inter text-xs font-semibold uppercase tracking-widest text-neutral-900"
                >
                  Next
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </Reveal>
          </div>

          {/* Features — bottom left */}
          <Reveal className="lg:col-start-1 lg:row-start-3 lg:self-center">
            <h3 className="font-inter text-sm font-bold text-neutral-900">
              Features:
            </h3>
            <dl className="mt-5 space-y-4">
              {FEATURES.map((f) => (
                <div key={f.label}>
                  <dt className="font-inter text-xs font-semibold text-neutral-900">
                    {f.label}:
                  </dt>
                  <dd className="font-inter text-sm leading-relaxed text-neutral-500">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* Big hero bike — bottom, spans two columns */}
          <Reveal delay={120} className="lg:col-start-2 lg:col-span-2 lg:row-start-3">
            <DetailImage
              src={IMG_HERO}
              alt="The VANGUARD VGD 0087 custom bike"
              className="aspect-[3/2]"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
