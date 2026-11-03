"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { getConsent, openCookieSettings, subscribeConsent } from "@/lib/consent";
import { getSavedIds, getSavedIdsOnServer, subscribeSaved, toggleSaved } from "@/lib/savedProducts";
import { cn } from "@/lib/utils";

interface SaveProductButtonProps {
  productId: number;
  title: string;
  /** "icon": the heart on a product tile; "button": the product page's Save button. */
  variant?: "icon" | "button";
  className?: string;
}

/** The Shop's Saved list reads the cookie on the server: after a change there, it asks for the list again. */
function refreshIfSavedList(router: ReturnType<typeof useRouter>) {
  if (new URLSearchParams(window.location.search).get("saved") === "1") router.refresh();
}

/**
 * Saves a product for the visitor (lib/savedProducts.ts). Before they have accepted cookies, it opens the cookie
 * banner instead, and the save goes through if they accept.
 */
export default function SaveProductButton({ productId, title, variant = "icon", className }: SaveProductButtonProps) {
  const router = useRouter();
  const saved = useSyncExternalStore(subscribeSaved, getSavedIds, getSavedIdsOnServer).includes(productId);
  const waiting = useRef(false);

  useEffect(
    () =>
      subscribeConsent(() => {
        if (!waiting.current) return;
        waiting.current = false;
        if (getConsent() === "all" && toggleSaved(productId)) refreshIfSavedList(router);
      }),
    [productId, router]
  );

  const onClick = () => {
    if (toggleSaved(productId)) {
      refreshIfSavedList(router);
      return;
    }
    waiting.current = true;
    openCookieSettings("save");
  };

  const label = saved ? `Remove ${title} from saved products` : `Save ${title}`;
  const heart = <Heart className={cn("h-4 w-4", saved && "fill-secondary text-secondary")} aria-hidden="true" />;

  if (variant === "button") {
    return (
      <button type="button" onClick={onClick} aria-pressed={saved} aria-label={label} className={cn("btn-outline", className)}>
        {heart}
        {saved ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={label}
      title={saved ? "Saved" : "Save"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-card/95 text-foreground shadow-soft transition-colors hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary",
        className
      )}
    >
      {heart}
    </button>
  );
}
