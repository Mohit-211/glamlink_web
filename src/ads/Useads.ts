"use client";
import { useMemo } from "react";
import adsConfig from "./Adsconfig";

export interface Ad {
  id: string;
  slot_id: string;
  image_url: string;
  link_url: string;
  alt_text?: string;
  size: { width: number; height: number };
  mobile_size?: { width: number; height: number };
  behaviour: "static" | "sticky" | "fixed-overlay";
  device: "desktop" | "mobile" | "both";
  pages: string[];
  start_date: string;
  end_date: string;
  priority: number;
  status: "active" | "inactive" | string;
}

interface UseAdsParams {
  page: string;
  device: "desktop" | "mobile";
}

/**
 * useAds
 * Reads ad definitions from the local Adsconfig.ts (until a real ads
 * backend exists) and returns ONE ad per slot_id, filtered by
 * page/device/date/status, picked via a weighted-random rotation when
 * a slot has multiple eligible ads.
 *
 * Usage:
 *   const ads = useAds({ page: "journal-listing", device: "desktop" });
 *   ads["journal-top-banner"] // -> single ad object or undefined
 */
export function useAds({ page, device }: UseAdsParams): Record<string, Ad> {
  return useMemo(() => {
    const now = new Date();
    const valid = (adsConfig.ads as Ad[]).filter((ad) => {
      const isActive = ad.status === "active";
      const inDateRange =
        new Date(ad.start_date) <= now && now <= new Date(ad.end_date);
      const matchesDevice = ad.device === "both" || ad.device === device;
      const matchesPage = ad.pages?.includes(page);
      return isActive && inDateRange && matchesDevice && matchesPage;
    });

    // Group by slot_id
    const grouped: Record<string, Ad[]> = {};
    valid.forEach((ad) => {
      if (!grouped[ad.slot_id]) grouped[ad.slot_id] = [];
      grouped[ad.slot_id].push(ad);
    });

    // Pick one winner per slot using priority as weight
    const picked: Record<string, Ad> = {};
    Object.keys(grouped).forEach((slotId) => {
      picked[slotId] = pickWeighted(grouped[slotId]);
    });

    return picked;
  }, [page, device]);
}

// Higher "priority" number = shown more often.
function pickWeighted(ads: Ad[]): Ad {
  const totalWeight = ads.reduce((sum, ad) => sum + (ad.priority || 1), 0);
  let rand = Math.random() * totalWeight;
  for (const ad of ads) {
    rand -= ad.priority || 1;
    if (rand <= 0) return ad;
  }
  return ads[0];
}
