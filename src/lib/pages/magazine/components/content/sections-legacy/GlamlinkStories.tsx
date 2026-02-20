"use client";

import Image from "next/image";
import Link from "next/link";
import type { GlamlinkStoriesContent } from "../../../types";
import MagazineLink from "../../shared/MagazineLink";
import { mergeUniversalStyleSettings, getUniversalLayoutPreset, getAlignmentClass } from "../../../config/universalStyles";
import { formatMagazineDate } from "@/lib/pages/admin/utils/dateUtils";
import { getImageUrl, getImageObjectFit, getImageObjectPosition } from "@/lib/pages/admin/components/shared/editing/fields/custom/media/imageCropUtils";

interface GlamlinkStoriesProps {
  content: GlamlinkStoriesContent;
  title?: string;
  subtitle?: string;
  backgroundColor?: string | { main?: string; stories?: string; featured?: string; loadMore?: string };
}

export default function GlamlinkStories({ content, title, subtitle, backgroundColor }: GlamlinkStoriesProps) {
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

  const mainBgProps = getBackgroundProps(backgrounds?.main);
  const storiesBgProps = getBackgroundProps(backgrounds?.stories);
  const featuredBgProps = getBackgroundProps(backgrounds?.featured);
  const loadMoreBgProps = getBackgroundProps(backgrounds?.loadMore);

  return (
    <div className={`py-12 px-8 ${mainBgProps.className || "bg-gray-100"}`} style={mainBgProps.style}>
      <div className="max-w-6xl mx-auto">
        {/* Header with dynamic styling */}
        {(title || subtitle) && (
          <div className="mb-8">
            {title && (
              <h2
                className={`
                ${styles.titleFontSize || "text-3xl md:text-4xl"} 
                ${styles.titleFontFamily || "font-serif"}
                ${styles.titleFontWeight || "font-bold"}
                ${getAlignmentClass(styles.titleAlignment)}
                ${styles.titleColor || "text-gray-900"}
                mb-2
              `}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className={`
                ${styles.subtitleFontSize || "text-lg md:text-xl"} 
                ${styles.subtitleFontFamily || "font-sans"}
                ${styles.subtitleFontWeight || "font-medium"}
                ${getAlignmentClass(styles.subtitleAlignment)}
                ${styles.subtitleColor || "text-gray-600"}
              `}
              >
                {subtitle}
              </p>
            )}
            {content.subtitle2 && (
              <p
                className={`
                ${styles.subtitle2FontSize || "text-base"} 
                ${styles.subtitle2FontFamily || "font-sans"}
                ${styles.subtitle2FontWeight || "font-normal"}
                ${getAlignmentClass(styles.subtitle2Alignment)}
                ${styles.subtitle2Color || "text-gray-500"}
                mt-1
              `}
              >
                {content.subtitle2}
              </p>
            )}
          </div>
        )}

        {/* Stories Grid - Instagram-style layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.stories.map((story, index) => (
            <div key={index} className={`relative aspect-[9/16] rounded-2xl overflow-hidden shadow-lg group cursor-pointer hover:scale-105 transition-transform ${storiesBgProps.className || "bg-white"}`} style={storiesBgProps.style}>
              {/* Background Image */}
              <Image
                src={getImageUrl(story.image) || "/images/placeholder.png"}
                alt={story.caption || "Story"}
                fill
                className={getImageObjectFit(story.image) === "cover" ? "object-cover" : "object-contain"}
                style={{
                  objectPosition: getImageObjectPosition(story.image),
                }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

              {/* Profile Info */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                {story.profileImage && (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                    <Image
                      src={getImageUrl(story.profileImage) || "/images/placeholder.png"}
                      alt={story.profileName}
                      fill
                      className={getImageObjectFit(story.profileImage) === "cover" ? "object-cover" : "object-contain"}
                      style={{
                        objectPosition: getImageObjectPosition(story.profileImage),
                      }}
                    />
                  </div>
                )}
                <div className="text-white">
                  <div className="text-sm font-bold">{story.profileName}</div>
                  {story.timestamp && <div className="text-xs opacity-80">{formatMagazineDate(story.timestamp)}</div>}
                </div>
              </div>

              {/* Story Type Badge */}
              {story.storyType && (
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-1 backdrop-blur text-white text-xs rounded-full bg-white/20">
                    {story.storyType === "before-after" && "✨ Transformation"}
                    {story.storyType === "tutorial" && "🎥 Tutorial"}
                    {story.storyType === "product" && "🛍️ Product"}
                    {story.storyType === "review" && "⭐ Review"}
                    {story.storyType === "post" && "📸 Post"}
                  </span>
                </div>
              )}

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                {story.caption && <p className="text-sm mb-2 line-clamp-3">{story.caption}</p>}

                {/* Engagement Stats */}
                <div className="flex items-center gap-4 text-xs">
                  {story.likes && (
                    <span className="flex items-center gap-1">
                      <span>❤️</span> {story.likes}
                    </span>
                  )}
                  {story.comments && (
                    <span className="flex items-center gap-1">
                      <span>💬</span> {story.comments}
                    </span>
                  )}
                  {story.views && (
                    <span className="flex items-center gap-1">
                      <span>👁️</span> {story.views}
                    </span>
                  )}
                </div>

                {/* Tags */}
                {story.tags && story.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {story.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span key={tagIndex} className="text-xs text-glamlink-teal">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Video Play Button */}
              {story.isVideo && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full backdrop-blur flex items-center justify-center bg-white/30">
                    <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1" />
                  </div>
                </div>
              )}

              {/* Hover Action */}
              {story.link && (
                <MagazineLink field={story.link} className="absolute inset-0 group-hover:bg-black/20 transition-colors">
                  <span className="sr-only">View story from {story.profileName}</span>
                </MagazineLink>
              )}
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <button className={`px-6 py-3 rounded-lg shadow hover:shadow-lg transition-shadow font-medium ${loadMoreBgProps.className || "bg-white"}`} style={loadMoreBgProps.style}>
            Load More Stories
          </button>
        </div>

        {/* Featured Stories Section */}
        {content.featuredStories && content.featuredStories.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-6 text-center">⭐ Featured This Week</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.featuredStories.map((featured, index) => (
                <div key={index} className={`rounded-xl overflow-hidden shadow-lg ${featuredBgProps.className || "bg-white"}`} style={featuredBgProps.style}>
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={getImageUrl(featured.image) || "/images/placeholder.png"}
                      alt={featured.title}
                      fill
                      className={getImageObjectFit(featured.image) === "cover" ? "object-cover" : "object-contain"}
                      style={{
                        objectPosition: getImageObjectPosition(featured.image),
                      }}
                    />
                    {featured.badge && <div className="absolute top-4 left-4 px-3 py-1 bg-glamlink-gold text-white rounded-full text-sm font-bold">{featured.badge}</div>}
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold mb-2">{featured.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{featured.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {featured.profileImage && (
                          <div className="relative w-8 h-8 rounded-full overflow-hidden">
                            <Image
                              src={getImageUrl(featured.profileImage) || "/images/placeholder.png"}
                              alt={featured.profileName}
                              fill
                              className={getImageObjectFit(featured.profileImage) === "cover" ? "object-cover" : "object-contain"}
                              style={{
                                objectPosition: getImageObjectPosition(featured.profileImage),
                              }}
                            />
                          </div>
                        )}
                        <span className="text-sm font-medium">{featured.profileName}</span>
                      </div>
                      {featured.link && (
                        <MagazineLink field={featured.link} className="text-glamlink-teal hover:text-glamlink-purple transition-colors text-sm font-medium">
                          View →
                        </MagazineLink>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
