
"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function LayoutWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  // Hide Header & Footer on access card pages
  const hideLayout = pathname.startsWith("/access-card/");

  return (
    <>
      {!hideLayout && <Header />}

      <main>{children}</main>

      {!hideLayout && <Footer />}
    </>
  );
}
