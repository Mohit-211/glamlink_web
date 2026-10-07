import React from 'react';
import { Eye, MousePointerClick, Users } from 'lucide-react';
import type { AnalyticsSummary } from './types';
import { formatNumber } from './analyticsHelpers';

const CARDS = [
  {
    key: 'total_views',
    label: 'Total views',
    description: 'Times your Access Card was viewed',
    icon: Eye,
  },
  {
    key: 'unique_visitors',
    label: 'Unique visitors',
    description: 'Different people who viewed your card',
    icon: Users,
  },
  {
    key: 'total_clicks',
    label: 'Total clicks',
    description: 'Taps on links, socials and contact buttons',
    icon: MousePointerClick,
  },
] as const;

/** Same single-strip layout as the dashboard Overview stats, so numbers read alike everywhere. */
export default function AnalyticsSummaryCards({
  summary,
  rangeLabel,
}: {
  summary: AnalyticsSummary;
  rangeLabel?: string | null;
}) {
  return (
    <section aria-label="Summary">
      {rangeLabel && <p className="mb-2 text-xs text-muted-foreground">Showing {rangeLabel}</p>}
      <div className="grid grid-cols-1 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {CARDS.map(({ key, label, description, icon: Icon }) => (
          <div key={key} className="min-w-0 px-5 py-4 sm:py-5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon className="h-4 w-4 text-primary" />
              <p className="text-xs font-medium">{label}</p>
            </div>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground tabular-nums">
              {formatNumber(summary?.[key])}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
