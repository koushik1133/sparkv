# Careers notes

Routes: `/careers` (board), `/careers/[slug]` (detail + apply form), `POST /api/apply`.
Job data: `lib/jobs.ts` (single source for pages, sitemap, JSON-LD, API slug allow-list).

## Assumptions and TODOs

- All four roles are **remote, India-based** (`applicantLocationRequirements: Country India`). This is an assumption; confirm.
- TODO: `employmentType` is a `FULL_TIME` placeholder for every role (the page shows "Full-time"). Confirm per role (e.g. Video Editor may be contract).
- No salary, benefits, headcount, funding, client names or company size are stated. Compensation reads "Discussed during the process." JSON-LD has no `baseSalary`.
- TODO: the "How we hire" steps (intro call, scoped exercise, team conversation) are a proposed process; confirm it matches reality.
- TODO: `/privacy#applicants` must exist (another worker owns the privacy rewrite). Consent version is `2026-10-12` (`CONSENT_VERSION` in `lib/jobs.ts`); bump when the applicant notice changes.
- `validThrough` 2027-01-10 for all roles; remove roles from `lib/jobs.ts` when filled.
- The applicant acknowledgement says to reply to the email to request deletion; make sure the inbox is monitored.
- Rate limit (3 per 10 min per IP) is in-memory per instance, like `/api/contact`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` | Shared with the contact form. |
| `HIRING_TO_EMAIL` | Inbox for applications (resume attached). Falls back to `CONTACT_TO_EMAIL`. |
| `HIRING_WEBHOOK_URL` | Optional. Each application is POSTed as JSON (`event: application.received`). |
| `HIRING_WEBHOOK_SECRET` | Required when the URL is set; otherwise the webhook is skipped and an error logged. |

Webhook signature: header `X-SparkV-Signature` = hex HMAC-SHA256 of the raw request body with `HIRING_WEBHOOK_SECRET`. Delivery is best-effort (10s timeout, one retry) and never fails the application.
`links.linkedin` / `links.github` are derived from the profile URL host; `links.portfolio` is the role-specific link; other profile URLs go to `links.other`.

## API behaviour

403 foreign Origin, 415 non-multipart, 413 over ~6 MB, 429 rate limit, 422 CRLF in header-bound fields or per-field errors (`{error, fields}`), honeypot returns `{ok:true}` silently, 503 when Resend/destination is not configured, 502 on delivery failure. Resume is checked by extension, size (5 MB) and magic bytes (PDF `%PDF-`, DOC OLE header, DOCX ZIP header). Nothing personal is logged.
Analytics: success dispatches `sparkv:application` which `components/telemetry.tsx` maps to `application_submitted`.
