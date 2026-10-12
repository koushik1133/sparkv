import { NextResponse } from "next/server";
import { createHmac, randomBytes } from "node:crypto";
import { CONSENT_VERSION, getJob } from "@/lib/jobs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[\d\s().-]{6,30}$/;
const MAX_BODY_BYTES = 6 * 1024 * 1024;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
// In-memory, per-instance: best-effort abuse damping only (same caveat as /api/contact).
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const text = (v: FormDataEntryValue | null, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ");
const fail = (error: string, status: number, fields?: Record<string, string>) =>
  NextResponse.json(fields ? { error, fields } : { error }, { status });

function cleanUrl(v: string): string | null {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:" ? u.toString().slice(0, 300) : null;
  } catch {
    return null;
  }
}

/** Reads the body with a hard byte cap so a missing/lying Content-Length cannot bypass the limit. */
async function readCapped(request: Request): Promise<Uint8Array | null> {
  if (!request.body) return new Uint8Array(0);
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BODY_BYTES) {
      void reader.cancel().catch(() => {});
      return null;
    }
    chunks.push(value);
  }
  const out = new Uint8Array(total);
  let o = 0;
  for (const c of chunks) {
    out.set(c, o);
    o += c.byteLength;
  }
  return out;
}

type Kind = "pdf" | "doc" | "docx";
function detectKind(name: string, b: Uint8Array): Kind | null {
  const ext = name.toLowerCase().match(/\.(pdf|docx?)$/)?.[1] as Kind | undefined;
  if (!ext) return null;
  const starts = (sig: number[]) => b.length >= sig.length && sig.every((x, i) => b[i] === x);
  if (ext === "pdf") return starts([0x25, 0x50, 0x44, 0x46, 0x2d]) ? "pdf" : null;
  if (ext === "doc") return starts([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]) ? "doc" : null;
  return starts([0x50, 0x4b, 0x03, 0x04]) ? "docx" : null;
}

async function sendResend(apiKey: string, payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10_000),
  });
  return res.status;
}

async function postWebhook(url: string, secret: string, body: string) {
  const sig = createHmac("sha256", secret).update(body).digest("hex");
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-SparkV-Signature": sig },
        body,
        signal: AbortSignal.timeout(10_000),
      });
      if (res.ok) return;
      console.error("Hiring webhook rejected", res.status);
    } catch {
      console.error("Hiring webhook request failed or timed out");
    }
  }
}

function newApplicationId() {
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `SV-${d}-${randomBytes(3).toString("hex")}`;
}

