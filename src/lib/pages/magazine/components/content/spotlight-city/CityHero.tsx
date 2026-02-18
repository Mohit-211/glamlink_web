"use client";

import Image from "next/image";
import { getImageUrl, getImageObjectFit, getImageObjectPosition } from "@/lib/pages/admin/components/shared/editing/fields/custom/media/imageCropUtils";
import TypographyWrapper, { TypographySettings } from "../utils/TypographyWrapper";

interface CityHeroProps {
  cityName: string;
  cityNameTypography?: TypographySettings;
  cityImage?: any;
  description?: string;
  descriptionTypography?: TypographySettings;
  overlayText?: string;
  overlayTextTypography?: TypographySettings;
  className?: string;
}

export default function CityHero({ 
  cityName,
  cityNameTypography = {},
  cityImage,
  description,
  descriptionTypography = {},
  overlayText,
  overlayTextTypography = {},
  className = ""
}: CityHeroProps) {
  
  return (
    <div className={className}>
      {/* City name and description as feature - only show if at least one has content */}
      {(cityName && cityName.trim() !== "" || description && description.trim() !== "") && (
        <div className="text-center mb-12">
          <div className="inline-block">
            {cityName && cityName.trim() !== "" && (
              <TypographyWrapper 
                settings={cityNameTypography}
                defaultSettings={{
                  fontSize: "text-3xl md:text-4xl",
                  fontWeight: "font-bold",
                  alignment: "center",
                  color: "text-glamlink-teal"
                }}
                as="h3"
              >
                {cityName}
              </TypographyWrapper>
            )}
            {description && description.trim() !== "" && (
              <TypographyWrapper 
                settings={descriptionTypography}
                defaultSettings={{
                  fontSize: "text-lg md:text-xl",
                  alignment: "center",
                  color: "text-gray-600"
                }}
                className="mt-2"
                as="p"
              >
                {description}
              </TypographyWrapper>
            )}
          </div>
        </div>
      )}

      {/* City Hero Image */}
      {cityImage && (
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl">
          <Image
            src={getImageUrl(cityImage) || "/images/placeholder.png"}
            alt={cityName}
            fill
            className={getImageObjectFit(cityImage) === "cover" ? "object-cover" : "object-contain"}
            style={{
              objectPosition: getImageObjectPosition(cityImage),
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {overlayText && (
            <div className="absolute bottom-4 left-4">
              <TypographyWrapper 
                settings={overlayTextTypography}
                defaultSettings={{
                  fontSize: "text-2xl md:text-3xl",
                  fontWeight: "font-bold",
                  color: "text-white"
                }}
                as="h3"
              >
                {overlayText}
              </TypographyWrapper>
            </div>
          )}
        </div>
      )}
    </div>
  );
}