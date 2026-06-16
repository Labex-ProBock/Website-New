import type { Metadata } from "next";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import SiteFooter from "@/components/sections/SiteFooter";
import LeadForm from "@/components/ui/LeadForm";
import ShipmentChecker from "@/components/ui/ShipmentChecker";
import { homeContent } from "@/content/home";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Labex | Edenvale, Johannesburg",
  description:
    "Get in touch with the Labex team. Based in Edenvale, Johannesburg. Real people, real expertise. Call, email, or send us an enquiry.",
};

const C = "center" as const;

const contactDetails = [
  {
    icon: MapPin,
    label: "Address",
    value: homeContent.contact.address,
    href: "https://maps.google.com/?q=88+17th+Avenue+Edenvale+Johannesburg",
  },
  {
    icon: Phone,
    label: "Telephone",
    value: homeContent.contact.phone,
    href: `tel:${homeContent.contact.phone}`,
  },
  {
    icon: Mail,
    label: "Email",
    value: homeContent.contact.email,
    href: `mailto:${homeContent.contact.email}`,
  },
  {
    icon: Clock,
    label: "Office hours",
    value: homeContent.contact.hours,
    href: null,
  },
];

const trustItems = ["47 years trading", "POPIA compliant", "B-BBEE Level 2", "Mon–Fri 08:00–17:00 SAST"];

export default function ContactPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        style={{
          backgroundColor: "var(--color-black-warm)",
          paddingTop: "10rem",
          paddingBottom: "5rem",
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
              05 / Contact
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
              Talk to our team
            </h1>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2} className="text-center">
            <p
              style={{
                textAlign: C,
                color: "var(--color-muted)",
                fontSize: "1.05rem",
                lineHeight: 1.8,
                marginTop: "1.75rem",
                maxWidth: "38rem",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Based in Edenvale, Johannesburg. Real people, real expertise —
              not a call centre.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── Contact details strip ── */}
      <section
        style={{
          backgroundColor: "var(--color-black)",
          borderTop: "1px solid var(--color-border)",
          borderBottom: "1px solid var(--color-border)",
          paddingTop: "2.5rem",
          paddingBottom: "2.5rem",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}
      >
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          style={{ maxWidth: "72rem", margin: "0 auto" }}
        >
          {contactDetails.map(({ icon: Icon, label, value, href }, i) => (
            <RevealOnScroll key={label} delay={i * 0.08}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={15} style={{ color: "var(--color-orange)" }} />
                </div>
                <div>
                  <p
                    style={{
                      color: "var(--color-muted)",
                      fontSize: "0.65rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      marginBottom: "0.3rem",
                    }}
                  >
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      style={{
                        color: "#fff",
                        fontSize: "0.875rem",
                        lineHeight: 1.4,
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                      className="hover:text-[var(--color-orange)]"
                    >
                      {value}
                    </a>
                  ) : (
                    <p style={{ color: "#fff", fontSize: "0.875rem", lineHeight: 1.4 }}>{value}</p>
                  )}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ── Map (1/3) + Form (2/3) ── */}
      <section
        style={{
          backgroundColor: "var(--color-black)",
          paddingTop: "4rem",
          paddingBottom: "4rem",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}
      >
        <div
          className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8"
          style={{ maxWidth: "72rem", margin: "0 auto", alignItems: "flex-start" }}
        >
          {/* Map — 1/3 */}
          <RevealOnScroll from="left">
            <div
              style={{
                borderRadius: "1rem",
                overflow: "hidden",
                border: "1px solid var(--color-border)",
                height: "460px",
              }}
            >
              <iframe
                src="https://maps.google.com/maps?q=88+17th+Avenue,+Edenvale,+Johannesburg,+1609,+South+Africa&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  display: "block",
                  filter: "invert(92%) hue-rotate(180deg) brightness(0.85) contrast(0.9)",
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Labex location — 88 17th Avenue, Edenvale, Johannesburg"
              />
            </div>
          </RevealOnScroll>

          {/* Form — 2/3 */}
          <RevealOnScroll from="right" delay={0.1}>
            <div
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "1rem",
                padding: "2rem",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  color: "#fff",
                  fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                  letterSpacing: "-0.02em",
                  marginBottom: "0.4rem",
                }}
              >
                Send us an enquiry
              </h2>
              <p
                style={{
                  color: "var(--color-muted)",
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                  marginBottom: "1rem",
                }}
              >
                We respond within 1 business day — usually much sooner.
              </p>

              {/* Phone + email — visible alternative to the form */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1.25rem",
                  marginBottom: "1.25rem",
                  paddingBottom: "1.25rem",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <a
                  href={`tel:${homeContent.contact.phone}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    color: "#fff",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  className="hover:text-[var(--color-orange)]"
                >
                  <Phone size={14} style={{ color: "var(--color-orange)", flexShrink: 0 }} />
                  {homeContent.contact.phone}
                </a>
                <a
                  href={`mailto:${homeContent.contact.email}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    color: "#fff",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  className="hover:text-[var(--color-orange)]"
                >
                  <Mail size={14} style={{ color: "var(--color-orange)", flexShrink: 0 }} />
                  {homeContent.contact.email}
                </a>
              </div>

              {/* Trust chips */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.4rem",
                  marginBottom: "1.5rem",
                }}
              >
                {trustItems.map((item) => (
                  <span
                    key={item}
                    style={{
                      fontSize: "0.67rem",
                      color: "rgba(255,255,255,0.4)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      padding: "0.2rem 0.55rem",
                      borderRadius: "999px",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>

              <LeadForm />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── Shipment checker ── */}
      <section
        style={{
          backgroundColor: "var(--color-black-warm)",
          borderTop: "1px solid var(--color-border)",
          paddingTop: "4rem",
          paddingBottom: "4rem",
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
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                letterSpacing: "-0.02em",
                marginBottom: "0.5rem",
              }}
            >
              Check your shipment
            </h2>
            <p
              style={{
                textAlign: C,
                color: "var(--color-muted)",
                fontSize: "0.875rem",
                lineHeight: 1.6,
                marginBottom: "1.75rem",
              }}
            >
              Enter your Labex order reference to track your delivery.
            </p>
          </RevealOnScroll>
          <ShipmentChecker />
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