const SHELL = (inner: string) =>
  `<!doctype html><html><body style="margin:0;background:#f5f5f2;color:#111;font-family:Arial,sans-serif"><div style="max-width:640px;margin:0 auto;padding:32px 20px"><div style="padding:28px;border:1px solid #deded8;background:#fff"><div style="margin-bottom:22px;color:#c4121b;font-size:12px;font-weight:700;letter-spacing:.16em">SPARKV CAREERS</div>${inner}</div></div></body></html>`;

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    let originHost: string | null = null;
    try {
      originHost = new URL(origin).host;
    } catch {
      originHost = null;
    }
    if (originHost !== request.headers.get("host")) return fail("Invalid request.", 403);
  }
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) return fail("Request too large.", 413);
  if (!(request.headers.get("content-type") ?? "").toLowerCase().startsWith("multipart/form-data")) {
    return fail("Invalid request.", 415);
  }
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) return fail("Too many submissions. Please try again later.", 429);

  let form: FormData;
  try {
    const bytes = await readCapped(request);
    if (!bytes) return fail("Request too large.", 413);
    form = await new Response(bytes as BodyInit, { headers: { "content-type": request.headers.get("content-type") ?? "" } }).formData();
  } catch {
    return fail("Invalid request.", 400);
  }

  if (text(form.get("companyWebsite"), 200)) return NextResponse.json({ ok: true });

  const name = text(form.get("name"), 100);
  const email = text(form.get("email"), 254).toLowerCase();
  const phone = text(form.get("phone"), 30);
  const location = text(form.get("location"), 100);
  const noticePeriod = text(form.get("noticePeriod"), 60);
  const profileUrl = text(form.get("profileUrl"), 300);
  const roleLink = text(form.get("roleLink"), 300);
  const note = text(form.get("note"), 2000);
  const jobSlug = text(form.get("jobSlug"), 80);
  const consent = form.get("consent");

  if ([name, email, phone, location, noticePeriod, profileUrl, roleLink].some((v) => /[\r\n]/.test(v))) {
    return fail("Invalid request.", 422);
  }
  const job = getJob(jobSlug);
  if (!job) return fail("This role is not open for applications.", 422, { jobSlug: "Unknown role." });

  const fields: Record<string, string> = {};
  if (name.length < 2) fields.name = "Enter your full name.";
  if (!EMAIL_PATTERN.test(email)) fields.email = "Enter a valid email address.";
  if (phone && !PHONE_PATTERN.test(phone)) fields.phone = "Enter a valid phone number.";
  if (location.length < 2) fields.location = "Enter your location.";
  if (note.length < 20) fields.note = "Write at least a couple of sentences (20 characters or more).";
  const profile = profileUrl ? cleanUrl(profileUrl) : "";
  if (profile === null) fields.profileUrl = "Enter a full link starting with https://";
  const role = roleLink ? cleanUrl(roleLink) : "";
  if (role === null) fields.roleLink = "Enter a full link starting with https://";
  if (consent !== "on" && consent !== "true") fields.consent = "Please confirm you have read the privacy notice.";

  const file = form.get("resume");
  let fileBytes: Uint8Array | null = null;
  let kind: Kind | null = null;
  let filename = "";
  if (!(file instanceof File) || file.size === 0) {
    fields.resume = "Attach your resume as PDF, DOC or DOCX.";
  } else if (file.size > MAX_FILE_BYTES) {
    fields.resume = "File is larger than 5 MB.";
  } else {
    fileBytes = new Uint8Array(await file.arrayBuffer());
    kind = detectKind(file.name, fileBytes);
    if (!kind) fields.resume = "Resume must be a genuine PDF, DOC or DOCX file.";
    filename = file.name.split(/[\\/]/).pop()!.replace(/[^\w.\- ]+/g, "_").slice(0, 100) || `resume.${kind ?? "pdf"}`;
  }
  if (Object.keys(fields).length || !fileBytes || !kind) {
    return fail("Please check the highlighted fields.", 422, fields);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.HIRING_TO_EMAIL || process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "SparkV Careers <onboarding@resend.dev>";
  if (!apiKey?.startsWith("re_") || !to) {
    console.error("Applications are missing RESEND_API_KEY or HIRING_TO_EMAIL/CONTACT_TO_EMAIL.");
    return fail("Applications are temporarily unavailable. Please try again shortly.", 503);
  }

  const applicationId = newApplicationId();
  const receivedAt = new Date().toISOString();
  const rows: [string, string][] = [
    ["Application ID", applicationId], ["Role", job.title], ["Name", name], ["Email", email],
    ["Phone", phone || "-"], ["Location", location], ["Notice period", noticePeriod || "-"],
    ["Profile link", profile || "-"], [`Role link`, role || "-"], ["Resume", `${filename} (${fileBytes.byteLength} bytes)`],
  ];
  const owner = {
    from, to: [to], reply_to: email,
    subject: oneLine(`[SparkV Careers] ${job.title} - ${name} (${applicationId})`),
    text: [...rows.map(([k, v]) => `${k}: ${v}`), "", "Why this role:", note].join("\n"),
    html: SHELL(
      `<h1 style="margin:0 0 18px;font-size:24px">New application: ${esc(job.title)}</h1><table style="width:100%;border-collapse:collapse;font-size:14px">${rows
        .map(([k, v]) => `<tr><td style="padding:7px 0;color:#666">${esc(k)}</td><td style="padding:7px 0;text-align:right">${esc(v)}</td></tr>`)
        .join("")}</table><div style="margin-top:20px;padding:16px;background:#f6f6f3;white-space:pre-wrap;line-height:1.6">${esc(note)}</div>`,
    ),
    attachments: [{ filename, content: Buffer.from(fileBytes).toString("base64") }],
  };

  try {
    const status = await sendResend(apiKey, owner);
    if (status < 200 || status >= 300) {
      console.error("Resend rejected application", status); // status only: bodies may echo PII
      return fail("We could not deliver your application. Please try again.", 502);
    }
  } catch {
    console.error("Resend request failed or timed out");
    return fail("We could not deliver your application. Please try again.", 502);
  }

  const first = name.split(/\s+/)[0] || name;
  const ack = {
    from, to: [email], reply_to: to,
    subject: oneLine(`We received your application: ${job.title}`),
    text: `Hi ${first},\n\nWe received your application for ${job.title} (reference ${applicationId}).\n\nA person at SparkV will read it. We cannot promise a reply to every application or a specific timeline. If there is a fit, the next step is a short intro call, and we will contact you at this email address.\n\nTo ask us to delete your application data, reply to this email or write to the address on our website, quoting your reference.\n\nSparkV`,
    html: SHELL(
      `<h1 style="margin:0 0 16px;font-size:24px">Thanks, ${esc(first)}.</h1><p style="line-height:1.7;color:#333">We received your application for <strong>${esc(job.title)}</strong> (reference <strong>${applicationId}</strong>).</p><p style="line-height:1.7;color:#333">A person at SparkV will read it. We cannot promise a reply to every application or a specific timeline. If there is a fit, the next step is a short intro call, and we will contact you at this email address.</p><p style="line-height:1.7;color:#333">To ask us to delete your application data, reply to this email, quoting your reference.</p>`,
    ),
  };
  try {
    const status = await sendResend(apiKey, ack);
    if (status < 200 || status >= 300) console.error("Resend rejected acknowledgement", status);
  } catch {
    console.error("Acknowledgement email failed or timed out");
  }

  const hookUrl = process.env.HIRING_WEBHOOK_URL;
  if (hookUrl) {
    const secret = process.env.HIRING_WEBHOOK_SECRET;
    if (!secret) {
      console.error("HIRING_WEBHOOK_URL is set but HIRING_WEBHOOK_SECRET is missing; webhook skipped.");
    } else {
      const body = JSON.stringify({
        event: "application.received", applicationId, jobSlug: job.slug, jobTitle: job.title,
        name, email, phone, location,
        links: { linkedin: /linkedin\.com/i.test(profile ?? "") ? profile : "", portfolio: role || "", github: /github\.com/i.test(profile ?? "") ? profile : "", other: /linkedin\.com|github\.com/i.test(profile ?? "") ? "" : profile },
        noticePeriod, note, resumeFilename: filename, resumeSizeBytes: fileBytes.byteLength,
        receivedAt, consentVersion: CONSENT_VERSION, source: "careers-site", status: "received",
      });
      await postWebhook(hookUrl, secret, body);
    }
  }

  return NextResponse.json({ ok: true, applicationId });
}
