'use client';

/**
 * ArrayDisplay - Bulleted list display component
 *
 * Displays an array of strings as a list.
 * Supports string or string[] input. Returns null if empty.
 * Also exported as ListDisplay for compatibility.
 */

import type { ArrayDisplayProps } from '../types';

export function ArrayDisplay({
  label,
  items,
  variant = 'bullet',
  emptyMessage,
}: ArrayDisplayProps) {
  // Handle case where items might be a string instead of array
  const itemsArray = Array.isArray(items)
    ? items
    : (typeof items === 'string' && items ? [items] : []);

  if (itemsArray.length === 0) {
    if (emptyMessage) {
      return (
        <div>
          <dt className="text-sm font-medium text-gray-500">{label}</dt>
          <dd className="mt-1 text-sm text-gray-400 italic">{emptyMessage}</dd>
        </div>
      );
    }
    return null;
  }

  const listClasses = {
    bullet: 'list-disc list-inside',
    numbered: 'list-decimal list-inside',
    plain: '',
  };

  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1">
        <ul className={`${listClasses[variant]} text-sm text-gray-900 space-y-1`}>
          {itemsArray.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </dd>
    </div>
  );
}

// Alias for backwards compatibility
export const ListDisplay = ArrayDisplay;

export default ArrayDisplay;
