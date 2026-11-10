import { STUDIO_PAGES } from "../content";
import { Words } from "../bits";
import { Link } from "../shell";

export default function Detail({ slug }: { slug: string }) {
  const i = Math.max(0, STUDIO_PAGES.findIndex((p) => p.slug === slug));
  const page = STUDIO_PAGES[i];
  const prev = STUDIO_PAGES[(i - 1 + STUDIO_PAGES.length) % STUDIO_PAGES.length];
  const next = STUDIO_PAGES[(i + 1) % STUDIO_PAGES.length];

  return (
    <div className="cl-detail">
      <header className="cl-detail__top">
        <h1>{page.heading}</h1>
        <p className="cl-detail__hint">Scroll down</p>
      </header>

      <div className="cl-detail__body cl-grid">
        {page.paragraphs.map((text, n) => (
          <Words key={n} text={text} className={n === 0 ? "" : "is-text"} />
        ))}
        {page.list && (
          <ul className="cl-detail__list" data-reveal="">
            {page.list.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
        <nav className="cl-detail__nav" aria-label="More about the studio">
          <Link to={`/${prev.slug}`} className="cl-ul">
            {prev.title}
          </Link>
          <Link to="/contact" className="cl-ul">
            Contact us
          </Link>
          <Link to={`/${next.slug}`} className="cl-ul">
            {next.title}
          </Link>
        </nav>
      </div>
    </div>
  );
}
