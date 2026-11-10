/*
 * All site content lives here: brand, copy, projects and every editable
 * media/text slot. The Studio editor reads the slot lists below.
 */

export type MediaKind = "image" | "video";
export type MediaFit = "cover" | "contain";

export type MediaSlot = {
  type: MediaKind;
  /** http(s) URL, a path under the site root, or "idb:<key>" for an uploaded file. */
  src: string;
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

/** Resolve a path under /public against the deployed base (works on GitHub Pages subpaths). */
export const asset = (p: string) => `${import.meta.env.BASE_URL}${p.replace(/^\//, "")}`;

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export type Project = {
  slug: string;
  /** Slot-id prefix: media slots are `${key}a` and `${key}b`. */
  key: string;
  title: string;
  type: string;
  tags: string;
  year: string;
  /** Short line shown beside the media on the home page. */
  blurb: string;
  headline: string;
  intro: string;
  body: string[];
  roles: string[];
  /** Home-page placement on the 12-column grid. */
  layout: {
    a: { w: number; p: number };
    b: { w: number; p: number };
    text: { p: number; inline: boolean };
  };
};

export const PROJECTS: Project[] = [
  {
    slug: "oree",
    key: "p1",
    title: "Orée Parfums",
    type: "Web Experience",
    tags: "Design, Experience, 3D",
    year: "2026",
    blurb: "A slow, sensory launch site for Orée, where each fragrance opens like a room you walk into.",
    headline: "Launching a fragrance house with a site you can almost smell",
    intro: "An immersive product story that trades the usual grid of bottles for five quiet, scented rooms.",
    body: [
      "Orée came to us with three fragrances and no digital presence. Rather than a catalogue, we built a sequence of spaces: each scent has its own light, material and pace, and the bottle is only revealed once you have spent time inside it.",
      "The experience is deliberately unhurried on desktop and distilled to a single gesture on mobile, with the shop never more than one tap away.",
      "Launch week sold through the first production run, and the site continues to convert at more than twice the house's wholesale average.",
    ],
    roles: ["Strategy & Concept", "Art Direction", "UX/UI", "3D & Motion", "Development"],
    layout: { a: { w: 6, p: 2 }, b: { w: 4, p: 8 }, text: { p: 9, inline: true } },
  },
  {
    slug: "halden",
    key: "p2",
    title: "Halden Watch Co.",
    type: "E-Shop",
    tags: "Design, E-shop, Experience",
    year: "2026",
    blurb: "An e-shop for Halden that lets the movement do the talking — every calibre explorable down to the last screw.",
    headline: "An independent watchmaker's shop, built like one of its movements",
    intro: "Precise, legible and quietly mechanical: commerce designed with the same restraint as the watches.",
    body: [
      "Halden makes a few hundred watches a year. Their buyers read specifications the way other people read novels, so we made the product page the hero: a calibre you can turn, open and inspect, with the purchase path always in view.",
      "A bespoke configurator handles straps, engraving and allocation, and feeds orders straight into the workshop's production schedule.",
    ],
    roles: ["UX/UI", "Art Direction", "E-commerce", "Development", "Technical Architecture"],
    layout: { a: { w: 6, p: 6 }, b: { w: 4, p: 2 }, text: { p: 9, inline: false } },
  },
  {
    slug: "vesper",
    key: "p3",
    title: "Maison Vesper",
    type: "Web Experience",
    tags: "Design, Branding, Experience",
    year: "2025",
    blurb: "Identity and booking experience for Maison Vesper, a twelve-room hotel that wanted to feel like a secret.",
    headline: "A twelve-room hotel that wanted to stay a secret",
    intro: "Brand identity, art direction and a booking journey that feels like being let in on something.",
    body: [
      "Vesper is small by design. The brief was to fill twelve rooms without ever shouting, so the site reveals the house the way a guest would discover it: one doorway, one shaft of light, one room at a time.",
      "We designed the identity, shot the launch imagery direction and rebuilt booking as a three-step conversation instead of a form.",
    ],
    roles: ["Strategy & Branding", "Art Direction", "UX/UI", "Motion Design", "Development"],
    layout: { a: { w: 6, p: 3 }, b: { w: 5, p: 7 }, text: { p: 3, inline: false } },
  },
  {
    slug: "lumen",
    key: "p4",
    title: "Lumen Gallery",
    type: "Corporate",
    tags: "Design, Tech, Experience",
    year: "2025",
    blurb: "A living archive for Lumen Gallery — fifteen years of exhibitions, walkable from anywhere.",
    headline: "Fifteen years of exhibitions, walkable from anywhere",
    intro: "A digital home for a contemporary gallery, built around an archive that behaves like a space.",
    body: [
      "Lumen's programme deserved more than a list of past shows. We modelled the gallery's rooms and rehung fifteen years of exhibitions inside them, so the archive can be walked rather than scrolled.",
      "Behind the scenes a simple editorial tool lets the team publish a new show, its works and its texts in an afternoon.",
    ],
    roles: ["Concept", "UX/UI", "3D", "Creative Development", "CMS"],
    layout: { a: { w: 6, p: 5 }, b: { w: 4, p: 3 }, text: { p: 9, inline: false } },
  },
  {
    slug: "nord",
    key: "p5",
    title: "Atelier Nord",
    type: "E-Shop",
    tags: "Design, E-shop, Tech",
    year: "2025",
    blurb: "Furniture made slowly, sold simply: a made-to-order shop for Atelier Nord with honest lead times.",
    headline: "Furniture made slowly, sold simply",
    intro: "A made-to-order shop that is as honest about lead times as the workshop is about its joinery.",
    body: [
      "Nord builds each piece to order, which most shop platforms treat as an edge case. We made it the centre: timber, finish and upholstery are chosen in context, and every order shows exactly where it sits in the workshop queue.",
      "The result is fewer support emails, fewer abandoned baskets and customers who arrive already knowing how their chair was made.",
    ],
    roles: ["UX/UI", "Art Direction", "E-commerce", "Development"],
    layout: { a: { w: 6, p: 2 }, b: { w: 5, p: 6 }, text: { p: 2, inline: false } },
  },
  {
    slug: "sable",
    key: "p6",
    title: "Sable Studio",
    type: "Web Experience",
    tags: "Design, Experience, Film",
    year: "2024",
    blurb: "A seasonal film and lookbook for Sable Studio, cut together into one continuous scroll.",
    headline: "One collection, one landscape, one continuous scroll",
    intro: "A campaign film and lookbook edited into a single uninterrupted piece.",
    body: [
      "Sable shot their collection across three days in the dunes. Instead of separating film, lookbook and shop, we edited them into one continuous scroll where each look can be paused, examined and bought without leaving the landscape.",
    ],
    roles: ["Art Direction", "Film Edit", "UX/UI", "Motion Design", "Development"],
    layout: { a: { w: 6, p: 5 }, b: { w: 4, p: 8 }, text: { p: 2, inline: false } },
  },
];

/* ------------------------------------------------------------------ */
/* Studio pages (the dark "menu" section)                              */
/* ------------------------------------------------------------------ */

export type StudioPage = {
  slug: string;
  numeral: string;
  title: string;
  /** Sentence the menu title unfolds into on hover (must start with the title). */
  line: string;
  heading: string;
  paragraphs: string[];
  list?: string[];
};

export const STUDIO_PAGES: StudioPage[] = [
  {
    slug: "about",
    numeral: "I",
    title: "The Studio",
    line: "The Studio behind the work",
    heading: "The studio",
    paragraphs: [
      "We are a small, senior team of designers, developers and storytellers who believe the web can still be a place of craft.",
      "Every project is led by the people who actually make it. No layers, no hand-offs — just a direct line between your ambition and the hands that build it.",
      "We work with a limited number of clients each year so that each one gets our full attention, from the first conversation to long after launch.",
    ],
  },
  {
    slug: "approach",
    numeral: "II",
    title: "Our approach",
    line: "Our approach to considered craft",
    heading: "Our approach",
    paragraphs: [
      "We start by listening. Before a single frame is designed we want to understand what makes your brand unmistakably yours.",
      "A strong idea needs flawless execution, and execution means little without an idea worth executing. We hold both to the same standard.",
      "Design and development sit at the same table from day one, which is why what we present is what we ship.",
    ],
  },
  {
    slug: "services",
    numeral: "III",
    title: "Services",
    line: "Services shaped around your ambition",
    heading: "Services",
    paragraphs: [
      "From first concept to final deployment, we cover everything a brand needs to exist beautifully online.",
    ],
    list: [
      "Strategy & Positioning",
      "Brand Identity",
      "Art Direction",
      "UX & Interface Design",
      "Motion Design",
      "3D & WebGL",
      "Creative Development",
      "E-Commerce",
      "Content & Copywriting",
      "Automation & Integrations",
      "Hosting & Care",
      "Campaigns & Launches",
    ],
  },
  {
    slug: "process",
    numeral: "IV",
    title: "Process",
    line: "Process without the theatre",
    heading: "Process",
    paragraphs: [
      "Discover. A short, focused phase to agree what success looks like and what we will not do.",
      "Design. One direction, developed properly, shared early and often in the browser rather than in slides.",
      "Build. Hand-written, tested on real devices and tuned until it feels effortless.",
      "Care. We stay on after launch to measure, refine and grow what we made together.",
    ],
  },
  {
    slug: "clients",
    numeral: "V",
    title: "Clients",
    line: "Clients who expect more",
    heading: "Our clients",
    paragraphs: [
      "The people we work with arrive with clear goals and high standards. They trust us with the details because they care about them as much as we do.",
    ],
    list: [
      "Founders & start-ups",
      "Fashion & luxury houses",
      "Hospitality & travel",
      "Culture & the arts",
      "Architecture & interiors",
      "Technology & finance",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Editable slots                                                      */
/* ------------------------------------------------------------------ */

const media = (src: string, alt: string, type: MediaKind = "image", poster?: string): MediaSlot => ({
  type,
  src: src ? asset(src) : "",
  ...(poster ? { poster: asset(poster) } : {}),
  fit: "cover",
  pos: { x: 50, y: 50 },
  alt,
});

export const MEDIA_SLOTS: SlotMeta[] = [
  { id: "reel", label: "Showreel", section: "Home" },
  ...PROJECTS.flatMap((p) => [
    { id: `${p.key}a`, label: `${p.title} — main`, section: "Projects" },
    { id: `${p.key}b`, label: `${p.title} — second`, section: "Projects" },
  ]),
  { id: "footer", label: "Footer flowers", section: "Footer" },
];

export const TEXT_SLOTS: SlotMeta[] = [
  { id: "brand", label: "Studio name", section: "Global" },
  { id: "baseline", label: "Baseline (preloader & hero)", section: "Global" },
  { id: "statement", label: "Opening statement", section: "Home" },
  { id: "approachLabel", label: "Approach label", section: "Home" },
  { id: "approach", label: "Approach text", section: "Home" },
  ...PROJECTS.flatMap((p) => [
    { id: `${p.key}.title`, label: `${p.title} — name`, section: "Projects" },
    { id: `${p.key}.blurb`, label: `${p.title} — home text`, section: "Projects" },
  ]),
  { id: "contactHeading", label: "Contact heading", section: "Contact" },
  { id: "email", label: "Email address", section: "Contact" },
  { id: "address", label: "Address (one line per row)", section: "Contact" },
];

export const DEFAULT_CONTENT: Content = {
  media: {
    reel: media("clad/media/reel.mp4", "Studio showreel", "video", "clad/media/reel.jpg"),
    ...Object.fromEntries(
      PROJECTS.flatMap((p) => [
        [`${p.key}a`, media(`clad/media/${p.key}a.jpg`, `${p.title}`)],
        [`${p.key}b`, media(`clad/media/${p.key}b.jpg`, `${p.title}`)],
      ]),
    ),
    footer: media("clad/media/footer.jpg", ""),
  },
  text: {
    brand: "Clad",
    baseline: "Digital experiences crafted with intent",
    statement:
      "We design and build digital experiences that feel made by hand, for brands that care about the details.",
    approachLabel: "Our approach",
    approach:
      "An independent studio for strategy, design and technology — helping ambitious brands become unmistakable online.",
    ...Object.fromEntries(
      PROJECTS.flatMap((p) => [
        [`${p.key}.title`, p.title],
        [`${p.key}.blurb`, p.blurb],
      ]),
    ),
    contactHeading: "Every good project begins with a conversation.",
    email: "hello@example.com",
    address: "Clad Studio\nBy appointment\nWorking worldwide",
  },
};

/** Links shown bottom-right in the footer. Add your own: { label: "Instagram", href: "https://…" }. */
export const SOCIALS: { label: string; href: string }[] = [];

/** Where the contact form posts. Set VITE_N8N_WEBHOOK_URL at build time, or paste the URL here. */
export const WEBHOOK_URL: string = import.meta.env.VITE_N8N_WEBHOOK_URL ?? "";
