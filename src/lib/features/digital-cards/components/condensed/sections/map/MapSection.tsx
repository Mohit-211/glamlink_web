"use client";

import { Professional } from "@/lib/pages/for-professionals/types/professional";
import { CondensedCardSectionInstance } from "@/lib/features/digital-cards/types/condensedCardConfig";
import { MemoizedMapSection } from "@/lib/features/digital-cards/components/sections/contact";
import { MAP_DEFAULTS } from '../utils/props';
import { useAppSelector } from '../../../../../../../../store/hooks';
import { selectPropsByInnerSectionType } from '@/lib/features/digital-cards/store';

interface MapSectionProps {
  professional: Professional;
  section?: CondensedCardSectionInstance;
}

export default function MapSection({ professional, section }: MapSectionProps) {
  // READ FROM REDUX - direct selector for live updates
  const reduxProps = useAppSelector(selectPropsByInnerSectionType('map'));

  // Merge props with Redux taking highest precedence
  const mergedProps = { ...section?.props, ...reduxProps };

  const showAddressOverlay = mergedProps?.showAddressOverlay ?? false;
  const showAddressBelowMap = mergedProps?.showAddressBelowMap ?? false;
  // mapHeight is stored as number in config, need to convert to string with 'px'
  const mapHeightValue = mergedProps?.mapHeight ?? 400;
  const mapHeight = typeof mapHeightValue === 'number' ? `${mapHeightValue}px` : mapHeightValue;

  return (
    <div className="map-section">
      <MemoizedMapSection
        professional={professional}
        showAddressOverlay={showAddressOverlay}
        showAddressBelowMap={showAddressBelowMap}
        height={mapHeight}
      />
    </div>
  );
}
