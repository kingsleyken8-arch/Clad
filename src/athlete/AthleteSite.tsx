import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { JOURNAL, RECORDS, STATS } from "./content";
import { Media, Text, textEditProps } from "./Editable";
import { isEmbed, useContent } from "./store";
import "./athlete.css";

gsap.registerPlugin(ScrollTrigger);

const EMBED = isEmbed();
const NAV = [
  { id: "records", label: "Records" },
  { id: "stats", label: "Stats" },
  { id: "partners", label: "Partners" },
  { id: "foundation", label: "Foundation" },
  { id: "journal", label: "Journal" },
];

let lenis: Lenis | null = null;
function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -20, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
}

/* --------------------------------- helpers --------------------------------- */

function Chars({ text, className = "" }: { text: string; className?: string }) {
  return (
    <>
      {Array.from(text).map((c, i) => (
        <span className="ath-mask" key={i}>
          <span className={`ch ${className}`}>{c === " " ? " " : c}</span>
        </span>
      ))}
    </>
  );
}

/** Section title whose letters rise into place when it scrolls into view. */
function SplitTitle({ text, className = "" }: { text: string; className?: string }) {
  return (
    <h2 className={`ath-display split ${className}`} aria-label={text}>
      <Chars text={text} />
    </h2>
  );
}

