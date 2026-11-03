"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { getSavedIds, getSavedIdsOnServer, subscribeSaved } from "@/lib/savedProducts";

/** The Shop's Saved chip, with how many the visitor saved (counted in the browser, so it follows each heart). */
export default function SavedChip({ href, current }: { href: string; current: boolean }) {
  const count = useSyncExternalStore(subscribeSaved, getSavedIds, getSavedIdsOnServer).length;

  return (
    <Link href={href} scroll={false} aria-current={current ? "page" : undefined} className="chip inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm">
      <Heart className="h-4 w-4" aria-hidden="true" />
      Saved
      {count > 0 && <span className="opacity-70">{count}</span>}
    </Link>
  );
}
