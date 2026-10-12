import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/v2/site-chrome";
import { SERVICES } from "@/lib/services";
import { v2Path } from "@/lib/v2";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="sub-page">
      <SiteHeader />
      <main id="main" className="sub-main sub-404">
        <p className="section-label"><span />ERROR 404</p>
        <h1>That page doesn’t exist.</h1>
        <p className="sub-answer">The link may be outdated or mistyped. Here is where you can go next.</p>
        <div className="sub-cta">
          <Link href={v2Path("/")} className="button button-primary">Back to the homepage <ArrowUpRight size={18} /></Link>
          <Link href={v2Path("/#contact")} className="button button-ghost">Start a project</Link>
        </div>
        <nav className="sub-related" aria-label="Services">
          <h2>Explore SparkV services</h2>
          <ul>
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link href={v2Path(`/services/${s.slug}`)}>
                  <strong>{s.name}</strong>
                  <span>{s.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}
