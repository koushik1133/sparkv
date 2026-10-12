"use client";
import { useEffect } from "react";

/** Adds scroll-reveal classes to server-rendered markup. Renders nothing. */
export function RevealObserver(){
 useEffect(()=>{if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;const nodes=document.querySelectorAll(".section-intro,.service-card,.command-dashboard,.publish-pipeline,.approval-flow article,.catalog-grid article,.engineering-points>div,.production-feature,.manufacturing-visual,.project-card,.process-list article,.principles article,.faq-list details,.solution-grid article,.workflow-node,.arch-node,.venture-example,.contact-note,.intake");nodes.forEach(n=>n.classList.add("motion-observe"));const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-visible");io.unobserve(e.target)}}),{threshold:.1,rootMargin:"0px 0px -8% 0px"});nodes.forEach(n=>io.observe(n));return()=>io.disconnect()},[]);
 return null;
}

/** Pauses hero animations while the hero is off-screen. Renders nothing. */
export function HeroObserver(){
 useEffect(()=>{const hero=document.querySelector(".hero");if(!hero)return;const io=new IntersectionObserver(([e])=>hero.classList.toggle("hero-paused",!e.isIntersecting));io.observe(hero);return()=>io.disconnect()},[]);
 return null;
}
