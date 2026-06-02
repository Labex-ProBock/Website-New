import type { Metadata } from "next";
import Link from "next/link";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import SiteFooter from "@/components/sections/SiteFooter";

export const metadata: Metadata = {
  title: "News & Insights | Labex",
  description:
    "Latest news, technical insights, and laboratory equipment updates from Labex — South Africa's trusted laboratory equipment distributor.",
};

// TODO: Replace with real CMS content
const placeholderArticles = [
  {
    slug: "labex-heidolph-partnership-25-years",
    title: "25 Years of Partnership: Labex and Heidolph",
    date: "January 2026",
    excerpt:
      "Two and a half decades of distributing Germany's finest rotary evaporators and stirrers in South Africa — and what's next for the partnership.",
    tag: "Partnership",
  },
  {
    slug: "sartorius-analytical-balances-guide",
    title: "Choosing the Right Analytical Balance: A Practical Guide",
    date: "December 2025",
    excerpt:
      "Readability, capacity, linearity, and repeatability — our technical team breaks down what actually matters when specifying a precision balance for pharmaceutical QC.",
    tag: "Technical",
  },
  {
    slug: "popia-laboratory-data-compliance",
    title: "POPIA and Laboratory Data: What SA Labs Need to Know",
    date: "November 2025",
    excerpt:
      "South African laboratories handle sensitive research data, client results, and personal information daily. Here's what POPIA compliance means for your lab.",
    tag: "Compliance",
  },
];

export default function NewsPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        style={{ backgroundColor: "var(--color-black-warm)" }}
        className="py-40 text-center px-6"
      >
        <div className="max-w-3xl mx-auto">
          <p
            className="text-xs uppercase tracking-widest mb-6"
            style={{ color: "var(--color-orange)" }}
          >
            From the lab
          </p>
          <h1 className="font-display font-black text-white leading-tight" style={{ fontSize: "var(--text-h1)" }}>
            News &amp; insights
          </h1>
          <RevealOnScroll delay={0.3}>
            <p
              className="mt-6"
              style={{
                color: "var(--color-muted)",
                fontSize: "var(--text-large)",
              }}
            >
              Technical guides, industry news, and updates from South
              Africa&apos;s laboratory community.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── Article cards ─────────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "var(--color-black)",
          paddingTop: "var(--section-gap)",
          paddingBottom: "var(--section-gap)",
        }}
        className="px-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {placeholderArticles.map((article, i) => (
            <RevealOnScroll key={article.slug} delay={i * 0.1}>
              <Link
                href={`/news/${article.slug}`}
                className="group flex flex-col rounded-3xl overflow-hidden"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {/* Placeholder image area */}
                <div
                  className="aspect-video flex items-center justify-center"
                  style={{ backgroundColor: "var(--color-surface-2)" }}
                >
                  <span
                    className="text-xs uppercase tracking-widest font-medium"
                    style={{ color: "var(--color-orange)" }}
                  >
                    {article.tag}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6">
                  <p
                    className="text-xs mb-3"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {article.date}
                  </p>
                  <h3
                    className="font-display font-bold text-white mb-3 leading-snug group-hover:text-[var(--color-orange)] transition-colors"
                    style={{ fontSize: "var(--text-h3)" }}
                  >
                    {article.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed flex-1"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {article.excerpt}
                  </p>
                  <p
                    className="text-sm font-semibold mt-5 transition-colors group-hover:text-[var(--color-orange)]"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Read more →
                  </p>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
