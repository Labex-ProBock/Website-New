"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Menu, X, Phone, ArrowRight } from "lucide-react";
import { useLabexStore } from "@/lib/store";
import { useAssistant } from "@/lib/assistant-store";
import { cn } from "@/lib/utils";
import ProductsMegaMenu from "@/components/layout/ProductsMegaMenu";
import MagneticButton from "@/components/motion/MagneticButton";

export default function SiteNav() {
  const { menuOpen, toggleMenu, setMenuOpen } = useLabexStore();
  const openAssistant = useAssistant((s) => s.open);

  useEffect(() => {
    setMenuOpen(false);
  }, [setMenuOpen]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[var(--z-overlay)] bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[var(--color-border)]"
      >
        <nav
          className="grid items-center"
          style={{ padding: "1.25rem 2.5rem", gridTemplateColumns: "1fr auto 1fr" }}
          aria-label="Main navigation"
        >
          {/* Col 1: Logo */}
          <Link
            href="/"
            className="font-display font-black text-2xl tracking-tight text-white hover:text-[var(--color-orange)] transition-colors"
            aria-label="Labex — home"
          >
            LABEX<span className="text-[var(--color-orange)]">.</span>
          </Link>

          {/* Col 2: Nav links — true viewport-centre */}
          <ul className="hidden md:flex items-center gap-6" role="list">
            <li>
              <Link href="/" className="font-display text-sm font-semibold tracking-wide text-[var(--color-muted)] hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="font-display text-sm font-semibold tracking-wide text-[var(--color-muted)] hover:text-white transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/industries" className="font-display text-sm font-semibold tracking-wide text-[var(--color-muted)] hover:text-white transition-colors">
                Industries
              </Link>
            </li>
            <ProductsMegaMenu />
            <li>
              <Link href="/contact" className="font-display text-sm font-semibold tracking-wide text-[var(--color-muted)] hover:text-white transition-colors">
                Contact
              </Link>
            </li>
          </ul>

          {/* Col 3: Right cluster + mobile toggle */}
          <div className="flex items-center justify-end gap-2">

            {/* Desktop right side */}
            <div className="hidden md:flex items-center gap-2">

              {/* Phone — icon only */}
              <a
                href="tel:0117281338"
                aria-label="Call us on (011) 728 1338"
                className="flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  width: "36px",
                  height: "36px",
                  backgroundColor: "var(--color-surface-2)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "10px",
                  color: "var(--color-muted)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.12)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "white";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--color-border)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-muted)";
                }}
              >
                <Phone className="w-4 h-4" />
              </a>

              {/* Primary CTA → opens the persistent assistant panel */}
              <MagneticButton>
                <button
                  type="button"
                  onClick={() => openAssistant()}
                  className="flex items-center gap-1.5 font-semibold text-sm text-white cursor-pointer flex-shrink-0"
                  style={{
                    height: "36px",
                    backgroundColor: "var(--color-orange)",
                    borderRadius: "10px",
                    padding: "0 1rem",
                    border: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  Get a quote
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </MagneticButton>

            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 text-white cursor-pointer"
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-[25] flex flex-col justify-center px-8 transition-transform duration-500",
          menuOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ backgroundColor: "var(--color-black)" }}
        aria-hidden={!menuOpen}
      >
        <button
          className="absolute top-6 right-6 p-2 text-white cursor-pointer"
          onClick={toggleMenu}
          aria-label="Close menu"
        >
          <X className="w-8 h-8" />
        </button>

        <nav aria-label="Mobile navigation">
          <ul className="flex flex-col gap-5" role="list">
            {[
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Industries", href: "/industries" },
              { label: "Products", href: "/products" },
              { label: "Contact", href: "/contact" },
            ].map((link, i) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-display text-4xl font-bold text-white hover:text-[var(--color-orange)] transition-colors cursor-pointer"
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className="mt-10 pt-8 flex flex-col gap-4"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              openAssistant();
            }}
            className="flex items-center justify-center gap-2 rounded-xl font-semibold text-white cursor-pointer"
            style={{
              backgroundColor: "var(--color-orange)",
              padding: "0.875rem",
              border: "none",
            }}
          >
            <ArrowRight className="w-5 h-5" />
            Get a quote
          </button>
          <a
            href="tel:0117281338"
            className="flex items-center gap-3 transition-colors hover:text-white cursor-pointer"
            style={{ color: "var(--color-muted)" }}
          >
            <Phone className="w-5 h-5" />
            (011) 728 1338
          </a>
        </div>
      </div>
    </>
  );
}
