"use client";

import Image from "next/image";
import { formatMagazineDate } from "@/lib/pages/admin/utils/dateUtils";
import MagazineLink from "../../shared/MagazineLink";
import { mergeUniversalStyleSettings, getUniversalLayoutPreset } from "../../../config/universalStyles";
import { getImageUrl, getImageObjectFit, getImageObjectPosition } from "@/lib/pages/admin/components/shared/editing/fields/custom/media/imageCropUtils";
import { MagazineClosingContent } from "../../../types";
import { SectionHeader, BackgroundWrapper, CallToAction as CallToActionComponent } from "../shared";
import { NextIssuePreview, SpotlightReel } from "../magazine-closing";
import { useMagazineAnalytics } from "@/lib/features/analytics/hooks/useMagazineAnalytics";

interface MagazineClosingProps {
  content: MagazineClosingContent;
  title?: string;
  subtitle?: string;
  backgroundColor?: string | { main?: string; whatsNext?: string; nextIssue?: string; upcomingHighlights?: string; spotlightReel?: string; joinMovement?: string };
  /** Issue ID for analytics tracking */
  issueId?: string;
}

export default function MagazineClosing({ content, title, subtitle, backgroundColor, issueId }: MagazineClosingProps) {
  // Analytics tracking
  const { trackEnhancedCTAClick } = useMagazineAnalytics({
    issueId: issueId || '',
    trackViewOnMount: false,
  });

  // Handle CTA click tracking
  const handleCtaClick = (label: string) => {
    if (issueId) {
      trackEnhancedCTAClick(label, 'primary', 'magazine-closing', 'closing');
    }
  };

  // Get merged style settings
  const styles = mergeUniversalStyleSettings(content, getUniversalLayoutPreset(content.headerLayout));

  // Default all sections to show if not specified
  const showWhatsNext = content.showWhatsNext !== false;
  const showSpotlightReel = content.showSpotlightReel !== false;
  const showJoinMovement = content.showJoinMovement !== false;

  return (
    <BackgroundWrapper backgroundColor={backgroundColor} className="space-y-0">
      {/* Header */}
      {(title || subtitle) && (
        <div className="py-12 px-8">
          <div className="max-w-6xl mx-auto">
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
          </div>
        </div>
      )}

      {/* What's Next Section */}
      {showWhatsNext && (content.nextIssueTitle || content.upcomingHighlights?.length) && (
        <BackgroundWrapper backgroundColor={backgroundColor} section="whatsNext" className="py-8 px-8">
          <div className="max-w-6xl mx-auto">
            {/* Next Issue Preview */}
            {content.nextIssueTitle && (
              <NextIssuePreview title={content.nextIssueTitle} date={content.nextIssueDate} description={content.nextIssueDescription} coverImage={content.nextIssueCover} titleTypography={content.nextIssueTitleTypography} backgroundColor={backgroundColor} section="nextIssue" className="mb-12" />
            )}

            {/* Upcoming Highlights Grid */}
            {content.upcomingHighlights && content.upcomingHighlights.length > 0 && (
              <div className="mb-12">
                <h3
                  className={`
                  ${content.upcomingHighlightsTitleTypography?.fontSize || "text-2xl"}
                  ${content.upcomingHighlightsTitleTypography?.fontFamily || "font-sans"}
                  ${content.upcomingHighlightsTitleTypography?.fontWeight || "font-bold"}
                  ${content.upcomingHighlightsTitleTypography?.fontStyle || ""}
                  ${content.upcomingHighlightsTitleTypography?.color || "text-gray-900"}
                  ${content.upcomingHighlightsTitleTypography?.alignment || "text-center"}
                  mb-6
                `}
                >
                  {content.upcomingHighlightsTitle || "Coming Soon"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {content.upcomingHighlights.map((highlight, index) => (
                    <BackgroundWrapper key={index} backgroundColor={backgroundColor} section="upcomingHighlights" className="rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                      {highlight.image && (
                        <div className="relative h-48">
                          <Image
                            src={getImageUrl(highlight.image) || "/images/placeholder.png"}
                            alt={highlight.title}
                            fill
                            className={getImageObjectFit(highlight.image) === "cover" ? "object-cover" : "object-contain"}
                            style={{
                              objectPosition: getImageObjectPosition(highlight.image),
                            }}
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h4 className="font-bold mb-2 text-gray-900">{highlight.title}</h4>
                        {highlight.description && <p className="text-sm text-gray-600">{highlight.description}</p>}
                      </div>
                    </BackgroundWrapper>
                  ))}
                </div>
              </div>
            )}
          </div>
        </BackgroundWrapper>
      )}

      {/* Spotlight Reel Section */}
      {showSpotlightReel && content.spotlights && content.spotlights.length > 0 && (
        <BackgroundWrapper backgroundColor={backgroundColor} section="spotlightReel" className="py-8 px-8">
          <div className="max-w-6xl mx-auto">
            <SpotlightReel title={content.reelTitle} titleTypography={content.reelTitleTypography} subtitleTypography={content.reelSubTitleTypography} spotlights={content.spotlights} gridLayout={content.gridLayout} />
          </div>
        </BackgroundWrapper>
      )}

      {/* Join Movement Section */}
      {showJoinMovement && <JoinMovementSection content={content} backgroundColor={backgroundColor} onCtaClick={handleCtaClick} />}

      {/* Common CTA at the end if not already shown in Join Movement */}
      {!showJoinMovement && (content.ctaHeadline || content.ctaQrCode || content.ctaLink) && (
        <div className="bg-gray-50 py-8 px-8">
          <div className="max-w-4xl mx-auto">
            <CallToActionComponent
              title={content.ctaHeadline || ""}
              description=""
              buttonText={content.ctaButtonText || "Join Glamlink"}
              buttonLink={content.ctaLink}
              qrCode={content.ctaQrCode}
              tagline={content.ctaTagline}
              titleTypography={content.ctaHeadlineTypography}
              taglineTypography={content.ctaTaglineTypography}
              onCtaClick={handleCtaClick}
            />
          </div>
        </div>
      )}
    </BackgroundWrapper>
  );
}

// Join Movement Section Component
function JoinMovementSection({ content, backgroundColor, onCtaClick }: { content: MagazineClosingContent; backgroundColor?: any; onCtaClick?: (label: string) => void }) {
  const useOverlay = content.useOverlayStyle !== false;
  const textColor = useOverlay ? "text-white" : "text-gray-900";
  const goldColor = "text-glamlink-gold";

  return (
    <div
      className="relative min-h-screen flex items-center justify-center py-8 px-8"
      style={
        content.backgroundImage
          ? {
              backgroundImage: `url(${content.backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {/* Overlay for better text readability */}
      {useOverlay && <div className="absolute inset-0 bg-black/40" />}

      <div className={`relative max-w-4xl mx-auto text-center px-4 ${textColor}`}>
        <h1
          className={`
          ${content.heroHeadlineTypography?.fontSize || "text-5xl md:text-7xl"}
          ${content.heroHeadlineTypography?.fontFamily || "font-sans"}
          ${content.heroHeadlineTypography?.fontWeight || "font-bold"}
          ${content.heroHeadlineTypography?.fontStyle || ""}
          ${content.heroHeadlineTypography?.color || textColor}
          ${content.heroHeadlineTypography?.alignment || "text-center"}
          mb-6 animate-fade-in
        `}
        >
          {content.heroHeadline || "Be Seen. Be Booked. Be Glam."}
        </h1>

        {content.heroSubheadline && (
          <p
            className={`
            ${content.heroSubheadlineTypography?.fontSize || "text-xl md:text-2xl"}
            ${content.heroSubheadlineTypography?.fontFamily || "font-sans"}
            ${content.heroSubheadlineTypography?.fontWeight || "font-normal"}
            ${content.heroSubheadlineTypography?.fontStyle || ""}
            ${content.heroSubheadlineTypography?.color || textColor}
            ${content.heroSubheadlineTypography?.alignment || ""}
            mb-12 opacity-90
          `}
          >
            {content.heroSubheadline}
          </p>
        )}

        {/* Bullets */}
        {content.bullets && content.bullets.length > 0 && (
          <div className="mb-12 max-w-2xl mx-auto">
            <h3
              className={`
              ${content.howToGetFeaturedTitleTypography?.fontSize || "text-2xl"}
              ${content.howToGetFeaturedTitleTypography?.fontFamily || "font-sans"}
              ${content.howToGetFeaturedTitleTypography?.fontWeight || "font-bold"}
              ${content.howToGetFeaturedTitleTypography?.fontStyle || ""}
              ${content.howToGetFeaturedTitleTypography?.color || textColor}
              ${content.howToGetFeaturedTitleTypography?.alignment || ""}
              mb-6
            `}
            >
              {content.howToGetFeaturedTitle || "How to Get Featured"}
            </h3>
            <div className="space-y-4">
              {content.bullets.map((bullet, index) => (
                <div key={index} className="flex items-start text-left gap-3">
                  <span className={`text-2xl flex-shrink-0 ${goldColor}`}>{index + 1}.</span>
                  <p className="text-lg flex-1 break-words">{bullet}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className={useOverlay ? "bg-gray-50/10 backdrop-blur-md rounded-2xl p-8" : "bg-gray-50 rounded-2xl p-8"}>
          <CallToActionComponent
            title={content.ctaHeadline || ""}
            description=""
            buttonText={content.ctaButtonText || "Join Glamlink"}
            buttonLink={content.ctaLink}
            qrCode={content.ctaQrCode}
            tagline={content.ctaTagline}
            titleTypography={content.ctaHeadlineTypography}
            taglineTypography={content.ctaTaglineTypography}
            darkMode={useOverlay}
            onCtaClick={onCtaClick}
          />
        </div>
      </div>
    </div>
  );
}
