import Link from "next/link";
import SiteFooter from "@/components/sections/SiteFooter";
import ReadingProgressBar from "@/components/ui/ReadingProgressBar";
import { ArrowLeft } from "lucide-react";

// Placeholder slugs — generateStaticParams must return these
const PLACEHOLDER_ARTICLES = [
  {
    slug: "labex-heidolph-partnership-25-years",
    title: "25 Years of Partnership: Labex and Heidolph",
    date: "January 2026",
    tag: "Partnership",
    readTime: "5 min read",
    body: [
      "When Labex first signed a distribution agreement with Heidolph Instruments in the early 2000s, rotary evaporators were already workhorses in South African pharmaceutical and research laboratories. What neither party fully anticipated was how deeply the partnership would grow over the next two and a half decades.",
      "Heidolph's engineering philosophy — precision above all, longevity built in — aligned perfectly with Labex's service model. Where other distributors treated capital equipment as a sale-and-move-on product category, Labex built a team around it: technicians trained in Schwabach, Germany, spare parts inventoried in Edenvale, and a direct line to Heidolph's applications team.",
      "Today, Labex is one of the strongest performing Heidolph distributors in the African region. The relationship has expanded well beyond rotary evaporators to overhead stirrers, shakers, heating plates, and block heaters — covering the full range of liquid handling and thermal processing applications in modern laboratories.",
      "Looking ahead, the partnership is exploring digital integration: smart instruments that log usage data, flag maintenance intervals, and connect to laboratory information systems. For South African labs, this is the direction travel — and Labex intends to be the distributor that gets them there.",
    ],
  },
  {
    slug: "sartorius-analytical-balances-guide",
    title: "Choosing the Right Analytical Balance: A Practical Guide",
    date: "December 2025",
    tag: "Technical",
    readTime: "7 min read",
    body: [
      "The analytical balance is the most-used piece of capital equipment in any quantitative laboratory. It is also, paradoxically, the piece of equipment most often under-specified — purchased on price alone, with insufficient attention paid to the parameters that actually determine fitness for purpose.",
      "Readability is the specification most buyers lead with: 0.1 mg, 0.01 mg, 1 µg. But readability is only meaningful in the context of repeatability. A balance that reads to 0.1 mg but delivers a standard deviation of 0.5 mg across ten measurements is not a 0.1 mg balance in any useful sense.",
      "Linearity error — the deviation of the balance's response from a perfectly straight line across its full capacity range — matters enormously in pharmaceutical QC, where you may be weighing API at microgram scale and excipients at gram scale in the same workflow. A balance with good corner load performance but poor linearity will mislead you at extremes.",
      "Temperature stability and draft sensitivity are often overlooked until the first failed calibration. If your balance is placed near a HVAC vent, a door, or a busy walkway, you need a model with robust air draft dampening and a fast settling time. Sartorius's Cubis II series addresses this with an active mechanical draft shield and rapid stabilisation circuitry.",
      "Our recommendation for pharmaceutical QC applications under SANS/ISO 8655 or pharmacopoeia requirements: specify to the method, not to a round number. Work backwards from your smallest critical mass, apply the minimum weight calculation, and select a balance with at least 3x margin on repeatability. Then call us — we'll validate it.",
    ],
  },
  {
    slug: "popia-laboratory-data-compliance",
    title: "POPIA and Laboratory Data: What SA Labs Need to Know",
    date: "November 2025",
    tag: "Compliance",
    readTime: "6 min read",
    body: [
      "The Protection of Personal Information Act (POPIA) has been fully in force since July 2021, yet many South African laboratories remain uncertain about what it requires of them. The confusion is understandable: POPIA is broad, its application to laboratory contexts is not always obvious, and the Information Regulator's enforcement actions have so far focused on larger commercial processors.",
      "The core question for a laboratory is: do we process personal information? The answer is almost always yes. Patient samples carry names and ID numbers. Research data includes consent forms and participant demographics. Supplier and client records contain contact details. Employment records are personal information by definition.",
      "The practical implications for laboratory POPIA compliance centre on five areas: lawful processing grounds (do you have consent or legitimate interest for every data type?), purpose limitation (are you using data only for the purpose for which it was collected?), retention schedules (how long do you keep what, and can you demonstrate a decision behind that?), security measures (is your LIMS appropriately access-controlled?), and third-party processors (your cloud instrument software provider, your courier, your IT support — are they POPIA-compliant and do you have a data processing agreement?).",
      "Labex has completed its own POPIA compliance review and appointed an internal Information Officer. If you receive our quote documentation or have an active supply relationship with us, you can request our POPIA information notice at any time by emailing our Information Officer at sales@labex.co.za.",
    ],
  },
];

export async function generateStaticParams() {
  return PLACEHOLDER_ARTICLES.map((a) => ({ slug: a.slug }));
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = PLACEHOLDER_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--color-black)" }}
      >
        <p style={{ color: "var(--color-muted)" }}>Article not found.</p>
      </div>
    );
  }

  return (
    <>
      <ReadingProgressBar />

      <article
        style={{
          backgroundColor: "var(--color-black)",
          paddingTop: "8rem",
          paddingBottom: "var(--section-gap)",
        }}
        className="px-6"
      >
        <div className="max-w-2xl mx-auto">

          {/* Back link */}
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm mb-12 transition-colors"
            style={{ color: "var(--color-muted)" }}
          >
            <ArrowLeft size={14} />
            Back to News
          </Link>

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <span
                className="text-xs px-3 py-1 rounded-full font-medium uppercase tracking-wider"
                style={{
                  backgroundColor: "rgba(255,106,26,0.15)",
                  color: "var(--color-orange)",
                }}
              >
                {article.tag}
              </span>
              <span
                className="text-xs"
                style={{ color: "var(--color-muted)" }}
              >
                {article.date}
              </span>
              <span
                className="text-xs"
                style={{ color: "var(--color-muted)" }}
              >
                {article.readTime}
              </span>
            </div>

            <h1
              className="font-display font-black text-white leading-tight"
              style={{ fontSize: "var(--text-h1)" }}
            >
              {article.title}
            </h1>
          </div>

          {/* Divider */}
          <div
            className="mb-12"
            style={{ borderTop: "1px solid var(--color-border)" }}
          />

          {/* Body */}
          <div className="flex flex-col gap-6">
            {article.body.map((paragraph, i) => (
              <p
                key={i}
                className="leading-relaxed"
                style={{
                  color: i === 0 ? "rgba(255,255,255,0.85)" : "var(--color-muted)",
                  fontSize: i === 0 ? "var(--text-large)" : "var(--text-base)",
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Footer CTA */}
          <div
            className="mt-16 p-8 rounded-3xl"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p
              className="font-display font-bold text-white mb-3"
              style={{ fontSize: "var(--text-h3)" }}
            >
              Questions about this topic?
            </p>
            <p
              className="text-sm mb-6"
              style={{ color: "var(--color-muted)" }}
            >
              Our team is happy to discuss technical specifications, compliance
              requirements, or product recommendations.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
              style={{
                backgroundColor: "var(--color-orange)",
                color: "var(--color-white)",
              }}
            >
              Talk to our team
            </Link>
          </div>
        </div>
      </article>

      <SiteFooter />
    </>
  );
}
