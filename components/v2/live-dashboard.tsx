"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, BarChart3, Bot, Check, Inbox, Megaphone, Send, Sparkles, Users } from "lucide-react";
import { SparkVLogo } from "@/components/v2/sparkv-logo";

/* Every number here is fictional demo data. Nothing is fetched or measured. */
type RangeKey = "7" | "30" | "90";
const RANGES: Record<RangeKey, { label: string; reach: number; eng: number; conv: number; book: number; deltas: [string, string, string]; bars: number[]; days: string[] }> = {
  "7": { label: "7D", reach: 41200, eng: 3100, conv: 742, book: 63, deltas: ["↗ 6.1%", "↗ 2.4%", "↗ 4.9%"], bars: [58, 49, 66, 54, 72, 61, 80, 68, 74, 83, 77, 90], days: ["6D AGO", "5D", "3D", "1D", "TODAY"] },
  "30": { label: "30D", reach: 184200, eng: 12800, conv: 3146, book: 284, deltas: ["↗ 18.4%", "↗ 7.2%", "↗ 11.6%"], bars: [42, 58, 49, 72, 63, 86, 76, 92, 68, 83, 96, 88], days: ["30D AGO", "22D", "15D", "7D", "TODAY"] },
  "90": { label: "90D", reach: 512300, eng: 36400, conv: 9120, book: 801, deltas: ["↗ 31.0%", "↗ 14.8%", "↗ 22.3%"], bars: [30, 38, 44, 41, 55, 60, 58, 71, 79, 74, 88, 94], days: ["90D AGO", "68D", "45D", "22D", "TODAY"] },
};

const CHANNELS = [
  { code: "IG", name: "Instagram", status: "Connected", events: ["Reply drafted · awaiting approval", "Comment routed to inbox"] },
  { code: "WA", name: "WhatsApp", status: "Connected", events: ["Lead qualified", "Booking confirmed"] },
  { code: "TG", name: "Telegram", status: "Connected", events: ["Approval received", "Post scheduled"] },
  { code: "SMS", name: "SMS / RCS", status: "Ready", events: ["Reminder sent", "Delivery confirmed"] },
] as const;

const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const compact = (n: number) => `${(n / 1000).toFixed(1)}K`;

/** Calls onTick on an interval, only while visible, not paused, and motion is allowed. */
function useLiveTick(ms: number, onTick: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const handler = useRef(onTick);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    handler.current = onTick;
  });

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
      if (visible) handler.current();
    }, ms);
    return () => {
      clearInterval(id);
      io.disconnect();
    };
  }, [ms, reduced, paused]);

  return { ref, paused: paused || reduced, reduced, setPaused };
}

