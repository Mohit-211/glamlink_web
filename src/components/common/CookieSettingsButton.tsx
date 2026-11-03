"use client";

import type { ReactNode } from "react";
import { openCookieSettings } from "@/lib/consent";

/** Opens the cookie banner again, from a page that renders on the server. */
export default function CookieSettingsButton({ className, children = "Cookie settings" }: { className?: string; children?: ReactNode }) {
  return (
    <button type="button" onClick={() => openCookieSettings()} className={className}>
      {children}
    </button>
  );
}
