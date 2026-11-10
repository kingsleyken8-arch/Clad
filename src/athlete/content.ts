export type MediaKind = "image" | "video";
export type MediaFit = "cover" | "contain";

export type MediaSlot = {
  type: MediaKind;
  /** http(s) URL, a path in /public, or "idb:<key>" for an uploaded file. */
  src: string;
  /** Optional poster frame for videos. */
  poster?: string;
  fit: MediaFit;
  /** Focal point in percent, used as object-position. */
  pos: { x: number; y: number };
  alt: string;
};

export type Content = {
  media: Record<string, MediaSlot>;
  text: Record<string, string>;
};

export type SlotMeta = { id: string; label: string; section: string };

const img = (alt: string): MediaSlot => ({
  type: "image",
  src: "",
  fit: "cover",
  pos: { x: 50, y: 50 },
  alt,
});

export const MEDIA_SLOTS: SlotMeta[] = [
  { id: "hero", label: "Hero background", section: "Hero" },
  { id: "intro", label: "Intro portrait", section: "Intro" },
  { id: "record1", label: "Record card 1", section: "Records" },
  { id: "record2", label: "Record card 2", section: "Records" },
  { id: "record3", label: "Record card 3", section: "Records" },
  { id: "record4", label: "Record card 4", section: "Records" },
  { id: "hl1", label: "Highlight 1", section: "Highlights" },
  { id: "hl2", label: "Highlight 2", section: "Highlights" },
  { id: "hl3", label: "Highlight 3", section: "Highlights" },
  { id: "hl4", label: "Highlight 4", section: "Highlights" },
  { id: "hl5", label: "Highlight 5", section: "Highlights" },
  { id: "partner1", label: "Partner logo 1", section: "Partnerships" },
  { id: "partner2", label: "Partner logo 2", section: "Partnerships" },
  { id: "partner3", label: "Partner logo 3", section: "Partnerships" },
  { id: "partner4", label: "Partner logo 4", section: "Partnerships" },
  { id: "partner5", label: "Partner logo 5", section: "Partnerships" },
  { id: "partner6", label: "Partner logo 6", section: "Partnerships" },
  { id: "foundation", label: "Foundation image", section: "Foundation" },
  { id: "journal1", label: "Journal cover 1", section: "Journal" },
  { id: "journal2", label: "Journal cover 2", section: "Journal" },
  { id: "journal3", label: "Journal cover 3", section: "Journal" },
  { id: "footer", label: "Footer background", section: "Footer" },
];

export const TEXT_SLOTS: SlotMeta[] = [
  { id: "brand", label: "Brand / short name", section: "Global" },
  { id: "firstName", label: "First name", section: "Hero" },
  { id: "lastName", label: "Last name", section: "Hero" },
  { id: "number", label: "Jersey number", section: "Hero" },
  { id: "heroTag", label: "Hero tagline", section: "Hero" },
  { id: "manifesto", label: "Intro statement", section: "Intro" },
  { id: "introBody", label: "Intro body", section: "Intro" },
  { id: "foundationTitle", label: "Foundation title", section: "Foundation" },
  { id: "foundationBody", label: "Foundation body", section: "Foundation" },
  { id: "footerCta", label: "Footer headline", section: "Footer" },
];

export const DEFAULT_CONTENT: Content = {
  media: Object.fromEntries(
    MEDIA_SLOTS.map((s) => [
      s.id,
      s.id.startsWith("partner")
        ? { ...img(s.label), fit: "contain" as MediaFit }
        : img(s.label),
    ]),
  ),
  text: {
    brand: "JV18",
    firstName: "Jordan",
    lastName: "Vale",
    number: "18",
    heroTag: "Wide receiver · Record breaker · Built different",
    manifesto:
      "Every route run with intent. Every catch a statement. Every season a new standard — on the field, and far beyond it.",
    introBody:
      "From backyard catches to the biggest stage in the game, the journey has always been about the work nobody sees. This is the record of it.",
    foundationTitle: "The Foundation",
    foundationBody:
      "Creating opportunities for the next generation through youth camps, education grants and community programs in the places that raised us.",
    footerCta: "Let's build what's next",
  },
};

/** Records, stats and journal entries — structural copy, not slot-edited. */
export const STATS = [
  { value: 4, suffix: "×", label: "All-Star selections" },
  { value: 1871, suffix: "", label: "Single-season yards" },
  { value: 128, suffix: "", label: "Single-season receptions" },
  { value: 52, suffix: "", label: "Career touchdowns" },
];

export const RECORDS = [
  {
    year: "2022",
    title: "Most receiving yards in a season",
    body: "Led the league with the most productive receiving campaign in franchise history.",
  },
  {
    year: "2021",
    title: "Fastest to 4,000 career yards",
    body: "Reached the milestone quicker than any receiver in the modern era.",
  },
  {
    year: "2020",
    title: "Rookie receiving record",
    body: "Set the all-time mark for receiving yards by a first-year player.",
  },
  {
    year: "2023",
    title: "Highest yards per game, career",
    body: "Holds the highest career receiving yards per game average in league history.",
  },
];

export const JOURNAL = [
  { tag: "Training", date: "Nov 2026", title: "Inside the off-season: building speed that lasts" },
  { tag: "Community", date: "Oct 2026", title: "Youth camp tour hits five cities this summer" },
  { tag: "Gameday", date: "Sep 2026", title: "What goes through my head before kickoff" },
];
