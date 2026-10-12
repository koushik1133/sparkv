# Dual-site: V1 at `/`, V2 at `/2`

One Next.js app serves two complete sites.

| | V1 (original site) | V2 (redesign + careers + legal + team) |
|---|---|---|
| URLs | `/`, `/services`, `/services/[slug]`, `/privacy` | `/2`, `/2/services`, `/2/services/[slug]`, `/2/careers`, `/2/careers/[slug]`, `/2/privacy`, `/2/terms`, `/2/cookies`, `/2/team` |
| Root layout | `app/(v1)/layout.tsx` (imports only `app/(v1)/globals.css`) | `app/(v2)/layout.tsx` (imports `app/(v2)/v2globals.css` + `app/(v2)/hybrid.css`) |
| Components | `components/home/*`, `components/site-chrome.tsx`, `components/telemetry.tsx` and the other original files, byte-identical to `main` | `components/v2/*` (own copies of every client/UI component), `components/legal-page.tsx`, `components/apply-form.tsx` |
| Indexing | indexed (production only), in sitemap | `noindex` while `V2_INDEXABLE = false` |

Shared on purpose: `lib/*` (services, jobs, site, analytics), `components/json-ld.tsx`, `components/ui/*`, and the API routes `/api/contact` and `/api/apply` (V2 forms post to them).

## Why the V2 components are copies
Route groups give each site its own root layout, so CSS cannot leak. JavaScript can still be shared by webpack: any component imported by both sites moves into a shared chunk and changes V1's bundle layout. V2 therefore never imports a V1 component, and V1 never imports anything from `components/v2` or `app/(v2)`. Measured effect: V1 homepage first-load JS is within 1 KB of `main`'s (`node scripts/check-budgets.mjs` enforces it via `v1BaselineJsGzipBytes`). V1's CSS is byte-identical to `main`'s: `app/(v1)/globals.css` only adds `@source not` lines so Tailwind does not scan V2 sources and docs.

If you edit a shared look in one site, make the same edit in the other by hand. This is deliberate: it is the price of V1 staying exactly as it was.

## Links stay inside `/2`
Every internal link in V2 goes through `v2Path()` (`lib/v2.ts`): `/` -> `/2`, `/#contact` -> `/2#contact`, `/services/x` -> `/2/services/x`. Canonicals, JSON-LD URLs and breadcrumbs use `absoluteUrl(v2Path(...))`. Add `v2Path()` to every new V2 link.

## Indexing switch
`lib/site.ts`: `export const V2_INDEXABLE = false;`

While `false`:
- every V2 page has `robots: noindex, nofollow` (`V2_ROBOTS` in `lib/v2.ts`, used by the V2 layout and `legalMetadata`);
- `next.config.ts` sends `X-Robots-Tag: noindex, nofollow` for `/2` and `/2/:path*`;
- `app/robots.ts` adds `Disallow: /2`;
- `app/sitemap.ts` lists V1 URLs only.

Setting it to `true` (production deployments only; previews stay noindex) removes all four: V2 pages become indexable with their own `/2/...` canonicals, and V2 URLs are added to the sitemap. Note that then both sites are indexed with different canonicals; use it for a staged launch only.

## Promoting V2 to `/` later
1. Create a branch. Delete `app/(v1)/` and the V1 files in `components/` that only it used (`components/home/*`, `components/site-chrome.tsx`, `components/telemetry.tsx`, plus the unprefixed original `sparkv-*`, `live-*`, `theme-toggle`, `sub-menu`, `motion-enhancements` that nothing else imports).
2. Move `app/(v2)/2/*` up to `app/(v2)/*` (so `/2/services` becomes `/services`), keep the `(v2)` group or rename it.
3. Make `v2Path()` the identity (return its input) or replace it with plain paths, and set `V2_PREFIX = ""`; change `V2_URL` in `app/(v2)/layout.tsx` to `SITE_URL`.
4. Move `icon.png`, `apple-icon.png`, `opengraph-image.tsx`, `favicon.ico` handling if the new layout should own them (they live at `app/` root today, shared).
5. `next.config.ts`: remove the `/2/:path*` header; `proxy.ts`: matcher `["/team", "/team/:path*"]` and cookie `path: "/team"`.
6. `app/robots.ts` and `app/sitemap.ts`: drop the V2 handling; list the V2 URLs (careers, terms, cookies) as top-level. Put `301` redirects from `/2/:path*` to `/:path*` in `next.config.ts` `redirects()` so shared preview links keep working.
7. Delete `app/global-not-found.tsx` and `experimental.globalNotFound`, and use a normal `app/not-found.tsx` (a single root layout again).
8. Remove the `v1Baseline*` keys from `docs/performance-budgets.json` and the V1 row from `scripts/check-budgets.mjs`.

## 404 behaviour
Two root layouts mean unmatched URLs have no layout to render in, so `app/global-not-found.tsx` (experimental `globalNotFound` flag) renders the V1-styled 404 for any URL no route matches (HTTP 404). `app/(v2)/2/[...rest]/page.tsx` calls `notFound()` so unknown `/2/...` URLs get the V2-styled `app/(v2)/not-found.tsx` inside the V2 layout.

## Team dashboard
Now `/2/team`. `proxy.ts` gates `/2/team` and `/2/team/*`: 404 without `TEAM_DASHBOARD_TOKEN`, or without `?token=` / the `team_token` cookie (path-scoped to `/2/team`).

## Checks
`npx tsc --noEmit`, `npm run lint`, `VERCEL_ENV=production npm run build`, `node scripts/check-budgets.mjs` (checks `/` and `/2`).
