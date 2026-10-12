import { LegalPage, legalMetadata } from "@/components/legal-page";
import { SITE_COUNTRY, SITE_EMAIL, SITE_NAME, SITE_REGION, SITE_URL } from "@/lib/site";
import { v2Path } from "@/lib/v2";

const TITLE = "Privacy Notice";
const DESCRIPTION =
  "How SparkV handles personal data under India's Digital Personal Data Protection Act 2023: the project-intake form, job applications, hosting, analytics, your rights and how to reach our Grievance Officer.";

export const metadata = legalMetadata("/privacy", TITLE, DESCRIPTION);

export default function PrivacyPage() {
  const mail = <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>;
  return (
    <LegalPage
      path="/privacy"
      title={TITLE}
      label="PRIVACY"
      description={DESCRIPTION}
      intro="This notice explains, in plain language, what personal data this website handles, why, and what rights you have under the Digital Personal Data Protection Act, 2023 (DPDP Act) and the rules made under it."
    >
      <section aria-labelledby="who">
        <h2 id="who">Who we are</h2>
        <p>
          This website ({SITE_URL.replace("https://", "")}) is operated by {SITE_NAME}, based in {SITE_REGION}, {SITE_COUNTRY}. For the personal data described here, {SITE_NAME} is the &ldquo;Data Fiduciary&rdquo; under the DPDP Act, and you are the &ldquo;Data Principal&rdquo;. Contact us at {mail}.
        </p>
      </section>

      <section aria-labelledby="collect">
        <h2 id="collect">What we collect, why, and on what basis</h2>
        <p>We collect only what you choose to send us. We do not buy data about you and we do not build profiles of visitors.</p>
        <div className="legal-scroll">
          <table className="legal-table">
            <thead>
              <tr><th scope="col">Data</th><th scope="col">Purpose</th><th scope="col">Basis</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Project-intake form: name, email address, project type, project brief</td>
                <td>To read your request, reply, and discuss a project with you</td>
                <td>Your consent, given when you submit the form</td>
              </tr>
              <tr>
                <td>Emails you send us</td>
                <td>To answer you and continue the conversation</td>
                <td>Your consent, given when you write to us</td>
              </tr>
              <tr>
                <td>Job applications (see <a href="#applicants">Job applicants</a>)</td>
                <td>Recruitment only</td>
                <td>Your consent, given when you apply</td>
              </tr>
              <tr>
                <td>Technical request data (IP address, browser, pages viewed) handled by our host and analytics tools</td>
                <td>Delivering the site, keeping it secure, measuring aggregate traffic and speed</td>
                <td>Legitimate use as permitted by the DPDP Act, and the limited analytics described below</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>The form has a hidden anti-spam field that real visitors do not fill in. We do not collect or ask for sensitive details such as financial account numbers, government identifiers or health data. Please do not include them in your message.</p>
      </section>

      <section aria-labelledby="use">
        <h2 id="use">How the contact form works</h2>
        <p>
          When you submit the form, we email the details to our inbox and send you an automatic thank-you email. The website does not save form submissions in a database of its own. To limit abuse, the form handler briefly keeps a count of recent submissions per IP address in server memory; this is not written to storage. The server logs errors, not the contents of your submission.
        </p>
        <p>Messages sit in our email inbox for as long as needed to deal with your enquiry or the project that follows, and we delete them when you ask us to (see your rights below).</p>
      </section>

      <section aria-labelledby="processors">
        <h2 id="processors">Who processes it</h2>
        <p>We do not sell personal data and we do not share it for advertising. We use a small number of service providers (&ldquo;processors&rdquo;) who handle data only to provide their service to us:</p>
        <ul>
          <li><strong>Vercel</strong> hosts the website and handles ordinary request information such as IP addresses. It also provides Vercel Web Analytics and Speed Insights.</li>
          <li><strong>Resend</strong> delivers the form emails, so your submitted details pass through it.</li>
          <li>Our email provider stores the messages we receive.</li>
        </ul>
        <p>
          Vercel Web Analytics counts page views and clicks in aggregate and Speed Insights measures page speed. According to Vercel, Web Analytics does not set third-party cookies; it recognises a visit with a short-lived hash of the request that is discarded after 24 hours. We do not send your name, email address or project details to these tools. The site loads no external fonts and no advertising or tracking scripts. The on-page assistant works in your browser; the messages you type into it are not sent to us or to any third party.
        </p>
        <p>We may also disclose data where the law requires it, for example to a court or authority acting under Indian law.</p>
      </section>

      <section aria-labelledby="transfer">
        <h2 id="transfer">Storage location and transfers outside India</h2>
        <p>
          Our processors (Vercel, Resend and our email provider) operate global infrastructure, so your data may be processed or stored on servers outside India. The DPDP Act permits transfers to other countries except those the Central Government restricts by notification. We choose providers that publish security and data-protection commitments, and we will update this notice if our arrangements change.
        </p>
      </section>

      <section aria-labelledby="cookies">
        <h2 id="cookies">Cookies and local storage</h2>
        <p>
          The site does not set cookies. It stores one item in your browser&apos;s local storage, <code>sparkv-theme</code>, to remember your light or dark theme choice. It holds no personal information and stays on your device. Details are on the <a href={v2Path("/cookies")}>Cookie &amp; Storage Notice</a>.
        </p>
      </section>

      <section aria-labelledby="retention">
        <h2 id="retention">How long we keep data</h2>
        <ul>
          <li>Enquiries and project correspondence: while needed for the enquiry or project, then deleted. You can ask for earlier deletion at any time.</li>
          <li>Job applications: see <a href="#applicants">Job applicants</a> below.</li>
          <li>Analytics: aggregate figures only, retained by Vercel under its own schedule.</li>
        </ul>
        <p>We may keep data longer only where a law requires us to.</p>
      </section>

      <section aria-labelledby="security">
        <h2 id="security">Security and breaches</h2>
        <p>
          The site is served over HTTPS, the form endpoint validates input and limits abuse, and access to our inbox is restricted to people who need it. No system is perfectly secure. If a personal data breach affects you, we will notify the Data Protection Board of India and the affected people as the DPDP Act and Rules require. You can report a security concern through the contact in our <a href={v2Path("/.well-known/security.txt")}>security.txt</a>.
        </p>
      </section>

      <section aria-labelledby="children">
        <h2 id="children">Children</h2>
        <p>This website is for businesses and adults. It is not directed at anyone under 18, and we do not knowingly collect personal data from children. If you believe a child has sent us data, email {mail} and we will delete it.</p>
      </section>

      <section aria-labelledby="rights">
        <h2 id="rights">Your rights as a Data Principal</h2>
        <p>Under the DPDP Act you may:</p>
        <ul>
          <li>ask for a summary of the personal data we hold about you and who we have shared it with (access);</li>
          <li>ask us to correct inaccurate or incomplete data, or update it;</li>
          <li>ask us to erase data we no longer need for the purpose you gave it;</li>
          <li>withdraw your consent at any time. Withdrawal does not affect what we did lawfully before you withdrew, and it may mean we can no longer answer your enquiry or continue a recruitment process;</li>
          <li>nominate another person to exercise these rights for you if you die or become unable to do so;</li>
          <li>have your grievance dealt with, as described below.</li>
        </ul>
        <p>To use any of these rights, email {mail} with the subject line &ldquo;Data request&rdquo;, from the address you used to contact us so that we can match the request. We may ask for a small amount of information to confirm it is you. We aim to reply within 30 days. You must also give true information and not file false or frivolous complaints.</p>
      </section>

      <section aria-labelledby="grievance">
        <h2 id="grievance">Grievance redressal</h2>
        <p>
          If you are unhappy with how we handle your data, write to our Grievance Officer at {mail} with the subject line &ldquo;Grievance&rdquo;. We will acknowledge it promptly and aim to resolve it within the period set by the DPDP Rules (currently no more than 90 days). Please use this route first. If it does not resolve your complaint, you may complain to the Data Protection Board of India once it is operational.
        </p>
      </section>

      <section id="applicants" className="legal-job" aria-labelledby="applicants-h">
        <h2 id="applicants-h">Job applicants</h2>
        <p>This section applies if you apply for a role, internship or other opportunity at {SITE_NAME}. It adds to the rest of this notice.</p>
        <h3>What we collect</h3>
        <ul>
          <li>Your resume or CV, as you provide it;</li>
          <li>contact details: name, email address and, if you include it, phone number;</li>
          <li>links you choose to share, such as a portfolio, code repository or professional profile; and</li>
          <li>a cover note or any other message you write.</li>
        </ul>
        <h3>Why</h3>
        <p>We use this data only to assess your application, contact you about it and, if you are hired, begin onboarding. We do not use it for marketing, we do not use it to profile you for any other purpose, and we do not sell it.</p>
        <h3>How long we keep it</h3>
        <p>
          By default we keep applications for 12 months from the date you apply, so that we can consider you for other suitable roles, and then delete them. If you are hired, your data moves into your employment records, which are handled under separate terms. You can ask us to delete your application earlier at any time, and we will do so.
        </p>
        <h3>Who sees it</h3>
        <p>Only people at {SITE_NAME} involved in hiring. We share it only with the processors that deliver our email, run the automation that routes applications, and host our systems. They act on our instructions and do not use it for their own purposes.</p>
        <h3>Your rights</h3>
        <p>You have all the rights listed under <a href="#rights">Your rights as a Data Principal</a>, including access, correction, erasure and withdrawal of consent. To exercise them, email {mail} with the subject line &ldquo;Applicant data request&rdquo; and the email address you applied with. Withdrawing consent ends your application.</p>
      </section>

      <section aria-labelledby="changes">
        <h2 id="changes">Changes to this notice</h2>
        <p>We may update this notice as the site, our providers or the law change. The date at the top shows when it was last updated. If a change affects how we use data you have already given us, we will tell you and, where required, ask for your consent again.</p>
      </section>

      <section aria-labelledby="contact">
        <h2 id="contact">Contact</h2>
        <p>{SITE_NAME}, {SITE_REGION}, {SITE_COUNTRY}. Grievance Officer: {mail}.</p>
      </section>
    </LegalPage>
  );
}
