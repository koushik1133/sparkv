import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/components/v2/site-chrome";
import { JsonLd } from "@/components/json-ld";
import { LEGAL_UPDATED, OG_IMAGE, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import { V2_ROBOTS, v2Path } from "@/lib/v2";

/** "2026-10-12" -> "12 October 2026" (fixed locale/timezone so output is deterministic). */
export function formatLegalDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export function legalMetadata(path: string, title: string, description: string): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: V2_ROBOTS,
    openGraph: { type: "website", url, siteName: SITE_NAME, title: `${title} | ${SITE_NAME}`, description, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title: `${title} | ${SITE_NAME}`, description, images: [OG_IMAGE.url] },
  };
}

export function LegalPage({
  path, title, label, description, intro, children,
}: { path: string; title: string; label: string; description: string; intro: string; children: ReactNode }) {
  const url = absoluteUrl(path);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage", "@id": `${url}#webpage`, url, name: `${title} | ${SITE_NAME}`, description,
        isPartOf: { "@id": `${SITE_URL}/#website` }, breadcrumb: { "@id": `${url}#breadcrumb` }, inLanguage: "en",
        dateModified: LEGAL_UPDATED,
      },
      {
        "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl(v2Path("/")) },
          { "@type": "ListItem", position: 2, name: title, item: url },
        ],
      },
    ],
  };
  return (
    <div className="sub-page">
      <JsonLd data={jsonLd} />
      <SiteHeader />
      <main id="main" className="sub-main legal-main">
        <Breadcrumbs trail={[{ name: "Home", href: v2Path("/") }, { name: title }]} />
        <header className="sub-hero">
          <p className="section-label"><span />{label}</p>
          <h1>{title}</h1>
          <p className="sub-answer">Last updated: <time dateTime={LEGAL_UPDATED}>{formatLegalDate(LEGAL_UPDATED)}</time>. {intro}</p>
        </header>
        {children}
        <p className="legal-credit">Adapted from General Legal templates, CC0. This is a template-based document and not legal advice.</p>
      </main>
      <SiteFooter />
    </div>
  );
}
