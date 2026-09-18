"use client";

import { useDeviceType } from "@/ads/Usedevicetype";
import { useAds } from "@/ads/Useads";
import AdSlot from "@/ads/Adslot";

interface ArticleAdSlotProps {
  slotId: string;
}
export default function ArticleAdSlot({ slotId }: ArticleAdSlotProps) {
  const device = useDeviceType();
  const ads = useAds({ page: "journal-article", device });
  const slotAds = ads[slotId];

  if (!slotAds?.length) return null;

  return (
    <div className="flex flex-wrap justify-center gap-4 my-8">
      {slotAds.map((ad) => (
        <AdSlot key={ad.id} slotId={slotId} ad={ad} />
      ))}
    </div>
  );
}