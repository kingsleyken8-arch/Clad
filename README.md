# Clad — studio site

A studio website built with **Vite + React + TypeScript**, a small amount of
raw **WebGL**, **GSAP** and **Lenis**.

**Live:** https://kingsleyken8-arch.github.io/Clad/

## What's in it

- **Preloader** — mark, baseline and a counter that follows the real load,
  then the paper lifts to reveal the wall.
- **Plaster wall** — one continuous sculpted frieze behind every page. It
  stays flat until the pointer (or, when idle, a slow wanderer) presses on it,
  then the carving swells out of the wall and sinks back. `src/clad/gl/plaster.ts`
- **Night wall** — the menu, studio and contact pages sit on the same carving
  in black stone; light breaks through in slivers under the pointer.
- **Page transitions** — a ragged, smoke-edged front sweeps out from wherever
  you clicked and the next page is underneath. `src/clad/gl/wipe.ts`
- **Pages** — home, index (menu), five studio pages, contact, project list
  with category filter, and a page per project.
- **Contact form** — one question at a time; posts JSON to an n8n webhook.
- **Editor** at `#/studio` — swap any image or video, edit copy, and preview
  desktop / tablet / mobile side by side.

## Changing content

Everything editable lives in **`src/clad/content.ts`**: studio name, copy,
projects, studio pages, footer links and the default images
(`public/clad/media/`).

For quick visual edits open **`#/studio`**, click any image or text and change
it in the right-hand panel. Edits are saved in your browser; use
**Export / Import** to move them, or copy the values into `content.ts` to make
them permanent for every visitor.

## Connecting the form to n8n

1. In n8n add a **Webhook** node, method `POST`, and copy its **Production URL**.
2. In this repo go to **Settings → Secrets and variables → Actions →
   Variables** and add `N8N_WEBHOOK_URL` with that URL. The next deploy picks
   it up. (Locally: put `VITE_N8N_WEBHOOK_URL=…` in a `.env` file.)

Each submission arrives as:

```json
{
  "id": "unique per submission — use it to drop duplicates",
  "name": "…", "email": "…", "company": "…", "message": "…",
  "source": "website-contact-form",
  "page": "URL the form was sent from",
  "referrer": "…", "locale": "en-GB",
  "submittedAt": "2026-01-01T12:00:00.000Z"
}
```

Until a URL is set, the form opens the visitor's mail app with the message
filled in, so nothing is lost. Spam bots are caught by a hidden field and
never reach the webhook.

## Routes

| Address | Page |
| --- | --- |
| `/` | Home |
| `#/menu` | Index |
| `#/about` `#/approach` `#/services` `#/process` `#/clients` | Studio pages |
| `#/contact` | Contact + form |
| `#/work`, `#/work/<slug>` | Project list, project page |
| `#/studio` | Visual editor |
| `#/lost`, `#/vangogh` | Earlier standalone hero pieces |

## Run and build

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
```

Pushing to `claude/website-from-design-xk24op` rebuilds and publishes the live
site through `.github/workflows/deploy.yml`.

Type is set in Tinos (self-hosted) with Helvetica Neue for interface text.
Wall, relief and project imagery were generated with Higgsfield and can be
replaced from the editor or in `public/clad/`.
