export interface PartSpec {
  value: string;
  label: string;
}

export interface BikePart {
  id: string;
  index: string;
  label: string;
  name: string;
  description: string;
  specs: PartSpec[];
  /** Focal point as [x%, y%] of the image to zoom toward. */
  origin: [number, number];
  /** Zoom scale applied to the image at this step. */
  scale: number;
}

/**
 * The full bike image the showcase zooms into. Generated on Higgsfield —
 * a right-facing side profile (front wheel on the right), sharp across the
 * whole frame. The `origin` focal points below assume that composition.
 */
export const BIKE_IMAGE =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3A4FMCrm8jYjCnPYN9rbcZn81hc/hf_20260614_123038_4d3550c1-425e-4418-b622-51473e07b120.png";

export const BIKE_PARTS: BikePart[] = [
  {
    id: "overview",
    index: "",
    label: "The Machine",
    name: "One Machine",
    description:
      "Engineered end to end — every contact point, every system, built to conquer the trail. Keep scrolling to travel its anatomy.",
    specs: [],
    origin: [50, 52],
    scale: 1,
  },
  {
    id: "cockpit",
    index: "01",
    label: "Cockpit",
    name: "The Handlebar",
    description:
      "A 780mm bar and lock-on grips put precise, confident steering at your fingertips — the dropper remote always a thumb away.",
    specs: [
      { value: "780mm", label: "Bar Width" },
      { value: "35mm", label: "Stem" },
      { value: "Lock-On", label: "Grips" },
    ],
    origin: [71, 39],
    scale: 2.6,
  },
  {
    id: "wheels",
    index: "02",
    label: "Rolling Stock",
    name: "Wheels & Tires",
    description:
      "29-inch hoops wrapped in aggressive knobby rubber claw into loose dirt, roots and rock for relentless, unshakeable grip.",
    specs: [
      { value: "29″", label: "Wheels" },
      { value: "2.4″", label: "Tire" },
      { value: "Tubeless", label: "Setup" },
    ],
    origin: [81, 71],
    scale: 2.6,
  },
  {
    id: "saddle",
    index: "03",
    label: "Contact",
    name: "The Saddle",
    description:
      "A performance saddle on a 170mm dropper post — slam it for descents, lift it for climbs, and never once break your stride.",
    specs: [
      { value: "170mm", label: "Dropper" },
      { value: "Carbon", label: "Rails" },
    ],
    origin: [31, 35],
    scale: 2.7,
  },
  {
    id: "drivetrain",
    index: "04",
    label: "Power",
    name: "The Drivetrain",
    description:
      "A 12-speed chain and clutched derailleur convert every pedal stroke into forward fury, holding tension over the roughest ground.",
    specs: [
      { value: "12-Spd", label: "Range" },
      { value: "10-52T", label: "Cassette" },
      { value: "Carbon", label: "Cranks" },
    ],
    origin: [49, 70],
    scale: 2.9,
  },
  {
    id: "brakes",
    index: "05",
    label: "Control",
    name: "The Brakes",
    description:
      "Four-piston hydraulic calipers bite 203mm rotors for instant, modulated stopping power — absolute authority on tap.",
    specs: [
      { value: "4-Piston", label: "Calipers" },
      { value: "203mm", label: "Rotors" },
    ],
    origin: [80, 64],
    scale: 2.9,
  },
];
