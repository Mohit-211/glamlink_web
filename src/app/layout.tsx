import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Manrope } from "next/font/google";

import { ADSENSE_CLIENT_ID, GTM_ID, SITE_URL } from "@/lib/config";
import Providers from "./providers";
import ScrollToTop from "@/components/ScrollToTop";
import LayoutWrapper from "@/components/LayoutWrapper";

import "../styles/globals.css"

/* -------------------------
   Fonts
--------------------------*/

// Manrope is the single Glamlink typeface (variable font: 200–800)
const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

/* -------------------------
   Global Metadata
--------------------------*/

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Glamlink | Discover Beauty & Wellness Professionals",
    template: "%s | Glamlink",
  },

  description:
    "Glamlink connects clients with trusted beauty and wellness professionals. Discover services, digital cards, magazines, and industry insights.",

  keywords: [
    "beauty professionals",
    "wellness professionals",
    "beauty directory",
    "salon services",
    "beauty marketplace",
    "glamlink",
  ],

  authors: [{ name: "Glamlink Team" }],
  creator: "Glamlink",
  publisher: "Glamlink",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    title: "Glamlink | Discover Beauty & Wellness Professionals",
    description:
      "Find trusted beauty and wellness professionals. Explore services, digital business cards, magazines, and insights from Glamlink.",
    url: SITE_URL,
    siteName: "Glamlink",

    images: [
      {
        url: `${SITE_URL}/oglayout.png`,
        width: 1200,
        height: 630,
        alt: "Glamlink Beauty & Wellness Platform",
      },
    ],

    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Glamlink | Beauty & Wellness Professionals",
    description:
      "Discover beauty and wellness professionals, services, and industry insights on Glamlink",
    images: [`${SITE_URL}/oglayout.png`],
  },

  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },

  alternates: {
    canonical: SITE_URL,
  },

  category: "business",

  other: ADSENSE_CLIENT_ID ? { "google-adsense-account": ADSENSE_CLIENT_ID } : undefined,
};

/* -------------------------
   Viewport
--------------------------*/

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

/* -------------------------
   Layout
--------------------------*/

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={manrope.variable}>
      <head>
        {/* Google Tag Manager */}
        {GTM_ID && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];
                w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer',${JSON.stringify(GTM_ID)});
              `,
            }}
          />
        )}

        {/* Organization Schema */}
        <Script
          id="schema-org"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Glamlink",
              url: SITE_URL,
              logo: `${SITE_URL}/favicon.png`,
              sameAs: [
                "https://instagram.com/",
                "https://facebook.com/",
                "https://linkedin.com/",
              ],
            }),
          }}
        />
      </head>

      <body className="min-h-screen bg-background" suppressHydrationWarning>
        {/* Google Tag Manager (noscript fallback) */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(GTM_ID)}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}

        <ScrollToTop />

        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
