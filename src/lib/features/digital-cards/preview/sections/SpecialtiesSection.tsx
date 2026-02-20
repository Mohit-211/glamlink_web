import React from 'react';
import type { Professional } from '@/lib/pages/for-professionals/types/professional';
import StyledSectionWrapper from '../components/StyledSectionWrapper';
import EmptySectionState from '../components/EmptySectionState';
import { Specialties } from '@/lib/features/digital-cards/components/sections/content';
import { useAppSelector } from '../../../../../../store/hooks';

import { selectPropsByInnerSectionType, selectSections } from '@/lib/features/digital-cards/store';

interface SpecialtiesSectionProps {
  professional: Partial<Professional>;
  sectionId: string;
  qrCodeEnabled?: boolean;
  qrCodeUrl?: string;
  sectionProps?: Record<string, any>;
}

export default function SpecialtiesSection({ professional, sectionId, qrCodeEnabled = true, qrCodeUrl, sectionProps = {} }: SpecialtiesSectionProps) {
  // READ FROM REDUX - direct selector for live updates
  const reduxProps = useAppSelector(selectPropsByInnerSectionType('specialties'));
  const sections = useAppSelector(selectSections);

  // Find the specialties section in Redux to get wrapper props (showCustomTitle, title, etc.)
  const specialtiesSection = sections.find((s: { props: { innerSectionType: string; }; }) => s.props?.innerSectionType === 'specialties');
  const wrapperProps = specialtiesSection?.props || {};

  // Merge props with Redux taking highest precedence
  const mergedProps = { ...sectionProps, ...reduxProps };

  // Title logic: showCustomTitle = false → default, showCustomTitle = true → custom
  const showCustomTitle = wrapperProps.showCustomTitle ?? false;
  const customTitle = wrapperProps.title || '';
  const titleAlignment = wrapperProps.titleAlignment ?? 'center-with-lines';
  const displayTitle = showCustomTitle ? customTitle : 'Specialties';

  // Typography props from Redux
  const titleFontFamily = wrapperProps.titleFontFamily;
  const titleFontSize = wrapperProps.titleFontSize;
  const titleFontWeight = wrapperProps.titleFontWeight;
  const titleColor = wrapperProps.titleColor;
  const titleTextTransform = wrapperProps.titleTextTransform;
  const titleLetterSpacing = wrapperProps.titleLetterSpacing;

  const hasSpecialties = !!(professional.specialties && professional.specialties.length > 0);
  const DEFAULT_QR_URL = 'https://apps.apple.com/us/app/glamlink/id6502334118';

  // Get toggleGroup display settings from merged props (new system)
  const showTitle = mergedProps.showTitle ?? true;
  const showList = mergedProps.showList ?? true;
  const showQrCode = mergedProps.showQrCode ?? false;
  const qrCodeLocation = mergedProps.qrCodeLocation ?? 'right';

  // Legacy prop support
  const displayQrCode = mergedProps.displayQrCode ?? qrCodeEnabled ?? false;
  const finalQrCodeUrl = mergedProps.qrCodeUrl ?? qrCodeUrl ?? DEFAULT_QR_URL;
  const displayAsList = mergedProps.displayAsList ?? mergedProps.listFormat ?? true;
  const maxItems = mergedProps.maxItems ?? 5;

  // Effective QR code setting (new toggleGroup takes precedence)
  const effectiveShowQrCode = showQrCode || displayQrCode;

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
      {hasSpecialties || effectiveShowQrCode ? (
        <Specialties
          professional={professional as Professional}
          section={{
            id: 'specialties',
            sectionType: 'specialties',
            label: 'Specialties',
            visible: true,
            position: { x: { value: 0, unit: '%' }, y: { value: 0, unit: '%' }, width: { value: 100, unit: '%' }, height: { value: 100, unit: '%' }, visible: true },
            props: {
              // New toggleGroup props
              showTitle: showTitle,
              showList: showList,
              showQrCode: showQrCode,
              qrCodeLocation: qrCodeLocation,
              qrCodeUrl: finalQrCodeUrl,
              // Legacy props (for backward compatibility)
              hideTitle: true, // Always hide title since StyledSectionWrapper shows it
              displayAsList: displayAsList,
              maxItems: maxItems,
              displayQrCode: displayQrCode,
            },
          }}
        />
      ) : (
        <EmptySectionState
          message="Add your specialties"
          icon="list"
        />
      )}
    </StyledSectionWrapper>
  );
}
