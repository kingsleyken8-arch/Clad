import { CSSProperties, useEffect, useRef } from "react";
import { PROJECTS, Project } from "../content";
import { Media } from "../Editable";
import { IntroRow, Words } from "../bits";
import { Link } from "../shell";
import { useContent } from "../store";
import { Footer } from "../Footer";

const slot = (v: Record<string, number | string>) => v as CSSProperties;

function ProjectBlock({ project: p }: { project: Project }) {
  const text = useContent().text;
  const title = text[`${p.key}.title`];
  const { a, b, text: t } = p.layout;
  const to = `/work/${p.slug}`;

  const blurb = (
    <div
      className={`cl-media__text ${t.inline ? "" : "is-alone"}`}
      style={slot({ "--p": t.p, "--pt": t.p > 6 ? 7 : 1 })}
    >
      <Words id={`${p.key}.blurb`} />
      <Link to={to} className="cl-media__link">
        <span className="t">{title}</span>
        <span className="y">{p.year}</span>
      </Link>
    </div>
  );

  return (
    <article className="cl-project">
      <div className="cl-media">
        <div className="cl-grid">
          <div
            className="cl-media__item"
            data-reveal="media"
            style={slot({ "--p": a.p, "--w": a.w, "--pt": a.p > 3 ? 4 : 1, "--wt": 9, "--ar": "3 / 2" })}
          >
            <Link to={to} className="cl-media__frame" label={title} aria-label={title}>
              <Media id={`${p.key}a`} />
            </Link>
            <div className="cl-media__cap">
              <span>{title}</span>
              <span>
                {p.type}, {p.year}
              </span>
            </div>
          </div>
          {t.inline && blurb}
        </div>
      </div>

      {!t.inline && (
        <div className="cl-media is-textonly">
          <div className="cl-grid">{blurb}</div>
        </div>
      )}

      <div className="cl-media">
        <div className="cl-grid">
          <div
            className="cl-media__item"
            data-reveal="media"
            style={slot({ "--p": b.p, "--w": b.w, "--pt": b.p > 5 ? 6 : 1, "--wt": 7, "--ar": "4 / 5" })}
          >
            <Link to={to} className="cl-media__frame" label={title} aria-label={title} tabIndex={-1}>
              <Media id={`${p.key}b`} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const row = useRef<HTMLDivElement>(null);

  // the intro row drifts down a little as the page leaves it behind
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (row.current && y < window.innerHeight * 1.6) {
        row.current.style.transform = `translate3d(0, ${(y * 0.2).toFixed(1)}px, 0)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <section className="cl-intro">
        <IntroRow ref={row} side={<span>Scroll down</span>} />
      </section>

      <section className="cl-hero cl-grid">
        <Words id="statement" as="h1" />
      </section>

      <section className="cl-media">
        <div className="cl-grid">
          <div
            className="cl-media__item"
            data-reveal="media"
            style={slot({ "--p": 3, "--w": 8, "--pt": 1, "--wt": 12, "--ar": "16 / 9" })}
          >
            <div className="cl-media__frame">
              <Media id="reel" eager />
            </div>
          </div>
        </div>
      </section>

      <section className="cl-textblock cl-grid">
        <Words id="approachLabel" className="is-small" />
        <Words id="approach" className="is-large" />
      </section>

      <section className="cl-projects">
        {PROJECTS.map((p) => (
          <ProjectBlock key={p.slug} project={p} />
        ))}
      </section>

      <Footer />
    </>
  );
}
