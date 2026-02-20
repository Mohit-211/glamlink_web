"use client";

import Image from "next/image";
import MagazineLink from "../../shared/MagazineLink";
import { formatMagazineDate } from "@/lib/pages/admin/utils/dateUtils";
import { getImageUrl, getImageObjectFit, getImageObjectPosition } from "@/lib/pages/admin/components/shared/editing/fields/custom/media/imageCropUtils";

interface Story {
  profileName: string;
  profileImage?: any;
  image: any;
  caption?: string;
  storyType?: 'before-after' | 'tutorial' | 'product' | 'review' | 'post';
  timestamp?: string;
  likes?: number;
  comments?: number;
  views?: number;
  tags?: string[];
  isVideo?: boolean;
  link?: any;
}

interface StoryContentProps {
  stories: Story[];
  className?: string;
  gridClassName?: string;
  showLoadMore?: boolean;
  loadMoreText?: string;
}

export default function StoryContent({ 
  stories,
  className = "",
  gridClassName = "",
  showLoadMore = true,
  loadMoreText = "Load More Stories"
}: StoryContentProps) {
  if (!stories || stories.length === 0) return null;

  const renderStoryCard = (story: Story, index: number) => (
    <div 
      key={index} 
      className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-lg group cursor-pointer hover:scale-105 transition-transform bg-white"
    >
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
          {story.timestamp && (
            <div className="text-xs opacity-80">
              {formatMagazineDate(story.timestamp)}
            </div>
          )}
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
        {story.caption && (
          <p className="text-sm mb-2 line-clamp-3">{story.caption}</p>
        )}

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
        <MagazineLink 
          field={story.link} 
          className="absolute inset-0 group-hover:bg-black/20 transition-colors"
        >
          <span className="sr-only">View story from {story.profileName}</span>
        </MagazineLink>
      )}
    </div>
  );

  return (
    <div className={className}>
      {/* Stories Grid - Instagram-style layout */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${gridClassName}`}>
        {stories.map((story, index) => renderStoryCard(story, index))}
      </div>

      {/* Load More Button */}
      {showLoadMore && (
        <div className="mt-8 text-center">
          <button className="px-6 py-3 bg-white rounded-lg shadow hover:shadow-lg transition-shadow font-medium">
            {loadMoreText}
          </button>
        </div>
      )}
    </div>
  );
}