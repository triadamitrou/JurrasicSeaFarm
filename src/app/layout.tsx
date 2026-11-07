import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import { RevealProvider } from "@/components/Reveal";
import Schema from "@/components/Schema";
import { site } from "@/lib/site";

// Vollkorn for the headings: a sturdy, slightly rustic book serif with
// the wedged serifs and weight their logo lettering has, set beside it
// to check. Instrument Sans does the plain work.
const vollkorn = localFont({
  variable: "--font-vollkorn",
  display: "swap",
  adjustFontFallback: "Times New Roman",
  fallback: ["Georgia", "serif"],
  src: [
    { path: "./fonts/Vollkorn-latin.woff2", style: "normal", weight: "400 900" },
    { path: "./fonts/Vollkorn-italic-latin.woff2", style: "italic", weight: "400 900" },
  ],
});

const instrument = localFont({
  variable: "--font-instrument",
  display: "swap",
  adjustFontFallback: "Arial",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  src: [{ path: "./fonts/InstrumentSans-latin.woff2", style: "normal", weight: "400 700" }],
});

const title = "Jurassic Sea Farms | Dorset Oysters and Seaweed";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s | Jurassic Sea Farms" },
  description: `${site.strapline}. Pacific Oysters and Sugar Kelp grown side by side in Portland Harbour, Dorset.`,
  // Mockup: kept out of search so it cannot compete with their own site.
  robots: { index: false, follow: false },
  openGraph: {
    title,
    description: site.strapline,
    type: "website",
    locale: "en_GB",
    images: ["/img/oyster-bags.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${vollkorn.variable} ${instrument.variable}`}>
      <body>
        <SmoothScroll />
        <RevealProvider />
        <Schema />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-aqua focus:px-5 focus:py-3 focus:text-navy"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
