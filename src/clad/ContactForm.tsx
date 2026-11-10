import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { WEBHOOK_URL } from "./content";
import { useContent } from "./store";

/*
 * One question at a time, in the manner of a single oversized input:
 * name → email → company → project. Enter (or "Ok") moves on; the last step
 * posts everything to the n8n webhook as JSON.
 */

type Key = "name" | "email" | "company" | "message";

const STEPS: {
  key: Key;
  label: string;
  placeholder: string;
  type: string;
  autoComplete: string;
  required: boolean;
  multiline?: boolean;
}[] = [
  { key: "name", label: "Name", placeholder: "Your name", type: "text", autoComplete: "name", required: true },
  { key: "email", label: "Email", placeholder: "Email address", type: "email", autoComplete: "email", required: true },
  { key: "company", label: "Company", placeholder: "Company (optional)", type: "text", autoComplete: "organization", required: false },
  { key: "message", label: "Project", placeholder: "About your project", type: "text", autoComplete: "off", required: true, multiline: true },
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type Enquiry = Record<Key, string> & {
  id: string;
  source: string;
  page: string;
  referrer: string;
  locale: string;
  submittedAt: string;
};

class HttpError extends Error {}

/** Resolves when the webhook has taken the enquiry; throws when it could not be delivered. */
async function deliver(url: string, data: Enquiry) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new HttpError(`Webhook answered ${res.status}`);
  } catch (err) {
    if (err instanceof HttpError) throw err;
    // The browser refused the request (CORS preflight) or could not read the
    // answer. Send it again as a plain form post, which needs no preflight.
    // The enquiry carries an id so the workflow can drop a duplicate.
    await fetch(url, { method: "POST", mode: "no-cors", body: new URLSearchParams(data) });
  }
}

export function ContactForm({ active = true, wide = false }: { active?: boolean; wide?: boolean }) {
  const { email: studioEmail } = useContent().text;
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<Key, string>>({ name: "", email: "", company: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "mail">("idle");
  const [note, setNote] = useState<{ text: string; error: boolean } | null>(null);
  const field = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const trap = useRef<HTMLInputElement>(null);
  const touched = useRef(false);

  const current = STEPS[step];
  const last = step === STEPS.length - 1;

  // move focus with the question, but never steal it on first paint
  useEffect(() => {
    if (!active || status !== "idle") return;
    if (!touched.current) return;
    field.current?.focus({ preventScroll: true });
  }, [step, active, status]);

  // an overlay form takes focus as it opens
  useEffect(() => {
    if (!active || !wide) return;
    const t = window.setTimeout(() => field.current?.focus({ preventScroll: true }), 350);
    return () => window.clearTimeout(t);
  }, [active, wide]);

  const grow = () => {
    const el = field.current;
    if (!el || !current.multiline) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };
  useEffect(grow);

  const check = (): string | null => {
    const v = values[current.key].trim();
    if (current.required && !v) return current.key === "message" ? "A line or two is plenty." : "This one is needed.";
    if (current.key === "email" && !EMAIL.test(v)) return "That email doesn't look right.";
    return null;
  };

  const submit = async () => {
    const data: Enquiry = {
      id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: values.name.trim(),
      email: values.email.trim(),
      company: values.company.trim(),
      message: values.message.trim(),
      source: "website-contact-form",
      page: window.location.href,
      referrer: document.referrer,
      locale: navigator.language,
      submittedAt: new Date().toISOString(),
    };
    // bots fill every field they find
    if (trap.current?.value) return setStatus("done");

    if (!WEBHOOK_URL) {
      // not connected yet: hand the message to the visitor's mail app so nothing is lost
      const subject = `Project enquiry — ${data.name}`;
      const body = `${data.message}\n\n${data.name}${data.company ? `, ${data.company}` : ""}\n${data.email}`;
      window.location.href = `mailto:${studioEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return setStatus("mail");
    }

    setStatus("sending");
    setNote(null);
    try {
      await deliver(WEBHOOK_URL, data);
      setStatus("done");
    } catch {
      setStatus("idle");
      setNote({ text: `That didn't go through. Try again, or write to ${studioEmail}.`, error: true });
    }
  };

  const next = (e?: FormEvent) => {
    e?.preventDefault();
    if (status === "sending") return;
    touched.current = true;
    const problem = check();
    if (problem) {
      setNote({ text: problem, error: true });
      field.current?.focus({ preventScroll: true });
      return;
    }
    setNote(null);
    if (last) void submit();
    else setStep((s) => s + 1);
  };

  const back = () => {
    touched.current = true;
    setNote(null);
    setStep((s) => Math.max(0, s - 1));
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      next();
    }
  };

  if (status === "done" || status === "mail") {
    const first = values.name.trim().split(/\s+/)[0];
    return (
      <div className={`cl-form ${wide ? "cl-form--wide" : ""}`} role="status">
        <p className="cl-form__done cl-fade">
          Thank you{first ? `, ${first}` : ""}.
          <small>
            {status === "mail"
              ? "Your mail app has opened with the message ready to send."
              : "Your message is with us. We'll be in touch shortly."}
          </small>
        </p>
      </div>
    );
  }

  const shared = {
    ref: field,
    id: `cl-f-${current.key}`,
    name: current.key,
    value: values[current.key],
    placeholder: current.placeholder,
    autoComplete: current.autoComplete,
    "aria-invalid": note?.error || undefined,
    "aria-describedby": note ? "cl-f-note" : undefined,
    disabled: status === "sending",
    onChange: (e: { target: { value: string } }) => {
      touched.current = true;
      setValues((v) => ({ ...v, [current.key]: e.target.value }));
      if (note) setNote(null);
    },
  };

  return (
    <form className={`cl-form ${wide ? "cl-form--wide" : ""}`} onSubmit={next} noValidate>
      <div className="cl-form__step">
        <span>
          {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
        </span>
        <span>{current.label}</span>
      </div>

      <div className="cl-form__row cl-fade" key={current.key}>
        <div className="cl-form__field">
          <label htmlFor={shared.id}>{current.placeholder}</label>
          {current.multiline ? (
            <textarea {...shared} rows={1} onKeyDown={onKey} onInput={grow} />
          ) : (
            <input {...shared} type={current.type} inputMode={current.key === "email" ? "email" : undefined} onKeyDown={onKey} />
          )}
        </div>
        <button type="submit" className="cl-form__ok" disabled={status === "sending"} data-cursor-label={last ? "Send it" : "Next"}>
          {status === "sending" ? "Sending" : last ? "Send" : "Ok"}
        </button>
      </div>
      <span className="cl-form__line" />

      <p id="cl-f-note" className={`cl-form__note ${note?.error ? "is-error" : ""}`} role={note?.error ? "alert" : undefined}>
        {note?.text ?? (current.multiline ? "Shift + Enter for a new line" : "")}
      </p>
      {step > 0 && status !== "sending" && (
        <button type="button" className="cl-form__back" onClick={back}>
          Back
        </button>
      )}

      {/* honeypot: hidden from people, irresistible to bots */}
      <input ref={trap} className="cl-form__hp" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden />
    </form>
  );
}
