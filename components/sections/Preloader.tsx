"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLabexStore } from "@/lib/store";

/* ── Flask geometry (viewBox 80 × 130) ──────────────────────────── */
const FLASK_PATH =
  "M 30 5 L 50 5 L 50 45 L 72 113 Q 76 120 68 120 L 12 120 Q 4 120 8 113 L 30 45 Z";
const LIQUID_BOTTOM = 120; // y-coord of the lowest interior point
const LIQUID_TOP    = 5;   // y-coord when completely full (top of neck)

export default function Preloader() {
  const setLoaded = useLabexStore((s) => s.setLoaded);
  const [progress, setProgress] = useState(0);
  const [exiting,  setExiting]  = useState(false);
  const [visible,  setVisible]  = useState(true);
  const [isFull,   setIsFull]   = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef   = useRef<number | null>(null);

  /* liquid surface Y — moves from bottom (120) to top (5) */
  const liquidY =
    LIQUID_BOTTOM - (progress / 100) * (LIQUID_BOTTOM - LIQUID_TOP);

  /* gentle sine-wave surface at the liquid level */
  const amp = 3;
  const wavePath = [
    `M 0 ${liquidY}`,
    `Q 20 ${liquidY - amp} 40 ${liquidY}`,
    `Q 60 ${liquidY + amp} 80 ${liquidY}`,
    `L 80 130 L 0 130 Z`,
  ].join(" ");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timerRef.current = setTimeout(() => {
        setLoaded(true);
        setVisible(false);
      }, 100);
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }

    const startTime = performance.now();
    const duration  = 1200; // slow enough to see the fill

    const tick = (now: number) => {
      const p = Math.min(((now - startTime) / duration) * 100, 100);
      setProgress(p);

      if (p < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setIsFull(true);
        /* hold full state so bubbles + glow are visible */
        timerRef.current = setTimeout(() => {
          setLoaded(true);
          setExiting(true);
        }, 900);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current)  cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [setLoaded]);

  const handleExitComplete = () => setVisible(false);

  if (!visible) return null;

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!exiting && (
        <>
          {/* ── Top curtain ── */}
          <motion.div
            key="curtain-top"
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.75, ease: [0.87, 0, 0.13, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              bottom: "50%",
              backgroundColor: "#0A0A0A",
              zIndex: "var(--z-loader)" as unknown as number,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingBottom: "2.5rem",
            }}
          >
            {/* Logo */}
            <div style={{ textAlign: "center", marginBottom: "2.25rem" }}>
              <div style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(3rem, 8vw, 5rem)",
                letterSpacing: "0.25em",
                color: "#FFFFFF",
                lineHeight: 1,
              }}>
                LABEX
              </div>
              <div style={{
                fontFamily: "monospace",
                fontSize: "0.75rem",
                letterSpacing: "0.3em",
                color: "#FF6A1A",
                marginTop: "0.75rem",
              }}>
                &#47;&#47; SINCE 1979
              </div>
            </div>

            {/* ── Flask ── */}
            <style>{`
              @keyframes lbx-bubble {
                0%   { transform: translateY(0);     opacity: 0.75; }
                100% { transform: translateY(-52px); opacity: 0;    }
              }
              @keyframes lbx-glow {
                0%, 100% { filter: drop-shadow(0 0 4px  rgba(255,106,26,0.3)); }
                50%       { filter: drop-shadow(0 0 18px rgba(255,106,26,0.9)); }
              }
              @keyframes lbx-sparkle {
                0%   { transform: scale(0) rotate(0deg);    opacity: 1; }
                60%  { transform: scale(1.6) rotate(15deg); opacity: 1; }
                100% { transform: scale(0) rotate(30deg);   opacity: 0; }
              }
            `}</style>

            <svg
              width="80"
              height="130"
              viewBox="0 0 80 130"
              style={{
                overflow: "visible",
                animation: isFull ? "lbx-glow 0.65s ease-in-out 4" : "none",
              }}
              aria-hidden="true"
            >
              <defs>
                <clipPath id="lbx-flask">
                  <path d={FLASK_PATH} />
                </clipPath>
              </defs>

              {/* ── Liquid fill (clipped to flask shape) ── */}
              <g clipPath="url(#lbx-flask)">

                {/* Main liquid rect */}
                <rect
                  x="0" y={liquidY} width="80" height="130"
                  fill="#FF6A1A" opacity="0.82"
                />

                {/* Wave surface */}
                <path d={wavePath} fill="#FF6A1A" opacity="0.96" />

                {/* Inner highlight streak */}
                {liquidY < 110 && (
                  <rect
                    x="35" y={liquidY + 5} width="3.5"
                    height={Math.max(0, 108 - liquidY - 5)}
                    fill="rgba(255,255,255,0.13)" rx="1.5"
                  />
                )}

                {/* Bubbles — only when full */}
                {isFull && (
                  <>
                    <circle cx="31" cy="98" r="3"   fill="rgba(255,255,255,0.45)"
                      style={{ animation: "lbx-bubble 1.1s ease-in 0.0s infinite" }} />
                    <circle cx="50" cy="88" r="2.5" fill="rgba(255,255,255,0.35)"
                      style={{ animation: "lbx-bubble 1.4s ease-in 0.2s infinite" }} />
                    <circle cx="39" cy="79" r="2"   fill="rgba(255,255,255,0.3)"
                      style={{ animation: "lbx-bubble 1.7s ease-in 0.45s infinite" }} />
                    <circle cx="56" cy="94" r="1.5" fill="rgba(255,255,255,0.25)"
                      style={{ animation: "lbx-bubble 1.3s ease-in 0.7s infinite" }} />
                    <circle cx="25" cy="105" r="2"  fill="rgba(255,255,255,0.3)"
                      style={{ animation: "lbx-bubble 1.5s ease-in 0.9s infinite" }} />
                  </>
                )}
              </g>

              {/* ── Flask outline ── */}
              <path
                d={FLASK_PATH}
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />

              {/* Sparkles above neck when full */}
              {isFull && (
                <>
                  <circle cx="23" cy="-2"  r="2.5" fill="#FF6A1A"
                    style={{ animation: "lbx-sparkle 0.5s ease-out 0.05s both" }} />
                  <circle cx="57" cy="-4"  r="2"   fill="#FF6A1A"
                    style={{ animation: "lbx-sparkle 0.5s ease-out 0.15s both" }} />
                  <circle cx="40" cy="-8"  r="3"   fill="rgba(255,255,255,0.9)"
                    style={{ animation: "lbx-sparkle 0.6s ease-out 0.0s both"  }} />
                  <circle cx="68" cy="2"   r="1.5" fill="#FF6A1A"
                    style={{ animation: "lbx-sparkle 0.45s ease-out 0.2s both" }} />
                  <circle cx="14" cy="1"   r="1.5" fill="#FF6A1A"
                    style={{ animation: "lbx-sparkle 0.45s ease-out 0.25s both" }} />
                </>
              )}
            </svg>
          </motion.div>

          {/* ── Bottom curtain ── */}
          <motion.div
            key="curtain-bottom"
            initial={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.75, ease: [0.87, 0, 0.13, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              top: "50%",
              backgroundColor: "#0A0A0A",
              zIndex: "var(--z-loader)" as unknown as number,
            }}
          />
        </>
      )}
    </AnimatePresence>
  );
}
