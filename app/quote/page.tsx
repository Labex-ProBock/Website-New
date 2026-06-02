import type { Metadata } from "next";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import SiteFooter from "@/components/sections/SiteFooter";
import QuoteWizard from "@/components/ui/QuoteWizard";
import { Phone, Mail } from "lucide-react";
import { homeContent } from "@/content/home";

export const metadata: Metadata = {
  title: "Request a Quote | Labex Laboratory Equipment",
  description:
    "Request a quote for laboratory equipment from Labex. Tell us what you need and we'll respond within 1 business day.",
};

export default function QuotePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        style={{ backgroundColor: "var(--color-black-warm)" }}
        className="py-32 px-6 text-center"
      >
        <div className="max-w-2xl mx-auto">
          <p
            className="text-xs uppercase tracking-widest mb-6"
            style={{ color: "var(--color-orange)" }}
          >
            Get started
          </p>
          <h1 className="font-display font-black text-white leading-tight" style={{ fontSize: "var(--text-h1)" }}>
            Request a quote
          </h1>
          <RevealOnScroll delay={0.3}>
            <p
              className="mt-6"
              style={{
                color: "var(--color-muted)",
                fontSize: "var(--text-large)",
              }}
            >
              Tell us what you need. Send us your equipment list, lab specifications, or a description of your project, and we&apos;ll come back to you with a quote within one business day.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── Wizard ────────────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "var(--color-black)",
          paddingTop: "var(--section-gap)",
          paddingBottom: "var(--section-gap)",
        }}
        className="px-6"
      >
        <RevealOnScroll>
          <div
            className="max-w-2xl mx-auto rounded-3xl p-8"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
              border: "1px solid var(--color-border)",
            }}
          >
            <QuoteWizard />
          </div>
        </RevealOnScroll>

        {/* ── Prefer to call? ─────────────────────────────────────── */}
        <RevealOnScroll delay={0.15}>
          <div className="max-w-2xl mx-auto mt-12 text-center">
            <p
              className="text-sm font-medium mb-6"
              style={{ color: "var(--color-muted)" }}
            >
              Prefer to reach us directly?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={`tel:${homeContent.contact.phone}`}
                className="flex items-center gap-3 px-6 py-3 rounded-xl border transition-colors group"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-muted)",
                }}
              >
                <Phone size={16} style={{ color: "var(--color-orange)" }} />
                <span className="text-sm font-medium text-white">
                  {homeContent.contact.phone}
                </span>
              </a>
              <a
                href={`mailto:${homeContent.contact.email}`}
                className="flex items-center gap-3 px-6 py-3 rounded-xl border transition-colors group"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-muted)",
                }}
              >
                <Mail size={16} style={{ color: "var(--color-orange)" }} />
                <span className="text-sm font-medium text-white">
                  {homeContent.contact.email}
                </span>
              </a>
            </div>
            <p
              className="text-xs mt-6"
              style={{ color: "var(--color-muted)" }}
            >
              {homeContent.contact.hours}
            </p>
          </div>
        </RevealOnScroll>
      </section>

      <SiteFooter />
    </>
  );
}
