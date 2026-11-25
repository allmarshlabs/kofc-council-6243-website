# Knights of Columbus Council 6243 website

Built with Meta's [Astryx](https://astryx.atmeta.com/) design system (React + StyleX), Butter theme.
Hosted free on GitHub Pages.

## Where things live

| What | File |
|---|---|
| All wording (meetings, officers, contacts, copy) | `src/shared/content.ts` |
| Main site build pages (currently the Community design) | `src/site/` |
| All four variants side by side (local only) | `src/preview/`, open `/preview.html` |
| Variant 4 theme (Heritage on white), made with the Astryx theme editor | `themes/heritage-light/` (change it with `npx astryx experimental theme editor set heritage-light …`) |
| Official KofC logo, emblem, McGivney portrait | `public/kofc-official/` |
| Old URLs (`join.html` etc.) redirecting to new pages | `public/*.html` |

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173 (main site build) or http://localhost:5173/preview.html (all four variants).

## Publish

`.github/workflows/pages.yml` builds and deploys the site. While the repo is private it runs only
when started by hand (Actions tab → Deploy to GitHub Pages → Run workflow), because GitHub Pages on
private repos needs a paid plan. When the repo goes public, re-enable the push trigger noted in
the workflow. One-time: **Settings → Pages → Source: GitHub Actions**.

**Custom domain: `olmcknights6243.org`.** No `CNAME` file is needed (GitHub ignores it when an
Actions workflow deploys). Once the site is published:

1. At the domain registrar, add these DNS records:

   | Type  | Name / host | Value                                                                |
   | ----- | ----------- | -------------------------------------------------------------------- |
   | A     | `@`         | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (one record each) |
   | AAAA  | `@`         | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` (optional, IPv6) |
   | CNAME | `www`       | `allmarshlabs.github.io`                                             |

   Remove any default "parking" A/CNAME records the registrar added for `@` or `www`.
2. Recommended first: verify the domain for the organization (**AllMarsh Labs → Settings → Pages →
   Add a domain**). GitHub gives you a TXT record to add, which stops anyone else's repo from
   claiming the domain.
3. In this repo: **Settings → Pages → Custom domain** → `olmcknights6243.org` → Save. When the
   DNS check passes, tick **Enforce HTTPS** (the certificate can take up to an hour or so).

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
