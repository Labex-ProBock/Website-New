import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import SiteNav from "@/components/layout/SiteNav";
import AssistantPanel from "@/components/layout/AssistantPanel";

export const metadata: Metadata = {
  title: {
    default: "Labex Pty Ltd — Laboratory Equipment South Africa",
    template: "%s | Labex",
  },
  description:
    "South Africa's trusted laboratory equipment distributor since 1979. Premium scientific instruments from Heidolph, Sartorius, IKA, Cole-Parmer, DWK and more.",
  keywords: [
    "laboratory equipment South Africa",
    "scientific instruments",
    "Heidolph distributor",
    "Sartorius South Africa",
    "lab equipment Johannesburg",
    "labex",
  ],
  authors: [{ name: "Labex Pty Ltd" }],
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "https://labex.co.za",
    siteName: "Labex Pty Ltd",
    title: "Labex — Laboratory Equipment South Africa Since 1979",
    description:
      "South Africa's trusted laboratory equipment distributor. 45 years. 10+ world-leading brands. Expert technical support.",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
  // Original Labex flask mark (cropped from the brand logo in Labex_CRM).
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-ZA" className={GeistSans.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <SmoothScrollProvider>
          <SiteNav />
          <main id="main-content">{children}</main>
        </SmoothScrollProvider>

        {/* Single, persistent assistant — mounted once, never unmounted. */}
        <AssistantPanel />
      </body>
    </html>
  );
}
