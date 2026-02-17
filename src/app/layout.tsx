import type { ReactNode } from "react";
import Script from "next/script";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

import "@/styles/globals.css";
import Providers from "./providers";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
