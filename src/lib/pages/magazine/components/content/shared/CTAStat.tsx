"use client";

import Link from "next/link";
import MagazineLink from "../../shared/MagazineLink";
import TypographyWrapper from "../utils/TypographyWrapper";

import { TypographySettings } from "../utils/TypographyWrapper";

interface CTAStatProps {
  title?: string;
  titleTypography?: TypographySettings;
  stat: string;
  statTypography?: TypographySettings;
  ctaText?: string;
  ctaLink?: any;
  secondaryCTAText?: string;
  secondaryCTALink?: any;
  /** Analytics callback for CTA clicks */
  onCtaClick?: (label: string, variant: 'primary' | 'secondary') => void;
}

export default function CTAStat({
  title,
  titleTypography = {},
  stat,
  statTypography = {},
  ctaText,
  ctaLink,
  secondaryCTAText,
  secondaryCTALink,
  onCtaClick,
}: CTAStatProps) {
  
  return (
    <div className="flex justify-center">
      <div className="p-6 rounded-xl shadow-lg bg-white text-center">
        {title && (
          <TypographyWrapper 
            settings={titleTypography}
            defaultSettings={{
              fontSize: "text-lg",
              fontWeight: "font-medium",
              alignment: "center",
              color: "text-gray-700"
            }}
            className="mb-4"
            as="p"
          >
            {title}
          </TypographyWrapper>
        )}
        
        <TypographyWrapper 
          settings={statTypography}
          defaultSettings={{
            fontSize: "text-4xl",
            fontWeight: "font-bold",
            alignment: "center",
            color: "text-glamlink-gold"
          }}
          className="mb-4"
        >
          {stat}
        </TypographyWrapper>
        
        <div className="flex gap-4 justify-center">
          {ctaText && ctaLink && (
            <span onClick={() => onCtaClick?.(ctaText, 'primary')}>
              <MagazineLink
                field={ctaLink}
                className="px-6 py-3 rounded-full font-semibold bg-glamlink-teal text-white hover:bg-glamlink-teal-dark transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                {ctaText}
              </MagazineLink>
            </span>
          )}

          {secondaryCTAText && secondaryCTALink && (
            <span onClick={() => onCtaClick?.(secondaryCTAText, 'secondary')}>
              <MagazineLink
                field={secondaryCTALink}
                className="px-6 py-3 rounded-full font-semibold bg-gray-900 text-white hover:bg-black transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                {secondaryCTAText}
              </MagazineLink>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}