"use client";

import Image from "next/image";
import { getImageUrl, getImageObjectFit, getImageObjectPosition } from "@/lib/pages/admin/components/shared/editing/fields/custom/media/imageCropUtils";
import TypographyWrapper, { TypographySettings } from "../utils/TypographyWrapper";
import RichContent from "../shared/RichContent";

interface ProfessionalProfileProps {
  name?: string;
  nameTypography?: TypographySettings;
  title?: string;
  titleTypography?: TypographySettings;
  company?: string;
  companyTypography?: TypographySettings;
  image?: string | { url: string; objectFit?: string; objectPositionX?: number; objectPositionY?: number };
  quote?: string;
  quoteTypography?: TypographySettings;
  bio?: string;
  bioTypography?: TypographySettings;
  experience?: string;
  experienceTypography?: TypographySettings;
  location?: string;
  locationTypography?: TypographySettings;
  specialties?: string[];
  specialtiesTypography?: TypographySettings;
  useOverlay?: boolean;
  className?: string;
}

export default function ProfessionalProfile({
  name,
  nameTypography,
  title,
  titleTypography,
  company,
  companyTypography,
  image,
  quote,
  quoteTypography,
  bio,
  bioTypography,
  experience,
  experienceTypography,
  location,
  locationTypography,
  specialties,
  specialtiesTypography,
  useOverlay = false,
  className = "",
}: ProfessionalProfileProps) {
  const imageUrl = image ? getImageUrl(image) : null;
  const objectFit = image ? getImageObjectFit(image as any) : "cover";
  const objectPosition = image ? getImageObjectPosition(image as any) : "center";

  // Full-page hero layout matching the HTML example
  return (
    <div className={`relative ${className}`}>
      {/* Image Container with responsive aspect ratios */}
      <div className="relative aspect-[3/4] sm:aspect-auto">
        {/* Mobile view - aspect 3:4 */}
        <div className="sm:hidden relative aspect-[3/4]">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={`${name || "Professional"} - ${company || ""}`}
              fill
              className="object-cover"
              style={{
                objectFit: objectFit as any,
                objectPosition,
              }}
              sizes="100vw"
            />
          )}
        </div>

        {/* Desktop view - auto aspect */}
        <div className="hidden sm:block pdf-professional-container">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={`${name || "Professional"} - ${company || ""}`}
              width={1600}
              height={900}
              className="w-full h-auto pdf-professional-image"
              style={{
                objectFit: objectFit as any,
                objectPosition,
              }}
            />
          )}
        </div>

        {/* Gradient overlay for better text readability */}
        {useOverlay && <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>}

        {/* Text overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-16 text-white">
          {name && (
            <TypographyWrapper
              as="h1"
              settings={nameTypography}
              defaultSettings={{
                fontSize: "text-3xl md:text-4xl",
                fontFamily: "font-[Montserrat,sans-serif]",
                fontWeight: "font-bold",
                color: "text-white",
                alignment: "left",
              }}
              className="mb-4"
            >
              {name}
            </TypographyWrapper>
          )}

          {(title || company) && (
            <div className="mb-6">
              {title && (
                <TypographyWrapper
                  as="span"
                  settings={titleTypography}
                  defaultSettings={{
                    fontSize: "text-lg md:text-xl",
                    fontFamily: "font-[Roboto,sans-serif]",
                    fontWeight: "font-normal",
                    color: "text-white",
                    alignment: "left",
                  }}
                >
                  {title}
                </TypographyWrapper>
              )}
              {title && company && (
                <TypographyWrapper
                  as="span"
                  settings={titleTypography}
                  defaultSettings={{
                    fontSize: "text-lg md:text-xl",
                    fontFamily: "font-[Roboto,sans-serif]",
                    color: "text-white",
                  }}
                >
                  {" of "}
                </TypographyWrapper>
              )}
              {company && (
                <TypographyWrapper
                  as="span"
                  settings={companyTypography}
                  defaultSettings={{
                    fontSize: "text-lg md:text-xl",
                    fontFamily: "font-[Roboto,sans-serif]",
                    fontWeight: "font-normal",
                    color: "text-white",
                    alignment: "left",
                  }}
                >
                  {company}
                </TypographyWrapper>
              )}
            </div>
          )}

          {quote && (
            <TypographyWrapper
              as="blockquote"
              settings={quoteTypography}
              defaultSettings={{
                fontSize: "text-lg lg:text-xl",
                fontFamily: "font-serif",
                fontWeight: "font-normal",
                fontStyle: "italic",
                color: "text-white",
                alignment: "left",
              }}
              className="border-l-4 border-glamlink-gold pl-4 max-w-2xl"
            >
              "{quote}"
            </TypographyWrapper>
          )}
        </div>
      </div>

      {/* Additional content below hero if needed */}
      {(bio || experience || location || (specialties && specialties.length > 0)) && (
        <div className="p-4 sm:p-6 md:p-8 mt-4">
          {bio && (
            <div className="mb-6">
              <RichContent
                content={bio}
                className="leading-relaxed"
              />
            </div>
          )}

          {location && (
            <TypographyWrapper
              as="p"
              settings={locationTypography}
              defaultSettings={{
                fontSize: "text-sm",
                fontFamily: "font-sans",
                fontWeight: "font-normal",
                color: "text-gray-600",
              }}
              className="mb-3"
            >
              📍 {location}
            </TypographyWrapper>
          )}

          {experience && (
            <TypographyWrapper
              as="p"
              settings={experienceTypography}
              defaultSettings={{
                fontSize: "text-sm",
                fontFamily: "font-sans",
                fontWeight: "font-normal",
                color: "text-gray-700",
              }}
              className="mb-3"
            >
              {experience}
            </TypographyWrapper>
          )}

          {specialties && specialties.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Specialties</h4>
              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty, index) => (
                  <TypographyWrapper
                    key={index}
                    as="span"
                    settings={specialtiesTypography}
                    defaultSettings={{
                      fontSize: "text-sm",
                      fontFamily: "font-sans",
                      fontWeight: "font-medium",
                      color: "text-glamlink-teal",
                    }}
                    className="px-3 py-1 bg-glamlink-teal/10 rounded-full"
                  >
                    {specialty}
                  </TypographyWrapper>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
