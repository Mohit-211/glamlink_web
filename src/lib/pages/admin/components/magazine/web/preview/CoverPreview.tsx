'use client';

import React from 'react';
import Image from 'next/image';
import type { PreviewComponentProps } from '@/lib/pages/admin/config/previewComponents';
import TypographyDisplay from '@/lib/pages/admin/components/shared/editing/fields/typography/TypographyDisplay';
import { DEFAULT_TITLE_TYPOGRAPHY, DEFAULT_SUBTITLE_TYPOGRAPHY, DEFAULT_TITLE_TYPOGRAPHY_WHITE, DEFAULT_SUBTITLE_TYPOGRAPHY_WHITE } from './types';

/**
 * CoverPreview - Preview of magazine cover
 *
 * Renders the cover using issue-level data only (no section lookup)
 */
export default function CoverPreview({ issue }: PreviewComponentProps) {
  // Use issue-level description image for cover display
  const coverImage = (issue as any)?.descriptionImage;
  const coverImageAlt = (issue as any)?.coverImageAlt || 'Cover image';

  // Get background styles
  const bgStyle: React.CSSProperties = {};
  let bgClass = '';

  if ((issue as any)?.coverBackgroundColor) {
    const backgroundColor = (issue as any).coverBackgroundColor;
    if (backgroundColor.startsWith('#') || backgroundColor.startsWith('linear-gradient') || backgroundColor.startsWith('radial-gradient')) {
      bgStyle.background = backgroundColor;
    } else if (backgroundColor.startsWith('bg-')) {
      bgClass = backgroundColor;
    }
  }

  // Helper to check if cover quote has content
  const hasQuoteContent = issue?.coverQuote &&
    issue.coverQuote.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '').trim().length > 0;

  return (
    <div className={`h-full flex flex-col ${bgClass}`} style={bgStyle}>
      {/* Cover Image */}
      {coverImage ? (
        <div className="relative mb-8 h-[30rem] md:h-auto">
          <Image
            src={coverImage?.url || coverImage}
            alt={coverImageAlt}
            width={800}
            height={1067}
            className="w-full h-full md:h-auto object-cover md:object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
            <TypographyDisplay
              tag="h1"
              typography={(issue as any)?.titleTypography}
              defaults={DEFAULT_TITLE_TYPOGRAPHY_WHITE}
              className="mb-2"
            >
              {issue.title}
            </TypographyDisplay>

            {issue.subtitle && (
              <TypographyDisplay
                tag="p"
                typography={(issue as any)?.subtitleTypography}
                defaults={DEFAULT_SUBTITLE_TYPOGRAPHY_WHITE}
                className="opacity-90 mb-4"
              >
                {issue.subtitle}
              </TypographyDisplay>
            )}

            {/* Cover Quote - In Image Position */}
            {hasQuoteContent && issue?.coverQuotePosition === "in-image" && (
              <blockquote className="text-lg lg:text-xl italic border-l-4 border-glamlink-gold pl-4 max-w-2xl mt-4">
                <div dangerouslySetInnerHTML={{ __html: issue.coverQuote || "" }} />
              </blockquote>
            )}
          </div>
        </div>
      ) : (
        /* No cover image - show title/subtitle without image */
        <div className="mb-8 p-8 text-center">
          <TypographyDisplay
            tag="h1"
            typography={(issue as any)?.titleTypography}
            defaults={DEFAULT_TITLE_TYPOGRAPHY}
            className="mb-2"
          >
            {issue.title}
          </TypographyDisplay>

          {issue.subtitle && (
            <TypographyDisplay
              tag="p"
              typography={(issue as any)?.subtitleTypography}
              defaults={DEFAULT_SUBTITLE_TYPOGRAPHY}
              className="opacity-90 mb-4"
            >
              {issue.subtitle}
            </TypographyDisplay>
          )}
        </div>
      )}

      {/* Issue Info */}
      <div className="flex-1 px-8 pb-8">
        {/* Cover Quote - Above Description Position */}
        {hasQuoteContent && issue?.coverQuotePosition === "above-description" && (
          <blockquote className="text-lg lg:text-xl italic border-l-4 border-glamlink-gold pl-4 max-w-2xl mb-6 text-gray-700">
            <div dangerouslySetInnerHTML={{ __html: issue.coverQuote || "" }} />
          </blockquote>
        )}

        {/* Body/Description Content */}
        {issue.description && (
          <div
            className="text-gray-700 leading-relaxed prose prose-sm max-w-none magazine-main-content"
            dangerouslySetInnerHTML={{ __html: issue.description }}
          />
        )}
      </div>
    </div>
  );
}
