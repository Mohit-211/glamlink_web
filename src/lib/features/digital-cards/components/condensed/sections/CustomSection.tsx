"use client";

import React from "react";
import { Professional } from "@/lib/pages/for-professionals/types/professional";
import { CondensedCardSectionInstance } from "@/lib/features/digital-cards/types/condensedCardConfig";
import { selectPropsByInnerSectionType } from '@/lib/features/digital-cards/store';
import {
  CustomObject,
  TextCustomObject,
  ImageCustomObject,
  LinkCustomObject,
  formatDimension,
  isTextObject,
  isImageObject,
  isLinkObject,
  isSpacerObject,
} from '@/lib/pages/admin/components/shared/editing/fields/custom/layout-objects/types';
import { useAppSelector } from "../../../../../../../store/hooks";

interface CustomSectionProps {
  professional: Professional;
  section?: CondensedCardSectionInstance;
}

/**
 * CustomSection - Render user-composed layout objects
 *
 * Supports Text, Image, Link, and Spacer objects with absolute positioning.
 * Used for fully custom sections in the Condensed Card system.
 */
export default function CustomSection({ professional, section }: CustomSectionProps) {
  // READ FROM REDUX - direct selector for live updates
  const reduxProps = useAppSelector(selectPropsByInnerSectionType('custom'));

  // Merge props with Redux taking highest precedence
  const mergedProps = { ...section?.props, ...reduxProps };

  const layoutObjects: CustomObject[] = section?.layoutObjects || mergedProps?.layoutObjects || [];

  if (layoutObjects.length === 0) {
    return (
      <div className="custom-section-empty text-center text-gray-500 py-8">
        <p>No content added to this custom section yet.</p>
      </div>
    );
  }

  return (
    <div className="custom-section relative w-full h-full">
      {layoutObjects
        .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
        .map((obj) => renderCustomObject(obj, professional))}
    </div>
  );
}

/**
 * Render a single CustomObject based on its type
 */
function renderCustomObject(obj: CustomObject, professional: Professional): React.ReactNode {
  // Common positioning styles - apply to wrapper div
  const positionStyle: React.CSSProperties = {
    position: 'absolute',
    left: formatDimension(obj.x),
    top: formatDimension(obj.y),
    width: formatDimension(obj.width),
    height: formatDimension(obj.height),
    zIndex: obj.zIndex || 1,
  };

  // Text Object
  if (isTextObject(obj)) {
    return (
      <div key={obj.id} style={positionStyle}>
        {renderTextObject(obj)}
      </div>
    );
  }

  // Image Object
  if (isImageObject(obj)) {
    return (
      <div key={obj.id} style={positionStyle}>
        {renderImageObject(obj)}
      </div>
    );
  }

  // Link Object
  if (isLinkObject(obj)) {
    return renderLinkObject(obj, positionStyle, obj.id);
  }

  // Spacer Object (invisible)
  if (isSpacerObject(obj)) {
    return <div key={obj.id} style={positionStyle} />;
  }

  // Custom Block (not implemented yet)
  return null;
}

/**
 * Render a Text object with title, subtitle, and content
 */
function renderTextObject(obj: TextCustomObject): React.ReactNode {
  const { title, subtitle, content, backgroundColor } = obj;

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: backgroundColor || 'transparent',
    padding: '0',
  };

  // Helper to render title or subtitle (handles both string and TypographySettings)
  const renderTypography = (typography: string | any, defaultTag: string = 'p') => {
    if (typeof typography === 'string') {
      // Simple string
      return typography;
    } else if (typography && typeof typography === 'object' && typography.text) {
      // TypographySettings object
      const Tag = (typography.tag || defaultTag) as React.ElementType;
      const style: React.CSSProperties = {
        fontFamily: typography.fontFamily,
        fontSize: typography.fontSize,
        fontWeight: typography.fontWeight,
        color: typography.color,
        textAlign: typography.alignment || 'left',
        margin: 0,
      };
      return <Tag style={style}>{typography.text}</Tag>;
    }
    return null;
  };

  return (
    <div style={containerStyle} className="custom-text-object">
      {/* Title */}
      {title && (
        <div className="mb-2">
          {renderTypography(title, 'h2')}
        </div>
      )}

      {/* Subtitle */}
      {subtitle && (
        <div className="mb-2">
          {renderTypography(subtitle, 'h3')}
        </div>
      )}

      {/* Content (HTML) */}
      {content && (
        <div
          className="custom-content text-gray-800"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
}

/**
 * Render an Image object
 */
function renderImageObject(obj: ImageCustomObject): React.ReactNode {
  const imageUrl = typeof obj.image === 'string' ? obj.image : obj.image?.url;

  if (!imageUrl) {
    return (
      <div
        style={{ width: '100%', height: '100%', backgroundColor: '#f3f4f6' }}
        className="flex items-center justify-center text-gray-400"
      >
        No image
      </div>
    );
  }

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: obj.objectFit || 'cover',
    borderRadius: obj.borderRadius ? `${obj.borderRadius}px` : '0',
  };

  return (
    <img
      src={imageUrl}
      alt="Custom section image"
      style={imageStyle}
      className="custom-image-object"
    />
  );
}

/**
 * Render a Link object (clickable hotspot)
 */
function renderLinkObject(obj: LinkCustomObject, positionStyle: React.CSSProperties, key: string): React.ReactNode {
  const linkStyle: React.CSSProperties = {
    ...positionStyle,
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: '1px dashed rgba(34, 184, 200, 0.3)', // Subtle outline for debugging
  };

  if (obj.linkType === 'external' && obj.externalUrl) {
    return (
      <a
        key={key}
        href={obj.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={linkStyle}
        className="custom-link-object hover:bg-blue-50 hover:bg-opacity-20 transition-colors"
        aria-label={`External link to ${obj.externalUrl}`}
      />
    );
  }

  // Internal links not implemented yet (would need page navigation context)
  return <div key={key} style={linkStyle} className="custom-link-object" />;
}
