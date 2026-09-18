"use client";
import { useEffect, useMemo, useState } from "react";
import { getAds } from "@/api/Api";

export interface Ad {
  id: number;
  slot_id: string;
  image_url: string;
  link_url: string;
  alt_text?: string;
  width: number;
  height: number;
  behaviour: "static" | "sticky" | "fixed-overlay";
  media_type: "image" | "video";
}

interface AdSource extends Ad {
  pages: string[];
  start_date: string | null;
  end_date: string | null;
  status: "active" | "inactive" | string;
  sort_order: number;
  is_active: boolean;
}

interface UseAdsParams {
  page: string;
  device: "desktop" | "mobile";
}

let adsCache: AdSource[] | null = null;
let adsPromise: Promise<AdSource[]> | null = null;

function fetchAds(): Promise<AdSource[]> {
  if (adsCache) return Promise.resolve(adsCache);
  if (!adsPromise) {
    adsPromise = getAds()
      .then((res) => {
        const rows: AdSource[] = res?.data?.rows ?? [];
        console.log(rows,"rows")
        adsCache = rows;
        return rows;
      })
      .catch((err) => {
        console.error("useAds: failed to fetch ads", err);
        return [];
      })
      .finally(() => {
        adsPromise = null;
      });
      
  }
  return adsPromise;
}

export function selectAds(
  ads: AdSource[],
  { page }: UseAdsParams,
  now: Date = new Date()
): Record<string, Ad[]> {
  const valid = ads.filter((ad) => {
    const isActive = ad.is_active && ad.status === "active";
    const afterStart = !ad.start_date || new Date(ad.start_date) <= now;
    const beforeEnd = !ad.end_date || now <= new Date(ad.end_date);
    const matchesPage = ad.pages?.includes(page);
    return isActive && afterStart && beforeEnd && matchesPage;
  });

  // A placement (slot_id) can have more than one eligible ad; all of them
  // are shown together at that placement, ordered by sort_order.
  const bySlot: Record<string, AdSource[]> = {};
  valid.forEach((ad) => {
    (bySlot[ad.slot_id] ??= []).push(ad);
  });

  const picked: Record<string, Ad[]> = {};
  Object.entries(bySlot).forEach(([slotId, slotAds]) => {
    picked[slotId] = slotAds
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((ad) => ({
        id: ad.id,
        slot_id: ad.slot_id,
        image_url: ad.image_url,
        link_url: ad.link_url,
        alt_text: ad.alt_text,
        width: ad.width,
        height: ad.height,
        behaviour: ad.behaviour,
        media_type: ad.media_type,
      }));
  });

  return picked;
}

export function useAds({ page, device }: UseAdsParams): Record<string, Ad[]> {
  const [ads, setAds] = useState<AdSource[]>(adsCache ?? []);

  useEffect(() => {
    let cancelled = false;
    fetchAds().then((rows) => {
      if (!cancelled) setAds(rows);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(
    () => selectAds(ads, { page, device }),
    [ads, page, device]
  );
}
