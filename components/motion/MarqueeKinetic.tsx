"use client";

import { useEffect, useRef } from "react";
import { registerGSAP } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { cn } from "@/lib/utils";

interface MarqueeKineticProps {
  text: string;
  repeat?: number;
  speed?: number; /* px/s base */
  direction?: "left" | "right";
  className?: string;
  textClassName?: string;
  style?: React.CSSProperties;
}

export default function MarqueeKinetic({
  text,
  repeat = 8,
  speed = 80,
  direction = "left",
  className,
  textClassName,
  style,
}: MarqueeKineticProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    registerGSAP();

    const el = trackRef.current;
    if (!el) return;

    const half = el.scrollWidth / 2;

    /* Base scroll */
    let rafId: number;
    const tick = () => {
      const vel = velocityRef.current;
      const dir = direction === "left" ? -1 : 1;
      xRef.current += (speed / 60) * dir + vel * 0.5 * dir;
      velocityRef.current *= 0.9;

      /* Loop */
      if (Math.abs(xRef.current) >= half) xRef.current = 0;

      el.style.transform = `translate3d(${xRef.current}px,0,0)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    /* Hook into Lenis scroll velocity */
    const lenis = getLenis();
    const onScroll = ({ velocity }: { velocity: number }) => {
      velocityRef.current = velocity * 8;
    };
    lenis?.on("scroll", onScroll);

    return () => {
      cancelAnimationFrame(rafId);
      lenis?.off("scroll", onScroll);
    };
  }, [speed, direction]);

  const items = Array.from({ length: repeat }, (_, i) => i);

  return (
    <div className={cn("overflow-hidden", className)} aria-hidden="true">
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        {items.map((i) => (
          <span
            key={i}
            className={cn(
              "inline-block pr-16 font-display font-black uppercase select-none",
              textClassName
            )}
            style={style}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
