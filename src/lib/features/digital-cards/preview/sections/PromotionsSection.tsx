import React, { useMemo } from 'react';
import type { Professional, Promotion } from '@/lib/pages/for-professionals/types/professional';
import StyledSectionWrapper from '../components/StyledSectionWrapper';
import { CurrentPromotions } from '@/lib/features/digital-cards/components/sections/promotions';
import { useAppSelector } from '../../../../../../store/hooks';
import {
  selectPropsByInnerSectionType,
  selectSections,
} from '@/lib/features/digital-cards/store';

interface PromotionsSectionProps {
  professional: Partial<Professional>;
  sectionId: string;
  showPromo?: boolean;
  promotionDetails?: string;
  sectionProps?: Record<string, any>;
}

export default function PromotionsSection({
  professional,
  sectionId,
  showPromo = false,
  promotionDetails,
  sectionProps = {},
}: PromotionsSectionProps) {
  // ✅ Read live props from Redux
  const reduxProps = useAppSelector(
    selectPropsByInnerSectionType('current-promotions')
  );
  const sections = useAppSelector(selectSections);

  // ✅ Find promotions section in Redux (no manual typing needed)
  const promoSection = sections.find(
    (s) =>
      s.props?.innerSectionType === 'current-promotions' ||
      s.props?.innerSectionType === 'current-promotions-detailed'
  );

  const wrapperProps = promoSection?.props ?? {};

  // ✅ Merge props (Redux takes priority)
  const mergedProps = { ...sectionProps, ...reduxProps };

  // ✅ Title logic
  const showCustomTitle = wrapperProps.showCustomTitle ?? false;
  const customTitle = wrapperProps.title ?? '';
  const titleAlignment = wrapperProps.titleAlignment ?? 'center-with-lines';
  const displayTitle = showCustomTitle
    ? customTitle
    : 'Current Promotions';

  // ✅ Typography props
  const titleFontFamily = wrapperProps.titleFontFamily;
  const titleFontSize = wrapperProps.titleFontSize;
  const titleFontWeight = wrapperProps.titleFontWeight;
  const titleColor = wrapperProps.titleColor;
  const titleTextTransform = wrapperProps.titleTextTransform;
  const titleLetterSpacing = wrapperProps.titleLetterSpacing;

  if (!showPromo) return null;

  // ✅ Promotions logic
  const promotions: Promotion[] = useMemo(() => {
    if (professional.promotions?.length) {
      return professional.promotions;
    }

    if (showPromo && promotionDetails) {
      return [
        {
          id: 'form-promotion',
          title: promotionDetails,
          isActive: true,
          isFeatured: false,
        },
      ];
    }

    return [];
  }, [professional, showPromo, promotionDetails]);

  const professionalWithPromos = useMemo(
    () => ({
      ...professional,
      promotions,
    }),
    [professional, promotions]
  );

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
      {...mergedProps}
    >
      <CurrentPromotions
        professional={professionalWithPromos as Professional}
        section={{
          id: 'promotions',
          sectionType: 'current-promotions',
          label: 'Promotions',
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
            onlyDisplayTitle: true,
          },
        }}
      />
    </StyledSectionWrapper>
  );
}