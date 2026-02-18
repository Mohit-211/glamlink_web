/**
 * useSectionsTransformations - Data transformation utilities for magazine sections
 *
 * Handles bidirectional transformation between:
 * - Old format: contentBlocks with styling embedded in block root
 * - New format: blocks with styling in separate BlockStyling object
 *
 * Also provides conversion between WebSectionData and WebSectionAsDocument formats.
 */

import type { WebSectionData, WebSectionAsDocument } from './web/types';

// =============================================================================
// BLOCK FORMAT TRANSFORMATIONS
// =============================================================================

/**
 * Transform new format (blocks) to old format (contentBlocks)
 * For backward compatibility with existing magazine sections
 *
 * @param content - Content object with blocks or contentBlocks
 * @returns Content object with contentBlocks (old format)
 */
export function normalizeToContentBlocks(content: any): any {
  // If already using contentBlocks, return as-is
  if (content.contentBlocks) {
    return content;
  }

  // If using new blocks format, transform to contentBlocks
  if (content.blocks) {
    return {
      contentBlocks: content.blocks.map((block: any) => ({
        id: block.id,
        type: block.type,
        category: block.category,
        props: block.props,
        enabled: block.enabled,
        order: block.order,
        // Flatten styling into block root
        backgroundColor: block.styling?.backgroundColor,
        borderWidth: block.styling?.borderWidth,
        borderColor: block.styling?.borderColor,
        borderRadius: block.styling?.borderRadius,
        padding: block.styling?.padding
      })),
      layout: content.layout,
      // Rename sectionBackgroundColor → sectionBackground
      sectionBackground: content.sectionBackgroundColor || content.sectionBackground,
      sectionBorder: content.sectionBorder,
      sectionRounded: content.sectionRounded,
      sectionPadding: content.sectionPadding
    };
  }

  // If neither format, return as-is
  return content;
}

/**
 * Transform old format (contentBlocks) to new format (blocks)
 * For loading into web editor
 *
 * @param content - Content object with contentBlocks or blocks
 * @returns Content object with blocks (new format)
 */
export function transformToBlocks(content: any): any {
  // If already using blocks, return as-is
  if (content.blocks) {
    return content;
  }

  // If using old contentBlocks format, transform to blocks
  if (content.contentBlocks) {
    return {
      blocks: content.contentBlocks.map((block: any) => ({
        id: block.id,
        type: block.type,
        category: block.category,
        props: block.props,
        enabled: block.enabled,
        order: block.order,
        // Extract styling to separate object
        styling: {
          backgroundColor: block.backgroundColor,
          borderWidth: block.borderWidth,
          borderColor: block.borderColor,
          borderRadius: block.borderRadius,
          padding: block.padding
        }
      })),
      layout: content.layout || 'single-column',
      // Rename sectionBackground → sectionBackgroundColor
      sectionBackgroundColor: content.sectionBackgroundColor || content.sectionBackground,
      sectionBorder: content.sectionBorder,
      sectionRounded: content.sectionRounded,
      sectionPadding: content.sectionPadding
    };
  }

  // If neither format, return as-is
  return content;
}

// =============================================================================
// DOCUMENT FORMAT TRANSFORMATIONS
// =============================================================================

/**
 * Convert WebSectionData to MagazineSectionDocument-compatible format
 * Used when saving to the sections API
 *
 * IMPORTANT: Normalizes to OLD format (contentBlocks) for backward compatibility
 */
export function toSectionDocument(data: Partial<WebSectionData>): Partial<WebSectionAsDocument> {
  // Build content object based on section type
  let content: WebSectionAsDocument['content'] = {
    // Basic section fields (always included)
    titleTypography: data.titleTypography,
    subtitleTypography: data.subtitleTypography,
    description: data.description,
    backgroundColor: data.backgroundColor,
  };

  // For custom sections, normalize to old format (contentBlocks)
  if (data.type === 'custom-section' && (data as any).content) {
    const normalizedContent = normalizeToContentBlocks((data as any).content);

    // Merge normalized content (using contentBlocks, not blocks)
    content = {
      ...content,
      ...normalizedContent as any,  // Cast to avoid type errors with contentBlocks, sectionBackground
    };
  }

  // Include sectionStrip INSIDE content (where CustomSection.tsx expects it)
  const sectionStrip = (data as any).sectionStrip;
  if (sectionStrip) {
    (content as any).sectionStrip = sectionStrip;
  }

  return {
    id: data.id,
    issueId: data.issueId || '',
    type: data.type || 'join-glamlink',
    title: data.title || '',
    subtitle: data.subtitle,
    content,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

/**
 * Convert MagazineSectionDocument format back to WebSectionData
 * Used when loading from the sections API
 *
 * IMPORTANT: Transforms OLD format (contentBlocks) to NEW format (blocks) for editor
 */
export function fromSectionDocument(doc: Partial<WebSectionAsDocument>): Partial<WebSectionData> {
  const baseData: Partial<WebSectionData> = {
    id: doc.id,
    issueId: doc.issueId,
    type: doc.type || 'join-glamlink',
    title: doc.title || '',
    subtitle: doc.subtitle,
    titleTypography: doc.content?.titleTypography,
    subtitleTypography: doc.content?.subtitleTypography,
    description: doc.content?.description,
    backgroundColor: doc.content?.backgroundColor,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };

  // Restore sectionStrip from content
  if ((doc.content as any)?.sectionStrip) {
    (baseData as any).sectionStrip = (doc.content as any).sectionStrip;
  }

  // For custom sections, transform to new format (blocks) for editor
  if (doc.type === 'custom-section' && doc.content) {
    const content: any = doc.content;  // Cast to any to handle legacy fields
    const transformedContent = transformToBlocks({
      contentBlocks: content.contentBlocks,
      blocks: content.blocks,  // May already be in new format
      layout: content.layout,
      sectionBackground: content.sectionBackground,
      sectionBackgroundColor: content.sectionBackgroundColor,
      sectionBorder: content.sectionBorder,
      sectionRounded: content.sectionRounded,
      sectionPadding: content.sectionPadding,
    });

    (baseData as any).content = transformedContent;
  }

  return baseData;
}
