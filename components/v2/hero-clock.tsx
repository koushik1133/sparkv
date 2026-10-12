"use client";
import { useEffect, useState } from "react";

export function HeroClock(){const [t,setT]=useState("");useEffect(()=>{const f=()=>setT(new Date().toLocaleTimeString("en-GB"));f();const id=setInterval(f,1000);return()=>clearInterval(id)},[]);return <span suppressHydrationWarning>{t||"--:--:--"}</span>}
