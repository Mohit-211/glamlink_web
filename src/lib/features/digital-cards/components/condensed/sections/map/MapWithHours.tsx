"use client";

import { Professional } from "@/lib/pages/for-professionals/types/professional";
import { CondensedCardSectionInstance } from "@/lib/features/digital-cards/types/condensedCardConfig";
import { MemoizedMapSection, BusinessHours } from "@/lib/features/digital-cards/components/sections/contact";
import { useAppSelector } from '../../../../../../../../store/hooks';
import { selectPropsByInnerSectionType } from '@/lib/features/digital-cards/store';

interface MapWithHoursProps {
  professional: Professional;
  section?: CondensedCardSectionInstance;
}

export default function MapWithHours({ professional, section }: MapWithHoursProps) {
  // READ FROM REDUX - direct selector for live updates
  const reduxProps = useAppSelector(selectPropsByInnerSectionType('mapWithHours'));

  // Merge props with Redux taking highest precedence
  const mergedProps = { ...section?.props, ...reduxProps };

  const showAddressOverlay = mergedProps?.showAddressOverlay ?? false;
  // mapHeight is stored as number in config, need to convert to string with 'px'
  const mapHeightValue = mergedProps?.mapHeight ?? 400;
  const mapHeight = typeof mapHeightValue === 'number' ? `${mapHeightValue}px` : mapHeightValue;

  return (
    <div className="map-with-hours">
      {/* Map Display */}
      <div className="mb-4">
        <MemoizedMapSection
          professional={professional}
          showAddressOverlay={showAddressOverlay}
          showAddressBelowMap={false}
          height={mapHeight}
        />
      </div>

      {/* Business Hours */}
      <div className="hours-display">
        <BusinessHours professional={professional} />
      </div>
    </div>
  );
}
