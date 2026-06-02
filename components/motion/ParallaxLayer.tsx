"use client";

import { useEffect, useRef } from "react";
import { registerGSAP, gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface ParallaxLayerProps {
  children: React.ReactNode;
  depth?: number; /* 0 = no parallax, 1 = normal, 2 = double speed */
  className?: string;
}

export default function ParallaxLayer({
  children,
  depth = 0.5,
  className,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    registerGSAP();

    const el = ref.current;
    if (!el) return;

    const st = gsap.to(el, {
      y: `${depth * -80}px`,
      ease: "none",
      scrollTrigger: {
        trigger: el.parentElement ?? el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      (st.scrollTrigger as ScrollTrigger | undefined)?.kill();
      st.kill();
    };
  }, [depth]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
