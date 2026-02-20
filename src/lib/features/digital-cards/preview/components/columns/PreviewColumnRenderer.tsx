'use client';

/**
 * PreviewColumnRenderer - Unified section renderer for preview layouts
 *
 * This module provides multiple rendering approaches:
 * 1. Segmented layout (PreviewSegmentedLayout) - Independent column flow with full-width interrupts
 * 2. Row-based rendering (PreviewRowBasedLayout) - Alias for segmented layout
 * 3. Column-based rendering (PreviewColumnRenderer) - Renders a single column
 *
 * Key features:
 * - Uses explicit `column` property from condensedCardConfig
 * - Uses `rowOrder` for sorting within columns
 * - Independent column flow: left and right columns stack independently
 * - Full-width sections can interrupt and separate two-column segments
 * - Handles both direct sections and wrapped sections (contentContainer)
 */

import React, { useMemo } from 'react';
import type { Professional, ProfessionalSectionConfig } from '@/lib/pages/for-professionals/types/professional';
import type { CondensedCardConfig } from '@/lib/features/digital-cards/types';
import {
  getWebsiteSectionsForColumn,
  type WebsiteSectionInfo,
} from '../../utils/sectionUtils';
import { groupSectionsIntoSegments } from './layoutUtils';
import type { LayoutSegment, TwoColumnSegment } from './types';
import {
  BioSection,
  SignatureWorkSection,
  MapSection,
  SpecialtiesSection,
  ImportantInfoSection,
  PromotionsSection,
  BusinessHoursSection,
} from '../../sections';
import { useAppSelector } from '../../../../../../../store/hooks';
import { selectSections, selectPropsByInnerSectionType } from '@/lib/features/digital-cards/store';

// =============================================================================
// TYPES
// =============================================================================

export type ColumnType = 'left' | 'right' | 'full';

export interface SignatureWorkSettings {
  capturedVideoFrame?: number;
  showPlayButton?: boolean;
  displayFullWidth?: boolean;
  hideCaption?: boolean;
}

export interface PreviewColumnRendererProps {
  /** Which column to render */
  column: ColumnType;
  /** Professional data */
  professional: Partial<Professional>;
  /** Condensed card config - single source of truth */
  condensedCardConfig?: CondensedCardConfig;
  /** @deprecated Use condensedCardConfig instead */
  sectionsConfig?: ProfessionalSectionConfig[];
  /** Settings for signature work/video sections */
  signatureWorkSettings?: SignatureWorkSettings;
  /** Whether to show promo content */
  showPromo?: boolean;
  /** Promotion details text */
  promotionDetails?: string;
  /** Important info items */
  importantInfo?: string[];
  /** Additional CSS class */
  className?: string;
}

