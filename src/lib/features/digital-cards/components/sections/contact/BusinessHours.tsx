"use client";

import { Professional } from "@/lib/pages/for-professionals/types/professional";
import type { CondensedCardSectionInstance } from "@/lib/features/digital-cards/types/condensedCardConfig";
import { useAppSelector } from '../../../../../../../store/hooks';
import { selectPropsByInnerSectionType } from '@/lib/features/digital-cards/store';

interface BusinessHoursProps {
  professional: Professional;
  section?: CondensedCardSectionInstance;
  className?: string;
}

/**
 * BusinessHours - Displays professional's business hours
 *
 * Supports toggleGroup display options:
 * - showTitle: Controls whether the "Business Hours" heading is displayed
 * - showList: When true, shows bullet points before each hour line
 * - compactMode: When true, displays hours in a more compact format
 *
 * NOTE: Hours content is ALWAYS displayed (showList only controls bullet points)
 *
 * Display modes:
 * - List mode (showList=true): Each hour with a bullet point
 * - Plain mode (showList=false): Each hour without bullet points
 * - Compact: More condensed layout for smaller spaces
 *
 * Features:
 * - Only renders if businessHours array is not empty
 * - Each hour string on a separate line
 * - Consistent styling with other sections
 */
export default function BusinessHours({
  professional,
  section,
  className = ""
}: BusinessHoursProps) {
  // READ FROM REDUX - direct selector for live updates
  const reduxProps = useAppSelector(selectPropsByInnerSectionType('business-hours'));

  // Merge props with Redux taking highest precedence
  const mergedProps = { ...section?.props, ...reduxProps };

  // Extract toggleGroup props (new system)
  const showTitle = mergedProps?.showTitle ?? true;
  const showList = mergedProps?.showList ?? true;  // Controls bullet points, not content
  const compactMode = mergedProps?.compactMode ?? false;

  // Legacy prop support: hideTitle inverts to showTitle
  const legacyHideTitle = mergedProps?.hideTitle;
  const effectiveShowTitle = legacyHideTitle !== undefined ? !legacyHideTitle : showTitle;

  // Early return if no business hours
  if (!professional.businessHours || professional.businessHours.length === 0) {
    return null;
  }

  // Styled bullet point component - matches other content sections
  const StyledBullet = () => (
    <span
      className="flex-shrink-0"
      style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: 'rgb(34, 184, 200)', // glamlink-teal
        marginTop: '6px',
      }}
    />
  );

  // Compact mode - smaller text, tighter spacing
  if (compactMode) {
    return (
      <div className={`business-hours-compact ${className}`}>
        {effectiveShowTitle && (
          <h3 className="text-sm font-semibold text-gray-900" style={{ marginBottom: '8px' }}>
            Business Hours
          </h3>
        )}
        <div>
          {professional.businessHours.map((hours: string, index: number) => (
            <div
              key={index}
              className="flex items-start text-gray-700 text-sm"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                marginTop: index > 0 ? '4px' : 0,
                lineHeight: '1.5',
              }}
            >
              {showList && <StyledBullet />}
              <span>{hours}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default format - hours content always shown
  // showList controls whether styled bullet points are displayed
  return (
    <div className={`business-hours ${className}`}>
      {effectiveShowTitle && (
        <h3 className="text-lg font-semibold text-gray-900" style={{ marginBottom: '16px' }}>
          Business Hours
        </h3>
      )}
      <div>
        {professional.businessHours.map((hours: string, index: number) => (
          <div
            key={index}
            className="flex items-start text-gray-700 text-base"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              marginTop: index > 0 ? '4px' : 0,
              lineHeight: '1.5',
            }}
          >
            {showList && <StyledBullet />}
            <span>{hours}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
