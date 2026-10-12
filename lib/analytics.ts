// Thin, fail-safe wrapper around @vercel/analytics `track`. Never throws, never sends
// personal data: callers pass only fixed event names and coarse, non-personal properties.
export type EventName = "cta_click" | "email_click" | "outbound_click" | "lead_submitted" | "application_submitted" | "service_view";
type Props = Record<string, string | number | boolean | null>;

export function trackEvent(name: EventName, props?: Props): void {
  try {
    void import("@vercel/analytics")
      .then((m) => m.track(name, props))
      .catch(() => {});
  } catch {
    /* analytics blocked or unavailable: no-op */
  }
}

/** Hosts where analytics is active. Previews, localhost and *.vercel.app never report. */
export function isProductionHost(hostname: string): boolean {
  return hostname === "www.sparkv.si" || hostname === "sparkv.si";
}

/** Map a clicked anchor to an event, or null. Reads only href and ancestor ids. */
export function classifyLink(a: HTMLAnchorElement, origin: string): { name: EventName; props: Props } | null {
  const raw = a.getAttribute("href") ?? "";
  if (raw === "#contact" || raw === "/#contact") {
    const section = a.closest("[id]:not(#main)")?.id ?? "unknown";
    return { name: "cta_click", props: { section } };
  }
  if (raw.toLowerCase().startsWith("mailto:")) return { name: "email_click", props: {} };
  try {
    const u = new URL(a.href, origin);
    if ((u.protocol === "http:" || u.protocol === "https:") && u.origin !== origin) {
      return { name: "outbound_click", props: { host: u.hostname } };
    }
  } catch {
    /* ignore */
  }
  return null;
}
