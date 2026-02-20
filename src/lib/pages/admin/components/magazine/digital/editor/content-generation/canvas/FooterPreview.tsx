'use client';

/**
 * FooterPreview - Renders the configurable footer for digital pages
 *
 * Displays:
 * - Page number (in configurable format) - individual color and alignment
 * - Magazine title ("The Glamlink Edit") - individual color and alignment
 * - Website URL (glamlink.net) - individual color and alignment
 *
 * Each element can be independently aligned left or right, with elements
 * grouped by their alignment (left group on left, right group on right).
 */

import React from 'react';
import { FooterSettings, PageNumberFormat } from '../../types';

// =============================================================================
// PROPS INTERFACE
// =============================================================================

export interface FooterPreviewProps {
  settings: FooterSettings;
  pageNumber: number;
  totalPages?: number;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function formatPageNumber(
  pageNumber: number,
  format: PageNumberFormat,
  totalPages?: number
): string {
  switch (format) {
    case 'page-x':
      return `Page ${pageNumber}`;
    case 'x':
      return `${pageNumber}`;
    case 'x-of-y':
      return totalPages ? `${pageNumber} of ${totalPages}` : `${pageNumber}`;
    default:
      return `Page ${pageNumber}`;
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function FooterPreview({
  settings,
  pageNumber,
  totalPages,
}: FooterPreviewProps) {
  if (!settings.enabled) {
    return null;
  }

  const {
    showPageNumber,
    pageNumberFormat,
    pageNumberAlignment,
    pageNumberColor,
    showMagazineTitle,
    magazineTitleAlignment,
    magazineTitleColor,
    showWebsiteUrl,
    websiteUrlAlignment,
    websiteUrlColor,
    fontSize,
    marginBottom,
  } = settings;

  // Build left-aligned and right-aligned element groups
  const leftElements: React.ReactNode[] = [];
  const rightElements: React.ReactNode[] = [];

  // Page number
  if (showPageNumber) {
    const element = (
      <span key="page-number" style={{ color: pageNumberColor }}>
        {formatPageNumber(pageNumber, pageNumberFormat, totalPages)}
      </span>
    );
    if (pageNumberAlignment === 'left') {
      leftElements.push(element);
    } else {
      rightElements.push(element);
    }
  }

  // Magazine title
  if (showMagazineTitle) {
    const element = (
      <span key="magazine-title" style={{ color: magazineTitleColor }}>
        The Glamlink Edit
      </span>
    );
    if (magazineTitleAlignment === 'left') {
      leftElements.push(element);
    } else {
      rightElements.push(element);
    }
  }

  // Website URL
  if (showWebsiteUrl) {
    const element = (
      <span key="website-url" style={{ color: websiteUrlColor }}>
        glamlink.net
      </span>
    );
    if (websiteUrlAlignment === 'left') {
      leftElements.push(element);
    } else {
      rightElements.push(element);
    }
  }

  // If no elements to display, return null
  if (leftElements.length === 0 && rightElements.length === 0) {
    return null;
  }

  return (
    <div
      className="absolute left-0 right-0 flex items-center justify-between px-6"
      style={{
        bottom: `${marginBottom}mm`,
        fontSize: `${fontSize}px`,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Left-aligned elements */}
      <div className="flex items-center gap-6">
        {leftElements}
      </div>
      {/* Right-aligned elements */}
      <div className="flex items-center gap-6">
        {rightElements}
      </div>
    </div>
  );
}
