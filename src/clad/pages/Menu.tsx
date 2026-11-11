import { STUDIO_PAGES } from "../content";
import { Link } from "../shell";

/** The index, set on black stone. Each title unfolds into a sentence on hover. */
export default function Menu() {
  return (
    <div className="cl-menupage">
      <ul className="cl-index">
        {STUDIO_PAGES.map((p) => (
          <li key={p.slug} data-in="">
            <Link to={`/${p.slug}`} aria-label={p.title}>
              {p.title}
              <span className="cl-index__more" aria-hidden>
                {p.line.slice(p.title.length)}
              </span>
              <span className="cl-index__meta" aria-hidden>
                <span>Click to explore</span>
                <span>{p.numeral}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/contact" className="cl-menupage__cta" aria-label="Contact us" data-in="">
        Contact{" "}
        <span className="cl-swap" aria-hidden>
          <span>us</span>
          <span>now</span>
        </span>
      </Link>
    </div>
  );
}
