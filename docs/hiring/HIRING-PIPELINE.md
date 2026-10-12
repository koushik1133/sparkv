# SparkV Hiring Pipeline

Working document, not legal advice. All timings are **suggested defaults**; change them to fit capacity. Roles (all remote): AI Engineer (`ai-engineer`), Software Engineer (`software-engineer`), Forward Deployed Engineer (`forward-deployed-engineer`), Video Editor (`video-editor`).

## 1. How an application flows

1. Candidate submits `/careers` form -> `POST /api/apply`.
2. The API (a) emails `HIRING_TO_EMAIL` with the resume attached, (b) emails the candidate an acknowledgement, (c) POSTs signed JSON to `HIRING_WEBHOOK_URL`.
3. n8n (`n8n/sparkv-hiring.workflow.json`) verifies the signature, dedupes, appends a row to the Google Sheet, and emails HR. See `n8n-SETUP` section below.
4. HR/hiring owner works the row through the stages and updates `status`, `owner`, `lastUpdate`, `nextAction`, `score`, `notes`.
5. A daily digest flags stuck applications.

The resume lives in the hiring inbox email only (not in the sheet). Keep it there or in a restricted folder.

## 2. Stages, owners, target times (suggested)

| Stage | Meaning | Owner | Target |
|---|---|---|---|
| received | Application arrived, auto-ack sent | HR (auto) | Human first response within 3 business days |
| screening | Resume/links reviewed against scorecard | HR + role lead | Decision within 5 business days of receipt |
| assignment | Short task sent (see per role) | Role lead | Candidate gets 5-7 days to return; review in 3 business days |
| interview | 1-3 conversations | Role lead (+1 peer) | Schedule within 5 business days; feedback in 2 |
| offer | Offer drafted/sent | Founder/HR | Within 3 business days of final decision; offer valid 7 days |
| hired | Accepted | HR | Start onboarding, move data to employee records |
| rejected | Not proceeding | HR | Tell the candidate within 3 business days of the decision |
| withdrawn | Candidate withdrew | HR | Confirm by email, stop contact |

Rule: no candidate waits more than ~7 days in silence at any stage. If you are late, send a short "still reviewing" note.

## 3. Screening scorecards

Score each criterion 0-2 (0 missing, 1 partial, 2 clear evidence). Score from evidence in the application and linked work, not from school names, employer brand, age, gender, or photo. Two reviewers score independently where possible. Suggested bar: 70%+ advances; borderline goes to a second reviewer.

### AI Engineer
- Has shipped an LLM/ML feature to real users (not only notebooks) - 0-2
- Retrieval/RAG, prompt, tool-use or fine-tuning work with evaluation (how did they measure quality?) - 0-2
- Python plus one backend language/framework; APIs, queues, deployment - 0-2
- Awareness of failure modes: hallucination, latency, cost, data privacy - 0-2
- Public code, write-up, or clear project description - 0-2
- Communication in the written note - 0-2
- **Assignment (about 2-3 hours, paid or clearly optional)**: given a small set of 20 support documents and 10 questions, build a minimal question-answering script and report where it fails and how they would measure it. Provide data. No production system, no free feature work for SparkV.

### Software Engineer
- Production web/backend experience in at least one modern stack (TypeScript/Node, Python, Go, etc.) - 0-2
- Data modelling and API design - 0-2
- Testing and debugging habits - 0-2
- Git/code review/CI familiarity - 0-2
- Examples of owning a feature end to end - 0-2
- Written communication - 0-2
- **Assignment (about 2-3 hours)**: small REST endpoint with validation and tests from a written spec, plus a README of trade-offs. Alternative: review a 100-line pull request we supply. Do not ask for work that resembles our real code.

### Forward Deployed Engineer
- Has worked directly with customers or stakeholders on technical delivery - 0-2
- Can scope an ambiguous problem and say what they would ask first - 0-2
- Hands-on engineering ability (integrations, scripts, APIs, data cleanup) - 0-2
- Clear explanation to non-technical people - 0-2
- Comfort owning outcomes, travel/time-zone flexibility stated honestly - 0-2
- Judgment on when to say no or reset expectations - 0-2
- **Assignment (about 2 hours)**: a fictional customer email with a vague request and messy sample CSV. Candidate writes a one-page plan, the questions they would ask, and a small script or spreadsheet cleanup of the data.

