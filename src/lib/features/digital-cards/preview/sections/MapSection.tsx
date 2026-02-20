import React from 'react';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';
import EmptySectionState from '../components/EmptySectionState';
import { BusinessHours, MemoizedMapSection } from '@/lib/features/digital-cards/components/sections/contact';
import { normalizeLocations } from '@/lib/utils/migrations/locationMigration';
import { useAppSelector } from '../../../../../../store/hooks';

import { selectPropsByInnerSectionType, selectSections } from '@/lib/features/digital-cards/store';
import { getTailwindFontClass, isTailwindFontClass } from '@/lib/features/digital-cards/components/condensed/sections/utils/helpers';

interface MapSectionProps {
  professional: Partial<Professional>;
  sectionId: string;
  /** Section props from condensed card config */
  sectionProps?: Record<string, any>;
}

export default function MapSection({ professional, sectionId, sectionProps = {} }: MapSectionProps) {
  // READ FROM REDUX - direct selector for live updates
  const reduxProps = useAppSelector(selectPropsByInnerSectionType('map'));
  const sections = useAppSelector(selectSections);

  // Find the map section in Redux to get wrapper props (showCustomTitle, title, etc.)
  const mapSection = sections.find((s: { props: { innerSectionType: string; }; sectionType: string; }) =>
    s.props?.innerSectionType === 'map' ||
    s.props?.innerSectionType === 'map-section' ||
    s.sectionType === 'mapAndContentContainer'
  );
  const wrapperProps = mapSection?.props || {};

  const locations = normalizeLocations(professional as Professional);
  const hasLocationData = locations.some(loc =>
    loc.lat !== undefined &&
    loc.lng !== undefined &&
    loc.lat !== 0 &&
    loc.lng !== 0
  );
  const hasBusinessHours = !!(professional.businessHours && professional.businessHours.length > 0);

  // Merge section props with Redux props - Redux takes highest precedence
  const mergedProps = { ...sectionProps, ...reduxProps };

  // Get map settings from merged props with defaults
  const mapHeight = mergedProps.mapHeight ?? 300;
  const showAddressOverlay = mergedProps.showAddressOverlay ?? false;

  // Title logic: showCustomTitle = false → default, showCustomTitle = true → custom
  const showCustomTitle = wrapperProps.showCustomTitle ?? false;
  const customTitle = wrapperProps.title || '';
  const titleAlignment = wrapperProps.titleAlignment ?? 'center-with-lines';
  const displayTitle = showCustomTitle ? customTitle : 'Hours';

  // Typography props from Redux
  const titleFontFamily = wrapperProps.titleFontFamily;
  const titleFontSize = wrapperProps.titleFontSize;
  const titleFontWeight = wrapperProps.titleFontWeight;
  const titleColor = wrapperProps.titleColor;
  const titleTextTransform = wrapperProps.titleTextTransform;
  const titleLetterSpacing = wrapperProps.titleLetterSpacing;

  // Get Tailwind font class (if font is a Tailwind class like 'font-playfair')
  const fontClassName = getTailwindFontClass(titleFontFamily);

  // Build title styles from typography props
  // Only apply fontFamily as inline style if it's NOT a Tailwind class
  const titleStyles: React.CSSProperties = {
    fontSize: titleFontSize || '1rem',
    fontWeight: titleFontWeight || 600,
    color: titleColor || '#111827',
    ...(titleFontFamily && !isTailwindFontClass(titleFontFamily) && { fontFamily: titleFontFamily }),
    ...(titleTextTransform && { textTransform: titleTextTransform }),
    ...(titleLetterSpacing && { letterSpacing: titleLetterSpacing }),
  };

  // Render title based on alignment
  const renderTitle = () => {
    if (!displayTitle) return null;

    if (titleAlignment === 'center-with-lines') {
      return (
        <div className="flex items-center gap-3 mb-3 mt-3">
          <div className="flex-1 min-w-[20px] h-px bg-gradient-to-r from-transparent via-gray-300 to-gray-300" />
          <h3 style={titleStyles} className={`whitespace-nowrap px-2 ${fontClassName}`}>
            {displayTitle}
          </h3>
          <div className="flex-1 min-w-[20px] h-px bg-gradient-to-l from-transparent via-gray-300 to-gray-300" />
        </div>
      );
    }

    if (titleAlignment === 'center') {
      return (
        <h3 style={{ ...titleStyles, textAlign: 'center' }} className={`mb-3 mt-3 ${fontClassName}`}>
          {displayTitle}
        </h3>
      );
    }

    // Left alignment (default)
    return (
      <h3 style={titleStyles} className={`mb-3 mt-3 ${fontClassName}`}>
        {displayTitle}
      </h3>
    );
  };

  return (
    <div
      key={sectionId}
      className="rounded-xl p-4"
      style={{ background: 'linear-gradient(135deg, #ffffff, #c3cfe2)' }}
    >
      {hasLocationData ? (
        <MemoizedMapSection
          professional={professional as Professional}
          height={`${mapHeight}px`}
          showAddressOverlay={showAddressOverlay}
        />
      ) : (
        <EmptySectionState
          message="Add your business location"
          icon="map"
        />
      )}

      {/* Title - show default or custom based on showCustomTitle */}
      {renderTitle()}

      <div className="bg-white rounded-lg p-3">
        {hasBusinessHours ? (
          <BusinessHours
            professional={professional as Professional}
            section={{
              id: 'business-hours',
              sectionType: 'business-hours',
              label: 'Business Hours',
              visible: true,
              position: { x: { value: 0, unit: '%' }, y: { value: 0, unit: '%' }, width: { value: 100, unit: '%' }, height: { value: 100, unit: '%' }, visible: true },
              props: {
                hideTitle: true,
                listFormat: true,
              },
            }}
          />
        ) : (
          <EmptySectionState
            message="Add your business hours"
            icon="list"
          />
        )}
      </div>
    </div>
  );
}
