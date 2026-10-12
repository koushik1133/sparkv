import { IS_INDEXABLE, V2_INDEXABLE } from "@/lib/site";

export const V2_PREFIX = "/2";

/** True when V2 pages may be indexed (production deployment AND V2_INDEXABLE). */
export const V2_ROBOTS_INDEX = IS_INDEXABLE && V2_INDEXABLE;

/** Robots metadata for every V2 page. */
export const V2_ROBOTS = V2_ROBOTS_INDEX
  ? { index: true, follow: true }
  : { index: false, follow: false };

/**
 * Map a V1-style internal path to its V2 equivalent so links never leave the /2 tree.
 * "/" -> "/2", "/#contact" -> "/2#contact", "/services/x" -> "/2/services/x".
 * Hash-only, absolute URLs, /api, /.well-known and already-prefixed paths are returned unchanged.
 */
export function v2Path(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  if (path === V2_PREFIX || path.startsWith(`${V2_PREFIX}/`) || path.startsWith(`${V2_PREFIX}#`) || path.startsWith(`${V2_PREFIX}?`)) return path;
  if (path.startsWith("/api/") || path.startsWith("/.well-known/")) return path;
  if (path === "/") return V2_PREFIX;
  if (path.startsWith("/#") || path.startsWith("/?")) return V2_PREFIX + path.slice(1);
  return V2_PREFIX + path;
}
