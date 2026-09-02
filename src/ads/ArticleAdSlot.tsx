"use client";

import { useDeviceType } from "@/ads/Usedevicetype";
import { useAds } from "@/ads/Useads";
import AdSlot from "@/ads/Adslot";

interface ArticleAdSlotProps {
  slotId: string;
  size: { width: number; height: number };
}

export default function ArticleAdSlot({ slotId, size }: ArticleAdSlotProps) {
  const device = useDeviceType();
  const ads = useAds({ page: "journal-article", device });

  return (
    <div className="flex justify-center my-8">
      <AdSlot slotId={slotId} ad={ads[slotId]} size={size} />
    </div>
  );
}