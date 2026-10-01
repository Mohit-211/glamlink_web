'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { ChartPoint } from './analyticsHelpers';
import { formatNumber, formatShortDate, parseApiDate } from './analyticsHelpers';
import { format } from 'date-fns';
import { AnalyticsEmptyState, AnalyticsPanel } from './AnalyticsStates';

// Teal is the brand primary nudged darker for 3:1 contrast on white; the blue
// shares the theme's 220° slate hue. Pair validated for CVD separation.
const SERIES = [
  { key: 'views', label: 'Views', color: '#1f9aa3' },
  { key: 'clicks', label: 'Clicks', color: '#3d5ba8' },
] as const;

const MARGIN = { top: 12, right: 12, bottom: 28, left: 36 };

/** Integer-friendly "nice" axis: 0 … top in 3–5 even steps. */
const niceTicks = (max: number): number[] => {
  if (max <= 0) return [0, 1];
  const raw = max / 4;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const normalized = raw / magnitude;
  const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  const step = Math.max(1, nice * magnitude);
  const top = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = 0; v <= top + 1e-9; v += step) ticks.push(Math.round(v));
  return ticks;
};

const formatTooltipDate = (value: string): string => {
  const d = parseApiDate(value);
  return d ? format(d, 'EEE, MMM d, yyyy') : value;
};

