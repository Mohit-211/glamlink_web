'use client';

import type { ConversationPriority } from '../types';
import { PRIORITY_OPTIONS } from '../config';

interface PriorityBadgeProps {
  priority: ConversationPriority;
  showLabel?: boolean;
}

export function PriorityBadge({ priority, showLabel = true }: PriorityBadgeProps) {
  const config = PRIORITY_OPTIONS.find(p => p.value === priority);

  // Don't show badge for normal priority
  if (!config || priority === 'normal') return null;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <span>{config.icon}</span>
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}
