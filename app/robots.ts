import type { MetadataRoute } from "next";
import { IS_INDEXABLE, SITE_URL, V2_INDEXABLE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Non-production deployments (Vercel previews, local builds) must never be crawled.
  if (!IS_INDEXABLE) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    // DECISION (owner, 7 Oct 2026): allow every crawler, including AI training crawlers (GPTBot,
    // ClaudeBot, Google-Extended) and AI search crawlers (OAI-SearchBot, PerplexityBot, Claude-SearchBot).
    // To opt out of training only, add separate groups for the training user-agents with
    // `disallow: "/"` AND repeat `disallow: "/api/"` for any group that overrides "*"; keep search bots allowed.
    // See docs/SEO-AUDIT.md for the verified crawler list.
    // Public marketing pages and rendering assets stay crawlable; only the API is excluded.
    // V2 (the /2 preview) is kept out of crawls until V2_INDEXABLE is flipped (docs/DUAL-SITE.md).
    rules: { userAgent: "*", allow: "/", disallow: V2_INDEXABLE ? ["/api/"] : ["/api/", "/2"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
