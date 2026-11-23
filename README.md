# Knights of Columbus Council 6243 — website

Redesign of the Council 6243 (Our Lady of Mount Carmel, Williamsburg, Brooklyn) website,
built with Meta's [Astryx](https://astryx.atmeta.com/) design system.

- **`astryx-variants/`** — the new site. Variant 2 ("Community") is the chosen design; Variants 1
  ("Heritage") and 3 ("Bulletin") are kept as local previews for comparison.
- **Root `index.html`, `calendar.html`, … and `assets/`** — the old static site, kept for reference.

## Walk through the three designs on your computer

You need [Node.js](https://nodejs.org/) 20 or newer (the LTS download is fine).

```bash
git clone https://github.com/allmarshlabs/kofc-council-6243-website.git
cd kofc-council-6243-website/astryx-variants
npm install
npm run dev
```

Then open:

- **http://localhost:5173/preview.html** — all three designs. Use the switcher bar at the bottom
  (1 · Heritage, 2 · Community, 3 · Bulletin); it keeps you on the same page as you switch.
- **http://localhost:5173** — the live site on its own (Community design).

Pages: Home, Calendar, Become a Knight, Gallery, Contact us. To see the phone layout, narrow the
browser window or use your browser's device toolbar.

More detail (editing content, the contact form, the gallery, publishing) is in
[`astryx-variants/README.md`](astryx-variants/README.md).
