import { ArrowUpRight, ChevronDown } from "lucide-react";
import { HeroClock } from "@/components/v2/hero-clock";

const steps = [["INPUT", "Lead captured"], ["REASONING", "Account researched"], ["REASONING", "Qualified"], ["ACTION", "CRM updated"], ["OUTCOME", "Follow-up drafted for human review"]] as const;

export function Hero() {
  return (
    <section id="top" className="hy-hero">
      <div className="hy-wrap hy-hero-grid">
        <div className="hy-hero-copy">
          <p className="hy-mono"><b>/</b> SparkV · Software × AI × Automation</p>
          <h1>We build software that moves businesses <em>forward.</em></h1>
          <p className="hero-lede">From web and mobile products to AI agents, voice systems, and intelligent automation, SparkV turns complex ideas into production-ready technology.</p>
          <p className="hero-audience">For founders, operators, and engineering teams who need working systems, not slideware.</p>
          <div className="hero-actions">
            <a href="#contact" className="button button-primary">Start a Project <ArrowUpRight size={18} /></a>
            <a href="#services" className="button button-ghost">Explore What We Build <ChevronDown size={17} /></a>
          </div>
        </div>
        <div className="hy-stack" role="group" aria-label="Illustrative product interface examples">
          <div className="hy-card hy-console">
            <div className="hy-bar"><i /><i /><i /><span>sales-agent / illustrative · <HeroClock /></span></div>
            {steps.map(([p, t], i) => (
              <div className="hy-line" key={i}>
                <span className={`hy-pill${p === "ACTION" ? " act" : p === "OUTCOME" ? " out" : ""}`}>{p}</span>
                <span>{t}{i === 4 && <span className="hy-cursor" aria-hidden="true" />}</span>
              </div>
            ))}
          </div>
          <div className="hy-mini">
            <div className="hy-card">
              <p className="hy-tag">WORKFLOW / ILLUSTRATIVE</p>
              <div className="hy-flow"><span>Form</span><em aria-hidden="true">→</em><span className="hot">AI step</span><em aria-hidden="true">→</em><span>CRM</span></div>
            </div>
            <div className="hy-card">
              <p className="hy-tag">OVERSIGHT</p>
              <p className="hy-status"><i aria-hidden="true" />Human approval on</p>
            </div>
          </div>
        </div>
      </div>
      <div className="hy-wrap">
        <div className="hy-meta">
          <div><p className="hy-mono">Product Engineering</p><p>Interfaces, backends and data as one product.</p></div>
          <div><p className="hy-mono">AI Systems</p><p>Agents and copilots with human oversight.</p></div>
          <div><p className="hy-mono">Business Automation</p><p>Workflows connected to the tools you use.</p></div>
        </div>
      </div>
    </section>
  );
}
