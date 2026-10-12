import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SubMenu } from "@/components/sub-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { SparkVLogo } from "@/components/sparkv-logo";
import { SERVICES } from "@/lib/services";
import { SITE_COUNTRY, SITE_EMAIL, SITE_REGION, SOCIAL_PROFILES } from "@/lib/site";

/** Server-rendered header/footer for pages other than the homepage. No client JS required. */
export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="SparkV home">
        <SparkVLogo />
      </Link>
      <nav className="desktop-nav" aria-label="Primary">
        <Link href="/services">Services</Link>
        <Link href="/#systems">Systems</Link>
        <Link href="/#work">Work</Link>
        <Link href="/#process">Process</Link>
        <Link href="/#about">About</Link>
      </nav>
      <div className="header-actions">
        <ThemeToggle />
        <Link href="/#contact" className="header-cta">
          Start a project <ArrowUpRight size={15} />
        </Link>
        <SubMenu>
          <Link href="/services">Services</Link>
          <Link href="/#systems">Systems</Link>
          <Link href="/#work">Work</Link>
          <Link href="/#process">Process</Link>
          <Link href="/#about">About</Link>
          <Link href="/#contact">Contact</Link>
        </SubMenu>
      </div>
    </header>
  );
}

/** "Follow" link list; renders nothing until SOCIAL_PROFILES has entries. Shared by both footers. */
export function FooterFollow() {
  if (!SOCIAL_PROFILES.length) return null;
  return (
    <div>
      <strong>Follow</strong>
      {SOCIAL_PROFILES.map((p) => (
        <a key={p.url} href={p.url} rel="me noopener" target="_blank">
          {p.name}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ))}
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <div className="footer-main">
        <div>
          <SparkVLogo />
          <p>
            Software. AI. Automation.
            <br />
            Built for what’s next.
          </p>
        </div>
        <div>
          <strong>Services</strong>
          {SERVICES.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`}>
              {s.name}
            </Link>
          ))}
        </div>
        <div>
          <strong>Company</strong>
          <Link href="/#work">Work</Link>
          <Link href="/#process">Process</Link>
          <Link href="/#about">About</Link>
          <Link href="/#contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
        </div>
        <FooterFollow />
        <Link href="/" className="back-top">
          Home <ArrowUpRight />
        </Link>
      </div>
      <div className="footer-bottom">
        <span>© 2026 SparkV. All rights reserved.</span>
        <span><a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a> · {SITE_REGION}, {SITE_COUNTRY}</span>
      </div>
    </footer>
  );
}

export function Breadcrumbs({ trail }: { trail: { name: string; href?: string }[] }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        {trail.map((c, i) => (
          <li key={c.name}>
            {c.href ? <Link href={c.href}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}
            {i < trail.length - 1 && <span aria-hidden="true"> / </span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
