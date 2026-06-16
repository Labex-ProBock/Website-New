"use client";

import { useEffect, useRef } from "react";
import { registerGSAP, gsap } from "@/lib/gsap";
import AmbientGrain from "@/components/ui/AmbientGrain";
import { yearsTrading } from "@/lib/company";

const YEARS = yearsTrading();

const TUBE_H = 260; // inner liquid height
const TUBE_W = 72;  // outer width
const WALL = 3;

/* SVG path for rounded-bottom test tube */
function tubePath(w: number, h: number, wall: number) {
  const r = (w - wall * 2) / 2;
  const ix = wall;
  const iy = 0;
  return {
    outer: `M${wall},${iy} L${wall},${h - r} Q${wall},${h + r} ${w / 2},${h + r} Q${w - wall},${h + r} ${w - wall},${h - r} L${w - wall},${iy}`,
    inner: `M${ix},${iy} L${ix},${h - r} Q${ix},${h + r * 0.9} ${w / 2},${h + r * 0.9} Q${w - ix},${h + r * 0.9} ${w - ix},${h - r} L${w - ix},${iy}`,
    clipH: h + r * 0.9,
    innerR: r,
    cx: w / 2,
  };
}

interface TubeData {
  stat: string;
  label: string;
  title: string;
  body: string;
  fillRatio: number; // 0–1
  offsetY: number;   // vertical nudge for rack-feel
}

const tubes: TubeData[] = [
  {
    stat: "10+",
    label: "world-leading brands",
    title: "Unmatched Range",
    body: "From precision balances to rotary evaporators — if a South African lab needs it, we distribute it.",
    fillRatio: 0.82,
    offsetY: 20,
  },
  {
    stat: "3",
    label: "internationally trained applications, service engineers and sales consultants",
    title: "Expert Support",
    body: "On-site installation, calibration, and repair. We don't just sell instruments — we keep them running.",
    fillRatio: 0.58,
    offsetY: 0,
  },
  {
    stat: "1979",
    label: "founded — Johannesburg",
    title: `${YEARS} Years of Trust`,
    body: "Deep supplier relationships built over four decades. Priority access and product depth that newer distributors simply can't match.",
    fillRatio: 0.94,
    offsetY: 40,
  },
];

