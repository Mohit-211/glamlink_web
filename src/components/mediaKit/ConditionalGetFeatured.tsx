"use client";

import { usePathname } from "next/navigation";
import GetFeaturedSection from "@/components/mediaKit/GetFeaturedSection";

export default function ConditionalGetFeatured() {
  const pathname = usePathname();

  const hiddenRoutes = ["/for-clients", "/for-professionals"];
//   const hide = hiddenRoutes.includes(pathname);
const hide = pathname.startsWith("/for-clients") || pathname.startsWith("/for-professionals");
  if (hide) return null;

  return <GetFeaturedSection />;
}