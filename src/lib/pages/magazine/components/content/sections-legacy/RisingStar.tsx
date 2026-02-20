"use client";

import { RisingStarContent } from "../../../types";
import MagazineLink from "../../shared/MagazineLink";
import { mergeUniversalStyleSettings, getUniversalLayoutPreset } from "../../../config/universalStyles";
import { SectionHeader, BackgroundWrapper, PhotoGallery, RichContent, SocialLinks } from "../shared";
import { StarProfile, AchievementsGrid } from "../rising-star";
import { useMagazineAnalytics } from "@/lib/features/analytics/hooks/useMagazineAnalytics";

interface RisingStarProps {
  content: RisingStarContent;
  title?: string;
  subtitle?: string;
  backgroundColor?:
    | string
    | {
        main?: string;
        bio?: string;
        quote?: string;
        gallery?: string;
        accolades?: string;
        socialMedia?: string;
      };
  /** Issue ID for analytics tracking */
  issueId?: string;
}

export default function RisingStar({ content, title, subtitle, backgroundColor, issueId }: RisingStarProps) {
  // Analytics tracking
  const { trackLinkClick } = useMagazineAnalytics({
    issueId: issueId || '',
    trackViewOnMount: false,
  });

  // Handle link click tracking
  const handleLinkClick = (linkType: string, url: string) => {
    if (issueId) {
      const normalizedType = linkType.toLowerCase() as 'website' | 'instagram' | 'tiktok' | 'email' | 'linkedin' | 'glamlink' | 'other';
      trackLinkClick(normalizedType, url, 'rising-star', 'rising-star');
    }
  };

  // Get merged style settings
  const styles = mergeUniversalStyleSettings(content, getUniversalLayoutPreset(content.headerLayout));

  // Parse background colors
  const backgrounds = typeof backgroundColor === "object" ? backgroundColor : { main: backgroundColor };

  // Check if a value is a Tailwind class
  const isTailwindClass = (value?: string) => {
    return value && (value.startsWith("bg-") || value.includes(" bg-") || value.includes("from-") || value.includes("to-"));
  };

  // Apply background style or class
  const getBackgroundProps = (bgValue?: string) => {
    if (!bgValue || bgValue === "transparent") return {};
    if (isTailwindClass(bgValue)) {
      return { className: bgValue };
    }
    return { style: { background: bgValue } };
  };

  const quoteBgProps = getBackgroundProps(backgrounds?.quote);
  const bioBgProps = getBackgroundProps(backgrounds?.bio);

  // Helper function to check if a link has a valid URL
  const hasValidUrl = (link: any): boolean => {
    if (!link) return false;
    if (typeof link === "string") return link.trim() !== "";
    if (typeof link === "object" && "url" in link) {
      return link.url && link.url.trim() !== "";
    }
    return false;
  };

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
      )}

      {/* Hero Section - Star Profile */}
      <div className="relative overflow-hidden">
        <StarProfile
          starImage={content.starImage}
          starName={content.starName}
          starTitle={content.starTitle}
          starTitle2={content.starTitle2}
          starTitle2Typography={content.starTitle2Typography}
          bio={content.bio}
          quote={content.quote}
          quoteAuthor={content.quoteAuthor}
          quoteOverImage={content.quoteOverImage}
          quoteBgClassName={quoteBgProps.className || "bg-gray-100/95"}
          quoteBgStyle={quoteBgProps.style}
          bioBgClassName={bioBgProps.className || "bg-white"}
          bioBgStyle={bioBgProps.style}
        />
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
        {content.contentTitle && (
          <h2
            className={`
            ${content.contentTitleTypography?.fontSize || "text-3xl"} 
            ${content.contentTitleTypography?.fontFamily || "font-sans"}
            ${content.contentTitleTypography?.fontWeight || "font-bold"}
            ${content.contentTitleTypography?.fontStyle || ""}
            ${content.contentTitleTypography?.color || "text-gray-900"}
            ${content.contentTitleTypography?.alignment === "center" ? "text-center" : content.contentTitleTypography?.alignment === "right" ? "text-right" : "text-left"}
            mb-6
          `}
          >
            {content.contentTitle}
          </h2>
        )}
        <RichContent content={content.content} className="max-w-none text-gray-900" />
      </div>

      {/* Accolades Section */}
      {content.accolades && content.accolades.length > 0 && (
        <BackgroundWrapper backgroundColor={backgroundColor} section="accolades">
          <AchievementsGrid accolades={content.accolades} title={content.accoladesTitle} bgClassName={getBackgroundProps(backgrounds?.accolades).className || "bg-gradient-to-b from-gray-50 to-white"} bgStyle={getBackgroundProps(backgrounds?.accolades).style} />
        </BackgroundWrapper>
      )}

      {/* Photo Gallery */}
      {content.photoGallery && content.photoGallery.images && content.photoGallery.images.length > 0 && (
        <BackgroundWrapper backgroundColor={backgroundColor} section="gallery">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
            <h3 className="text-3xl font-bold text-center mb-8 text-gray-900">{content.photoGallery.title || "Gallery"}</h3>
            <PhotoGallery
              photos={content.photoGallery.images.map((img) => ({
                url: img.url,
                alt: img.alt,
                caption: img.caption,
              }))}
            />
          </div>
        </BackgroundWrapper>
      )}

      {/* Social Links Footer */}
      {content.socialLinks && (hasValidUrl(content.socialLinks.instagram) || hasValidUrl(content.socialLinks.website) || hasValidUrl(content.socialLinks.glamlinkProfile)) && (
        <BackgroundWrapper backgroundColor={backgroundColor} section="socialMedia">
          <div className="py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
              <h4 className="text-center text-lg font-semibold text-gray-700 mb-4">Connect with {content.starName}</h4>
              <div className="flex justify-center gap-6">
                <SocialLinks
                  links={
                    [
                      hasValidUrl(content.socialLinks.instagram) && {
                        platform: "Instagram",
                        url: content.socialLinks.instagram,
                        className: "px-6 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow text-gray-700 hover:text-glamlink-teal",
                      },
                      hasValidUrl(content.socialLinks.website) && {
                        platform: "Website",
                        url: content.socialLinks.website,
                        className: "px-6 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow text-gray-700 hover:text-glamlink-teal",
                      },
                      hasValidUrl(content.socialLinks.glamlinkProfile) && {
                        platform: "View on Glamlink",
                        url: content.socialLinks.glamlinkProfile,
                        className: "px-6 py-2 bg-glamlink-teal text-white rounded-full shadow-md hover:shadow-lg transition-shadow hover:bg-glamlink-teal-dark",
                        target: "_self",
                      },
                    ].filter(Boolean) as any
                  }
                  onLinkClick={handleLinkClick}
                />
              </div>
            </div>
          </div>
        </BackgroundWrapper>
      )}
    </BackgroundWrapper>
  );
}
