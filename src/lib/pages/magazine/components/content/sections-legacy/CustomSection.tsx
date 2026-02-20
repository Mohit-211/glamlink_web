"use client";

import React, { useMemo, useCallback } from "react";
import { CustomSectionContent, ContentBlock } from "../../../types";
import { SectionHeader, BackgroundWrapper, SectionStrip } from "../shared";
import { mergeUniversalStyleSettings, getUniversalLayoutPreset } from "../../../config/universalStyles";
import { useMagazineAnalytics } from "@/lib/features/analytics/hooks/useMagazineAnalytics";
import type { LinkType } from "@/lib/features/analytics/types";

// Import all available content components
import * as SharedComponents from "../shared";
import * as CoverProFeatureComponents from "../cover-pro-feature";
import * as MagazineClosingComponents from "../magazine-closing";
import * as MariesCornerComponents from "../maries-corner";
import * as RisingStarComponents from "../rising-star";
import * as TopProductSpotlightComponents from "../top-product-spotlight";
import * as TopTreatmentComponents from "../top-treatment";
import * as WhatsNewGlamlinkComponents from "../whats-new-glamlink";
import * as CoinDropComponents from "../coin-drop";
import * as GlamlinkStoriesComponents from "../glamlink-stories";
import * as SpotlightCityComponents from "../spotlight-city";

// Map of all available components by category
const COMPONENT_MAP = {
  shared: SharedComponents,
  "cover-pro-feature": CoverProFeatureComponents,
  "magazine-closing": MagazineClosingComponents,
  "maries-corner": MariesCornerComponents,
  "rising-star": RisingStarComponents,
  "top-product-spotlight": TopProductSpotlightComponents,
  "top-treatment": TopTreatmentComponents,
  "whats-new-glamlink": WhatsNewGlamlinkComponents,
  "coin-drop": CoinDropComponents,
  "glamlink-stories": GlamlinkStoriesComponents,
  "spotlight-city": SpotlightCityComponents,
};

interface CustomSectionProps {
  content: CustomSectionContent;
  title?: string;
  subtitle?: string;
  subtitle2?: string;
  backgroundColor?: string;
  issueId?: string;
  pageId?: number;
}


