"use client";
import { useEffect, useRef, useState } from "react";
import { BrainCircuit, Check, Database, Network, UserCheck, Zap } from "lucide-react";

/**
 * Steps through `count` states on a timer. It only advances while the element is on
 * screen and not paused, and sits on the final state when reduced motion is requested.
 */
function useCycle(count: number, ms: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    queueMicrotask(sync);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduced || paused) return;
    let visible = false;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    if (ref.current) io.observe(ref.current);
    const id = setInterval(() => {
      if (visible) setStep((n) => (n + 1) % count);
    }, ms);
    return () => {
      clearInterval(id);
      io.disconnect();
    };
  }, [count, ms, reduced, paused]);

  return { ref, step: reduced ? count - 1 : step, paused: paused || reduced, reduced, setPaused };
}

function PauseButton({ paused, disabled, onToggle }: { paused: boolean; disabled: boolean; onToggle: () => void }) {
  return (
    <button type="button" className="viz-pause" aria-pressed={paused} disabled={disabled} onClick={onToggle}>
      {paused ? "Play animation" : "Pause animation"}
    </button>
  );
}

const VOICE_PHASES = [
  { key: "Listening", who: "CALLER", line: "“I’d like to book a visit on Thursday.”", level: "high" },
  { key: "Reasoning", who: "AGENT / INTENT", line: "Intent detected: schedule an appointment for Thursday.", level: "low" },
  { key: "Acting", who: "AGENT / TOOLS", line: "Checking the calendar and reserving an open slot.", level: "mid" },
  { key: "Complete", who: "AGENT / DONE", line: "Booked. Confirmation and call summary sent.", level: "flat" },
] as const;

const BARS = [22, 48, 75, 38, 92, 58, 30, 84, 55, 28, 66, 96, 44, 72, 35, 82, 51, 25, 61, 88, 42, 70, 32, 56];

export function VoiceVisual() {
  const { ref, step, paused, reduced, setPaused } = useCycle(VOICE_PHASES.length, 2800);
  const phase = VOICE_PHASES[step];
  return (
    <div className="voice-visual" ref={ref} data-level={phase.level}>
      <div className="voice-status">
        <span><i /> ILLUSTRATIVE CALL · NO AUDIO</span>
        <PauseButton paused={paused} disabled={reduced} onToggle={() => setPaused((p) => !p)} />
      </div>
      <div className="waveform" aria-hidden="true">
        {BARS.map((h, i) => (
          <i key={i} style={{ height: `${h}%`, animationDelay: `${i * 0.06}s` }} />
        ))}
      </div>
      <p className="voice-line">
        <small>{phase.who}</small>
        <span key={step}>{phase.line}</span>
      </p>
      <div className="voice-steps">
        {VOICE_PHASES.map((p, n) => (
          <span key={p.key} className={n < step ? "done" : n === step ? "active" : ""} aria-current={n === step ? "step" : undefined}>
            {p.key}
          </span>
        ))}
      </div>
    </div>
  );
}

const FLOW = [
  { Icon: Zap, code: "01", title: "Trigger", sub: "New lead", state: "A new lead enters the system." },
  { Icon: BrainCircuit, code: "02", title: "AI processing", sub: "Enrich & qualify", state: "The AI agent enriches and scores the lead." },
  { Icon: Network, code: "03", title: "Decision", sub: "Route by fit", state: "A decision rule routes the lead by fit." },
  { Icon: Database, code: "04", title: "Action", sub: "Update CRM · draft follow-up", state: "The CRM record is updated and a follow-up is drafted." },
  { Icon: UserCheck, code: "05", title: "Human approval", sub: "Nothing sends without review", state: "Waiting for a person to approve before anything is sent." },
  { Icon: Check, code: "06", title: "Outcome", sub: "Logged & measurable", state: "Approved. The outcome is logged." },
] as const;

export function WorkflowVisual() {
  const { ref, step, paused, reduced, setPaused } = useCycle(FLOW.length + 1, 2200);
  // The extra cycle slot is a short rest on the finished state before the loop restarts.
  const active = Math.min(step, FLOW.length - 1);
  const finished = step >= FLOW.length - 1;
  return (
    <div ref={ref}>
      <div className="workflow-head">
        <p className="workflow-state"><small>ILLUSTRATIVE FLOW</small><span key={active}>{FLOW[active].state}</span></p>
        <PauseButton paused={paused} disabled={reduced} onToggle={() => setPaused((p) => !p)} />
      </div>
      <ol className="workflow-canvas workflow-live">
        {FLOW.map(({ Icon, code, title, sub }, i) => {
          const cls = i < active || (finished && i === FLOW.length - 1) ? "done" : i === active ? "active" : "";
          return (
            <li key={title} className={`workflow-node ${i === 4 ? "gate" : ""} ${cls}`} aria-current={i === active ? "step" : undefined}>
              <Icon />
              <small>{code}</small>
              <strong>{title}</strong>
              <span>{sub}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
