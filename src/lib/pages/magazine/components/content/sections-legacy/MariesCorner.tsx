"use client";

import { MariesCornerContent } from "../../../types";
import { getUniversalLayoutPreset, mergeUniversalStyleSettings } from "../../../config/universalStyles";
import { SectionHeader, BackgroundWrapper, PhotoGallery, RichContent } from "../shared";
import { AuthorBadge, QuoteBlock, MariesPicks, NumberedTips, SocialFollow } from "../maries-corner";

interface MariesCornerProps {
  title: string;
  subtitle?: string;
  content: MariesCornerContent;
  backgroundColor?:
    | string
    | {
        main?: string;
        introProfile?: string;
        quoteSection?: string;
        articleSection?: string;
        sidebar?: string;
        mariesPicks?: string;
        numberedTips?: string;
        photoGallery?: string;
        socialFollow?: string;
      };
}

// Helper function to extract YouTube video ID and create embed URL
function getYouTubeEmbedUrl(url: string): string {
  if (!url) return "";

  let videoId = "";

  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) videoId = watchMatch[1];

  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) videoId = shortMatch[1];

  const embedMatch = url.match(/youtube\.com\/embed\/([^?]+)/);
  if (embedMatch) videoId = embedMatch[1];

  if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  if (url.includes("youtube.com/embed/")) return url;

  return "";
}

