'use client';

import { forwardRef, useMemo } from 'react';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';
import type { CondensedCardConfig } from '@/lib/features/digital-cards/types/condensedCardConfig';
import { SECTION_REGISTRY } from '@/lib/features/digital-cards/config/sectionRegistry';
import {
  useCondensedCardView,
  positionToStyle,
  extractVideoForSection,
} from './useCondensedCardView';
import { selectSections } from '@/lib/features/digital-cards/store';
import { useAppSelector } from '../../../../../../store/hooks';

// =============================================================================
// TYPES
// =============================================================================

export interface CondensedCardViewProps {
  professional: Professional;
  cardUrl: string;
  /** Optional configuration for dimensions and section visibility */
  config?: CondensedCardConfig;
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

const CondensedCardView = forwardRef<HTMLDivElement, CondensedCardViewProps>(
  function CondensedCardView({ professional, cardUrl, config: configProp, className = '' }, ref) {
    // READ FROM REDUX - sections as source of truth for live updates
    const reduxSections = useAppSelector(selectSections);

    // Use shared hook for config processing and section sorting
    const { config, cardWidth, cardHeight, sortedSections: hookSortedSections } = useCondensedCardView({
      config: configProp,
    });

    // Use Redux sections when available (for live updates), fallback to hook sections
    const sortedSections = useMemo(() => {
      if (reduxSections.length > 0) {
        // Sort Redux sections by zIndex
        return [...reduxSections].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
      }
      return hookSortedSections;
    }, [reduxSections, hookSortedSections]);

    return (
      <div
        ref={ref}
        className={`${className} relative`}
        style={{
          width: `${cardWidth}px`,
          height: `${cardHeight}px`,
          backgroundColor: config.styles.backgroundColor,
          padding: `0px`,
        }}
      >
        {/* Card Container with absolute positioning for sections */}
        <div className="w-full h-full relative">
          {/* Render all visible sections dynamically with absolute positioning */}
          {sortedSections.filter(s => s.visible).map((section) => {
            const registryItem = SECTION_REGISTRY.find(r => r.id === section.sectionType);
            if (!registryItem) {
              console.warn(`Section type not found in registry: ${section.sectionType}`);
              return null;
            }

            const Component = registryItem.component;

            // Extract video from gallery for video sections (Phase 1 fix)
            const videoForSection = extractVideoForSection(professional, section.sectionType);

            const componentProps = {
              professional,
              section,  // Pass the full section config so components can access section.props
              cardUrl,
              ...registryItem.defaultProps,
              ...section.props,
              // Add gallery and video props for signature-work sections
              ...(section.sectionType === 'signature-work' || section.sectionType === 'video-display' ? {
                gallery: professional.gallery || [],
                video: videoForSection
              } : {}),
            };

            // Position sections relative to FULL card dimensions (not content area)
            // This makes 0%, 0% = actual top-left corner of card
            const positionStyles = positionToStyle(section.position, cardWidth, cardHeight);

            return (
              <div
                key={section.id}
                className="section-content overflow-hidden"
                style={positionStyles}
              >
                <Component {...componentProps} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

export default CondensedCardView;
export { CondensedCardView };
