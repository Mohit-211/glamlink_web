import React, { useMemo } from 'react';
import type { Professional, Promotion } from '@/lib/pages/for-professionals/types/professional';
import StyledSectionWrapper from '../components/StyledSectionWrapper';
import { CurrentPromotions } from '@/lib/features/digital-cards/components/sections/promotions';
import { useAppSelector } from '../../../../../../store/hooks';

import { selectPropsByInnerSectionType, selectSections } from '@/lib/features/digital-cards/store';

interface PromotionsSectionProps {
  professional: Partial<Professional>;
  sectionId: string;
  showPromo?: boolean;
  promotionDetails?: string;
  sectionProps?: Record<string, any>;
}

export default function PromotionsSection({ professional, sectionId, showPromo = false, promotionDetails, sectionProps = {} }: PromotionsSectionProps) {
  // READ FROM REDUX - direct selector for live updates
  const reduxProps = useAppSelector(selectPropsByInnerSectionType('current-promotions'));
  const sections = useAppSelector(selectSections);

  // Find the promotions section in Redux to get wrapper props (showCustomTitle, title, etc.)
  const promoSection = sections.find((s: { props: { innerSectionType: string; }; }) =>
    s.props?.innerSectionType === 'current-promotions' ||
    s.props?.innerSectionType === 'current-promotions-detailed'
  );
  const wrapperProps = promoSection?.props || {};

  // Merge props with Redux taking highest precedence
  const mergedProps = { ...sectionProps, ...reduxProps };

  // Title logic: showCustomTitle = false → default, showCustomTitle = true → custom
  const showCustomTitle = wrapperProps.showCustomTitle ?? false;
  const customTitle = wrapperProps.title || '';
  const titleAlignment = wrapperProps.titleAlignment ?? 'center-with-lines';
  const displayTitle = showCustomTitle ? customTitle : 'Current Promotions';

  // Typography props from Redux
  const titleFontFamily = wrapperProps.titleFontFamily;
  const titleFontSize = wrapperProps.titleFontSize;
  const titleFontWeight = wrapperProps.titleFontWeight;
  const titleColor = wrapperProps.titleColor;
  const titleTextTransform = wrapperProps.titleTextTransform;
  const titleLetterSpacing = wrapperProps.titleLetterSpacing;

  if (!showPromo) return null;

  const promotions: Promotion[] = useMemo(() => {
    if (professional.promotions && professional.promotions.length > 0) {
      return professional.promotions;
    }
    if (showPromo && promotionDetails) {
      return [{
        id: 'form-promotion',
        title: promotionDetails,
        isActive: true,
        isFeatured: false,
      }];
    }
    return [];
  }, [professional.promotions, showPromo, promotionDetails]);

  const professionalWithPromos = useMemo(() => ({
    ...professional,
    promotions,
  }), [professional, promotions]);

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
      <CurrentPromotions
        professional={professionalWithPromos as Professional}
        section={{
          id: 'promotions',
          sectionType: 'current-promotions',
          label: 'Promotions',
          visible: true,
          position: { x: { value: 0, unit: '%' }, y: { value: 0, unit: '%' }, width: { value: 100, unit: '%' }, height: { value: 100, unit: '%' }, visible: true },
          props: {
            hideTitle: true,
            listFormat: true,
            onlyDisplayTitle: true,
          },
        }}
      />
    </StyledSectionWrapper>
  );
}
