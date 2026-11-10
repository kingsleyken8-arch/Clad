import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Lenis from "lenis";
import "./clad.css";
import { asset, PROJECTS, STUDIO_PAGES } from "./content";
import { Plaster } from "./gl/plaster";
import { Wipe } from "./gl/wipe";
import { ContactForm } from "./ContactForm";
import { Preloader } from "./Preloader";
import { Cursor, Mark } from "./bits";
import { EMBED, isSiteHash, Link, parseRoute, Route, Shell, ShellContext } from "./shell";
import { useContent } from "./store";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Detail from "./pages/Detail";
import Contact from "./pages/Contact";
import Work from "./pages/Work";
import Case from "./pages/Case";

type RGB = [number, number, number];
const PAPER: RGB = [0.91, 0.91, 0.91];
const INK: RGB = [0.012, 0.012, 0.012];

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;
const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

/** What the route change is painted with. */
type Fx = {
  cover(origin: { x: number; y: number }, color: RGB, duration?: number): Promise<void>;
  release(duration?: number): Promise<void>;
  destroy(): void;
};

/** Plain cross-fade for browsers without WebGL. */
function fadeFx(host: HTMLElement): Fx {
  const el = document.createElement("div");
  el.style.cssText = "position:absolute;inset:0;opacity:0;transition:opacity .45s ease";
  host.appendChild(el);
  const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));
  return {
    async cover(_origin, c) {
      el.style.background = `rgb(${c.map((v) => Math.round(v * 255)).join(",")})`;
      el.style.opacity = "1";
      await wait(470);
    },
    async release() {
      el.style.opacity = "0";
      await wait(470);
    },
    destroy: () => el.remove(),
  };
}

function Page({ route }: { route: Route }) {
  switch (route.name) {
    case "menu":
      return <Menu />;
    case "detail":
      return <Detail slug={route.slug!} />;
    case "contact":
      return <Contact />;
    case "work":
      return <Work />;
    case "case":
      return <Case slug={route.slug!} />;
    default:
      return <Home />;
  }
}

