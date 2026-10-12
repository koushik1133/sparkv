import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/components/v2/site-chrome";
import { JsonLd } from "@/components/json-ld";
import { JOBS } from "@/lib/jobs";
import { CONTENT_UPDATED, OG_IMAGE, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import { v2Path } from "@/lib/v2";

const TITLE = "Careers";
const DESCRIPTION =
  "Open roles at SparkV: AI Engineer, Software Engineer, Forward Deployed Engineer and Video Editor. Remote, India-based. See how we hire and apply online.";
const url = absoluteUrl(v2Path("/careers"));

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: url },
  openGraph: { type: "website", url, siteName: SITE_NAME, title: `${TITLE} | ${SITE_NAME}`, description: DESCRIPTION, images: [OG_IMAGE] },
  twitter: { card: "summary_large_image", title: `${TITLE} | ${SITE_NAME}`, description: DESCRIPTION, images: [OG_IMAGE.url] },
};

export default function CareersPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#webpage`,
        url,
        name: `${TITLE} | ${SITE_NAME}`,
        description: DESCRIPTION,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        mainEntity: { "@id": `${url}#jobs` },
        dateModified: CONTENT_UPDATED,
        inLanguage: "en",
      },
      {
        "@type": "ItemList",
        "@id": `${url}#jobs`,
        name: "Open roles at SparkV",
        numberOfItems: JOBS.length,
        itemListElement: JOBS.map((j, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: absoluteUrl(v2Path(`/careers/${j.slug}`)),
          name: j.title,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl(v2Path("/")) },
          { "@type": "ListItem", position: 2, name: "Careers", item: url },
        ],
      },
    ],
  };

  return (
    <div className="sub-page">
      <JsonLd data={jsonLd} />
      <SiteHeader />
      <main id="main" className="sub-main">
        <Breadcrumbs trail={[{ name: "Home", href: v2Path("/") }, { name: "Careers" }]} />
        <header className="sub-hero">
          <p className="section-label"><span />CAREERS</p>
          <h1>Build software, AI and automation with SparkV</h1>
          <p className="sub-answer">
            SparkV is a small studio in Telangana, India, building custom software, AI agents and business automation for clients. We are hiring for {JOBS.length} remote roles, open to people based in India.
          </p>
        </header>

        <section aria-labelledby="open-roles">
          <h2 id="open-roles">Open roles</h2>
          <ul className="job-list">
            {JOBS.map((j) => (
              <li key={j.slug}>
                <Link href={v2Path(`/careers/${j.slug}`)} className="job-card">
                  <span className="job-meta">{j.team} · {j.location}</span>
                  <strong>{j.title}</strong>
                  <span className="job-summary">{j.summary}</span>
                  <em>View role and apply <ArrowRight size={14} aria-hidden="true" /></em>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="how-we-hire" className="job-prose">
          <h2 id="how-we-hire">How we hire</h2>
          <ol>
            <li>You apply online with a short note on why the role interests you. A person reads it.</li>
            <li>If there is a fit, we set up a short intro call.</li>
            <li>A small, scoped practical exercise based on the real work. Details are shared first.</li>
            <li>A conversation with the people you would work with, then a decision.</li>
          </ol>
          <p>
            We do not promise a reply to every application, and timelines vary. Compensation is discussed during the process.
          </p>
        </section>

        <section aria-labelledby="your-data" className="job-prose">
          <h2 id="your-data">Your application data</h2>
          <p>
            We use what you send only to assess your application. See the <Link href={v2Path("/privacy#applicants")}>applicant section of our Privacy Notice</Link> for what we keep, for how long, and how to ask for deletion.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
