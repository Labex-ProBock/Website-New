"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, [role='button'], input, select, textarea, label, [data-cursor]";

export default function ConditionalCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<"default" | "hover">("default");

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let raf: number;
    let mx = -100, my = -100;
    let rx = -100, ry = -100;

    const move = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const tick = () => {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      dot.style.transform = `translate3d(${mx}px,${my}px,-50%,-50%)`;
      dot.style.left = `${mx}px`;
      dot.style.top = `${my}px`;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onOver = (e: MouseEvent) => {
      const target = (e.target as Element).closest(INTERACTIVE);
      if (target && stateRef.current !== "hover") {
        stateRef.current = "hover";
        dot.classList.add("cursor-hover");
        ring.classList.add("cursor-hover");
      } else if (!target && stateRef.current !== "default") {
        stateRef.current = "default";
        dot.classList.remove("cursor-hover");
        ring.classList.remove("cursor-hover");
      }
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