const Arrow = () => (
  <svg className="arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

/* ---------------------------------- site ----------------------------------- */

export default function AthleteSite() {
  const root = useRef<HTMLDivElement>(null);
  const content = useContent();
  const t = content.text;
  const [loading, setLoading] = useState(!EMBED);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const introPlayed = useRef(false);

  /* ---------- smooth scroll (Lenis) wired into ScrollTrigger ---------- */
  useEffect(() => {
    const l = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis = l;
    l.on("scroll", ScrollTrigger.update);
    l.on("scroll", (e: Lenis) => setNavHidden(e.direction === 1 && e.scroll > 240));
    const raf = (time: number) => l.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Re-measure triggers when late media changes layout.
    let tId = 0;
    const onLoad = (e: Event) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag !== "IMG" && tag !== "VIDEO") return;
      window.clearTimeout(tId);
      tId = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    document.addEventListener("load", onLoad, true);
    document.addEventListener("loadedmetadata", onLoad, true);

    return () => {
      gsap.ticker.remove(raf);
      document.removeEventListener("load", onLoad, true);
      document.removeEventListener("loadedmetadata", onLoad, true);
      l.destroy();
      lenis = null;
    };
  }, []);

  /* ---------- lock scroll while loading or menu open ---------- */
  useEffect(() => {
    if (loading || menuOpen) lenis?.stop();
    else lenis?.start();
  }, [loading, menuOpen]);

  /* ---------- studio bridge: highlight + reveal selected slot ---------- */
  useEffect(() => {
    if (!EMBED) return;
    const sel = (id: string) =>
      document.querySelectorAll(`[data-edit-id="${CSS.escape(id)}"],[data-edit-text="${CSS.escape(id)}"]`);
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.source !== "athlete-studio") return;
      if (e.data.type === "highlight") {
        document.querySelectorAll(".is-selected").forEach((el) => el.classList.remove("is-selected"));
        if (e.data.id) sel(e.data.id).forEach((el) => el.classList.add("is-selected"));
      }
      if (e.data.type === "reveal") {
        const el = sel(e.data.id)[0] as HTMLElement | undefined;
        if (!el) return;
        const y = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.25;
        if (lenis) lenis.scrollTo(Math.max(0, y), { duration: 1.1 });
        else window.scrollTo({ top: y, behavior: "smooth" });
      }
    };
    window.addEventListener("message", onMsg);
    // Keep links inert while editing.
    const stopLinks = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a")) e.preventDefault();
    };
    document.addEventListener("click", stopLinks, true);
    return () => {
      window.removeEventListener("message", onMsg);
      document.removeEventListener("click", stopLinks, true);
    };
  }, []);

  /* ---------- preloader ---------- */
  useLayoutEffect(() => {
    if (!loading || !root.current) return;
    const ctx = gsap.context(() => {
      const count = root.current!.querySelector<HTMLElement>(".ath-loader .count")!;
      const obj = { v: 0 };
      gsap
        .timeline({ onComplete: () => setLoading(false) })
        .to(obj, {
          v: 100,
          duration: 1.9,
          ease: "power2.inOut",
          onUpdate: () => (count.textContent = String(Math.round(obj.v)).padStart(3, "0")),
        })
        .to(".ath-loader .bar i", { scaleX: 1, duration: 1.9, ease: "power2.inOut" }, 0)
        .to(".ath-loader .brand", { yPercent: -100, duration: 0.6, ease: "power3.in" }, "+=0.1")
        .to(".ath-loader", { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, "-=0.2");
    }, root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- custom cursor (desktop pointers only) ---------- */
  useEffect(() => {
    if (EMBED || !window.matchMedia("(pointer: fine)").matches) return;
    const dot = root.current?.querySelector<HTMLElement>(".ath-cursor .dot");
    const ring = root.current?.querySelector<HTMLElement>(".ath-cursor .ring");
    if (!dot || !ring) return;
    const dx = gsap.quickTo(dot, "x", { duration: 0.12 });
    const dy = gsap.quickTo(dot, "y", { duration: 0.12 });
    const rx = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3" });
    const ry = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3" });
    let showing = false;
    const move = (e: PointerEvent) => {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      const over = !!(e.target as HTMLElement).closest?.('[data-cursor="view"]');
      if (over !== showing) {
        showing = over;
        gsap.to(ring, { scale: over ? 1 : 0, opacity: over ? 1 : 0, duration: 0.45, ease: "expo.out" });
        gsap.to(dot, { scale: over ? 0 : 1, duration: 0.3 });
      }
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  /* ---------- magnetic buttons ---------- */
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const els = Array.from(root.current?.querySelectorAll<HTMLElement>(".magnetic") ?? []);
    const offs = els.map((el) => {
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.5, ease: "power3" });
      };
      const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" });
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    });
    return () => offs.forEach((off) => off());
  }, []);

  /* ---------- mobile menu ---------- */
  useLayoutEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      if (menuOpen) {
        gsap.timeline()
          .to(".ath-menu", { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "expo.inOut" })
          .fromTo(".ath-menu .ch-row", { yPercent: 110 }, { yPercent: 0, stagger: 0.06, duration: 0.8, ease: "expo.out" }, "-=0.35");
      } else {
        gsap.to(".ath-menu", { clipPath: "inset(0 0 100% 0)", duration: 0.7, ease: "expo.inOut" });
      }
    }, root);
    return () => ctx.kill();
  }, [menuOpen]);

  /* ---------- scroll choreography ----------
     Rebuilt whenever animated copy changes (split letters / words). */
  const animKey = [t.firstName, t.lastName, t.manifesto, t.footerCta].join("|");
  useLayoutEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* hero intro (after preloader) */
      const introDelay = introPlayed.current || EMBED ? 0.05 : 2.45;
      introPlayed.current = true;
      gsap.timeline({ delay: introDelay })
        .from(".ath-hero .frame .inner", { scale: 1.35, duration: 2, ease: "expo.out" }, 0)
        .from(".ath-hero .row .ch", { yPercent: 110, stagger: 0.035, duration: 1.2, ease: "expo.out" }, 0.1)
        .from(".ath-hero .num", { opacity: 0, x: 40, duration: 1.2, ease: "expo.out" }, 0.4)
        .from([".ath-hero .foot > *", ".ath-nav"], { y: 24, opacity: 0, stagger: 0.08, duration: 1, ease: "expo.out" }, 0.5);

      /* hero → framed card while pinned (tablet/desktop) */
      mm.add("(min-width: 768px)", () => {
        gsap.timeline({
          scrollTrigger: { trigger: ".ath-hero", start: "top top", end: "+=90%", scrub: true, pin: true },
        })
          .fromTo(".ath-hero .frame", { clipPath: "inset(0% 0% 0% 0% round 0px)" }, { clipPath: "inset(8% 6% 8% 6% round 28px)", ease: "none" }, 0)
          .fromTo(".ath-hero .frame .inner", { scale: 1 }, { scale: 1.12, ease: "none" }, 0)
          .to(".ath-hero .row.first", { xPercent: -6, ease: "none" }, 0)
          .to(".ath-hero .row.last", { xPercent: 6, ease: "none" }, 0)
          .to(".ath-hero .num-wrap", { yPercent: -60, opacity: 0, ease: "none" }, 0)
          .to(".ath-hero .foot", { opacity: 0, ease: "none" }, 0);
      });
      /* mobile: lighter parallax, no pin */
      mm.add("(max-width: 767px)", () => {
        gsap.to(".ath-hero .frame .inner", { yPercent: 18, ease: "none", scrollTrigger: { trigger: ".ath-hero", start: "top top", end: "bottom top", scrub: true } });
        gsap.to(".ath-hero .names", { yPercent: -35, ease: "none", scrollTrigger: { trigger: ".ath-hero", start: "top top", end: "bottom top", scrub: true } });
      });

      /* section titles: letters rise */
      gsap.utils.toArray<HTMLElement>(".split").forEach((el) => {
        gsap.from(el.querySelectorAll(".ch"), {
          yPercent: 110, stagger: 0.03, duration: 1.1, ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      /* generic fade-up */
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.from(el, { y: 40, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%" } });
      });

      /* manifesto: words light up with scroll */
      gsap.to(".ath-intro .w", {
        opacity: 1, stagger: 0.1, ease: "none",
        scrollTrigger: { trigger: ".ath-intro .manifesto", start: "top 78%", end: "bottom 45%", scrub: true },
      });

      /* image reveals + inner parallax */
      gsap.utils.toArray<HTMLElement>(".clip-reveal").forEach((el) => {
        gsap.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, {
          clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
      gsap.utils.toArray<HTMLElement>(".parallax .inner").forEach((el) => {
        gsap.fromTo(el, { yPercent: -7 }, {
          yPercent: 7, ease: "none",
          scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      /* stats: lines draw, numbers count up */
      gsap.utils.toArray<HTMLElement>(".ath-stats .cell").forEach((cell, i) => {
        const num = cell.querySelector<HTMLElement>(".num")!;
        const to = Number(num.dataset.to);
        const obj = { v: 0 };
        gsap.timeline({ scrollTrigger: { trigger: cell, start: "top 88%" }, delay: (i % 4) * 0.08 })
          .from(cell.querySelector(".line"), { scaleX: 0, duration: 1.3, ease: "expo.out" }, 0)
          .to(obj, { v: to, duration: 2.2, ease: "power3.out", onUpdate: () => (num.textContent = Math.round(obj.v).toLocaleString("en-US")) }, 0)
          .from(cell.querySelector(".lbl"), { y: 16, opacity: 0, duration: 0.9, ease: "expo.out" }, 0.25);
      });

      /* records: sticky stack — earlier cards recede as the next one lands */
      const cards = gsap.utils.toArray<HTMLElement>(".ath-records .card");
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.timeline({ scrollTrigger: { trigger: next, start: "top bottom", end: "top 20%", scrub: true } })
          .to(card, { scale: 0.92, ease: "none" }, 0)
          .to(card.querySelector(".dim"), { opacity: 0.65, ease: "none" }, 0);
      });

      /* highlights: pinned horizontal reel (tablet/desktop) */
      mm.add("(min-width: 768px)", () => {
        const track = root.current!.querySelector<HTMLElement>(".ath-hl .track")!;
        const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
        const reel = gsap.to(track, {
          x: () => -dist(), ease: "none",
          scrollTrigger: { trigger: ".ath-hl", start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true },
        });
        gsap.utils.toArray<HTMLElement>(".ath-hl .item .inner").forEach((el) => {
          gsap.fromTo(el, { xPercent: -7 }, {
            xPercent: 7, ease: "none",
            scrollTrigger: { trigger: el.parentElement, containerAnimation: reel, start: "left right", end: "right left", scrub: true },
          });
        });
      });
      mm.add("(max-width: 767px)", () => {
        gsap.utils.toArray<HTMLElement>(".ath-hl .item").forEach((el) => {
          gsap.from(el, { y: 60, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%" } });
        });
      });

      /* journal cards stagger in */
      ScrollTrigger.batch(".ath-journal .card", {
        start: "top 90%",
        onEnter: (els) => gsap.from(els, { y: 80, opacity: 0, stagger: 0.12, duration: 1.2, ease: "expo.out" }),
        once: true,
      });

      /* footer: headline words + giant name letters */
      gsap.from(".ath-foot .cta .wd", {
        yPercent: 110, stagger: 0.05, duration: 1.1, ease: "expo.out",
        scrollTrigger: { trigger: ".ath-foot .cta", start: "top 82%" },
      });
      gsap.fromTo(".ath-foot .giant .ch", { yPercent: 100 }, {
        yPercent: 0, stagger: 0.04, ease: "none",
        scrollTrigger: { trigger: ".ath-foot .giant", start: "top bottom", end: "bottom bottom", scrub: true },
      });
      gsap.fromTo(".ath-foot .bg .media-slot", { yPercent: -10 }, {
        yPercent: 10, ease: "none",
        scrollTrigger: { trigger: ".ath-foot", start: "top bottom", end: "bottom bottom", scrub: true },
      });
    }, root);

    // Pins added above change page height; make sure everything is measured.
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, [animKey]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    window.setTimeout(() => scrollToId(id), menuOpen ? 500 : 0);
  };

  const fullName = `${t.firstName} ${t.lastName}`;

  return (
    <div ref={root} className={`ath ${EMBED ? "is-embed" : ""}`}>
      {/* preloader */}
      {loading && (
        <div className="ath-loader" aria-hidden>
          <div className="ath-label">
            <span className="ath-mask"><span className="brand">{fullName} — Official</span></span>
          </div>
          <div>
            <div className="count">000</div>
            <div className="bar" style={{ marginTop: 18 }}><i /></div>
          </div>
        </div>
      )}

      {/* custom cursor */}
      {!EMBED && (
        <div className="ath-cursor" aria-hidden>
          <div className="ring">View</div>
          <div className="dot" />
        </div>
      )}

      {/* nav */}
      <header className={`ath-nav ${navHidden && !menuOpen ? "is-hidden" : ""}`}>
        <a href="#top" onClick={(e) => { e.preventDefault(); lenis?.scrollTo(0, { duration: 1.4 }); }}>
          <Text id="brand" className="brand" />
        </a>
        <nav className="links" aria-label="Primary">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} onClick={go(n.id)}>{n.label}</a>
          ))}
        </nav>
        <div className="right">
          <a href="#contact" onClick={go("contact")} className="ath-btn contact magnetic">
            Contact <Arrow />
          </a>
          <button className={`ath-burger ${menuOpen ? "is-open" : ""}`} onClick={() => setMenuOpen((v) => !v)} aria-label="Menu" aria-expanded={menuOpen}>
            <div><span /><span /></div>
          </button>
        </div>
      </header>

      {/* mobile / tablet menu */}
      <div className="ath-menu" aria-hidden={!menuOpen}>
        {[...NAV, { id: "contact", label: "Contact" }].map((n) => (
          <a key={n.id} href={`#${n.id}`} onClick={go(n.id)}>
            <span className="ath-mask"><span className="ch-row">{n.label}</span></span>
          </a>
        ))}
      </div>

      <main>
        {/* ================= HERO ================= */}
        <section className="ath-hero" id="top">
          <div className="frame">
            <div className="inner">
              <Media id="hero" eager />
            </div>
            <div className="shade" />
          </div>
          <div className="num-wrap"><Text id="number" className="num" /></div>
          <h1 className="names ath-display" aria-label={fullName}>
            <span className="row first" {...textEditProps("firstName")}><Chars text={t.firstName} /></span>
            <span className="row last" {...textEditProps("lastName")}><Chars text={t.lastName} /></span>
          </h1>
          <div className="foot">
            <Text id="heroTag" as="p" className="tag" />
            <div className="scroll ath-label"><i /> Scroll</div>
          </div>
        </section>

        {/* ================= INTRO ================= */}
        <section className="ath-intro">
          <div className="ath-wrap grid">
            <div>
              <div className="ath-label reveal" style={{ marginBottom: 28 }}>(01) — The journey</div>
              <p className="manifesto" {...textEditProps("manifesto")}>
                {t.manifesto.split(/\s+/).map((w, i) => (
                  <span className="w" key={i}>{w}</span>
                ))}
              </p>
            </div>
            <div className="side">
              <div className="portrait clip-reveal parallax">
                <div className="inner"><Media id="intro" /></div>
              </div>
              <Text id="introBody" as="p" className="body reveal" />
            </div>
          </div>
        </section>

        {/* ================= STATS ================= */}
        <section className="ath-stats" id="stats">
          <div className="ath-wrap">
            <div className="ath-label reveal" style={{ marginBottom: 20 }}>(02) — Career by the numbers</div>
            <div className="grid">
              {STATS.map((s) => (
                <div className="cell" key={s.label}>
                  <span className="line" />
                  <div className="val">
                    <span className="num" data-to={s.value}>0</span>
                    {s.suffix && <sup>{s.suffix}</sup>}
                  </div>
                  <div className="lbl">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= RECORDS ================= */}
        <section className="ath-records" id="records">
          <div className="ath-wrap">
            <div className="head">
              <SplitTitle text="Records" />
              <div className="ath-label reveal">(03) — History, rewritten</div>
            </div>
            {RECORDS.map((r, i) => (
              <article className="card" key={r.title} style={{ ["--i" as string]: i }}>
                <span className="dim" aria-hidden />
                <div className="pic"><Media id={`record${i + 1}`} /></div>
                <div className="txt">
                  <div className="yr">{r.year}</div>
                  <div>
                    <h3>{r.title}</h3>
                    <p style={{ marginTop: 14 }}>{r.body}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ================= HIGHLIGHTS ================= */}
        <section className="ath-hl">
          <div className="ath-wrap head">
            <SplitTitle text="Highlights" />
            <div className="ath-label reveal">(04) — Drag the season</div>
          </div>
          <div className="track">
            {[1, 2, 3, 4, 5].map((n) => (
              <div className="item" key={n}>
                <div className="inner"><Media id={`hl${n}`} /></div>
                <span className="cap">{String(n).padStart(2, "0")} / 05</span>
              </div>
            ))}
          </div>
        </section>

        {/* ================= PARTNERS ================= */}
        <section className="ath-partners" id="partners">
          <div className="ath-wrap head">
            <div className="ath-label reveal">(05) — Partnerships</div>
            <SplitTitle text="In good company" />
          </div>
          {[false, true].map((rev) => (
            <div className={`ath-marquee ${rev ? "rev" : ""}`} key={String(rev)}>
              {[0, 1].map((dup) => (
                <div className="run" key={dup} aria-hidden={dup === 1}>
                  {(rev ? [4, 5, 6, 1, 2, 3] : [1, 2, 3, 4, 5, 6]).map((n) => (
                    <div className="ath-logo" key={n}><Media id={`partner${n}`} /></div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </section>

        {/* ================= FOUNDATION ================= */}
        <section className="ath-found" id="foundation">
          <div className="ath-wrap grid">
            <div className="pic clip-reveal parallax">
              <div className="inner"><Media id="foundation" /></div>
            </div>
            <div>
              <div className="ath-label reveal" style={{ marginBottom: 20 }}>(06) — Giving back</div>
              <h2 className="ath-display reveal" {...textEditProps("foundationTitle")}>{t.foundationTitle}</h2>
              <Text id="foundationBody" as="p" className="reveal" />
              <a href="#contact" onClick={go("contact")} className="ath-btn magnetic reveal">Support the mission <Arrow /></a>
            </div>
          </div>
        </section>

        {/* ================= JOURNAL ================= */}
        <section className="ath-journal" id="journal">
          <div className="ath-wrap">
            <div className="head">
              <SplitTitle text="Journal" />
              <a href="#journal" onClick={(e) => e.preventDefault()} className="ath-btn ath-btn--ghost magnetic reveal">View all <Arrow /></a>
            </div>
            <div className="grid">
              {JOURNAL.map((j, i) => (
                <a className="card" href="#journal" onClick={(e) => e.preventDefault()} key={j.title}>
                  <div className="pic"><Media id={`journal${i + 1}`} /></div>
                  <div className="meta ath-label"><span>{j.tag}</span><span>{j.date}</span></div>
                  <h3>{j.title}</h3>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="ath-foot" id="contact">
          <div className="bg"><Media id="footer" /></div>
          <div className="ath-wrap cta">
            <div className="ath-label" style={{ marginBottom: 24 }}>(07) — Contact</div>
            <h2 {...textEditProps("footerCta")} aria-label={t.footerCta}>
              {t.footerCta.split(/\s+/).map((w, i) => (
                <span className="ath-mask" key={i} style={{ marginRight: "0.25em" }}>
                  <span className="wd">{w}</span>
                </span>
              ))}
            </h2>
          </div>
          <div className="ath-wrap">
            <div className="row">
              <a href="mailto:hello@example.com" className="ath-btn magnetic">Partnership inquiries <Arrow /></a>
              <div className="socials">
                {["Instagram", "TikTok", "X", "YouTube"].map((s) => (
                  <a key={s} href="#contact" onClick={(e) => e.preventDefault()} className="ath-btn ath-btn--ghost magnetic">{s}</a>
                ))}
              </div>
            </div>
            <span className="giant ath-display" aria-hidden><Chars text={t.lastName} /></span>
            <div className="legal ath-label">
              <span>© {new Date().getFullYear()} {fullName}</span>
              <span>All rights reserved</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