export interface PreviewRowBasedLayoutProps {
  /** Professional data */
  professional: Partial<Professional>;
  /** Condensed card config - single source of truth */
  condensedCardConfig?: CondensedCardConfig;
  /** Settings for signature work/video sections */
  signatureWorkSettings?: SignatureWorkSettings;
  /** Whether to show promo content */
  showPromo?: boolean;
  /** Promotion details text */
  promotionDetails?: string;
  /** Important info items */
  importantInfo?: string[];
  /** Additional CSS class */
  className?: string;
  /** Force single-column mobile layout on all screen sizes */
  forceMobileLayout?: boolean;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const DEFAULT_QR_URL = 'https://apps.apple.com/us/app/glamlink/id6502334118';

const COLUMN_CLASS_MAP: Record<ColumnType, string> = {
  left: 'preview-left-column',
  right: 'preview-right-column',
  full: 'preview-full-width-sections',
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the effective section type for rendering (handles wrapped sections)
 */
function getEffectiveSectionType(section: WebsiteSectionInfo): string {
  return section.innerSectionType || section.sectionType;
}

/**
 * Get QR settings for a section from its props
 */
function getSectionQrSettings(section: WebsiteSectionInfo): { enabled: boolean; url: string } {
  const props = section.innerSectionProps || section.props || {};
  return {
    enabled: props.displayQrCode ?? false,
    url: props.qrCodeUrl ?? DEFAULT_QR_URL,
  };
}

// =============================================================================
// SECTION RENDERER (shared logic)
// =============================================================================

interface SectionRendererProps {
  section: WebsiteSectionInfo;
  professional: Partial<Professional>;
  signatureWorkSettings?: SignatureWorkSettings;
  showPromo?: boolean;
  promotionDetails?: string;
  importantInfo?: string[];
  /** Redux props map for live updates - keyed by section type */
  reduxPropsMap?: Record<string, Record<string, any>>;
}

function renderSection({
  section,
  professional,
  signatureWorkSettings,
  showPromo = false,
  promotionDetails,
  importantInfo,
  reduxPropsMap = {},
}: SectionRendererProps): React.ReactNode {
  // Get section props - for wrapper sections, use props directly (contains mapHeight, etc.)
  // For inner sections, use innerSectionProps
  const sectionProps = section.props || {};
  const innerProps = section.innerSectionProps || {};

  // Get the effective section type for looking up Redux props
  const effectiveSectionType = getEffectiveSectionType(section);

  // Get Redux props for this section type (takes highest precedence for live updates)
  const reduxProps = reduxPropsMap[effectiveSectionType] || {};

  // Handle mapAndContentContainer specially - it should render MapSection
  // which includes both map AND business hours together
  if (section.sectionType === 'mapAndContentContainer') {
    // Get Redux props for map section
    const mapReduxProps = reduxPropsMap['map'] || reduxPropsMap['mapWithHours'] || {};
    return <MapSection key={section.id} professional={professional} sectionId="mapWithHours" sectionProps={{ ...sectionProps, ...mapReduxProps }} />;
  }

  const sectionType = getEffectiveSectionType(section);

  switch (sectionType) {
    // Bio/Header sections - both legacy and condensed card types
    case 'bio-simple':
    case 'bio-preview':
    case 'headerAndBio':
    case 'about-me':
      return <BioSection key={section.id} professional={professional} sectionId={sectionType} />;

    // Video/Signature Work sections
    case 'signature-work-actions':
    case 'signature-work':
    case 'video-display':
      // Merge props: innerProps (from config) + reduxProps (live updates take precedence)
      return <SignatureWorkSection key={section.id} professional={professional} sectionId={sectionType} settings={signatureWorkSettings} sectionProps={{ ...innerProps, ...reduxProps }} />;

    // Map sections - both legacy and condensed card types
    case 'map':
    case 'map-section':
    case 'mapWithHours':
      // Merge props: sectionProps (from config) + reduxProps (live updates take precedence)
      return <MapSection key={section.id} professional={professional} sectionId={sectionType} sectionProps={{ ...sectionProps, ...reduxProps }} />;

    // Specialties section
    case 'specialties':
    case 'specialties-section': {
      // Use reduxProps for QR settings with highest precedence
      const mergedProps = { ...innerProps, ...reduxProps };
      const specQr = {
        // Check both showQrCode (new toggleGroup) and displayQrCode (legacy)
        enabled: mergedProps.showQrCode ?? mergedProps.displayQrCode ?? false,
        url: mergedProps.qrCodeUrl ?? DEFAULT_QR_URL,
      };
      return <SpecialtiesSection key={section.id} professional={professional} sectionId={sectionType} qrCodeEnabled={specQr.enabled} qrCodeUrl={specQr.url} sectionProps={mergedProps} />;
    }

    // Important Info section
    case 'importantInfo':
    case 'important-info': {
      // Use reduxProps for QR settings with highest precedence
      const mergedProps = { ...innerProps, ...reduxProps };
      const infoQr = {
        // Check both showQrCode (new toggleGroup) and displayQrCode (legacy)
        enabled: mergedProps.showQrCode ?? mergedProps.displayQrCode ?? false,
        url: mergedProps.qrCodeUrl ?? DEFAULT_QR_URL,
      };
      const hasContent = (importantInfo && importantInfo.length > 0) || infoQr.enabled || (professional.importantInfo && professional.importantInfo.length > 0);
      return hasContent ? (
        <ImportantInfoSection
          key={section.id}
          sectionId={sectionType}
          professional={professional}
          importantInfo={importantInfo}
          qrCodeEnabled={infoQr.enabled}
          qrCodeUrl={infoQr.url}
          sectionProps={mergedProps}
        />
      ) : null;
    }

    // Promotions section
    case 'current-promotions':
    case 'current-promotions-detailed':
      return <PromotionsSection key={section.id} professional={professional} sectionId={sectionType} showPromo={showPromo} promotionDetails={promotionDetails} sectionProps={{ ...innerProps, ...reduxProps }} />;

    // Business Hours section
    case 'business-hours':
      return <BusinessHoursSection key={section.id} professional={professional} sectionId={sectionType} sectionProps={{ ...innerProps, ...reduxProps }} />;

    // Overview Stats section
    case 'overview-stats':
      return null;

    default:
      console.log(`[PreviewColumnRenderer] Unknown section type: ${sectionType}`);
      return null;
  }
}

// =============================================================================
// SEGMENTED LAYOUT PROPS
// =============================================================================

export interface PreviewSegmentedLayoutProps {
  /** Professional data */
  professional: Partial<Professional>;
  /** Condensed card config - single source of truth */
  condensedCardConfig?: CondensedCardConfig;
  /** Settings for signature work/video sections */
  signatureWorkSettings?: SignatureWorkSettings;
  /** Whether to show promo content */
  showPromo?: boolean;
  /** Promotion details text */
  promotionDetails?: string;
  /** Important info items */
  importantInfo?: string[];
  /** Additional CSS class */
  className?: string;
  /** Force single-column mobile layout on all screen sizes */
  forceMobileLayout?: boolean;
}

// =============================================================================
// SEGMENTED LAYOUT COMPONENT (independent column flow with full-width interrupts)
// =============================================================================

/**
 * PreviewSegmentedLayout - Renders sections with independent column flow
 *
 * This component provides:
 * - Independent column flow: left and right columns stack independently
 * - Full-width sections interrupt the two-column layout
 * - Content continues in two-column layout after full-width sections
 *
 * Layout structure:
 * - Sections are grouped into "segments"
 * - Two-column segments: left and right flow independently
 * - Full-width segments: single section spanning both columns
 */
export function PreviewSegmentedLayout({
  professional,
  condensedCardConfig,
  signatureWorkSettings,
  showPromo = false,
  promotionDetails,
  importantInfo,
  className,
  forceMobileLayout = false,
}: PreviewSegmentedLayoutProps) {
  // READ FROM REDUX - section props for live updates
  // Hooks must be at component level, not in callbacks
  // NOTE: Section type names must match what's created in sectionMapping.ts
  const reduxSections = useAppSelector(selectSections);
  const signatureWorkReduxProps = useAppSelector(selectPropsByInnerSectionType('signature-work'));
  const mapReduxProps = useAppSelector(selectPropsByInnerSectionType('map'));
  const specialtiesReduxProps = useAppSelector(selectPropsByInnerSectionType('specialties'));
  const importantInfoReduxProps = useAppSelector(selectPropsByInnerSectionType('importantInfo'));
  // Bio section uses 'headerAndBio' as innerSectionType (set in sectionMapping.ts)
  const bioReduxProps = useAppSelector(selectPropsByInnerSectionType('headerAndBio'));
  const promosReduxProps = useAppSelector(selectPropsByInnerSectionType('current-promotions'));
  const businessHoursReduxProps = useAppSelector(selectPropsByInnerSectionType('business-hours'));

  // Combine all Redux props into a map for easy lookup
  const reduxPropsMap = useMemo(() => ({
    'signature-work': signatureWorkReduxProps,
    'signature-work-actions': signatureWorkReduxProps,
    'video-display': signatureWorkReduxProps,
    'map': mapReduxProps,
    'map-section': mapReduxProps,
    'mapWithHours': mapReduxProps,
    'specialties': specialtiesReduxProps,
    'specialties-section': specialtiesReduxProps,
    'importantInfo': importantInfoReduxProps,
    'important-info': importantInfoReduxProps,
    'bio-preview': bioReduxProps,
    'bio-simple': bioReduxProps,
    'headerAndBio': bioReduxProps,
    'about-me': bioReduxProps,
    'current-promotions': promosReduxProps,
    'current-promotions-detailed': promosReduxProps,
    'business-hours': businessHoursReduxProps,
  }), [signatureWorkReduxProps, mapReduxProps, specialtiesReduxProps, importantInfoReduxProps, bioReduxProps, promosReduxProps, businessHoursReduxProps]);

  // Get config from prop or from professional object
  // Use Redux sections when available for live updates
  const baseConfig = condensedCardConfig || (professional as any)?.condensedCardConfig;
  const config = useMemo(() => {
    if (reduxSections.length > 0 && baseConfig) {
      return { ...baseConfig, sections: reduxSections };
    }
    return baseConfig;
  }, [baseConfig, reduxSections]);

  // Group sections into segments
  const layoutStructure = useMemo(() => {
    return groupSectionsIntoSegments(config);
  }, [config]);

  // Common props for section rendering
  const renderProps = {
    professional,
    signatureWorkSettings,
    showPromo,
    promotionDetails,
    importantInfo,
    reduxPropsMap,
  };

  if (layoutStructure.segments.length === 0) {
    return null;
  }

  return (
    <div className={`preview-segmented-layout space-y-4 ${className || ''}`}>
      {layoutStructure.segments.map((segment, index) => (
        <div key={`segment-${index}`} className="preview-segment">
          {segment.type === 'full-width' ? (
            // Full-width section spans both columns
            <div className="w-full">
              {renderSection({ section: segment.section, ...renderProps })}
            </div>
          ) : (
            // Two-column segment with independent column flow
            // When forceMobileLayout is true, always use single column
            <div className={`grid grid-cols-1 ${forceMobileLayout ? '' : 'lg:grid-cols-2'} gap-4 items-start`}>
              {/* Left column - sections stack independently */}
              <div className="preview-left-column space-y-4">
                {segment.left.map((section) => (
                  <div key={section.id}>
                    {renderSection({ section, ...renderProps })}
                  </div>
                ))}
              </div>
              {/* Right column - sections stack independently */}
              <div className="preview-right-column space-y-4">
                {segment.right.map((section) => (
                  <div key={section.id}>
                    {renderSection({ section, ...renderProps })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// ROW-BASED LAYOUT (alias for backward compatibility)
// =============================================================================

/**
 * PreviewRowBasedLayout - Alias for PreviewSegmentedLayout
 *
 * @deprecated Use PreviewSegmentedLayout for clearer naming
 */
export function PreviewRowBasedLayout(props: PreviewRowBasedLayoutProps) {
  return <PreviewSegmentedLayout {...props} />;
}

// =============================================================================
// COLUMN-BASED RENDERER (for backward compatibility)
// =============================================================================

/**
 * PreviewColumnRenderer - Renders sections for a single column
 *
 * @deprecated Use PreviewRowBasedLayout for correct row ordering
 */
export default function PreviewColumnRenderer({
  column,
  professional,
  condensedCardConfig,
  sectionsConfig,
  signatureWorkSettings,
  showPromo = false,
  promotionDetails,
  importantInfo,
  className,
}: PreviewColumnRendererProps) {
  // Get config from prop or from professional object
  const config = condensedCardConfig || (professional as any)?.condensedCardConfig;

  // Get visible sections for this column
  const visibleSections = useMemo(() => {
    return getWebsiteSectionsForColumn(config, column);
  }, [config, column]);

  // Common props for section rendering
  const renderProps = {
    professional,
    signatureWorkSettings,
    showPromo,
    promotionDetails,
    importantInfo,
  };

  if (visibleSections.length === 0) {
    return null;
  }

  const columnClass = COLUMN_CLASS_MAP[column];
  const combinedClass = className ? `${columnClass} ${className}` : columnClass;

  return (
    <div className={`${combinedClass} space-y-4`}>
      {visibleSections.map(section => renderSection({ section, ...renderProps }))}
    </div>
  );
}

// =============================================================================
// CONVENIENCE COMPONENTS (backward compatibility)
// =============================================================================

export type PreviewLeftColumnProps = Omit<PreviewColumnRendererProps, 'column'>;
export type PreviewRightColumnProps = Omit<PreviewColumnRendererProps, 'column'>;
export type PreviewFullWidthSectionsProps = Omit<PreviewColumnRendererProps, 'column'>;

/**
 * @deprecated Use PreviewRowBasedLayout instead
 */
export function PreviewLeftColumn(props: PreviewLeftColumnProps) {
  return <PreviewColumnRenderer {...props} column="left" />;
}

/**
 * @deprecated Use PreviewRowBasedLayout instead
 */
export function PreviewRightColumn(props: PreviewRightColumnProps) {
  return <PreviewColumnRenderer {...props} column="right" />;
}

/**
 * @deprecated Use PreviewRowBasedLayout instead
 */
export function PreviewFullWidthSections(props: PreviewFullWidthSectionsProps) {
  return <PreviewColumnRenderer {...props} column="full" />;
}
