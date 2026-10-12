import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { JsonLd } from "@/components/json-ld";
import { PROCESS, SERVICES, getService } from "@/lib/services";
import { CONTENT_UPDATED, OG_IMAGE, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};
  const url = absoluteUrl(`/services/${service.slug}`);
  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, siteName: SITE_NAME, title: `${service.title} | ${SITE_NAME}`, description: service.description, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title: `${service.title} | ${SITE_NAME}`, description: service.description, images: [OG_IMAGE.url] },
  };
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const service = getService((await params).slug);
  if (!service) notFound();
  const url = absoluteUrl(`/services/${service.slug}`);
  const related = service.related.map((slug) => getService(slug)).filter((s) => s !== undefined);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: `${service.title} | ${SITE_NAME}`,
        description: service.description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${url}#service` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        dateModified: CONTENT_UPDATED,
        inLanguage: "en",
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.name,
        serviceType: service.serviceType,
        description: service.description,
        url,
        provider: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Services", item: absoluteUrl("/services") },
          { "@type": "ListItem", position: 3, name: service.name, item: url },
        ],
      },
    ],
  };

  return (
    <div className="sub-page">
      <JsonLd data={jsonLd} />
      <SiteHeader />
      <main id="main" className="sub-main">
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Services", href: "/services" }, { name: service.name }]} />
        <article>
          <header className="sub-hero">
            <p className="section-label"><span />SERVICE</p>
            <h1>{service.h1}</h1>
            <p className="sub-answer">{service.answer}</p>
            <div className="sub-cta">
              <Link href="/#contact" className="button button-primary">Start a project <ArrowUpRight size={18} /></Link>
            </div>
          </header>

          <section aria-labelledby="terms">
            <h2 id="terms">Key terms</h2>
            <dl style={{ margin: 0 }}>
              {service.terms.map((t) => (
                <div key={t.term} style={{ margin: "0 0 14px" }}>
                  <dt style={{ fontWeight: 600 }}>{t.term}</dt>
                  <dd style={{ margin: 0, color: "var(--muted)" }}>
                    {t.definition}
                    {t.source && <> Source: <a href={t.source.url} rel="noopener" target="_blank">{t.source.label}</a>.</>}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="sub-grid">
            <section aria-labelledby="who">
              <h2 id="who">Who it’s for</h2>
              <ul>{service.audience.map((a) => <li key={a}>{a}</li>)}</ul>
            </section>
            <section aria-labelledby="problems">
              <h2 id="problems">Problems it solves</h2>
              <ul>{service.problems.map((p) => <li key={p}>{p}</li>)}</ul>
            </section>
          </div>

          <section aria-labelledby="approach">
            <h2 id="approach">How SparkV approaches it</h2>
            <div className="sub-cards">
              {service.approach.map((a) => (
                <div key={a.title}>
                  <h3>{a.title}</h3>
                  <p>{a.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="included">
            <h2 id="included">What’s included</h2>
            <ul className="sub-list">{service.included.map((i) => <li key={i}>{i}</li>)}</ul>
          </section>

          {service.extra && (
            <section aria-labelledby={`${service.extra.id}-title`} id={service.extra.id}>
              <h2 id={`${service.extra.id}-title`}>{service.extra.title}</h2>
              <p>{service.extra.body}</p>
              <ul className="sub-list">{service.extra.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </section>
          )}

          {service.comparison && (
            <section aria-labelledby="compare">
              <h2 id="compare">{service.comparison.title}</h2>
              <p>{service.comparison.intro}</p>
              <div style={{ overflowX: "auto" }} className="table-scroll" role="region" aria-label={`${service.comparison.title} (scrollable table)`} tabIndex={0}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
                  <thead>
                    <tr>{service.comparison.columns.map((c, i) => <th key={i} scope="col" style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid var(--line)" }}>{c || "Aspect"}</th>)}</tr>
                  </thead>
                  <tbody>
                    {service.comparison.rows.map((r) => (
                      <tr key={r[0]}>
                        <th scope="row" style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid var(--line)" }}>{r[0]}</th>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--line)" }}>{r[1]}</td>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--line)" }}>{r[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <section aria-labelledby="process">
            <h2 id="process">How a project runs</h2>
            <ol className="sub-steps">
              {PROCESS.map((p) => (
                <li key={p.name}>
                  <strong>{p.name}</strong>
                  <span>{p.body}</span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="tech">
            <h2 id="tech">Technology considerations</h2>
            <p>{service.stack}</p>
          </section>

          <section aria-labelledby="deliver">
            <h2 id="deliver">What you get</h2>
            <ul className="sub-list">{service.deliverables.map((d) => <li key={d}>{d}</li>)}</ul>
          </section>

          <section aria-labelledby="limits">
            <h2 id="limits">Scope and limits</h2>
            <ul className="sub-list">{service.limits.map((l) => <li key={l}>{l}</li>)}</ul>
          </section>

          <section aria-labelledby="faq">
            <h2 id="faq">Common questions</h2>
            <div className="sub-faq">
              {service.faqs.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="sub-final" aria-labelledby="next">
            <h2 id="next">Have something worth building?</h2>
            <p>Tell SparkV what you are trying to build, automate, or improve. The next step is a focused conversation about the problem and the strongest way to solve it.</p>
            <Link href="/#contact" className="button button-primary">Start a project <ArrowUpRight size={18} /></Link>
          </section>

          <nav className="sub-related" aria-label="Related services">
            <h2>Related services</h2>
            <ul>
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/services/${r.slug}`}>
                    <strong>{r.name}</strong>
                    <span>{r.description}</span>
                    <em>Read more <ArrowRight size={14} /></em>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
