
"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import CookieBanner from "@/components/common/CookieBanner";

export default function LayoutWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  // Hide Header & Footer on access card pages
  const hideLayout = pathname.startsWith("/access/");

  return (
    <>
      {!hideLayout && <Header />}

      <main>{children}</main>

      {!hideLayout && <Footer />}

      {/* On every page, the cards' too */}
      <CookieBanner />
    </>
  );
}
