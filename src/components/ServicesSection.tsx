import { ArrowUpRight } from "lucide-react";
import { JOURNEYS_IMG } from "../data/journeys";

interface Card {
  title: string;
  price: string;
  img?: string;
}

const CARDS: Card[] = [
  { title: "First-time explorer trips", price: "from $1,300" },
  { title: "Meadow & wildflower trails", price: "from $2,400", img: JOURNEYS_IMG.meadow },
  { title: "Mountain summit treks", price: "from $3,200" },
  { title: "Dreamy countryside getaways", price: "from $2,700", img: JOURNEYS_IMG.countryside },
  { title: "Coastal & island hops", price: "from $2,000" },
  { title: "Family adventures with Milo", price: "from $1,900", img: JOURNEYS_IMG.milo },
];

function Wave() {
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 top-1/2 w-full -translate-y-1/2"
      viewBox="0 0 400 140"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {[0, 14, 28, 42].map((o) => (
        <path
          key={o}
          d={`M0 ${70 + o - 21} C 90 ${30 + o - 21}, 150 ${110 + o - 21}, 250 ${70 + o - 21} S 400 ${30 + o - 21}, 400 ${70 + o - 21}`}
          stroke="#dcdad6"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

export default function ServicesSection() {
  return (
    <section className="relative z-10 bg-white px-6 pb-28 pt-4 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-inter text-[clamp(28px,4vw,44px)] font-normal tracking-tight text-[#8f8f8f]">
          Journeys
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c) =>
            c.img ? (
              /* ---- Image card ---- */
              <article
                key={c.title}
                className="group relative h-[15.5rem] overflow-hidden rounded-2xl"
              >
                <img
                  src={c.img}
                  alt={c.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/30" />
                <h3 className="absolute left-6 top-6 max-w-[78%] font-inter text-[17px] font-normal leading-snug text-white drop-shadow">
                  {c.title}
                </h3>
                <span className="absolute bottom-6 left-6 text-[14px] font-medium text-white drop-shadow">
                  {c.price}
                </span>
                <button
                  aria-label={`Explore ${c.title}`}
                  className="absolute bottom-5 right-5 grid h-10 w-10 place-items-center rounded-full bg-white text-[#e8743b] transition-transform group-hover:scale-105"
                >
                  <ArrowUpRight size={16} />
                </button>
              </article>
            ) : (
              /* ---- Plain card ---- */
              <article
                key={c.title}
                className="group relative h-[15.5rem] overflow-hidden rounded-2xl bg-[#f4f3f1]"
              >
                <Wave />
                <h3 className="absolute left-6 top-6 max-w-[80%] font-inter text-[17px] font-normal leading-snug text-[#2c2c2c]">
                  {c.title}
                </h3>
                <span className="absolute bottom-6 left-6 text-[14px] font-medium text-[#3a3a3a]">
                  {c.price}
                </span>
                <button
                  aria-label={`Explore ${c.title}`}
                  className="absolute bottom-5 right-5 grid h-10 w-10 place-items-center rounded-full bg-[#e8743b] text-white transition-transform group-hover:scale-105"
                >
                  <ArrowUpRight size={16} />
                </button>
              </article>
            )
          )}
        </div>
      </div>
    </section>
  );
}
