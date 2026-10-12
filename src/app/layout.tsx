import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Sans } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { RevealScript } from "@/components/motion/RevealScript";
import { site } from "@/content/site";
import { isNoIndex, siteUrl } from "@/lib/site-url";
import "./globals.css";

// Fonts are downloaded at build time and self-hosted by Next.js (no runtime requests to Google).
const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Agenție de marketing în Cluj-Napoca: video, PPC și web | ImpactoMedia", template: "%s | ImpactoMedia" },
  description:
    "Agenție de marketing din Cluj-Napoca pentru producție video, campanii Google, Meta și TikTok Ads, website-uri de prezentare și magazine online.",
  applicationName: site.name,
  formatDetection: { telephone: false, email: false, address: false },
  robots: isNoIndex
    ? { index: false, follow: false }
    : { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  // Search engine ownership tokens, only when provided (never hard-coded or invented).
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.BING_SITE_VERIFICATION ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } } : {}),
  },
};

export const viewport: Viewport = {
  themeColor: "#f2f0eb",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ro"
      className={`${archivo.variable} ${instrument.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Marks JS as available so reveal styles only hide content that can be revealed again. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <Header />
        <main id="continut" tabIndex={-1} className="pt-[var(--header-h)] outline-none">
          {children}
        </main>
        <Footer />
        <RevealScript />
      </body>
    </html>
  );
}
