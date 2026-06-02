import type { Metadata } from "next";
import SiteFooter from "@/components/sections/SiteFooter";

export const metadata: Metadata = {
  title: "Terms of Use | Labex",
  description:
    "Terms of Use for the Labex Pty Ltd website and online services.",
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

export default function TermsPage() {
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
              Terms of Use
            </h1>
            <p className="text-sm" style={{ color: "var(--color-muted)" }}>
              These Terms of Use govern your access to and use of the Labex
              Pty Ltd website at labex.co.za. By accessing this website, you
              agree to these terms. Last updated: January 2026.
            </p>
          </div>

          <Section title="1. About Labex">
            <p>
              Labex Pty Ltd is a private company incorporated in the Republic
              of South Africa, with its principal place of business at 88 17th
              Avenue, Edenvale, Johannesburg, 1609. Labex is a distributor of
              laboratory equipment and scientific instruments to the South
              African market.
            </p>
          </Section>

          <Section title="2. Acceptance of terms">
            <p>
              By accessing and using this website you accept these Terms of
              Use in full. If you disagree with any part of these terms, you
              must not use this website.
            </p>
            <p>
              Labex reserves the right to revise these Terms of Use at any
              time. Continued use of the website after any revisions constitutes
              acceptance of the updated terms. It is your responsibility to
              check this page periodically for changes.
            </p>
          </Section>

          <Section title="3. Use of this website">
            <p>
              You may use this website for lawful purposes only. You must not
              use this website:
            </p>
            <ul className="list-none flex flex-col gap-2 pl-4">
              {[
                "In any way that is unlawful, fraudulent, or harmful, or in connection with any unlawful, fraudulent, or harmful purpose",
                "To transmit unsolicited commercial communications (spam)",
                "To crawl, scrape, or harvest content or data without our prior written permission",
                "To attempt to gain unauthorised access to any part of the website or its underlying infrastructure",
                "To upload or transmit viruses or other malicious code",
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

          <Section title="4. Intellectual property">
            <p>
              All content on this website — including text, graphics,
              photographs, logos, icons, and software — is the property of
              Labex Pty Ltd or its content suppliers and is protected by South
              African and international copyright laws.
            </p>
            <p>
              You may view, download, and print pages from this website for
              your personal, non-commercial use only. You must not reproduce,
              republish, distribute, or create derivative works from any content
              on this website without our express written permission.
            </p>
            <p>
              Product names, brand names, and trademarks appearing on this
              website remain the property of their respective owners. Their
              display on this website does not imply any licence or right to
              use those marks.
            </p>
          </Section>

          <Section title="5. Product information and pricing">
            <p>
              Product descriptions, specifications, and images on this website
              are provided for reference purposes and are subject to change
              without notice. Labex makes reasonable efforts to ensure accuracy
              but does not warrant that product information is complete, current,
              or error-free.
            </p>
            <p>
              Prices, where displayed, are indicative only and exclude VAT and
              delivery unless otherwise stated. All firm pricing is provided by
              formal quotation only. Labex reserves the right to correct pricing
              errors before confirming any order.
            </p>
            <p>
              Product availability is subject to supplier stock and lead times.
              Enquiries and quotation requests submitted through this website do
              not constitute binding orders or commitments on the part of Labex.
            </p>
          </Section>

          <Section title="6. Limitation of liability">
            <p>
              To the maximum extent permitted by South African law, Labex
              excludes all liability arising from or in connection with your
              use of this website, including but not limited to any loss of
              data, business interruption, or consequential loss.
            </p>
            <p>
              Nothing in these terms limits Labex&apos;s liability for fraud,
              fraudulent misrepresentation, or any liability that cannot be
              excluded under applicable law including the Consumer Protection
              Act 68 of 2008 where it applies.
            </p>
          </Section>

          <Section title="7. Links to third-party websites">
            <p>
              This website may contain links to third-party websites. These
              links are provided for your convenience only. Labex does not
              endorse, control, or accept responsibility for the content of
              any linked website. You access linked websites at your own risk.
            </p>
          </Section>

          <Section title="8. Governing law">
            <p>
              These Terms of Use are governed by the laws of the Republic of
              South Africa. Any disputes arising under or in connection with
              these terms will be subject to the exclusive jurisdiction of the
              South African courts.
            </p>
          </Section>

          <Section title="9. Contact">
            <p>
              If you have any questions about these Terms of Use, please
              contact us:
            </p>
            <div
              className="p-5 rounded-2xl text-sm mt-2"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <p className="text-white font-semibold mb-1">Labex Pty Ltd</p>
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
