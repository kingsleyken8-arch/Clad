import { createContext, useContext } from "react";
import type Lenis from "lenis";
import { isEmbed } from "./store";

/* ------------------------------------------------------------------ */
/* Routes                                                              */
/* ------------------------------------------------------------------ */

export type RouteName = "home" | "menu" | "detail" | "contact" | "work" | "case";
export type Route = {
  name: RouteName;
  /** canonical hash path, e.g. "/work/oree" */
  path: string;
  slug?: string;
  /** dark pages sit on the night wall */
  dark: boolean;
  /** which relief panel leads on this page */
  shift: number;
  /** plain paper, no wall (the project list) */
  flat?: boolean;
};

const DETAIL = ["about", "approach", "services", "process", "clients"];

export function parseRoute(hash: string): Route {
  const path = "/" + hash.replace(/^#/, "").split("?")[0].replace(/^\/+|\/+$/g, "");
  const [, a, b] = path.split("/");
  if (a === "menu") return { name: "menu", path: "/menu", dark: true, shift: 0 };
  if (a === "contact") return { name: "contact", path: "/contact", dark: true, shift: 1 };
  if (DETAIL.includes(a)) return { name: "detail", path: `/${a}`, slug: a, dark: true, shift: DETAIL.indexOf(a) + 1 };
  if (a === "work" && b) return { name: "case", path: `/work/${b}`, slug: b, dark: false, shift: 1 + (b.length % 3) };
  if (a === "work") return { name: "work", path: "/work", dark: false, shift: 2, flat: true };
  return { name: "home", path: "/", dark: false, shift: 0 };
}

/** Hashes that belong to the other pieces living in this repo, not to the site. */
export const isSiteHash = (hash: string) => !/^#\/(lost|vangogh|nexmora|studio)\b/.test(hash);

export const EMBED = isEmbed();

/* ------------------------------------------------------------------ */
/* Shared context                                                      */
/* ------------------------------------------------------------------ */

export type Shell = {
  route: Route;
  /** Navigate with the page transition. */
  go: (path: string) => void;
  lenis: () => Lenis | null;
  /** true once the preloader has finished */
  ready: boolean;
  openForm: () => void;
};

export const ShellContext = createContext<Shell | null>(null);
export const useShell = () => {
  const s = useContext(ShellContext);
  if (!s) throw new Error("ShellContext missing");
  return s;
};

/** Anchor that navigates with the page transition. */
export function Link({
  to,
  className,
  children,
  label,
  ...rest
}: {
  to: string;
  className?: string;
  children: React.ReactNode;
  /** text shown beside the cursor on hover */
  label?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const { go } = useShell();
  return (
    <a
      href={`#${to}`}
      className={className}
      data-cursor-label={label}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        if (EMBED) return; // keep editor frames on their page
        go(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
