#!/usr/bin/env node
// Fast, no-browser static budget check against the production build in .next.
// Usage: npm run build && node scripts/check-budgets.mjs
// Checks both sites of the dual-site app: V1 homepage ("/") and the V2 homepage ("/2").
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const root = process.cwd();
const nextDir = path.join(root, ".next");
const budgetFile = JSON.parse(fs.readFileSync(path.join(root, "docs/performance-budgets.json"), "utf8"));
const budgets = budgetFile.static;

const pages = [
  { label: "V1 /", html: "server/app/index.html" },
  { label: "V2 /2", html: "server/app/2.html" },
];
for (const p of pages) {
  const file = path.join(nextDir, p.html);
  if (!fs.existsSync(file)) {
    console.error(`Missing ${file}. Run a production build first (VERCEL_ENV=production npm run build).`);
    process.exit(2);
  }
  p.source = fs.readFileSync(file, "utf8");
}

const gz = (file) => zlib.gzipSync(fs.readFileSync(file), { level: 9 }).length;
const staticFile = (u) => path.join(nextDir, "static", u.replace(/^\/_next\/static\//, ""));
// Route-group chunk paths contain parentheses, e.g. /_next/static/chunks/app/(v1)/page-xxx.js
const refsOf = (html) => [...new Set([...html.matchAll(/\/_next\/static\/[^"'\s\\]+?\.(js|css|woff2?|ttf|otf)/g)].map((m) => m[0]))];
const sum = (files) => files.reduce((a, f) => (fs.existsSync(staticFile(f)) ? a + gz(staticFile(f)) : a), 0);

// Fonts: any font file anywhere in the build output or public/.
const walk = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)])) : []);
const fontOnDisk = [...walk(path.join(nextDir, "static")), ...walk(path.join(root, "public"))].filter((f) => /\.(woff2?|ttf|otf|eot)$/i.test(f));

// Image bytes: raster/vector files shipped from public/ (raw bytes, as served).
const imgs = walk(path.join(root, "public")).filter((f) => /\.(png|jpe?g|gif|webp|avif|svg|ico)$/i.test(f));
const imgBytes = imgs.reduce((a, f) => a + fs.statSync(f).size, 0);

const rows = [];
for (const p of pages) {
  const refs = refsOf(p.source);
  const jsFiles = refs.filter((r) => r.endsWith(".js"));
  const cssFiles = refs.filter((r) => r.endsWith(".css"));
  const fontRefs = refs.filter((r) => /\.(woff2?|ttf|otf)$/.test(r));
  console.log(`${p.label}: references ${jsFiles.length} JS, ${cssFiles.length} CSS, ${fontRefs.length} font files`);
  rows.push([`${p.label} first-load JS (gzip B)`, sum(jsFiles), budgets.homepageFirstLoadJsGzipBytes]);
  // CSS actually loaded by this page (each site ships its own stylesheet, so a build-wide total would double count).
  rows.push([`${p.label} CSS (gzip B)`, sum(cssFiles), budgets.totalCssGzipBytes]);
  p.js = sum(jsFiles);
}
rows.push(["Font files (count)", new Set(fontOnDisk).size, budgets.fontFiles]);
rows.push(["public/ image bytes (B)", imgBytes, budgets.publicImageBytes]);

// V1 must stay close to the original single-site build (baseline measured on `main`).
if (budgets.v1BaselineJsGzipBytes) {
  const v1 = pages[0].js;
  rows.push(["V1 JS vs main baseline (+B)", v1 - budgets.v1BaselineJsGzipBytes, budgets.v1BaselineToleranceBytes ?? 1024]);
}

const pad = (s, n) => String(s).padEnd(n);
console.log("");
console.log(pad("Metric", 34), pad("Actual", 10), pad("Budget", 10), pad("Delta", 10), "Status");
let failed = false;
for (const [name, actual, budget] of rows) {
  const over = actual > budget;
  if (over) failed = true;
  const delta = actual - budget;
  console.log(pad(name, 34), pad(actual, 10), pad(budget, 10), pad((delta > 0 ? "+" : "") + delta, 10), over ? "FAIL" : "ok");
}
if (failed) {
  console.error("\nBudget exceeded. Raise a budget only in the same PR, with measured justification (see docs/PERFORMANCE.md).");
  process.exit(1);
}
console.log("\nAll static budgets met.");
