"use client";

import { useEffect, useRef } from "react";
import { useLabexStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const { cursorVariant } = useLabexStore();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if ("ontouchstart" in window) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
      }
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <>
      {/* Dot — snaps instantly */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className={cn(
          "fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none transition-transform duration-100 z-[var(--z-cursor)]",
          cursorVariant === "hover"
            ? "bg-[var(--color-orange)] scale-150"
            : "bg-white"
        )}
      />

      {/* Ring — follows with lag */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className={cn(
          "fixed top-0 left-0 w-10 h-10 rounded-full border pointer-events-none z-[var(--z-cursor)] transition-all duration-150",
          cursorVariant === "hover"
            ? "border-[var(--color-orange)] scale-150 opacity-80"
            : cursorVariant === "text"
            ? "border-white/30 w-16 h-16 -translate-x-3"
            : "border-white/30"
        )}
      />
    </>
  );
}
