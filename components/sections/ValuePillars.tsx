"use client";

import AmbientGrain from "@/components/ui/AmbientGrain";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import { homeContent } from "@/content/home";

export default function ValuePillars() {
  return (
    <section
      className="relative overflow-hidden bg-[var(--color-black-warm)] py-[var(--section-gap)] px-6"
    >
      <AmbientGrain className="absolute inset-0" />

      <div className="relative z-10">
        {/* Heading */}
        <h2 className="font-display font-black text-center mb-16" style={{ fontSize: "var(--text-h2)", color: "white" }}>
          What sets Labex apart
        </h2>

        {/* Pillar grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {homeContent.valuePillars.map((pillar, index) => (
            <RevealOnScroll key={pillar.title} delay={index * 0.15}>
              <div className="relative overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-8 hover:border-orange transition-colors duration-300 group cursor-pointer">
                {/* Stat number */}
                <p className="font-display font-black text-[5rem] leading-none text-[var(--color-orange)] mb-2">
                  {pillar.stat}
                </p>

                {/* Stat label */}
                <p className="text-xs uppercase tracking-widest text-[var(--color-muted)] mb-6">
                  {pillar.statLabel}
                </p>

                {/* Pillar title */}
                <h3 className="font-display font-bold text-xl text-white mb-3">
                  {pillar.title}
                </h3>

                {/* Body */}
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                  {pillar.body}
                </p>

                {/* Expanding orange bottom border */}
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-[var(--color-orange)] transition-all duration-500"
                />
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
