'use client';

import { useCallback, useRef, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Clock, RefreshCw } from 'lucide-react';
import type { ApiAnswer, OwnerRows } from '@/api/Api';
import { generateVideoThumbnail } from '@/components/glamcard/MediaAndProfileForm';
import { readApiError } from '@/lib/apiError';

/*
 * Pieces shared by the Media & Images and Education tabs (the profile pages'
 * owner API, contract of Nov 3). Both lists load in full, because a new order
 * is saved as every id at once.
 */

/** Uploads above this fail at the API (`UPLOAD_MAX_MB`), so they are refused here first. */
export const MAX_UPLOAD_MB = 50;
export const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

/** The live API answers a route it does not have yet with a bare 404 (no `code`). */
export const isNotDeployed = (err: unknown) => {
  const error = readApiError(err);
  return error.status === 404 && !error.code;
};

export const NOT_YET = "This isn't available yet.";

/** A refusal for people: "not available yet" for a route the API lacks, and the field it names, if any. */
export function ownerError(err: unknown, fallback: string) {
  const error = readApiError(err, fallback);
  const field = typeof error.details?.field === 'string' ? error.details.field : '';
  return { message: isNotDeployed(err) ? NOT_YET : error.message, field };
}

export type LoadState =
  | { status: 'loading' }
  | { status: 'ready' }
  | { status: 'unavailable'; message: string }
  | { status: 'error'; message: string };

/** A failed list load: a 404 means the feature isn't there for this account yet; anything else can be retried. */
export function failedLoad(err: unknown, fallback: string): LoadState {
  const error = readApiError(err, fallback);
  if (error.status === 404) return { status: 'unavailable', message: error.code ? error.message : NOT_YET };
  return { status: 'error', message: error.message };
}

const PAGE_LIMIT = 50;
const MAX_PAGES = 40;

/** Every row of a paged owner list, in the API's order (pages of 50, at most 2,000 rows). */
export async function loadAll<T extends { id: number }>(
  fetchPage: (params: { page: number; limit: number }) => Promise<ApiAnswer<OwnerRows<T>>>
): Promise<T[]> {
  const rows: T[] = [];
  const seen = new Set<number>();
  for (let page = 1; page <= MAX_PAGES; page++) {
    const answer = await fetchPage({ page, limit: PAGE_LIMIT });
    const batch = Array.isArray(answer?.data?.rows) ? answer.data.rows : [];
    const count = Number(answer?.data?.count ?? 0);
    let added = 0;
    for (const row of batch) {
      // A BIGINT id may come as a string; the order is saved as numbers.
      const id = Number(row?.id);
      if (!row || !Number.isFinite(id) || seen.has(id)) continue;
      seen.add(id);
      rows.push(row.id === id ? row : { ...row, id });
      added++;
    }
    // An API that ignores `page` answers the same rows again: stop rather than loop.
    if (!added || rows.length >= count) break;
  }
  return rows;
}

export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return list;
  const next = list.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export const chunk = <T,>(list: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(list.length / size) }, (_, i) => list.slice(i * size, i * size + size));

export type OrderStatus = 'idle' | 'saving' | 'saved';

/**
 * Saves a new order as soon as it changes, one request at a time: while one is
 * on its way, only the newest order waits behind it. A failure calls `onFailed`
 * (the tab reloads the list, so it shows the order the API kept).
 */
export function useOrderSaver(save: (ids: number[]) => Promise<unknown>, onFailed: (err: unknown) => void) {
  const [status, setStatus] = useState<OrderStatus>('idle');
  const inFlight = useRef(false);
  const queued = useRef<number[] | null>(null);

  const run = useCallback(
    async (ids: number[]) => {
      inFlight.current = true;
      setStatus('saving');
      let next: number[] | null = ids;
      while (next) {
        const current: number[] = next;
        queued.current = null;
        try {
          await save(current);
        } catch (err) {
          queued.current = null;
          inFlight.current = false;
          setStatus('idle');
          onFailed(err);
          return;
        }
        next = queued.current;
      }
      inFlight.current = false;
      setStatus('saved');
    },
    [save, onFailed]
  );

  const schedule = useCallback(
    (ids: number[]) => {
      if (inFlight.current) queued.current = ids;
      else void run(ids);
    },
    [run]
  );

  return { schedule, status };
}

