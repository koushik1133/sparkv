"use client";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { v2Path } from "@/lib/v2";

export function ContactForm(){
 const [formStep,setFormStep]=useState(0),[sent,setSent]=useState(false),[projectType,setProjectType]=useState(""),[submitting,setSubmitting]=useState(false),[formError,setFormError]=useState("");
 const rootRef=useRef<HTMLFormElement>(null),stepMoved=useRef(false),errorFocus=useRef(false);
 useEffect(()=>{if(!stepMoved.current)return;stepMoved.current=false;rootRef.current?.querySelector<HTMLElement>(formStep===0?"input[type=radio]":"input[name=name]")?.focus()},[formStep]);
 useEffect(()=>{if(sent)rootRef.current?.querySelector<HTMLElement>(".form-success h3")?.focus()},[sent]);
 useEffect(()=>{if(!formError||!errorFocus.current)return;errorFocus.current=false;rootRef.current?.querySelector<HTMLElement>(formStep===0?"input[type=radio]":"input[name=name]")?.focus()},[formError,formStep]);
 async function submitProject(e:FormEvent<HTMLFormElement>){
  e.preventDefault();setFormError("");setSubmitting(true);
  const form=new FormData(e.currentTarget);
  try{
   const response=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({projectType,name:form.get("name"),email:form.get("email"),brief:form.get("brief"),companyWebsite:form.get("companyWebsite")})});
   const result=await response.json() as {error?:string};
   if(!response.ok)throw new Error(result.error||"We could not send your project brief.");
   setSent(true);window.dispatchEvent(new CustomEvent("sparkv:lead"));
  }catch(error){errorFocus.current=true;setFormError(error instanceof Error?error.message:"We could not send your project brief.")}
  finally{setSubmitting(false)}
 }
 return <form className="intake" ref={rootRef} onSubmit={submitProject}>{sent?<div className="form-success" role="status"><span><Check/></span><h3 tabIndex={-1}>Project brief delivered.</h3><p>Thanks—SparkV received your project details and can follow up using the email you provided.</p><button type="button" className="button button-dark" onClick={()=>{setSent(false);setFormStep(0);setProjectType("")}}>Start another</button></div>:<><div className="form-progress"><span>PROJECT INTAKE</span><small role="status" aria-label={`Step ${formStep+1} of 2`}>STEP {formStep+1} / 2</small><i><b style={{width:formStep?"100%":"50%"}}/></i></div>{formStep===0?<div className="form-panel"><fieldset className="project-fieldset" aria-describedby={formError?"form-error":undefined}><legend>What are you looking to build?</legend><div className="project-types">{["Website","Web App","Mobile App","AI Agent","Voice Agent","Automation","AI System","Other"].map((x,i)=><label key={x}><input type="radio" name="type" required={i===0} value={x} checked={projectType===x} onChange={()=>setProjectType(x)}/><span>{x}</span></label>)}</div></fieldset>{formError&&<p id="form-error" className="form-error" role="alert">{formError}</p>}<button type="button" className="button button-dark" disabled={!projectType} onClick={()=>{if(projectType){setFormError("");stepMoved.current=true;setFormStep(1)}else{errorFocus.current=true;setFormError("Choose a project type to continue.")}}}>Continue <ArrowRight size={17}/></button></div>:<div className="form-panel fields"><div aria-hidden="true" inert><input className="form-honeypot" name="companyWebsite" tabIndex={-1} autoComplete="off"/></div><label>Name<input name="name" aria-invalid={!!formError} aria-describedby={formError?"form-error":undefined} required minLength={2} maxLength={100} autoComplete="name" placeholder="Your name"/></label><label>Work email<input name="email" aria-invalid={!!formError} aria-describedby={formError?"form-error":undefined} required type="email" maxLength={254} autoComplete="email" placeholder="you@company.com"/></label><label className="full">What are you trying to build?<textarea name="brief" aria-invalid={!!formError} aria-describedby={formError?"form-error":undefined} required minLength={10} maxLength={5000} rows={4} placeholder="The problem, current workflow, and what a successful outcome looks like…"/></label>{formError&&<p id="form-error" className="form-error full" role="alert">{formError}</p>}<div className="form-buttons"><button type="button" className="back" disabled={submitting} onClick={()=>{stepMoved.current=true;setFormStep(0)}}>Back</button><button className="button button-dark" disabled={submitting}>{submitting?"Sending…":"Send Project Brief"} {!submitting&&<ArrowUpRight size={17}/>}</button></div><p className="form-consent full">By sending this, you agree that SparkV may use these details to reply to you. See the <a href={v2Path("/privacy")}>Privacy Notice</a>.</p></div>}</>}</form>
}
