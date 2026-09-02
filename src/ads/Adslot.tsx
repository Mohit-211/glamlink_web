"use client";
import { useEffect, useRef } from "react";
import { Ad } from "./Useads";
import { useDeviceType } from "./Usedevicetype";

interface AdSlotProps {
  slotId: string;
  ad?: Ad;
  hideOnMobile?: boolean;
}
const DEFAULT_SIZE = { width: 300, height: 250 };
const BEHAVIOUR_CLASSES: Record<string, string> = {
  static: "relative",
  sticky: "sticky top-24",
  "fixed-overlay":
    "fixed left-1/2 bottom-0 -translate-x-1/2 z-[999] shadow-[0_-2px_8px_rgba(0,0,0,0.15)]",
};
export default function AdSlot({ slotId, ad, hideOnMobile = false }: AdSlotProps) {
  const device = useDeviceType();
  const ref = useRef<HTMLDivElement>(null);
  const size = ad ? (device === "mobile" && ad.mobile_size ? ad.mobile_size : ad.size) : DEFAULT_SIZE;
  useEffect(() => {
    if (!ad || !ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fetch("/api/ads/track", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ad_id: ad.id, type: "impression" }),
            }).catch((err) => console.error("AdSlot: impression tracking failed", err));
            observer.disconnect(); // count once per page view
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ad]);

  function handleClick() {
    if (!ad) return;
    fetch("/api/ads/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ad_id: ad.id, type: "click" }),
    }).catch((err) => console.error("AdSlot: click tracking failed", err));
  }

  const baseClasses =
    "overflow-hidden flex items-center justify-self-center justify-center rounded bg-gray-100";
  const responsiveClasses = hideOnMobile ? "hidden lg:flex" : "flex";

  if (!ad) {
    return (
      <div
        className={`${baseClasses} ${responsiveClasses} border border-dashed border-gray-300 text-gray-400 text-sm`}
        style={{ width: size.width, height: size.height }}
      >
        Ad Space
      </div>
    );
  }

  const behaviourClass = BEHAVIOUR_CLASSES[ad.behaviour] || BEHAVIOUR_CLASSES.static;

  return (
    <div
      ref={ref}
      data-slot-id={slotId}
      data-ad-id={ad.id}
      className={`${baseClasses} ${responsiveClasses} ${behaviourClass}`}
      style={{ width: size?.width, height: size?.height }}
    >
      <a
        href={ad.link_url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={handleClick}
        className="block w-full h-full"
      >
        <img
          src={ad.image_url}
          alt={ad.alt_text || "Advertisement"}
          width={size.width}
          height={size.height}
          className="w-full h-full object-cover"
        />
      </a>
    </div>
  );
}