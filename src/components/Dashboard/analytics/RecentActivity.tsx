'use client';

import React, { useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { AnalyticsEvent } from './types';
import { formatNumber, formatUTCDateTime, getEventTargetDisplay, parseUTCDate } from './analyticsHelpers';
import { getDeviceIcon, getDeviceLabel, getEventConfig } from './eventConfig';
import { AnalyticsEmptyState, AnalyticsPanel } from './AnalyticsStates';

const PAGE_SIZE = 10;

function EventBadge({ type }: { type: string }) {
  const { activityLabel, icon: Icon } = getEventConfig(type);
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="truncate text-sm font-medium text-foreground">{activityLabel}</span>
    </span>
  );
}

function EventTarget({ event }: { event: AnalyticsEvent }) {
  const { text, title, href } = getEventTargetDisplay(event);
  const label = <span className="block min-w-0 truncate">{text}</span>;

  return (
    <span className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
      {title ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="min-w-0 cursor-default">{label}</span>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs break-all">{title}</TooltipContent>
        </Tooltip>
      ) : (
        label
      )}
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${text}`}
          className="flex-shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:text-primary"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </span>
  );
}

function DeviceCell({ type }: { type: string | null }) {
  const Icon = getDeviceIcon(type);
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      {getDeviceLabel(type)}
    </span>
  );
}

export default function RecentActivity({
  rows,
  total,
}: {
  rows: AnalyticsEvent[];
  total: number;
}) {
  const [visible, setVisible] = useState(PAGE_SIZE);

  const sorted = useMemo(
    () =>
      [...rows].sort(
        (a, b) =>
          (parseUTCDate(b.created_at)?.getTime() ?? 0) - (parseUTCDate(a.created_at)?.getTime() ?? 0) ||
          b.id - a.id
      ),
    [rows]
  );
  const shown = sorted.slice(0, visible);

  return (
    <AnalyticsPanel
      title="Recent Activity"
      subtitle={
        sorted.length > 0
          ? `Latest interactions · ${formatNumber(Math.max(total, sorted.length))} event${Math.max(total, sorted.length) === 1 ? '' : 's'}`
          : 'Latest interactions on your card'
      }
    >
      {sorted.length === 0 ? (
        <AnalyticsEmptyState
          compact
          title="No recent activity"
          message="Views and clicks on your Access Card will be listed here."
        />
      ) : (
        <>
          {/* Desktop / tablet table */}
          <div className="hidden overflow-hidden rounded-xl border border-border md:block">
            <table className="w-full table-fixed text-left">
              <thead className="bg-secondary/50 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="w-[30%] px-4 py-3">Event</th>
                  <th className="w-[32%] px-4 py-3">Target</th>
                  <th className="w-[14%] px-4 py-3">Device</th>
                  <th className="w-[24%] px-4 py-3">Date &amp; Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {shown.map((event) => (
                  <tr key={event.id} className="transition-colors hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <EventBadge type={event.event_type} />
                    </td>
                    <td className="px-4 py-3">
                      <EventTarget event={event} />
                    </td>
                    <td className="px-4 py-3">
                      <DeviceCell type={event.device_type} />
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground tabular-nums">
                      {formatUTCDateTime(event.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="space-y-2.5 md:hidden">
            {shown.map((event) => (
              <li key={event.id} className="rounded-xl border border-border p-3">
                <div className="flex items-start justify-between gap-3">
                  <EventBadge type={event.event_type} />
                  <DeviceCell type={event.device_type} />
                </div>
                <div className="mt-2 pl-[42px]">
                  <EventTarget event={event} />
                  <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                    {formatUTCDateTime(event.created_at)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {sorted.length > visible && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary/50 hover:bg-primary/5"
              >
                Show more
              </button>
            </div>
          )}
        </>
      )}
    </AnalyticsPanel>
  );
}
