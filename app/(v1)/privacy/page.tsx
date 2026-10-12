import type { Metadata } from "next";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { JsonLd } from "@/components/json-ld";
import { OG_IMAGE, SITE_COUNTRY, SITE_EMAIL, SITE_NAME, SITE_REGION, SITE_URL, absoluteUrl } from "@/lib/site";

const TITLE = "Privacy Notice";
const DESCRIPTION =
  "How SparkV handles the details you send through the project-intake form or by email, which providers process them, and what is stored in your browser.";
const LAST_UPDATED = "7 October 2026";
const url = absoluteUrl("/privacy");

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: url },
  robots: { index: true, follow: true },
  openGraph: { type: "website", url, siteName: SITE_NAME, title: `${TITLE} | ${SITE_NAME}`, description: DESCRIPTION, images: [OG_IMAGE] },
  twitter: { card: "summary_large_image", title: `${TITLE} | ${SITE_NAME}`, description: DESCRIPTION, images: [OG_IMAGE.url] },
};

export default function PrivacyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: `${TITLE} | ${SITE_NAME}`,
        description: DESCRIPTION,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Privacy Notice", item: url },
        ],
      },
    ],
  };

  return (
    <div className="sub-page">
      <JsonLd data={jsonLd} />
      <SiteHeader />
      <main id="main" className="sub-main">
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Privacy Notice" }]} />
        <header className="sub-hero">
          <p className="section-label"><span />PRIVACY</p>
          <h1>Privacy Notice</h1>
          <p className="sub-answer">Last updated: {LAST_UPDATED}. This is a plain-language description of how this website handles information today.</p>
        </header>

        <section aria-labelledby="who">
          <h2 id="who">Who we are</h2>
          <p>This website ({SITE_URL.replace("https://", "")}) is operated by {SITE_NAME}, based in {SITE_REGION}, {SITE_COUNTRY}. You can reach us at <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>.</p>
        </section>

        <section aria-labelledby="collect">
          <h2 id="collect">What we collect and why</h2>
          <p>We collect only what you choose to send us: the project-intake form (your name, email address, project type and project brief) and any emails you send us. We use it to read your request, reply to you and discuss your project. The form has a hidden anti-spam field that real visitors do not fill in.</p>
        </section>

        <section aria-labelledby="use">
          <h2 id="use">How it is used</h2>
          <p>When you submit the form, we email the details to our inbox and send you an automatic thank-you email. The website does not save form submissions in a database of its own. To limit abuse, the form handler briefly keeps a count of recent submissions per IP address in server memory; this is not written to storage. The server logs errors, not the contents of your submission.</p>
        </section>

        <section aria-labelledby="processors">
          <h2 id="processors">Who processes it</h2>
          <ul>
            <li>Vercel hosts the website, and as a host it handles ordinary request information such as IP addresses.</li>
            <li>Resend delivers the form emails, so your submitted details pass through it.</li>
          </ul>
          <p>The on-page assistant works in your browser; the messages you type into it are not sent to us or to any third party. The site loads no external fonts and no advertising or tracking scripts from other companies. On the live site we use Vercel Web Analytics to count page views and clicks in aggregate, and Vercel Speed Insights to measure page speed. According to Vercel, Web Analytics does not set third-party cookies; it recognises a visit with a short-lived hash of the request that is discarded after 24 hours. We do not send your name, email address or project details to these tools.</p>
        </section>

        <section aria-labelledby="cookies">
          <h2 id="cookies">Cookies and local storage</h2>
          <p>The site does not set cookies. It stores one item in your browser&apos;s local storage, <code>sparkv-theme</code>, to remember your light or dark theme choice. It holds no personal information and stays on your device.</p>
        </section>

        <section aria-labelledby="choices">
          <h2 id="choices">Your choices and how to reach us</h2>
          <p>To ask us to correct or delete what you sent, or to ask any question about this notice, email <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>.</p>
        </section>

        <section aria-labelledby="changes">
          <h2 id="changes">Changes to this notice</h2>
          <p>We may update this notice as the site changes. The date at the top shows when it was last updated.</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
