"use client";
import { useMemo } from "react";
import adsConfig from "./Adsconfig";

export interface AdSize {
  width: number;
  height: number;
}

export interface AdSource {
  id: string;
  slot_id: string;
  image_url: string;
  link_url: string;
  alt_text?: string;
  size: AdSize;
  mobile_size: AdSize | null;
  behaviour: "static" | "sticky" | "fixed-overlay";
  device: "desktop" | "mobile" | "both";
  pages: string[];
  start_date: string;
  end_date: string;
  priority: number;
  status: "active" | "inactive" | string;
}

export interface Ad {
  id: string;
  slot_id: string;
  image_url: string;
  link_url: string;
  alt_text?: string;
  size: AdSize;
  mobile_size: AdSize | null;
  behaviour: "static" | "sticky" | "fixed-overlay";
}

interface UseAdsParams {
  page: string;
  device: "desktop" | "mobile";
}

export function selectAds(
  ads: AdSource[],
  { page, device }: UseAdsParams,
  now: Date = new Date()
): Record<string, Ad> {
  const valid = ads.filter((ad) => {
    const isActive = ad.status === "active";
    const inDateRange =
      new Date(ad.start_date) <= now && now <= new Date(ad.end_date);
    const matchesDevice = ad.device === "both" || ad.device === device;
    const matchesPage = ad.pages?.includes(page);
    return isActive && inDateRange && matchesDevice && matchesPage;
  });

  const winners: Record<string, AdSource> = {};
  valid.forEach((ad) => {
    const current = winners[ad.slot_id];
    if (!current || ad.priority > current.priority) {
      winners[ad.slot_id] = ad;
    }
  });

  const picked: Record<string, Ad> = {};
  Object.values(winners).forEach((ad) => {
    picked[ad.slot_id] = {
      id: ad.id,
      slot_id: ad.slot_id,
      image_url: ad.image_url,
      link_url: ad.link_url,
      alt_text: ad.alt_text,
      size: ad.size,
      mobile_size: ad.mobile_size,
      behaviour: ad.behaviour,
    };
  });

  return picked;
}

export function useAds({ page, device }: UseAdsParams): Record<string, Ad> {
  return useMemo(
    () => selectAds(adsConfig.ads as AdSource[], { page, device }),
    [page, device]
  );
}
