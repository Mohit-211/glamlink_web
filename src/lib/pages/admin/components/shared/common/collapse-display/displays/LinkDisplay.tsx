'use client';

/**
 * LinkDisplay - Clickable link display component
 *
 * Displays a URL as a clickable link. Supports auto-prefixing https://
 * and opening in a new tab. Returns null if value is empty.
 */

import { ExternalLink } from 'lucide-react';
import type { LinkDisplayProps } from '../types';

export function LinkDisplay({
  label,
  value,
  icon,
  autoPrefix = true,
  external = true,
}: LinkDisplayProps) {
  if (!value) return null;

  const href = autoPrefix && !value.startsWith('http') ? `https://${value}` : value;

  return (
    <div>
      <dt className={`text-sm font-medium text-gray-500 ${icon ? 'flex items-center gap-1' : ''}`}>
        {icon}
        {label}
      </dt>
      <dd className="mt-1">
        <a
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
        >
          {value}
          {external && <ExternalLink className="w-3 h-3" />}
        </a>
      </dd>
    </div>
  );
}

export default LinkDisplay;