export default function MariesCorner({ title, subtitle, content, backgroundColor }: MariesCornerProps) {
  // Check if content exists
  if (!content || !content.mainStory) {
    return (
      <BackgroundWrapper backgroundColor={backgroundColor} className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500">Marie's Corner content is missing or incomplete.</p>
        </div>
      </BackgroundWrapper>
    );
  }

  // Get layout settings using universal styles
  const preset = getUniversalLayoutPreset(content.headerLayout);
  const styles = mergeUniversalStyleSettings(content, preset);

  const showAuthorInHeader = content.showAuthorInHeader !== false;

  // Author component to use in quote if not in header
  const authorComponent = !showAuthorInHeader ? (
    <div className="flex-shrink-0">
      <AuthorBadge
        authorName={content.mainStory.authorName}
        authorImage={content.mainStory.authorImage}
        authorTitle={content.authorDescription}
        badgeText={content.badgeText}
        badgePosition={content.authorBadgePosition}
        badgeFontSize={content.badgeFontSize}
        badgePadding={content.badgePadding}
        badgeWidth={typeof content.badgeWidth === "number" ? `${content.badgeWidth}px` : content.badgeWidth}
        imageSize={content.authorImageSize}
        imageWidth={typeof content.authorImageWidth === "string" ? parseInt(content.authorImageWidth) : content.authorImageWidth}
        imageHeight={typeof content.authorImageHeight === "string" ? parseInt(content.authorImageHeight) : content.authorImageHeight}
        imageBackground={content.authorImageBackground}
        imagePosition={content.authorImagePosition}
        imagePositionX={content.authorImagePositionX}
        imagePositionY={content.authorImagePositionY}
        nameTypography={content.authorNameTypography}
        titleTypography={content.authorDescriptionTypography}
      />
    </div>
  ) : null;

  return (
    <BackgroundWrapper backgroundColor={backgroundColor} className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with title/subtitle and optional author */}
        <div className="mb-8">
          <BackgroundWrapper backgroundColor={backgroundColor} section="introProfile" className="flex flex-col-reverse sm:flex-row justify-between items-start gap-4 rounded-lg p-4">
            {/* Title and Subtitle */}
            <div className="flex-1 w-full sm:w-auto">
              <SectionHeader title={title} subtitle={subtitle} subtitle2={content.subtitle2} styles={styles} className="mb-0" />
            </div>

            {/* Author in header if enabled */}
            {showAuthorInHeader && (
              <AuthorBadge
                authorName={content.mainStory.authorName}
                authorImage={content.mainStory.authorImage}
                authorTitle={content.authorDescription}
                badgeText={content.badgeText}
                badgePosition={content.authorBadgePosition}
                badgeFontSize={content.badgeFontSize}
                badgePadding={content.badgePadding}
                badgeWidth={typeof content.badgeWidth === "number" ? `${content.badgeWidth}px` : content.badgeWidth}
                imageSize={content.authorImageSize}
                imageWidth={content.authorImageWidth}
                imageHeight={content.authorImageHeight}
                imageBackground={content.authorImageBackground}
                imagePosition={content.authorImagePosition}
                imagePositionX={content.authorImagePositionX}
                imagePositionY={content.authorImagePositionY}
                nameTypography={content.authorNameTypography}
                titleTypography={content.authorDescriptionTypography}
              />
            )}
          </BackgroundWrapper>
        </div>

        {/* Article Video - Full width above all content */}
        {content.mainStory.articleVideoType && content.mainStory.articleVideoType !== "none" && (content.mainStory.articleVideo || content.mainStory.articleVideoUrl) && (
          <div className="mb-8">
            {content.mainStory.articleVideoType === "youtube" && content.mainStory.articleVideoUrl ? (
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe src={getYouTubeEmbedUrl(content.mainStory.articleVideoUrl)} className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
            ) : content.mainStory.articleVideo ? (
              <video src={content.mainStory.articleVideo} controls className="w-full rounded-lg shadow-lg" style={{ maxHeight: "500px" }}>
                Your browser does not support the video tag.
              </video>
            ) : null}
          </div>
        )}

        {/* Two-column layout */}
        <div className={`grid grid-cols-1 ${!content.enableSingleColumn ? "lg:grid-cols-[3fr_2fr]" : ""} gap-8`}>
          {/* Main Story Column */}
          <div className="space-y-6">
            {/* Quote Section */}
            <BackgroundWrapper backgroundColor={backgroundColor} section="quoteSection">
              <QuoteBlock quote={content.mainStory.title} quoteStyle={content.quoteStyle} quoteTextColor={content.quoteTextColor} quoteAlignment={content.quoteAlignment} backgroundImage={content.mainStory.backgroundImage} authorComponent={authorComponent} marginTop={content.quoteMarginTop} />
            </BackgroundWrapper>

            {/* Article Content */}
            <BackgroundWrapper backgroundColor={backgroundColor} section="articleSection" className="rounded-lg p-6 overflow-hidden">
              {content.mainStory.articleTitle && <h3 className="text-xl font-semibold text-gray-900 mb-4">{content.mainStory.articleTitle}</h3>}

              <RichContent content={content.mainStory.content} enableDropCap={content.enableDropCap} dropCapStyle={content.dropCapStyle} dropCapColor={content.dropCapColor} />
            </BackgroundWrapper>
          </div>

          {/* Sidebar */}
          <BackgroundWrapper backgroundColor={backgroundColor} section="sidebar" className="space-y-8">
            {/* Marie's Picks */}
            {content.showMariesPicks !== false && content.mariesPicks && (
              <BackgroundWrapper backgroundColor={backgroundColor} section="mariesPicks">
                <MariesPicks products={content.mariesPicks} />
              </BackgroundWrapper>
            )}

            {/* Numbered Tips */}
            {content.showSideStories !== false && content.sideStories && (
              <BackgroundWrapper backgroundColor={backgroundColor} section="numberedTips">
                <NumberedTips tips={content.sideStories} title={content.numberedTipsTitle} displayNumbers={content.displayNumbers} />
              </BackgroundWrapper>
            )}

            {/* Photo Gallery */}
            {content.showPhotoGallery !== false && content.photoGallery && (
              <BackgroundWrapper backgroundColor={backgroundColor} section="photoGallery">
                <PhotoGallery photos={content.photoGallery} />
              </BackgroundWrapper>
            )}

            {/* Social Follow */}
            {content.showSocialLink !== false && content.socialLink && (
              <BackgroundWrapper backgroundColor={backgroundColor} section="socialFollow">
                <SocialFollow socialLink={content.socialLink} />
              </BackgroundWrapper>
            )}
          </BackgroundWrapper>
        </div>
      </div>
    </BackgroundWrapper>
  );
}
