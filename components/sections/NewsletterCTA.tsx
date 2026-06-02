"use client";

import { useState } from "react";
import Link from "next/link";
import AmbientGrain from "@/components/ui/AmbientGrain";
import MagneticButton from "@/components/motion/MagneticButton";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || submitting) return;

    setSubmitting(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Stub — proceed to success state
    } finally {
      setSubscribed(true);
      setSubmitting(false);
    }
  }

  return (
    <section
      className="py-[var(--section-gap)] px-6 relative overflow-hidden"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <AmbientGrain />

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

        {/* LEFT — spec CTA */}
        <div>
          <h2 className="font-display font-black text-h2 text-white" style={{ lineHeight: 1.05 }}>
            Specify your equipment. We&apos;ll handle the rest.
          </h2>

          <RevealOnScroll delay={0.15}>
            <p style={{ color: "var(--color-muted)" }} className="mt-6">
              Tell us your application and throughput requirements — our technical
              team will identify the right instrument from 10+ global brands and
              send a detailed proposal.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.25}>
            <MagneticButton>
              <Link
                href="/quote"
                style={{ backgroundColor: "var(--color-orange)" }}
                className="px-8 py-4 rounded-2xl font-bold text-base text-white mt-8 inline-block"
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--color-orange-deep)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--color-orange)";
                }}
              >
                Specify your equipment →
              </Link>
            </MagneticButton>
          </RevealOnScroll>
        </div>

        {/* RIGHT — newsletter */}
        <RevealOnScroll delay={0.1} from="right">
          <div>
            <p className="font-display font-bold text-xl text-white mb-2">
              Stay current
            </p>
            <p style={{ color: "var(--color-muted)" }} className="text-sm mb-6">
              New products, industry news, and application notes — straight to your inbox.
            </p>

            {subscribed ? (
              <p style={{ color: "var(--color-orange)" }} className="font-medium text-sm">
                You&apos;re on the list — thank you.
              </p>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{
                    backgroundColor: "var(--color-surface-2)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-white)",
                  }}
                  className="w-full px-4 py-3 rounded-xl border focus:border-[var(--color-orange)] placeholder-[var(--color-muted)] outline-none text-sm transition-colors"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ backgroundColor: "var(--color-orange)" }}
                  className="mt-3 w-full px-6 py-3 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer disabled:opacity-60"
                  onMouseEnter={(e) => {
                    if (!submitting)
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-orange-deep)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-orange)";
                  }}
                >
                  {submitting ? "Subscribing…" : "Subscribe"}
                </button>
              </form>
            )}

            <p style={{ color: "var(--color-muted)" }} className="text-xs mt-3">
              POPIA compliant. Unsubscribe any time.
            </p>
          </div>
        </RevealOnScroll>

      </div>
    </section>
  );
}
