# Veya Studio

A one-page site for an AI video agency. Plain HTML, CSS and JavaScript, with no build step: open `index.html` or serve the folder with any static host.

## Editing

| What | Where |
| --- | --- |
| All text, names, prices, numbers | `index.html` |
| The studio name | Search `index.html` for `VEYA` and `Veya` |
| Colours, fonts, spacing | The variables at the top of `styles.css` (`--red` is the accent) |
| Pricing plans and what each includes | The `plans` object in `script.js` |
| Add-on prices | The `value` on each checkbox in the pricing section of `index.html` |
| Where enquiries are sent | `FORM_ENDPOINT` at the top of `script.js` (empty until you add a form or webhook URL) |
| The showreel | Replace `assets/reel.mp4` and `assets/img/reel.jpg` |

## Images

Everything in `assets/img` was generated with Higgsfield. Replace a file and keep its name, and the page picks it up.

| Files | Used for |
| --- | --- |
| `h1` to `h4` | Hero slideshow |
| `t1` to `t4` | Founder and team portraits |
| `mc`, `m1` to `m8` | The wall of work that opens out of one image |
| `s1` to `s4` | Services |
| `p1` to `p4` | Process panels |
| `c1` to `c3` | Client stories |
| `j1` to `j4` | Journal |
| `hire`, `reel` | Hiring block, showreel poster |

## Placeholders to replace before launch

The studio name, the people and their portraits, the client names and quotes, every figure (films delivered, watch time, prices, results), the phone number and the email address are all stand-ins.
