import type { ReactNode } from "react";
import { useReveal } from "../hooks/useReveal";

type Variant = "up" | "left" | "right" | "zoom";

const VARIANT_CLASS: Record<Variant, string> = {
  up: "",
  left: "reveal-left",
  right: "reveal-right",
  zoom: "reveal-zoom",
};

interface RevealProps {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  delay?: number;
}

/** Wraps children in a scroll-reveal container driven by IntersectionObserver. */
export function Reveal({
  children,
  className = "",
  variant = "up",
  delay = 0,
}: RevealProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`reveal ${VARIANT_CLASS[variant]} ${
        visible ? "is-visible" : ""
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
