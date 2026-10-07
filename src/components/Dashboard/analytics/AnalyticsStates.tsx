import React from 'react';
import { AlertCircle, BarChart3, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/* ============================= */
/* 📌 Panel */
/* ============================= */
export function AnalyticsPanel({
  title,
  subtitle,
  action,
  className,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        'min-w-0 rounded-2xl border border-border bg-card p-5',
        className
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground sm:text-base">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/* ============================= */
/* 📌 Loading */
/* ============================= */
const panelClass = 'rounded-2xl border border-border bg-card p-5';

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6" aria-busy="true" aria-label="Loading analytics">
      <div className="grid grid-cols-1 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {[0, 1, 2].map((i) => (
          <div key={i} className="px-5 py-5">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="mt-3 h-8 w-20" />
            <Skeleton className="mt-2 h-3 w-40 max-w-full" />
          </div>
        ))}
      </div>
      <div className={panelClass}>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-2 h-3 w-48" />
        <Skeleton className="mt-5 h-[220px] w-full rounded-xl sm:h-[260px]" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className={panelClass}>
            <Skeleton className="h-4 w-32" />
            <div className="mt-5 space-y-4">
              {[0, 1, 2, 3].map((j) => (
                <div key={j} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-1.5 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={panelClass}>
        <Skeleton className="h-4 w-32" />
        <div className="mt-5 space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================= */
/* 📌 Empty / Error */
/* ============================= */
export function AnalyticsEmptyState({
  title = 'No analytics yet',
  message = 'Your Access Card activity will appear here once visitors start interacting with your card.',
  compact = false,
}: {
  title?: string;
  message?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'py-8' : 'rounded-2xl border border-dashed border-border bg-card px-6 py-14'
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
        <BarChart3 className="h-5 w-5" />
      </div>
      <p className="mt-4 text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground sm:text-sm">{message}</p>
    </div>
  );
}

export function AnalyticsErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-6 py-12 text-center sm:py-16">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="h-5 w-5" />
      </div>
      <p className="mt-4 text-sm font-semibold text-foreground">Unable to load analytics</p>
      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">Please try again.</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Retry
      </button>
    </div>
  );
}
