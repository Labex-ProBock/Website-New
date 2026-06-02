"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Scene3DProps {
  children: React.ReactNode;
  className?: string;
  rootMargin?: string;
}

/**
 * Lazy-mounts 3D canvas children only when section enters viewport.
 * Prevents unnecessary GPU workload for off-screen scenes.
 */
export default function Scene3D({
  children,
  className,
  rootMargin = "200px",
}: Scene3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {mounted && children}
    </div>
  );
}
