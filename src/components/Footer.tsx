import { ArrowUpRight, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const FOOTER_BIKE =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3A4FMCrm8jYjCnPYN9rbcZn81hc/hf_20260614_095328_7807ba29-b137-43f0-9651-4ec6986c9129.png";

const EXPLORE_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Frame", href: "#frame" },
  { label: "Suspension", href: "#suspension" },
  { label: "Drivetrain", href: "#drivetrain" },
  { label: "Brakes", href: "#brakes" },
  { label: "Cockpit", href: "#cockpit" },
];

const COMPANY_LINKS = [
  { label: "The Studio", href: "#" },
  { label: "Find a Dealer", href: "#" },
  { label: "Warranty", href: "#" },
  { label: "Support", href: "#" },
];

const SOCIALS = [
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "YouTube", icon: Youtube, href: "#" },
  { label: "Twitter", icon: Twitter, href: "#" },
  { label: "Facebook", icon: Facebook, href: "#" },
];

export default function Footer() {
  return (
    <footer
      id="footer"
      className="relative w-full overflow-hidden bg-black"
    >
      {/* Bike in the background */}
      <img
        src={FOOTER_BIKE}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute left-1/2 top-1/2 w-[140%] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain opacity-50 sm:w-[110%] lg:w-full"
      />
      {/* Legibility overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/55 to-black" />
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-between px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        {/* Top — wordmark / call */}
        <div>
          <span className="font-inter text-xs uppercase tracking-[0.3em] text-red-500">
            Conquer The Trail
          </span>
          <h2 className="mt-4 font-podium text-[clamp(3rem,11vw,9.5rem)] uppercase leading-[0.88] tracking-tight text-white">
            Vanguard
          </h2>
          <a
            href="#"
            className="group mt-8 inline-flex items-center gap-2 bg-red-600 px-7 py-4 font-inter text-xs uppercase tracking-widest text-white transition-colors hover:bg-red-700 sm:px-9"
          >
            Build Your Vanguard
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Middle — link columns */}
        <div className="mt-20 grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-4">
          {/* Explore */}
          <div>
            <h4 className="font-inter text-[10px] uppercase tracking-[0.3em] text-white/40">
              Explore
            </h4>
            <ul className="mt-5 space-y-3">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-inter text-sm uppercase tracking-widest text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-inter text-[10px] uppercase tracking-[0.3em] text-white/40">
              Company
            </h4>
            <ul className="mt-5 space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-inter text-sm uppercase tracking-widest text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow */}
          <div>
            <h4 className="font-inter text-[10px] uppercase tracking-[0.3em] text-white/40">
              Follow
            </h4>
            <div className="mt-5 flex flex-wrap gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-11 w-11 items-center justify-center border border-white/20 text-white/70 transition-all hover:border-white/60 hover:bg-white/10 hover:text-white"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <h4 className="font-inter text-[10px] uppercase tracking-[0.3em] text-white/40">
              Ride Reports
            </h4>
            <p className="mt-5 max-w-xs font-inter text-sm leading-relaxed text-white/60">
              New builds, trail drops and team news — straight to your inbox.
            </p>
            <form
              className="mt-5 flex max-w-xs items-center border border-white/20 focus-within:border-white/60"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-transparent px-4 py-3 font-inter text-sm text-white placeholder:text-white/40 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex h-11 w-12 shrink-0 items-center justify-center text-white/70 transition-colors hover:text-white"
              >
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-20 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="font-podium text-xl font-bold uppercase tracking-wider text-white">
            VANGUARD
          </span>
          <span className="font-inter text-[10px] uppercase tracking-widest text-white/40">
            © {new Date().getFullYear()} Vanguard Cycles — Conquer The Trail
          </span>
        </div>
      </div>
    </footer>
  );
}
