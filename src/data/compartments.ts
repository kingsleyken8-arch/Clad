export interface Spec {
  value: string;
  label: string;
}

export interface Compartment {
  id: string;
  index: string;
  name: string;
  tagline: string;
  description: string;
  specs: Spec[];
  image: string;
}

const CDN =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3A4FMCrm8jYjCnPYN9rbcZn81hc";

export const COMPARTMENTS: Compartment[] = [
  {
    id: "frame",
    index: "01",
    name: "Frame",
    tagline: "The Carbon Spine",
    description:
      "A monocoque carbon-fiber chassis tuned for stiffness where you stamp the power and compliance where the trail fights back. Every gram is placed with intent — light enough to fly, brutal enough to land.",
    specs: [
      { value: "1,899g", label: "Frame Weight" },
      { value: "29″", label: "Wheel Platform" },
      { value: "63.5°", label: "Head Angle" },
    ],
    image: `${CDN}/hf_20260614_093838_10096b5e-6227-40a7-bc7e-e3773766d0e5.png`,
  },
  {
    id: "suspension",
    index: "02",
    name: "Suspension",
    tagline: "Devour The Terrain",
    description:
      "160mm of front and rear travel that erases roots, rocks and ruts. A four-bar linkage keeps the rear wheel glued to the dirt while the trail disappears beneath you.",
    specs: [
      { value: "160mm", label: "Travel" },
      { value: "4-Bar", label: "Linkage" },
      { value: "3-Way", label: "Compression" },
    ],
    image: `${CDN}/hf_20260614_093841_0033a166-70f3-4f40-9a0c-676887d2975a.png`,
  },
  {
    id: "drivetrain",
    index: "03",
    name: "Drivetrain",
    tagline: "Relentless Drive",
    description:
      "A wide-range 12-speed cassette and a clutched derailleur turn raw effort into forward fury. Shift under load, climb without mercy, descend without doubt.",
    specs: [
      { value: "12-Spd", label: "Range" },
      { value: "10-52T", label: "Cassette" },
      { value: "Carbon", label: "Cranks" },
    ],
    image: `${CDN}/hf_20260614_093842_b8c62628-1dc1-4111-9bca-39a3c9983ae9.png`,
  },
  {
    id: "brakes",
    index: "04",
    name: "Brakes",
    tagline: "Absolute Authority",
    description:
      "Four-piston hydraulic calipers bite down on 203mm rotors for stopping power you feel in your fingertips. Modulate on the edge, scrub at will, commit completely.",
    specs: [
      { value: "4-Piston", label: "Calipers" },
      { value: "203mm", label: "Rotors" },
      { value: "Hydraulic", label: "System" },
    ],
    image: `${CDN}/hf_20260614_093844_357eb9ac-a4e2-490b-bb35-a3bc9bcc3fb1.png`,
  },
  {
    id: "cockpit",
    index: "05",
    name: "Cockpit",
    tagline: "Command Center",
    description:
      "A 780mm bar, lock-on grips and an integrated dropper remote put control at your fingertips. Drop the saddle, weight the front, and let the bike do what it was born to do.",
    specs: [
      { value: "780mm", label: "Bar Width" },
      { value: "170mm", label: "Dropper" },
      { value: "35mm", label: "Stem" },
    ],
    image: `${CDN}/hf_20260614_093846_8da913af-73c7-47d2-92cd-59b0ff3687bd.png`,
  },
];
