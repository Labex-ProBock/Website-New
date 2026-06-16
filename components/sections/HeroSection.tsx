"use client";

import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import MagneticButton from "@/components/motion/MagneticButton";
import { registerGSAP, gsap } from "@/lib/gsap";

/* ── Conical flask paths (viewBox 0 0 260 420) ────────────────────── */
const FLASK = {
  vw: 260,
  vh: 420,
  /* Outer glass silhouette — straight neck, sharp shoulder, straight body sides */
  outer:
    "M 98 10 L 162 10 L 162 140 L 236 368 Q 240 408 130 408 Q 20 408 24 368 L 98 140 Z",
  /* Inner liquid volume — inset ~6 px for glass-wall illusion */
  inner:
    "M 104 14 L 156 14 L 156 140 L 230 368 Q 234 400 130 400 Q 26 400 30 368 L 104 140 Z",
  innerH: 400, // y of inner bottom curve
  /* Shoulder y — where neck meets body */
  shoulderY: 140,
  /* Inner body x at shoulder and at base (for measurement lines) */
  innerNeckL: 104, innerBodyL: 30, innerBodyR: 230, innerBodyY: 368,
};

export default function HeroSection() {
  const flaskClipRef = useRef<SVGRectElement>(null);
  const pourRef = useRef<SVGGElement>(null);

  /* Liquid rises on mount, pours as you scroll away */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    registerGSAP();

    const ctx = gsap.context(() => {
      /* ── Fill flask on load ─────────────────────────────────────── */
      if (flaskClipRef.current) {
        gsap.fromTo(
          flaskClipRef.current,
          { attr: { y: FLASK.innerH } },
          {
            attr: { y: FLASK.innerH * 0.28 }, // fill to ~72%
            duration: 2.2,
            ease: "power2.out",
            delay: 0.3,
          }
        );
      }

      /* ── Pour stream fades in after fill ───────────────────────── */
      if (pourRef.current) {
        gsap.fromTo(
          pourRef.current,
          { opacity: 0, scaleY: 0, transformOrigin: "top center" },
          { opacity: 1, scaleY: 1, duration: 0.6, delay: 2.0, ease: "power2.out" }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100svh",
        overflow: "hidden",
        backgroundColor: "#0A0A0A",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* ── Background grain ─────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Large Erlenmeyer flask (right side, behind text) ──────── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: "2vw",
          bottom: "-1vh",
          width: "min(42vw, 460px)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <svg
          viewBox={`0 0 ${FLASK.vw} ${FLASK.vh}`}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMax meet"
          overflow="visible"
        >
          <defs>
            {/* Liquid gradient */}
            <linearGradient id="flask-liq" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF8C42" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#AA2D00" stopOpacity="0.92" />
            </linearGradient>
            {/* Glass gradient */}
            <linearGradient id="flask-glass" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="white" stopOpacity="0.12" />
              <stop offset="35%" stopColor="white" stopOpacity="0.04" />
              <stop offset="100%" stopColor="white" stopOpacity="0.10" />
            </linearGradient>
            {/* Clip that rises */}
            <clipPath id="flask-liquid-clip">
              <rect
                ref={flaskClipRef}
                x="0"
                y={FLASK.innerH}
                width={FLASK.vw}
                height={FLASK.innerH + 20}
              />
            </clipPath>
          </defs>

          {/* Liquid inside flask */}
          <path
            d={FLASK.inner}
            fill="url(#flask-liq)"
            clipPath="url(#flask-liquid-clip)"
          />

          {/* Bubbles (clipped to liquid) */}
          {[
            { cx: 80,  cy: 340, r: 5, delay: "0s",   dur: "3s" },
            { cx: 150, cy: 310, r: 3, delay: "1.1s",  dur: "2.5s" },
            { cx: 110, cy: 360, r: 4, delay: "0.6s",  dur: "3.5s" },
            { cx: 180, cy: 330, r: 2, delay: "1.8s",  dur: "2.2s" },
            { cx: 60,  cy: 350, r: 3, delay: "2.3s",  dur: "2.8s" },
          ].map((b, i) => (
            <circle
              key={i}
              cx={b.cx}
              cy={b.cy}
              r={b.r}
              fill="rgba(255,255,255,0.22)"
              clipPath="url(#flask-liquid-clip)"
              style={{
                animation: `flask-bubble ${b.dur} ease-out infinite`,
                animationDelay: b.delay,
              }}
            />
          ))}

          {/* Flask glass outline */}
          <path
            d={FLASK.outer}
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Glass shine */}
          <path d={FLASK.inner} fill="url(#flask-glass)" />

          {/* Measurement lines — follow left edge of conical body */}
          {[0.3, 0.48, 0.65, 0.82].map((t, i) => {
            const y   = FLASK.shoulderY + (FLASK.innerBodyY - FLASK.shoulderY) * t;
            const lx  = FLASK.innerNeckL + (FLASK.innerBodyL - FLASK.innerNeckL) * t;
            return (
              <line
                key={i}
                x1={lx + 4}
                y1={y}
                x2={lx + 20}
                y2={y}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Pour stream from flask neck — drips downward off-canvas */}
          <g ref={pourRef} opacity={0}>
            <path
              d={`M 125 408 Q 128 430 125 460 Q 122 490 128 520`}
              fill="none"
              stroke="#FF6A1A"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.5"
            />
            {/* Drip drop */}
            <ellipse cx="127" cy="526" rx="5" ry="7" fill="#FF6A1A" opacity="0.4" />
          </g>
        </svg>
      </div>

      {/* ── Floating small test tubes (decorative) ───────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "3vw",
          top: "15vh",
          zIndex: 1,
          pointerEvents: "none",
          opacity: 0.18,
        }}
      >
        <SmallTube rotate={-18} fillRatio={0.6} delay={0.5} />
      </div>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "8vw",
          top: "55vh",
          zIndex: 1,
          pointerEvents: "none",
          opacity: 0.12,
        }}
      >
        <SmallTube rotate={12} fillRatio={0.35} delay={1.0} />
      </div>

      {/* ── Main content ─────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 clamp(1.5rem, 5vw, 4rem)",
          paddingTop: "clamp(5rem, 7vh, 6.5rem)",
          paddingBottom: "4rem",
        }}
      >
        {/* Eyebrow */}
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.7rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#FF6A1A",
            marginBottom: "2rem",
          }}
        >
          Est. 1979 · Edenvale, Johannesburg
        </p>

        {/* Headline */}
        <h1
          className="font-display font-black text-white"
          style={{
            fontSize: "clamp(2.8rem, 6vw, 6.5rem)",
            lineHeight: 1.0,
            maxWidth: "14ch",
            marginBottom: "2rem",
          }}
        >
          Your Partner Behind Every Result
        </h1>

        {/* Subheading */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(1rem, 1.4vw, 1.2rem)",
            color: "rgba(255,255,255,0.5)",
            maxWidth: "38ch",
            lineHeight: 1.7,
            marginBottom: "3rem",
          }}
        >
          Premium lab equipment and scientific instruments — supplied, supported,
          and serviced by people who know science.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <MagneticButton strength={0.3}>
            <Link
              href="/quote"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.9rem 2rem",
                borderRadius: "0.75rem",
                backgroundColor: "#FF6A1A",
                color: "#fff",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.95rem",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#E04E00";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#FF6A1A";
              }}
            >
              Get a Quote
            </Link>
          </MagneticButton>

          <MagneticButton strength={0.3}>
            <Link
              href="/brands"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.9rem 2rem",
                borderRadius: "0.75rem",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.8)",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "0.95rem",
                textDecoration: "none",
                whiteSpace: "nowrap",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.15)";
              }}
            >
              Our Brands
            </Link>
          </MagneticButton>
        </div>
      </div>

      {/* ── Scroll cue ───────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
          }}
        >
          Scroll
        </span>
        <ChevronDown
          width={16}
          height={16}
          style={{ color: "rgba(255,106,26,0.6)", animation: "bounce 2s infinite" }}
        />
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        @keyframes flask-bubble {
          0%   { transform: translateY(0)     scale(1);   opacity: 0.4; }
          80%  { opacity: 0.2; }
          100% { transform: translateY(-280px) scale(0.3); opacity: 0; }
        }
      `}</style>
    </section>
  );
}

/* ── Small decorative tilted test tube ─────────────────────────── */
function SmallTube({ rotate, fillRatio }: { rotate: number; fillRatio: number; delay?: number }) {
  const w = 28, h = 100, wall = 2;
  const r = (w - wall * 2) / 2;
  const inner = `M${wall},0 L${wall},${h - r} Q${wall},${h + r * 0.9} ${w / 2},${h + r * 0.9} Q${w - wall},${h + r * 0.9} ${w - wall},${h - r} L${w - wall},0`;
  const outer = `M${wall},0 L${wall},${h - r} Q${wall},${h + r} ${w / 2},${h + r} Q${w - wall},${h + r} ${w - wall},${h - r} L${w - wall},0`;
  const clipH = h + r * 0.9;
  const liquidY = clipH * (1 - fillRatio);

  return (
    <svg
      width={w}
      height={clipH + 4}
      viewBox={`0 0 ${w} ${clipH + 4}`}
      style={{ transform: `rotate(${rotate}deg)`, display: "block" }}
    >
      <defs>
        <clipPath id={`sm-clip-${rotate}`}>
          <rect x={wall} y={liquidY} width={w - wall * 2} height={clipH} />
        </clipPath>
      </defs>
      <path d={inner} fill="#FF6A1A" clipPath={`url(#sm-clip-${rotate})`} opacity={0.8} />
      <path d={outer} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={wall} />
      <style>{`
        @keyframes sm-fill-${rotate} {
          from { opacity: 0; }
          to   { opacity: 0.8; }
        }
      `}</style>
    </svg>
  );
}
