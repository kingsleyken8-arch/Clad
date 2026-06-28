// Prize tiers, mirroring the original campaign's "play to win" hook.
// Tiers are unlocked purely by final score so every run has a stake.

export interface PrizeTier {
  id: string;
  /** minimum score to unlock this tier */
  min: number;
  label: string;
  prize: string;
  blurb: string;
  /** emoji/badge used in the reveal */
  icon: string;
  /** accent colour for the reveal card */
  color: string;
}

export const PRIZE_TIERS: PrizeTier[] = [
  {
    id: "qualifier",
    min: 0,
    label: "Qualifier",
    prize: "Digital Finisher Badge",
    blurb: "Every champion starts at the baseline. Keep rallying.",
    icon: "🎾",
    color: "#8a93a0",
  },
  {
    id: "bronze",
    min: 1500,
    label: "Bronze Bracket",
    prize: "Performance Wristband",
    blurb: "Clean contact. You're moving up the draw.",
    icon: "🥉",
    color: "#c87f3f",
  },
  {
    id: "silver",
    min: 4000,
    label: "Silver Bracket",
    prize: "Tour Cap",
    blurb: "Serious hitting — the crowd is on its feet.",
    icon: "🥈",
    color: "#9fb0c0",
  },
  {
    id: "gold",
    min: 7500,
    label: "Gold Bracket",
    prize: "Signature Polo Shirt",
    blurb: "Finalist form. The trophy is in sight.",
    icon: "🥇",
    color: "#e8b53c",
  },
  {
    id: "grandslam",
    min: 12000,
    label: "Grand Slam",
    prize: "Centre Court Tickets",
    blurb: "Champion. Game, set, match — you've won it all.",
    icon: "🏆",
    color: "#d8f24a",
  },
];

export function prizeForScore(score: number): PrizeTier {
  let tier = PRIZE_TIERS[0];
  for (const t of PRIZE_TIERS) if (score >= t.min) tier = t;
  return tier;
}

/** The next tier above the current score, plus points needed (for the "so close" nudge). */
export function nextTier(
  score: number
): { tier: PrizeTier; needed: number } | null {
  for (const t of PRIZE_TIERS) {
    if (score < t.min) return { tier: t, needed: t.min - score };
  }
  return null;
}
