import { CSSProperties } from "react";
import { PROJECTS } from "../content";
import { Media } from "../Editable";
import { Words } from "../bits";
import { Link, useShell } from "../shell";
import { useContent } from "../store";

const slot = (v: Record<string, number | string>) => v as CSSProperties;

export default function Case({ slug }: { slug: string }) {
  const text = useContent().text;
  const { openForm } = useShell();
  const i = Math.max(0, PROJECTS.findIndex((p) => p.slug === slug));
  const p = PROJECTS[i];
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  const title = text[`${p.key}.title`];

  return (
    <article className="cl-case">
      <header className="cl-case__top cl-grid">
        <Words as="h1" text={p.headline} />
        <dl className="cl-case__meta" data-reveal="">
          <div>
            <dt>Client</dt>
            <dd>{title}</dd>
          </div>
          <div>
            <dt>Type</dt>
            <dd>{p.type}</dd>
          </div>
          <div>
            <dt>Year</dt>
            <dd>{p.year}</dd>
          </div>
        </dl>
      </header>

      <section className="cl-media">
        <div className="cl-grid">
          <div
            className="cl-media__item"
            data-reveal="media"
            style={slot({ "--p": 2, "--w": 10, "--pt": 1, "--wt": 12, "--ar": "16 / 9" })}
          >
            <div className="cl-media__frame">
              <Media id={`${p.key}a`} eager />
            </div>
          </div>
        </div>
      </section>

      <section className="cl-case__intro cl-grid">
        <Words text={p.intro} />
        <ul data-reveal="">
          {p.roles.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      <section className="cl-media">
        <div className="cl-grid">
          <div
            className="cl-media__item"
            data-reveal="media"
            style={slot({ "--p": 2, "--w": 4, "--pt": 1, "--wt": 7, "--ar": "4 / 5" })}
          >
            <div className="cl-media__frame">
              <Media id={`${p.key}b`} />
            </div>
          </div>
          <div className="cl-case__body">
            {p.body.map((para, n) => (
              <Words key={n} text={para} />
            ))}
          </div>
        </div>
      </section>

      <footer className="cl-case__next">
        <p>Next project</p>
        <Link to={`/work/${next.slug}`}>{text[`${next.key}.title`]}</Link>
        <button type="button" className="cl-ul" onClick={openForm}>
          Start a project
        </button>
      </footer>
    </article>
  );
}