export default function Site() {
  const brand = useContent().text.brand;
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));
  const [phase, setPhase] = useState<"idle" | "leaving" | "entering">("idle");
  /** the preloader has started to lift: the page may move */
  const [ready, setReady] = useState(EMBED);
  const [loading, setLoading] = useState(!EMBED);
  const [formOpen, setFormOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [atFoot, setAtFoot] = useState(false);

  const routeRef = useRef(route);
  const page = useRef<HTMLElement>(null);
  const plasterHost = useRef<HTMLDivElement>(null);
  const wipeHost = useRef<HTMLDivElement>(null);
  const plaster = useRef<Plaster | null>(null);
  const fx = useRef<Fx | null>(null);
  const lenis = useRef<Lenis | null>(null);
  const busy = useRef(false);
  const origin = useRef<{ x: number; y: number } | null>(null);
  const lastLight = useRef("/");
  const loaded = useRef({ textures: 0, fonts: 0 });

  const paint = useCallback((r: Route) => {
    const p = plaster.current;
    if (p) {
      p.night = r.dark ? 1 : 0;
      p.shift = r.shift;
      p.intro = r.flat ? 0 : 1;
      p.clear();
    }
    document.documentElement.classList.toggle("cl-dark", r.dark);
  }, []);

  /* ---------- renderers + smooth scroll ---------- */
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("cl-root");

    // Lenis first, so each frame the page has scrolled before the wall is drawn
    let l: Lenis | null = null;
    let raf = 0;
    if (!EMBED && !reduced) {
      l = new Lenis({ lerp: 0.09 });
      const loop = (t: number) => {
        l!.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }
    lenis.current = l;

    const sm = window.innerWidth < 820 ? "-sm" : "";
    const wall = document.createElement("canvas");
    plasterHost.current!.appendChild(wall);
    let p: Plaster | null = null;
    try {
      p = new Plaster(wall, {
        wall: asset(`clad/wall${sm}.jpg`),
        reliefs: [asset(`clad/relief-a${sm}.jpg`), asset(`clad/relief-b${sm}.jpg`), asset(`clad/relief-c${sm}.jpg`)],
      });
      p.onProgress = (v) => (loaded.current.textures = v);
    } catch {
      wall.remove();
      html.classList.add("cl-nogl");
      loaded.current.textures = 1;
    }
    plaster.current = p;

    const veil = document.createElement("canvas");
    wipeHost.current!.appendChild(veil);
    let f: Fx;
    try {
      f = new Wipe(veil);
    } catch {
      veil.remove();
      f = fadeFx(wipeHost.current!);
    }
    fx.current = f;

    document.fonts?.ready.then(() => (loaded.current.fonts = 1));
    window.setTimeout(() => (loaded.current.fonts = 1), 2500);

    paint(routeRef.current);

    return () => {
      cancelAnimationFrame(raf);
      l?.destroy();
      p?.destroy();
      f.destroy();
      wall.remove();
      veil.remove();
      plaster.current = null;
      fx.current = null;
      lenis.current = null;
      html.classList.remove("cl-root", "cl-dark", "cl-nogl");
      html.style.overflow = "";
    };
  }, [paint]);

  /* ---------- hold the page still under the preloader and the form ---------- */
  useEffect(() => {
    const hold = !ready || formOpen;
    if (hold) lenis.current?.stop();
    else lenis.current?.start();
    document.documentElement.style.overflow = hold && !EMBED ? "hidden" : "";
  }, [ready, formOpen]);

  /* ---------- route changes ---------- */
  const sync = useCallback(async () => {
    if (!isSiteHash(window.location.hash)) return;
    const next = parseRoute(window.location.hash);
    if (busy.current || next.path === routeRef.current.path) return;
    busy.current = true;
    setFormOpen(false);
    setPhase("leaving");

    const from = origin.current ?? { x: window.innerWidth - 64, y: 48 };
    origin.current = null;
    lenis.current?.stop();
    await fx.current?.cover(from, next.dark ? INK : PAPER, reduced ? 200 : 1250);

    routeRef.current = next;
    if (!next.dark) lastLight.current = next.path;
    flushSync(() => {
      setRoute(next);
      setPhase("entering");
      setScrolled(false);
      setAtFoot(false);
    });
    window.scrollTo(0, 0);
    lenis.current?.resize();
    lenis.current?.scrollTo(0, { immediate: true, force: true });
    paint(next);
    await frame();
    await frame();
    lenis.current?.start();
    await fx.current?.release(reduced ? 200 : 900);

    setPhase("idle");
    busy.current = false;
    // the address may have moved on while we were busy (back/forward)
    if (parseRoute(window.location.hash).path !== next.path) void sync();
  }, [paint]);

  useEffect(() => {
    if (EMBED) return;
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [sync]);

  const go = useCallback<Shell["go"]>((path, e) => {
    if (busy.current) return;
    if (parseRoute(`#${path}`).path === routeRef.current.path) {
      if (lenis.current) lenis.current.scrollTo(0, { duration: 1.6 });
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    origin.current = e ? { x: e.clientX, y: e.clientY } : null;
    window.location.hash = path;
  }, []);

  const openForm = useCallback(() => {
    if (EMBED) return;
    setFormKey((k) => k + 1);
    setFormOpen(true);
  }, []);

  /* ---------- things that appear as they scroll into view ---------- */
  useEffect(() => {
    if (!ready || !page.current) return;
    const root = page.current;
    const pending = () => root.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)");
    const make = (margin: string) =>
      new IntersectionObserver(
        (entries, io) =>
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }),
        { rootMargin: margin, threshold: 0.01 },
      );
    const text = make("0px 0px -22% 0px");
    const media = make("0px 0px -6% 0px");
    pending().forEach((el) => (el.dataset.reveal === "media" ? media : text).observe(el));

    // anything too close to the end of the page to cross the line still gets shown
    const atEnd = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 12) {
        pending().forEach((el) => el.classList.add("is-in"));
      }
    };
    window.addEventListener("scroll", atEnd, { passive: true });
    const settle = window.setTimeout(atEnd, 1200);
    return () => {
      text.disconnect();
      media.disconnect();
      window.removeEventListener("scroll", atEnd);
      window.clearTimeout(settle);
    };
  }, [route.path, ready]);

  /* ---------- chrome that depends on where the page is ---------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.55);
    window.addEventListener("scroll", onScroll, { passive: true });
    const foot = page.current?.querySelector(".cl-foot");
    const io = new IntersectionObserver(([en]) => setAtFoot(en.isIntersecting), { rootMargin: "0px 0px -12% 0px" });
    if (foot) io.observe(foot);
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, [route.path]);

  /* ---------- page title ---------- */
  useEffect(() => {
    const name =
      route.name === "detail"
        ? STUDIO_PAGES.find((p) => p.slug === route.slug)?.title
        : route.name === "case"
          ? PROJECTS.find((p) => p.slug === route.slug)?.title
          : { home: "", menu: "Index", contact: "Contact", work: "Projects" }[route.name as "home"];
    document.title = name ? `${name} — ${brand}` : `${brand} — Digital experiences studio`;
  }, [route, brand]);

  /* ---------- keyboard ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (formOpen) setFormOpen(false);
      else if (routeRef.current.dark) go(lastLight.current, null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [formOpen, go]);

  /* ---------- editor bridge: highlight and scroll to the selected slot ---------- */
  useEffect(() => {
    if (!EMBED) return;
    const find = (id: string) =>
      document.querySelectorAll<HTMLElement>(`[data-edit-id="${CSS.escape(id)}"],[data-edit-text="${CSS.escape(id)}"]`);
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.source !== "clad-studio") return;
      if (e.data.type === "highlight") {
        document.querySelectorAll(".is-selected").forEach((el) => el.classList.remove("is-selected"));
        if (e.data.id) find(e.data.id).forEach((el) => el.classList.add("is-selected"));
      }
      if (e.data.type === "reveal") {
        const el = find(e.data.id)[0];
        if (!el) return;
        const y = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.25;
        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const shell: Shell = {
    route,
    go,
    ready,
    openForm,
    lenis: () => lenis.current,
    plaster: () => plaster.current,
  };

  const inIndex = route.dark;
  const on = ready ? "is-on" : "";
  const back =
    route.name === "work"
      ? { to: "/", where: "to Home" }
      : route.name === "detail" || route.name === "contact"
        ? { to: "/menu", where: "to Index" }
        : null;
  const showWork = (route.name === "home" || route.name === "case" || route.name === "menu") && !atFoot;
  const showMark = route.name !== "home" || scrolled;

  return (
    <ShellContext.Provider value={shell}>
      <div
        className={[
          "cl",
          route.dark ? "is-dark" : "",
          EMBED ? "is-embed" : "",
          finePointer && !EMBED ? "has-cursor" : "",
        ].join(" ")}
      >
        <div className="cl-plaster" ref={plasterHost} aria-hidden />

        <main
          ref={page}
          key={route.path}
          className={`cl-page ${phase === "entering" ? "is-entering" : ""} ${phase === "leaving" ? "is-leaving" : ""}`}
        >
          <Page route={route} />
        </main>

        {/* fixed chrome */}
        <Link to="/" className={`cl-mark ${on && showMark ? "is-on" : ""}`} aria-label={`${brand} — home`}>
          <Mark />
        </Link>

        {back && (
          <div className={`cl-top ${on}`}>
            <Link to={back.to} aria-label={`Back ${back.where}`}>
              Back
              <span className="cl-top__where" aria-hidden>
                {" "}
                {back.where}
              </span>
            </Link>
          </div>
        )}

        <header className={`cl-head ${on}`}>
          <button
            type="button"
            className={`cl-menu ${inIndex ? "is-open" : ""}`}
            aria-label={inIndex ? "Close" : "Menu"}
            onClick={(e) => go(inIndex ? lastLight.current : "/menu", e.detail === 0 ? null : e)}
          >
            <span className="cl-menu__label" aria-hidden>
              <span>Menu</span>
              <span>Close</span>
            </span>
            <span className="cl-menu__icon" aria-hidden>
              <i />
              <i />
            </span>
          </button>
        </header>

        <div className={`cl-work ${on && showWork ? "is-on" : ""} ${scrolled ? "is-away" : ""}`}>
          <Link to="/work">
            See all projects
            <span className="cl-work__dots" aria-hidden>
              <i />
              <i />
              <i />
            </span>
          </Link>
        </div>

        {/* enquiry form, opened from the footer */}
        <div className={`cl-formlayer ${formOpen ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Start a project" aria-hidden={!formOpen}>
          <div className="cl-formlayer__close">
            <button type="button" onClick={() => setFormOpen(false)} tabIndex={formOpen ? 0 : -1}>
              Close
            </button>
          </div>
          {formKey > 0 && <ContactForm key={formKey} active={formOpen} wide />}
        </div>

        <div className="cl-wipe" ref={wipeHost} aria-hidden />

        {loading && (
          <Preloader
            dark={route.dark}
            home={route.name === "home"}
            progress={() => loaded.current.textures * 0.8 + loaded.current.fonts * 0.2}
            onReveal={() => setReady(true)}
            onDone={() => setLoading(false)}
          />
        )}

        {finePointer && !EMBED && <Cursor />}
      </div>
    </ShellContext.Provider>
  );
}
