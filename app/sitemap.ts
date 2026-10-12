import type { MetadataRoute } from "next";
import { JOBS } from "@/lib/jobs";
import { SERVICES } from "@/lib/services";
import { CONTENT_UPDATED, LEGAL_UPDATED, V2_INDEXABLE, absoluteUrl } from "@/lib/site";
import { v2Path } from "@/lib/v2";

export default function sitemap(): MetadataRoute.Sitemap {
  // Only canonical, indexable, 200-status URLs. lastModified is the date the content was
  // actually revised, not the build time.
  const lastModified = new Date(CONTENT_UPDATED);
  const v1: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified, priority: 1 },
    { url: absoluteUrl("/services"), lastModified, priority: 0.8 },
    { url: absoluteUrl("/privacy"), lastModified, priority: 0.3 },
    ...SERVICES.map((s) => ({ url: absoluteUrl(`/services/${s.slug}`), lastModified, priority: 0.7 })),
  ];
  // V2 (the /2 redesign) is listed only once V2_INDEXABLE is flipped; see docs/DUAL-SITE.md.
  if (!V2_INDEXABLE) return v1;
  const legal = new Date(LEGAL_UPDATED);
  const v2: MetadataRoute.Sitemap = [
    { url: absoluteUrl(v2Path("/")), lastModified, priority: 0.9 },
    { url: absoluteUrl(v2Path("/services")), lastModified, priority: 0.7 },
    { url: absoluteUrl(v2Path("/privacy")), lastModified: legal, priority: 0.3 },
    { url: absoluteUrl(v2Path("/terms")), lastModified: legal, priority: 0.3 },
    { url: absoluteUrl(v2Path("/cookies")), lastModified: legal, priority: 0.3 },
    { url: absoluteUrl(v2Path("/careers")), lastModified, priority: 0.5 },
    ...JOBS.map((j) => ({ url: absoluteUrl(v2Path(`/careers/${j.slug}`)), lastModified, priority: 0.5 })),
    ...SERVICES.map((s) => ({ url: absoluteUrl(v2Path(`/services/${s.slug}`)), lastModified, priority: 0.6 })),
  ];
  return [...v1, ...v2];
}
