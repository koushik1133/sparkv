# Registering www.sparkv.si with Google (and Bing)

Not legal or SEO-guarantee advice. Items marked **MANUAL** need the owner's Google/Bing login; the code cannot do them.

## What the code already does vs what you must do

| Already in the repo | Manual (owner login) |
|---|---|
| `app/sitemap.ts` serves `/sitemap.xml`; `app/robots.ts` serves `/robots.txt` | Create the Search Console property and verify it |
| `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION` constants in `lib/site.ts` (currently empty strings) | Paste the verification token into `lib/site.ts`, deploy |
| `scripts/indexnow.mjs` (dry-run by default) and a key file in `public/` | Run `--submit` after deploys (see `docs/INDEXNOW.md`) |
| JobPosting structured data on `/careers` job pages (built by the careers work; confirm it is live) | Test it, keep `validThrough` current, remove filled jobs |
| Vercel Analytics (see `docs/ANALYTICS.md`); Google Analytics is NOT used | Nothing |

## Part 1: Google Search Console

### Option A (recommended): Domain property via DNS
Covers http/https and www/non-www in one property.
1. Go to https://search.google.com/search-console and sign in with the Google account that should own this.
2. Click **Add property** -> choose **Domain** -> enter `sparkv.si` -> Continue.
3. Google shows a TXT record like `google-site-verification=...`. Copy it.
4. Log in where DNS for `sparkv.si` is managed (your registrar, or Vercel if its nameservers are used). Add a **TXT** record: Host/Name `@`, Value = the string from step 3.
5. Wait a few minutes (sometimes hours), return to Search Console, click **Verify**.

### Option B: URL-prefix property with the HTML tag
1. **Add property** -> **URL prefix** -> `https://www.sparkv.si`.
2. Choose **HTML tag**. Copy only the `content="..."` value.
3. Put it in `lib/site.ts`: `export const GOOGLE_SITE_VERIFICATION = "the-value";` (confirm the site renders it as a `<meta name="google-site-verification">` tag in the page head; view-source after deploy).
4. Deploy to production, then click **Verify**.
5. Keep the tag in place permanently; removing it un-verifies you.

### After verifying
1. **Sitemaps** (left menu) -> enter `https://www.sparkv.si/sitemap.xml` -> Submit. Status should become "Success".
2. **URL Inspection** (top bar): paste each of these, wait for the result, click **Request indexing**:
   - `https://www.sparkv.si/`
   - `https://www.sparkv.si/services`
   - `https://www.sparkv.si/careers`
   - each job page under `/careers/...` (take the exact URLs from the sitemap)
   There is a daily quota; do the important pages first. Requesting again does not speed things up.
3. **Preferred www**: Search Console no longer has a "preferred domain" setting. Do it on the site: make sure `sparkv.si` 301-redirects to `https://www.sparkv.si` (Vercel project -> Domains: set the apex to redirect to www) and that canonical tags point to www. Verify by opening `http://sparkv.si` and checking it lands on `https://www.sparkv.si/`.
4. Check weekly at first: **Pages** (indexing report), **Core Web Vitals** (needs real-user data; may say "no data" for weeks on a new low-traffic site), and, once jobs are live, **Enhancements -> Job postings**.

### How long it takes, and what the statuses mean
- New site: first crawl hours to days; appearing in results days to several weeks. No one can promise a date or ranking.
- **Discovered - currently not indexed**: Google knows the URL (from the sitemap) but has not crawled it yet, often because the site is new or low-priority. Fix: make sure the page is linked from other pages, has unique content, and wait. Do not spam Request indexing.
- **Crawled - currently not indexed**: Google read it and chose not to index it (thin/duplicate content). Improve the page.
- **Excluded by noindex / Duplicate / Alternate page with canonical**: usually intentional; check only if a page you want is listed.

## Part 2: Bing Webmaster Tools
1. Go to https://www.bing.com/webmasters and sign in (Microsoft account).
2. Easiest: **Import from Google Search Console** and authorize. Sitemaps and verification carry over. **MANUAL**.
3. Or add the site manually and choose the meta-tag method; put the value in `BING_SITE_VERIFICATION` in `lib/site.ts`, deploy, verify.
4. Submit `https://www.sparkv.si/sitemap.xml` under Sitemaps.
5. IndexNow (pushes changed URLs to Bing, Yandex etc.; Google does not use it):
   - `node scripts/indexnow.mjs` -> dry run, prints the payload.
   - `node scripts/indexnow.mjs --urls https://www.sparkv.si/careers` -> dry run for chosen URLs.
   - `node scripts/indexnow.mjs --submit` -> actually sends. Only after the deploy is live (otherwise 403). Details: `docs/INDEXNOW.md`.

## Part 3: Google Business Profile
Only create one if SparkV has a real storefront or serves customers in person in a defined area. Google requires a genuine location or service area and may suspend fake or virtual-office listings. A fully remote company with no customer-facing address should **skip this**; do not invent an address. If it does apply: https://business.google.com -> add business -> verify (postcard/phone/video). **MANUAL**.

## Part 4: Google for Jobs
Google shows jobs in a rich "Jobs" result when job pages carry valid `JobPosting` structured data. No separate registration exists.
1. Each job page needs JobPosting JSON-LD with at least: `title`, `description` (full HTML description), `datePosted`, `validThrough`, `hiringOrganization` (name, and `sameAs`/logo ideally), `employmentType`, and for remote roles `jobLocationType: "TELECOMMUTE"` plus `applicantLocationRequirements` (country). Include `directApply: true` only if the page really lets people apply.
2. Test: https://search.google.com/test/rich-results -> paste the job URL -> fix every error; address warnings where sensible.
3. After jobs are live and indexed, watch **Search Console -> Enhancements -> Job postings**.
4. **Upkeep**: `validThrough` must be a future date; extend it or update it when you still hire. When a role is filled, remove the page (return 404/410) or the JobPosting markup, then request re-crawl. Stale postings can lose eligibility. Do not list jobs that do not exist.
5. Optional: the Google Indexing API officially supports JobPosting pages for faster updates/removals. It needs a Google Cloud service account added as an owner in Search Console. Not required for a handful of roles; sitemap + Request indexing is enough.
6. Eligibility is not guaranteed; Google decides what to show.

## Part 5: Analytics
Google Analytics is intentionally not used. Traffic and performance are measured with Vercel Analytics / Speed Insights (cookie-free per Vercel's description; confirm against current Vercel docs). Search Console provides search-specific data.

## Checklist
- [ ] Verified in Search Console (A or B)
- [ ] Sitemap submitted, shows Success
- [ ] Request indexing: `/`, `/services`, `/careers`, job pages
- [ ] Apex redirects to www
- [ ] Bing imported/verified, sitemap there
- [ ] Rich Results Test passes for each job page
- [ ] Calendar reminder: review `validThrough` monthly
