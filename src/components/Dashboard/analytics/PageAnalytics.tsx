'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { getMyProfileAnalytics } from '@/api/Api';
import { readApiError } from '@/lib/apiError';
import type { AnalyticsEventCounts, AnalyticsSummary, DailyAnalytics, DateRangeValue, DeviceBreakdown as DeviceRow } from './types';
import { buildChartSeries, formatNumber, formatRangeLabel } from './analyticsHelpers';
import AnalyticsDateFilter, { presetRange } from './AnalyticsDateFilter';
import AnalyticsSummaryCards from './AnalyticsSummaryCards';
import ViewsClicksChart from './ViewsClicksChart';
import ClickActivity from './ClickActivity';
import DeviceBreakdown from './DeviceBreakdown';
import { getEventConfig } from './eventConfig';
import {
  AnalyticsEmptyState,
  AnalyticsErrorState,
  AnalyticsPanel,
  AnalyticsSkeleton,
  AnalyticsUpgradeState,
} from './AnalyticsStates';

/*
 * Views and clicks on the owner's page (/profiles/<slug>), from
 * GET /my/profile/analytics (backend handoff, 10.17), in the card analytics' shape.
 */

interface PageAnalyticsData {
  page: { id: number; slug: string; name: string; visible: boolean };
  date_range: DateRangeValue | null;
  summary: AnalyticsSummary;
  events: AnalyticsEventCounts;
  daily_views: DailyAnalytics[];
  daily_clicks: DailyAnalytics[];
  device_breakdown: DeviceRow[];
  top_targets: { event_type: string; event_target: string | null; count: number }[];
}

const DEFAULT_PRESET_DAYS = 30;

/** "instagram" or a link, readable. */
const targetLabel = (type: string, target: string | null) => {
  if (!target) return getEventConfig(type).activityLabel;
  if (type === 'PRODUCT_CLICK') return `Product #${target}`;
  try {
    return new URL(target).hostname.replace(/^www\./, '');
  } catch {
    return target;
  }
};

/** `locked`: a Free owner; analytics are part of Access Pro, so the tab offers the subscription instead. */
export default function PageAnalytics({ locked = false, onUpgrade }: { locked?: boolean; onUpgrade?: () => void }) {
  const [range, setRange] = useState<DateRangeValue>(() => presetRange(DEFAULT_PRESET_DAYS));
  const [data, setData] = useState<PageAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const requestRef = useRef(0);

  useEffect(() => {
    if (locked) return;
    const requestId = ++requestRef.current;
    getMyProfileAnalytics({ from: range.from, to: range.to })
      .then((res) => {
        if (requestId !== requestRef.current) return;
        if (!res?.data?.summary) throw new Error('Malformed analytics response');
        setData(res.data as PageAnalyticsData);
        setFailed(null);
      })
      .catch((err: unknown) => {
        if (requestId !== requestRef.current) return;
        const error = readApiError(err, 'Unable to load page analytics');
        setData(null);
        // "upgrade": analytics are part of Access Pro; other 403s and 404s mean no page yet.
        if (error.code === 'UPGRADE_REQUIRED') {
          setFailed('upgrade');
          return;
        }
        setFailed(error.status === 404 || error.status === 403 ? error.message : 'error');
        if (error.status !== 404 && error.status !== 403) toast.error('Unable to load page analytics', { id: 'page-analytics-error' });
      })
      .finally(() => {
        if (requestId === requestRef.current) setLoading(false);
      });
  }, [range.from, range.to, reloadKey, locked]);

  const retry = useCallback(() => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  }, []);

  const appliedRange = data?.date_range?.from && data?.date_range?.to ? data.date_range : range;
  const rangeLabel = formatRangeLabel(appliedRange.from, appliedRange.to);
  const chartSeries = useMemo(
    () => (data ? buildChartSeries(data.daily_views, data.daily_clicks, appliedRange) : []),
    [data, appliedRange]
  );
  // Views are counted in the summary; Click Activity lists what was clicked
  const clicks = useMemo(
    () =>
      Object.fromEntries(Object.entries(data?.events ?? {}).filter(([type]) => type !== 'PAGE_VIEW')) as AnalyticsEventCounts,
    [data]
  );

  const isEmpty = !!data && !data.summary.total_views && !data.summary.total_clicks;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">Page Analytics</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Views of your page and what visitors clicked{data?.page?.name ? ` on ${data.page.name}` : ''}.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-shrink-0 sm:items-end">
          {!locked && failed !== 'upgrade' && (
            <AnalyticsDateFilter
              value={range}
              onChange={(next) => {
                setLoading(true);
                setRange(next);
              }}
              disabled={loading}
            />
          )}
          {data && !loading && <p className="text-xs text-muted-foreground">Showing {rangeLabel}</p>}
        </div>
      </div>

      {locked || failed === 'upgrade' ? (
        <AnalyticsUpgradeState onUpgrade={onUpgrade} />
      ) : loading ? (
        <AnalyticsSkeleton />
      ) : failed && failed !== 'error' ? (
        <AnalyticsEmptyState title="No page yet" message={failed} />
      ) : failed || !data ? (
        <AnalyticsErrorState onRetry={retry} />
      ) : (
        <>
          <AnalyticsSummaryCards summary={data.summary} subject="page" />
          {isEmpty ? (
            <AnalyticsEmptyState
              title="No visits yet"
              message="Views of your page and clicks on its links will appear here once visitors find it."
            />
          ) : (
            <>
              <ViewsClicksChart data={chartSeries} rangeLabel={rangeLabel} />
              <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2">
                <ClickActivity events={clicks} subject="page" />
                <DeviceBreakdown rows={data.device_breakdown} subject="page" />
              </div>
              {data.top_targets?.length > 0 && (
                <AnalyticsPanel title="Most clicked" subtitle="The links and products visitors chose most">
                  <ol className="space-y-3">
                    {data.top_targets.map((t, i) => {
                      const { icon: Icon } = getEventConfig(t.event_type);
                      return (
                        <li key={`${t.event_type}-${t.event_target}-${i}`} className="flex items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <span className="min-w-0 flex-1 truncate text-sm">{targetLabel(t.event_type, t.event_target)}</span>
                          <span className="text-sm font-semibold tabular-nums">{formatNumber(t.count)}</span>
                        </li>
                      );
                    })}
                  </ol>
                </AnalyticsPanel>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
