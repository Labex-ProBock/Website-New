import type { Metadata } from "next";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import SiteFooter from "@/components/sections/SiteFooter";
import { aboutContent } from "@/content/about";

export const metadata: Metadata = {
  title: "About Labex | 50+ Years of Laboratory Excellence",
  description:
    "Family-run since 1979, Labex is South Africa's most trusted laboratory equipment distributor.",
};

const C = "center" as const; // shorthand so every textAlign is explicit

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section style={{ backgroundColor: "var(--color-black-warm)", paddingTop: "10rem", paddingBottom: "7rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
          <RevealOnScroll>
            <p style={{ textAlign: C, color: "var(--color-orange)", fontSize: "0.75rem", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
              About Labex
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <h1 style={{ textAlign: C, fontFamily: "var(--font-display)", fontWeight: 900, color: "#fff", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 1.05, marginBottom: "0" }}>
              Built on trust.<br />Backed by expertise.
            </h1>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p style={{ textAlign: C, color: "var(--color-muted)", fontSize: "1.05rem", lineHeight: 1.8, marginTop: "2rem", maxWidth: "42rem", marginLeft: "auto", marginRight: "auto" }}>
              {aboutContent.subheadline}
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ backgroundColor: "var(--color-black)", paddingTop: "5rem", paddingBottom: "5rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        <div style={{ maxWidth: "56rem", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}
          className="md:grid-cols-4">
          {aboutContent.stats.map((stat, i) => (
            <RevealOnScroll key={stat.label} delay={i * 0.1}>
              <div
                className="border border-[var(--color-border)] rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(255,106,26,0.5)] hover:shadow-[0_0_28px_4px_rgba(255,106,26,0.18)]"
                style={{ backgroundColor: "var(--color-surface)", padding: "1.5rem", textAlign: C }}
              >
                <p style={{ textAlign: C, fontFamily: "var(--font-display)", fontWeight: 900, lineHeight: 1, color: "var(--color-orange)", fontSize: stat.value.length > 4 ? "1.5rem" : "3rem", marginBottom: "0.5rem" }}>
                  {stat.value}
                </p>
                <p style={{ textAlign: C, color: "var(--color-muted)", fontSize: "0.875rem" }}>
                  {stat.label}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ── Founder ── */}
      <section style={{ backgroundColor: "var(--color-black)", paddingTop: "5rem", paddingBottom: "5rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        <div style={{ maxWidth: "42rem", margin: "0 auto" }}>
          <RevealOnScroll>
            <p style={{ textAlign: C, color: "var(--color-orange)", fontSize: "0.75rem", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "1rem" }}>
              Founder
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <h2 style={{ textAlign: C, fontFamily: "var(--font-display)", fontWeight: 900, color: "#fff", fontSize: "clamp(2rem, 3.5vw, 3rem)", marginBottom: "0.5rem" }}>
              {aboutContent.founder.name}
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.15}>
            <p style={{ textAlign: C, color: "var(--color-orange)", fontSize: "0.9rem", fontWeight: 500, marginBottom: "0.5rem" }}>
              {aboutContent.founder.title}
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p style={{ textAlign: C, color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "2.5rem" }}>
              Est. {aboutContent.founder.established}
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.25}>
            <p style={{ textAlign: C, color: "var(--color-muted)", fontSize: "1rem", lineHeight: 1.85 }}>
              {aboutContent.founder.bio}
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── Director quote ── */}
      <section style={{ backgroundColor: "var(--color-black-warm)", paddingTop: "5rem", paddingBottom: "5rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        <div style={{ maxWidth: "48rem", margin: "0 auto" }}>
          <RevealOnScroll>
            <div style={{ width: "3rem", height: "4px", backgroundColor: "var(--color-orange)", borderRadius: "999px", margin: "0 auto 2.5rem" }} />
            <blockquote style={{ textAlign: C, fontFamily: "var(--font-display)", fontWeight: 900, color: "#fff", fontSize: "clamp(1.4rem, 2.8vw, 2.1rem)", lineHeight: 1.3, marginBottom: "2rem" }}>
              &ldquo;{aboutContent.director.quote}&rdquo;
            </blockquote>
            <p style={{ textAlign: C, color: "#fff", fontWeight: 600, fontSize: "1rem", marginBottom: "0.25rem" }}>
              {aboutContent.director.name}
            </p>
            <p style={{ textAlign: C, color: "var(--color-orange)", fontSize: "0.75rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>
              {aboutContent.director.title}
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── Address strip ── */}
      <section style={{ backgroundColor: "var(--color-black)", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)", padding: "2rem 1.5rem" }}>
        <div style={{ maxWidth: "64rem", margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "1.5rem", fontSize: "0.875rem", color: "var(--color-muted)" }}>
          <span>88 17th Avenue, Edenvale, Johannesburg, 1609</span>
          <span aria-hidden="true" style={{ color: "var(--color-border)" }}>|</span>
          <a href="tel:0117281338" className="hover:text-white transition-colors">(011) 728 1338</a>
          <span aria-hidden="true" style={{ color: "var(--color-border)" }}>|</span>
          <a href="mailto:sales@labex.co.za" className="hover:text-white transition-colors">sales@labex.co.za</a>
        </div>
      </section>

      {/* ── Values ── */}
      <section style={{ backgroundColor: "var(--color-black-warm)", paddingTop: "5rem", paddingBottom: "6rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
          <RevealOnScroll>
            <h2 style={{ textAlign: C, fontFamily: "var(--font-display)", fontWeight: 900, color: "#fff", fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "3rem" }}>
              What we stand for
            </h2>
          </RevealOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ gridAutoRows: "1fr" }}>
            {aboutContent.values.map((value, i) => (
              <RevealOnScroll key={value.title} delay={i * 0.1} className="h-full">
                <div
                  className="border border-[var(--color-border)] rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(255,106,26,0.5)] hover:shadow-[0_0_28px_4px_rgba(255,106,26,0.18)] h-full"
                  style={{ backgroundColor: "var(--color-surface)", padding: "1.5rem", textAlign: C }}
                >
                  <div style={{ width: "2rem", height: "4px", backgroundColor: "var(--color-orange)", borderRadius: "999px", margin: "0 auto 1rem" }} />
                  <h3 style={{ textAlign: C, fontFamily: "var(--font-display)", fontWeight: 700, color: "#fff", fontSize: "1.15rem", marginBottom: "0.75rem" }}>
                    {value.title}
                  </h3>
                  <p style={{ textAlign: C, color: "var(--color-muted)", fontSize: "0.875rem", lineHeight: 1.7 }}>
                    {value.body}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
