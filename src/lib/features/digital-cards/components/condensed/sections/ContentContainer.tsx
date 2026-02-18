"use client";

import { Professional } from "@/lib/pages/for-professionals/types/professional";
import { CondensedCardSectionInstance } from "@/lib/features/digital-cards/types/condensedCardConfig";
import { getSectionById } from "@/lib/features/digital-cards/config/sectionRegistry";
import { selectPropsByInnerSectionType } from '@/lib/features/digital-cards/store';
import {
  getBackgroundStyle,
  buildTypographyStyles,
  processTitle,
  getTailwindFontClass,
  type TitleTypography,
} from './utils/helpers';
import { CONTENT_CONTAINER_DEFAULTS, getSectionProp } from './utils/props';
import { useAppSelector } from "../../../../../../../store/hooks";

// =============================================================================
// TYPES
// =============================================================================

interface ContentContainerProps {
  professional: Professional;
  section?: CondensedCardSectionInstance;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function ContentContainer({ professional, section }: ContentContainerProps) {
  // READ FROM REDUX - direct selector for live updates (for container props)
  const innerSectionType = section?.props?.innerSectionType ?? null;
  const reduxProps = useAppSelector(selectPropsByInnerSectionType(innerSectionType || 'contentContainer'));

  // Merge props with Redux taking highest precedence
  const mergedProps = { ...section?.props, ...reduxProps };

  // Extract props with defaults (now using mergedProps)
  const showCustomTitle = mergedProps?.showCustomTitle ?? false;
  const customTitle = mergedProps?.title ?? '';

  // Default titles for each section type
  const DEFAULT_TITLES: Record<string, string> = {
    'headerAndBio': 'About {name}',
    'bio-preview': 'About {name}',
    'bio-simple': 'About {name}',
    'about-me': 'About Me',
    'specialties': 'Specialties',
    'important-info': 'Important Info',
    'importantInfo': 'Important Info',
    'signature-work': 'Signature Work',
    'signature-work-actions': 'Signature Work',
    'current-promotions': 'Current Promotions',
    'current-promotions-detailed': 'Current Promotions',
    'business-hours': 'Business Hours',
    'map': 'Location',
    'map-section': 'Location',
    'overview-stats': 'Overview',
    'contact': 'Contact',
  };

  // Compute title:
  // - If showCustomTitle is FALSE: use DEFAULT title based on section type
  // - If showCustomTitle is TRUE: use the CUSTOM title entered by user
  let rawTitle: string;
  if (showCustomTitle) {
    // User wants a custom title - use their input
    rawTitle = customTitle;
  } else {
    // Use default title for this section type
    rawTitle = DEFAULT_TITLES[innerSectionType || ''] || '';
  }
  const title = processTitle(rawTitle, professional);
  const titleAlignment = mergedProps?.titleAlignment ?? 'center-with-lines';

  // Support both nested titleTypography object AND flat individual props
  // Flat props (from sectionPropsConfig) take precedence over nested object
  const titleTypography: TitleTypography = {
    ...(mergedProps?.titleTypography ?? {}),
    // Override with flat props if they exist
    ...(mergedProps?.titleFontFamily && { fontFamily: mergedProps.titleFontFamily }),
    ...(mergedProps?.titleFontSize && { fontSize: mergedProps.titleFontSize }),
    ...(mergedProps?.titleFontWeight && { fontWeight: mergedProps.titleFontWeight }),
    ...(mergedProps?.titleColor && { color: mergedProps.titleColor }),
    ...(mergedProps?.titleTextTransform && { textTransform: mergedProps.titleTextTransform }),
    ...(mergedProps?.titleLetterSpacing && { letterSpacing: mergedProps.titleLetterSpacing }),
  };
  const innerSectionProps = mergedProps?.innerSectionProps ?? {};

  // Outer container styling (background behind title)
  const containerBackground = mergedProps?.containerBackground ?? '#ffffff';
  const borderRadius = mergedProps?.borderRadius ?? 12;
  const padding = mergedProps?.padding ?? 16;
  const containerHeight = mergedProps?.containerHeight ?? 0; // 0 = auto
  const fullWidthSection = mergedProps?.fullWidthSection ?? false;

  // Inner section styling (content area background)
  const sectionBackground = mergedProps?.sectionBackground ?? '#ffffff';
  const sectionBorderRadius = mergedProps?.sectionBorderRadius ?? 8;
  const sectionPadding = mergedProps?.sectionPadding ?? 12;
  const sectionMinHeight = mergedProps?.sectionMinHeight ?? 0; // 0 = auto

  // Get inner section component from registry
  const innerRegistryItem = innerSectionType ? getSectionById(innerSectionType) : null;
  const InnerSectionComponent = innerRegistryItem?.component;

  // Outer container style - supports gradients
  // Uses height: 100% to fill parent wrapper when section is resized via drag
  const containerStyle: React.CSSProperties = {
    ...getBackgroundStyle(containerBackground),
    borderRadius: `${borderRadius}px`,
    padding: `${padding}px`,
    height: '100%', // Fill parent wrapper so backgrounds expand when section is resized
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    ...(containerHeight > 0 ? { minHeight: `${containerHeight}px` } : {}),
  };

  // Inner section style - for content area
  // When fullWidthSection is true, the inner section takes full width with no padding
  // Uses flex: 1 to fill available space in the flex container
  const sectionStyle: React.CSSProperties = {
    ...getBackgroundStyle(sectionBackground),
    borderRadius: fullWidthSection ? '0px' : `${sectionBorderRadius}px`,
    padding: fullWidthSection ? '0px' : `${sectionPadding}px`,
    flex: 1, // Fill available space when parent is resized
    ...(sectionMinHeight > 0 ? { minHeight: `${sectionMinHeight}px` } : {}),
  };

  return (
    <div style={containerStyle} className="content-container">
      {/* Title Display (sits on outer container background) */}
      {title && (
        <TitleDisplay
          title={title}
          alignment={titleAlignment}
          typography={titleTypography}
        />
      )}

      {/* Inner Section Container (with its own background) */}
      <div style={sectionStyle} className="content-container-inner">
        {InnerSectionComponent ? (
          <InnerSectionComponent
            professional={professional}
            section={{ ...section, props: innerSectionProps }}
            // Pass gallery for signature-work inner sections
            {...(innerSectionType === 'signature-work' ? { gallery: professional.gallery || [] } : {})}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p className="text-sm">No section selected</p>
            <p className="text-xs mt-1">Select a section type in editor</p>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// TITLE DISPLAY
// =============================================================================

interface TitleDisplayProps {
  title: string;
  alignment: string;
  typography?: TitleTypography;
}

/**
 * Title rendering with 3 alignment styles and typography support
 *
 * NOTE: The decorative lines in "center-with-lines" use min-w-[20px] to prevent
 * 0-width elements that cause html2canvas "createPattern" errors when generating
 * preview images. Without minimum width, the gradient background on a 0-dimension
 * element causes canvas rendering failures.
 */
function TitleDisplay({ title, alignment, typography = {} }: TitleDisplayProps) {
  // Build typography styles from settings
  const typographyStyles = buildTypographyStyles(typography);

  // Get Tailwind font class (if font is a Tailwind class like 'font-sans')
  const fontClassName = getTailwindFontClass(typography.fontFamily);

  // Base styles that apply to all alignments (can be overridden by typography)
  const baseStyles: React.CSSProperties = {
    fontSize: '1.125rem', // text-lg default
    fontWeight: 600, // font-semibold default
    color: '#111827', // text-gray-900 default
    ...typographyStyles, // Override with user typography settings
  };

  if (alignment === 'center-with-lines') {
    return (
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 min-w-[20px] h-px bg-gradient-to-r from-transparent via-gray-300 to-gray-300" />
        <h3 style={baseStyles} className={`whitespace-nowrap px-2 ${fontClassName}`}>
          {title}
        </h3>
        <div className="flex-1 min-w-[20px] h-px bg-gradient-to-l from-transparent via-gray-300 to-gray-300" />
      </div>
    );
  }

  if (alignment === 'center') {
    return (
      <h3 style={{ ...baseStyles, textAlign: 'center' }} className={`mb-4 ${fontClassName}`}>
        {title}
      </h3>
    );
  }

  // Left alignment (default)
  return (
    <h3 style={baseStyles} className={`mb-4 ${fontClassName}`}>
      {title}
    </h3>
  );
}
