'use client';

/**
 * ImageWithCaptionPreview - Preview component for image with caption pages
 *
 * Supports multiple layout options:
 * - Image positions: top, bottom, left, right, background, center
 * - Text alignments: left, center, right
 * - Image sizes: small, medium, large, full
 * - Vertical alignment: top, center, bottom
 */

import React from 'react';
import type {
  DigitalPreviewComponentProps,
  LayoutOptions,
  TypographySettings,
  ImageObject,
} from '../../../types';
import { useImageWithCaptionProps } from '../util/usePageData';
import {
  getImageUrl,
  getImageObjectFit,
  getImageObjectPosition,
  getTypographyStyles,
  getVerticalAlignmentClasses,
  getTextAlignmentClasses,
  getImageSizeClasses,
} from '../util/previewHelpers';

// =============================================================================
// LAYOUT COMPONENTS
// =============================================================================

interface ContentSectionProps {
  pageData: DigitalPreviewComponentProps['pageData'];
  layout: LayoutOptions;
}

const ContentSection: React.FC<ContentSectionProps> = ({ pageData, layout }) => {
  const textAlignClasses = getTextAlignmentClasses(layout.textAlignment);

  // Note: contentPadding is now applied at the layout wrapper level, not here
  return (
    <div className={`flex flex-col ${textAlignClasses}`}>
      {pageData.title && (
        <h1
          className="text-2xl font-bold mb-2"
          style={getTypographyStyles(pageData.titleTypography, {
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
          })}
        >
          {pageData.title}
        </h1>
      )}
      {pageData.subtitle && (
        <h2
          className="text-lg text-gray-600 mb-4"
          style={getTypographyStyles(pageData.subtitleTypography, {
            fontSize: '18px',
            fontWeight: '400',
            color: '#4B5563',
          })}
        >
          {pageData.subtitle}
        </h2>
      )}
      {pageData.caption && (
        <p
          className="text-base text-gray-700"
          style={getTypographyStyles(pageData.captionTypography, {
            fontSize: '16px',
            color: '#374151',
            lineHeight: '1.6',
          })}
        >
          {pageData.caption}
        </p>
      )}
    </div>
  );
};

interface ImageSectionProps {
  pageData: DigitalPreviewComponentProps['pageData'];
  layout: LayoutOptions;
  className?: string;
}

const ImageSection: React.FC<ImageSectionProps> = ({ pageData, layout, className = '' }) => {
  const imageUrl = getImageUrl(pageData.image);
  const objectFit = getImageObjectFit(pageData.image);
  const objectPosition = getImageObjectPosition(pageData.image);

  if (!imageUrl) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">No image selected</span>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <img
        src={imageUrl}
        alt={pageData.title || 'Page image'}
        className="w-full h-full"
        style={{
          objectFit: objectFit as any,
          objectPosition,
        }}
      />
    </div>
  );
};

// =============================================================================
// LAYOUT RENDERERS
// =============================================================================

const TopImageLayout: React.FC<DigitalPreviewComponentProps> = ({ pageData, pdfSettings }) => {
  const layout = pageData.layout || { imagePosition: 'top', textAlignment: 'center', contentPadding: 24, imageSize: 'large' };
  const imageSizeClass = getImageSizeClasses(layout.imageSize, 'top');
  const padding = layout.contentPadding ?? 24; // Use ?? to allow 0
  const gapClass = padding > 0 ? 'gap-4' : 'gap-0';

  return (
    <div className={`flex flex-col h-full ${gapClass}`} style={{ padding: `${padding}px` }}>
      <ImageSection pageData={pageData} layout={layout} className={`w-full ${imageSizeClass} flex-shrink-0`} />
      <div className="flex-1 overflow-auto">
        <ContentSection pageData={pageData} layout={layout} />
      </div>
    </div>
  );
};

const BottomImageLayout: React.FC<DigitalPreviewComponentProps> = ({ pageData, pdfSettings }) => {
  const layout = pageData.layout || { imagePosition: 'bottom', textAlignment: 'center', contentPadding: 24, imageSize: 'large' };
  const imageSizeClass = getImageSizeClasses(layout.imageSize, 'bottom');
  const padding = layout.contentPadding ?? 24; // Use ?? to allow 0
  const gapClass = padding > 0 ? 'gap-4' : 'gap-0';

  return (
    <div className={`flex flex-col h-full ${gapClass}`} style={{ padding: `${padding}px` }}>
      <div className="flex-1 overflow-auto">
        <ContentSection pageData={pageData} layout={layout} />
      </div>
      <ImageSection pageData={pageData} layout={layout} className={`w-full ${imageSizeClass} flex-shrink-0`} />
    </div>
  );
};

const LeftImageLayout: React.FC<DigitalPreviewComponentProps> = ({ pageData, pdfSettings }) => {
  const layout = pageData.layout || { imagePosition: 'left', textAlignment: 'left', contentPadding: 24, imageSize: 'medium' };
  const imageSizeClass = getImageSizeClasses(layout.imageSize, 'left');
  const verticalAlign = getVerticalAlignmentClasses(layout.verticalAlignment);
  const padding = layout.contentPadding ?? 24; // Use ?? to allow 0
  const gapClass = padding > 0 ? 'gap-4' : 'gap-0';

  return (
    <div className={`flex flex-row h-full ${gapClass}`} style={{ padding: `${padding}px` }}>
      <ImageSection pageData={pageData} layout={layout} className={`${imageSizeClass} h-full flex-shrink-0`} />
      <div className={`flex-1 flex flex-col ${verticalAlign} overflow-auto`}>
        <ContentSection pageData={pageData} layout={layout} />
      </div>
    </div>
  );
};

