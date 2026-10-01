import React from 'react';
import type { DeviceBreakdown as DeviceBreakdownRow } from './types';
import { formatNumber, getDeviceRows } from './analyticsHelpers';
import { getDeviceIcon, getDeviceLabel } from './eventConfig';
import { AnalyticsPanel } from './AnalyticsStates';

export default function DeviceBreakdown({ rows }: { rows: DeviceBreakdownRow[] }) {
  const devices = getDeviceRows(rows);
  const total = devices.reduce((sum, d) => sum + d.count, 0);

  return (
    <AnalyticsPanel title="Visitors by Device" subtitle="Where your card was opened">
      <ul className="space-y-4">
        {devices.map(({ type, count }) => {
          const Icon = getDeviceIcon(type);
          const share = total > 0 ? (count / total) * 100 : 0;
          return (
            <li key={type} className="flex items-center gap-3">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate text-sm font-medium text-foreground">{getDeviceLabel(type)}</span>
                  <span className="flex items-baseline gap-2">
                    {total > 0 && (
                      <span className="text-xs text-muted-foreground tabular-nums">{Math.round(share)}%</span>
                    )}
                    <span className="text-sm font-semibold text-foreground tabular-nums">{formatNumber(count)}</span>
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${count > 0 ? Math.max(4, share) : 0}%` }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {total === 0 && (
        <p className="mt-4 text-xs text-muted-foreground">No device data for this period yet.</p>
      )}
    </AnalyticsPanel>
  );
}
