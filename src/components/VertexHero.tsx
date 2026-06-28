import { ArrowUpRight } from "lucide-react";

/**
 * Hero section rebuilt from the VertexAI reference, using the Higgsfield-
 * generated oil-painting portrait (hands cropped out of view) as the
 * full-bleed background.
 *
 * The image is served straight from Higgsfield's CDN. Swap HERO_IMAGE to the
 * "variant B" URL (…9f4541b6…) if you prefer that take.
 */
const HERO_IMAGE =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3A4FMCrm8jYjCnPYN9rbcZn81hc/hf_20260628_183247_f0def875-a151-4e10-9fc0-e85bea8ffc94.png";

const NAV_LINKS = ["Product", "Platform", "Customers", "Company"];

export default function VertexHero() {
  return (
    <div className="min-h-screen w-full bg-black p-2 sm:p-4">
      <section className="relative h-[calc(100vh-1rem)] w-full overflow-hidden rounded-[28px] sm:h-[calc(100vh-2rem)]">
        {/* background painting */}
        <img
          src={HERO_IMAGE}
          alt="Oil-painting portrait — Redefine space with intelligent design"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* legibility scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/45" />

        {/* content */}
        <div className="relative z-10 flex h-full flex-col">
          {/* ---------- nav ---------- */}
          <header className="flex items-center justify-between px-5 py-4 sm:px-9 sm:py-6">
            <div className="flex items-center gap-2.5 text-white">
              <Logo />
              <span className="text-lg font-semibold tracking-tight">
                VertexAI
              </span>
            </div>

            <nav className="flex items-center gap-1 rounded-full bg-black/30 p-1.5 pl-2 backdrop-blur-md ring-1 ring-white/10">
              <ul className="hidden items-center gap-1 md:flex">
                {NAV_LINKS.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="rounded-full px-3.5 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-white/90"
              >
                Login
              </a>
            </nav>
          </header>

          {/* ---------- headline ---------- */}
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <h1 className="font-body text-4xl font-medium leading-[1.04] tracking-tight text-white drop-shadow-sm sm:text-6xl lg:text-7xl">
              Meet VertexAI.
              <br />
              <span className="font-display italic">Redefine space</span> with
              <br />
              intelligent design
            </h1>

            <a
              href="#"
              className="mt-8 inline-flex items-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-neutral-900 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-white/95 sm:text-base"
            >
              Start free decoration
            </a>
          </div>

          {/* ---------- bottom row ---------- */}
          <footer className="flex flex-col gap-5 px-5 pb-6 sm:flex-row sm:items-end sm:justify-between sm:px-9 sm:pb-9">
            <p className="max-w-md text-sm leading-relaxed text-white/85 drop-shadow-sm sm:text-[15px]">
              It helps you imagine, plan, and refine spaces through natural
              conversations. From choosing colors and layouts to suggesting
              furniture and décor, it adapts to your taste.
            </p>

            <div className="flex items-end gap-2.5">
              <button
                aria-label="Explore"
                className="flex h-12 w-12 items-center justify-center rounded-full text-white ring-1 ring-white/30 backdrop-blur-md transition hover:bg-white/10"
              >
                <ArrowUpRight className="h-5 w-5" />
              </button>
              <div className="flex flex-col gap-2.5">
                <Pill>Solutions for complex spaces</Pill>
                <Pill>Conversational &amp; Action</Pill>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <button className="rounded-full px-5 py-3 text-sm font-medium text-white ring-1 ring-white/30 backdrop-blur-md transition hover:bg-white/10">
      {children}
    </button>
  );
}

/** 2×2 rounded-square brand mark. */
function Logo() {
  return (
    <span className="grid grid-cols-2 gap-0.5">
      {Array.from({ length: 4 }).map((_, i) => (
        <span key={i} className="h-2 w-2 rounded-[3px] bg-white" />
      ))}
    </span>
  );
}
