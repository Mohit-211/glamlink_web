/**
 * Status Badge Component
 *
 * Displays campaign status with appropriate color coding.
 */

'use client';

import { CAMPAIGN_STATUSES } from '@/lib/features/crm/marketing/constants';

interface StatusBadgeProps {
  status: string;
  count?: number;
}

export function StatusBadge({ status, count }: StatusBadgeProps) {
  const config = CAMPAIGN_STATUSES[status as keyof typeof CAMPAIGN_STATUSES] || {
    label: status,
    color: 'gray',
  };

  const colorClasses = {
    gray: 'bg-gray-100 text-gray-700',
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    orange: 'bg-orange-100 text-orange-700',
    red: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${colorClasses[config.color as keyof typeof colorClasses]}
    `}>
      {config.label}
      {count !== undefined && count > 0 && ` (${count})`}
    </span>
  );
}
