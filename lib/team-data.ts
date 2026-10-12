// SAMPLE DATA - REPLACE BEFORE USE.
// Everything below is made-up placeholder content ("Person 1".."Person 4"). To use the dashboard,
// edit this file (names, roles, tasks) and redeploy. There is no database: the page only shows
// self-reported / task-tool status that someone typed here. Nothing about keystrokes, screens or
// location is collected or displayed.

export type TaskStatus = "planned" | "in-progress" | "blocked" | "done";

export const STATUS_LABEL: Record<TaskStatus, string> = {
  planned: "Planned",
  "in-progress": "In progress",
  blocked: "Blocked",
  done: "Done",
};

export const STATUS_ORDER: TaskStatus[] = ["planned", "in-progress", "blocked", "done"];

export type TeamTask = {
  id: string;
  title: string;
  status: TaskStatus;
  /** Required when status is "blocked"; optional otherwise. */
  blocker?: string;
  deliverable: string;
  /** ISO date (YYYY-MM-DD) of the last self-reported update. */
  lastUpdate: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  tasks: TeamTask[];
};

export const TEAM_DATA_IS_SAMPLE = true;
export const TEAM_DATA_UPDATED = "2026-10-12";

export const TEAM: TeamMember[] = [
  {
    id: "p1",
    name: "Person 1",
    role: "Sample role: Project lead",
    tasks: [
      { id: "p1-a", title: "Sample task: Draft Q4 delivery plan", status: "in-progress", deliverable: "Plan document (sample)", lastUpdate: "2026-10-11" },
      { id: "p1-b", title: "Sample task: Client kickoff agenda", status: "done", deliverable: "Agenda (sample)", lastUpdate: "2026-10-08" },
    ],
  },
  {
    id: "p2",
    name: "Person 2",
    role: "Sample role: Frontend engineer",
    tasks: [
      { id: "p2-a", title: "Sample task: Build onboarding screens", status: "blocked", blocker: "Sample blocker: waiting on final copy", deliverable: "Three screens (sample)", lastUpdate: "2026-10-10" },
      { id: "p2-b", title: "Sample task: Accessibility pass", status: "planned", deliverable: "Checklist report (sample)", lastUpdate: "2026-10-09" },
    ],
  },
  {
    id: "p3",
    name: "Person 3",
    role: "Sample role: Backend engineer",
    tasks: [
      { id: "p3-a", title: "Sample task: Intake API hardening", status: "in-progress", deliverable: "Merged change (sample)", lastUpdate: "2026-10-12" },
      { id: "p3-b", title: "Sample task: Staging environment access", status: "blocked", blocker: "Sample blocker: access request pending approval", deliverable: "Working staging (sample)", lastUpdate: "2026-10-07" },
    ],
  },
  {
    id: "p4",
    name: "Person 4",
    role: "Sample role: Designer",
    tasks: [
      { id: "p4-a", title: "Sample task: Icon set refresh", status: "done", deliverable: "Icon files (sample)", lastUpdate: "2026-10-06" },
      { id: "p4-b", title: "Sample task: Case study layout", status: "planned", deliverable: "Mockups (sample)", lastUpdate: "2026-10-11" },
    ],
  },
];