### Video Editor
- Portfolio quality: pacing, cuts, audio, captions, colour - 0-2
- Range relevant to us (product/tech explainers, short-form, YouTube) - 0-2
- Tools fluency (e.g. Premiere, DaVinci Resolve, After Effects, CapCut) - 0-2
- Turnaround and volume experience - 0-2
- Storytelling and structure - 0-2
- Communication, taking feedback - 0-2
- **Assignment**: prefer reviewing existing portfolio work plus a 20-30 minute call about a piece they cut. If a task is needed, it is a **paid** trial: edit about 60-90 seconds of footage we supply, 3 days to return; pay a fixed fee agreed up front (suggest the same rate you would pay a freelancer for that work). Never use unpaid trial edits in published content.

### Paying for assignments
Unpaid is acceptable only for a short (up to ~2 hours), bounded, throwaway exercise that the candidate may skip in favour of other evidence. Anything longer, anything that resembles real deliverables, or any video-editing trial: **pay**. State the fee (or "unpaid, 2 hours max, optional") in the invitation. Delete submitted work if the process ends, and never reuse it.

## 4. Interview question banks

Ask every candidate for a role the same core questions, in the same order, and score against written anchors. Keep sessions 30-45 minutes.

### AI Engineer
1. Walk me through an AI feature you shipped. What broke in production?
2. How did you decide whether the output was good enough? Which metrics, which test set?
3. A RAG system returns confident wrong answers. How do you debug it?
4. How do you trade off model quality, latency and cost?
5. How would you handle personal data sent to a third-party model API?
6. When would you not use an LLM?

### Software Engineer
1. Describe a system you owned. What would you change now?
2. Design a job-application API: validation, uploads, abuse, retries.
3. How do you find the cause of an intermittent production bug?
4. What does a good code review look like to you?
5. Tell me about a disagreement on a technical decision and how it ended.
6. How do you make a change safely when there are few tests?

### Forward Deployed Engineer
1. Tell me about a customer project that went off-plan. What did you do?
2. A customer asks for a feature that does not fit the product. What do you say?
3. How do you scope a vague request in the first call? What do you ask?
4. Explain how a webhook or API integration works to a non-technical manager.
5. How do you document what you built so someone else can maintain it?
6. How do you handle being on call for a customer in a different time zone?

### Video Editor
1. Pick one piece from your portfolio. What was the brief and what did you cut?
2. How do you structure a 60-second product explainer?
3. How do you handle conflicting feedback from two stakeholders?
4. Your usual weekly volume and turnaround? What slows you down?
5. Audio and captions: your workflow and checks.
6. How do you organise files and versions on a team project?

Avoid asking about marital status, age, religion, caste, health, pregnancy, family plans, or current salary history. Ask expected compensation instead, after you have shared the range.

## 5. Email templates (honest tone)

Replace `{{ }}`. Send from a monitored address. Never promise what you cannot deliver.

### Acknowledgement (also sent by the site automatically; keep wording consistent)
Subject: We received your application - {{jobTitle}}

Hi {{name}},
Thanks for applying to SparkV for {{jobTitle}} (reference {{applicationId}}). A person will read it, and you should hear from us within about 3 business days, even if the answer is "not yet". We are a small team, so we cannot always reply faster. If you want your data deleted or corrected, write to {{privacyEmail}}.
{{signature}}

### Moving forward / assignment
Subject: Next step for {{jobTitle}}

Hi {{name}},
We would like to take the next step. {{Describe task in 2-3 lines}}. It should take about {{hours}} hours; you have until {{date}}, and you can ask us anything. {{This task is paid at X / This is optional and unpaid, capped at 2 hours; you can instead share existing work.}} We will not use your submission for anything except evaluating your application.
{{signature}}

### Rejection (after screening)
Subject: Your application for {{jobTitle}}