export default function LiquidPillars() {
  const sectionRef = useRef<HTMLElement>(null);
  const clip1 = useRef<SVGRectElement>(null);
  const clip2 = useRef<SVGRectElement>(null);
  const clip3 = useRef<SVGRectElement>(null);
  const stat1 = useRef<HTMLDivElement>(null);
  const stat2 = useRef<HTMLDivElement>(null);
  const stat3 = useRef<HTMLDivElement>(null);
  const clipRefs = [clip1, clip2, clip3];
  const statRefs = [stat1, stat2, stat3];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    registerGSAP();

    const geometry = tubePath(TUBE_W, TUBE_H, WALL);
    const totalH = geometry.clipH;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%",
          end: "top 20%",
          scrub: 1.2,
        },
      });

      tubes.forEach((tube, i) => {
        const clipEl = clipRefs[i].current;
        const statEl = statRefs[i].current;
        if (!clipEl) return;

        const emptyY = totalH;
        const fullY = totalH * (1 - tube.fillRatio);

        // Liquid rise
        tl.fromTo(
          clipEl,
          { attr: { y: emptyY } },
          { attr: { y: fullY }, ease: "power1.inOut" },
          i * 0.08
        );

        // Stat floats up to liquid surface
        if (statEl) {
          const statStart = 100;
          const statEnd = 0;
          tl.fromTo(
            statEl,
            { y: statStart, opacity: 0 },
            { y: statEnd, opacity: 1, ease: "power2.out" },
            i * 0.08
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const geometry = tubePath(TUBE_W, TUBE_H, WALL);
  const svgH = geometry.clipH + 20;

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: "var(--color-black-warm)" }}
      className="relative overflow-hidden py-24 px-6"
    >
      <AmbientGrain className="absolute inset-0" />

      {/* Section label */}
      <p
        className="relative z-10 text-center text-xs uppercase tracking-[0.3em]"
        style={{ color: "var(--color-orange)", fontFamily: "var(--font-display)", marginBottom: "3.5rem" }}
      >
        What sets Labex apart
      </p>

      <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-0">
        {tubes.map((tube, i) => {
          const clipId = `tube-clip-${i}`;
          const gradId = `tube-grad-${i}`;
          const shineId = `tube-shine-${i}`;
          const g = tubePath(TUBE_W, TUBE_H, WALL);

          return (
            <div
              key={tube.title}
              className="flex flex-col items-center"
              style={{ paddingTop: tube.offsetY }}
            >
              {/* ── SVG tube ── */}
              <div className="relative" style={{ width: TUBE_W, height: svgH }}>
                <svg
                  width={TUBE_W}
                  height={svgH}
                  viewBox={`0 0 ${TUBE_W} ${svgH}`}
                  overflow="visible"
                  aria-hidden="true"
                >
                  <defs>
                    {/* Liquid gradient */}
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF8C42" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#C43E00" stopOpacity="0.95" />
                    </linearGradient>

                    {/* Glass shine */}
                    <linearGradient id={shineId} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="white" stopOpacity="0.18" />
                      <stop offset="40%" stopColor="white" stopOpacity="0" />
                    </linearGradient>

                    {/* Clip rect — animates upward to reveal liquid */}
                    <clipPath id={clipId}>
                      <rect
                        ref={clipRefs[i] as React.RefObject<SVGRectElement>}
                        x={WALL}
                        y={g.clipH}       /* start empty */
                        width={TUBE_W - WALL * 2}
                        height={g.clipH + 10}
                      />
                    </clipPath>
                  </defs>

                  {/* Liquid fill body */}
                  <path
                    d={g.inner}
                    fill={`url(#${gradId})`}
                    clipPath={`url(#${clipId})`}
                  />

                  {/* Bubble 1 */}
                  <circle
                    cx={g.cx - 8}
                    cy={TUBE_H * 0.6}
                    r={3}
                    fill="rgba(255,255,255,0.25)"
                    clipPath={`url(#${clipId})`}
                    style={{
                      animation: "bubble-rise 2.8s ease-out infinite",
                      animationDelay: `${i * 0.6}s`,
                    }}
                  />
                  <circle
                    cx={g.cx + 6}
                    cy={TUBE_H * 0.75}
                    r={2}
                    fill="rgba(255,255,255,0.2)"
                    clipPath={`url(#${clipId})`}
                    style={{
                      animation: "bubble-rise 3.4s ease-out infinite",
                      animationDelay: `${i * 0.6 + 1.1}s`,
                    }}
                  />
                  <circle
                    cx={g.cx + 1}
                    cy={TUBE_H * 0.85}
                    r={1.5}
                    fill="rgba(255,255,255,0.15)"
                    clipPath={`url(#${clipId})`}
                    style={{
                      animation: "bubble-rise 2.2s ease-out infinite",
                      animationDelay: `${i * 0.6 + 2.0}s`,
                    }}
                  />

                  {/* Glass tube outline */}
                  <path
                    d={g.outer}
                    fill="none"
                    stroke="rgba(255,255,255,0.22)"
                    strokeWidth={WALL}
                    strokeLinecap="round"
                  />

                  {/* Glass shine overlay */}
                  <path
                    d={g.inner}
                    fill={`url(#${shineId})`}
                  />

                  {/* Top rim */}
                  <line
                    x1={WALL}
                    y1={1}
                    x2={TUBE_W - WALL}
                    y2={1}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                </svg>

                {/* Stat — floats at liquid surface */}
                <div
                  ref={statRefs[i] as React.RefObject<HTMLDivElement>}
                  className="absolute right-0 top-0 text-right pointer-events-none"
                  style={{
                    transform: `translateX(calc(100% + 12px))`,
                    marginTop: `${svgH * (1 - tube.fillRatio) - 16}px`,
                    opacity: 0,
                    width: "max-content",
                  }}
                >
                  <span
                    className="font-display font-black block leading-none"
                    style={{
                      fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                      color: "var(--color-orange)",
                    }}
                  >
                    {tube.stat}
                  </span>
                  <span
                    className="text-xs uppercase tracking-widest block mt-1"
                    style={{ color: "var(--color-muted)", maxWidth: 130 }}
                  >
                    {tube.label}
                  </span>
                </div>
              </div>

              {/* Text below tube */}
              <div className="mt-10 text-center px-4" style={{ maxWidth: 220 }}>
                <h3
                  className="font-display font-bold text-white mb-2"
                  style={{ fontSize: "1.1rem" }}
                >
                  {tube.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--color-muted)" }}>
                  {tube.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Global bubble keyframe */}
      <style>{`
        @keyframes bubble-rise {
          0%   { transform: translateY(0)    scale(1);   opacity: 0.5; }
          80%  { opacity: 0.3; }
          100% { transform: translateY(-${TUBE_H}px) scale(0.2); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
