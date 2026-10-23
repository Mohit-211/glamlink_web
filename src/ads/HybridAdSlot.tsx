"use client";
import AdSlot from "./Adslot";
import GamAdSlot from "./GamAdSlot";
import type { Ad } from "./Useads";

interface HybridAdSlotProps {
  slotId: string;
  manualAd?: Ad;
  gamAdUnitPath: string;
  gamSize: [number, number];
  hideOnMobile?: boolean;
}

export default function HybridAdSlot({
  slotId,
  manualAd,
  gamAdUnitPath,
  gamSize,
  hideOnMobile = false,
}: HybridAdSlotProps) {
  if (manualAd) {
    console.log(`[HybridAdSlot] "${slotId}" -> manual house ad (id: ${manualAd.id})`);
    return <AdSlot slotId={slotId} ad={manualAd} hideOnMobile={hideOnMobile} />;
  }

  console.log(`[HybridAdSlot] "${slotId}" -> no manual ad, falling back to GAM: ${gamAdUnitPath}`);
  return <GamAdSlot adUnitPath={gamAdUnitPath} size={gamSize} />;
}
