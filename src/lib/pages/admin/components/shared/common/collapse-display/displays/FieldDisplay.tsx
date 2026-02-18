'use client';

/**
 * FieldDisplay - Simple text field display component
 *
 * Displays a label-value pair. Returns null if value is empty.
 * Supports optional icon before the label.
 */

import type { FieldDisplayProps } from '../types';

export function FieldDisplay({
  label,
  value,
  icon,
  variant = 'default',
  labelClassName = '',
  valueClassName = '',
}: FieldDisplayProps) {
  if (!value) return null;

  const labelClasses = variant === 'compact'
    ? `text-xs font-medium text-gray-500 ${labelClassName}`
    : `text-sm font-medium text-gray-500 ${labelClassName}`;

  const valueClasses = variant === 'compact'
    ? `mt-0.5 text-sm text-gray-900 ${valueClassName}`
    : `mt-1 text-sm text-gray-900 ${valueClassName}`;

  return (
    <div>
      <dt className={`${labelClasses} ${icon ? 'flex items-center gap-1' : ''}`}>
        {icon}
        {label}
      </dt>
      <dd className={valueClasses}>{value}</dd>
    </div>
  );
}

export default FieldDisplay;
