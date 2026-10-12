/**
 * Open roles. Single source of truth for /careers, /careers/[slug], the sitemap,
 * JobPosting JSON-LD and the /api/apply slug allow-list.
 * No salary, benefits, headcount, funding, client names or company size are stated on purpose.
 */
export type Job = {
  slug: string;
  title: string;
  team: string;
  /** schema.org employmentType. TODO: FULL_TIME is a placeholder until the real arrangement is confirmed. */
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACTOR" | "INTERN";
  location: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  howWeHire: string[];
  /** Label for the optional role-specific link field in the application form. */
  roleLinkLabel: string;
  datePosted: string;
  validThrough: string;
};

export const COMPENSATION_LINE = "Discussed during the process.";
export const CONSENT_VERSION = "2026-10-12";

const COMMON_HIRING = [
  "Apply with the form on this page. A person at SparkV reads every application.",
  "Short intro call to talk about the role, your work and what you are looking for.",
  "A practical exercise based on real work for this role, kept small and scoped. Details are shared before you start.",
  "A conversation with the people you would work with, then a decision. We tell you the outcome either way.",
];

export const JOBS: Job[] = [
  {
    slug: "ai-engineer",
    title: "AI Engineer (Remote)",
    team: "Engineering",
    employmentType: "FULL_TIME",
    location: "Remote (India)",
    summary:
      "Build AI agents and automation for client workflows using n8n, Make, LLM APIs and AI-assisted development, and get them running reliably in production.",
    responsibilities: [
      "Design and build automation workflows in n8n and Make, and in code where a workflow tool is the wrong fit.",
      "Build LLM-based agents with tool calling, retrieval and sensible guardrails for client processes.",
      "Integrate third-party APIs, webhooks and internal systems, handling retries, errors and rate limits.",
      "Use AI-assisted development (vibe coding) to move quickly, then review, test and own what ships.",
      "Write short handover notes so clients and teammates can run and change what you built.",
    ],
    requirements: [
      "Hands-on experience building with n8n, Make or a similar automation platform.",
      "Working knowledge of LLM APIs, prompting and agent patterns, and an honest view of where they fail.",
      "Comfortable reading and writing code (JavaScript/TypeScript or Python) and calling REST APIs.",
      "Good judgement about when to automate, when not to, and how to test an automation before it touches real data.",
      "Clear written English.",
    ],
    niceToHave: [
      "Experience with vector search or retrieval pipelines.",
      "Experience with evaluation of LLM outputs.",
      "Prior client-facing or consulting work.",
    ],
    howWeHire: COMMON_HIRING,
    roleLinkLabel: "Link to a project, repo or workflow you built (optional)",
    datePosted: "2026-10-12",
    validThrough: "2027-01-10",
  },
  {
    slug: "software-engineer",
    title: "Software Engineer (Remote)",
    team: "Engineering",
    employmentType: "FULL_TIME",
    location: "Remote (India)",
    summary:
      "Build and ship full-stack web features in TypeScript, React, Next.js and Node, with sound APIs, databases and tests.",
    responsibilities: [
      "Build production features across the front end and back end of client and SparkV products.",
      "Design and implement APIs and database schemas that stay maintainable.",
      "Write tests, review code and keep deployments boring and repeatable.",
      "Pay attention to performance, accessibility and security as part of normal work.",
      "Estimate honestly and tell the team early when something is at risk.",
    ],
    requirements: [
      "Solid experience with TypeScript and React, and a server framework such as Next.js or Node.",
      "Experience designing REST or similar APIs and working with a relational database.",
      "Habit of writing tests and reading other people's code carefully.",
      "Have shipped something to production and can talk about what went wrong.",
      "Clear written English.",
    ],
    niceToHave: [
      "Experience with LLM APIs or automation tooling.",
      "Experience with CI, observability or cloud deployment.",
      "Open-source contributions or public projects.",
    ],
    howWeHire: COMMON_HIRING,
    roleLinkLabel: "Link to a repo or shipped project (optional)",
    datePosted: "2026-10-12",
    validThrough: "2027-01-10",
  },
  {
    slug: "forward-deployed-engineer",
    title: "Forward Deployed Engineer (Remote)",
    team: "Client delivery",
    employmentType: "FULL_TIME",
    location: "Remote (India)",
    summary:
      "Work directly with clients to scope, integrate and deploy AI, automation and software into how their business actually runs.",
    responsibilities: [
      "Talk to clients to understand their workflow, constraints and what a good outcome looks like.",
      "Turn that into a clear scope, then build or coordinate the build of the integration.",
      "Connect AI and automation to the client's existing tools, data and processes.",
      "Deploy, monitor and support what you shipped, and train the client's team to use it.",
      "Feed what you learn back to the engineering team.",
    ],
    requirements: [
      "Engineering background: you can read and write code and debug an integration yourself.",
      "Strong spoken and written communication, including explaining technical trade-offs to non-technical people.",
      "Experience with APIs, webhooks and business tools such as CRMs, spreadsheets or messaging.",
      "Comfortable owning a problem end to end and working with some ambiguity.",
      "Willingness to join client calls during working hours in India.",
    ],
    niceToHave: [
      "Experience with n8n, Make or LLM-based tooling.",
      "Prior consulting, solutions engineering or support engineering work.",
    ],
    howWeHire: COMMON_HIRING,
    roleLinkLabel: "Link to a project or write-up you are proud of (optional)",
    datePosted: "2026-10-12",
    validThrough: "2027-01-10",
  },
  {
    slug: "video-editor",
    title: "Video Editor (Remote)",
    team: "Marketing",
    employmentType: "FULL_TIME",
    location: "Remote (India)",
    summary:
      "Edit short-form and product or explainer videos, with basic motion graphics, captions and sound, for SparkV marketing and client demos.",
    responsibilities: [
      "Edit short-form videos and longer product or explainer videos from raw footage and screen recordings.",
      "Create simple motion graphics, titles and transitions.",
      "Add accurate captions and clean up audio, music and sound levels.",
      "Produce demo videos that show clients how their delivered systems work.",
      "Keep files, versions and exports organised and delivered on time.",
    ],
    requirements: [
      "A portfolio or showreel of edited videos you can share.",
      "Proficiency in a professional editor such as Premiere Pro, DaVinci Resolve or Final Cut.",
      "Basic motion graphics skills (for example After Effects or equivalent).",
      "Good sense of pacing, framing, captions and audio.",
      "Reliable communication and comfort taking feedback.",
    ],
    niceToHave: [
      "Experience editing screen-recorded software demos.",
      "Familiarity with AI-assisted video or audio tools.",
    ],
    howWeHire: [
      "Apply with the form on this page and include a link to your portfolio or showreel. A person at SparkV reads every application.",
      "Short intro call to talk about your work and what you would like to make.",
      "A small, clearly scoped edit exercise using supplied footage. Details are shared before you start.",
      "A conversation with the people you would work with, then a decision. We tell you the outcome either way.",
    ],
    roleLinkLabel: "Portfolio or showreel link",
    datePosted: "2026-10-12",
    validThrough: "2027-01-10",
  },
];

export const getJob = (slug: string) => JOBS.find((j) => j.slug === slug);
