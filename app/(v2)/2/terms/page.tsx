import { LegalPage, legalMetadata } from "@/components/legal-page";
import { SITE_COUNTRY, SITE_EMAIL, SITE_NAME, SITE_REGION, SITE_URL } from "@/lib/site";

const TITLE = "Terms of Use";
const DESCRIPTION =
  "The terms for using the SparkV website: acceptable use, intellectual property, no-warranty and liability limits, and Indian governing law with courts in Hyderabad, Telangana.";

export const metadata = legalMetadata("/terms", TITLE, DESCRIPTION);

export default function TermsPage() {
  const mail = <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>;
  return (
    <LegalPage
      path="/terms"
      title={TITLE}
      label="TERMS"
      description={DESCRIPTION}
      intro="These terms apply to your use of this website. Project work is covered by a separate written agreement."
    >
      <section aria-labelledby="accept">
        <h2 id="accept">1. Agreeing to these terms</h2>
        <p>
          By using {SITE_URL.replace("https://", "")} (the &ldquo;Site&rdquo;), operated by {SITE_NAME} in {SITE_REGION}, {SITE_COUNTRY} (&ldquo;we&rdquo;, &ldquo;us&rdquo;), you agree to these terms and to our <a href="/privacy">Privacy Notice</a>. If you do not agree, please do not use the Site. You must be at least 18 years old, or use the Site with a parent or guardian, to enter into a binding agreement with us.
        </p>
      </section>

      <section aria-labelledby="site">
        <h2 id="site">2. What the Site is</h2>
        <p>The Site describes our software, AI and automation services and lets you contact us about a project or a job. Nothing on the Site is an offer that forms a contract. A contract for services exists only when we both sign a written agreement or proposal. Information on the Site is general and may be out of date.</p>
      </section>

      <section aria-labelledby="use">
        <h2 id="use">3. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>break any law, including the Information Technology Act, 2000 and rules under it;</li>
          <li>submit false, misleading, abusive or unlawful content through the contact form, or send spam;</li>
          <li>probe, scan or test the Site&apos;s security, overload it, or interfere with its operation, other than through responsible disclosure as described in our <a href="/.well-known/security.txt">security.txt</a>;</li>
          <li>scrape or copy the Site at a volume or in a way that harms it, or try to gain access to systems or data you are not authorised to see; or</li>
          <li>pretend to be another person or organisation.</li>
        </ul>
        <p>We may limit or block access to the Site if we reasonably think these rules are being broken.</p>
      </section>

      <section aria-labelledby="ip">
        <h2 id="ip">4. Intellectual property</h2>
        <p>The Site&apos;s text, design, code, logos and other material belong to {SITE_NAME} or its licensors and are protected by Indian and international intellectual property laws, except for open-source components, which remain under their own licences. You may view the Site and share links to it. You may not copy, modify or reuse our content or branding for another purpose without our written permission.</p>
        <p>Anything you send us (for example a project brief) remains yours. You allow us to use it only to respond to you and to assess or carry out the work you ask about.</p>
      </section>

      <section aria-labelledby="links">
        <h2 id="links">5. Links and third parties</h2>
        <p>The Site may link to websites we do not control. We are not responsible for their content or practices. Examples of work or technology described on the Site may refer to third-party products whose names belong to their owners.</p>
      </section>

      <section aria-labelledby="warranty">
        <h2 id="warranty">6. No warranties</h2>
        <p>The Site is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. To the extent the law allows, we do not promise that it will be uninterrupted, error-free or secure, or that its content is complete or suitable for your purpose. Nothing on the Site is professional, legal or financial advice.</p>
      </section>

      <section aria-labelledby="liability">
        <h2 id="liability">7. Limit of liability</h2>
        <p>To the extent the law allows, we are not liable for indirect, incidental, special or consequential loss, or for loss of profit, revenue, data or goodwill, arising from your use of the Site. Our total liability for any claim relating to the Site is limited to INR 10,000. Nothing in these terms excludes liability that cannot be excluded under Indian law, such as liability for fraud or wilful misconduct.</p>
      </section>

      <section aria-labelledby="indemnity">
        <h2 id="indemnity">8. Your responsibility</h2>
        <p>You are responsible for what you submit and for how you use the Site. You agree to compensate us for losses from third-party claims caused by your breach of these terms or your unlawful use of the Site, to the extent the law allows.</p>
      </section>

      <section aria-labelledby="law">
        <h2 id="law">9. Governing law and disputes</h2>
        <p>These terms are governed by the laws of India. We encourage you to contact us first at {mail} so we can try to settle any dispute informally. If that does not work, the courts at Hyderabad, Telangana, India have exclusive jurisdiction over disputes arising from the Site or these terms.</p>
      </section>

      <section aria-labelledby="changes">
        <h2 id="changes">10. Changes and ending</h2>
        <p>We may change these terms or the Site at any time. The date at the top shows the latest version, and using the Site after a change means you accept it. We may suspend or end access to the Site at any time. Sections that by their nature should survive (intellectual property, liability, governing law) continue to apply.</p>
      </section>

      <section aria-labelledby="general">
        <h2 id="general">11. General</h2>
        <p>If part of these terms is found unenforceable, the rest stays in force. Not enforcing a term is not a waiver of it. These terms and the Privacy Notice are the whole agreement between you and us about your use of the Site.</p>
      </section>

      <section aria-labelledby="contact">
        <h2 id="contact">12. Contact</h2>
        <p>Questions about these terms: {mail}.</p>
      </section>
    </LegalPage>
  );
}
