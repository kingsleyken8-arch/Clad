import { useEffect, useRef, useState } from "react";
import { PROJECTS, SOCIALS } from "./content";
import { Media, textEditProps } from "./Editable";
import { refreshCursor } from "./bits";
import { EMBED, Link, useShell } from "./shell";
import { useContent } from "./store";

/** Night garden: the way to the work, then the way to us. */
export function Footer() {
  const { email, address } = useContent().text;
  const { openForm, lenis } = useShell();
  const root = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // the flowers are only really lit where the pointer is
  useEffect(() => {
    const el = root.current!;
    const move = (e: PointerEvent) => {
      const r = bg.current!.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    el.addEventListener("pointermove", move, { passive: true });
    return () => el.removeEventListener("pointermove", move);
  }, []);

  const mail = useRef<HTMLAnchorElement>(null);
  const copy = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!navigator.clipboard) return; // plain mailto link
    e.preventDefault();
    navigator.clipboard.writeText(email).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2200);
      },
      () => {
        window.location.href = `mailto:${email}`;
      },
    );
  };
  useEffect(() => {
    if (mail.current?.matches(":hover")) refreshCursor(mail.current);
  }, [copied]);

  const toTop = () => {
    const l = lenis();
    if (l) l.scrollTo(0, { duration: 2.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="cl-foot" ref={root}>
      <div className="cl-foot__bg" ref={bg} aria-hidden>
        <div className="cl-foot__flowers">
          <Media id="footer" />
        </div>
        <div className="cl-foot__flowers cl-foot__flowers--lit">
          <Media id="footer" />
        </div>
      </div>

      <div className="cl-foot__cta">
        <Link to="/work">
          See all projects
          <sup>{String(PROJECTS.length).padStart(2, "0")}</sup>
        </Link>
      </div>

      <div className="cl-foot__contact">
        <a
          ref={mail}
          className="cl-foot__email"
          href={`mailto:${email}`}
          data-cursor-label={copied ? "Copied" : "Copy to clipboard"}
          {...textEditProps("email")}
          onClick={EMBED ? textEditProps("email").onClick : copy}
        >
          {email}
        </a>
        <p className="cl-foot__address" {...textEditProps("address")}>
          {address}
        </p>
        <div className="cl-foot__start">
          <button type="button" onClick={openForm} className="cl-dim">
            Start a project
          </button>
        </div>
        <div className="cl-foot__nets">
          {SOCIALS.map((s) => (
            <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className="cl-dim">
              {s.label}
            </a>
          ))}
          <button type="button" onClick={toTop} className="cl-dim">
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
