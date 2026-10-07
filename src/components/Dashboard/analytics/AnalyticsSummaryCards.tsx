import React from 'react';
import { Eye, MousePointerClick, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AnalyticsSummary } from './types';
import { formatNumber } from './analyticsHelpers';

const CARDS = [
  {
    key: 'total_views',
    label: 'Total Views',
    description: 'Total times your Access Card was viewed',
    icon: Eye,
  },
  {
    key: 'unique_visitors',
    label: 'Unique Visitors',
    description: 'Unique visitors who viewed your card',
    icon: Users,
  },
  {
    key: 'total_clicks',
    label: 'Total Clicks',
    description: 'Total interactions on your Access Card',
    icon: MousePointerClick,
  },
] as const;

export default function AnalyticsSummaryCards({ summary }: { summary: AnalyticsSummary }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
      {CARDS.map(({ key, label, description, icon: Icon }, i) => (
        <div
          key={key}
          className={cn(
            'relative min-w-0 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:p-5',
            // Third card spans the row on tablet so the 2-col grid has no gap.
            i === 2 && 'sm:col-span-2 xl:col-span-1'
          )}
        >
          <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/5" />
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground ring-1 ring-primary/20">
              <Icon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground tabular-nums">
            {formatNumber(summary?.[key])}
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>
        </div>
      ))}
    </div>
  );
}
