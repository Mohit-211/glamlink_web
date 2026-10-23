"use client";
import { useEffect, useId, useRef } from "react";

declare global {
  interface Window {
    googletag: any;
  }
}

interface GamAdSlotProps {
  adUnitPath: string;
  size: [number, number];
  className?: string;
}

export default function GamAdSlot({ adUnitPath, size, className }: GamAdSlotProps) {
  const reactId = useId().replace(/:/g, "");
  const divId = `gam-slot-${reactId}`;
  const definedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.googletag = window.googletag || { cmd: [] };

    window.googletag.cmd.push(() => {
      if (definedRef.current) return;

      const slot = window.googletag
        .defineSlot(adUnitPath, size, divId)
        ?.addService(window.googletag.pubads());

      if (!slot) {
        console.error(`[GAM] Failed to define slot for "${adUnitPath}" (#${divId})`);
        return;
      }

      window.googletag.display(divId);
      definedRef.current = true;
      console.log(`[GAM] Slot rendered: ${adUnitPath} -> #${divId}`);
    });

    return () => {
      if (!definedRef.current || typeof window === "undefined" || !window.googletag?.cmd) return;
      window.googletag.cmd.push(() => {
        const slots = window.googletag.pubads().getSlots();
        const mySlot = slots.find((s: any) => s.getSlotElementId() === divId);
        if (mySlot) window.googletag.destroySlots([mySlot]);
      });
    };
  }, [adUnitPath, divId, size]);

  return (
    <div
      id={divId}
      className={className}
      style={{ width: size[0], height: size[1] }}
    />
  );
}
