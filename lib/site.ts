/**
 * Single source of truth for the public site identity.
 *
 * SITE_URL is intentionally a constant, not an env var: a stale NEXT_PUBLIC_SITE_URL
 * in the hosting dashboard previously made canonicals, Open Graph URLs, schema and the
 * sitemap point at the *.vercel.app host instead of the real domain.
 */
export const SITE_URL = "https://www.sparkv.si";
export const SITE_NAME = "SparkV";
/** Public contact details, supplied by the site owner. Shown in the footer and mirrored in the Organization schema. */
export const SITE_EMAIL = "sparkv.info@gmail.com";
export const SITE_REGION = "Telangana";
export const SITE_COUNTRY_CODE = "IN";
export const SITE_COUNTRY = "India";
export const SITE_TAGLINE = "Custom software, AI agents & business automation";
export const SITE_DESCRIPTION =
  "SparkV designs and builds websites, web apps, AI agents, and business automation—production-ready software for founders, operators, and engineering teams.";

/**
 * Official social/profile URLs. Keep EMPTY until the accounts exist and are public.
 * Entries here feed the Organization `sameAs` schema and the footer "Follow" list;
 * when empty, neither is rendered. Never add placeholders or unverified URLs.
 * Example shape: { name: "LinkedIn", url: "https://www.linkedin.com/company/<slug>" }
 */
export const SOCIAL_PROFILES: { name: string; url: string }[] = [];

/** Search-console verification tokens (the content value only). Empty = no meta tag emitted. */
export const GOOGLE_SITE_VERIFICATION = "";
export const BING_SITE_VERIFICATION = "";

/** Date the public content was last meaningfully revised (used by the sitemap and schema). */
export const CONTENT_UPDATED = "2026-10-07";

/** Date the legal pages (privacy, terms, cookies) were last revised. */
export const LEGAL_UPDATED = "2026-10-12";

/**
 * Only production deployments should be indexed. Vercel preview URLs and local builds must
 * not compete with, or be confused for, the canonical site.
 */
export const IS_INDEXABLE = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.NODE_ENV === "production";

export const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "SparkV — custom software, AI agents and business automation",
};

export const absoluteUrl = (path = "/") => `${SITE_URL}${path === "/" ? "" : path}`;
