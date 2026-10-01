import { addDays, format, isValid, parseISO } from 'date-fns';
import type {
  AnalyticsEvent,
  AnalyticsEventCounts,
  DailyAnalytics,
  DeviceBreakdown,
  EventMetadata,
} from './types';

/* ============================= */
/* 📌 Metadata */
/* ============================= */
const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** Never throws: null / empty / invalid JSON / non-object JSON all become {}. */
export const parseEventMetadata = (raw: unknown): EventMetadata => {
  if (isPlainObject(raw)) return raw as EventMetadata;
  if (typeof raw !== 'string' || raw.trim() === '') return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    // Some rows are double-encoded ("\"{...}\""), so unwrap one more level.
    if (typeof parsed === 'string') return parseEventMetadata(parsed);
    return isPlainObject(parsed) ? (parsed as EventMetadata) : {};
  } catch {
    return {};
  }
};

export const getMetaString = (meta: EventMetadata, key: string): string | null => {
  const value = meta[key];
  if (typeof value === 'string' && value.trim() !== '') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return null;
};

/* ============================= */
/* 📌 Event target */
/* ============================= */
export interface EventTargetDisplay {
  /** What to show in the cell. */
  text: string;
  /** Full value for the tooltip, when it differs from `text`. */
  title: string | null;
  /** Safe http(s) link to open, if any. */
  href: string | null;
}

const isHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

/** "https://www.glamlink.net/journal/64/x?y=1" → "glamlink.net/journal/64/x?y=1" */
export const prettyUrl = (value: string): string =>
  value.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/$/, '');

const COORDINATES = /^\s*-?\d{1,3}(\.\d+)?\s*,\s*-?\d{1,3}(\.\d+)?\s*$/;