export default function ViewsClicksChart({
  data,
  rangeLabel,
}: {
  data: ChartPoint[];
  rangeLabel: string | null;
}) {
  const gradientId = useId().replace(/:/g, '');
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const hasActivity = data.some((d) => d.views > 0 || d.clicks > 0);
  const height = width > 0 && width < 480 ? 220 : 260;
  const innerW = Math.max(0, width - MARGIN.left - MARGIN.right);
  const innerH = height - MARGIN.top - MARGIN.bottom;

  const geometry = useMemo(() => {
    const max = Math.max(0, ...data.map((d) => Math.max(d.views, d.clicks)));
    const ticks = niceTicks(max);
    const top = ticks[ticks.length - 1] || 1;
    const n = data.length;
    const x = (i: number) =>
      MARGIN.left + (n <= 1 ? innerW / 2 : (i * innerW) / (n - 1));
    const y = (v: number) => MARGIN.top + innerH - (v / top) * innerH;
    const linePath = (key: 'views' | 'clicks') =>
      data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(2)},${y(d[key]).toFixed(2)}`).join(' ');
    const viewsArea =
      n > 1
        ? `${linePath('views')} L${x(n - 1).toFixed(2)},${y(0)} L${x(0).toFixed(2)},${y(0)} Z`
        : '';
    // Thin x labels so they never collide (~72px per label).
    const maxLabels = Math.max(1, Math.floor(innerW / 72));
    const stride = Math.max(1, Math.ceil(n / maxLabels));
    return { ticks, x, y, linePath, viewsArea, stride };
  }, [data, innerW, innerH]);

  const showMarkers = data.length <= 31;

  const indexFromClientX = (clientX: number, rect: DOMRect): number => {
    const n = data.length;
    if (n <= 1) return 0;
    const rel = clientX - rect.left - MARGIN.left;
    return Math.min(n - 1, Math.max(0, Math.round((rel / innerW) * (n - 1))));
  };

  const hovered = hover !== null ? data[hover] : null;
  const tooltipLeft = hover !== null ? geometry.x(hover) : 0;
  const flip = tooltipLeft > width * 0.6;

  return (
    <AnalyticsPanel
      title="Views & Clicks"
      subtitle={rangeLabel ? `Daily activity · ${rangeLabel}` : 'Daily activity'}
      action={
        hasActivity ? (
          <ul className="flex flex-shrink-0 items-center gap-3 text-xs text-muted-foreground" aria-label="Legend">
            {SERIES.map((s) => (
              <li key={s.key} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                {s.label}
              </li>
            ))}
          </ul>
        ) : null
      }
    >
      <div ref={containerRef} className="relative w-full" style={{ height: hasActivity ? height : undefined }}>
        {!hasActivity ? (
          <AnalyticsEmptyState
            compact
            title="No views or clicks in this period"
            message="Try a wider date range, or share your Access Card to start collecting activity."
          />
        ) : width > 0 ? (
          <>
            <svg
              width={width}
              height={height}
              role="img"
              aria-label="Line chart of daily views and clicks"
              className="block overflow-visible"
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={SERIES[0].color} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={SERIES[0].color} stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* Grid + y axis */}
              {geometry.ticks.map((t) => (
                <g key={t}>
                  <line
                    x1={MARGIN.left}
                    x2={width - MARGIN.right}
                    y1={geometry.y(t)}
                    y2={geometry.y(t)}
                    stroke="hsl(var(--border))"
                    strokeDasharray={t === 0 ? undefined : '3 4'}
                  />
                  <text
                    x={MARGIN.left - 8}
                    y={geometry.y(t)}
                    dy="0.32em"
                    textAnchor="end"
                    className="fill-muted-foreground text-[11px] tabular-nums"
                  >
                    {formatNumber(t)}
                  </text>
                </g>
              ))}

              {/* X labels */}
              {data.map((d, i) =>
                i % geometry.stride === 0 ? (
                  <text
                    key={d.date}
                    x={geometry.x(i)}
                    y={height - 8}
                    textAnchor={
                      data.length === 1 ? 'middle' : i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'
                    }
                    className="fill-muted-foreground text-[11px]"
                  >
                    {formatShortDate(d.date)}
                  </text>
                ) : null
              )}

              {/* Crosshair */}
              {hover !== null && (
                <line
                  x1={geometry.x(hover)}
                  x2={geometry.x(hover)}
                  y1={MARGIN.top}
                  y2={MARGIN.top + innerH}
                  stroke="hsl(var(--muted-foreground))"
                  strokeOpacity={0.4}
                />
              )}

              {/* Series */}
              {geometry.viewsArea && <path d={geometry.viewsArea} fill={`url(#${gradientId})`} />}
              {data.length > 1 &&
                SERIES.map((s) => (
                  <path
                    key={s.key}
                    d={geometry.linePath(s.key)}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={2}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                ))}
              {SERIES.map((s) =>
                data.map((d, i) =>
                  showMarkers || hover === i || data.length === 1 ? (
                    <circle
                      key={`${s.key}-${d.date}`}
                      cx={geometry.x(i)}
                      cy={geometry.y(d[s.key])}
                      r={hover === i ? 5 : 4}
                      fill={s.color}
                      stroke="hsl(var(--card))"
                      strokeWidth={2}
                    />
                  ) : null
                )
              )}

              {/* Hit area */}
              <rect
                x={MARGIN.left - 8}
                y={MARGIN.top}
                width={innerW + 16}
                height={innerH}
                fill="transparent"
                tabIndex={0}
                aria-label="Chart data. Use left and right arrow keys to move between days."
                className="cursor-crosshair outline-none"
                onPointerMove={(e) =>
                  setHover(indexFromClientX(e.clientX, (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect()))
                }
                onPointerLeave={() => setHover(null)}
                onFocus={() => setHover((h) => h ?? data.length - 1)}
                onBlur={() => setHover(null)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowLeft') setHover((h) => Math.max(0, (h ?? 0) - 1));
                  if (e.key === 'ArrowRight') setHover((h) => Math.min(data.length - 1, (h ?? -1) + 1));
                }}
              />
            </svg>

            {hovered && (
              <div
                className="pointer-events-none absolute z-10 min-w-[150px] rounded-xl border border-border bg-card px-3 py-2.5 text-xs shadow-[var(--shadow-soft)]"
                style={{
                  top: MARGIN.top,
                  left: flip ? undefined : tooltipLeft + 12,
                  right: flip ? width - tooltipLeft + 12 : undefined,
                }}
              >
                <p className="mb-1.5 font-medium text-foreground">{formatTooltipDate(hovered.date)}</p>
                {SERIES.map((s) => (
                  <div key={s.key} className="flex items-center justify-between gap-4 py-0.5">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                      {s.label}
                    </span>
                    <span className="font-semibold text-foreground tabular-nums">
                      {formatNumber(hovered[s.key])}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>

      {/* Screen-reader table view of the same data */}
      {hasActivity && (
        <table className="sr-only">
          <caption>Daily views and clicks</caption>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Views</th>
              <th scope="col">Clicks</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.date}>
                <th scope="row">{formatShortDate(d.date)}</th>
                <td>{d.views}</td>
                <td>{d.clicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AnalyticsPanel>
  );
}
