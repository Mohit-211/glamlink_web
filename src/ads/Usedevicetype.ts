"use client";
import { useEffect, useState } from "react";

/**
 * useDeviceType
 * Simple viewport-width based device detection for choosing
 * which ad set (desktop/mobile) to fetch via useAds.
 * Breakpoint matches the app's lg: Tailwind breakpoint (1024px).
 */
export function useDeviceType(): "desktop" | "mobile" {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => {
    const check = () => setDevice(window.innerWidth < 1024 ? "mobile" : "desktop");
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return device;
}