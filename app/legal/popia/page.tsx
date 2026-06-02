import type { Metadata } from "next";
import SiteFooter from "@/components/sections/SiteFooter";

export const metadata: Metadata = {
  title: "POPIA Information Notice | Labex",
  description:
    "Labex Pty Ltd POPIA Information Notice — how we collect, store, and protect your personal information under the Protection of Personal Information Act.",
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

export default function PopiaPage() {
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
              POPIA Information Notice
            </h1>
            <p className="text-sm" style={{ color: "var(--color-muted)" }}>
              Issued by Labex Pty Ltd (Registration No. TBC) in terms of
              Section 18 of the Protection of Personal Information Act 4 of
              2013 (&quot;POPIA&quot;). Last updated: January 2026.
            </p>
          </div>

          {/* Sections */}
          <Section title="1. Who collects your personal information">
            <p>
              Labex Pty Ltd (&quot;Labex&quot;, &quot;we&quot;,
              &quot;us&quot;), a private company incorporated in South Africa,
              is the responsible party for the purposes of POPIA. Our principal
              place of business is 88 17th Avenue, Edenvale, Johannesburg, 1609.
            </p>
            <p>
              We are responsible for all personal information collected through
              this website, our sales and ordering processes, our technical
              support operations, and any other means by which we interact with
              clients, prospective clients, suppliers, and employees.
            </p>
          </Section>

          <Section title="2. What personal information we collect">
            <p>We may collect and process the following categories of personal information:</p>
            <ul className="list-none flex flex-col gap-2 pl-4">
              {[
                "Identification information: name, job title, company name",
                "Contact information: email address, telephone number, postal or physical address",
                "Transaction information: order history, quotation records, invoices, payment references",
                "Technical enquiry information: equipment specifications, application descriptions, site conditions",
                "Communications: correspondence by email, telephone, or web form",
                "Website usage data: IP address, browser type, pages visited, time on site (via analytics)",
                "Marketing preferences: newsletter subscription status and communication preferences",
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
              We do not collect special personal information (as defined in
              Section 26 of POPIA) in the normal course of our business. If
              any such information is provided incidentally, it will be treated
              with heightened confidentiality and not processed without explicit
              consent.
            </p>
          </Section>

          <Section title="3. Why we collect your information">
            <p>We process personal information for the following purposes:</p>
            <ul className="list-none flex flex-col gap-2 pl-4">
              {[
                "To respond to product enquiries, quotation requests, and technical support queries",
                "To process orders, manage deliveries, and handle invoicing and payments",
                "To maintain our client relationship and provide after-sales technical support",
                "To send relevant product news, technical guides, and service updates (where consent has been given)",
                "To comply with legal obligations including tax, accounting, and export control requirements",
                "To improve our website and digital services through anonymised analytics",
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
              We rely on the following processing grounds under POPIA Section
              11: performance of a contract (orders and service delivery),
              compliance with a legal obligation (tax and accounting), and
              legitimate interests (sales follow-up, relationship management)
              subject to appropriate balancing against data subjects&apos; rights.
            </p>
          </Section>

          <Section title="4. How we store and protect your information">
            <p>
              Personal information is stored on secure servers located in South
              Africa or in jurisdictions that provide an adequate level of
              protection equivalent to POPIA requirements. We apply industry-
              standard technical and organisational measures to protect personal
              information against unauthorised access, loss, destruction, or
              alteration.
            </p>
            <p>
              Access to personal information is restricted to staff members who
              require it for their legitimate job functions. All staff handling
              personal information are required to comply with this notice and
              our internal data protection procedures.
            </p>
            <p>
              We retain personal information only for as long as necessary for
              the purpose for which it was collected, or as required by law.
              Client transaction records are retained for seven years in
              compliance with the Companies Act. Marketing contact records are
              deleted upon withdrawal of consent.
            </p>
          </Section>

          <Section title="5. Sharing your information">
            <p>
              We do not sell, rent, or trade personal information to third
              parties. We may share personal information with:
            </p>
            <ul className="list-none flex flex-col gap-2 pl-4">
              {[
                "Our principal suppliers (e.g. Heidolph, Sartorius) where required to process a warranty claim, service order, or specialised technical query — and only to the extent necessary",
                "Logistics and courier service providers for the purposes of order fulfilment and shipment tracking",
                "Our IT service providers and cloud platform operators who process data on our behalf under written data processing agreements",
                "Regulatory authorities or law enforcement agencies where required by law",
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

          <Section title="6. Your rights under POPIA">
            <p>
              As a data subject, you have the following rights in terms of POPIA:
            </p>
            <ul className="list-none flex flex-col gap-2 pl-4">
              {[
                "Right of access: to request confirmation of whether we hold your personal information and to obtain a copy",
                "Right of correction or deletion: to request that inaccurate or incomplete information be corrected or destroyed",
                "Right to object: to object to the processing of your personal information on grounds relating to your specific situation",
                "Right to withdraw consent: where processing is based on consent, to withdraw that consent at any time",
                "Right to lodge a complaint: to lodge a complaint with the Information Regulator of South Africa",
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
              To exercise any of these rights, please contact our Information
              Officer using the details below. We will respond within 30 days
              of receiving a verifiable request.
            </p>
          </Section>

          <Section title="7. Contact our Information Officer">
            <p>
              All POPIA-related queries, requests, and complaints should be
              directed to our designated Information Officer:
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
            <p>
              The Information Regulator of South Africa can be contacted at{" "}
              <a
                href="https://inforegulator.org.za"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--color-orange)" }}
                className="hover:underline"
              >
                inforegulator.org.za
              </a>{" "}
              or complaints.IR@justice.gov.za.
            </p>
          </Section>

        </div>
      </main>

      <SiteFooter />
    </>
  );
}
