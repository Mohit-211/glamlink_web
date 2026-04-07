"use client";

import { usePathname } from "next/navigation";
import GetFeaturedSection from "@/components/common/GetFeaturedSection";

export default function ConditionalGetFeatured() {
  const pathname = usePathname();

  const hiddenRoutes = ["/for-clients", "/for-professionals"];

  const shouldHide = hiddenRoutes.some((route) => pathname.startsWith(route));

  if (shouldHide) return null;

  return <GetFeaturedSection />;
}
