import React from 'react';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';
import StyledSectionWrapper from '../components/StyledSectionWrapper';
import EmptySectionState from '../components/EmptySectionState';
import { BusinessHours } from '@/lib/features/digital-cards/components/sections/contact';
import { useAppSelector } from '../../../../../../store/hooks';

import { selectPropsByInnerSectionType, selectSections } from '@/lib/features/digital-cards/store';

interface BusinessHoursSectionProps {
  professional: Partial<Professional>;
  sectionId: string;
  sectionProps?: Record<string, any>;
}

export default function BusinessHoursSection({ professional, sectionId, sectionProps = {} }: BusinessHoursSectionProps) {
  // READ FROM REDUX - direct selector for live updates
  const reduxProps = useAppSelector(selectPropsByInnerSectionType('business-hours'));
  const sections = useAppSelector(selectSections);

  // Find the business hours section in Redux to get wrapper props (showCustomTitle, title, etc.)
  const hoursSection = sections.find(s => s.props?.innerSectionType === 'business-hours');
  const wrapperProps = hoursSection?.props || {};

  // Merge props with Redux taking highest precedence
  const mergedProps = { ...sectionProps, ...reduxProps };

  // Title logic: showCustomTitle = false → default, showCustomTitle = true → custom
  const showCustomTitle = wrapperProps.showCustomTitle ?? false;
  const customTitle = wrapperProps.title || '';
  const titleAlignment = wrapperProps.titleAlignment ?? 'center-with-lines';
  const displayTitle = showCustomTitle ? customTitle : 'Business Hours';

  // Typography props from Redux
  const titleFontFamily = wrapperProps.titleFontFamily;
  const titleFontSize = wrapperProps.titleFontSize;
  const titleFontWeight = wrapperProps.titleFontWeight;
  const titleColor = wrapperProps.titleColor;
  const titleTextTransform = wrapperProps.titleTextTransform;
  const titleLetterSpacing = wrapperProps.titleLetterSpacing;

  const hasBusinessHours = !!(professional.businessHours && professional.businessHours.length > 0);

  // Get toggleGroup display settings from merged props (new system)
  const showTitle = mergedProps.showTitle ?? true;
  const showList = mergedProps.showList ?? true;
  const compactMode = mergedProps.compactMode ?? false;

  return (
    <StyledSectionWrapper
      key={sectionId}
      title={displayTitle}
      titleAlignment={titleAlignment}
      titleFontFamily={titleFontFamily}
      titleFontSize={titleFontSize}
      titleFontWeight={titleFontWeight}
      titleColor={titleColor}
      titleTextTransform={titleTextTransform}
      titleLetterSpacing={titleLetterSpacing}
    >
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
              // New toggleGroup props
              showTitle: showTitle,
              showList: showList,
              compactMode: compactMode,
              // Legacy props (for backward compatibility)
              hideTitle: true, // Always hide title since StyledSectionWrapper shows it
            },
          }}
        />
      ) : (
        <EmptySectionState
          message="Add your business hours"
          icon="list"
        />
      )}
    </StyledSectionWrapper>
  );
}
