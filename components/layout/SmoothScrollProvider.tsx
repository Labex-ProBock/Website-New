"use client";

import { useEffect } from "react";
import { registerGSAP } from "@/lib/gsap";
import { initLenis } from "@/lib/lenis";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    /* Skip if user prefers reduced motion */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    registerGSAP();
    initLenis();
  }, []);

  return <>{children}</>;
}
