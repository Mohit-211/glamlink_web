/**
 * useThumbnailExtraction - Extract thumbnail images from magazine sections
 *
 * Extracts the primary image from each section type to use as thumbnails
 * in the navigation strip.
 */

import { useCallback } from 'react';
import type { MagazineIssueSection } from '../types/magazine/core';

// Helper to extract URL from ImageFieldType (can be string or object with url property)
function getImageUrl(img: unknown): string | null {
  if (!img) return null;
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && img !== null) {
    const imgObj = img as Record<string, unknown>;
    return (imgObj.url as string) || (imgObj.originalUrl as string) || null;
  }
  return null;
}

/**
 * Extract thumbnail from a section based on its type
 */
export function extractThumbnailFromSection(section: MagazineIssueSection): string | null {
  const content = section.content as unknown as Record<string, unknown>;
  const type = section.type;

  switch (type) {
    case 'cover-pro-feature':
      return getImageUrl(content.coverImage) || getImageUrl(content.professionalImage);

    case 'rising-star':
      return getImageUrl(content.starImage);

    case 'maries-corner':
      const mainStory = content.mainStory as Record<string, unknown> | undefined;
      return getImageUrl(mainStory?.backgroundImage) || getImageUrl(mainStory?.authorImage);

    case 'maries-column':
      return getImageUrl(content.authorImage);

    case 'top-treatment':
      return getImageUrl(content.heroImage);

    case 'top-product-spotlight':
      return getImageUrl(content.productImage);

    case 'glamlink-stories': {
      // Try stories array first, then featuredStories
      const stories = content.stories as Array<Record<string, unknown>> | undefined;
      const featuredStories = content.featuredStories as Array<Record<string, unknown>> | undefined;
      if (stories?.[0]?.image) return getImageUrl(stories[0].image);
      if (featuredStories?.[0]?.image) return getImageUrl(featuredStories[0].image);
      return null;
    }

    case 'spotlight-city':
      return getImageUrl(content.cityImage) || getImageUrl(content.heroImage);

    case 'magazine-closing':
      return getImageUrl(content.nextIssueCover);

    case 'featured-story':
      return getImageUrl(content.heroImage);

    case 'coin-drop': {
      const featuredRewards = content.featuredRewards as Array<Record<string, unknown>> | undefined;
      if (featuredRewards?.[0]?.image) return getImageUrl(featuredRewards[0].image);
      return null;
    }

    case 'pro-tips':
      return getImageUrl(content.authorImage) || getImageUrl(content.heroImage);

    case 'event-roundup': {
      const upcomingEvents = content.upcomingEvents as Array<Record<string, unknown>> | undefined;
      const pastEvents = content.pastEvents as Array<Record<string, unknown>> | undefined;
      if (upcomingEvents?.[0]?.image) return getImageUrl(upcomingEvents[0].image);
      if (pastEvents?.[0]?.images) {
        const images = pastEvents[0].images as Array<unknown>;
        if (images?.[0]) return getImageUrl(images[0]);
      }
      return null;
    }

    case 'quote-wall': {
      const quotes = content.quotes as Array<Record<string, unknown>> | undefined;
      // Try to find a quote with an author image
      if (quotes) {
        for (const quote of quotes) {
          if (quote.authorImage) return getImageUrl(quote.authorImage);
        }
      }
      return null;
    }

    case 'whats-new-glamlink':
    case 'whats-hot-whats-out':
      // These sections typically don't have primary images
      return null;

    case 'custom-section': {
      // Try to extract from contentBlocks
      const contentBlocks = content.contentBlocks as Array<Record<string, unknown>> | undefined;
      if (contentBlocks) {
        for (const block of contentBlocks) {
          if (block.type === 'image' && block.props) {
            const props = block.props as Record<string, unknown>;
            const imgUrl = getImageUrl(props.src) || getImageUrl(props.image);
            if (imgUrl) return imgUrl;
          }
        }
      }
      return null;
    }

    default:
      // Try common image field names as fallback
      return getImageUrl(content.image) ||
             getImageUrl(content.heroImage) ||
             getImageUrl(content.coverImage) ||
             null;
  }
}

/**
 * Hook for thumbnail extraction with memoized callback
 */
export function useThumbnailExtraction() {
  const extractThumbnail = useCallback((section: MagazineIssueSection): string | null => {
    return extractThumbnailFromSection(section);
  }, []);

  return { extractThumbnail };
}

export default useThumbnailExtraction;
