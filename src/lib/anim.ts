import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Staggered scroll reveal: animates every [data-reveal] descendant of `ref`
 * up + in when the section scrolls into view.
 */
export function useReveal<T extends HTMLElement>(
  ref: RefObject<T | null>,
  opts?: { y?: number; stagger?: number; selector?: string }
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll(opts?.selector ?? "[data-reveal]");
    if (!items.length) return;

    const ctx = gsap.context(() => {
      gsap.from(items, {
        y: opts?.y ?? 32,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        stagger: opts?.stagger ?? 0.09,
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
    }, el);

    return () => ctx.revert();
  }, []);
}

/**
 * Count-up: animates every [data-count] number inside `ref` from 0 to its
 * target when scrolled into view. Reads data-decimals / data-suffix / data-comma.
 */
export function useCountUp<T extends HTMLElement>(ref: RefObject<T | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nodes = el.querySelectorAll<HTMLElement>("[data-count]");
    if (!nodes.length) return;

    const ctx = gsap.context(() => {
      nodes.forEach((node) => {
        const target = parseFloat(node.dataset.count || "0");
        const dec = parseInt(node.dataset.decimals || "0", 10);
        const suffix = node.dataset.suffix || "";
        const comma = node.dataset.comma === "1";
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
          onUpdate() {
            let s = obj.v.toFixed(dec);
            if (comma) s = Number(s).toLocaleString("en-US");
            node.textContent = s + suffix;
          },
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);
}
