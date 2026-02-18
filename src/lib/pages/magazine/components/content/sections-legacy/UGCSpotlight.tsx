"use client";

import { UserGeneratedContent } from "../../../types";
import Image from "next/image";
import Link from "next/link";
import { formatMagazineDate } from "@/lib/pages/admin/utils/dateUtils";

interface UGCSpotlightProps {
  content: UserGeneratedContent[];
  isLoading?: boolean;
  backgroundColor?: string | { main?: string; cards?: string; cta?: string };
}

export default function UGCSpotlight({ content, isLoading, backgroundColor }: UGCSpotlightProps) {
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
  const cardsBgProps = getBackgroundProps(backgrounds?.cards);
  const ctaBgProps = getBackgroundProps(backgrounds?.cta);
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-96 mb-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getContentIcon = (type: UserGeneratedContent["contentType"]) => {
    switch (type) {
      case "video":
        return "🎥";
      case "transformation":
        return "✨";
      case "tutorial":
        return "📚";
      default:
        return "💬";
    }
  };

  return (
    <div className={mainBgProps.className || ""} style={mainBgProps.style}>
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">UGC Spotlight: Real Reviews, Real Results</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Authentic content from our community - 8.7x more powerful than influencer content</p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.map((item) => (
          <div key={item.id} className={`rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow ${cardsBgProps.className || "bg-white"}`} style={cardsBgProps.style}>
            {/* Media Preview */}
            {item.mediaUrl && (
              <div className="relative aspect-square">
                <Image src={item.mediaUrl} alt={item.title} fill className="object-cover" />
                <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-sm bg-white/90">{getContentIcon(item.contentType)}</div>
                {item.verifiedPurchase && <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">✓ Verified</div>}
              </div>
            )}

            <div className="p-4">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-3">
                <Image src={item.userImage} alt={item.userName} width={40} height={40} className="rounded-full" />
                <div>
                  <p className="font-medium text-gray-900">{item.userName}</p>
                  <p className="text-xs text-gray-500">{formatMagazineDate(item.createdAt)}</p>
                </div>
              </div>

              {/* Content */}
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-3 mb-3">{item.content}</p>

              {/* Engagement Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    {item.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {item.comments}
                  </span>
                </div>
                <span className="capitalize text-xs bg-gray-100 px-2 py-1 rounded">{item.contentType}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className={`text-center mt-12 rounded-lg p-8 ${ctaBgProps.className || "bg-blue-50"}`} style={ctaBgProps.style}>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Share Your Story</h3>
        <p className="text-gray-600 mb-4">Join thousands of customers sharing their authentic beauty journeys</p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">Submit Your Content</button>
      </div>
    </div>
  );
}
