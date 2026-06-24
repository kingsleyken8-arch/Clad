import {
  Activity as ActivityIcon,
  ArrowUpRight,
  Bike,
  ChevronLeft,
  CircleDot,
  Leaf,
  Share2,
} from "lucide-react";
import { Reveal } from "./Reveal";
import { IMG } from "../data/assets";

const DAYS = ["S", "S", "M", "T", "W", "T", "F"];
const HASHTAGS = ["#Badminton", "#Smash", "#Badmintoncourt", "#Badmintonpartners"];
const SLEEP = [
  { label: "Awake", value: "41m", h: "30%", tone: "bg-lime/30" },
  { label: "REM", value: "1h 42m", h: "55%", tone: "bg-lime/55" },
  { label: "Core", value: "3h 53m", h: "78%", tone: "bg-lime/75" },
  { label: "Deep", value: "40m", h: "100%", tone: "bg-lime" },
];

export default function Activity() {
  return (
    <section
      id="app"
      data-pose-stage="activity"
      className="relative bg-[#ECECEA] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:pr-[27vw]">
        {/* Section header */}
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="grid h-8 w-8 place-items-center rounded-full border border-ink/30 font-inter text-xs font-semibold">
              C
            </span>
            <span className="font-inter text-sm text-ink/60">Member App</span>
            <span className="h-px flex-1 bg-ink/10" />
          </div>
        </Reveal>
        <Reveal>
          <h2 className="mt-8 max-w-2xl font-anton text-[clamp(2rem,4.4vw,3.4rem)] uppercase leading-[0.95] tracking-tight text-ink">
            Your training, tracked
          </h2>
        </Reveal>

        {/* Card grid */}
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {/* ---------------- Column 1 ---------------- */}
          <div className="flex flex-col gap-5">
            <Reveal>
              <SportRow />
            </Reveal>
            <Reveal delay={80}>
              <SportRow />
            </Reveal>
            <Reveal delay={160}>
              <ReferCard />
            </Reveal>
          </div>

          {/* ---------------- Column 2 ---------------- */}
          <div className="flex flex-col gap-5">
            <Reveal>
              <TrackCard />
            </Reveal>
            <Reveal delay={120}>
              <SleepCard />
            </Reveal>
          </div>

          {/* ---------------- Column 3 ---------------- */}
          <div className="flex flex-col gap-5">
            <Reveal>
              <RideImageCard />
            </Reveal>
            <Reveal delay={120}>
              <RideStatsCard />
            </Reveal>
            <Reveal delay={200}>
              <SprintCard />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Cards ----------------------------- */

function SportRow() {
  return (
    <div className="flex items-center justify-between rounded-[1.6rem] bg-white p-4 shadow-card">
      <div className="flex items-center gap-3">
        <span className="font-archivo text-lg font-bold text-ink">Sport Training</span>
        <span className="rounded-full bg-lime px-3 py-1 font-inter text-xs font-semibold text-ink">
          Self Defense
        </span>
      </div>
      <span className="grid h-9 w-9 place-items-center rounded-full bg-[#F0F0EE] text-ink/60">
        <ActivityIcon className="h-4 w-4" />
      </span>
    </div>
  );
}

function ReferCard() {
  return (
    <div className="rounded-[1.6rem] bg-ink p-6 text-white shadow-float">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10">
          <ActivityIcon className="h-4 w-4" />
        </span>
        <div>
          <p className="font-archivo font-bold">Refer your friends</p>
          <p className="font-inter text-xs text-white/50">
            Share your link with your friends
          </p>
        </div>
      </div>

      <p className="mt-6 font-archivo text-2xl font-extrabold leading-tight">
        <span className="text-white/40">Let&apos;s Know</span> the club&apos;s Core
        values, mission, and history
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {HASHTAGS.map((t) => (
          <span
            key={t}
            className="rounded-full bg-white/10 px-3 py-1.5 font-inter text-xs text-white/80"
          >
            {t}
          </span>
        ))}
        <span className="rounded-full bg-white/10 px-3 py-1.5 font-inter text-xs text-white/60">
          7+
        </span>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex -space-x-2">
          {["#C2DB1E", "#5FA8E8", "#A9C00B"].map((c) => (
            <span
              key={c}
              className="h-8 w-8 rounded-full ring-2 ring-ink"
              style={{ background: c }}
            />
          ))}
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full bg-white px-4 py-2 font-inter text-sm font-semibold text-ink"
        >
          <Share2 className="h-4 w-4" /> Share link
        </button>
      </div>
    </div>
  );
}

function TrackCard() {
  return (
    <div className="rounded-[1.6rem] bg-white p-6 shadow-card">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#F0F0EE] text-ink">
          <Leaf className="h-4 w-4" />
        </span>
        <span className="font-archivo text-lg font-bold text-ink">
          Track your activity
        </span>
      </div>

      <div className="mt-6 flex items-end gap-3">
        <span className="font-archivo text-7xl font-black leading-none text-lime-600">
          07
        </span>
        <span className="mb-2 font-inter text-sm text-ink/40">
          days
          <br />
          update
        </span>
      </div>

      {/* daily goal pill */}
      <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#F4F4F2] p-3">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#9B6BE3] text-white">
            <CircleDot className="h-4 w-4" />
          </span>
          <div>
            <p className="font-inter text-sm font-semibold text-ink">Your daily goal</p>
            <p className="font-inter text-xs text-ink/40">Last 3 days</p>
          </div>
        </div>
        <ArrowUpRight className="h-4 w-4 text-ink/50" />
      </div>

      {/* progress */}
      <div className="mt-4 rounded-2xl border border-ink/10 p-4">
        <div className="flex items-center justify-between">
          <span className="font-inter text-sm font-semibold text-ink">Achieved</span>
          <span className="font-inter text-sm text-ink/40">6/7</span>
        </div>
        <div className="relative mt-3 h-1.5 rounded-full bg-lime/25">
          <div className="absolute inset-y-0 left-0 w-[78%] rounded-full bg-lime" />
          <div className="absolute -top-1 left-[78%] h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-lime ring-2 ring-white" />
        </div>
        <div className="mt-4 flex justify-between">
          {DAYS.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span
                className={`grid h-7 w-7 place-items-center rounded-full text-[11px] font-semibold ${
                  i < 6 ? "bg-lime text-ink" : "border border-ink/15 text-ink/40"
                }`}
              >
                {d}
              </span>
              <span className="font-inter text-[10px] text-ink/30">{d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SleepCard() {
  return (
    <div className="rounded-[1.6rem] bg-white p-6 shadow-card">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-ink/20" />
        ))}
      </div>
      <div className="mt-4 flex gap-5 font-inter text-sm">
        <span className="font-semibold text-ink">Stages</span>
        <span className="text-ink/35">Pulse OX</span>
        <span className="text-ink/35">Respiration</span>
      </div>

      <div className="mt-4 flex items-start justify-between">
        <h3 className="font-archivo text-5xl font-black leading-[0.9] text-ink">
          Sleep
          <br />
          quality <span className="text-ink/30">8,1</span>
        </h3>
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-lime text-ink">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-5 rounded-2xl bg-[#F4F4F2] p-4">
        <p className="font-inter text-[11px] uppercase tracking-widest text-ink/40">
          Sleeptime
        </p>
        <div className="mt-1 flex items-center justify-between">
          <span className="font-archivo text-2xl font-extrabold text-ink">7h 18mins</span>
          <div className="flex gap-2">
            <span className="rounded-full bg-[#E9A6D6] px-2.5 py-1 font-inter text-[10px] font-medium text-ink">
              00:15 - 02:56
            </span>
            <span className="rounded-full bg-[#F2A0A0] px-2.5 py-1 font-inter text-[10px] font-medium text-ink">
              57 BPM AVG
            </span>
          </div>
        </div>
        <div className="mt-4 flex items-end gap-2">
          {SLEEP.map((s) => (
            <div key={s.label} className="flex-1">
              <div className="flex h-20 items-end">
                <div className={`w-full rounded-lg ${s.tone}`} style={{ height: s.h }} />
              </div>
              <p className="mt-2 font-inter text-[10px] font-semibold text-ink/60">
                {s.label}
              </p>
              <p className="font-inter text-[10px] text-ink/35">{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RideImageCard() {
  return (
    <div className="relative overflow-hidden rounded-[1.6rem] shadow-card">
      <img src={IMG.cyclist} alt="Cyclist at sunrise" className="h-64 w-full object-cover" />
      <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl bg-white/95 p-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-lime text-ink">
            <Bike className="h-4 w-4" />
          </span>
          <span className="font-inter text-sm font-semibold text-ink">
            Your daily goal
          </span>
        </div>
        <span className="font-inter text-xs font-semibold text-ink/50">70 MILES</span>
      </div>
    </div>
  );
}

function RideStatsCard() {
  return (
    <div className="rounded-[1.6rem] bg-white p-6 shadow-card">
      <div className="flex items-center justify-between">
        <button className="flex items-center gap-1 font-archivo font-bold text-ink">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <span className="font-inter text-xs text-ink/40">06:32 AM</span>
      </div>

      <div className="mt-5 flex items-end gap-2">
        <span className="font-archivo text-6xl font-black leading-none text-lime-600">
          3,18
        </span>
        <span className="mb-2 font-inter text-sm text-ink/40">km</span>
      </div>
      <p className="mt-1 font-inter text-xs text-ink/40">Total Distance 8.65km</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Metric label="Avg. Speed" value="176.90" />
        <Metric label="Calories" value="2,500/m" />
      </div>

      <div className="mt-5">
        <div className="flex justify-between font-inter text-[11px] uppercase tracking-widest text-ink/40">
          <span>Start</span>
          <span>Finish</span>
        </div>
        <div className="mt-1 flex justify-between font-archivo text-sm font-bold text-ink">
          <span>Washington Square</span>
          <span>1 Cabanel Pl</span>
        </div>
        <div className="relative mt-3 h-1.5 rounded-full bg-lime/25">
          <div className="absolute inset-y-0 left-0 w-[64%] rounded-full bg-lime" />
          <div className="absolute -top-1 left-[64%] h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-lime ring-2 ring-white" />
        </div>
        <div className="mt-2 flex justify-between font-inter text-[11px] text-ink/40">
          <span>1 h 52 mins has passed</span>
          <span>30 m left</span>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 p-3">
      <div className="flex items-center gap-1.5 font-inter text-[11px] text-ink/40">
        <span className="h-3 w-0.5 rounded bg-lime" />
        {label}
      </div>
      <p className="mt-1 font-archivo text-lg font-extrabold text-ink">{value}</p>
    </div>
  );
}

function SprintCard() {
  return (
    <div className="flex items-center justify-between rounded-[1.6rem] bg-ink p-5 text-white shadow-float">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10">
          <ActivityIcon className="h-4 w-4" />
        </span>
        <div>
          <p className="font-archivo font-bold">Sprinting</p>
          <p className="font-inter text-xs text-white/40">08:56 - Now</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {/* waveform */}
        <div className="flex h-8 items-center gap-0.5">
          {[6, 12, 20, 10, 24, 14, 28, 16, 8, 18, 26, 12, 6].map((h, i) => (
            <span
              key={i}
              className="w-0.5 rounded-full bg-lime"
              style={{ height: `${h}px` }}
            />
          ))}
        </div>
        <span className="font-archivo text-2xl font-black">
          355<span className="ml-1 align-top font-inter text-xs font-medium text-white/50">Cal</span>
        </span>
      </div>
    </div>
  );
}
