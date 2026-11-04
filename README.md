# Modassir Iqbal — portfolio

A hand-built static portfolio. No framework, no build step, no dependencies. Open it
and it works.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home — intro, selected work, toolbox, contact |
| `projects.html` | All four GitHub projects plus side projects |
| `certificates.html` | CBSE result, YuvaKarshan, Kolkata 10K, 100 km ride, API server |
| `projects/*.html` | One detail page per main repository |

## Preview locally

Double-click `index.html`, or serve the folder to get clean relative URLs:

```powershell
python -m http.server 8123
```

Then open <http://localhost:8123>.

## Deploy

Upload only the site itself:

- `index.html`, `projects.html`, `certificates.html`
- `projects/`
- `assets/`

Any static host works: GitHub Pages, Cloudflare Pages, Netlify, Vercel, or plain
server space. There is nothing to compile.

Do **not** upload these source/working folders:

- `.venv/` — temporary Python environment used to render PDF previews
- `Achievements/` — original certificates and screenshots
- `Context.txt` — personal source notes
- `.prep_images.py` — the script that generated the web images

## Editing

- **Colours, type, spacing:** `assets/css/style.css` (the `:root` block holds the
  palette; dark mode is the `[data-theme="dark"]` block).
- **Cards, artwork, lightbox:** `assets/css/components.css`
- **Page layouts and responsive rules:** `assets/css/pages.css`
- **Theme toggle, menu, reveals, lightbox, clock, copy-email:** `assets/js/main.js`
- **Copy:** edit the HTML directly. Each project page follows the same structure,
  so the quickest way to add one is to copy an existing page in `projects/`.

Fonts are Fraunces, Manrope, DM Mono and Caveat, loaded from Google Fonts. There
are local serif/sans fallbacks if the network is unavailable.

## Media

- Certificate previews in `assets/img/certs/` are 6 JPEGs (1800px longest edge), already generated from PDFs.
- Original PDFs are in `assets/docs/` and are linked from the certificate cards.
- Project artwork is CSS and inline SVG, not screenshots.

## Checks run

- All internal links and assets resolve.
- No console errors on any of the seven pages.
- No horizontal overflow at 320, 360, 390, 480, 600, 768, 820, 912, 1024,
  1200 or 1440 px.
- Lighthouse: 100 accessibility, 100 best practices, 100 SEO on all seven
  pages, in both light and dark themes.
- Lightbox keyboard navigation, focus return, theme persistence and mobile menu
  tested in Chromium, including short landscape viewports.
