'use client';

/**
 * TextareaDisplay - Multi-line text display component
 *
 * Displays multi-line text content with whitespace preservation.
 * Returns null if value is empty.
 */

import type { TextareaDisplayProps } from '../types';

export function TextareaDisplay({
  label,
  value,
  showBackground = true,
  maxLines = 0,
}: TextareaDisplayProps) {
  if (!value) return null;

  const contentClasses = [
    'mt-1 text-sm text-gray-900 whitespace-pre-wrap',
    showBackground && 'bg-gray-50 p-3 rounded-md',
    maxLines > 0 && `line-clamp-${maxLines}`,
  ].filter(Boolean).join(' ');

  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className={contentClasses}>
        {value}
      </dd>
    </div>
  );
}

export default TextareaDisplay;