export function OrderStatusNote({ status }: { status: OrderStatus }) {
  if (status === 'idle') return null;
  return (
    <p role="status" className="text-xs text-muted-foreground">
      {status === 'saving' ? 'Saving the order…' : 'Order saved.'}
    </p>
  );
}

export const isMp4 = (file: File) => file.type === 'video/mp4' || /\.mp4$/i.test(file.name);

/** A poster for an uploaded video, grabbed from a frame in the browser. Gives up after 20 seconds. */
export function makePoster(file: File, ms = 20000): Promise<File> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("We couldn't read this video.")), ms);
    generateVideoThumbnail(file).then(
      (poster) => {
        window.clearTimeout(timer);
        resolve(poster);
      },
      (err) => {
        window.clearTimeout(timer);
        reject(err);
      }
    );
  });
}

/** A YouTube or Vimeo link, made absolute ("youtu.be/…" gains https://); null for anything else. */
export function videoLink(raw: string): { url: string; provider: 'youtube' | 'vimeo' } | null {
  const text = raw.trim();
  if (!text) return null;
  let url: URL;
  try {
    url = new URL(/^[a-z][a-z\d+.-]*:/i.test(text) ? text : `https://${text}`);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
  const host = url.hostname.toLowerCase().replace(/^(www|m)\./, '');
  if (host === 'youtu.be' || host === 'youtube.com' || host.endsWith('.youtube.com') || host === 'youtube-nocookie.com') {
    return { url: url.toString(), provider: 'youtube' };
  }
  if (host === 'vimeo.com' || host.endsWith('.vimeo.com')) return { url: url.toString(), provider: 'vimeo' };
  return null;
}

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

export function FieldError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 text-xs text-destructive">
      {message}
    </p>
  );
}

/** A calm panel for "nothing here yet" and "not available yet". */
export function StatePanel({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-secondary">{icon}</span>
      <p className="font-semibold">{title}</p>
      {children}
    </div>
  );
}

export function UnavailablePanel({ message, children }: { message: string; children?: ReactNode }) {
  return (
    <div role="status">
      <StatePanel icon={<Clock className="h-6 w-6" aria-hidden="true" />} title={message}>
        {children}
      </StatePanel>
    </div>
  );
}

export function LoadErrorPanel({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border px-6 py-10 text-center">
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      <button type="button" onClick={onRetry} className="btn-outline px-4 py-2 text-xs">
        <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
        Try again
      </button>
    </div>
  );
}

/** Move-earlier and move-later buttons: arrows across in a grid, up and down in a list. */
export function MoveButtons({
  index,
  count,
  name,
  across,
  disabled,
  onMove,
}: {
  index: number;
  count: number;
  name: string;
  across?: boolean;
  disabled?: boolean;
  onMove: (to: number) => void;
}) {
  const Earlier = across ? ArrowLeft : ArrowUp;
  const Later = across ? ArrowRight : ArrowDown;
  const button =
    'rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-secondary disabled:pointer-events-none disabled:opacity-30';
  return (
    <>
      <button
        type="button"
        onClick={() => onMove(index - 1)}
        disabled={disabled || index === 0}
        aria-label={`Move ${name} earlier`}
        title="Move earlier"
        className={button}
      >
        <Earlier className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => onMove(index + 1)}
        disabled={disabled || index >= count - 1}
        aria-label={`Move ${name} later`}
        title="Move later"
        className={button}
      >
        <Later className="h-4 w-4" aria-hidden="true" />
      </button>
    </>
  );
}

/** A progress line for uploads; `fraction` null shows a working bar without a number. */
export function UploadProgressBar({ label, fraction }: { label: string; fraction: number | null }) {
  const percent = fraction === null ? null : Math.round(Math.max(0, Math.min(1, fraction)) * 100);
  return (
    <div role="status" className="space-y-1.5 rounded-2xl border border-border bg-muted/30 px-4 py-3">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="font-medium text-foreground">{label}</span>
        {percent !== null && <span className="text-muted-foreground">{percent}%</span>}
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent ?? undefined}
      >
        <div
          className={`h-full rounded-full bg-primary transition-[width] duration-300 ${percent === null ? 'w-1/3 animate-pulse' : ''}`}
          style={percent === null ? undefined : { width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
