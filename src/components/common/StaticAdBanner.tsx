"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface StaticAdBannerProps {
  /** Path to the ad creative, e.g. "/ads/banner.webp" (served from /public) */
  image: string;
  /** Advertiser destination URL */
  href: string;
  /** Descriptive alt text for the ad creative */
  alt: string;
  /** Intrinsic width of the creative, used to preserve aspect ratio */
  width: number;
  /** Intrinsic height of the creative, used to preserve aspect ratio */
  height: number;
  /** Optional label shown in the corner badge, defaults to "Sponsored" */
  label?: string;
  className?: string;
}

export default function StaticAdBanner({
  image,
  href,
  alt,
  width,
  height,
  label = "Sponsored",
  className,
}: StaticAdBannerProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "w-full flex justify-center",
        className
      )}
    >
      <div
        ref={cardRef}
        className={cn(
          "group relative w-full overflow-hidden rounded-2xl border",
          "border-border bg-card shadow-[var(--shadow-soft)]",
          "transition-all duration-300 hover:shadow-[var(--shadow-medium)]",
          isVisible ? "animate-banner-in" : "opacity-0 translate-y-3 scale-[0.98]"
        )}
        style={{ maxWidth: width }}
      >
        {/* Corner label */}
        <span
          className="absolute top-3 right-3 z-10 rounded-full bg-background/80
            backdrop-blur-sm border border-border px-2.5 py-1 text-[11px]
            font-medium tracking-wide text-muted-foreground"
        >
          {label}
        </span>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          aria-label={alt}
          className="block w-full overflow-hidden"
        >
          <Image
            src={image}
            alt={alt}
            width={width}
            height={height}
            sizes={`(max-width: 768px) 100vw, ${width}px`}
            className="w-full h-auto object-contain transition-transform
              duration-500 ease-out group-hover:scale-[1.03]"
          />
        </a>
      </div>
    </div>
  );
}