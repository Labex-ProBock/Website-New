import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/sections/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy | Labex",
  description:
    "Privacy Policy for Labex Pty Ltd — how we handle your personal information when you use our website and services.",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2
        className="font-display font-bold text-white mb-4 pb-3"
        style={{
          fontSize: "var(--text-h3)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        {title}
      </h2>
      <div
        className="flex flex-col gap-4 text-sm leading-relaxed"
        style={{ color: "var(--color-muted)" }}
      >
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <main
        style={{
          backgroundColor: "var(--color-black)",
          paddingTop: "8rem",
          paddingBottom: "var(--section-gap)",
        }}
        className="px-6"
      >
        <div className="max-w-3xl mx-auto">

          {/* Page header */}
          <div className="mb-16">
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: "var(--color-orange)" }}
            >
              Legal
            </p>
            <h1
              className="font-display font-black text-white mb-4"
              style={{ fontSize: "var(--text-h1)" }}
            >
              Privacy Policy
            </h1>
            <p className="text-sm" style={{ color: "var(--color-muted)" }}>
              This Privacy Policy explains how Labex Pty Ltd collects, uses,
              and protects your personal information when you interact with our
              website and services. Last updated: January 2026.
            </p>
          </div>

          <Section title="1. Introduction">
            <p>
              Labex Pty Ltd (&quot;Labex&quot;, &quot;we&quot;, &quot;us&quot;,
              &quot;our&quot;) is committed to protecting your privacy and
              handling your personal information responsibly. This Privacy
              Policy describes our practices with respect to personal
              information collected through our website at labex.co.za and
              through our sales and support processes.
            </p>
            <p>
              This policy should be read together with our{" "}
              <Link
                href="/legal/popia"
                style={{ color: "var(--color-orange)" }}
                className="hover:underline"
              >
                POPIA Information Notice
              </Link>
              , which provides additional detail on your rights as a data
              subject under South African law.
            </p>
          </Section>

          <Section title="2. Information we collect">
            <p>
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-none flex flex-col gap-2 pl-4">
              {[
                "Contact and identification details when you submit an enquiry, request a quote, or contact our team",
                "Order and transaction information when you place an order or request a service",
                "Communications you send us by email, telephone, or web form",
                "Newsletter and marketing preferences where you have subscribed",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: "var(--color-orange)" }}
                  />
                  {item}
                </li>
              ))}
            </ul>
            <p>
              We also collect certain information automatically when you visit
              our website, including your IP address, browser type, referring
              URL, and pages visited. This information is collected using
              standard web analytics tools and is used in aggregated,
              anonymised form to improve the website.
            </p>
          </Section>

          <Section title="3. Cookies and tracking">
            <p>
              Our website uses cookies — small text files stored on your device
              — to operate core website functions and to analyse traffic
              patterns. We use the following categories of cookies:
            </p>
            <ul className="list-none flex flex-col gap-2 pl-4">
              {[
                "Strictly necessary cookies: required for the website to function and cannot be disabled",
                "Analytics cookies: help us understand how visitors use the website (anonymised data)",
                "Preference cookies: remember your settings and choices",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: "var(--color-orange)" }}
                  />
                  {item}
                </li>
              ))}
            </ul>
            <p>
              We do not use advertising, retargeting, or social media tracking
              cookies. You can control cookie settings through your browser
              preferences. Blocking strictly necessary cookies may affect
              website functionality.
            </p>
          </Section>

          <Section title="4. How we use your information">
            <p>We use the information we collect to:</p>
            <ul className="list-none flex flex-col gap-2 pl-4">
              {[
                "Respond to your enquiries and provide the products and services you request",
                "Process and manage orders, deliveries, and payments",
                "Provide technical support and after-sales service",
                "Send transactional communications related to your orders or service requests",
                "Send marketing communications where you have given consent, including product news and technical updates",
                "Improve our website, products, and services based on aggregate usage data",
                "Comply with our legal and regulatory obligations",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: "var(--color-orange)" }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="5. Marketing communications">
            <p>
              If you subscribe to our newsletter or opt in to marketing
              communications, we will send you relevant product updates,
              technical articles, and occasional promotional offers. You may
              withdraw your consent and unsubscribe at any time by:
            </p>
            <ul className="list-none flex flex-col gap-2 pl-4">
              {[
                "Clicking the unsubscribe link in any marketing email",
                "Emailing us at sales@labex.co.za with &ldquo;Unsubscribe&rdquo; in the subject line",
                "Contacting us by telephone at (011) 728 1338",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: "var(--color-orange)" }}
                  />
                  {item}
                </li>
              ))}
            </ul>
            <p>
              We will process your unsubscribe request within 5 business days.
              You will continue to receive transactional communications related
              to active orders or service agreements.
            </p>
          </Section>

          <Section title="6. Data retention">
            <p>
              We retain personal information for as long as necessary to
              fulfil the purpose for which it was collected, subject to our
              legal and regulatory obligations. Our general retention periods
              are:
            </p>
            <ul className="list-none flex flex-col gap-2 pl-4">
              {[
                "Client transaction records: 7 years (Companies Act requirement)",
                "General correspondence and enquiry records: 3 years from last interaction",
                "Marketing contact records: until consent is withdrawn",
                "Website analytics data: 26 months (aggregated and anonymised)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: "var(--color-orange)" }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="7. Security">
            <p>
              We implement appropriate technical and organisational measures
              to protect your personal information against unauthorised access,
              disclosure, alteration, or destruction. These measures include
              encrypted data transmission (HTTPS), access controls, and regular
              security reviews.
            </p>
            <p>
              No method of transmission over the internet or electronic storage
              is completely secure. While we take data security seriously, we
              cannot guarantee absolute security. If you have reason to believe
              your interaction with us is no longer secure, please notify us
              immediately at sales@labex.co.za.
            </p>
          </Section>

          <Section title="8. Changes to this policy">
            <p>
              We may update this Privacy Policy from time to time. We will
              post any changes on this page with an updated date. For material
              changes, we will endeavour to notify affected parties by email
              where we hold contact details.
            </p>
          </Section>

          <Section title="9. Contact us">
            <p>
              For any questions about this Privacy Policy or how we handle your
              personal information, please contact our Information Officer:
            </p>
            <div
              className="p-5 rounded-2xl text-sm mt-2"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <p className="text-white font-semibold mb-1">
                Information Officer — Labex Pty Ltd
              </p>
              <p>88 17th Avenue, Edenvale, Johannesburg, 1609</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:sales@labex.co.za"
                  style={{ color: "var(--color-orange)" }}
                  className="hover:underline"
                >
                  sales@labex.co.za
                </a>
              </p>
              <p>Telephone: (011) 728 1338</p>
            </div>
          </Section>

        </div>
      </main>

      <SiteFooter />
    </>
  );
}
