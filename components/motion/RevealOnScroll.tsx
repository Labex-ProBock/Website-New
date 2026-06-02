"use client";

import { useEffect, useRef } from "react";
import { registerGSAP, gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  from?: "bottom" | "left" | "right" | "fade";
  threshold?: number;
}

export default function RevealOnScroll({
  children,
  className,
  delay = 0,
  from = "bottom",
  threshold = 0.2,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    registerGSAP();

    const el = ref.current;
    if (!el) return;

    // Set initial position for left/right reveals (bottom is handled via CSS [data-reveal])
    if (from === "left") gsap.set(el, { x: -60 });
    else if (from === "right") gsap.set(el, { x: 60 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: `top ${(1 - threshold) * 100}%`,
      onEnter: () => {
        gsap.to(el, { opacity: 1, y: 0, x: 0, duration: 0.9, delay, ease: "power3.out" });
      },
      once: true,
    });

    return () => trigger.kill();
  }, [delay, from, threshold]);

  return (
    <div ref={ref} data-reveal className={cn(className)}>
      {children}
    </div>
  );
}
