# Knights of Columbus Council 6243 website

Built with Meta's [Astryx](https://astryx.atmeta.com/) design system (React + StyleX), Butter theme.
Hosted free on GitHub Pages.

## Where things live

| What | File |
|---|---|
| All wording (meetings, officers, contacts, copy) | `src/shared/content.ts` |
| Live site pages | `src/site/` |
| Design previews (Variants 1 and 3, local only) | `src/preview/`, open `/preview.html` |
| Official KofC logo, emblem, McGivney portrait | `public/kofc-official/` |
| Old URLs (`join.html` etc.) redirecting to new pages | `public/*.html` |

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173 (live site) or http://localhost:5173/preview.html (all three variants).

## Publish

`.github/workflows/pages.yml` builds and deploys the site. While the repo is private it runs only
when started by hand (Actions tab → Deploy to GitHub Pages → Run workflow), because GitHub Pages on
private repos needs a paid plan. When the repo goes public, re-enable the push trigger noted in
the workflow. One-time: **Settings → Pages → Source: GitHub Actions**.

**Custom domain (later):** create `public/CNAME` containing just the domain (e.g. `kofc6243.org`),
push, then enter the same domain under Settings → Pages and add the DNS records GitHub shows.

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
