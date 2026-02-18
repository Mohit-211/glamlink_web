'use client';

/**
 * ArrayBadgeDisplay - Badge-style array display component
 *
 * Displays an array of strings as colored badge chips.
 * Supports string or string[] input. Returns null if empty.
 * Also exported as CheckboxArrayDisplay for compatibility.
 */

import type { ArrayBadgeDisplayProps, BadgeColorScheme } from '../types';

const COLOR_SCHEMES: Record<BadgeColorScheme, string> = {
  indigo: 'bg-indigo-100 text-indigo-800',
  gray: 'bg-gray-100 text-gray-800',
  green: 'bg-green-100 text-green-800',
  blue: 'bg-blue-100 text-blue-800',
  red: 'bg-red-100 text-red-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  custom: '',
};

// Default text transform: replace underscores with spaces
const defaultTransformText = (item: string): string => item.replace(/_/g, ' ');

export function ArrayBadgeDisplay({
  label,
  items,
  colorScheme = 'indigo',
  badgeClassName = '',
  transformText = defaultTransformText,
}: ArrayBadgeDisplayProps) {
  // Handle case where items might be a string instead of array
  const itemsArray = Array.isArray(items)
    ? items
    : (typeof items === 'string' && items ? [items] : []);

  if (itemsArray.length === 0) return null;

  const badgeClasses = colorScheme === 'custom'
    ? badgeClassName
    : `${COLOR_SCHEMES[colorScheme]} ${badgeClassName}`;

  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 flex flex-wrap gap-2">
        {itemsArray.map((item, index) => (
          <span
            key={index}
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClasses}`}
          >
            {transformText(item)}
          </span>
        ))}
      </dd>
    </div>
  );
}

// Alias for backwards compatibility
export const CheckboxArrayDisplay = ArrayBadgeDisplay;

export default ArrayBadgeDisplay;