export function LiveDashboard() {
  const [range, setRange] = useState<RangeKey>("30");
  const [live, setLive] = useState({ reach: 0, eng: 0, conv: 0, book: 0 });
  const [bars, setBars] = useState<number[]>(RANGES["30"].bars);
  const [flash, setFlash] = useState<{ i: number; text: string } | null>(null);
  const [reviewed, setReviewed] = useState(false);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(flashTimer.current), []);

  const { ref, paused, reduced, setPaused } = useLiveTick(2600, () => {
    setLive((l) => ({
      reach: l.reach + rnd(40, 160),
      eng: l.eng + rnd(20, 90),
      conv: l.conv + (Math.random() < 0.7 ? rnd(1, 3) : 0),
      book: l.book + (Math.random() < 0.18 ? 1 : 0),
    }));
    setBars((b) => b.map((h, i) => (i >= b.length - 2 ? clamp(h + rnd(-7, 7), 30, 98) : h)));
    const i = rnd(0, CHANNELS.length - 1);
    setFlash({ i, text: CHANNELS[i].events[rnd(0, 1)] });
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(null), 1800);
  });

  const data = RANGES[range];
  const pick = (r: RangeKey) => {
    setRange(r);
    setLive({ reach: 0, eng: 0, conv: 0, book: 0 });
    setBars(RANGES[r].bars);
  };

  const metrics = [
    { label: "REACH", value: compact(data.reach + live.reach), note: data.deltas[0], up: true },
    { label: "ENGAGEMENT", value: compact(data.eng + live.eng), note: data.deltas[1], up: true },
    { label: "CONVERSATIONS", value: (data.conv + live.conv).toLocaleString("en-US"), note: "Across 6 channels", up: false },
    { label: "BOOKINGS", value: String(data.book + live.book), note: data.deltas[2], up: true },
  ];

  return (
    <div className="command-dashboard" ref={ref} data-nosnippet>
      <aside className="dash-rail" aria-hidden="true">
        <SparkVLogo />
        <nav>
          {([[BarChart3, "Overview"], [Megaphone, "Campaigns"], [Inbox, "Inbox"], [Send, "Publishing"], [Bot, "Agents"], [Users, "Audiences"]] as const).map(([Icon, label], i) => (
            <span className={i === 0 ? "on" : ""} key={label}>
              <Icon />
              {label}
            </span>
          ))}
        </nav>
        <div className="rail-user"><i />KG</div>
      </aside>
      <div className="dash-main">
        <div className="dash-head">
          <div>
            <small>GOOD MORNING</small>
            <h3>Growth overview</h3>
          </div>
          <div className="dash-tools">
            <span className="demo-chip">ILLUSTRATIVE DATA</span>
            <div className="range-switch" role="group" aria-label="Date range">
              {(Object.keys(RANGES) as RangeKey[]).map((r) => (
                <button type="button" key={r} aria-pressed={range === r} onClick={() => pick(r)}>
                  {RANGES[r].label}
                </button>
              ))}
            </div>
            <button type="button" className="viz-pause" aria-pressed={paused} disabled={reduced} onClick={() => setPaused((p) => !p)}>
              {paused ? "Resume updates" : "Pause updates"}
            </button>
          </div>
        </div>
        <div className="metric-row">
          {metrics.map((m) => (
            <article key={m.label}>
              <small>{m.label}</small>
              <strong key={m.value} className="tick">{m.value}</strong>
              <span className={m.up ? "metric-up" : ""}>{m.note}</span>
            </article>
          ))}
        </div>
        <div className="dash-content">
          <div className="reach-chart">
            <div className="panel-title">
              <span>Reach & engagement</span>
              <small><i />Organic <i />Paid</small>
            </div>
            <div className="chart-bars" role="img" aria-label="Bar chart of reach and engagement over time. Simulated demo data.">
              {bars.map((h, i) => (
                <span key={i} style={{ height: `${h}%` }}>
                  <i style={{ height: `${Math.max(15, h - 24)}%` }} />
                </span>
              ))}
            </div>
            <div className="chart-days">{data.days.map((d) => <span key={d}>{d}</span>)}</div>
          </div>
          <div className="ai-insight">
            <div className="panel-title">
              <span><Sparkles /> AI INSIGHT</span>
              <small>SIMULATED</small>
            </div>
            <p>Your short-form videos are driving <strong>2.4× more qualified conversations</strong> than static posts this week.</p>
            <div className={`insight-action${reviewed ? " reviewed" : ""}`}>
              <span>{reviewed ? "Queued for human approval. Nothing changes until someone signs off (demo)." : "Shift 12% of the awareness budget to top-performing video audiences."}</span>
              <button type="button" aria-pressed={reviewed} onClick={() => setReviewed((v) => !v)}>
                {reviewed ? <>Queued <Check /></> : <>Review action <ArrowRight /></>}
              </button>
            </div>
          </div>
          <div className="channel-health">
            <div className="panel-title">
              <span>Channel health</span>
              <small>ALL SYSTEMS</small>
            </div>
            {CHANNELS.map((c, i) => (
              <div key={c.code} className={flash?.i === i ? "flash" : ""}>
                <b>{c.code}</b>
                <span>
                  <strong>{c.name}</strong>
                  <small>{flash?.i === i ? flash.text : c.status}</small>
                </span>
                <i />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
