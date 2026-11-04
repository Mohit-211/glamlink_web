# Glamlink web

The public website for Glamlink: the Journal, Magazine, Podcast, Shop, the Directory of beauty and wellness professionals, profile pages, and Access, where professionals build their digital Access card and pay for a plan. Every page reads its data from the Glamlink API (`glamlink-backend`); content is edited in the admin panel (`glamlink-admin`).

## Stack

- **Next.js 16.4.1** with the App Router and Turbopack, **React 19.3**, TypeScript 6 in strict mode, Node 24 or later (`engines` in `package.json`).
- This Next.js has breaking changes from older versions. Read the guide in `node_modules/next/dist/docs/` before changing framework code (see `AGENTS.md`).
- **Tailwind CSS 4** with the design tokens in `src/styles/globals.css`. The rules written there:
  - Components use the generated utilities (`bg-primary`, `hover:bg-secondary`, `border-border`, `bg-destructive/10` …), never raw hex, `rgb()` or Tailwind palette colours (`gray-*`, `blue-*`, `white`, `black` …).
  - Two brand teals and no others: `primary` #16818C for buttons, fills, links, labels and icons; `secondary` #117580 for hover, anything selected, focus rings, and teal text on a tint or muted surface.
  - Status colours (`destructive`, `success`, `warning`) are for feedback only, never decoration.
  - Shadows come from `shadow-soft`, `shadow-medium`, `shadow-large` and `shadow-primary`.
  - Manrope is the only typeface (loaded in `app/layout.tsx` with `next/font`).
  - Shared classes cover buttons (`.btn-primary`, `.btn-outline`), form controls, navigation, chips and the hero system.
  - `src/lib/designTokens.ts` mirrors the colours for Stripe and canvas, which can't read CSS variables. Keep it in step with `globals.css` by hand.
- **Data:** server pages read through `src/lib/api/public.ts` (fetch, cached for an hour with tags, refreshed by the API through `POST /api/revalidate`). Browser calls go through `src/api/Api.tsx` (axios). Signed-in and purchase calls wait for the session, refresh a stale token first, and retry once on a 401. Feature modules beside it (`src/api/directory.ts`) use the same exported `api` client.
- **Sign-in:** the 15-minute access token lives in memory and the API sets an httpOnly refresh cookie (`src/lib/session.ts`). The session refreshes a minute before the token runs out, and again when the tab comes back to the foreground or online, so a page left open never fails a payment or an edit.
- **Guest purchases:** a guest's draft card gets a 24-hour card token, kept in `sessionStorage` (`src/lib/cardToken.ts`). When the draft's email already has an account, the claim is also kept in `localStorage` until the token runs out, so it survives sign-in, email verification and password-reset links opened in another tab.
- **Payments:** the Stripe Payment Element (cards, Apple Pay, Google Pay, Link). Stripe.js uses the publishable key that `POST /access/checkout/:id/pay` answers, else the one `GET /payment/stripe/stripe-key` reports, so the site always follows the API's Stripe mode. A checkout in progress is kept per card in `sessionStorage`: a reload, Back or a second tab resumes it instead of starting a second payment, and the page says "paid" only when the API's checkout poll does.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:3000. API data is fetched fresh on every request. |
| `npm run build` | Production build. Fails if `NEXT_PUBLIC_SITE_URL` or `NEXT_PUBLIC_API_URL` is missing. |
| `npm start` | Serves the production build. |
| `npm run lint` | ESLint (0 errors on Oct 30; warnings are allowed). |
| `npx tsc --noEmit` | Type check (no script yet). |

There are no tests and no CI yet.

## Environment variables

Copy `.env.example` to `.env.local` and fill it in; the file explains each variable. Variables starting with `NEXT_PUBLIC_` are built into the browser bundle: anyone can read them, and changing one needs a rebuild. Never put a secret in one.

