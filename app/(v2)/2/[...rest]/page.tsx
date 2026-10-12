import { notFound } from "next/navigation";

// Unknown /2/... URLs render the V2-styled not-found page (app/(v2)/not-found.tsx) inside the V2 layout.
export default function V2CatchAll() {
  notFound();
}
