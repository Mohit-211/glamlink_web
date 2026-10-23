"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { trackProfileEventApi } from "@/api/Api";
import { getSessionId, getVisitorId } from "@/utils/analytics";
import type { ProfileEvent } from "./profileEvents";

function send(slug: string, event: ProfileEvent, target?: string) {
  try {
    trackProfileEventApi(slug, {
      event_type: event,
      event_target: target ?? null,
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
    }).catch(() => {
      // Counting is best effort; a visitor never sees it fail
    });
  } catch {
    // Storage blocked (private mode): skip the count
  }
}

/**
 * Counts a view of a professional's or brand's page, and clicks on the links
 * inside it that carry `data-profile-event` (see `trackAs` in ./profileEvents).
 */
export default function ProfileTracker({ slug, children }: { slug: string; children: ReactNode }) {
  const counted = useRef<string | null>(null);

  useEffect(() => {
    if (counted.current === slug) return;
    counted.current = slug;
    send(slug, "PAGE_VIEW");
  }, [slug]);

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    const link = (event.target as HTMLElement).closest<HTMLElement>("[data-profile-event]");
    if (!link || !event.currentTarget.contains(link)) return;
    send(slug, link.dataset.profileEvent as ProfileEvent, link.dataset.profileTarget);
  };

  return <div onClick={onClick}>{children}</div>;
}
