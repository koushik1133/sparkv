import { LegalPage, legalMetadata } from "@/components/legal-page";
import { SITE_EMAIL, SITE_NAME } from "@/lib/site";
import { v2Path } from "@/lib/v2";

const TITLE = "Cookie & Storage Notice";
const DESCRIPTION =
  "SparkV sets no cookies. This notice lists the one item the site keeps in your browser (your theme choice) and how our cookieless analytics work.";

export const metadata = legalMetadata("/cookies", TITLE, DESCRIPTION);

export default function CookiesPage() {
  return (
    <LegalPage
      path="/cookies"
      title={TITLE}
      label="COOKIES"
      description={DESCRIPTION}
      intro="Short version: this website sets no cookies, shows no advertising, and does not track you across other sites."
    >
      <section aria-labelledby="what">
        <h2 id="what">What this notice covers</h2>
        <p>Cookies are small files a website saves in your browser. Local storage is a similar browser feature that keeps data on your device only. This page lists everything {SITE_NAME} keeps in your browser, so you can see there is nothing hidden.</p>
      </section>

      <section aria-labelledby="list">
        <h2 id="list">What the site stores</h2>
        <div className="legal-scroll">
          <table className="legal-table">
            <thead>
              <tr><th scope="col">Name</th><th scope="col">Type</th><th scope="col">Purpose</th><th scope="col">Lifetime</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code>sparkv-theme</code></td>
                <td>Local storage (not a cookie)</td>
                <td>Remembers whether you chose the light or dark theme. Holds only that choice, no personal data.</td>
                <td>Stays until you clear your browser data</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>There are currently no cookies of any kind: no first-party cookies, no advertising cookies, no social-media cookies.</p>
      </section>

      <section aria-labelledby="analytics">
        <h2 id="analytics">Analytics and speed measurement</h2>
        <p>On the live site we use Vercel Web Analytics to count page views and clicks in aggregate, and Vercel Speed Insights to measure how fast pages load. According to Vercel, these tools do not set cookies or store anything in your browser to identify you; a visit is recognised by a short-lived hash of the request that is discarded after 24 hours. We do not send your name, email address or form contents to them. See the <a href={v2Path("/privacy")}>Privacy Notice</a> for more.</p>
      </section>

      <section aria-labelledby="consent">
        <h2 id="consent">Consent and your choices</h2>
        <p>Because the site sets no tracking or advertising cookies, there is no cookie banner to accept. The theme item is needed for the theme toggle you use, and you can delete it any time in your browser settings (look for site data or local storage for this site); the site will then simply use your device&apos;s default theme. You can also block cookies in your browser without affecting how this site works.</p>
      </section>

      <section aria-labelledby="changes">
        <h2 id="changes">Changes</h2>
        <p>If we ever add cookies or similar technologies, we will list them here first and, where needed, ask for your consent. Questions: <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>.</p>
      </section>
    </LegalPage>
  );
}
