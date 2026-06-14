import { Reveal } from "./Reveal";

const CDN =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3A4FMCrm8jYjCnPYN9rbcZn81hc";

// White-background bike — mix-blend-multiply drops the white over both the
// page and the gray rectangle, so no cutout is needed.
const BIKE_WHITE = `${CDN}/hf_20260614_174609_32049cc5-105f-4443-8ad8-6f1515f198b7.png`;
// Small detail shot for the bottom-right frame.
const BIKE_DETAIL = `${CDN}/hf_20260614_171802_a80a25f1-0675-4aa4-9e20-16901e212223.png`;

const LINKS = ["Store", "About us", "Social"];

export default function RollOut() {
  return (
    <section
      id="ride"
      className="relative w-full overflow-hidden bg-white text-neutral-900"
    >
      <div className="relative mx-auto h-[34rem] max-w-7xl sm:h-[40rem] lg:h-[46rem]">
        {/* Brand mark */}
        <div className="absolute left-6 top-8 z-20 flex items-center gap-3 sm:left-10 lg:left-16">
          <span className="h-3.5 w-3.5 rounded-full bg-neutral-900" />
          <span className="font-podium text-lg font-bold uppercase tracking-wider text-neutral-900">
            Vanguard
          </span>
        </div>

        {/* Footer-ish links */}
        <nav className="absolute bottom-10 left-6 z-20 hidden space-y-2 sm:left-10 sm:block lg:left-16">
          {LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="block font-inter text-sm text-neutral-600 transition-colors hover:text-red-600"
            >
              {link}
            </a>
          ))}
        </nav>

        {/* ---- The stage: gray rectangle + masked rolling bike ---- */}
        <div className="absolute inset-0">
          {/* Tall gray rectangle */}
          <div className="absolute left-[28%] top-[8%] bottom-[12%] w-[26%] bg-[#e7e7e7]" />

          {/*
            Mask: this wrapper's right edge sits on the rectangle's right edge
            (28% + 26% = 54%), so anything the rear wheel pushes past it is
            clipped — the bike looks like it's rolling back into the rectangle.
          */}
          <div className="absolute inset-y-0 left-0 w-[54%] overflow-hidden">
            <img
              src={BIKE_WHITE}
              alt="VANGUARD bike rolling out"
              className="animate-bike-roll absolute bottom-[12%] right-[-8%] h-[58%] w-auto max-w-none mix-blend-multiply sm:h-[62%]"
            />
          </div>
        </div>

        {/* Heading + copy */}
        <div className="absolute right-6 top-20 z-20 max-w-[20rem] text-right sm:right-10 sm:top-24 lg:right-16 lg:top-28 lg:max-w-md lg:text-left">
          <Reveal>
            <h2 className="font-podium text-[clamp(2rem,4.5vw,3.6rem)] uppercase leading-[1.02] tracking-tight text-neutral-900">
              It never <span className="text-red-600">gets easier</span>
              <br />
              you just go faster
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="ml-auto mt-6 max-w-xs font-inter text-sm leading-relaxed text-neutral-400 lg:ml-0">
              Dawn till dusk, singletrack or street. Four-piston hydraulic
              brakes haul you down the instant you ask for them — then the trail
              opens up and you&apos;re gone again.
            </p>
          </Reveal>
        </div>

        {/* Small detail frame, bottom-right */}
        <div className="absolute bottom-12 right-6 z-20 hidden w-44 overflow-hidden bg-[#e7e7e7] lg:right-16 lg:block xl:w-52">
          <img
            src={BIKE_DETAIL}
            alt="Cockpit detail"
            loading="lazy"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
