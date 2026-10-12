"use client";
import { useRef, type ReactNode } from "react";

/** Native <details> mobile menu; closes on Escape (focus returns to summary) and on link click. */
export function SubMenu({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  return (
    <details
      ref={ref}
      className="sub-menu"
      onKeyDown={(e) => {
        if (e.key === "Escape" && ref.current?.open) {
          ref.current.open = false;
          ref.current.querySelector("summary")?.focus();
        }
      }}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a") && ref.current) ref.current.open = false;
      }}
    >
      <summary>Menu</summary>
      <nav aria-label="Mobile">{children}</nav>
    </details>
  );
}
