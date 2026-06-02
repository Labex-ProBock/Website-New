"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { industries } from "@/content/industries";
import { registerGSAP, gsap } from "@/lib/gsap";
import {
  ResearchMotif,
  PharmaceuticalMotif,
  ChemicalMotif,
  EducationMotif,
  QualityControlMotif,
  FoodBeverageMotif,
} from "@/components/industry-motifs";

// Intro + 6 industries + final "all" slide = 8 panels
const TOTAL_PANELS = 8;
const SCROLL_PAGES = 7;

const MOTIFS: Record<string, React.ComponentType> = {
  research: ResearchMotif,
  pharmaceutical: PharmaceuticalMotif,
  chemical: ChemicalMotif,
  education: EducationMotif,
  "quality-control": QualityControlMotif,
  "food-beverage": FoodBeverageMotif,
};

function MagneticCTA({ href, label }: { href: string; label: string }) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 18;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 10;
    el.style.transform = `translate(${x}px,${y}px)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0px,0px)";
  };

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="hover:shadow-[0_0_36px_10px_rgba(255,106,26,0.22)]"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.6rem",
        backgroundColor: "var(--color-orange)",
        color: "#fff",
        padding: "0.9rem 2.25rem",
        borderRadius: "999px",
        fontWeight: 700,
        fontSize: "0.875rem",
        textDecoration: "none",
        transition: "transform 0.3s cubic-bezier(0.23,1,0.32,1), box-shadow 0.3s",
        letterSpacing: "0.01em",
      }}
    >
      {label} <ArrowRight size={15} />
    </Link>
  );
}

export default function IndustriesSection() {
  const outerRef  = useRef<HTMLDivElement>(null);
  const trackRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    registerGSAP();

    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return;

    const scrollDistance = SCROLL_PAGES * window.innerWidth;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: outer,
          start: "top top",
          end: `+=${scrollDistance}`,
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });
    }, outer);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ── Desktop: CSS sticky + GSAP translateX ─────────────── */}
      <div
        ref={outerRef}
        className="hidden lg:block relative"
        style={{ height: `calc(100vh + ${SCROLL_PAGES * 100}vw)` }}
        aria-label="Industries we serve"
      >
        {/* sticky viewport */}
        <div className="sticky top-0 overflow-hidden" style={{ height: "100vh" }}>

          {/* Track — total width = TOTAL_PANELS × 100vw */}
          <div
            ref={trackRef}
            className="flex h-full will-change-transform"
            style={{ width: `${TOTAL_PANELS * 100}vw` }}
          >

            {/* ── Panel 0: Intro ───────────────────────────── */}
            <div
              className="shrink-0 h-full flex flex-col justify-center"
              style={{ width: "100vw", backgroundColor: "var(--color-black)", padding: "0 6rem" }}
            >
              {/* section annotation */}
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.22)",
                  marginBottom: "2.5rem",
                }}
              >
                04 / Industries
              </p>

              {/* Alternative 1: "Built for the labs that move South African science." */}
              {/* Alternative 2: "Where South Africa's science gets its equipment." */}
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  color: "#fff",
                  fontSize: "clamp(3rem, 5.5vw, 5.5rem)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.04em",
                  maxWidth: "14ch",
                  marginBottom: "1.75rem",
                }}
              >
                Built for the labs that move South African science.
              </h2>

              <p
                style={{
                  color: "rgba(255,255,255,0.38)",
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  maxWidth: "36ch",
                  marginBottom: "3.5rem",
                }}
              >
                Six sectors, four decades of continuous supply, one phone number.
              </p>

              {/* scroll hint */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span
                  style={{
                    display: "block",
                    width: "32px",
                    height: "1px",
                    backgroundColor: "var(--color-orange)",
                    opacity: 0.6,
                  }}
                />
                <p
                  style={{
                    color: "rgba(255,255,255,0.25)",
                    fontSize: "0.7rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  scroll to explore
                </p>
              </div>

              {/* right-edge fade into first industry panel */}
              <div
                className="absolute top-0 right-0 h-full w-40 pointer-events-none"
                style={{ background: "linear-gradient(to left,rgba(10,10,10,0.9),transparent)" }}
              />
            </div>

            {/* ── Panels 1–6: Industry lanes ───────────────── */}
            {industries.map((industry, i) => {
              const Motif = MOTIFS[industry.slug];
              return (
                <div
                  key={industry.slug}
                  className="relative shrink-0 h-full overflow-hidden flex flex-col justify-center"
                  style={{
                    width: "100vw",
                    backgroundColor: "var(--color-black)",
                    padding: "0 6rem",
                  }}
                >
                  {/* SVG motif background */}
                  {Motif && <Motif />}

                  {/* Content */}
                  <div style={{ position: "relative", zIndex: 1, maxWidth: "540px" }}>
                    {/* Panel number */}
                    <p
                      aria-hidden="true"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 900,
                        fontSize: "clamp(5rem, 9vw, 9rem)",
                        lineHeight: 1,
                        color: "var(--color-orange)",
                        opacity: 0.12,
                        letterSpacing: "-0.06em",
                        marginBottom: "0.25rem",
                        userSelect: "none",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </p>

                    {/* Industry name */}
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 900,
                        color: "#fff",
                        fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                        lineHeight: 1.0,
                        letterSpacing: "-0.035em",
                        marginBottom: "1.25rem",
                      }}
                    >
                      {industry.name}
                    </h3>

                    {/* Positioning one-liner */}
                    <p
                      style={{
                        color: "rgba(255,255,255,0.55)",
                        fontSize: "0.975rem",
                        lineHeight: 1.7,
                        maxWidth: "42ch",
                        marginBottom: "1.75rem",
                      }}
                    >
                      {industry.headline}
                    </p>

                    {/* Equipment category chips — monochrome, no orange */}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.45rem",
                        marginBottom: "2.75rem",
                      }}
                    >
                      {industry.applications.map((app) => (
                        <span
                          key={app}
                          style={{
                            fontSize: "0.68rem",
                            color: "rgba(255,255,255,0.48)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            padding: "0.28rem 0.8rem",
                            borderRadius: "999px",
                            letterSpacing: "0.02em",
                          }}
                        >
                          {app}
                        </span>
                      ))}
                    </div>

                    {/* Magnetic CTA */}
                    <MagneticCTA
                      href={`/industries/${industry.slug}`}
                      label={`See ${industry.shortName} equipment`}
                    />
                  </div>

                  {/* Right-edge fade */}
                  <div
                    className="absolute top-0 right-0 h-full w-32 pointer-events-none"
                    style={{ background: "linear-gradient(to left,rgba(10,10,10,0.65),transparent)" }}
                  />
                </div>
              );
            })}

            {/* ── Final panel: all industries ──────────────── */}
            <div
              className="shrink-0 h-full flex items-center justify-center"
              style={{ width: "100vw", backgroundColor: "#090909" }}
            >
              <div
                style={{
                  textAlign: "center",
                  maxWidth: "560px",
                  padding: "3rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "monospace",
                    color: "rgba(255,255,255,0.2)",
                    fontSize: "0.65rem",
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                    marginBottom: "2rem",
                  }}
                >
                  / All industries
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    color: "#fff",
                    fontSize: "clamp(3rem, 6vw, 5rem)",
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                    marginBottom: "1.5rem",
                  }}
                >
                  Every lab.<br />Every sector.
                </h3>
                <p
                  style={{
                    color: "rgba(255,255,255,0.38)",
                    fontSize: "0.95rem",
                    lineHeight: 1.8,
                    marginBottom: "2.5rem",
                  }}
                >
                  And many more. If your lab needs it, we stock it.
                </p>
                <Link
                  href="/industries"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    backgroundColor: "var(--color-orange)",
                    color: "#fff",
                    padding: "0.9rem 2.25rem",
                    borderRadius: "999px",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    textDecoration: "none",
                  }}
                >
                  Explore all industries <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile fallback: vertical stack ───────────────────── */}
      <div className="lg:hidden" style={{ backgroundColor: "var(--color-black)" }}>
        {/* Mobile header */}
        <div style={{ padding: "4.5rem 1.5rem 2.5rem" }}>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.22)",
              marginBottom: "1.25rem",
            }}
          >
            04 / Industries
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              color: "#fff",
              fontSize: "clamp(2rem, 8vw, 2.75rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              marginBottom: "0.875rem",
            }}
          >
            Built for the labs that move South African science.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.875rem", lineHeight: 1.7 }}>
            Six sectors, four decades of continuous supply, one phone number.
          </p>
        </div>

        {/* Industry rows */}
        {industries.map((industry, i) => (
          <div
            key={industry.slug}
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              padding: "2rem 1.5rem",
            }}
          >
            <p
              aria-hidden="true"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "3rem",
                lineHeight: 1,
                color: "var(--color-orange)",
                opacity: 0.12,
                letterSpacing: "-0.04em",
                marginBottom: "0.1rem",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                color: "#fff",
                fontSize: "1.6rem",
                letterSpacing: "-0.02em",
                marginBottom: "0.5rem",
              }}
            >
              {industry.name}
            </h3>
            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "0.875rem",
                lineHeight: 1.65,
                marginBottom: "1rem",
              }}
            >
              {industry.headline}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.25rem" }}>
              {industry.applications.map((app) => (
                <span
                  key={app}
                  style={{
                    fontSize: "0.65rem",
                    color: "rgba(255,255,255,0.38)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    padding: "0.22rem 0.6rem",
                    borderRadius: "999px",
                  }}
                >
                  {app}
                </span>
              ))}
            </div>
            <Link
              href={`/industries/${industry.slug}`}
              style={{
                color: "var(--color-orange)",
                fontSize: "0.875rem",
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              See equipment <ArrowRight size={14} />
            </Link>
          </div>
        ))}

        {/* Mobile footer link */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "2rem 1.5rem" }}>
          <Link
            href="/industries"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "var(--color-orange)",
              color: "#fff",
              padding: "0.8rem 1.75rem",
              borderRadius: "999px",
              fontWeight: 700,
              fontSize: "0.875rem",
              textDecoration: "none",
            }}
          >
            Explore all industries <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </>
  );
}
