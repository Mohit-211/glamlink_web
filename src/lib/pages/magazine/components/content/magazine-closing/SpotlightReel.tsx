"use client";

import Image from "next/image";
import MagazineLink from "../../shared/MagazineLink";
import { getImageUrl, getImageObjectFit, getImageObjectPosition } from "@/lib/pages/admin/components/shared/editing/fields/custom/media/imageCropUtils";

interface Spotlight {
  name: string;
  caption?: string;
  image?: any;
  link?: any;
}

interface SpotlightReelProps {
  title?: string;
  titleTypography?: any;
  subtitle?: string;
  subtitleTypography?: any;
  spotlights: Spotlight[];
  gridLayout?: string;
  className?: string;
}

export default function SpotlightReel({ 
  title,
  titleTypography,
  subtitle,
  subtitleTypography,
  spotlights,
  gridLayout,
  className = "" 
}: SpotlightReelProps) {
  if (!spotlights || spotlights.length === 0) return null;
  
  return (
    <div className={className}>
      <h2
        className={`
        ${titleTypography?.fontSize || "text-4xl md:text-5xl"}
        ${titleTypography?.fontFamily || "font-sans"}
        ${titleTypography?.fontWeight || "font-bold"}
        ${titleTypography?.fontStyle || ""}
        ${titleTypography?.textDecoration || ""}
        ${titleTypography?.color || "text-gray-900"}
        ${titleTypography?.alignment === "center" ? "text-center" :
          titleTypography?.alignment === "right" ? "text-right" :
          titleTypography?.alignment === "left" ? "text-left" :
          titleTypography?.alignment === "justify" ? "text-justify" : "text-center"}
        mb-4
      `}
      >
        {title || "Rising Pros to Watch"}
      </h2>
      {subtitle && (
        <p
          className={`
          ${subtitleTypography?.fontSize || "text-lg"}
          ${subtitleTypography?.fontFamily || "font-sans"}
          ${subtitleTypography?.fontWeight || "font-normal"}
          ${subtitleTypography?.fontStyle || ""}
          ${subtitleTypography?.textDecoration || ""}
          ${subtitleTypography?.color || "text-gray-600"}
          ${subtitleTypography?.alignment === "center" ? "text-center" :
            subtitleTypography?.alignment === "right" ? "text-right" :
            subtitleTypography?.alignment === "justify" ? "text-justify" : "text-center"}
          mb-12
        `}
        >
          {subtitle}
        </p>
      )}

      {/* Spotlight Grid */}
      <div className={`grid grid-cols-1 ${gridLayout === "3x2" ? "md:grid-cols-2" : "md:grid-cols-3"} gap-6 mb-12`}>
        {spotlights.map((spotlight, index) => (
          <div key={index} className="group cursor-pointer">
            {spotlight.link ? (
              <MagazineLink field={spotlight.link} className="block w-full h-full">
                <SpotlightCard spotlight={spotlight} />
              </MagazineLink>
            ) : (
              <SpotlightCard spotlight={spotlight} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Spotlight Card Component
function SpotlightCard({ spotlight }: { spotlight: Spotlight }) {
  const imageUrl = spotlight.image ? getImageUrl(spotlight.image) : null;
  const objectFit = spotlight.image ? getImageObjectFit(spotlight.image) : 'cover';
  const objectPosition = spotlight.image ? getImageObjectPosition(spotlight.image) : 'center';
  
  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-all">
      <div className="relative aspect-square">
        <Image
          src={imageUrl || "/images/placeholder.png"}
          alt={spotlight.name}
          fill
          className={`${objectFit === "cover" ? "object-cover" : "object-contain"} group-hover:scale-105 transition-transform duration-300`}
          style={{
            objectPosition: objectPosition,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h4 className="font-bold text-lg">{spotlight.name}</h4>
          {spotlight.caption && <p className="text-sm opacity-90">{spotlight.caption}</p>}
        </div>
      </div>
    </div>
  );
}