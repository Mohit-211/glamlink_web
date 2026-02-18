"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { CoverProFeatureContent } from "../../../types";
import MagazineLink from "../../shared/MagazineLink";
import { mergeUniversalStyleSettings, getUniversalLayoutPreset, getAlignmentClass } from "../../../config/universalStyles";
import { getImageUrl, getImageObjectFit, getImageObjectPosition } from "@/lib/pages/admin/components/shared/editing/fields/custom/media/imageCropUtils";
import {
  SectionHeader,
  BackgroundWrapper,
  PhotoGallery,
  RichContent,
  SocialLinks
} from "../shared";
import {
  ProfessionalProfile,
  AccoladesList
} from "../cover-pro-feature";
import { useMagazineAnalytics } from "@/lib/features/analytics/hooks/useMagazineAnalytics";

interface CoverProFeatureProps {
  content: CoverProFeatureContent;
  title?: string;
  subtitle?: string;
  backgroundColor?: string | {
    main?: string;
    hero?: string;
    journey?: string;
    achievements?: string;
    gallery?: string
  };
  /** Issue ID for analytics tracking */
  issueId?: string;
}

export default function CoverProFeature({
  content,
  title,
  subtitle,
  backgroundColor,
  issueId
}: CoverProFeatureProps) {
  const [isMediumOrSmaller, setIsMediumOrSmaller] = useState(false);

  // Analytics tracking
  const { trackLinkClick } = useMagazineAnalytics({
    issueId: issueId || '',
    trackViewOnMount: false,
  });

  // Handle link click tracking
  const handleLinkClick = (linkType: string, url: string) => {
    if (issueId) {
      const normalizedType = linkType.toLowerCase() as 'website' | 'instagram' | 'tiktok' | 'email' | 'linkedin' | 'glamlink' | 'other';
      trackLinkClick(normalizedType, url, 'cover-pro-feature', 'cover-pro-feature');
    }
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMediumOrSmaller(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Get merged style settings
  const styles = mergeUniversalStyleSettings(
    content,
    getUniversalLayoutPreset(content.headerLayout)
  );

  return (
    <BackgroundWrapper backgroundColor={backgroundColor}>
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-4 sm:mb-6 md:mb-8 px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8">
          <SectionHeader 
            title={title} 
            subtitle={subtitle} 
            subtitle2={content.subtitle2}
            titleStyles={{
              fontSize: styles.titleFontSize,
              fontFamily: styles.titleFontFamily,
              fontWeight: styles.titleFontWeight,
              alignment: styles.titleAlignment,
              color: styles.titleColor
            }}
            subtitleStyles={{
              fontSize: styles.subtitleFontSize,
              fontFamily: styles.subtitleFontFamily,
              fontWeight: styles.subtitleFontWeight,
              alignment: styles.subtitleAlignment,
              color: styles.subtitleColor
            }}
          />
        </div>
      )}

      {/* Full-page cover image with text overlay */}
      <BackgroundWrapper backgroundColor={backgroundColor} section="hero">
        <div className={`relative ${getImageObjectFit(content.coverImage) === "cover" ? "aspect-[3/4] sm:aspect-auto" : ""}`}>
          {getImageObjectFit(content.coverImage) === "cover" ? (
            <>
              {/* Mobile version - cropped */}
              <div className="sm:hidden relative aspect-[3/4]">
                <Image
                  src={getImageUrl(content.coverImage) || "/images/placeholder.png"}
                  alt={content.coverImageAlt}
                  fill
                  className="object-cover"
                  style={{
                    objectPosition: getImageObjectPosition(content.coverImage),
                  }}
                  priority
                />
              </div>
              {/* Desktop version - full image */}
              <div className="hidden sm:block">
                <Image
                  src={getImageUrl(content.coverImage) || "/images/placeholder.png"}
                  alt={content.coverImageAlt}
                  width={1600}
                  height={900}
                  className="w-full h-auto"
                  style={{
                    objectPosition: getImageObjectPosition(content.coverImage),
                  }}
                  priority
                />
              </div>
            </>
          ) : (
            <Image
              src={getImageUrl(content.coverImage) || "/images/placeholder.png"}
              alt={content.coverImageAlt}
              width={1600}
              height={900}
              className="w-full h-auto"
              style={{
                objectPosition: getImageObjectPosition(content.coverImage),
              }}
              priority
            />
          )}

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Cover text */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-16 text-white">
            <h1 className={`
              ${styles.titleFontSize || "text-4xl lg:text-6xl"} 
              ${styles.titleFontFamily || "font-bold"}
              ${getAlignmentClass(styles.titleAlignment)}
              mb-4
            `}>
              {content.professionalName}
            </h1>
            <p className={`
              ${styles.subtitleFontSize || "text-xl lg:text-2xl"} 
              ${styles.subtitleFontFamily || "font-light"}
              ${getAlignmentClass(styles.subtitleAlignment)}
              mb-6
            `}>
              {content.professionalTitle}
            </p>
            {content.pullQuote && (
              <blockquote className="text-lg lg:text-xl italic border-l-4 border-glamlink-gold pl-4 max-w-2xl">
                "{content.pullQuote}"
              </blockquote>
            )}
          </div>
        </div>
      </BackgroundWrapper>

      {/* Interview/Story section */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12 lg:py-16">
        {/* Professional details with The Journey */}
        <BackgroundWrapper 
          backgroundColor={backgroundColor} 
          section="journey"
          className="flex flex-col lg:flex-row gap-8 mb-12 rounded-lg p-6"
        >
          {content.professionalImage && (
            <div className="lg:w-1/3">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                <Image
                  src={getImageUrl(content.professionalImage) || "/images/placeholder.png"}
                  alt={content.professionalName}
                  fill
                  className={getImageObjectFit(content.professionalImage) === "cover" ? "object-cover" : "object-contain"}
                  style={{
                    objectPosition: getImageObjectPosition(content.professionalImage),
                  }}
                  priority
                />
              </div>
            </div>
          )}

          <div className={content.professionalImage ? "lg:w-2/3" : "w-full"}>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">The Journey</h2>
            <RichContent 
              content={content.journey}
              className="max-w-none text-gray-700 [&_p]:!bg-transparent"
            />
          </div>
        </BackgroundWrapper>

        {/* Niche & Specialty */}
        {content.niche && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Finding Their Niche</h3>
            <p className={`
              ${content.nicheTypography?.fontSize || "text-base"} 
              ${content.nicheTypography?.fontFamily || "font-sans"}
              ${content.nicheTypography?.fontWeight || "font-normal"}
              ${content.nicheTypography?.fontStyle || ""}
              ${content.nicheTypography?.color || "text-gray-700"}
              ${content.nicheTypography?.alignment === "justify" ? "text-justify" : 
                content.nicheTypography?.alignment === "center" ? "text-center" : 
                content.nicheTypography?.alignment === "right" ? "text-right" : "text-left"}
            `}>
              {content.niche}
            </p>
          </div>
        )}

        {/* Key achievements */}
        {content.achievements && content.achievements.length > 0 && (
          <BackgroundWrapper 
            backgroundColor={backgroundColor} 
            section="achievements"
            className="mb-12 rounded-lg p-6"
          >
            <AccoladesList 
              accolades={content.achievements}
              title="Key Achievements"
            />
          </BackgroundWrapper>
        )}

        {/* How they use Glamlink */}
        {content.glamlinkUsage && (
          <div className="mb-12">
            <h3 className={`
              ${content.glamlinkSectionTypography?.fontSize || "text-2xl"} 
              ${content.glamlinkSectionTypography?.fontFamily || "font-sans"}
              ${content.glamlinkSectionTypography?.fontWeight || "font-bold"}
              ${content.glamlinkSectionTypography?.fontStyle || ""}
              ${content.glamlinkSectionTypography?.color || "text-gray-900"}
              ${content.glamlinkSectionTypography?.alignment === "center" ? "text-center" : 
                content.glamlinkSectionTypography?.alignment === "right" ? "text-right" : 
                content.glamlinkSectionTypography?.alignment === "justify" ? "text-justify" : "text-left"}
              mb-4
            `}>
              {content.glamlinkSectionTitle || "Powered by Glamlink"}
            </h3>
            <RichContent 
              content={content.glamlinkUsage}
              className="max-w-none text-gray-700 [&_p]:!bg-transparent"
            />
          </div>
        )}

        {/* Photo Gallery */}
        {content.photoGallery && content.photoGallery.images && content.photoGallery.images.length > 0 && (
          <BackgroundWrapper 
            backgroundColor={backgroundColor} 
            section="gallery"
            className="mb-12 rounded-lg p-6"
          >
            <h3 className="text-2xl font-bold mb-6 text-gray-900">
              {content.photoGallery.title || "Photo Gallery"}
            </h3>
            <PhotoGallery 
              photos={content.photoGallery.images.map(img => ({
                url: img.url,
                alt: img.alt,
                caption: img.caption
              }))}
            />
          </BackgroundWrapper>
        )}

        {/* Social links */}
        {content.socialLinks && (
          <div className="flex gap-4 pt-8 border-t">
            <SocialLinks
              links={[
                content.socialLinks.instagram && {
                  platform: "Instagram",
                  url: content.socialLinks.instagram,
                  className: "text-gray-600 hover:text-glamlink-teal transition-colors"
                },
                content.socialLinks.website && {
                  platform: "Website",
                  url: content.socialLinks.website,
                  className: "text-gray-600 hover:text-glamlink-teal transition-colors"
                },
                content.socialLinks.glamlinkProfile && {
                  platform: "View on Glamlink",
                  url: content.socialLinks.glamlinkProfile,
                  className: "text-glamlink-teal hover:text-glamlink-purple transition-colors font-medium",
                  target: "_self"
                }
              ].filter(Boolean) as any}
              onLinkClick={handleLinkClick}
            />
          </div>
        )}
      </article>
    </BackgroundWrapper>
  );
}
