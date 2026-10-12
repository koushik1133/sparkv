"use client";

import { useEffect, useState, type ComponentType } from "react";
import { usePathname } from "next/navigation";
import { classifyLink, isProductionHost, trackEvent } from "@/lib/analytics";

/**
 * Real-user monitoring + privacy-friendly analytics. Mount once in app/layout.tsx.
 * Everything happens after hydration, only on the production hostname, and the two
 * Vercel packages are code-split (dynamic import) so they stay out of the initial JS.
 */
export default function Telemetry() {
  const [parts, setParts] = useState<ComponentType[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    if (!isProductionHost(window.location.hostname)) return;
    const load = () => {
      Promise.all([import("@vercel/analytics/next"), import("@vercel/speed-insights/next")])
        .then(([a, s]) => setParts([a.Analytics, s.SpeedInsights]))
        .catch(() => {});
    };
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(load, { timeout: 4000 });
    else setTimeout(load, 2000);
  }, []);

  useEffect(() => {
    if (!isProductionHost(window.location.hostname)) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a) return;
      const hit = classifyLink(a as HTMLAnchorElement, window.location.origin);
      if (hit) trackEvent(hit.name, hit.props);
    };
    const onLead = () => trackEvent("lead_submitted");
    document.addEventListener("click", onClick, { capture: true });
    window.addEventListener("sparkv:lead", onLead);
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("sparkv:lead", onLead);
    };
  }, []);

  useEffect(() => {
    if (isProductionHost(window.location.hostname) && pathname?.startsWith("/services/")) trackEvent("service_view", { path: pathname });
  }, [pathname]);

  return <>{parts.map((P, i) => <P key={i} />)}</>;
}
