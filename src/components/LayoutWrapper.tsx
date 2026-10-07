
"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

// Auth screens are full-screen split layouts with their own logo link home.
const AUTH_ROUTES = ["/login", "/register", "/verify-otp", "/forgot-password"];

export default function LayoutWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  // Hide Header & Footer on access card pages, auth screens and the dashboard
  // (the dashboard renders its own sidebar + header shell).
  const hideLayout =
    pathname.startsWith("/access/") ||
    pathname.startsWith("/dashboard") ||
    AUTH_ROUTES.includes(pathname);

  return (
    <>
      {!hideLayout && <Header />}

      <main>{children}</main>

      {!hideLayout && <Footer />}
    </>
  );
}