| Variable | Needed | Used for |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Always | The site's own origin: canonical URLs, Open Graph, sitemap, robots |
| `NEXT_PUBLIC_API_URL` | Always | The API base, e.g. `https://api.glamlink.net/api/v1`; its origin also serves images |
| `SITE_INDEXING` | Optional | `on` or `off`. Off, or any address other than glamlink.net, means noindex, a robots.txt that blocks everything, and an empty sitemap |
| `REVALIDATE_SECRET` | Optional | Secret for the API's cache-refresh call to `/api/revalidate`; the same value as the API's `WEBSITE_REFRESH_SECRET` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Production | Cloudflare Turnstile on sign-up; pairs with the API's `TURNSTILE_SECRET_KEY` |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Optional | Fallback only; checkout uses the key the API reports |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Optional | Address autocomplete in the card form; photos on the legacy `/journal/directory` |
| `GOOGLE_MAPS_STATIC_KEY` | Optional | The `/directory` hero's Google map (Maps Static API only); without it the hero shows its own Las Vegas map |
| `GOOGLE_MAPS_SIGNING_SECRET` | Optional | Signs that map's address (see `src/lib/directory/staticMap.ts`), so a copied key can't draw maps |
| `NEXT_PUBLIC_YOUTUBE_API_KEY` | Leave empty | Podcast fallback only; the API now serves the episodes |
| `NEXT_PUBLIC_GTM_ID` | glamlink.net only | Google Tag Manager |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | glamlink.net only | Google AdSense |

Don't set `NODE_ENV` in an env file; Next sets it. Keep server secrets (database, Firebase, OpenAI, Mailchimp, Turnstile secret) out of this repo's env files.

## Branches and environments

| Where | Branch | API | State on Nov 5 |
| --- | --- | --- | --- |
| glamlink.net and www | `main` | api.glamlink.net (from the switch) | The same code as `master` since Nov 5: `main` merged `master` and kept its files. `main`'s own Oct 15 commit "fix env" deleted `.env.example` and `public/favicon.png`, which this site uses. Until the server deploys it, glamlink.net is the old build on node.glamlink.net. `main` is GitHub's default branch. |
| test.glamlink.net | `master` | api.glamlink.net | The preview of what goes to `main` next. Search engines kept out. Until it has an API of its own, it reads and writes live data: no test purchases there. |

- Work goes to `master` first (the test site), then to `main` (`git push origin master:main`, a fast-forward). Changes the client must see first go on a `preview/*` branch and are merged into `master` once approved.
- The switch of glamlink.net: "Deploy the live site" below, and the backend's `docs/deploy.md` section 8.
- Most other remote branches are old. `origin/test_dev` holds 21 commits that are not in `master`; check them before pruning.
- Nov 1–4: the Access fixes, the one form, `/brands`, the Stripe work, profile pages, the directory, the Shop's filters and cookies, and the design pass went to test.glamlink.net on Nov 4, and go to glamlink.net with the switch (`docs/audit.md`).

## Deploy the live site

