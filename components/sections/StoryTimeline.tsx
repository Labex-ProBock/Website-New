"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGSAP } from "@/lib/gsap";
import { homeContent } from "@/content/home";

const CARD_WIDTH = 400;
const LEAD_SPACER = 160;

export default function StoryTimeline() {
  const outerRef        = useRef<HTMLDivElement>(null);
  const trackRef        = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const headingRef      = useRef<HTMLDivElement>(null);

  const milestones = homeContent.story.milestones;
  const trackWidth = LEAD_SPACER + milestones.length * CARD_WIDTH + CARD_WIDTH;
  const lineStart  = LEAD_SPACER + 48;
  const lineWidth  = (milestones.length - 1) * CARD_WIDTH;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    registerGSAP();

    const outer     = outerRef.current;
    const trackEl   = trackRef.current;
    const fillEl    = progressFillRef.current;
    const headingEl = headingRef.current;
    if (!outer || !trackEl || !fillEl || !headingEl) return;

    const scrollDist = () => Math.max(0, trackWidth - window.innerWidth);

    const ctx = gsap.context(() => {
      // Main track scrub
      gsap.to(trackEl, {
        x: () => -scrollDist(),
        ease: "none",
        scrollTrigger: {
          trigger: outer,
          start: "top top",
          end: () => `+=${scrollDist()}`,
          scrub: 1.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set(fillEl, { width: `${self.progress * 100}%` });
          },
        },
      });

      // Heading fades out between 5% and 20% of scroll — separate trigger, no timeline conflict
      gsap.to(headingEl, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: outer,
          start: () => `top+=${scrollDist() * 0.05} top`,
          end:   () => `top+=${scrollDist() * 0.20} top`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }, outer);

    return () => ctx.revert();
  }, [trackWidth]);

  return (
    <>
      {/* ── Desktop ─────────────────────────────────────────────────── */}
      <div
        ref={outerRef}
        className="hidden lg:block relative bg-[var(--color-black-warm)]"
        style={{ height: `calc(100vh + ${trackWidth}px - 100vw)` }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">

          {/* Heading — static at the top, fades out as scroll begins */}
          <div
            ref={headingRef}
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 z-30"
            style={{
              paddingTop: "1rem",
              paddingLeft: "2.5rem",
              paddingRight: "5rem",
              paddingBottom: "0",
              background: "linear-gradient(to right, var(--color-black-warm) 55%, transparent 100%)",
            }}
          >
            <h2
              className="font-display font-black text-[length:var(--text-h1)] text-white leading-[0.92]"
              style={{ maxWidth: "360px" }}
            >
              The Labex<br />story
            </h2>
          </div>

          {/* Horizontal track */}
          <div
            ref={trackRef}
            className="flex h-full will-change-transform"
            style={{ width: `${trackWidth}px` }}
          >
            {/* Lead spacer */}
            <div aria-hidden="true" className="shrink-0 h-full" style={{ width: `${LEAD_SPACER}px` }} />

            {/* Progress line */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 z-10"
              style={{ left: `${lineStart}px`, width: `${lineWidth}px`, height: "1px" }}
            >
              <div className="absolute inset-0 bg-[var(--color-border)]" />
              <div
                ref={progressFillRef}
                className="absolute left-0 top-0 h-full bg-[var(--color-orange)] w-0 transition-none"
              />
            </div>

            {/* Milestone cards */}
            {milestones.map((milestone) => (
              <div
                key={milestone.year}
                className="relative shrink-0 h-full overflow-hidden"
                style={{ width: `${CARD_WIDTH}px` }}
              >
                {/* Watermark year */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none select-none absolute left-0 right-0 flex items-center justify-center font-display font-black"
                  style={{
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "clamp(4rem, 7vw, 6.5rem)",
                    color: "var(--color-orange)",
                    opacity: 0.05,
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {milestone.year}
                </span>

                {/* Year above line */}
                <div className="absolute left-12" style={{ bottom: "calc(50% + 28px)" }}>
                  <p
                    className="font-display font-black leading-none select-none"
                    style={{ fontSize: "3.5rem", color: "var(--color-orange)", opacity: 0.45 }}
                  >
                    {milestone.year}
                  </p>
                </div>

                {/* Dot on the line */}
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 left-12 -translate-y-1/2 w-3 h-3 rounded-full z-20"
                  style={{ backgroundColor: "var(--color-orange)" }}
                />

                {/* Event below line */}
                <div className="absolute left-12" style={{ top: "calc(50% + 24px)", maxWidth: "280px" }}>
                  <p
                    className="font-display font-bold text-white"
                    style={{ fontSize: "1.1rem", lineHeight: 1.4 }}
                  >
                    {milestone.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile fallback ──────────────────────────────────────────── */}
      <section className="lg:hidden bg-[var(--color-black-warm)] py-[var(--section-gap)] px-6">
        <h2 className="font-display font-black text-[length:var(--text-h2)] text-white mb-16 max-w-6xl mx-auto">
          The Labex story
        </h2>
        <ol className="max-w-2xl mx-auto space-y-10 relative pl-8">
          <span
            aria-hidden="true"
            className="absolute left-0 top-0 h-full w-px bg-[var(--color-border)]"
          />
          {milestones.map((m) => (
            <li key={m.year} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[1.35rem] top-1.5 w-3 h-3 rounded-full bg-[var(--color-orange)]"
              />
              <p className="font-display font-black text-[2.5rem] leading-none text-[var(--color-orange)] opacity-50">
                {m.year}
              </p>
              <p className="font-display font-bold text-lg text-white mt-1">
                {m.event}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
