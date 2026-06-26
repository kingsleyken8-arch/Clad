import { useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Tag } from "./clinicShared";
import { MEDIA } from "../data/programs";

const STEPS = [
  {
    n: "01",
    title: "Tell Milo your goal",
    desc: "Describe what you need in plain language. Milo asks smart follow-up questions and confirms the plan before it starts.",
  },
  {
    n: "02",
    title: "Milo makes a plan",
    desc: "It breaks your goal into clear steps and picks the right tools and data for each one.",
  },
  {
    n: "03",
    title: "It takes action",
    desc: "Milo researches, drafts and executes across your connected apps — autonomously, end to end.",
  },
  {
    n: "04",
    title: "You stay in control",
    desc: "Review, approve or tweak anything. Milo keeps you in the loop and learns from your feedback.",
  },
];

export default function ScheduleSection() {
  const [open, setOpen] = useState(0);

  return (
    <section id="how" className="relative z-10 bg-white px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="border-t border-black/10 pt-10">
          <Tag n="02" label="How it works" />
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          {/* Left */}
          <div>
            <h2 className="font-inter text-[clamp(28px,3.6vw,42px)] font-normal leading-[1.1] tracking-tight text-[#2c2c2c]">
              <span className="text-[#e8743b]">Get going:</span>
              <br />
              How Milo works
            </h2>
            <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-[#8a8a8a]">
              From a single sentence to finished work. Here's how Milo turns your
              intent into action — with you in control the whole way.
            </p>
            <div className="mt-6 overflow-hidden rounded-3xl">
              <video
                src={MEDIA.video}
                autoPlay
                muted
                loop
                playsInline
                className="h-64 w-full object-cover"
              />
            </div>
          </div>

          {/* Right accordion */}
          <div className="flex flex-col">
            {STEPS.map((s, idx) => {
              const isOpen = open === idx;
              return (
                <div key={s.n} className="border-b border-black/10">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : idx)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="text-[12px] text-[#b0b0b0]">{s.n}</span>
                      <span className="font-inter text-[19px] text-[#2c2c2c]">
                        {s.title}
                      </span>
                    </span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-[#9a9a9a] transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="flex items-start gap-4 pb-5 pl-8">
                        <div className="flex-1">
                          <p className="text-[13px] leading-relaxed text-[#8a8a8a]">
                            {s.desc}
                          </p>
                          <a
                            href="#plans"
                            className="mt-4 inline-block rounded-full border border-black/15 px-5 py-2 text-[12px] font-medium text-[#3a3a3a] transition-colors hover:bg-black/5"
                          >
                            Learn more
                          </a>
                        </div>
                        <img
                          src={MEDIA.milo}
                          alt={s.title}
                          loading="lazy"
                          className="h-20 w-24 shrink-0 rounded-xl object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="mt-6 flex justify-end">
              <a
                href="#plans"
                className="group inline-flex items-center gap-2 rounded-full bg-black py-2 pl-5 pr-2 text-[13px] font-medium text-white"
              >
                Get started
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-black transition-transform group-hover:translate-x-0.5">
                  <ArrowUpRight size={14} />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
