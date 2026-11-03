# Glamlink web audit, 30 Oct 2026

Short in-repo copy of the website audit. The full version, with every page rating and the tracker of the Oct 18 findings, is the **Oct 30 audit** tab of the Claude Docs doc "Glamlink Web — Code Audit": https://claude.ai/artifact/Qnh7bXqtBNzqcSj8gye1Eg

## Summary

Two problems need fixing now. A signed-in professional who creates a card cannot choose a plan (W-ACC-1), and a public Access card page downloads 64.6 MB of images (X1). The rest is SEO metadata, leftover test pages, two dead-end journeys, the card bio rendered as raw HTML, and test data on public pages.

| Report | P0 | P1 | P2 | P3 |
| --- | --- | --- | --- | --- |
| Code (W-01 to W-48) | 0 | 13 | 24 | 11 |
| Visual review (per page, X1 to X14) | 1 | 13 | 33 | 25 |
| Website and API contract | 1 | 5 | 9 | 15 |

The visual review overlaps the code audit on SEO and dead routes.

- **Scope:** branch `preview/journal-and-heroes` at `5a10841` (Oct 29, local only), two commits ahead of `master` `191e275`, which test.glamlink.net runs on the new API. glamlink.net still serves the old build from `main` on the old API.
- **Checks (read-only):** an import graph of the 269 files in `src/`, `tsc` (0 errors), ESLint (0 errors, 259 warnings), a visual pass over 58 URLs at 1440 and 390 px against the live API (127 captures, 349 links), and all 98 website API calls matched to backend routes, with live GETs.
- **Severity:** P0 breaks a page or a feature, or leaks data; P1 fix before the switch; P2 medium; P3 low. **Effort:** S under half a day, M up to two days, L more.
- **Waiting on a decision:** approval of the preview (heroes, Journal), the brand directory layout (W-06), the Access card form look (https://claude.ai/artifact/6F1B7FrtpJ5w8GPSYkhbG8), and whether `/for-clients` and `/for-professionals` stay (W-29).

## The Shop's filters, saved products, cookies and the Google map (Nov 3, not deployed)

The owner's second request of Nov 3, on `master` (Nov 4). It reads the backend's shop additions (backend `docs/handoff/website-frontend.md`: GET /discover/shop `sort`, `min_price`, `max_price`, `ids`, and `price` on its filters), so the API deploys first: before it, the sort and price filter are ignored and the Saved list shows only the saved products on the shop's first page.

| Part | What |
| --- | --- |
| Shop | Search, category chips, Saved, then Brand, Price (Under $50, $50 to $100, $100 to $150, $150 and up; only the bands some product falls in) and Sort (Featured, Newest, Price both ways, Name). The Saved list (`/shop?saved=1`) opens in the order things were saved |
| Saving | A heart on every product tile and Save on the product page (`shop/SaveProductButton.tsx`). The ids sit in the `glamlink_saved` cookie (at most 50, most recent first), written only after Accept all; the Shop reads it on the server for its Saved list |
| Cookie banner | `common/CookieBanner.tsx`: Accept all or Reject, on every page until the visitor picks; again from the footer's Cookie settings or a Save without consent (which then goes through on Accept). The choice is the `glamlink_consent` cookie (half a year). Reject deletes the saved products |
| Analytics and ads | Google's consent mode (`lib/consent.ts`, run in `<head>` before Tag Manager): Analytics and ad cookies stay off until Accept all, and AdSense shows non-personalized ads. Accept and Reject apply without a reload |
| Directory map | Google's Static Maps terrain image when `GOOGLE_MAPS_STATIC_KEY` is set (one billed load per view, the cheapest of Google's maps), the USGS still otherwise. With `GOOGLE_MAPS_SIGNING_SECRET` the address is signed (`lib/directory/staticMap.ts`, checked against Google's published example). The count moved under the map, so nothing covers Google's logo and attribution |
| Home | The topic row shows the featured topics first, then the other active ones, up to six (only one of six was featured, so the row showed one) |

The flow was clicked through in headless Chrome over http: the banner on a first visit, a Save before choosing, Accept (the save goes through), a second save, a reload, unsave, Cookie settings, Reject (saves deleted, ads non-personalized), a Save after Reject. No errors.

The whole site now keeps to `globals.css` (Nov 4, at the owner's request; 300 files checked by script): no palette or raw colours, only its shadows (soft, medium, large), the type scale or its classes (`eyebrow`) instead of pixel sizes (11 px labels became `eyebrow`; 10 px became 12, 13 became 14, 15 became 16), scale values for letter-spacing, line height and corners, `btn-primary` for teal buttons, and the secondary teal for hover states and focus rings. The only colours outside the tokens are on purpose: Google's own colours in "Powered by Google", the colour each owner picks for their Access card, and `lib/designTokens.ts`, the tokens as hex for Stripe's form, charts and canvas (checked: all eleven match). Every hero title is now one colour, the foreground, with no teal last word.

## The directory, Professionals and Brands (Nov 3, not deployed)

The owner's layout of Nov 3, on `master` (Nov 4). It reads the backend's Nov 3 additions (backend `docs/handoff/website-frontend.md`: GET /profiles filters and sort, GET /directory/filters, GET /directory/map). Against today's live API it still renders: the map shows without pins, the lists keep their old order and the filters hide. Checks: `tsc` 0 errors outside stale `.next` files; ESLint 0 errors; the three routes server-rendered with mock data (new and old API) at 390, 1024, 1280 and 1440 px, no sideways scroll.

| Part | What |
| --- | --- |
| Hero | The search beside a terrain map of Las Vegas (a still from USGS The National Map, public domain, in `public/directory/`), a photo pin per Glamlink professional there (`lib/directory/cityMap.ts` places them with the image's own Web Mercator box). Pins close enough to overlap become one with a count, which lists them. Links to the city's professionals and the other cities'. The group photo (`public/home-hero/directory-hero.png`) is no longer used |
| Explore Professionals | Glamlink's professionals (featured first, 8, or the nearest after a search), then 15 Google listings around Las Vegas before any search (fetched on the server, cached an hour here and six hours by the API), the search's after one. "Explore all professionals" goes to `/professionals` |
| Explore Brands | 6 brands, featured first, and "Explore all brands"; an invitation while there are none |
| `/professionals` | Every professional with a page: search, specialty, state, city (the state's), sort by recommended, nearest to me (the browser's location, rounded to about a kilometre), newest or name; 24 a page |
| `/brands` | Category chips (only categories some brand has), shipping, sort by recommended, newest or name |

Also fixed: a Google listing's card named every result "Esthetician" when no type was searched; it now shows the searched type, else Google's own ("Hair salon"). The page's hero and sections are now in its HTML: the whole page used to wait for the browser because it read the URL; now only a search in the URL does.

## Profile pages in the owner's design (Nov 3, not deployed)

The owner's Epicutis mockup, for brands and professionals alike, without tabs, reviews, the verified badge or Follow. On `master` (Nov 4); it reads the backend's Nov 3 fields and endpoints (backend `docs/handoff/website-frontend.md`, section 10.6.1), so the API's migrations run first. Against today's live API the page still renders: new fields are optional, and new endpoints answering 404 read as empty. Checks: `tsc` 0 errors outside stale `.next` files; ESLint 0 errors, no warnings in the new files; the routes server-rendered with mock data at 1440 and 390 px, no sideways scroll.

| Part | What |
| --- | --- |
| `/profiles/<slug>` | A cover hero (name, tagline, intro, Visit Website); the logo row (category line, website and social links with TikTok, location, Share); Media & Images (5, lightbox for photos, MP4s, YouTube and Vimeo), About (Read more, an about image), Featured Products (carousel), Education (3); a sidebar with Quick Info (category, shipping, education, The Beauty Vault, the Journal), Visit Website, Contact (email, and the phone when the card shows it), View Access card, Book, one podcast episode, one Journal article, the magazine and other videos. Empty sections hide; "View all" shows when there is more (`components/profiles/`) |
| View-all pages | `/profiles/<slug>/media` (24 a page), `/education`, `/podcast` (the Beauty Vault's series), beside `products`, `articles` ("In the Glamlink Journal"), `videos` and `magazine`, paged |
| Education posts | `/profiles/<slug>/education/<post>`: the article (through DOMPurify) or the video, the owner's card, its own title, canonical link and JSON-LD |
| Share and analytics | `common/ShareButton.tsx` (share sheet, else copy; the Journal's and the shop's share buttons use it); page events `SHARE_CLICK`, `MEDIA_CLICK`, `EDUCATION_CLICK`, `PODCAST_CLICK`, `JOURNAL_CLICK` |
| Dashboard | My Page: Intro, Category (a brand category, or a specialty), Shipping, About image. New tabs Media & Images (unlimited photos sent 20 a request, MP4s with a poster made in the browser, YouTube or Vimeo links, captions and alt text, reorder, delete, import the card's photos) and Education (video and blog posts, `editor/ArticleEditor.tsx`, drafts, reorder). `?tab=media` and `?tab=education` work |

Also on Nov 3: Journal authors show their photo (`blogs/AuthorAvatar.tsx`, on the article page and the topic pages' cards) where the site showed their initial, which stays when there is no photo. The admin panel now crops author photos round.

UI-38 stays open: whether `/profiles/imageskincare` reads as a brand, and shows the shop's IMAGE products, depends on its account type and on linking those products to it, both data fixes.

## Fixed since the audit (Nov 1–2, not deployed)

The owner's decisions of Nov 1 (Access fixes, one form, brands, Stripe), on `master` (Nov 4). They rely on the backend's Nov 1 changes, which deploy first (backend `docs/progress.md`). Checks: `tsc` 0 errors outside stale `.next` files, ESLint 0 errors and 256 warnings. WS-n are the website items of the Nov 1 Stripe review.

| ID | How |
| --- | --- |
| W-ACC-1 | A signed-in create reads `business_card_id ?? id`, else goes to `/dashboard` (`GlamCardForm.tsx`); the API now answers `business_card_id` too |
| W-ACC-2 | The session refreshes a minute before the token runs out, and on focus or back online (`lib/session.ts`); signed-in and purchase calls wait for the session and retry once on a 401 (`api/Api.tsx`) |
| W-ACC-3 | In the API: an app account's email counts as new, and the purchase converts the account. `Login.tsx` keeps a stopgap: an app account sent to claim a draft can give the draft another email |
| W-ACC-4 | Plans load once the session is known, and again on sign-in or sign-out (`Pricing/plans.ts`) |
| W-ACC-5 | "Paid" and "live" only when the checkout poll says `paid`, else "Payment processing" with Check again (`Pricing1.tsx`, `Pricing/checkout.ts`) |
| W-ACC-7 | In the API: analytics are Pro's (403 `UPGRADE_REQUIRED`); the dashboard shows the upgrade state |
| W-ACC-9 | Orders newest first, tagged Cancelled, Refunded or Payment failed (`Myaccesscard.tsx`) |
| W-ACC-10 | Payment history maps `REJECTED` (Declined), `CANCELLED` and `REFUNDED` (`PaymentHistory.tsx`) |
| W-ACC-11 (part) | An address edit's error is worded like the add's (`AddressTab.tsx`); `is_default` and the coordinates sent stay |
| W-ACC-12 (API only) | `GET /access/plans` answers `entitlements`; the form still hard-codes 4 photos and 1 video |
| W-06 | `/brands` (search, paging) from `GET /profiles?type=brand`; "Browse Brands", "View all brands" and `/industry` lead there; the directory's nearby search asks for professionals only (`api/directory.ts`, `type=individual`) |
| W-31 | The `/access` JSON-LD serves the United States |
| W-24 (part) | `/access` no longer nests a second `<main>`, and `/brands` has none |
| Directory form | Retired: `app/directory-form-apply/` and `components/directoryForm/` deleted, `/directory-form-apply` redirects to `/access` (308, `?claim=` kept; `next.config.ts`). "Claim This Profile" opens `/access?claim=<place id>`, which fills empty fields from the Google listing; an admin verifies the claim. The form's parts of W-02, W-25 and W-28 go with it |
| WS-2, WS-10 | The checkout being paid is kept per card in `sessionStorage` and resumed after a reload, Back or a second tab; `CHECKOUT_IN_PROGRESS` is followed, and `{ paid: true }` from `/pay` goes straight to done |
| WS-3, WS-23 (part) | `/pricing` is a server page with `noindex`; without a valid card id an owner goes on with their card and a visitor is sent to make one (`PricingEntry.tsx`). The sitemap and `robots.txt` are unchanged |
| WS-4, WS-18 | Stripe.js loads with the key `/pay` answered and never keeps a failed load (`lib/stripe.ts`); a Payment Element that fails says so and logs why |
| WS-5 | Back from a bank's page (3-D Secure), the payment is read from Stripe, then settled with the poll |
| WS-6 | A claim survives sign-in, email verification and reset links (`localStorage` until the card token runs out: `lib/cardToken.ts`, `lib/auth.ts`) |
| WS-7 | `/dashboard?tab=` works while the dashboard is open |
| WS-8 | Past due: "Payment failed: update your card", and "Manage billing" opens Stripe's billing portal |
| WS-9 | The keychain offer no longer says "Shipping and tax included"; "Run special offers" left the plan copy (API) |
| WS-11 | A claim the API refuses ends on a clear page instead of the plans |
| WS-14 | Apt/Suite is always sent on an address edit, so it can be cleared |
| WS-17, WS-20, WS-26 | Purchase errors worded for people (`Pricing/messages.ts`); the done page links to the live card; an owner with no card is told to make one |
| WS-22 (part), WS-24 | The Payment Element is prefilled with the email; `AccessPricingSection/`, `Pricing/PlanPrice.tsx` and the offer fields deleted |

Also from the owner (Nov 1): "I am a…" Professional or Brand on the Access form (brand labels; title, specialties and booking optional for brands), optional locations, "The Benefits of an Access Profile" on `/access`, the demo map on Las Vegas, and plan cards that say "Everything in <previous plan>, plus:".

## Fix these first

In the agreed order. Items 1 to 3 are small and can go this week.

1. **W-ACC-1 (P0).** A signed-in professional who creates a card lands on `/pricing?businessCardId=undefined`, and choosing a plan answers 404; the same after "Replace it" on a card that already exists. `GlamCardForm.tsx:336-337`; the API answers the new card as `data.id`. Fix: read `data.business_card_id ?? data.id` (S).
2. **X2 (P1).** Test and joke data on public pages: "This is testing the dashboard" on `/profiles/melanie-marks`; a test account is the only Plastic Surgery expert; a dog profile ("Olivia Marks – Professional Bernedoodle") is featured in the directory with what looks like a street address; the handles melaniemarks and oliviamarks are duplicated. Fix in admin, plus a hidden or test flag that keeps profiles out of featured lists and topics (S).
3. **X1 (P0 on the Access card).** Images load at original size: `/access/melanie-marks` 64.6 MB, a topic page 26.7 MB, `/magazine` 24 MB, every Journal page about 10 MB. Fix: one image helper using the API's `?w=` resize with `next/image` `sizes`, covers as WebP of about 200 KB, `hqdefault` YouTube thumbnails (M).
4. **W-12 (P1).** The legacy `/journal/directory` is live and linked from every topic page (`topics/[id]/page.tsx:439, 528`). It hard-codes Las Vegas and makes one billable Google call per provider from the browser (`DirectoryPage.tsx:77-94`). Fix: 308 it to `/directory`, change the two links, delete `components/directoryComponent/`; then the backend retires its legacy Google routes (SEC-04) (S).
5. **SEO and hygiene (P1, about a day).** W-01, W-02, W-03, W-05, W-11, `/watch` folded into `/podcast`, W-34, W-39. See below.
6. **Safety (P1 and P2, about a day).** W-07, W-13 with W-23, W-14, W-15, W-16, W-17, W-35, vCard escaping. See Security.
7. **Journeys (P1 and P2, 1 to 2 days).** W-09, W-10, X3, W-ACC-2, W-28 (including the directory application's consent links), and `/for-clients` and `/for-professionals` (rewrite or remove). See below.
8. **The switch (S10).** Once the client approves the preview: merge it into `master`, back up the database, deploy glamlink.net with the production env, redirect `www`, fix the favicon (404 live), run `npm run magazine:covers` on the API, then take `localhost` out of the API's `ACCESSDOMAINS`. Checklist: the Cutover status tab of the doc.

## Security

No tokens or secrets leak from the site. The weak spots are the card bio, two sanitisers, missing headers and personal data in logs.

- **W-07 (P1) card bio as raw HTML.** `GlamCardLivePreview.tsx:849-857` and `Myaccesscard.tsx:215` use `dangerouslySetInnerHTML` without sanitising. The API cleans bios on save (backend `d0dca4f`); sanitise on render too, with one DOMPurify helper.
- **W-07 bypassable sanitiser.** The profile "about" goes through a regex (`lib/safeHtml.ts:12`) that lets `<img/src=x/onerror=…>` through. Replace it with the same helper.
- **W-35 (P2) no security headers.** `next.config.ts:50-58` adds only `X-Robots-Tag` on test builds; live glamlink.net sends `x-powered-by: Next.js` and no CSP, HSTS or X-Frame-Options. Add a baseline set (CSP as Report-Only first) and `poweredByHeader: false`.
- **W-15 (P2) open redirect after sign-in.** `safeNextPath` (`lib/auth.ts:14-15`) accepts `/\evil.example`. Compare origins with `new URL()`.
- **W-16 (P2) JSON-LD not escaped.** `journal/[id]/[title]/page.tsx:257-273` and `topics/[id]/page.tsx:223-227` inject API text through `next/script`. Use `components/content/JsonLd.tsx`.
- **W-14 (P2) personal data in logs.** The whole card with email and phone (`access/[slug]/page.tsx:67-71`) and full topic rows (`topics/[id]/page.tsx:172, 174`). Remove them; add a `no-console` lint rule.
- **vCard fields not escaped.** `GlamCardLivePreview.tsx:105-120`, also `card/[username]/page.tsx:94`. Open since Oct 18.
- **W-17 (P2) tab-nabbing.** `window.open(product.link, "_blank")` in `JournalShopCard.tsx:98`; pass `"noopener,noreferrer"`.
- **W-30 (P2) env files.** The local `.env` holds server secrets the site never uses and sets `NODE_ENV`; remove them and rotate any that were shared. Restrict the Maps and YouTube browser keys by referrer.

## SEO and routing

- **W-01 (P1)** `layout.tsx:101-103` sets the home page as canonical, and 20 of 43 pages inherit it (`/podcast`, `/access`, `/pricing`, `/contact-us`, `/privacy`, `/terms` …). Remove it and set one per page with a `pageMetadata()` helper.
- **W-02 (P1)** `/podcast`, `/access`, `/contact-us`, `/privacy`, `/terms`, `/csam-policy` and `/directory-form-apply` have no metadata; `/dashboard`, `/login`, `/register`, `/forgot-password` and `/pricing` can be indexed.
- **W-03 (P1)** share images that 404: `/oglayout.png` (`layout.tsx:76, 92`; the file is `/assets/oglayout.png`), `/apple-touch-icon.png` (`layout.tsx:98`), `/default-blog.jpg` (`journal/[id]/[title]/page.tsx:95`).
- **W-04 (P1)** the Access card, `/directory`, `/topics` and every article body (`ArticleContent.tsx:142-154`) render only in the browser.
- **W-05 (P1)** test routes public: `/vc-generator`, `/vc-generator-qr`, `/card/[username]`, `/ad-test`, `/promos`; three are in the sitemap (`sitemap.ts:29-51`).
- **W-11 (P1)** `/partner-with-glamlink` duplicates `/partner`; its canonical and "Get Featured" both point at 404s. 308 it to `/partner`.
- **W-29, W-34 (P2)** the sitemap reads `src/app` at runtime and lists every folder, including orphans and `/digital` pages with no flipbook. Make it an explicit list.
- **W-32 (P2)** `/podcast/<unknown>` and `/access/<unknown>` answer 200 (soft 404s).
- **Smaller:** W-31 the Access JSON-LD says "United Kingdom"; W-39 "| Glamlink" twice in 6 titles; W-47 `robots.txt` allows `/dashboard`, `/api/`, `/pricing`, `/search`; `/watch` is linked from nowhere.

## Broken journeys

- **W-ACC-1 (P0)** see Fix these first.
- **W-ACC-2 (P1)** after about 14 idle minutes, owner calls go out without a token and fail with "Please sign in" or "This purchase has timed out" (`api/Api.tsx:35-44, 53-66`). Refresh before calls while signed in; retry once on the 401 codes.
- **W-ACC-3 (P1)** a guest whose email has an app account can't buy (website sign-in refuses app accounts; purchases answer `ACCOUNT_EXISTS`). Needs a backend claim path (M).
- **W-06 (P1)** "Browse Brands", "View all brands" and `/industry` go to `/directory`, which only lists professionals. Waits on the owner's layout.
- **W-09 (P1)** the Magazine hero's Subscribe opens Mailchimp and stores nothing (`MagazineHero.tsx:10-13`).
- **W-10 (P1)** podcast episodes are `div onClick`, not links (`PodcastPage.tsx:173-178`).
- **W-13 (P1)** the card page crashes on a null `business_hour` (`GlamCardLivePreview.tsx:1059-1061`); no `error.tsx` (W-23).
- **W-18 (P2)** `GO_tO_BOOKING_LINK` against `GO_TO_BOOKING_LINK`, `isPrimary` against `is_primary`, and "Copy link" copies the QR image URL.
- **W-ACC-5 (P2)** the page says the card is live while the checkout is still pending (`Pricing1.tsx:846-853`).
- **W-28, W-29 (P2)** dead buttons on `/for-professionals` and `/for-clients`, `#` links for the directory application's terms (`directoryForm.tsx:1229-1230`) and the footer social icons (`Footer.tsx:37-43`); unverifiable claims on `/for-professionals`.
- **Also (P2):** W-20 article rail ads over the text (`journal/[id]/[title]/page.tsx:281, 284`); W-21 the same hard-coded people on every topic page; W-19 `ScrollToTop` breaks `#` links; the podcast's Upcoming Schedule shows past dates.

## Accessibility

- **X3 (P1)** the newsletter popup opens 3 s after landing, has no dialog role, keeps focus behind it, ignores Esc, and its backdrop closes it only once the form is valid (`NewsletterPopup.tsx:97-118`). Use `components/ui/dialog.tsx`.
- **W-26, X4 (P2)** no modal moves or traps focus.
- **W-25 (P2)** 55 inputs without a programmatic label (16 in the Access builder, 18 in the directory application); icon-only buttons without a name.
- **W-27 (P2)** 28 `div onClick` handlers. **W-24 (P2)** 11 nested `<main>`, no skip link. **W-41 (P3)** no `h1` on `/access/<slug>` or filtered Shop views.
- **P3:** mobile menu without Esc or scroll lock (X9), mixed focus styles (X10), tap targets under 24 px (X11), hero text over photos at 1024 px (X8). Contrast passes: #16818C on the page is about 4.6:1.

## Performance and images

| Page | Images loaded | Largest file |
| --- | --- | --- |
| `/access/melanie-marks` | 64.6 MB | profile PNG, 38.7 MB |
| `/topics/plastic-surgery` | 26.7 MB | article JPG, 16.2 MB |
| `/journal/directory` | 25.6 MB | profile JPG, 4.8 MB |
| `/magazine` | 24.1 MB | `issue116.png`, 3.5 MB |
| an article (`/journal/94/…`) | 15.8 MB | inline JPG, 12.3 MB |
| `/partner` | 12.6 MB | `podcastcover.png`, 5.8 MB |
| `/journal` (every view) | about 10.4 MB | sidebar covers, 2.9 to 3.5 MB |
| `/podcast` | 5.8 MB | 37 YouTube `maxresdefault` thumbnails |

Measured at 1440 px against the live API; the 36 MB `/access` video is not counted. The API already resizes (`?w=400` returns a 5 KB WebP instead of a 178 KB PNG).

- **W-08 (P1)** `/partner` loads about 12 MB of raw `<img>` (`PartnerHero.tsx:48-63`).
- **W-33 (P2)** the `/access` hero autoplays a 36 MB MP4 (`GlamCardHero.tsx:64-67`); demo images are fetched across origins on every visit.
- **Preview hero PNGs:** seven files in `public/home-hero/`, 1.7 to 2.3 MB each; re-encode before merging.
- **W-22 (P2)** topic pages, Access metadata and the sitemap fallback use axios on the server and skip Next's cache.
- **X7 (P2)** CLS 0.68 on `/directory?location=…`, 0.54 on `/journal/directory`.
- **P3:** deprecated `priority` (W-38), a refresh POST on every anonymous page load (W-46). `public/` is 82 MB and `.git` 256 MB.

## Design system

Colours follow `globals.css`: no palette classes and Manrope only. Drift (W-40, P3): 96 non-token shadows (`.btn-primary` itself uses `shadow-lg`), 202 arbitrary px font sizes, animation classes that do nothing without `tw-animate-css`, 13 v3 `bg-gradient-to-*`, and 47 `[var(--card-accent)]` classes that want a theme colour. Older pages (`/for-professionals`, `/for-clients`, the directory application, the legacy directory) look like another product (X13), and eight places keep the old text-only hero.

## Dead code and structure

- **Unused:** `components/SuccessModal.tsx`. Only test or legacy pages use the VC generators, `/card`, `/ad-test` with the GAM slots, `directoryComponent/` (7 files), `promos/`, `mediaKit/` (keep `FeatureFormModal`) and `AccessPricingSection` with `PlanPrice`. `data/issues.ts` can go once the API serves every issue.
- **Leftovers:** 10 unused exports (e.g. `getCategories`, `getTypeBlogs`, `getBlogsByCategoryId` in `api/Api.tsx:74-100`), 14 commented-out JSX blocks, 39 unused variables. Every npm package is used.
- **Built twice:** two directories, two partner pages, two API layers (`src/api/Api.tsx` and `src/lib/api/public.ts`, W-37), three article cards, `JournalShopCard` beside `ProductTile` (W-36), hand-rolled modals beside `ui/dialog`, five subscribe forms.
- **Naming and placement:** mixed folder casing, file names like `Myaccesscard.tsx` and `Pricing1.tsx`, `glamcard/` for Access and `blogs/` for the Journal, `topicFallbackContent.ts` under `app/access/`, `lib/` importing from `components/`, a circular import through the card preview, `GlamCardLivePreview.tsx` at 1,616 lines.

Target structure, one area at a time (delete first, then `git mv` one feature per PR; `lib/` never imports from `components/` or `features/`):

```text
src/
  app/          routes only: thin pages that load data and export metadata
  features/     access, journal, topics, magazine, video, shop, directory,
                profiles, dashboard, auth, partner, newsletter, ads
  components/   layout/, content/, ui/, icons/
  lib/          api/ (public.ts, client.ts), session/, config, routes, format, indexing, safe-html
  hooks/        generic hooks only
  styles/globals.css
```

## Contract mismatches with the API

All 98 website calls reach an existing route with the right method; none goes to the old API. CORS allows glamlink.net, www, test, admin and `localhost:3000` only.

| ID | Sev | What breaks | Fix (side) |
| --- | --- | --- | --- |
| W-ACC-1 | P0 | Signed-in card creation sends `businessCardId=undefined` to `/pricing` | Website (S) |
| W-1 | P1 | Public `GET /journal/topic/:id` returns featured pros' whole card (hidden phone, plan, subscription status) | Backend: allow-list fields (S) |
| A-CNT-3 | P1 | Topic pages can show draft articles, products and paragraphs | Backend: published only (S) |
| W-ACC-2 | P1 | Owner calls lose the token after ~14 idle minutes | Website (S) |
| W-ACC-3 | P1 | A guest with an app account can't buy | Backend (M) |
| X-1 | P1 | Contact Us messages (also account deletion requests) are never emailed or shown | Backend and admin (M) |
| W-2 | P2 | `/journal/directory`: Las Vegas-only search, one details call per place | Website and backend (S) |
| W-3 | P2 | `/for-professionals` reads fields the API never sends | Decide with W-29 (S) |
| W-4, W-5 | P2 | Directory listings: not shown on profiles; owners can't edit them (`/my/directory`) | Website (M) |
| W-ACC-4 to W-ACC-8 | P2 | Plans load before the session; "paid" shown too early; 4th Instagram dropped; Free owners get analytics from the API; analytics days in UTC | Website and backend |

P3 (15 rows): W-6 to W-14, W-ACC-9 to W-ACC-12, X-2, X-3. X-4: the live API is in Stripe test mode (`pk_test`); switch both keys at launch.

## Page ratings

Eleven of 38 rated pages or groups score 1 or 2: the unknown Access card (no 404), `/for-professionals`, `/promos` and the dev and test pages (1); the legacy journal directory, a magazine issue, the Access card itself (64.6 MB), `/for-clients`, `/partner-with-glamlink`, the Plastic Surgery topic and the directory application (2). The pages in the main navigation score 3 or 4, and the 404 page and the `/watch` → `/podcast` redirect score 5. The full table is in the doc.

## In good shape

- One consistent product across Home, Journal, Magazine, Podcast, Shop, Directory, Access, Pricing, sign-in and the 404 page.
- A cached, tagged server data layer (`lib/api/public.ts`) refreshed by the API's webhook (`/api/revalidate`, `timingSafeEqual`), always fresh in dev.
- The editorial Journal front page; articles with canonical slugs, DOMPurify and an embed allow-list; Shop, profiles, magazine and video pages.
- Directory search through the API (no browser key), with claiming and loading, empty and error states.
- Access card creation, draft claiming, plans with personal prices, Shippo checks and the Stripe Payment Element; an 11-tab dashboard with per-tab error boundaries.
- Token in memory with an httpOnly refresh cookie; Turnstile on sign-up; email-link verification and reset.
- `tsc` strict passes, ESLint has 0 errors, no internal broken links, no runtime exceptions, and real 404s for bad articles, products and profiles.
