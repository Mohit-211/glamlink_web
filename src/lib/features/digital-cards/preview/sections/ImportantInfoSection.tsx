import React from 'react';
import type { Professional, ProfessionalSectionConfig } from '@/lib/pages/for-professionals/types/professional';
import StyledSectionWrapper from '../components/StyledSectionWrapper';
import { ImportantInfo } from '@/lib/features/digital-cards/components/sections/content';
import EmptySectionState from '../components/EmptySectionState';
import { useAppSelector } from '../../../../../../store/hooks';

import { selectPropsByInnerSectionType, selectSections } from '@/lib/features/digital-cards/store';

interface ImportantInfoSectionProps {
  sectionId: string;
  professional?: Partial<Professional>;
  importantInfo?: string[];
  /** Section config with props (displayQrCode, qrCodeUrl, etc.) */
  sectionConfig?: ProfessionalSectionConfig;
  /** Explicit QR code enabled override */
  qrCodeEnabled?: boolean;
  /** Explicit QR code URL override */
  qrCodeUrl?: string;
  /** Section props from condensed card config */
  sectionProps?: Record<string, any>;
}

const DEFAULT_QR_URL = 'https://apps.apple.com/us/app/glamlink/id6502334118';

export default function ImportantInfoSection({
  sectionId,
  professional,
  importantInfo,
  sectionConfig,
  qrCodeEnabled,
  qrCodeUrl,
  sectionProps = {},
}: ImportantInfoSectionProps) {
  // READ FROM REDUX - direct selector for live updates
  const reduxProps = useAppSelector(selectPropsByInnerSectionType('importantInfo'));
  const sections = useAppSelector(selectSections);

  // Find the important info section in Redux to get wrapper props (showCustomTitle, title, etc.)
  const infoSection = sections.find((s: { props: { innerSectionType: string; }; }) =>
    s.props?.innerSectionType === 'importantInfo' ||
    s.props?.innerSectionType === 'important-info'
  );
  const wrapperProps = infoSection?.props || {};

  // Merge props with Redux taking highest precedence
  const mergedProps = { ...sectionConfig?.props, ...sectionProps, ...reduxProps };

  // Title logic: showCustomTitle = false → default, showCustomTitle = true → custom
  const showCustomTitle = wrapperProps.showCustomTitle ?? false;
  const customTitle = wrapperProps.title || '';
  const titleAlignment = wrapperProps.titleAlignment ?? 'center-with-lines';
  const displayTitle = showCustomTitle ? customTitle : 'Important Info';

  // Typography props from Redux
  const titleFontFamily = wrapperProps.titleFontFamily;
  const titleFontSize = wrapperProps.titleFontSize;
  const titleFontWeight = wrapperProps.titleFontWeight;
  const titleColor = wrapperProps.titleColor;
  const titleTextTransform = wrapperProps.titleTextTransform;
  const titleLetterSpacing = wrapperProps.titleLetterSpacing;

  // Use professional's importantInfo or explicit prop
  const items = importantInfo || professional?.importantInfo || [];
  const hasItems = items.length > 0;

  // Get toggleGroup display settings from merged props (new system)
  const showTitle = mergedProps.showTitle ?? true;
  const showList = mergedProps.showList ?? true;
  const showQrCode = mergedProps.showQrCode ?? false;
  const qrCodeLocation = mergedProps.qrCodeLocation ?? 'right';

  // Legacy prop support
  const displayQrCode = mergedProps.displayQrCode ?? qrCodeEnabled ?? false;
  const finalQrCodeUrl = mergedProps.qrCodeUrl ?? qrCodeUrl ?? DEFAULT_QR_URL;
  const displayAsList = mergedProps.displayAsList ?? mergedProps.listFormat ?? true;
  const maxItems = mergedProps.maxItems ?? 10;

  // Effective QR code setting - NEW system takes precedence over legacy
  // Only fall back to legacy displayQrCode if new showQrCode is not explicitly set in mergedProps
  const effectiveShowQrCode = mergedProps.showQrCode !== undefined ? showQrCode : displayQrCode;

  // If no items and no QR code, don't render
  if (!hasItems && !effectiveShowQrCode) return null;

  // Always show wrapper title - hideTitle only affects the INNER ImportantInfo component
  const wrapperTitle = displayTitle;

  return (
    <StyledSectionWrapper
      key={sectionId}
      title={wrapperTitle}
      titleAlignment={titleAlignment}
      titleFontFamily={titleFontFamily}
      titleFontSize={titleFontSize}
      titleFontWeight={titleFontWeight}
      titleColor={titleColor}
      titleTextTransform={titleTextTransform}
      titleLetterSpacing={titleLetterSpacing}
    >
      {hasItems || effectiveShowQrCode ? (
        <ImportantInfo
          professional={{ ...professional, importantInfo: items } as Professional}
          section={{
            id: 'importantInfo',
            sectionType: 'importantInfo',
            label: 'Important Info',
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
          message="Add important info"
          icon="list"
        />
      )}
    </StyledSectionWrapper>
  );
}
