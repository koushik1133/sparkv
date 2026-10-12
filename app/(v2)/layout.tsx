import type { Metadata, Viewport } from "next";
import "./v2globals.css";
import "./hybrid.css";
import { JsonLd } from "@/components/json-ld";
import Telemetry from "@/components/v2/telemetry";
import { V2_ROBOTS_INDEX } from "@/lib/v2";
import { BING_SITE_VERIFICATION, GOOGLE_SITE_VERIFICATION, SOCIAL_PROFILES, OG_IMAGE, SITE_COUNTRY_CODE, SITE_DESCRIPTION, SITE_EMAIL, SITE_NAME, SITE_REGION, SITE_URL } from "@/lib/site";

const V2_URL = `${SITE_URL}/2`;
const DEFAULT_TITLE = "SparkV | Custom Software, AI Agents & Business Automation";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#08080a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: DEFAULT_TITLE, template: "%s | SparkV" },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: V2_URL },
  robots: V2_ROBOTS_INDEX
    ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } }
    : { index: false, follow: false },
  openGraph: {
    type: "website",
    url: V2_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  ...(GOOGLE_SITE_VERIFICATION || BING_SITE_VERIFICATION
    ? {
        verification: {
          ...(GOOGLE_SITE_VERIFICATION ? { google: GOOGLE_SITE_VERIFICATION } : {}),
          ...(BING_SITE_VERIFICATION ? { other: { "msvalidate.01": BING_SITE_VERIFICATION } } : {}),
        },
      }
    : {}),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/sparkv-logo.png` },
      description: SITE_DESCRIPTION,
      email: SITE_EMAIL,
      address: { "@type": "PostalAddress", addressRegion: SITE_REGION, addressCountry: SITE_COUNTRY_CODE },
      contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: SITE_EMAIL },
      ...(SOCIAL_PROFILES.length ? { sameAs: SOCIAL_PROFILES.map((p) => p.url) } : {}),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem("sparkv-theme");var d=s?s==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.dataset.theme=d?"dark":"light";document.documentElement.style.colorScheme=d?"dark":"light"}catch(e){}})()`,
          }}
        />
      </head>
      <body className="antialiased">
        <a href="#main" className="skip-link">Skip to content</a>
        <JsonLd data={siteJsonLd} />
        {children}
        <Telemetry />
      </body>
    </html>
  );
}
