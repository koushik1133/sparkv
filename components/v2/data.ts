import { Bot, BrainCircuit, Code2, MessageSquareText, Mic2, PhoneCall, Smartphone, Zap } from "lucide-react";

export const services = [
  [Code2,"01","Software Development","Web products, SaaS platforms, internal tools, APIs, and backend systems engineered to last.",["Web apps","SaaS","APIs"],"/services/custom-software"],
  [Smartphone,"02","Mobile Development","Purpose-built iOS, Android, and cross-platform experiences backed by resilient systems.",["iOS","Android","Cross-platform"],"/services/web-development"],
  [BrainCircuit,"03","AI & Automation","AI copilots, RAG, document intelligence, and workflows connected to the tools you already use.",["RAG","Workflows","AI systems"],"/services/ai-automation"],
  [Bot,"04","AI Agents","Specialized agents that research, support, qualify, coordinate, and execute with human oversight.",["Sales","Support","Research"],"/services/ai-agents"],
  [Mic2,"05","Voice AI","Natural voice agents for reception, qualification, scheduling, and customer operations.",["Inbound","Outbound","Support"],"/services/ai-agents#voice-agents"],
  [MessageSquareText,"06","Social AI","Intelligent content, publishing, engagement, and lead workflows without brittle busywork.",["Content","Leads","Publishing"],"/services/ai-automation#social-publishing"],
] as const;
export const agents = [
  ["Sales Agent",Zap,["Lead captured","Account researched","Qualified","CRM updated","Follow-up drafted"]],
  ["Research Agent",BrainCircuit,["Brief received","Sources searched","Evidence ranked","Findings synthesized","Report delivered"]],
  ["Support Agent",MessageSquareText,["Request understood","Context retrieved","Action selected","Issue resolved","Record updated"]],
  ["Voice Agent",PhoneCall,["Call connected","Intent detected","Tools invoked","Appointment booked","Summary sent"]],
] as const;
export const processSteps = [["01","Discover","We map the business goal, constraints, users, and systems before choosing the technology."],["02","Design","We turn the problem into a clear product and technical architecture."],["03","Build","Small, testable releases keep quality visible and decisions reversible."],["04","Integrate","We connect data, APIs, AI models, and the tools your team already relies on."],["05","Launch","Production readiness includes security, observability, performance, and handoff."],["06","Improve","We learn from real usage, remove friction, and extend what creates value."]];
export const PHASES=["INPUT","REASONING","REASONING","ACTION","OUTCOME"];
