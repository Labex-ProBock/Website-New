"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Linkedin, Facebook, Instagram } from "lucide-react";
import { homeContent } from "@/content/home";

const quickLinks = [
  { label: "Home",       href: "/"           },
  { label: "About",      href: "/about"      },
  { label: "Industries", href: "/industries" },
  { label: "Products",   href: "/products"   },
  { label: "Contact",    href: "/contact"    },
];

const serviceLinks = [
  { label: "Request a Quote",  href: "/quote"        },
  { label: "Track Shipment",   href: "/contact"      },
  { label: "Browse Products",  href: "/products"     },
  { label: "POPIA Notice",     href: "/legal/popia"  },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Use", href: "/legal/terms" },
  { label: "POPIA Notice", href: "/legal/popia" },
];

export default function SiteFooter() {
  return (
    <footer style={{ backgroundColor: "#0a0a0a" }}>

      {/* Orange top accent */}
      <div style={{ height: "3px", background: "linear-gradient(to right, transparent 0%, var(--color-orange) 30%, var(--color-orange) 70%, transparent 100%)" }} />

      <div style={{ paddingTop: "5rem", paddingBottom: "2rem", paddingLeft: "3rem", paddingRight: "3rem" }}>

        {/* ── Top row ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Brand col — wider */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-block">
              <p className="font-display font-black text-white" style={{ fontSize: "2rem", lineHeight: 1 }}>
                LABEX<span style={{ color: "var(--color-orange)" }}>.</span>
              </p>
            </Link>

            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "0.5rem" }}>
              Est. 1979 · South Africa
            </p>

            <p style={{ color: "var(--color-muted)", fontSize: "0.9rem", lineHeight: 1.75, marginTop: "1.25rem", maxWidth: "28ch" }}>
              South Africa&apos;s trusted distributor of precision laboratory instruments for research, industry, and healthcare.
            </p>

            {/* Social */}
            <div className="flex gap-4" style={{ marginTop: "1.75rem" }}>
              {[
                { href: "https://linkedin.com", Icon: Linkedin, label: "LinkedIn" },
                { href: "https://facebook.com", Icon: Facebook, label: "Facebook" },
                { href: "https://instagram.com", Icon: Instagram, label: "Instagram" },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="transition-colors duration-200"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-orange)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.3)"; }}
                >
                  <Icon width={18} height={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.18em" }}>
              Quick Links
            </p>
            <nav className="flex flex-col gap-2.5" aria-label="Quick links">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm transition-colors duration-200 hover:text-white"
                  style={{ color: "var(--color-muted)" }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.18em" }}>
              Services
            </p>
            <nav className="flex flex-col gap-2.5" aria-label="Services">
              {serviceLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm transition-colors duration-200 hover:text-white"
                  style={{ color: "var(--color-muted)" }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.18em" }}>
              Contact Us
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin width={15} height={15} className="shrink-0 mt-0.5" style={{ color: "var(--color-orange)" }} />
                <span className="text-sm" style={{ color: "var(--color-muted)", lineHeight: 1.6 }}>
                  {homeContent.contact.address}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone width={15} height={15} className="shrink-0" style={{ color: "var(--color-orange)" }} />
                <a
                  href={`tel:${homeContent.contact.phone}`}
                  className="text-sm transition-colors duration-200 hover:text-white"
                  style={{ color: "var(--color-muted)" }}
                >
                  {homeContent.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail width={15} height={15} className="shrink-0" style={{ color: "var(--color-orange)" }} />
                <a
                  href={`mailto:${homeContent.contact.email}`}
                  className="text-sm transition-colors duration-200 hover:text-white"
                  style={{ color: "var(--color-muted)" }}
                >
                  {homeContent.contact.email}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div
          className="flex flex-wrap justify-between items-center gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "4rem", paddingTop: "2rem" }}
        >
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            © 2026 Labex Pty Ltd. All rights reserved.
          </p>

          <nav className="flex flex-wrap gap-6" aria-label="Legal links">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs transition-colors duration-200 hover:text-white"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

      </div>
    </footer>
  );
}
