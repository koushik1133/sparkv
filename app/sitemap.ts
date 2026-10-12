import type { MetadataRoute } from "next";
import { JOBS } from "@/lib/jobs";
import { SERVICES } from "@/lib/services";
import { CONTENT_UPDATED, LEGAL_UPDATED, absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Only canonical, indexable, 200-status URLs. lastModified is the date the content was
  // actually revised, not the build time.
  const lastModified = new Date(CONTENT_UPDATED);
  return [
    { url: absoluteUrl("/"), lastModified, priority: 1 },
    { url: absoluteUrl("/services"), lastModified, priority: 0.8 },
    { url: absoluteUrl("/privacy"), lastModified: new Date(LEGAL_UPDATED), priority: 0.3 },
    { url: absoluteUrl("/terms"), lastModified: new Date(LEGAL_UPDATED), priority: 0.3 },
    { url: absoluteUrl("/cookies"), lastModified: new Date(LEGAL_UPDATED), priority: 0.3 },
    { url: absoluteUrl("/careers"), lastModified, priority: 0.5 },
    ...JOBS.map((j) => ({ url: absoluteUrl(`/careers/${j.slug}`), lastModified, priority: 0.5 })),
    ...SERVICES.map((s) => ({ url: absoluteUrl(`/services/${s.slug}`), lastModified, priority: 0.7 })),
  ];
}
