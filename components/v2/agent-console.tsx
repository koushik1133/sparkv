"use client";
import { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { agents, PHASES } from "./data";

export function AgentConsole(){
 const [agent,setAgent]=useState(0),[tick,setTick]=useState(0);
 useEffect(()=>{if(matchMedia("(prefers-reduced-motion: reduce)").matches){queueMicrotask(()=>setTick(4));return}const el=document.querySelector(".agent-console");let vis=false;const io=new IntersectionObserver(([e])=>{vis=e.isIntersecting});if(el)io.observe(el);const id=setInterval(()=>{if(vis)setTick(t=>(t+1)%6)},1400);return()=>{clearInterval(id);io.disconnect()}},[agent]);
 return <div className="agent-console"><div className="agent-list" role="group" aria-label="Agent examples">{agents.map(([name,Icon],i)=><button key={name} className={agent===i?"selected":""} onClick={()=>{setAgent(i);setTick(matchMedia("(prefers-reduced-motion: reduce)").matches?4:0)}} aria-pressed={agent===i}><Icon size={18}/><span>{name}</span><small>{String(i+1).padStart(2,"0")}</small></button>)}</div><div className="agent-flow"><div className="console-head"><span><i aria-hidden="true"/> {agents[agent][0].toUpperCase()} / ACTIVE</span><span>CONTROLLED AUTONOMY</span></div><div className="thinking-orbs" aria-hidden="true"><i/><i/><i/></div><div className="flow-steps" aria-label="Agent workflow steps">{agents[agent][2].map((step,i)=><div className={`flow-step${tick>i?" done":""}${tick===i?" active":""}`} key={step}><span>{tick>i?<Check size={13}/>:<ArrowRight size={13}/>}</span><div><small>{PHASES[i]}</small><strong>{step}</strong></div>{i<4&&<i/>}</div>)}</div></div></div>
}
