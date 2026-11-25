# Knights of Columbus Council 6243 website

Built with Meta's [Astryx](https://astryx.atmeta.com/) design system (React + StyleX): the Heritage White design, theme `heritage-light`.
Hosted free on GitHub Pages.

## Where things live

| What | File |
|---|---|
| All wording (meetings, officers, contacts, copy) | `src/shared/content.ts` |
| Live site pages: the Heritage design (also Variants 1 and 4 in the preview) | `src/heritage/` |
| Community design (Variant 2, preview only) | `src/community/` |
| All four variants side by side (local only) | `src/preview/main.tsx` (Bulletin in `src/preview/v3/`), open `/preview.html` |
| Live site theme `heritage-light` (Heritage White), made with the Astryx theme editor | `themes/heritage-light/` (change it with `npx astryx experimental theme editor set heritage-light …`) |
| Official KofC logo, emblem, McGivney portrait | `public/kofc-official/` |
| Old URLs (`join.html` etc.) redirecting to new pages | `public/*.html` |

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173 (the live site, Heritage White) or http://localhost:5173/preview.html (all four variants).

## Publish

`.github/workflows/pages.yml` builds and publishes the site on every push to `main` (about a
minute later). To re-publish without a change: Actions tab → Deploy to GitHub Pages → Run workflow.
The repo is public, which is what makes GitHub Pages free. Pages is set to **Source: GitHub
Actions** (Settings → Pages).

**Live at https://olmcknights6243.org** (domain registered at Namecheap; `www.` and the old
`allmarshlabs.github.io/kofc-council-6243-website/` address redirect there). HTTPS is enforced; GitHub
renews the certificate automatically. No `CNAME` file is needed (GitHub ignores it when an Actions
workflow deploys); the domain is set under **Settings → Pages → Custom domain**.

DNS at Namecheap (**Domain List → Manage → Advanced DNS**) — keep these as they are:

| Type  | Host                                  | Value                                                            |
| ----- | ------------------------------------- | ---------------------------------------------------------------- |
| A     | `@`                                   | `185.199.108.153`, `.109.153`, `.110.153`, `.111.153` (4 records) |
| CNAME | `www`                                 | `allmarshlabs.github.io`                                         |
| TXT   | `_github-pages-challenge-allmarshlabs` | GitHub's verification code (keeps the domain verified for the AllMarsh Labs org, so no other GitHub account can claim it) |
| TXT   | `@`                                   | `v=spf1 include:spf.efwd.registrar-servers.com ~all` (Namecheap email forwarding, unrelated to the site) |

## Contact form (Google Forms)

The form sends answers to a Google Form owned by the council Gmail. Until it's connected,
"Send message" opens the visitor's email app addressed to the council instead.

1. Signed in as the council Gmail, create a Google Form with five **Short answer / Paragraph**
   questions: Name, Email, Phone, Topic, Message. Don't require sign-in or collect emails.
2. Responses tab → link to a Sheet; ⋮ → *Get email notifications for new responses*.
3. ⋮ → **Get pre-filled link**, type anything in every question, *Get link*, copy it.
4. In `src/shared/content.ts` → `contactForm.googleForm`, set `formId` (the long id after
   `/forms/d/e/`) and each field's `entry.NNNN` from that link.

## Gallery (Google Photos)

Google Photos has no official website embed, so the Gallery page shows featured photos stored
with the site and links to the council's shared Google Photos album for the rest.

1. **Album link:** in Google Photos (council Gmail), open the album → Share → Create link. Paste it
   into `gallery.albumUrl` in `src/shared/content.ts`. Until then, the page asks members to email photos.
2. **Featured photos:** put the files in `public/gallery/` and list each one in `gallery.photos`
   (`src`, `alt` description, optional `caption`, and a `category`: Events, Service or Parish).
   Filter tabs appear automatically once photos span more than one category.
