"use client";

import { useMemo, useState } from "react";
import { STATUS_LABEL, STATUS_ORDER, type TaskStatus, type TeamMember } from "@/lib/team-data";

export function TeamBoard({ team }: { team: TeamMember[] }) {
  const [person, setPerson] = useState("all");
  const [status, setStatus] = useState<"all" | TaskStatus>("all");

  const flat = useMemo(() => team.flatMap((m) => m.tasks.map((t) => ({ ...t, member: m }))), [team]);
  const counts = useMemo(() => {
    const c: Record<TaskStatus, number> = { planned: 0, "in-progress": 0, blocked: 0, done: 0 };
    flat.forEach((t) => (c[t.status] += 1));
    return c;
  }, [flat]);
  const blocked = flat.filter((t) => t.status === "blocked");

  const visible = team
    .filter((m) => person === "all" || m.id === person)
    .map((m) => ({ ...m, tasks: m.tasks.filter((t) => status === "all" || t.status === status) }))
    .filter((m) => m.tasks.length > 0);

  return (
    <>
      <ul className="team-counters" aria-label="Summary counters">
        <li><strong>{flat.length}</strong><span>Total tasks</span></li>
        {STATUS_ORDER.map((s) => (
          <li key={s}><strong>{counts[s]}</strong><span>{STATUS_LABEL[s]}</span></li>
        ))}
      </ul>

      <section className="team-blocked-panel" aria-labelledby="team-blocked-h">
        <h2 id="team-blocked-h">Blocked items ({blocked.length})</h2>
        {blocked.length === 0 ? (
          <p>Nothing is blocked.</p>
        ) : (
          <ul>
            {blocked.map((t) => (
              <li key={t.id}>
                <strong>{t.title}</strong> <span>({t.member.name})</span>
                <p>{t.blocker ?? "No blocker reason recorded."}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="team-filters" role="group" aria-label="Filters">
        <label>
          Person
          <select value={person} onChange={(e) => setPerson(e.target.value)}>
            <option value="all">All people</option>
            {team.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </label>
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value as "all" | TaskStatus)}>
            <option value="all">All statuses</option>
            {STATUS_ORDER.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
        </label>
      </div>

      <div aria-live="polite">
        {visible.length === 0 && <p className="team-empty">No tasks match these filters.</p>}
        {visible.map((m) => (
          <section key={m.id} className="team-person" aria-labelledby={`tp-${m.id}`}>
            <h2 id={`tp-${m.id}`}>{m.name} <small>{m.role}</small></h2>
            <ul>
              {m.tasks.map((t) => (
                <li key={t.id} className="team-task">
                  <div className="team-task-top">
                    <strong>{t.title}</strong>
                    <span className={`team-badge team-${t.status}`}>{STATUS_LABEL[t.status]}</span>
                  </div>
                  {t.blocker && <p><b>Blocker:</b> {t.blocker}</p>}
                  <p><b>Deliverable:</b> {t.deliverable}</p>
                  <p><b>Last update:</b> <time dateTime={t.lastUpdate}>{t.lastUpdate}</time></p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
