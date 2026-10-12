"use client";
import { useEffect } from "react";

const MAGNETIC = ".hero-actions .button, .header-cta";
const PULL = 0.28; // fraction of the cursor offset the element follows
const MAX = 9; // px

/**
 * Pointer-magnetic CTAs and hero scroll parallax. Both only write CSS custom properties;
 * the visual work lives in globals.css. Nothing runs under reduced motion, and magnetism
 * is limited to hover-capable fine pointers so touch devices are never affected.
 */
export function MotionEnhancements() {
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const cleanups: Array<() => void> = [];

    if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
      document.querySelectorAll<HTMLElement>(MAGNETIC).forEach((el) => {
        el.classList.add("is-magnetic");
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          el.style.setProperty("--mx", String(Math.max(-MAX, Math.min(MAX, dx * PULL))));
          el.style.setProperty("--my", String(Math.max(-MAX, Math.min(MAX, dy * PULL))));
        };
        const reset = () => {
          el.style.removeProperty("--mx");
          el.style.removeProperty("--my");
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", reset);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", reset);
          el.classList.remove("is-magnetic");
          reset();
        });
      });
    }

    const hero = document.querySelector<HTMLElement>(".hero");
    if (hero) {
      let visible = true;
      let frame = 0;
      const apply = () => {
        frame = 0;
        hero.style.setProperty("--py", String(Math.min(window.scrollY, 900)));
      };
      const onScroll = () => {
        if (visible && !frame) frame = requestAnimationFrame(apply);
      };
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
      });
      io.observe(hero);
      window.addEventListener("scroll", onScroll, { passive: true });
      apply();
      cleanups.push(() => {
        window.removeEventListener("scroll", onScroll);
        io.disconnect();
        if (frame) cancelAnimationFrame(frame);
        hero.style.removeProperty("--py");
      });
    }

    // If the user flips reduced motion on mid-session, drop the effects immediately.
    const onChange = () => {
      if (reduced.matches) cleanups.splice(0).forEach((fn) => fn());
    };
    reduced.addEventListener("change", onChange);
    return () => {
      reduced.removeEventListener("change", onChange);
      cleanups.splice(0).forEach((fn) => fn());
    };
  }, []);

  return null;
}
