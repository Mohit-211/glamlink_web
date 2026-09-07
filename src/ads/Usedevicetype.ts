"use client";
import { useEffect, useState } from "react";

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