Hi {{name}},
Thank you for your time. We have decided not to move forward for this role. {{One honest, specific line if you can give it, e.g. "We are looking for more production experience with X right now."}} This is not a judgement of your worth, and we may have openings that fit later. We will delete your application after 12 months unless you ask us to keep it longer or remove it sooner.
{{signature}}

### Rejection (after interview)
Hi {{name}},
Thank you for the time you gave us. We enjoyed meeting you, but we chose another candidate whose experience matched {{specific need}} more closely. {{One piece of useful feedback if you have it.}} You are welcome to apply again.
{{signature}}

### Offer
Subject: Offer: {{jobTitle}} at SparkV

Hi {{name}},
We are glad to offer you the role of {{jobTitle}}. Terms: {{engagement type}}, {{compensation}}, {{start date}}, {{location/remote}}, {{notice and probation, if any}}. The formal letter is attached. This offer is open until {{date}}. Please ask any questions; take the time you need within that window. Reply to accept, or tell us if you would like to negotiate.
{{signature}}

### Withdrawn confirmation
Hi {{name}}, confirming we have closed your application at your request. Your data will be deleted as per your request / within {{days}} days.

## 6. Fairness and bias reduction

- Write the scorecard before looking at candidates; do not change criteria mid-round.
- Score criteria separately, then total. Two independent reviewers where possible.
- Remove or ignore name, photo, age, gender, caste, religion, marital status, and college prestige during first-pass scoring where practicable (hide columns in the sheet).
- Same questions and same assignment for every candidate in a role; same time limits; offer reasonable accommodations on request.
- No unpaid substantial work. Respect timezones and notice periods.
- Record the reason for each rejection against a criterion, not a feeling.
- Review funnel by source and stage monthly for unexplained drop-offs. Do not collect protected-category data unless you have a lawful, voluntary, separate purpose.
- Do not use automated tools to auto-reject. A human decides.

## 7. Data handling (DPDP-aligned)

Aligned with India's Digital Personal Data Protection Act 2023; confirm specifics with counsel and keep the privacy notice (`app/privacy/page.tsx`) consistent.
- **Purpose**: evaluating and contacting the applicant for hiring only. Do not reuse for marketing.
- **Notice and consent**: the form records `consentVersion`; keep the matching notice text.
- **Retention**: default 12 months from `receivedAt` for unsuccessful applicants (shorter if they ask). Hired candidates: move necessary data to employee records and delete the rest.
- **Deletion on request**: on request, delete the sheet row, the resume email(s) in the hiring inbox, any assignment files and notes, then confirm in writing. Target 30 days at most; sooner is better.
- **Access**: sheet shared only with named hiring staff (Editor/Viewer, no "anyone with link"); turn on 2-step verification; remove access when people leave. n8n and the inbox are restricted the same way.
- **Processors**: Google (Sheets, Gmail), n8n host, Resend/email provider, Vercel. Note them in the privacy notice.
- **Minimise**: do not collect Aadhaar, PAN, bank details, or health data at application stage.
- **Retention routine**: monthly, filter rows with `receivedAt` older than 12 months and not hired; delete them and their emails.
- **Breach**: if you suspect exposure, follow your incident process and the DPDP breach-notification requirements.
- **Grievances**: publish a contact for access, correction and deletion requests and respond promptly.

## 8. Weekly funnel metrics

Compute from the sheet (pivot, or Looker Studio, see `sheet-template.csv` note below).
- Applications per role (and per week)
- Time to first human response (median, 90th percentile) vs the 3-day target
- Stage conversion: received -> screening -> assignment -> interview -> offer -> hired
- Stuck count: applications idle > 7 days (the daily digest lists them)
- Assignment return rate and average review time
- Offer acceptance rate
- Source (currently `careers-site`; add a `source` column or note when other channels appear)
- Rejection reasons by criterion

## 9. Setup of the automation (n8n)

File: `n8n/sparkv-hiring.workflow.json`.

**Import**: n8n -> Workflows -> Add -> Import from file -> choose the JSON.

