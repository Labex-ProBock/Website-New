"use client";

import { Quote } from "lucide-react";
import AmbientGrain from "@/components/ui/AmbientGrain";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import { homeContent } from "@/content/home";

export default function WhyLabex() {
  return (
    <section
      style={{ backgroundColor: "var(--color-black-warm)" }}
      className="py-[var(--section-gap)] px-6 relative overflow-hidden"
    >
      <AmbientGrain />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Heading */}
        <h2 className="font-display font-black text-h2 text-white text-center mb-16">
          {homeContent.whyLabex.headline}
        </h2>

        {/* Testimonial grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {homeContent.whyLabex.testimonials.map((item, index) => (
            <RevealOnScroll key={index} delay={index * 0.15}>
              <article
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                }}
                className="border rounded-3xl p-8 flex flex-col h-full"
              >
                {/* Quote icon */}
                <Quote
                  width={32}
                  height={32}
                  style={{ color: "var(--color-orange)" }}
                  className="mb-6 opacity-60 shrink-0"
                />

                {/* Quote text */}
                <p className="text-base text-white leading-relaxed italic flex-1">
                  {item.quote}
                </p>

                {/* Author block */}
                <div
                  style={{ borderColor: "var(--color-border)" }}
                  className="border-t pt-6 mt-6"
                >
                  <p className="font-semibold text-white text-sm">
                    {item.author}
                  </p>
                  <p
                    style={{ color: "var(--color-muted)" }}
                    className="text-xs mt-1"
                  >
                    {item.company}
                  </p>

                  {/* Placeholder badge */}
                  {item.placeholder && (
                    <span
                      style={{ color: "var(--color-orange)" }}
                      className="inline-block text-[10px] uppercase tracking-widest opacity-50 mt-2"
                    >
                      PLACEHOLDER
                    </span>
                  )}
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
