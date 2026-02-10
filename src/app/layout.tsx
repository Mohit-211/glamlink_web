import type { ReactNode } from "react";
import Script from "next/script";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

import "@/styles/globals.css";
import Providers from "./providers";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        {/* Google Maps Script */}
        <Script
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAd0VnpJBpOS7iISBY2GIVBnEkgpcqXXV0&libraries=places"
          strategy="afterInteractive"
        />

        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
