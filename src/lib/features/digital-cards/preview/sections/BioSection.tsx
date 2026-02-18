import React from 'react';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';
import StyledSectionWrapper from '../components/StyledSectionWrapper';
import EmptySectionState from '../components/EmptySectionState';
import HeaderAndBio from '@/lib/features/digital-cards/components/condensed/sections/HeaderAndBio';
import { selectPropsByInnerSectionType, selectSections } from '@/lib/features/digital-cards/store';
import { useAppSelector } from '../../../../../../store/hooks';

interface BioSectionProps {
  professional: Partial<Professional>;
  sectionId: string;
}

export default function BioSection({ professional, sectionId }: BioSectionProps) {
  // READ FROM REDUX - direct selector for live updates
  // Uses 'headerAndBio' to match innerSectionType set in sectionMapping.ts
  const reduxProps = useAppSelector(selectPropsByInnerSectionType('headerAndBio'));
  const sections = useAppSelector(selectSections);

  // Find the bio section in Redux to get its wrapper props (showCustomTitle, title, etc.)
  // Look for sections with innerSectionType of 'headerAndBio' or 'bio-preview'
  const bioSection = sections.find((s: { props: { innerSectionType: string; }; }) =>
    s.props?.innerSectionType === 'headerAndBio' ||
    s.props?.innerSectionType === 'bio-preview'
  );
  const sectionProps = bioSection?.props || {};

  // Title logic:
  // - If showCustomTitle is FALSE: use DEFAULT title ("About {name}")
  // - If showCustomTitle is TRUE: use the CUSTOM title entered by user
  const showCustomTitle = sectionProps.showCustomTitle ?? false;
  const customTitle = sectionProps.title || '';
  const titleAlignment = sectionProps.titleAlignment ?? 'center-with-lines';

  // Compute displayed title with dynamic name substitution
  // Supports {name} placeholder in custom titles (e.g., "About {name}" → "About Kate")
  const displayTitle = showCustomTitle
    ? (customTitle.replace(/\{name\}/gi, professional.name || '').trim() || 'About')  // User's custom title with name substitution
    : (professional.name ? `About ${professional.name}` : 'About');  // Default title

  // Typography props from Redux
  const titleFontFamily = sectionProps.titleFontFamily;
  const titleFontSize = sectionProps.titleFontSize;
  const titleFontWeight = sectionProps.titleFontWeight;
  const titleColor = sectionProps.titleColor;
  const titleTextTransform = sectionProps.titleTextTransform;
  const titleLetterSpacing = sectionProps.titleLetterSpacing;

  const hasHeaderData = !!(professional.name || professional.bio || professional.profileImage);

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
      {hasHeaderData ? (
        <HeaderAndBio
          professional={professional as Professional}
          section={{
            id: 'header-bio',
            sectionType: 'headerAndBio',
            label: 'Header & Bio',
            visible: true,
            position: { x: { value: 0, unit: '%' }, y: { value: 0, unit: '%' }, width: { value: 100, unit: '%' }, height: { value: 100, unit: '%' }, visible: true },
            props: {
              bioItalic: true,
              showVerifiedBadge: true,
              imageSize: 70,
              nameFontSize: '1.1rem',
              titleFontSize: '0.9rem',
              bioFontSize: '0.8rem',
            },
          }}
        />
      ) : (
        <EmptySectionState
          message="Your name and bio will appear here"
          icon="profile"
        />
      )}
    </StyledSectionWrapper>
  );
}