const RightImageLayout: React.FC<DigitalPreviewComponentProps> = ({ pageData, pdfSettings }) => {
  const layout = pageData.layout || { imagePosition: 'right', textAlignment: 'left', contentPadding: 24, imageSize: 'medium' };
  const imageSizeClass = getImageSizeClasses(layout.imageSize, 'right');
  const verticalAlign = getVerticalAlignmentClasses(layout.verticalAlignment);
  const padding = layout.contentPadding ?? 24; // Use ?? to allow 0
  const gapClass = padding > 0 ? 'gap-4' : 'gap-0';

  return (
    <div className={`flex flex-row h-full ${gapClass}`} style={{ padding: `${padding}px` }}>
      <div className={`flex-1 flex flex-col ${verticalAlign} overflow-auto`}>
        <ContentSection pageData={pageData} layout={layout} />
      </div>
      <ImageSection pageData={pageData} layout={layout} className={`${imageSizeClass} h-full flex-shrink-0`} />
    </div>
  );
};

const BackgroundImageLayout: React.FC<DigitalPreviewComponentProps> = ({ pageData, pdfSettings }) => {
  const layout = pageData.layout || { imagePosition: 'background', textAlignment: 'center', contentPadding: 40, imageSize: 'full' };
  const imageUrl = getImageUrl(pageData.image);
  const objectFit = getImageObjectFit(pageData.image);
  const objectPosition = getImageObjectPosition(pageData.image);
  const verticalAlign = getVerticalAlignmentClasses(layout.verticalAlignment);
  const textAlignClasses = getTextAlignmentClasses(layout.textAlignment);
  const padding = layout.contentPadding ?? 40; // Use ?? to allow 0

  return (
    <div className="relative h-full">
      {/* Background Image */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={pageData.title || 'Background image'}
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: objectFit as any,
            objectPosition,
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-gray-800" />
      )}

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Content */}
      <div
        className={`relative h-full flex flex-col ${verticalAlign} ${textAlignClasses}`}
        style={{ padding: `${padding}px` }}
      >
        {pageData.title && (
          <h1
            className="text-3xl font-bold mb-2 text-white drop-shadow-lg"
            style={getTypographyStyles(pageData.titleTypography, {
              fontSize: '32px',
              fontWeight: '700',
              color: '#ffffff',
            })}
          >
            {pageData.title}
          </h1>
        )}
        {pageData.subtitle && (
          <h2
            className="text-xl text-white/90 mb-4 drop-shadow"
            style={getTypographyStyles(pageData.subtitleTypography, {
              fontSize: '20px',
              fontWeight: '400',
              color: 'rgba(255,255,255,0.9)',
            })}
          >
            {pageData.subtitle}
          </h2>
        )}
        {pageData.caption && (
          <p
            className="text-base text-white/80 drop-shadow max-w-2xl"
            style={getTypographyStyles(pageData.captionTypography, {
              fontSize: '16px',
              color: 'rgba(255,255,255,0.8)',
              lineHeight: '1.6',
            })}
          >
            {pageData.caption}
          </p>
        )}
      </div>
    </div>
  );
};

const CenterImageLayout: React.FC<DigitalPreviewComponentProps> = ({ pageData, pdfSettings }) => {
  const layout = pageData.layout || { imagePosition: 'center', textAlignment: 'center', contentPadding: 24, imageSize: 'medium' };
  const textAlignClasses = getTextAlignmentClasses(layout.textAlignment);
  const padding = layout.contentPadding ?? 24; // Use ?? to allow 0

  return (
    <div
      className={`flex flex-col items-center justify-center h-full ${textAlignClasses}`}
      style={{ padding: `${padding}px` }}
    >
      {pageData.title && (
        <h1
          className="text-2xl font-bold mb-4"
          style={getTypographyStyles(pageData.titleTypography, {
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
          })}
        >
          {pageData.title}
        </h1>
      )}

      <ImageSection
        pageData={pageData}
        layout={layout}
        className="max-w-lg max-h-64 w-full rounded-lg shadow-lg mb-4"
      />

      {pageData.subtitle && (
        <h2
          className="text-lg text-gray-600 mb-2"
          style={getTypographyStyles(pageData.subtitleTypography, {
            fontSize: '18px',
            fontWeight: '400',
            color: '#4B5563',
          })}
        >
          {pageData.subtitle}
        </h2>
      )}
      {pageData.caption && (
        <p
          className="text-base text-gray-700 max-w-xl"
          style={getTypographyStyles(pageData.captionTypography, {
            fontSize: '16px',
            color: '#374151',
            lineHeight: '1.6',
          })}
        >
          {pageData.caption}
        </p>
      )}
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ImageWithCaptionPreview({
  pageData,
  pdfSettings,
}: DigitalPreviewComponentProps) {
  const { layout, backgroundColor, bgStyle } = useImageWithCaptionProps(pageData, pdfSettings);

  // Select layout based on image position
  const renderLayout = () => {
    switch (layout.imagePosition) {
      case 'top':
        return <TopImageLayout pageData={pageData} pdfSettings={pdfSettings} />;
      case 'bottom':
        return <BottomImageLayout pageData={pageData} pdfSettings={pdfSettings} />;
      case 'left':
        return <LeftImageLayout pageData={pageData} pdfSettings={pdfSettings} />;
      case 'right':
        return <RightImageLayout pageData={pageData} pdfSettings={pdfSettings} />;
      case 'background':
        return <BackgroundImageLayout pageData={pageData} pdfSettings={pdfSettings} />;
      case 'center':
        return <CenterImageLayout pageData={pageData} pdfSettings={pdfSettings} />;
      default:
        return <TopImageLayout pageData={pageData} pdfSettings={pdfSettings} />;
    }
  };

  return (
    <div className="w-full h-full" style={bgStyle}>
      {renderLayout()}
    </div>
  );
}
