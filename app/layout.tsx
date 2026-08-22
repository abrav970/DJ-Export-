import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { company, siteConfig } from "@/data/company";
import { JsonLd, organizationJsonLd } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s — ${company.name}`,
  },
  description: siteConfig.description,
  applicationName: company.name,
  keywords: [
    "Indian coffee exporter",
    "Indian black pepper supplier",
    "Indian cardamom exporter",
    "green coffee beans India",
    "Malabar black pepper",
    "green cardamom export",
    "B2B spice supplier India",
  ],
  authors: [{ name: company.name }],
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: company.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: "/brand/dj-export-logo.jpg",
        width: 1024,
        height: 1024,
        alt: `${company.name} — ${company.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/brand/dj-export-logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
  icons: {
    icon: "/brand/dj-export-logo.jpg",
    apple: "/brand/dj-export-logo.jpg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0b09",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-bronze-500 focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-ink-950"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <JsonLd data={organizationJsonLd()} />
      </body>
    </html>
  );
}
