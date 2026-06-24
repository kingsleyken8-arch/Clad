import { ArrowUpRight } from "lucide-react";

const COLS = [
  { h: "Academy", links: ["Training", "Programs", "Coaches", "Facilities"] },
  { h: "Compete", links: ["Tournaments", "Rankings", "Membership", "Events"] },
  { h: "Company", links: ["About", "Careers", "Press", "Contact"] },
];

export default function Footer() {
  return (
    <footer
      data-character-end
      className="relative overflow-hidden bg-ink pt-20 text-white"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* CTA band */}
        <div className="flex flex-col items-start justify-between gap-8 border-b border-white/10 pb-16 lg:flex-row lg:items-end">
          <h2 className="font-display text-[clamp(2.6rem,7vw,6rem)] uppercase leading-[0.88] tracking-tight">
            Ready to
            <br />
            play strong<span className="text-lime">?</span>
          </h2>
          <a
            href="#"
            className="flex items-center gap-3 rounded-2xl bg-lime px-7 py-4 font-archivo text-lg font-extrabold uppercase text-ink transition-transform hover:-translate-y-1"
          >
            Book a Lesson
            <ArrowUpRight className="h-5 w-5" />
          </a>
        </div>

        {/* Link columns */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-lime text-ink">
                <span className="font-archivo text-sm font-black">A+</span>
              </span>
              <span className="font-archivo text-lg font-extrabold uppercase tracking-tight">
                Acetennis
              </span>
            </div>
            <p className="mt-4 max-w-xs font-inter text-sm text-white/50">
              Building champions on and off the court since 1998.
            </p>
          </div>
          {COLS.map((c) => (
            <div key={c.h}>
              <p className="font-inter text-sm font-semibold text-white/90">{c.h}</p>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="font-inter text-sm text-white/50 transition-colors hover:text-lime"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-8 sm:flex-row">
          <p className="font-inter text-xs text-white/40">
            © {new Date().getFullYear()} ACETENNIS Academy. All rights reserved.
          </p>
          <p className="font-inter text-xs text-white/40">Play Strong.</p>
        </div>
      </div>

      {/* Oversized ghost wordmark */}
      <div className="pointer-events-none select-none px-5 text-center">
        <span className="block font-display text-[18vw] uppercase leading-[0.8] tracking-tight text-white/[0.04]">
          Acetennis
        </span>
      </div>
    </footer>
  );
}
