import type { Metadata } from "next";
import Link from "next/link";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import SiteFooter from "@/components/sections/SiteFooter";
import { industries } from "@/content/industries";
import {
  ResearchMotif,
  PharmaceuticalMotif,
  ChemicalMotif,
  EducationMotif,
  QualityControlMotif,
  FoodBeverageMotif,
} from "@/components/industry-motifs";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Industries | Labex",
  description:
    "Labex serves research, pharmaceutical, chemical, education, quality control, and food & beverage laboratories across South Africa.",
};

const C = "center" as const;

const MOTIFS: Record<string, React.ComponentType> = {
  research: ResearchMotif,
  pharmaceutical: PharmaceuticalMotif,
  chemical: ChemicalMotif,
  education: EducationMotif,
  "quality-control": QualityControlMotif,
  "food-beverage": FoodBeverageMotif,
};

export default function IndustriesPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        style={{
          backgroundColor: "var(--color-black)",
          paddingTop: "10rem",
          paddingBottom: "7rem",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}
      >
        <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
          <RevealOnScroll className="text-center">
            <p
              style={{
                textAlign: C,
                fontFamily: "monospace",
                color: "rgba(255,255,255,0.22)",
                fontSize: "0.7rem",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                marginBottom: "1.75rem",
              }}
            >
              04 / Industries
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1} className="text-center">
            <h1
              style={{
                textAlign: C,
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                color: "#fff",
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                lineHeight: 1.0,
                letterSpacing: "-0.04em",
                marginBottom: 0,
              }}
            >
              Industries we serve
            </h1>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2} className="text-center">
            <p
              style={{
                textAlign: C,
                color: "rgba(255,255,255,0.38)",
                fontSize: "1.05rem",
                lineHeight: 1.8,
                marginTop: "2rem",
                maxWidth: "38rem",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Six sectors, four decades of continuous supply. If your lab needs it,
              we stock it — and we&apos;ll have a quote to you within one business day.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── Industry card grid ── */}
      <section
        style={{
          backgroundColor: "var(--color-black)",
          paddingTop: "1rem",
          paddingBottom: "6rem",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}
      >
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          style={{ maxWidth: "72rem", margin: "0 auto", gridAutoRows: "1fr" }}
        >
          {industries.map((industry, i) => {
            const Motif = MOTIFS[industry.slug];
            return (
              <RevealOnScroll key={industry.slug} delay={i * 0.07} className="h-full">
                <Link
                  href={`/industries/${industry.slug}`}
                  className="group block h-full relative overflow-hidden rounded-2xl border border-[var(--color-border)] transition-all duration-300 hover:border-[rgba(255,106,26,0.4)] hover:shadow-[0_0_28px_4px_rgba(255,106,26,0.12)]"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    minHeight: "280px",
                  }}
                >
                  {/* SVG motif (decorative, clipped) */}
                  <div className="absolute inset-0 overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                    {Motif && <Motif />}
                  </div>

                  {/* Orange left strip */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-0.5 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ backgroundColor: "var(--color-orange)", opacity: 0.5 }}
                  />

                  {/* Content */}
                  <div
                    className="relative z-10 flex flex-col justify-between h-full"
                    style={{ padding: "1.75rem" }}
                  >
                    <div>
                      {/* Index */}
                      <p
                        aria-hidden="true"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 900,
                          fontSize: "2.5rem",
                          lineHeight: 1,
                          color: "var(--color-orange)",
                          opacity: 0.15,
                          letterSpacing: "-0.04em",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </p>

                      <h2
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 900,
                          color: "#fff",
                          fontSize: "1.5rem",
                          letterSpacing: "-0.02em",
                          lineHeight: 1.1,
                          marginBottom: "0.6rem",
                        }}
                      >
                        {industry.name}
                      </h2>

                      <p
                        style={{
                          color: "rgba(255,255,255,0.45)",
                          fontSize: "0.85rem",
                          lineHeight: 1.6,
                          marginBottom: "1.25rem",
                        }}
                      >
                        {industry.headline}
                      </p>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.5rem" }}>
                        {industry.applications.map((app) => (
                          <span
                            key={app}
                            style={{
                              fontSize: "0.65rem",
                              color: "rgba(255,255,255,0.38)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              padding: "0.2rem 0.6rem",
                              borderRadius: "999px",
                            }}
                          >
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <p
                      style={{
                        color: "#fff",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      View equipment{" "}
                      <span style={{ color: "var(--color-orange)" }}>
                        <ArrowRight size={13} />
                      </span>
                    </p>
                  </div>
                </Link>
              </RevealOnScroll>
            );
          })}
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section
        style={{
          backgroundColor: "var(--color-black-warm)",
          borderTop: "1px solid var(--color-border)",
          paddingTop: "5rem",
          paddingBottom: "5rem",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}
      >
        <div style={{ maxWidth: "42rem", margin: "0 auto" }}>
          <RevealOnScroll className="text-center">
            <h2
              style={{
                textAlign: C,
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                color: "#fff",
                fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)",
                letterSpacing: "-0.02em",
                marginBottom: "1rem",
              }}
            >
              Don&apos;t see your industry?
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1} className="text-center">
            <p
              style={{
                textAlign: C,
                color: "rgba(255,255,255,0.4)",
                fontSize: "1rem",
                lineHeight: 1.8,
                marginBottom: "2rem",
              }}
            >
              And many more. If your lab needs it, we stock it — tell us what you need.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2} className="text-center">
            <div style={{ textAlign: C }}>
              <Link
                href="/quote"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: "var(--color-orange)",
                  color: "#fff",
                  padding: "0.875rem 2rem",
                  borderRadius: "999px",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  textDecoration: "none",
                }}
              >
                Request a quote <ArrowRight size={15} />
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