export default function CustomSection({ content, title, subtitle, subtitle2, backgroundColor, issueId, pageId }: CustomSectionProps) {
  // Get the actual section title (from content or props)
  const sectionTitle = content.sectionTitle || title || 'Custom Section';

  // CustomSection rendered with content
  console.log('🔍 CustomSection Debug:', {
    title,
    sectionTitle,
    subtitle,
    subtitle2,
    contentSectionTitle: content.sectionTitle,
    contentSectionSubtitle: content.sectionSubtitle,
    contentSectionDescription: content.sectionDescription,
    'content.subtitle2': (content as any).subtitle2,
    contentKeys: Object.keys(content),
    hasContentBlocks: !!content.contentBlocks,
    backgroundColor,
    issueId,
    pageId
  });

  // Analytics tracking for shared components
  const { trackEnhancedCTAClick, trackLinkClick, trackVideoPlay } = useMagazineAnalytics({
    issueId: issueId || '',
    trackViewOnMount: false,
  });

  // Analytics callback handlers - pass actual pageId and sectionTitle
  const handleCtaClick = useCallback((label: string, variant: 'primary' | 'secondary' = 'primary') => {
    console.log('[CustomSection] handleCtaClick called:', { label, variant, issueId, pageId, sectionTitle });
    if (issueId) {
      trackEnhancedCTAClick(label, variant, 'custom-section', 'custom', pageId, sectionTitle);
    }
  }, [issueId, pageId, sectionTitle, trackEnhancedCTAClick]);

  const handleLinkClick = useCallback((linkType: string, url: string) => {
    console.log('[CustomSection] handleLinkClick called:', { linkType, url, issueId, pageId, sectionTitle });
    if (issueId) {
      const normalizedType = linkType.toLowerCase() as LinkType;
      trackLinkClick(normalizedType, url, 'custom-section', 'custom', pageId, sectionTitle);
    }
  }, [issueId, pageId, sectionTitle, trackLinkClick]);

  const handleVideoPlay = useCallback((source?: 'youtube' | 'upload') => {
    console.log('[CustomSection] handleVideoPlay called:', { source, issueId, pageId, sectionTitle });
    if (issueId) {
      trackVideoPlay(source || 'upload', 'custom-section', 'custom', pageId, sectionTitle);
    }
  }, [issueId, pageId, sectionTitle, trackVideoPlay]);

  // Helper function to inject analytics callbacks based on component type
  const getAnalyticsProps = useCallback((blockType: string): Record<string, unknown> => {
    const analyticsProps: Record<string, unknown> = {};

    // Components that support CTA click tracking
    if (blockType === 'CallToAction') {
      console.log('[CustomSection] Injecting onCtaClick for CallToAction, issueId:', issueId);
      analyticsProps.onCtaClick = (label: string) => {
        console.log('[CustomSection] CTA clicked:', label, 'issueId:', issueId);
        handleCtaClick(label, 'primary');
      };
    }
    if (blockType === 'CTAStat') {
      analyticsProps.onCtaClick = handleCtaClick;
    }

    // Components that support link click tracking
    if (blockType === 'SocialLinks' || blockType === 'EmbeddableBusinessCard') {
      analyticsProps.onLinkClick = handleLinkClick;
    }

    // Components that support video play tracking
    if (blockType === 'VideoEmbed' || blockType === 'MediaItem' || blockType === 'BusinessProfile' || blockType === 'EmbeddableBusinessCard') {
      analyticsProps.onVideoPlay = () => handleVideoPlay();
    }

    return analyticsProps;
  }, [handleCtaClick, handleLinkClick, handleVideoPlay, issueId]);

  // Get merged style settings for typography
  const baseStyles = mergeUniversalStyleSettings(
    content as any,
    getUniversalLayoutPreset(content.headerLayout || 'default')
  );

  // Extract typography settings from nested objects (editor saves as *Typography objects)
  // The editor saves as titleTypography/subtitleTypography (field name + "Typography")
  // Also check legacy sectionTitleTypography/sectionSubtitleTypography for backward compat
  const titleTypo = content.titleTypography || content.sectionTitleTypography || {};
  const subtitleTypo = content.subtitleTypography || content.sectionSubtitleTypography || {};

  // Custom section defaults matching the editor preview (font-sans for both)
  const customSectionDefaults = {
    titleFontFamily: 'font-sans',
    subtitleFontFamily: 'font-sans',
  };

  const styles = {
    ...baseStyles,
    // Title typography overrides (prefer typography settings, then explicit content props, then custom section defaults)
    titleFontSize: titleTypo.fontSize || baseStyles.titleFontSize,
    titleFontFamily: titleTypo.fontFamily || content.titleFontFamily || customSectionDefaults.titleFontFamily,
    titleFontWeight: titleTypo.fontWeight || baseStyles.titleFontWeight,
    titleAlignment: titleTypo.alignment || baseStyles.titleAlignment,
    titleColor: titleTypo.color || baseStyles.titleColor,
    // Subtitle typography overrides
    subtitleFontSize: subtitleTypo.fontSize || baseStyles.subtitleFontSize,
    subtitleFontFamily: subtitleTypo.fontFamily || content.subtitleFontFamily || customSectionDefaults.subtitleFontFamily,
    subtitleFontWeight: subtitleTypo.fontWeight || baseStyles.subtitleFontWeight,
    subtitleAlignment: subtitleTypo.alignment || baseStyles.subtitleAlignment,
    subtitleColor: subtitleTypo.color || baseStyles.subtitleColor,
  };

  // Function to get display classes based on displayMode and floatBreakpoint
  const getDisplayClasses = (block: ContentBlock) => {
    const displayMode = block.displayMode || "always";
    const floatBreakpoint = content.floatBreakpoint || "md";

    // If display mode is always, no classes needed
    if (displayMode === "always") {
      return "";
    }

    let breakpointClass = "";
    switch (floatBreakpoint) {
      case "always":
        return displayMode === "above-breakpoint" ? "" : "hidden";
      case "xs":
        breakpointClass = "xs";
        break;
      case "sm":
        breakpointClass = "sm";
        break;
      case "md":
        breakpointClass = "md";
        break;
      case "lg":
        breakpointClass = "lg";
        break;
      case "xl":
        breakpointClass = "xl";
        break;
      case "never":
        return displayMode === "below-breakpoint" ? "" : "hidden";
      default:
        breakpointClass = "md";
    }

    if (displayMode === "above-breakpoint") {
      // Show above breakpoint (hide below)
      return `hide-below-${breakpointClass}`;
    } else if (displayMode === "below-breakpoint") {
      // Show below breakpoint (hide above)
      return `hide-above-${breakpointClass}`;
    }

    return "";
  };

  // Sort and filter enabled content blocks
  const sortedBlocks = useMemo(() => {
    return (content.contentBlocks || [])
      .filter((block: ContentBlock) => block.enabled)
      .sort((a: ContentBlock, b: ContentBlock) => a.order - b.order);
  }, [content.contentBlocks]);

  // Helper function to get responsive classes for float breakpoints
  const getFloatResponsiveClasses = (breakpoint: string) => {
    switch (breakpoint) {
      case 'always':
        return ''; // Float on all screens
      case 'xs':
        return 'max-xs:float-none max-xs:w-full max-xs:mx-0 max-xs:mb-4'; // No float below xs, float above xs
      case 'sm':
        return ''; // Float on all screens (small and up)
      case 'md':
        return 'max-md:float-none max-md:w-full max-md:mx-0 max-md:mb-4'; // No float below md, float above md
      case 'lg':
        return 'max-lg:float-none max-lg:w-full max-lg:mx-0 max-lg:mb-4'; // No float below lg, float above lg
      case 'xl':
        return 'max-xl:float-none max-xl:w-full max-xl:mx-0 max-xl:mb-4'; // No float below xl, float above xl
      case 'never':
        return 'float-none w-full mx-0 mb-4'; // Never float
      default:
        return 'max-md:float-none max-md:w-full max-md:mx-0 max-md:mb-4'; // Default: float above md
    }
  };

  // Function to render a content block with grid control
  const renderContentBlock = (block: typeof sortedBlocks[0], skipWrapper: boolean = false): React.ReactElement | null => {
    // This condition is no longer needed - floats are handled by responsive classes
    // Type guard to ensure skipWrapper is actually a boolean
    if (typeof skipWrapper !== 'boolean') {
      console.error('⚠️ renderContentBlock received non-boolean skipWrapper:', skipWrapper);
      skipWrapper = false;
    }
    // renderContentBlock called
    
    try {
      // Get the component from the map
      const categoryComponents = COMPONENT_MAP[block.category as keyof typeof COMPONENT_MAP];
      if (!categoryComponents) {
        console.warn(`Category not found: ${block.category} - skipping block`);
        return <div className="text-gray-500 text-sm p-4 border border-gray-300 rounded">
          Unsupported block category: {block.category}
        </div>;
      }

      const Component = categoryComponents[block.type as keyof typeof categoryComponents] as React.ComponentType<any>;
      if (!Component) {
        console.warn(`Component not found: ${block.type} in category ${block.category}`);
        return null;
      }

      // Found component

      // Render the component with its props and grid classes
      // skipWrapper check
      
      if (skipWrapper) {
        // Get display classes for conditional visibility
        const displayClasses = getDisplayClasses(block);
        // Get analytics props for trackable components
        const analyticsProps = getAnalyticsProps(block.type);
        // Skipping wrapper but applying display classes
        return (
          <div key={block.id} className={displayClasses}>
            <Component {...block.props} {...analyticsProps} />
          </div>
        );
      }
      
      // Get grid classes and styles
      const gridInfo = getBlockGridClasses(block);
      // Grid info for block

      // Get analytics props for trackable components
      const analyticsProps = getAnalyticsProps(block.type);

      // Wrap with BackgroundWrapper and apply border styles
      const content = <Component {...block.props} {...analyticsProps} />;
      // Component rendered
      
      // Build styles for background div (includes border and border-radius)
      const backgroundStyles: React.CSSProperties = {};
      if (block.borderWidth && block.borderWidth > 0) {
        backgroundStyles.borderWidth = `${block.borderWidth}px`;
        backgroundStyles.borderStyle = 'solid';
        backgroundStyles.borderColor = block.borderColor || '#e5e7eb';
      }
      if (block.borderRadius && block.borderRadius > 0) {
        backgroundStyles.borderRadius = `${block.borderRadius}px`;
        backgroundStyles.overflow = 'hidden';
      }
      
      // No need for explicit height when items-start is on the grid container
      
      // Build styles for inner container (padding only)
      const innerStyles: React.CSSProperties = {};
      if (block.padding && block.padding > 0) {
        innerStyles.padding = `${block.padding}px`;
      }
      
      const hasBackgroundStyles = Object.keys(backgroundStyles).length > 0;
      const hasInnerStyles = Object.keys(innerStyles).length > 0;
      const hasBackground = block.backgroundColor && block.backgroundColor !== "transparent";
      
      // Check if backgroundColor is a hex color, gradient, or Tailwind class
      const isHexColor = block.backgroundColor?.startsWith('#');
      const isGradient = block.backgroundColor?.startsWith('linear-gradient') || block.backgroundColor?.startsWith('radial-gradient');
      
      // Only use as className if it's a Tailwind class (not hex or gradient)
      const backgroundClass = !isHexColor && !isGradient && block.backgroundColor && block.backgroundColor !== "transparent" ? block.backgroundColor : '';
      
      // Apply hex colors and gradients as inline styles
      const backgroundStyle: React.CSSProperties = {};
      if (isHexColor) {
        backgroundStyle.backgroundColor = block.backgroundColor;
      } else if (isGradient) {
        backgroundStyle.background = block.backgroundColor;
      }
      
      // Applying wrapper styles

      // Get display classes for conditional visibility
      const displayClasses = getDisplayClasses(block);

      // Check if we need full-width background
      const isFullWidth = block.backgroundWidth === 'full';

      // Always wrap content to ensure consistent structure and allow background updates
      // Structure: outer div with background/border/radius -> inner div with padding -> content
      if (isFullWidth && (hasBackground || Object.keys(backgroundStyles).length > 0)) {
        // Full-width background: Apply negative margins to extend beyond container padding
        return (
          <div
            key={block.id}
            className={`custom-section-block ${gridInfo.className} ${displayClasses} -mx-6 md:-mx-8`}
            style={gridInfo.style}
          >
            <div className={backgroundClass} style={{ ...backgroundStyle, ...backgroundStyles }}>
              <div className="px-6 md:px-8">
                {hasInnerStyles ? (
                  <div style={innerStyles}>
                    {content}
                  </div>
                ) : (
                  content
                )}
              </div>
            </div>
          </div>
        );
      }

      // Regular content-width background
      return (
        <div
          key={block.id}
          className={`custom-section-block ${gridInfo.className} ${displayClasses}`}
          style={gridInfo.style}
        >
          <div className={backgroundClass} style={{ ...backgroundStyle, ...backgroundStyles }}>
            {hasInnerStyles ? (
              <div style={innerStyles}>
                {content}
              </div>
            ) : (
              content
            )}
          </div>
        </div>
      );
    } catch (error) {
      console.error(`Error rendering block ${block.id}:`, error);
      return null;
    }
  };

  // Determine grid classes based on layout
  const getLayoutClasses = () => {
    const flowClass = content.gridFlow === "dense" ? "grid-flow-dense" : "";
    
    switch (content.layout) {
      case "two-column":
        return `grid grid-cols-1 lg:grid-cols-2 gap-6 items-start ${flowClass}`;
      case "grid":
        return `grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 items-start ${flowClass}`;
      case "masonry":
        // Use CSS columns for masonry layout - single column on mobile/tablet
        const columns = content.masonryColumns || "2";
        return columns === "3" 
          ? "columns-1 lg:columns-2 xl:columns-3 gap-x-6" 
          : "columns-1 lg:columns-2 gap-x-6";
      case "flex-columns":
        // Container is handled differently for flex-columns
        return "";
      case "float-columns":
        // Float layout - container with overflow clearing
        return "custom-section-float-container";
      case "single-column":
      default:
        return "space-y-6";
    }
  };

  // Get grid classes and styles for individual blocks
  const getBlockGridClasses = (block: typeof sortedBlocks[0]) => {
    // For masonry layout, apply special classes
    if (content.layout === "masonry") {
      return { 
        className: "break-inside-avoid mb-6", 
        style: {} 
      };
    }
    
    // For flex-columns layout, no special classes needed (handled by container)
    if (content.layout === "flex-columns") {
      return { className: "", style: {} };
    }

    // For float-columns layout, apply float-specific styles
    if (content.layout === "float-columns") {
      const styles: React.CSSProperties = {};
      const classes = [];

      // Get responsive classes based on breakpoint
      const responsiveClasses = getFloatResponsiveClasses(content.floatBreakpoint || "sm");
      classes.push(responsiveClasses);

      // Add float direction and styling
      if (block.floatDirection && block.floatDirection !== "none") {
        // Apply the actual float property as inline style
        styles.float = block.floatDirection;

        // Also add CSS class for consistency
        classes.push(`float-${block.floatDirection}`);

        // Apply float width if specified (keep width as inline style since it's dynamic)
        if (block.floatWidth) {
          styles.width = block.floatWidth;
          styles.flexShrink = "0"; // Prevent shrinking
          styles.boxSizing = "border-box"; // Include padding in width
        } else {
          // Default width for floated elements
          styles.width = "250px";
          styles.flexShrink = "0";
          styles.boxSizing = "border-box";
        }

        // Add margins for floated elements
        if (block.floatDirection === "right") {
          styles.margin = "0 0 1rem 1rem";
        } else if (block.floatDirection === "left") {
          styles.margin = "0 1rem 1rem 0";
        }

      } else {
        // Non-floated content in float layout or floats disabled
        styles.marginBottom = "1rem";
        styles.background = "transparent";
      }

      // Clear float if specified
      if (block.clearFloat) {
        styles.clear = "both";
      }

      return { className: `custom-section-block-float ${classes.join(' ')}`, style: styles };
    }

    // Only apply grid classes for multi-column layouts
    if (content.layout !== "two-column" && content.layout !== "grid") {
      return { className: "", style: {} };
    }

    const classes = [];
    const styles: React.CSSProperties = {};

    // Column span classes
    if (block.gridSpan === "full") {
      classes.push("col-span-full");
    } else if (block.gridSpan === "2") {
      classes.push("md:col-span-2");
    } else if (block.gridSpan === "3" && content.layout === "grid") {
      classes.push("lg:col-span-3");
    } else {
      // Default to span 1
      classes.push("col-span-1");
    }

    // Row span classes
    if (block.gridRowSpan === "2") {
      classes.push("row-span-2");
    } else if (block.gridRowSpan === "3") {
      classes.push("row-span-3");
    } else if (block.gridRowSpan !== "auto") {
      // Default to span 1 if not auto
      classes.push("row-span-1");
    }

    // Column start classes - apply to both mobile and desktop for consistent positioning
    if (block.gridColumn === "1") {
      classes.push("col-start-1 md:col-start-1");
    } else if (block.gridColumn === "2") {
      classes.push("col-start-2 md:col-start-2");
    } else if (block.gridColumn === "3" && content.layout === "grid") {
      classes.push("col-start-3 lg:col-start-3");
    }

    // Force new row
    if (block.forceNewRow) {
      classes.push("col-start-1");
    }

    // Align self (vertical alignment in grid cell)
    if (block.alignSelf) {
      styles.alignSelf = block.alignSelf;
    }

    return { className: classes.join(" "), style: styles };
  };

  // Determine spacing classes
  const getSpacingClasses = () => {
    switch (content.spacing) {
      case "compact":
        return "py-4 px-4";
      case "spacious":
        return "py-12 px-8";
      case "normal":
      default:
        return "py-8 px-6";
    }
  };

  // Check if section strip should be rendered as a corner overlay
  const isCornerStrip = content.sectionStrip?.enabled &&
    ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center'].includes(content.sectionStrip?.position || '');

  // Check if section strip should be inserted inside content blocks
  const isInsideContentStrip = content.sectionStrip?.enabled && content.sectionStrip?.position === 'inside-content';
  const insideBlockIndex = content.sectionStrip?.insideBlockIndex ?? 0;

  return (
    <BackgroundWrapper
      backgroundColor={content.sectionBackground || backgroundColor}
      className={`custom-section ${getSpacingClasses()} ${isCornerStrip ? 'relative' : ''}`}
      style={content.layout === "float-columns" ? {
        overflow: "hidden" // clears the float
      } : {}}
    >
      {/* Section Strip - Corner positions (absolute overlay) */}
      {isCornerStrip && <SectionStrip config={content.sectionStrip} />}

      <div className="max-w-6xl mx-auto">
        {/* Section Header with optional inline component */}
        {(() => {
          const shouldShowHeader = content.sectionTitle || content.sectionSubtitle || content.sectionDescription || title || subtitle || subtitle2;
          console.log('📊 Header visibility check:', {
            shouldShowHeader,
            'content.sectionTitle': content.sectionTitle,
            'content.sectionSubtitle': content.sectionSubtitle,
            'content.sectionDescription': content.sectionDescription,
            title,
            subtitle,
            subtitle2
          });
          return shouldShowHeader;
        })() && (
          <div className="mb-8">
            {content.headerLayout === "inline-right" || content.headerLayout === "inline-left" ? (
              <div className={`flex flex-col ${content.headerLayout === "inline-right" ? "lg:flex-row" : "lg:flex-row-reverse"} lg:justify-between items-center lg:items-start gap-4`}>
                <div className="flex-1 w-full lg:w-auto">
                  <SectionHeader
                    title={(() => {
                      const finalTitle = content.sectionTitle || title;
                      console.log('🏷️ SectionHeader (inline) title:', finalTitle);
                      return finalTitle;
                    })()}
                    subtitle={(() => {
                      const finalSubtitle = content.sectionSubtitle || subtitle;
                      console.log('🏷️ SectionHeader (inline) subtitle:', finalSubtitle);
                      return finalSubtitle;
                    })()}
                    subtitle2={(() => {
                      const finalSubtitle2 = content.sectionDescription || (content as any).subtitle2 || subtitle2;
                      console.log('🏷️ SectionHeader (inline) subtitle2:', finalSubtitle2, '(from content.sectionDescription:', content.sectionDescription, ', content.subtitle2:', (content as any).subtitle2, 'or subtitle2 prop:', subtitle2, ')');
                      return finalSubtitle2;
                    })()}
                    titleStyles={{
                      fontSize: styles.titleFontSize,
                      fontFamily: styles.titleFontFamily,
                      fontWeight: styles.titleFontWeight,
                      alignment: styles.titleAlignment,
                      color: styles.titleColor
                    }}
                    subtitleStyles={{
                      fontSize: styles.subtitleFontSize,
                      fontFamily: styles.subtitleFontFamily,
                      fontWeight: styles.subtitleFontWeight,
                      alignment: styles.subtitleAlignment,
                      color: styles.subtitleColor
                    }}
                    subtitle2Styles={{
                      fontSize: styles.subtitle2FontSize,
                      fontFamily: styles.subtitle2FontFamily,
                      fontWeight: styles.subtitle2FontWeight,
                      alignment: styles.subtitle2Alignment,
                      color: styles.subtitle2Color
                    }}
                  />
                </div>
                {content.headerInlineComponent && (
                  <div className="w-full lg:w-auto lg:flex-shrink-0 flex justify-center lg:justify-start">
                    {renderContentBlock(content.headerInlineComponent, true)}
                  </div>
                )}
              </div>
            ) : (
              <SectionHeader
                title={(() => {
                  const finalTitle = content.sectionTitle || title;
                  console.log('🏷️ SectionHeader (default) title:', finalTitle);
                  return finalTitle;
                })()}
                subtitle={(() => {
                  const finalSubtitle = content.sectionSubtitle || subtitle;
                  console.log('🏷️ SectionHeader (default) subtitle:', finalSubtitle);
                  return finalSubtitle;
                })()}
                subtitle2={(() => {
                  const finalSubtitle2 = content.sectionDescription || (content as any).subtitle2 || subtitle2;
                  console.log('🏷️ SectionHeader (default) subtitle2:', finalSubtitle2, '(from content.sectionDescription:', content.sectionDescription, ', content.subtitle2:', (content as any).subtitle2, 'or subtitle2 prop:', subtitle2, ')');
                  return finalSubtitle2;
                })()}
                titleStyles={{
                  fontSize: styles.titleFontSize,
                  fontFamily: styles.titleFontFamily,
                  fontWeight: styles.titleFontWeight,
                  alignment: styles.titleAlignment,
                  color: styles.titleColor
                }}
                subtitleStyles={{
                  fontSize: styles.subtitleFontSize,
                  fontFamily: styles.subtitleFontFamily,
                  fontWeight: styles.subtitleFontWeight,
                  alignment: styles.subtitleAlignment,
                  color: styles.subtitleColor
                }}
                subtitle2Styles={{
                  fontSize: styles.subtitle2FontSize,
                  fontFamily: styles.subtitle2FontFamily,
                  fontWeight: styles.subtitle2FontWeight,
                  alignment: styles.subtitle2Alignment,
                  color: styles.subtitle2Color
                }}
              />
            )}
          </div>
        )}

        {/* Content Blocks (with optional inside-content strip) */}
        {sortedBlocks.length > 0 ? (
          content.layout === "flex-columns" ? (
            // Flex columns layout with explicit column assignment
            (() => {
              // Calculate column styles based on specified widths (only for desktop)
              const getColumnStyle = (columnNumber: number) => {
                let width = 0;
                if (columnNumber === 1) width = content.column1Width || 0;
                else if (columnNumber === 2) width = content.column2Width || 0;
                else if (columnNumber === 3) width = content.column3Width || 0;
                
                // If no widths are specified at all, use equal flex
                if (!content.column1Width && !content.column2Width && !content.column3Width) {
                  return { flex: 1 };
                }
                
                // If width is 0 or not set for this column, hide it
                if (!width || width === 0) {
                  return { display: 'none' };
                }
                
                // Use flexBasis with percentage for specified widths
                return { 
                  flexBasis: `${width}%`,
                  maxWidth: `${width}%`,
                  minWidth: 0 // Allow shrinking on small screens
                };
              };
              
              // Check if column has content
              const column1HasContent = sortedBlocks.some(block => !block.columnAssignment || block.columnAssignment === "1");
              const column2HasContent = sortedBlocks.some(block => block.columnAssignment === "2");
              const column3HasContent = sortedBlocks.some(block => block.columnAssignment === "3");
              
              return (
                <>
                  {/* Mobile/Tablet Layout - Single Column */}
                  <div className="flex flex-col gap-6 lg:hidden">
                    {sortedBlocks
                      .sort((a, b) => a.order - b.order)
                      .map((block, idx) => (
                        <React.Fragment key={block.id || `mobile-${idx}`}>
                          {/* Render strip before this block if position matches */}
                          {isInsideContentStrip && idx === insideBlockIndex && (
                            <div className="my-4">
                              <SectionStrip config={content.sectionStrip} renderAsInline />
                            </div>
                          )}
                          {renderContentBlock(block)}
                          {/* If this is the last block and insideBlockIndex is beyond all blocks, render strip at end */}
                          {isInsideContentStrip && idx === sortedBlocks.length - 1 && insideBlockIndex >= sortedBlocks.length && (
                            <div className="my-4">
                              <SectionStrip config={content.sectionStrip} renderAsInline />
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                  </div>
                  
                  {/* Desktop Layout - Multi Column with specified widths */}
                  <div className="hidden lg:flex lg:flex-row gap-6 items-start">
                    {/* Column 1 */}
                    {column1HasContent && (
                      <div className="space-y-6" style={getColumnStyle(1)}>
                        {sortedBlocks
                          .filter(block => !block.columnAssignment || block.columnAssignment === "1")
                          .map((block, idx) => (
                            <React.Fragment key={block.id || `col1-${idx}`}>
                              {renderContentBlock(block)}
                            </React.Fragment>
                          ))}
                      </div>
                    )}
                    {/* Column 2 */}
                    {column2HasContent && (
                      <div className="space-y-6" style={getColumnStyle(2)}>
                        {sortedBlocks
                          .filter(block => block.columnAssignment === "2")
                          .map((block, idx) => (
                            <React.Fragment key={block.id || `col2-${idx}`}>
                              {renderContentBlock(block)}
                            </React.Fragment>
                          ))}
                      </div>
                    )}
                    {/* Column 3 */}
                    {column3HasContent && (
                      <div className="space-y-6" style={getColumnStyle(3)}>
                        {sortedBlocks
                          .filter(block => block.columnAssignment === "3")
                          .map((block, idx) => (
                            <React.Fragment key={block.id || `col3-${idx}`}>
                              {renderContentBlock(block)}
                            </React.Fragment>
                          ))}
                      </div>
                    )}
                  </div>
                </>
              );
            })()
          ) : (
            <div className={getLayoutClasses()}>
              {sortedBlocks.map((block, idx) => (
                <React.Fragment key={block.id || `block-${idx}`}>
                  {/* Render strip before this block if position matches */}
                  {isInsideContentStrip && idx === insideBlockIndex && (
                    <div className="my-4">
                      <SectionStrip config={content.sectionStrip} renderAsInline />
                    </div>
                  )}
                  {renderContentBlock(block)}
                  {/* If this is the last block and insideBlockIndex is beyond all blocks, render strip at end */}
                  {isInsideContentStrip && idx === sortedBlocks.length - 1 && insideBlockIndex >= sortedBlocks.length && (
                    <div className="my-4">
                      <SectionStrip config={content.sectionStrip} renderAsInline />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">No content blocks added yet</p>
            <p className="text-sm">Use the editor to add and configure content blocks for this section</p>
          </div>
        )}

        {/* Section Strip - After content position */}
        {content.sectionStrip?.enabled && content.sectionStrip?.position === 'after-content' && (
          <div className="mt-6">
            <SectionStrip config={content.sectionStrip} renderAsInline />
          </div>
        )}

        {/* Optional border */}
        {content.sectionBorder && (
          <div className="mt-8 border-t border-gray-200"></div>
        )}
      </div>
    </BackgroundWrapper>
  );
}