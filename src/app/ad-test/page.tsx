"use client";
import { useEffect } from "react";
import { useAds } from "@/ads/Useads";
import { useDeviceType } from "@/ads/Usedevicetype";
import HybridAdSlot from "@/ads/HybridAdSlot";
import GamAdSlot from "@/ads/GamAdSlot";

// Google's public test ad unit — replace with the real Network Code + ad unit
// path once the client account is available. Nothing else needs to change.
const TEST_AD_UNIT = "/6355419/Travel/Europe/France/Paris";
const TEST_AD_SIZE: [number, number] = [300, 250];


export default function AdTestPage() {
  const device = useDeviceType();
  const ads = useAds({ page: "journal-article", device });
  const manualAd = Object.values(ads)[0];

  useEffect(() => {
    console.log(
      "[ad-test] window.googletag defined:",
      typeof window !== "undefined" && !!(window as any).googletag
    );
  }, []);

  return (
    <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 48 }}>
      <h1>GAM Integration Test</h1>

      <section>
        <h2>HybridAdSlot</h2>
        <p>
          Uses a manual ad from <code>useAds</code> if one is available for the
          current slot, otherwise falls back to the GAM test ad unit.
        </p>
        <HybridAdSlot
          slotId="ad-test-hybrid"
          manualAd={manualAd}
          gamAdUnitPath={TEST_AD_UNIT}
          gamSize={TEST_AD_SIZE}
        />
      </section>

      <section>
        <h2>GamAdSlot (standalone)</h2>
        <p>Renders the GAM test ad unit directly, with no manual fallback.</p>
        <GamAdSlot adUnitPath={TEST_AD_UNIT} size={TEST_AD_SIZE} />
      </section>
    </div>
  );
}
