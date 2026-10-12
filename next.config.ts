import type { NextConfig } from "next";
import { V2_INDEXABLE } from "./lib/site";

// HSTS `preload` is deliberately omitted: it is a long-lived, hard-to-reverse commitment for every
// subdomain and needs an explicit hstspreload.org submission decision by the domain owner.
// COOP/COEP/CORP are deliberately not set: they can break third-party embeds/popups for no benefit here.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  // Non-script CSP directives only. A script-src policy would need per-request nonces or
  // 'unsafe-inline' (Next RSC payload, inline theme script, JSON-LD), so it is deliberately not set.
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  reactStrictMode: true,
  // Two root layouts (V1 at "/", V2 at "/2") => unmatched URLs render app/global-not-found.tsx.
  experimental: { globalNotFound: true },
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // V2 (the /2 redesign preview) stays out of the index until V2_INDEXABLE is flipped (docs/DUAL-SITE.md).
      ...(V2_INDEXABLE
        ? []
        : [{ source: "/2/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }]),
      // The *.vercel.app alias serves the same site; keep it out of the index so only www.sparkv.si ranks.
      {
        source: "/:path*",
        has: [{ type: "host", value: "(?<host>.*\\.vercel\\.app)" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
