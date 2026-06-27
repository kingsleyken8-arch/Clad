import { useState } from "react";
import { Aperture, Menu, X } from "lucide-react";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Why choose", href: "#why" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

export default function CryptoxNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-light to-brand-dark">
            <Aperture className="h-4 w-4 text-white" strokeWidth={2.5} />
          </span>
          <span className="font-poppins text-lg font-semibold tracking-tight text-white">
            Cryptox
          </span>
        </a>

        {/* Center nav */}
        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-md md:flex">
          {LINKS.map((l, i) => (
            <a
              key={l.label}
              href={l.href}
              className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                i === 0
                  ? "bg-brand text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="hidden rounded-full border border-white/15 bg-white/[0.03] px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-white/10 sm:inline-block"
          >
            Buy Template
          </a>
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="text-white md:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-4 mb-2 rounded-2xl border border-white/10 bg-black/80 p-4 backdrop-blur-xl md:hidden">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm text-white/80 hover:bg-white/5"
            >
              {l.label}
            </a>
          ))}
          <a href="#" className="mt-2 block rounded-full bg-brand px-5 py-2.5 text-center text-sm font-medium text-white">
            Buy Template
          </a>
        </div>
      )}
    </header>
  );
}
