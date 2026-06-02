"use client";

import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let lenisInstance: Lenis | null = null;

export function initLenis(): Lenis {
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    smoothWheel: true,
    touchMultiplier: 2,
  });

  /* Sync with GSAP ScrollTrigger */
  lenisInstance.on("scroll", () => ScrollTrigger.update());

  /* RAF loop */
  function raf(time: number) {
    lenisInstance?.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  return lenisInstance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function destroyLenis() {
  lenisInstance?.destroy();
  lenisInstance = null;
}
