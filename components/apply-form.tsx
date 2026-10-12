"use client";

import { useRef, useState, type FormEvent } from "react";
import { v2Path } from "@/lib/v2";

const MAX_BYTES = 5 * 1024 * 1024;
const EXT = /\.(pdf|docx?|PDF|DOCX?)$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = Record<string, string>;
type Props = { jobSlug: string; jobTitle: string; roleLinkLabel: string };

function validate(fd: FormData): Errors {
  const e: Errors = {};
  const s = (k: string) => String(fd.get(k) ?? "").trim();
  if (s("name").length < 2) e.name = "Enter your full name.";
  if (!EMAIL.test(s("email"))) e.email = "Enter a valid email address.";
  if (s("location").length < 2) e.location = "Enter your city and state or country.";
  if (s("note").length < 20) e.note = "Write at least a couple of sentences (20 characters or more).";
  for (const k of ["profileUrl", "roleLink"]) {
    const v = s(k);
    if (v && !/^https?:\/\/\S+\.\S+$/i.test(v)) e[k] = "Enter a full link starting with https://";
  }
  const f = fd.get("resume");
  if (!(f instanceof File) || f.size === 0) e.resume = "Attach your resume as PDF, DOC or DOCX.";
  else if (f.size > MAX_BYTES) e.resume = "File is larger than 5 MB.";
  else if (!EXT.test(f.name)) e.resume = "Resume must be a PDF, DOC or DOCX file.";
  if (fd.get("consent") !== "on") e.consent = "Please confirm you have read the privacy notice.";
  return e;
}

export function ApplyForm({ jobSlug, jobTitle, roleLinkLabel }: Props) {
  const ref = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<{ kind: "idle" | "sending" | "error" | "done"; msg: string }>({ kind: "idle", msg: "" });
  const [appId, setAppId] = useState("");

  const err = (k: string) => errors[k];
  const a11y = (k: string) => ({ "aria-invalid": err(k) ? true : undefined, "aria-describedby": err(k) ? `ap-${k}-err` : undefined });
  const msg = (k: string) => (err(k) ? <p id={`ap-${k}-err`} className="ap-error">{err(k)}</p> : null);

  function focusFirst(es: Errors) {
    const first = Object.keys(es)[0];
    ref.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (status.kind === "sending") return;
    const fd = new FormData(ev.currentTarget);
    const es = validate(fd);
    setErrors(es);
    if (Object.keys(es).length) {
      setStatus({ kind: "error", msg: "Please fix the highlighted fields." });
      focusFirst(es);
      return;
    }
    fd.set("jobSlug", jobSlug);
    setStatus({ kind: "sending", msg: "Sending your application…" });
    try {
      const res = await fetch("/api/apply", { method: "POST", body: fd, signal: AbortSignal.timeout(30_000) });
      const data = (await res.json().catch(() => ({}))) as { error?: string; fields?: Errors; applicationId?: string };
      if (!res.ok) {
        const fe = data.fields ?? {};
        setErrors(fe);
        setStatus({ kind: "error", msg: data.error || "We could not send your application. Please try again." });
        if (Object.keys(fe).length) focusFirst(fe);
        return;
      }
      setAppId(data.applicationId ?? "");
      setStatus({ kind: "done", msg: "" });
      window.dispatchEvent(new CustomEvent("sparkv:application"));
    } catch {
      setStatus({ kind: "error", msg: "Network problem or timeout. Please try again." });
    }
  }

  if (status.kind === "done") {
    return (
      <div className="ap-done" role="status">
        <h3 tabIndex={-1} ref={(el) => el?.focus()}>Application received</h3>
        <p>Thanks for applying for {jobTitle}. We sent a confirmation to your email{appId ? <> with reference <strong>{appId}</strong></> : null}. A person will read your application; we cannot promise a reply to every applicant.</p>
      </div>
    );
  }

  return (
    <form ref={ref} className="ap-form" onSubmit={onSubmit} noValidate encType="multipart/form-data">
      <p className="ap-hint">Fields marked * are required. Applying for <strong>{jobTitle}</strong>.</p>
      <div aria-hidden="true" inert>
        <input className="form-honeypot" name="companyWebsite" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset>
        <legend>About you</legend>
        <label>Full name *<input name="name" required maxLength={100} autoComplete="name" {...a11y("name")} />{msg("name")}</label>
        <label>Email *<input name="email" type="email" required maxLength={254} autoComplete="email" {...a11y("email")} />{msg("email")}</label>
        <label>Phone<input name="phone" type="tel" maxLength={30} autoComplete="tel" {...a11y("phone")} />{msg("phone")}</label>
        <label>Location (city, state or country) *<input name="location" required maxLength={100} autoComplete="address-level2" {...a11y("location")} />{msg("location")}</label>
        <label>Notice period<input name="noticePeriod" maxLength={60} placeholder="e.g. 30 days, immediate" {...a11y("noticePeriod")} />{msg("noticePeriod")}</label>
      </fieldset>

      <fieldset>
        <legend>Your work</legend>
        <label>LinkedIn, GitHub or portfolio URL<input name="profileUrl" type="url" maxLength={300} inputMode="url" placeholder="https://" {...a11y("profileUrl")} />{msg("profileUrl")}</label>
        <label>{roleLinkLabel}<input name="roleLink" type="url" maxLength={300} inputMode="url" placeholder="https://" {...a11y("roleLink")} />{msg("roleLink")}</label>
        <label>Why this role? *<textarea name="note" required rows={5} maxLength={2000} {...a11y("note")} />{msg("note")}</label>
        <label>Resume *<input name="resume" type="file" required accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" aria-describedby={err("resume") ? "ap-resume-err ap-resume-hint" : "ap-resume-hint"} aria-invalid={err("resume") ? true : undefined} /></label>
        <p id="ap-resume-hint" className="ap-hint">PDF, DOC or DOCX, up to 5 MB.</p>
        {msg("resume")}
      </fieldset>

      <fieldset>
        <legend>Consent</legend>
        <label className="ap-check">
          <input name="consent" type="checkbox" required {...a11y("consent")} />
          <span>I have read the <a href={v2Path("/privacy#applicants")}>applicant privacy notice</a> and agree that SparkV may use these details to assess my application. *</span>
        </label>
        {msg("consent")}
      </fieldset>

      <div role={status.kind === "error" ? "alert" : "status"} aria-live="polite" className={status.kind === "error" ? "ap-status ap-error" : "ap-status"}>{status.msg}</div>
      <button type="submit" className="button button-primary" disabled={status.kind === "sending"}>
        {status.kind === "sending" ? "Sending…" : "Submit application"}
      </button>
    </form>
  );
}
