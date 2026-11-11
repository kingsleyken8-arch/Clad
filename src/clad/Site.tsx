import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
import Lenis from "lenis";
import "./clad.css";
import { asset, PROJECTS, STUDIO_PAGES } from "./content";
import { Plaster, SWEEP } from "./gl/plaster";
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

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

/** The parts of the wall a page change animates. Stands in for the renderer where WebGL is missing. */
type Wall = Pick<
  Plaster,
  | "intro" | "dim" | "zoomDay" | "shiftDay" | "scrollDay"
  | "black" | "zoomNight" | "rollNight" | "shiftNight" | "scrollNight"
  | "mix" | "sweep"
> & { clear(): void; rebase(): void };

const noWall = (): Wall => ({
  intro: 1, dim: 0, zoomDay: 1, shiftDay: 0, scrollDay: null,
  black: 0, zoomNight: 1, rollNight: 0, shiftNight: 0, scrollNight: null,
  mix: 0, sweep: SWEEP.shut, clear() {}, rebase() {},
});

/** Where the night wall's camera starts from as it is carried in. */
const NIGHT_ENTRY = { zoomNight: 1.12, rollNight: 0.045 };

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
  /** the page being brought in, mounted out of sight while the current one leaves */
  const [incoming, setIncoming] = useState<Route | null>(null);
  /** the preloader has started to lift: the page may move */
  const [ready, setReady] = useState(EMBED);
  const [loading, setLoading] = useState(!EMBED);
  const [formOpen, setFormOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [atFoot, setAtFoot] = useState(false);

  const routeRef = useRef(route);
  const root = useRef<HTMLDivElement>(null);
  const plasterHost = useRef<HTMLDivElement>(null);
  const plaster = useRef<Plaster | null>(null);
  const wall = useRef<Wall>(noWall());
  const lenis = useRef<Lenis | null>(null);
  const busy = useRef(false);
  const change = useRef<gsap.core.Timeline | null>(null);
  const peek = useRef<gsap.core.Tween | null>(null);
  const lastLight = useRef("/");
  const loaded = useRef({ textures: 0, fonts: 0 });
  /** how long after a page becomes current its content starts to show (ms) */
  const arrival = useRef(0);

  const pageEl = (path: string) =>
    root.current?.querySelector<HTMLElement>(`.cl-page[data-path="${CSS.escape(path)}"]`) ?? null;

  /* ---------- renderer + smooth scroll ---------- */
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
    const canvas = document.createElement("canvas");
    plasterHost.current!.appendChild(canvas);
    let p: Plaster | null = null;
    try {
      p = new Plaster(canvas, {
        wall: asset(`clad/wall${sm}.jpg`),
        reliefs: [asset(`clad/relief-a${sm}.jpg`), asset(`clad/relief-b${sm}.jpg`), asset(`clad/relief-c${sm}.jpg`)],
        noise: asset("clad/noise.jpg"),
      });
      p.onProgress = (v) => (loaded.current.textures = v);
    } catch {
      canvas.remove();
      html.classList.add("cl-nogl");
      loaded.current.textures = 1;
    }
    plaster.current = p;
    const w: Wall = p ?? noWall();
    wall.current = w;

    // the wall as the first page needs it
    const r = routeRef.current;
    w.mix = r.dark ? 1 : 0;
    w.shiftDay = w.shiftNight = r.shift;
    w.intro = r.flat ? 0 : 1;
    html.classList.toggle("cl-dark", r.dark);

    document.fonts?.ready.then(() => (loaded.current.fonts = 1));
    window.setTimeout(() => (loaded.current.fonts = 1), 2500);

    return () => {
      cancelAnimationFrame(raf);
      change.current?.kill();
      peek.current?.kill();
      l?.destroy();
      p?.destroy();
      canvas.remove();
      plaster.current = null;
      lenis.current = null;
      html.classList.remove("cl-root", "cl-dark", "cl-nogl");
      html.style.overflow = "";
    };
  }, []);

  /* ---------- hold the page still under the preloader and the form ---------- */
  useEffect(() => {
    const hold = !ready || formOpen;
    if (hold) lenis.current?.stop();
    else lenis.current?.start();
    document.documentElement.style.overflow = hold && !EMBED ? "hidden" : "";
  }, [ready, formOpen]);

  /* ---------- route changes ----------
   * The wall does the travelling; the pages only fade. Timings and easings
   * follow the reference build:
   *   light -> light  the wall dissolves to flat paper and back
   *   light -> dark   a torn, smoke-edged front carries the night wall in from the top-right
   *   dark  -> light  the stone sinks to black and dissolves into plaster
   *   dark  -> dark   a push in through black
   */
  const sync = useCallback(() => {
    if (!isSiteHash(window.location.hash)) return;
    const next = parseRoute(window.location.hash);
    const from = routeRef.current;
    if (busy.current || next.path === from.path) return;
    busy.current = true;
    setFormOpen(false);

    // let anything still settling from the last change finish first
    change.current?.progress(1);
    peek.current?.kill();
    const w = wall.current;

    // Mount the next page now, out of sight. Its cost lands before anything
    // has started to move, so nothing stutters part-way through.
    flushSync(() => setIncoming(next));
    const oldEl = pageEl(from.path);
    const newEl = pageEl(next.path);
    if (newEl) gsap.set(newEl, { opacity: 0 });
    lenis.current?.stop();

    const swap = () => {
      const y = window.scrollY;
      // the wall that is leaving keeps the scroll it had; the one arriving follows the new page
      if (from.dark) w.scrollNight = y;
      else w.scrollDay = y;
      routeRef.current = next;
      if (!next.dark) lastLight.current = next.path;
      flushSync(() => {
        setRoute(next);
        setIncoming(null);
        setScrolled(false);
        setAtFoot(false);
      });
      window.scrollTo(0, 0);
      lenis.current?.resize();
      lenis.current?.scrollTo(0, { immediate: true, force: true });
      lenis.current?.start();
      document.documentElement.classList.toggle("cl-dark", next.dark);
      // Where the wall is out of sight at this moment its pressure is wiped;
      // otherwise carvings already raised are left to sink back on their own.
      if (from.dark === next.dark) w.clear();
      else w.rebase();
      if (next.dark) w.scrollNight = null;
      else w.scrollDay = null;
    };

    const free = () => {
      busy.current = false;
      // the address may have moved on while we were busy (back/forward)
      if (parseRoute(window.location.hash).path !== routeRef.current.path) sync();
    };

    const tl = gsap.timeline({
      onComplete: () => {
        if (newEl) gsap.set(newEl, { clearProps: "opacity" });
      },
    });
    change.current = tl;

    /** the new page's content: titles one after another where it has them, otherwise a soft fade */
    const arrive = (at: number) => {
      if (!newEl) return;
      const parts = newEl.querySelectorAll("[data-in]");
      if (parts.length) {
        tl.set(newEl, { opacity: 1 }, at);
        tl.fromTo(
          parts,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 1, ease: "sine.out", stagger: 0.09, clearProps: "opacity,transform" },
          at,
        );
      } else {
        tl.to(newEl, { opacity: 1, duration: 1, ease: "sine.inOut" }, at);
      }
    };
    const leave = (duration: number, ease: string) => {
      if (oldEl) tl.to(oldEl, { opacity: 0, duration, ease }, 0);
    };

    if (reduced) {
      // no travel: a short cross-fade
      leave(0.2, "none");
      tl.add(() => {
        swap();
        w.mix = next.dark ? 1 : 0;
        w.shiftDay = w.shiftNight = next.shift;
        w.intro = next.flat ? 0 : 1;
        w.scrollDay = w.scrollNight = null;
      }, 0.22);
      if (newEl) tl.to(newEl, { opacity: 1, duration: 0.25, ease: "none" }, 0.24);
      tl.add(free, 0.3);
      arrival.current = 0;
    } else if (!from.dark && !next.dark) {
      leave(0.4, "sine.inOut");
      // (if the night wall was leaning in at the corner, send it back)
      tl.to(w, { sweep: SWEEP.shut, duration: 0.3, ease: "sine.out" }, 0);
      tl.to(w, { intro: 0, duration: 0.45, ease: "sine.inOut" }, 0);
      tl.add(() => {
        swap();
        w.shiftDay = next.shift;
        w.zoomDay = 1.045;
      }, 0.5);
      tl.to(w, { intro: next.flat ? 0 : 1, duration: 1.2, ease: "sine.inOut" }, 0.55);
      tl.to(w, { zoomDay: 1, duration: 2, ease: "power1.out" }, 0.55);
      arrive(0.64);
      tl.add(free, 1.25);
      arrival.current = 140;
    } else if (!from.dark && next.dark) {
      w.shiftNight = next.shift;
      w.scrollNight = 0;
      w.black = 0;
      // if Menu was being hovered the front is already on its way: carry on from there
      if (w.sweep <= SWEEP.shut + 0.001) Object.assign(w, NIGHT_ENTRY);
      leave(0.5, "sine.out");
      tl.to(w, { sweep: SWEEP.open, duration: 2.25, ease: "power2.inOut" }, 0);
      tl.to(w, { dim: 0.56, duration: 1.5, ease: "sine.inOut" }, 0);
      tl.to(w, { zoomDay: 1.05, duration: 2.4, ease: "sine.inOut" }, 0);
      tl.to(w, { zoomNight: 1, rollNight: 0, duration: 4, ease: "power3.out" }, 0.2);
      tl.add(swap, 0.55);
      tl.add(() => {
        w.mix = 1;
        w.sweep = SWEEP.shut;
        w.dim = 0;
        w.zoomDay = 1;
        w.scrollDay = null;
      }, 2.25);
      arrive(1.45);
      tl.add(free, 2);
      arrival.current = 900;
    } else if (from.dark && !next.dark) {
      w.shiftDay = next.shift;
      w.intro = next.flat ? 0 : 1;
      w.scrollDay = 0;
      w.zoomDay = 1.045;
      w.dim = 0;
      leave(0.5, "sine.out");
      tl.to(w, { black: 1, duration: 1.2, ease: "sine.inOut" }, 0);
      tl.add(swap, 0.52);
      tl.to(w, { mix: 0, duration: 1.2, ease: "power2.inOut" }, 0.55);
      tl.to(w, { zoomDay: 1, duration: 2, ease: "power1.out" }, 0.55);
      tl.add(() => {
        w.black = 0;
        w.scrollNight = null;
      }, 1.8);
      arrive(1.05);
      tl.add(free, 1.6);
      arrival.current = 530;
    } else {
      leave(0.45, "sine.out");
      tl.to(w, { black: 1, duration: 0.8, ease: "sine.inOut" }, 0);
      tl.to(w, { zoomNight: 1.2, duration: 0.85, ease: "power2.in" }, 0);
      tl.add(() => {
        swap();
        w.shiftNight = next.shift;
        w.zoomNight = 1.14;
      }, 0.86);
      tl.to(w, { black: 0, duration: 1.25, ease: "sine.inOut" }, 0.9);
      tl.to(w, { zoomNight: 1, duration: 2.8, ease: "power3.out" }, 0.9);
      arrive(1.3);
      tl.add(free, 1.8);
      arrival.current = 440;
    }
  }, []);

  useEffect(() => {
    if (EMBED) return;
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [sync]);

  const go = useCallback<Shell["go"]>((path) => {
    if (busy.current) return;
    if (parseRoute(`#${path}`).path === routeRef.current.path) {
      if (lenis.current) lenis.current.scrollTo(0, { duration: 1.6 });
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    window.location.hash = path;
  }, []);

  /** Resting on Menu lets the night wall lean in at the corner; leaving sends it back. */
  const lean = useCallback((on: boolean) => {
    const w = wall.current;
    if (!finePointer || reduced || busy.current || routeRef.current.dark) return;
    peek.current?.kill();
    if (on) {
      if (w.sweep <= SWEEP.shut + 0.001) {
        w.shiftNight = 0;
        w.scrollNight = 0;
        w.black = 0;
        Object.assign(w, NIGHT_ENTRY);
      }
      peek.current = gsap.to(w, { sweep: SWEEP.peek, duration: 2.5, ease: "expo.out" });
    } else {
      const left = (w.sweep - SWEEP.shut) / (SWEEP.peek - SWEEP.shut);
      peek.current = gsap.to(w, { sweep: SWEEP.shut, duration: Math.max(0.05, left), ease: "none" });
    }
  }, []);

  const openForm = useCallback(() => {
    if (EMBED) return;
    setFormKey((k) => k + 1);
    setFormOpen(true);
  }, []);

  /* ---------- things that appear as they scroll into view ---------- */
  useEffect(() => {
    const host = pageEl(route.path);
    if (!ready || !host) return;
    const pending = () => host.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)");
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
    // anything too close to the end of the page to cross the line still gets shown
    const atEnd = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 12) {
        pending().forEach((el) => el.classList.add("is-in"));
      }
    };
    // wait until the page itself is fading in, so its first words are seen arriving
    const start = window.setTimeout(() => {
      pending().forEach((el) => (el.dataset.reveal === "media" ? media : text).observe(el));
      window.addEventListener("scroll", atEnd, { passive: true });
    }, arrival.current);
    const settle = window.setTimeout(atEnd, arrival.current + 1200);
    return () => {
      text.disconnect();
      media.disconnect();
      window.removeEventListener("scroll", atEnd);
      window.clearTimeout(start);
      window.clearTimeout(settle);
    };
  }, [route.path, ready]);

  /* ---------- chrome that depends on where the page is ---------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.55);
    window.addEventListener("scroll", onScroll, { passive: true });
    const foot = pageEl(route.path)?.querySelector(".cl-foot");
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
      else if (routeRef.current.dark) go(lastLight.current);
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
        ref={root}
        className={[
          "cl",
          route.dark ? "is-dark" : "",
          EMBED ? "is-embed" : "",
          finePointer && !EMBED ? "has-cursor" : "",
        ].join(" ")}
      >
        <div className="cl-plaster" ref={plasterHost} aria-hidden />

        {[route, incoming].map(
          (r) =>
            r && (
              <main
                key={r.path}
                data-path={r.path}
                className={`cl-page ${r === incoming ? "is-incoming" : ""}`}
                aria-hidden={r === incoming || undefined}
              >
                <Page route={r} />
              </main>
            ),
        )}

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
            onClick={() => go(inIndex ? lastLight.current : "/menu")}
            onPointerEnter={() => lean(true)}
            onPointerLeave={() => lean(false)}
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
