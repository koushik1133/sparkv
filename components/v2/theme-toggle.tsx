"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/** Same storage key and DOM writes as the homepage header. */
export function ThemeToggle() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    let v = true;
    try {
      const s = localStorage.getItem("sparkv-theme");
      v = s ? s === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {}
    document.documentElement.dataset.theme = v ? "dark" : "light";
    document.documentElement.style.colorScheme = v ? "dark" : "light";
    queueMicrotask(() => setDark(v));
  }, []);
  const toggle = () => {
    const v = !dark;
    setDark(v);
    try { localStorage.setItem("sparkv-theme", v ? "dark" : "light"); } catch {}
    document.documentElement.dataset.theme = v ? "dark" : "light";
    document.documentElement.style.colorScheme = v ? "dark" : "light";
  };
  return (
    <button type="button" className="icon-button" onClick={toggle} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}>
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
