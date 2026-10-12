import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/components/v2/site-chrome";
import { JsonLd } from "@/components/json-ld";
import { ApplyForm } from "@/components/apply-form";
import { COMPENSATION_LINE, JOBS, getJob, type Job } from "@/lib/jobs";
import { OG_IMAGE, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import { v2Path } from "@/lib/v2";

export const dynamicParams = false;

export function generateStaticParams() {
  return JOBS.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const job = getJob((await params).slug);
  if (!job) return {};
  const url = absoluteUrl(v2Path(`/careers/${job.slug}`));
  const title = `${job.title} - Careers`;
  return {
    title,
    description: job.summary,
    alternates: { canonical: url },
    openGraph: { type: "website", url, siteName: SITE_NAME, title: `${title} | ${SITE_NAME}`, description: job.summary, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title: `${title} | ${SITE_NAME}`, description: job.summary, images: [OG_IMAGE.url] },
  };
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);
const ul = (items: string[]) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;

function descriptionHtml(job: Job) {
  return [
    `<p>${esc(job.summary)}</p>`,
    `<h3>What you will do</h3>${ul(job.responsibilities)}`,
    `<h3>What we are looking for</h3>${ul(job.requirements)}`,
    `<h3>Nice to have</h3>${ul(job.niceToHave)}`,
    `<h3>Compensation</h3><p>${esc(COMPENSATION_LINE)}</p>`,
  ].join("");
}

function jobPostingLd(job: Job) {
  const url = absoluteUrl(v2Path(`/careers/${job.slug}`));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "JobPosting",
        "@id": `${url}#job`,
        url,
        title: job.title,
        description: descriptionHtml(job),
        identifier: { "@type": "PropertyValue", name: SITE_NAME, value: job.slug },
        datePosted: job.datePosted,
        validThrough: job.validThrough,
        employmentType: job.employmentType,
        directApply: true,
        jobLocationType: "TELECOMMUTE",
        applicantLocationRequirements: { "@type": "Country", name: "India" },
        hiringOrganization: {
          "@type": "Organization",
          name: SITE_NAME,
          sameAs: SITE_URL,
          url: SITE_URL,
          logo: `${SITE_URL}/sparkv-logo.png`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl(v2Path("/")) },
          { "@type": "ListItem", position: 2, name: "Careers", item: absoluteUrl(v2Path("/careers")) },
          { "@type": "ListItem", position: 3, name: job.title, item: url },
        ],
      },
    ],
  };
}

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const job = getJob((await params).slug);
  if (!job) notFound();

  return (
    <div className="sub-page">
      <JsonLd data={jobPostingLd(job)} />
      <SiteHeader />
      <main id="main" className="sub-main">
        <Breadcrumbs trail={[{ name: "Home", href: v2Path("/") }, { name: "Careers", href: v2Path("/careers") }, { name: job.title }]} />
        <article>
          <header className="sub-hero">
            <p className="section-label"><span />{job.team.toUpperCase()}</p>
            <h1>{job.title}</h1>
            <p className="sub-answer">{job.summary}</p>
            <dl className="job-facts">
              <div><dt>Location</dt><dd>{job.location}</dd></div>
              <div><dt>Type</dt><dd>Full-time</dd></div>
              <div><dt>Posted</dt><dd><time dateTime={job.datePosted}>12 Oct 2026</time></dd></div>
              <div><dt>Compensation</dt><dd>{COMPENSATION_LINE}</dd></div>
            </dl>
          </header>

          <div className="sub-grid">
            <section aria-labelledby="do">
              <h2 id="do">What you will do</h2>
              <ul>{job.responsibilities.map((r) => <li key={r}>{r}</li>)}</ul>
            </section>
            <section aria-labelledby="need">
              <h2 id="need">What we are looking for</h2>
              <ul>{job.requirements.map((r) => <li key={r}>{r}</li>)}</ul>
            </section>
          </div>

          <section aria-labelledby="nice">
            <h2 id="nice">Nice to have</h2>
            <ul className="sub-list">{job.niceToHave.map((r) => <li key={r}>{r}</li>)}</ul>
          </section>

          <section aria-labelledby="hire">
            <h2 id="hire">How we hire for this role</h2>
            <ol className="sub-list">{job.howWeHire.map((r) => <li key={r}>{r}</li>)}</ol>
          </section>

          <section aria-labelledby="apply-title" id="apply">
            <h2 id="apply-title">Apply</h2>
            <ApplyForm jobSlug={job.slug} jobTitle={job.title} roleLinkLabel={job.roleLinkLabel} />
          </section>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