On the server, after the API has its live settings (the backend's `docs/deploy.md`, section 8):

```bash
cd /var/www/frontend/live
git status                  # Nov 5: package.json changed on the server, and an untracked file `env`
git diff package.json       # what the server changed (its port?): it is kept below
git stash
git pull                    # main
git stash pop               # stop here if it reports a conflict
npm ci
rm -rf .next/cache/fetch-cache
npm run build
pm2 reload glamlink-frontend
```

The live build reads `.env.local`: `NEXT_PUBLIC_SITE_URL=https://glamlink.net`, `NEXT_PUBLIC_API_URL=https://api.glamlink.net/api/v1`, `SITE_INDEXING=on`, `REVALIDATE_SECRET` (the API's `WEBSITE_REFRESH_SECRET`, with its `WEBSITE_REFRESH_URL` at `https://glamlink.net/api/revalidate`), the Turnstile site key, the Google Maps keys, and the GTM and AdSense IDs (`.env.example` explains each). Next reads `.env.production.local` over `.env.local`, and both over `.env.production` and `.env`: keep the values in `.env.local` only.

Going back: `git checkout 4154565` (the old site), the env file it had, `npm ci`, `npm run build`, and `pm2 reload glamlink-frontend`.

## Deploy the test site

On the server:

```bash
cd /var/www/frontend/test/glamlink_web
git pull
npm ci
rm -rf .next/cache/fetch-cache
npm run build
pm2 reload glamlink-test
```

`rm -rf .next/cache/fetch-cache` drops the API answers the site saved before the deploy. Next keeps them across builds, so without it a page can show the API's old answers for up to an hour (on Nov 4 the Shop lacked a new product tag and its Category filter until they expired).

Edits made through the API show within seconds only with the cache-refresh hook: `REVALIDATE_SECRET` in the site's `.env.local`, and the same value as the API's `WEBSITE_REFRESH_SECRET`, with its `WEBSITE_REFRESH_URL` set to `https://test.glamlink.net/api/revalidate`. Without the secret the site answers that route with 503 and shows a change only when its saved answer expires, within the hour.

The test build needs the test values listed at the end of `.env.example`: `NEXT_PUBLIC_SITE_URL=https://test.glamlink.net`, `NEXT_PUBLIC_API_URL=https://api.glamlink.net/api/v1`, `SITE_INDEXING=off`, the Turnstile site key, and empty GTM and AdSense IDs.

Deploy the API's Nov 1 changes before the website's Nov 1–2 work (the backend's `docs/deploy.md`, section 9): before them the API refuses a brand card without a title or specialties and any card without a location, and has no billing portal.

## Local development

```bash
cp .env.example .env.local   # then fill it in
npm ci
npm run dev
```

- The dev server always fetches fresh API data (`no-store` under `next dev`). A production build caches API reads for an hour and refreshes them when the API calls `/api/revalidate`.
- Use port 3000. The API's CORS allows `http://localhost:3000` (plus glamlink.net, www, test and admin) and refuses any other origin with 403, so the browser calls fail on another port such as 3100.
- Signing in on localhost against api.glamlink.net doesn't survive a reload, because the refresh cookie is cross-site there. Test sign-in on test.glamlink.net, or against a local API: the backend's `PORT` defaults to 5000, but on a Mac AirPlay Receiver holds port 5000, so set `PORT=5050` in the backend's `.env` and use `NEXT_PUBLIC_API_URL=http://localhost:5050/api/v1` (as `.env.example` says).
- The live API allows `localhost:3000` only until the switch.

## Folder map

```text
src/
  app/                 routes: pages, layout.tsx, not-found.tsx, sitemap.ts, robots.ts,
                       api/revalidate (the API's cache-refresh call), brands/ and professionals/ (the
                       full lists, with filters and sorting)
  components/          UI by area:
    home/                home page
    blogs/               the Journal (front page, article content, cards)
    magazine/, Podcast/, shop/, topics/, partner/
    profiles/            the profile page of a professional or a brand (/profiles/<slug>): hero, media
                         lightbox, sidebar; its "View all" pages and Education posts are under app/profiles/
    glamlinkDirectory/   the Directory (/directory): the hero's map of a city's professionals
                         (lib/directory/cityMap.ts), Explore Professionals (Glamlink's own, then Google's
                         listings, which their owners claim through the Access form) and Explore Brands
    glamcard/            the Access page and card form (the one way to join, for professionals and
                         brands), the preview and the public card
    Pricing/             plans and checkout (/pricing)
    Dashboard/           the owner dashboard; profile/ holds its Media & Images and Education tabs
    editor/              ArticleEditor (Tiptap, like the card's bio editor) for Education posts
    common/              header, footer, PageHero, ApiImage, ShareButton, CookieBanner
    content/             shared tiles, ListFilters (the lists' filters and sort), JsonLd, VideoPage
    ui/                  shadcn primitives (dialog, popover, select, tooltip)
  lib/                 api/public.ts (server reads), config, session, cardToken,
                       consent (the cookie choice and Google's consent mode), savedProducts,
                       indexing, routes, format, designTokens …
  api/Api.tsx          browser API client (axios); api/directory.ts, the directory's own calls
  ads/                 ad slots and hooks
  data/issues.ts       bundled magazine issues (fallback until the API serves them all)
  hooks/, types/, utils/
  styles/globals.css   design tokens and shared classes
public/                static files: magazine covers, home-hero photos, assets (82 MB, all in git)
docs/audit.md          the Oct 30 website audit, short version
```

Legacy and test code waiting to be deleted (`directoryComponent/`, `mediaKit/`, `VCGenerator/`, `promos/`, `/ad-test`, `/card`) is listed in `docs/audit.md`.

## Trackers and docs

- **Glamlink Web — Code Audit** (Claude Docs): https://claude.ai/artifact/Qnh7bXqtBNzqcSj8gye1Eg. Tabs: Tracker (status of every Oct 18 finding), Oct 30 audit (the latest audit), Glamlink Web — Code Audit (the Oct 18 record) and Cutover status (branches, the switch checklist, the change log).
- **Glamlink Backend Requests — Home Page and Pending Work**: https://claude.ai/artifact/WHStxu52YddaR7CpPZRBNg. What the website needs from the API.
- **Glamlink Web — Backend Requests**: https://claude.ai/artifact/MZbZy8Zebs8zHFTCyud4cw. The Oct 18 draft, superseded on Oct 23 by the doc above.
- **Access Card Versions**: https://claude.ai/artifact/6F1B7FrtpJ5w8GPSYkhbG8. The open decision on the card form's look.
- **`docs/audit.md`**: the Oct 30 audit in short, with finding IDs.
- The API's notes for this site: `docs/handoff/website-frontend.md` in `glamlink-backend`.
