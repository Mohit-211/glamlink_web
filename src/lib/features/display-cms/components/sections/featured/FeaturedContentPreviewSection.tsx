"use client";

import type { FeaturedContentPreviewSection as FeaturedContentPreviewSectionType } from '@/lib/pages/admin/components/content-settings/content/sections/featured/types';
import { isFeaturedContentPreviewSection } from '@/lib/pages/admin/components/content-settings/content/sections/featured/types';
import ContentPreview from '@/lib/pages/apply/shared/components/layout/ContentPreview';

interface FeaturedContentPreviewSectionProps {
  section: FeaturedContentPreviewSectionType | any;
}

/**
 * Featured Content Preview Section
 *
 * Wraps the existing ContentPreview component
 * Complex section with intro, content blocks, videos, and bottom CTA
 * No CMS-configurable content - preserves all existing logic
 */
export function FeaturedContentPreviewSection({ section }: FeaturedContentPreviewSectionProps) {
  if (!isFeaturedContentPreviewSection(section)) {
    return null;
  }

  return <ContentPreview />;
}
