# Legal pages: open items

Pages: `/privacy`, `/terms`, `/cookies`, `public/.well-known/security.txt`. Drafted from the General Legal CC0 templates and adapted to India (DPDP Act 2023 and Rules, IT Act 2000). This is a template-based draft, not legal advice. A qualified Indian lawyer must review it before it is relied on. The shared date constant is `LEGAL_UPDATED` in `lib/site.ts`; bump it on every substantive edit.

## TODOs for the owner (facts deliberately not invented)

- Legal entity: the pages say only "SparkV". Add the registered name, entity type (sole proprietorship / LLP / private limited company), CIN or registration number and registered address once known.
- Grievance Officer: role-based only ("Grievance Officer", sparkv.info@gmail.com). Name a person (and a dedicated mailbox) when appointed.
- `security.txt` expires 2027-10-01; renew it before then.
- Confirm the placeholder choices below, which are stated defaults rather than established facts.

## Placeholders and defaults to confirm

- Job applicant retention: 12 months from application (stated default in `/privacy`).
- Enquiry retention: "as long as needed, deleted on request"; no fixed period is set.
- Response target to rights requests: "aim to reply within 30 days" (our choice, not a statutory figure).
- Grievance resolution: "no more than 90 days" per the DPDP Rules as understood at drafting time.
- Liability cap in `/terms` section 7: INR 10,000 (invented placeholder).
- Careers/application flow was built by another worker; the Job applicants section describes the intended practice (resume, contact details, links, cover note; processors for email, automation, hosting). Verify it matches the actual careers implementation and processors.

## Lawyer review checklist

- DPDP Rules: current notice content, consent withdrawal mechanics, breach notification timelines (Board and Data Principals), grievance timelines, and which provisions are in force as of the review date.
- Applicant data: retention period, lawful basis (consent versus legitimate use for employment), and handling after hire.
- Governing-law and jurisdiction clause (Indian law, courts at Hyderabad, Telangana), including whether to add arbitration.
- Limitation of liability and indemnity: enforceability under the Indian Contract Act and consumer law; the cap amount.
- Whether SparkV is a sole proprietorship, LLP or company, and how that changes the "Data Fiduciary" identity, signatory and notices.
- Cross-border transfer wording (Vercel, Resend and email provider are processed globally) and any processor agreements needed.
- Whether SparkV may qualify as a Significant Data Fiduciary or needs a consent manager (unlikely at this scale).
- Minimum age statement (18) and the verifiable parental consent rules if any child data could arrive.
- Accuracy of provider claims (Vercel Analytics cookieless and 24-hour hash behaviour) against current Vercel documentation.
