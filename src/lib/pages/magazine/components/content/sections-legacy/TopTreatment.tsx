"use client";

import { useState } from "react";
import Image from "next/image";
import { TopTreatmentContent } from "../../../types";
import MagazineLink from "../../shared/MagazineLink";
import { mergeUniversalStyleSettings, getUniversalLayoutPreset } from "../../../config/universalStyles";
import { getImageUrl, getImageObjectFit, getImageObjectPosition } from "@/lib/pages/admin/components/shared/editing/fields/custom/media/imageCropUtils";
import { SectionHeader, BackgroundWrapper, RichContent, VideoEmbed } from "../shared";
import { TreatmentDetails, BeforeAfterImages, ProInsights } from "../top-treatment";
import { useMagazineAnalytics } from "@/lib/features/analytics/hooks/useMagazineAnalytics";

interface TopTreatmentProps {
  content: TopTreatmentContent;
  title?: string;
  subtitle?: string;
  backgroundColor?:
    | string
    | {
        main?: string;
        details?: string;
        benefits?: string;
        stats?: string;
        proInsights?: string;
        goodToKnow?: string;
      };
  /** Issue ID for analytics tracking */
  issueId?: string;
}

export default function TopTreatment({ content, title, subtitle, backgroundColor, issueId }: TopTreatmentProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  // Analytics tracking
  const { trackVideoPlay } = useMagazineAnalytics({
    issueId: issueId || '',
    trackViewOnMount: false,
  });

  // Get merged style settings
  const styles = mergeUniversalStyleSettings(content, getUniversalLayoutPreset(content.headerLayout));

  // Check if video is configured
  const videoType = content.heroVideoSettings?.videoType || content.heroVideoType;
  const hasVideo = videoType && videoType !== "none" && (videoType === "youtube" ? content.heroVideoSettings?.videoUrl || content.heroVideoUrl : content.heroVideoSettings?.video || content.heroVideo);

  const handlePlayClick = () => {
    setIsVideoLoading(true);
    setIsVideoPlaying(true);

    // Track video play
    if (issueId) {
      const source = videoType === 'youtube' ? 'youtube' : 'upload';
      trackVideoPlay(source, 'top-treatment', 'top-treatment');
    }
  };

  return (
    <BackgroundWrapper backgroundColor={backgroundColor} className="py-4 sm:py-8 md:py-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {(title || subtitle) && (
          <SectionHeader
            title={title}
            subtitle={subtitle}
            subtitle2={content.subtitle2}
            titleStyles={{
              fontSize: styles.titleFontSize,
              fontFamily: styles.titleFontFamily,
              fontWeight: styles.titleFontWeight,
              alignment: styles.titleAlignment,
              color: styles.titleColor,
            }}
            subtitleStyles={{
              fontSize: styles.subtitleFontSize,
              fontFamily: styles.subtitleFontFamily,
              fontWeight: styles.subtitleFontWeight,
              alignment: styles.subtitleAlignment,
              color: styles.subtitleColor,
            }}
          />
        )}

        {/* Treatment name badge */}
        {content.treatmentName && (
          <div
            className={`mb-8 ${
              content.treatmentNameTypography?.alignment === "justify"
                ? "text-justify"
                : content.treatmentNameTypography?.alignment === "center"
                ? "text-center"
                : content.treatmentNameTypography?.alignment === "right"
                ? "text-right"
                : content.treatmentNameTypography?.alignment === "left"
                ? "text-left"
                : "text-center"
            }`}
          >
            <div className="inline-block px-4 py-2 bg-glamlink-gold/20 rounded-full">
              <span
                className={`
                ${content.treatmentNameTypography?.fontSize || "text-lg"} 
                ${content.treatmentNameTypography?.fontFamily || "font-sans"}
                ${content.treatmentNameTypography?.fontWeight || "font-bold"}
                ${content.treatmentNameTypography?.fontStyle || ""}
                ${content.treatmentNameTypography?.color || "text-glamlink-gold"}
              `}
              >
                {content.treatmentName}
              </span>
            </div>
          </div>
        )}

        {/* Treatment Media - Hero Image with optional video overlay */}
        {content.heroImage && (
          <div className="mb-8">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl bg-black">
              {/* Always render image as base layer */}
              <Image
                src={getImageUrl(content.heroImage) || "/images/placeholder.png"}
                alt={content.treatmentName}
                fill
                className={`${getImageObjectFit(content.heroImage) === "cover" ? "object-cover" : "object-contain"} transition-opacity duration-300 ${isVideoPlaying && hasVideo ? "opacity-0" : "opacity-100"}`}
                style={{
                  objectPosition: getImageObjectPosition(content.heroImage),
                }}
              />

              {/* Video layer - renders on top when playing */}
              {hasVideo && isVideoPlaying && (
                <div className="absolute inset-0 z-10">
                  <VideoEmbed url={content.heroVideoSettings?.videoUrl || content.heroVideoUrl} videoFile={content.heroVideoSettings?.video || content.heroVideo} videoType={videoType as any} />
                </div>
              )}

              {/* Loading spinner */}
              {isVideoLoading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
                  <div className="bg-white rounded-full p-4">
                    <svg className="animate-spin h-8 w-8 text-glamlink-teal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </div>
              )}

              {/* Play button overlay */}
              {hasVideo && !isVideoPlaying && (
                <button onClick={handlePlayClick} className="absolute inset-0 z-5 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group" aria-label="Play video">
                  <div className="bg-white/90 group-hover:bg-white rounded-full p-3 sm:p-4 md:p-6 shadow-2xl transform group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 text-glamlink-teal" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </button>
              )}

              {/* Close button */}
              {isVideoPlaying && (
                <button
                  onClick={() => {
                    setIsVideoPlaying(false);
                    setIsVideoLoading(false);
                  }}
                  className="absolute top-4 right-4 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  aria-label="Close video"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              {/* Before/After overlay - desktop only */}
              {content.beforeAfter && !isVideoPlaying && (
                <div className="hidden sm:block absolute bottom-4 right-4 z-15">
                  <BeforeAfterImages beforeImage={content.beforeAfter.before} afterImage={content.beforeAfter.after} className="w-40 md:w-48 xl:w-56" />
                </div>
              )}
            </div>

            {/* Before/After below video - mobile only */}
            {content.beforeAfter && (
              <div className="sm:hidden mt-4">
                <BeforeAfterImages beforeImage={content.beforeAfter.before} afterImage={content.beforeAfter.after} />
              </div>
            )}
          </div>
        )}

        {/* Treatment Details */}
        <BackgroundWrapper backgroundColor={backgroundColor} section="details" className="space-y-8">
          <div>
            <h3
              className={`
              ${content.aCloserLookTypography?.fontSize || "text-2xl"} 
              ${content.aCloserLookTypography?.fontFamily || "font-sans"}
              ${content.aCloserLookTypography?.fontWeight || "font-bold"}
              ${content.aCloserLookTypography?.fontStyle || ""}
              ${content.aCloserLookTypography?.color || "text-gray-900"}
              mb-4
            `}
            >
              {content.aCloserLookTitle || "A Closer Look"}
            </h3>

            <RichContent content={content.aCloserLook} className="max-w-none text-gray-700 mb-6" />

            {/* Use TreatmentDetails component for structured info */}
            <TreatmentDetails
              name=""
              nameTypography={content.treatmentNameTypography}
              duration={content.duration}
              frequency={content.frequency}
              price={content.priceRange}
              description=""
              benefitsTitle={content.keyBenefitsTitle}
              benefitsTitleTypography={content.keyBenefitsTypography}
              benefits={content.benefits}
              className="mb-6"
            />

            {/* Pro Insights */}
            {content.proInsights && content.proInsights.length > 0 && (
              <BackgroundWrapper backgroundColor={backgroundColor} section="proInsights">
                <ProInsights insights={content.proInsights} title={content.proInsightsTitle || "Pro Insights:"} titleTypography={content.proInsightsTypography} />
              </BackgroundWrapper>
            )}

            {/* Results */}
            {content.results && (
              <div className="mb-6">
                <h4
                  className={`
                  ${content.expectedResultsTypography?.fontSize || "text-base"} 
                  ${content.expectedResultsTypography?.fontFamily || "font-sans"}
                  ${content.expectedResultsTypography?.fontWeight || "font-bold"}
                  ${content.expectedResultsTypography?.fontStyle || ""}
                  ${content.expectedResultsTypography?.color || "text-gray-900"}
                  mb-3
                `}
                >
                  {content.expectedResultsTitle || "Expected Results:"}
                </h4>
                <p className="text-gray-700">{content.results}</p>
              </div>
            )}

            {/* CTA */}
            {content.bookingLink && (
              <MagazineLink field={content.bookingLink} className="inline-block px-6 py-3 bg-glamlink-teal text-white rounded-lg hover:bg-glamlink-purple transition-colors font-medium">
                Find Providers Offering This Treatment
              </MagazineLink>
            )}
          </div>
        </BackgroundWrapper>

        {/* Additional Info */}
        {content.additionalInfo && (
          <BackgroundWrapper backgroundColor={backgroundColor} section="goodToKnow" className="mt-12 p-6 rounded-xl">
            <h4
              className={`
              ${content.goodToKnowTypography?.fontSize || "text-base"} 
              ${content.goodToKnowTypography?.fontFamily || "font-sans"}
              ${content.goodToKnowTypography?.fontWeight || "font-bold"}
              ${content.goodToKnowTypography?.fontStyle || ""}
              ${content.goodToKnowTypography?.color || "text-gray-900"}
              mb-3
            `}
            >
              {content.goodToKnowTitle || "Good to Know:"}
            </h4>
            <p className="text-gray-700">{content.additionalInfo}</p>
          </BackgroundWrapper>
        )}
      </div>
    </BackgroundWrapper>
  );
}
