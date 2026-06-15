import { useState } from "react";
import { Plus } from "lucide-react";
import { Reveal } from "./Reveal";

interface QA {
  q: string;
  a: string;
}

const FAQS: QA[] = [
  {
    q: "What is the VANGUARD frame made of?",
    a: "Every VANGUARD is built around a monocoque carbon-fiber front triangle with a carbon or carbon-alloy rear, tuned for stiffness under power and compliance over the rough stuff.",
  },
  {
    q: "How much suspension travel does it have?",
    a: "160mm up front and 150mm out back, driven by a four-bar linkage that stays active under braking and pedaling alike.",
  },
  {
    q: "What's covered under the warranty?",
    a: "Frames carry a lifetime warranty to the original owner. Suspension, drivetrain and finish components are covered for two years.",
  },
  {
    q: "How long does delivery take?",
    a: "Stock builds ship within 3–5 business days. Custom builds are hand-assembled and fitted, typically arriving in 2–3 weeks.",
  },
  {
    q: "Can I customize my build?",
    a: "Yes — choose your frame material, suspension tune, drivetrain, wheels and finish in the configurator, and we build it to spec.",
  },
  {
    q: "Which payment options are available?",
    a: "All major cards, Apple Pay, Google Pay and PayPal, plus interest-free financing over 6 or 12 months at checkout.",
  },
  {
    q: "Do you offer a test ride?",
    a: "Absolutely. Book a demo at any VANGUARD dealer, or schedule a doorstep test ride in select cities.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative w-full bg-black px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      {/* Heading */}
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="font-podium text-[clamp(2.6rem,7vw,5.5rem)] uppercase leading-[0.95] tracking-tight text-white">
            Frequently Asked Questions
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="mx-auto mt-6 max-w-xl font-inter text-sm leading-relaxed text-white/50">
            If you can't find an answer here, join the{" "}
            <a href="#" className="font-semibold text-white hover:text-red-500">
              community forum
            </a>
            , reach out on{" "}
            <a href="#" className="font-semibold text-white hover:text-red-500">
              Twitter
            </a>
            , or write to{" "}
            <a
              href="mailto:support@vanguard.cc"
              className="font-semibold text-white hover:text-red-500"
            >
              support@vanguard.cc
            </a>
            .
          </p>
        </Reveal>
      </div>

      {/* Accordion */}
      <div className="mx-auto mt-14 max-w-3xl space-y-4">
        {FAQS.map((faq, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={faq.q} delay={i * 60}>
              <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition-colors hover:border-white/20">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-inter text-base text-white sm:text-lg">
                    {faq.q}
                  </span>
                  <Plus
                    className={`h-5 w-5 shrink-0 text-white/70 transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 font-inter text-sm leading-relaxed text-white/60">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
