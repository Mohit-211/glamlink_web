import React from 'react';
import type { AnalyticsEventCounts } from './types';
import { formatNumber, getClickActivity } from './analyticsHelpers';
import { getEventConfig } from './eventConfig';
import { AnalyticsEmptyState, AnalyticsPanel } from './AnalyticsStates';

export default function ClickActivity({ events }: { events: AnalyticsEventCounts }) {
  const items = getClickActivity(events);
  // Bars are relative to the top item, so no percentages are implied.
  const max = items[0]?.count ?? 0;

  return (
    <AnalyticsPanel
      title="Click Activity"
      subtitle="What visitors tapped on your card"
    >
      {items.length === 0 ? (
        <AnalyticsEmptyState
          compact
          title="No clicks yet"
          message="Clicks on your links, socials and contact buttons will show up here."
        />
      ) : (
        <ul className="space-y-3.5">
          {items.map(({ type, count }) => {
            const { label, icon: Icon } = getEventConfig(type);
            return (
              <li key={type} className="flex items-center gap-3">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-sm font-medium text-foreground">{label}</span>
                    <span className="text-sm font-semibold text-foreground tabular-nums">
                      {formatNumber(count)}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${max > 0 ? Math.max(4, (count / max) * 100) : 0}%` }}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </AnalyticsPanel>
  );
}
