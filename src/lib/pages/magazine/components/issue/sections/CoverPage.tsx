"use client";

import Image from "next/image";
import type { MagazinePage, MagazineIssue } from "../../../types";
import { getBackgroundStyle, getBackgroundClass } from "./useCoverPage";

export interface CoverPageProps {
  page: MagazinePage;
  issue?: MagazineIssue;
}

/**
 * Helper to extract URL from image object or string
 */
function getImageUrl(image: any): string {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.url || image.originalUrl || '';
}

/**
 * Cover page rendering for magazine issues.
 *
 * Displays only the coverBackgroundImage as a full-page image (no text overlays).
 * Clean, simple cover that just shows the cover image.
 */
export function CoverPage({ page, issue }: CoverPageProps) {
  const bgStyle = getBackgroundStyle((issue as any)?.coverBackgroundColor);
  const bgClass = getBackgroundClass((issue as any)?.coverBackgroundColor);

  // Get cover background image URL
  const backgroundImageUrl = getImageUrl((issue as any)?.coverBackgroundImage);

  // If no background image, show a placeholder
  if (!backgroundImageUrl) {
    return (
      <div className={`h-full w-full flex items-center justify-center ${bgClass}`} style={bgStyle}>
        <p className="text-gray-500">No cover image set</p>
      </div>
    );
  }

  // Show only the cover background image - clean, simple cover
  return (
    <div className={`h-full w-full ${bgClass}`} style={bgStyle}>
      <div className="relative w-full h-full">
        <Image
          src={backgroundImageUrl}
          alt={(issue as any)?.coverImageAlt || 'Magazine Cover'}
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}

interface CoverQuoteProps {
  quote?: string;
  position?: string;
  inImage: boolean;
}

function CoverQuote({ quote, position, inImage }: CoverQuoteProps) {
  // Check if quote has actual content (not just empty HTML tags)
  const hasQuoteContent =
    quote &&
    quote
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, "")
      .trim().length > 0;

  if (!hasQuoteContent) return null;

  // Show in-image quote or above-description quote based on position
  if (inImage && position === "in-image") {
    return (
      <blockquote className="text-lg lg:text-xl italic border-l-4 border-glamlink-gold pl-4 max-w-2xl mt-4">
        <div dangerouslySetInnerHTML={{ __html: quote || "" }} />
      </blockquote>
    );
  }

  if (!inImage && position === "above-description") {
    return (
      <blockquote className="text-lg lg:text-xl italic border-l-4 border-glamlink-gold pl-4 max-w-2xl mb-6 text-gray-700">
        <div dangerouslySetInnerHTML={{ __html: quote || "" }} />
      </blockquote>
    );
  }

  return null;
}

export default CoverPage;