**Prepare the sheet**: create a Google Sheet named `SparkV Hiring Pipeline`, tab `Applications`. Import `docs/hiring/sheet-template.csv` (File -> Import), delete the two fake rows (keep the header). Copy the sheet ID from its URL into the three Google Sheets nodes (`REPLACE_WITH_GOOGLE_SHEET_ID`).

**Credentials** (nodes show `REPLACE_WITH_CREDENTIAL_ID`): in n8n create a Google Sheets OAuth2 credential and a Gmail OAuth2 credential, then select them on each Sheets and Gmail node. Set `REPLACE_WITH_HR_EMAIL` in the two Gmail nodes (notification and digest). To use Slack instead, swap the Gmail notify node for a Slack node.

**Environment on the n8n host**: `HIRING_WEBHOOK_SECRET=<same value as the site's HIRING_WEBHOOK_SECRET>`, `NODE_FUNCTION_ALLOW_BUILTIN=crypto`. If `N8N_BLOCK_ENV_ACCESS_IN_NODE=true` (default in newer n8n), `$env` is blocked: either set it to `false` or replace `$env.HIRING_WEBHOOK_SECRET` in the Verify Signature node with a value from a Credential/static data you control. Never paste the secret into the workflow JSON you commit.

**Webhook URL**: activate the workflow. The Webhook node's Production URL looks like `https://<your-n8n-host>/webhook/sparkv-apply`. Set the site env `HIRING_WEBHOOK_URL` to that URL (Vercel -> Project -> Settings -> Environment Variables) and redeploy. Test URL (`/webhook-test/...`) works only while "Listen for test event" is active.

**Test with curl** (computes the signature the same way the site does):
```
export SECRET='your-test-secret'
BODY='{"event":"application.received","applicationId":"SV-20990101-test01","jobSlug":"ai-engineer","jobTitle":"AI Engineer","name":"Test Person","email":"test@example.invalid","phone":"","location":"","links":{"linkedin":"","portfolio":"","github":"","other":""},"noticePeriod":"","note":"curl test","resumeFilename":"x.pdf","resumeSizeBytes":1,"receivedAt":"2099-01-01T00:00:00.000Z","consentVersion":"v1","source":"careers-site","status":"received"}'
SIG=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$SECRET" -hex | sed 's/^.* //')
curl -i -X POST 'https://<your-n8n-host>/webhook/sparkv-apply' \
  -H 'Content-Type: application/json' -H "X-SparkV-Signature: $SIG" --data-binary "$BODY"
```
Expect `200 {"ok":true}`, a new sheet row, and an email to HR. Send it again: `{"ok":true,"duplicate":true}` and no new row. Change one character of the signature: `401`. Delete the test row afterwards.

**Daily digest**: the Schedule branch runs 9:00 (n8n instance time zone; set `GENERIC_TIMEZONE=Asia/Kolkata`). It flags `received` older than 3 days and any open stage idle more than 7 days, and sends one email only if something is flagged. Keep `status` values lowercase exactly as the stages above and `lastUpdate` as an ISO date/time or a date Google Sheets exports in a form JavaScript can parse.

**Dashboard (Looker Studio or Sheets pivot)**: in Sheets, Insert -> Pivot table, rows = `jobTitle`, columns = `status`, values = COUNTA of `applicationId`. For a hosted dashboard, Looker Studio -> Create -> Report -> add the Google Sheet as a data source -> stacked bar (jobTitle x status), scorecard for total applications, time series by `receivedAt`. Restrict sharing to hiring staff; the data is personal. Do not put candidate names/emails in a dashboard that others view; use aggregate fields.

## 10. Unverified
The workflow JSON was structurally validated (parses; connections reference existing nodes) but not imported into a live n8n instance. Node `typeVersion`s target current n8n (Webhook 2, Code 2, IF 2.2, Google Sheets 4.5, Gmail 2.1, Respond to Webhook 1.1, Schedule Trigger 1.2); if your n8n is older, n8n will flag a node on import. The Code node uses `this.helpers.getBinaryDataBuffer`, which depends on the Webhook "Raw Body" option; test with the curl above before going live.