export const getEventTargetDisplay = (event: AnalyticsEvent): EventTargetDisplay => {
  const meta = parseEventMetadata(event.metadata);
  const target = (event.event_target ?? '').trim();
  const href = target && isHttpUrl(target) ? target : null;

  if (event.event_type === 'LOCATION_CLICK') {
    const label = getMetaString(meta, 'label');
    const mapsHref = COORDINATES.test(target)
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(target.replace(/\s/g, ''))}`
      : href;
    return {
      text: label ?? (target || 'Location'),
      title: label && target ? target : null,
      href: mapsHref,
    };
  }

  // Link-style events carry a human title in metadata — prefer it over the raw URL.
  const metaTitle = getMetaString(meta, 'title') ?? getMetaString(meta, 'label');
  if (metaTitle) {
    return { text: metaTitle, title: target || null, href };
  }

  if (!target) return { text: '—', title: null, href: null };

  if (/^mailto:/i.test(target) || event.event_type === 'EMAIL_CLICK') {
    const email = target.replace(/^mailto:/i, '').split('?')[0];
    return { text: email, title: null, href: null };
  }
  if (/^tel:/i.test(target) || event.event_type === 'PHONE_CLICK') {
    return { text: target.replace(/^tel:/i, ''), title: null, href: null };
  }
  if (href) {
    return { text: prettyUrl(target), title: target, href };
  }
  return { text: target, title: target, href: null };
};

/* ============================= */
/* 📌 Dates & numbers */
/* ============================= */
export const toApiDate = (date: Date): string => format(date, 'yyyy-MM-dd');

/** Parses YYYY-MM-DD as a local calendar day (not UTC midnight). */
export const parseApiDate = (value: string): Date | null => {
  const d = parseISO(value);
  return isValid(d) ? d : null;
};

export const formatShortDate = (value: string): string => {
  const d = parseApiDate(value);
  return d ? format(d, 'MMM d') : value;
};

export const formatRangeLabel = (from: string, to: string): string => {
  const a = parseApiDate(from);
  const b = parseApiDate(to);
  if (!a || !b) return `${from} – ${to}`;
  if (from === to) return format(a, 'MMM d, yyyy');
  const sameYear = a.getFullYear() === b.getFullYear();
  return `${format(a, sameYear ? 'MMM d' : 'MMM d, yyyy')} – ${format(b, 'MMM d, yyyy')}`;
};

/** The user's IANA time zone (e.g. "Asia/Kolkata") — the same value Api.tsx sends as the `timezone` header. */
export const getUserTimeZone = (): string => {
  try {
    if (typeof Intl !== "undefined") {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    }
  } catch {
    // Ignore timezone detection errors
  }

  return "UTC";
};

let eventFormatters: {
  timeZone: string;
  dateTime: Intl.DateTimeFormat;
  hour: Intl.DateTimeFormat;
} | null = null;

const getEventFormatters = () => {
  const timeZone = getUserTimeZone();

  // Recreate formatter if timezone has changed
  if (!eventFormatters || eventFormatters.timeZone !== timeZone) {
    eventFormatters = {
      timeZone,

      dateTime: new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),

      hour: new Intl.DateTimeFormat("en-US", {
        timeZone,
        hour: "numeric",
        minute: "2-digit",
      }),
    };
  }

  return eventFormatters;
};

// Ends in "Z" or a "+05:30" / "-0400" style offset.
const HAS_ZONE_SUFFIX = /(Z|[+-]\d{2}:?\d{2})$/i;

/**
 * Backend timestamps are UTC but may lack the "Z" suffix
 * ("2026-10-01T08:15:23.000"), which JS would otherwise parse as local time.
 * Returns null for empty or invalid values.
 */
export const parseUTCDate = (utcTime: string | null | undefined): Date | null => {
  if (!utcTime) return null;

  try {
    const trimmed = utcTime.trim().replace(" ", "T");
    const normalizedUTC = HAS_ZONE_SUFFIX.test(trimmed) ? trimmed : `${trimmed}Z`;
    const date = new Date(normalizedUTC);

    return Number.isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};

/** "2026-10-01T08:15:23.000" → "Oct 1, 2026, 1:45 PM" in Asia/Kolkata. "" if invalid. */
export const formatUTCDateTime = (utcTime: string | null | undefined): string => {
  const date = parseUTCDate(utcTime);
  if (!date) return "";

  try {
    return getEventFormatters().dateTime.format(date);
  } catch {
    return "";
  }
};

/** "2026-10-01T08:15:23.000" → "1:45 PM" in Asia/Kolkata. "" if invalid. */
export const formatUTCTime = (utcTime: string | null | undefined): string => {
  const date = parseUTCDate(utcTime);
  if (!date) return "";

  try {
    return getEventFormatters().hour.format(date);
  } catch {
    return "";
  }
};

export const formatNumber = (value: number | null | undefined): string =>
  (Number.isFinite(value) ? (value as number) : 0).toLocaleString();

/* ============================= */
/* 📌 Chart series */
/* ============================= */
export interface ChartPoint {
  date: string;
  views: number;
  clicks: number;
}

const MAX_FILLED_DAYS = 400;

/**
 * Joins the backend's daily views/clicks by date. The backend only returns
 * days with activity, so days inside the range with no rows are filled with 0
 * (counts themselves are never recomputed).
 */
export const buildChartSeries = (
  dailyViews: DailyAnalytics[],
  dailyClicks: DailyAnalytics[],
  range: { from: string; to: string } | null
): ChartPoint[] => {
  const byDate = new Map<string, ChartPoint>();
  const add = (rows: DailyAnalytics[], key: 'views' | 'clicks') => {
    for (const row of rows ?? []) {
      if (!row?.date) continue;
      const date = row.date.slice(0, 10);
      const point = byDate.get(date) ?? { date, views: 0, clicks: 0 };
      point[key] += Number(row.count) || 0;
      byDate.set(date, point);
    }
  };
  add(dailyViews, 'views');
  add(dailyClicks, 'clicks');

  const from = range ? parseApiDate(range.from) : null;
  const to = range ? parseApiDate(range.to) : null;
  if (from && to && from <= to) {
    const filled: ChartPoint[] = [];
    for (let d = from, i = 0; d <= to && i < MAX_FILLED_DAYS; d = addDays(d, 1), i++) {
      const date = toApiDate(d);
      filled.push(byDate.get(date) ?? { date, views: 0, clicks: 0 });
      byDate.delete(date);
    }
    // Keep any rows the backend returned outside the stated range.
    return [...filled, ...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
  }
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
};

/* ============================= */
/* 📌 Breakdowns */
/* ============================= */
export interface EventCountItem {
  type: string;
  count: number;
}

/** Non-zero click events (views excluded), highest first. */
export const getClickActivity = (events: AnalyticsEventCounts | null | undefined): EventCountItem[] =>
  Object.entries(events ?? {})
    .filter(([type, count]) => type !== 'ACCESS_CARD_VIEW' && Number(count) > 0)
    .map(([type, count]) => ({ type, count: Number(count) }))
    .sort((a, b) => b.count - a.count || a.type.localeCompare(b.type));

const BASE_DEVICES = ['desktop', 'mobile', 'tablet'] as const;

/** Always lists desktop/mobile/tablet, plus any other type the API returns. */
export const getDeviceRows = (rows: DeviceBreakdown[] | null | undefined): EventCountItem[] => {
  const counts = new Map<string, number>(BASE_DEVICES.map((d) => [d, 0]));
  for (const row of rows ?? []) {
    const type = (row?.device_type || 'unknown').toString().toLowerCase();
    counts.set(type, (counts.get(type) ?? 0) + (Number(row?.count) || 0));
  }
  return [...counts.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
};

export const capitalize = (value: string): string =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
