// Central manifest of all generated imagery (Higgsfield CDN).
// The live site loads these client-side from the visitor's browser.

const CDN =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3A4FMCrm8jYjCnPYN9rbcZn81hc";

/**
 * The four poses of the SAME tennis player, background removed (transparent
 * PNG). Pose 0 is the hero leap; the others are revealed as you scroll, the
 * figure "turning" into a new throw/catch pose at each section.
 */
export const POSES = [
  `${CDN}/hf_20260624_094139_6535e503-56a9-49f2-98f4-d2dae00f4814.png`, // 0 — leaping forehand reach (hero)
  `${CDN}/hf_20260624_101947_abd02a91-b866-409c-9747-cfc6974804b1.png`, // 1 — serve toss (ball up)
  `${CDN}/hf_20260624_101950_298ee457-1592-4d6b-9117-25f95b1505d1.png`, // 2 — lunging catch (reach out)
  `${CDN}/hf_20260624_101955_f8ceed18-538a-4718-904a-66dc086c2b8b.png`, // 3 — confident ready stance
];

export const IMG = {
  // Hero
  heroSky: `${CDN}/hf_20260624_105539_82d30857-d5cf-48c8-919d-13026037c1ac.png`,
  heroWide: `${CDN}/hf_20260624_105712_eb5f17ac-2c94-45c0-b5a6-701e39e5e88b.png`, // wide leap, bg removed

  // About / Building Champions
  aboutMan: `${CDN}/hf_20260624_094159_37102222-216d-40cb-b1a3-49e4cb652a64.png`,
  aboutGirlCourt: `${CDN}/hf_20260624_102030_4836e722-89c6-4f9b-a4da-5a73f5b06133.png`,

  // Training program cards
  trainBalls: `${CDN}/hf_20260624_094204_9c866a4b-ace3-4dca-accd-f55bb6f7ebc8.png`,
  trainBeginner: `${CDN}/hf_20260624_094205_298f4815-ef28-4dda-8792-0494ac6ff321.png`,
  trainAdvanced: `${CDN}/hf_20260624_094208_0c64f997-530a-4313-b31c-472147acc3ab.png`,

  // Activity tracker section (image 2)
  cyclist: `${CDN}/hf_20260624_094209_ae1ebeb3-f446-4c3f-b472-2f9882672269.png`,
};
