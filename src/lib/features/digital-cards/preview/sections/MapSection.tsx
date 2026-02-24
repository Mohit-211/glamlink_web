import React from 'react';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';
import EmptySectionState from '../components/EmptySectionState';
import { BusinessHours, MemoizedMapSection } from '@/lib/features/digital-cards/components/sections/contact';
import { normalizeLocations } from '@/lib/utils/migrations/locationMigration';
import { useAppSelector } from '../../../../../../store/hooks';

import {
  selectPropsByInnerSectionType,
  selectSections,
} from '@/lib/features/digital-cards/store';

import {
  getTailwindFontClass,
  isTailwindFontClass,
} from '@/lib/features/digital-cards/components/condensed/sections/utils/helpers';

interface MapSectionProps {
  professional: Partial<Professional>;
  sectionId: string;
  sectionProps?: Record<string, any>;
}

export default function MapSection({
  professional,
  sectionId,
  sectionProps = {},
}: MapSectionProps) {
  // ✅ Read live props from Redux
  const reduxProps = useAppSelector(selectPropsByInnerSectionType('map'));
  const sections = useAppSelector(selectSections);

  // ✅ Find map section (NO manual typing needed)
  const mapSection = sections.find(
    (s) =>
      s.props?.innerSectionType === 'map' ||
      s.props?.innerSectionType === 'map-section' ||
      s.sectionType === 'mapAndContentContainer'
  );

  const wrapperProps = mapSection?.props ?? {};

  const locations = normalizeLocations(professional as Professional);

  const hasLocationData = locations.some(
    (loc) =>
      loc.lat !== undefined &&
      loc.lng !== undefined &&
      loc.lat !== 0 &&
      loc.lng !== 0
  );

  const hasBusinessHours =
    !!professional.businessHours?.length;

  // ✅ Merge props (Redux takes highest precedence)
  const mergedProps = { ...sectionProps, ...reduxProps };

  const mapHeight = mergedProps.mapHeight ?? 300;
  const showAddressOverlay = mergedProps.showAddressOverlay ?? false;

  // ✅ Title logic
  const showCustomTitle = wrapperProps.showCustomTitle ?? false;
  const customTitle = wrapperProps.title ?? '';
  const titleAlignment =
    wrapperProps.titleAlignment ?? 'center-with-lines';

  const displayTitle = showCustomTitle
    ? customTitle
    : 'Hours';

  // ✅ Typography
  const titleFontFamily = wrapperProps.titleFontFamily;
  const titleFontSize = wrapperProps.titleFontSize;
  const titleFontWeight = wrapperProps.titleFontWeight;
  const titleColor = wrapperProps.titleColor;
  const titleTextTransform = wrapperProps.titleTextTransform;
  const titleLetterSpacing = wrapperProps.titleLetterSpacing;

  const fontClassName = getTailwindFontClass(titleFontFamily);

  const titleStyles: React.CSSProperties = {
    fontSize: titleFontSize || '1rem',
    fontWeight: titleFontWeight || 600,
    color: titleColor || '#111827',
    ...(titleFontFamily &&
      !isTailwindFontClass(titleFontFamily) && {
        fontFamily: titleFontFamily,
      }),
    ...(titleTextTransform && {
      textTransform: titleTextTransform,
    }),
    ...(titleLetterSpacing && {
      letterSpacing: titleLetterSpacing,
    }),
  };

  const renderTitle = () => {
    if (!displayTitle) return null;

    if (titleAlignment === 'center-with-lines') {
      return (
        <div className="flex items-center gap-3 mb-3 mt-3">
          <div className="flex-1 min-w-[20px] h-px bg-gradient-to-r from-transparent via-gray-300 to-gray-300" />
          <h3
            style={titleStyles}
            className={`whitespace-nowrap px-2 ${fontClassName}`}
          >
            {displayTitle}
          </h3>
          <div className="flex-1 min-w-[20px] h-px bg-gradient-to-l from-transparent via-gray-300 to-gray-300" />
        </div>
      );
    }

    if (titleAlignment === 'center') {
      return (
        <h3
          style={{ ...titleStyles, textAlign: 'center' }}
          className={`mb-3 mt-3 ${fontClassName}`}
        >
          {displayTitle}
        </h3>
      );
    }

    return (
      <h3
        style={titleStyles}
        className={`mb-3 mt-3 ${fontClassName}`}
      >
        {displayTitle}
      </h3>
    );
  };

  return (
    <div
      key={sectionId}
      className="rounded-xl p-4"
      style={{
        background:
          'linear-gradient(135deg, #ffffff, #c3cfe2)',
      }}
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
              position: {
                x: { value: 0, unit: '%' },
                y: { value: 0, unit: '%' },
                width: { value: 100, unit: '%' },
                height: { value: 100, unit: '%' },
                visible: true,
              },
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