// Shared building blocks for every dashboard section, so My Access Card, QR,
// Analytics, Payments, Plans, Password and Addresses all read as one product.
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ───────────────────────── page + panels ───────────────────────── */

export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({
  title,
  description,
  action,
  className,
  bodyClassName,
  children,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn('min-w-0 rounded-2xl border border-border bg-card', className)}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-3 px-5 pt-5">
          <div className="min-w-0">
            {title && <h2 className="text-sm font-semibold text-foreground">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={cn('p-5', (title || action) && 'pt-4', bodyClassName)}>{children}</div>
    </section>
  );
}

export function PanelLink({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex flex-shrink-0 items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
    >
      {children}
      <ArrowRight className="h-3.5 w-3.5" />
    </button>
  );
}

/** Small uppercase label used above values and list groups. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-[11px] font-semibold uppercase tracking-widest text-muted-foreground', className)}>
      {children}
    </p>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  message,
  action,
  bordered = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  message?: React.ReactNode;
  action?: React.ReactNode;
  /** Dashed outline for when the empty state stands alone on the page. */
  bordered?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 text-center',
        bordered ? 'rounded-2xl border border-dashed border-border bg-card py-14' : 'py-10'
      )}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-4 text-sm font-semibold text-foreground">{title}</p>
      {message && <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ───────────────────────── status ───────────────────────── */

export type Tone = 'success' | 'warning' | 'danger' | 'brand' | 'neutral';

const TONES: Record<Tone, { badge: string; dot: string }> = {
  success: { badge: 'border-emerald-200 bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  warning: { badge: 'border-amber-200 bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  danger: { badge: 'border-red-200 bg-red-50 text-red-700', dot: 'bg-red-500' },
  brand: { badge: 'border-primary/25 bg-primary/10 text-accent-foreground', dot: 'bg-primary' },
  neutral: { badge: 'border-border bg-secondary text-muted-foreground', dot: 'bg-muted-foreground/60' },
};

export function StatusBadge({ tone, children, className }: { tone: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize leading-5',
        TONES[tone].badge,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 flex-shrink-0 rounded-full', TONES[tone].dot)} aria-hidden="true" />
      {children}
    </span>
  );
}

/** Maps the various status strings the API returns onto a badge tone. */
export function toneForStatus(status?: string | null): Tone {
  const s = (status || '').toLowerCase();
  if (['success', 'paid', 'completed', 'active', 'approved', 'delivered', 'shipped', 'published'].includes(s)) return 'success';
  if (['pending', 'processing', 'in_review', 'review', 'unpaid', 'fulfilled', 'unfulfilled'].includes(s)) return 'warning';
  if (['failed', 'rejected', 'cancelled', 'canceled', 'expired', 'inactive'].includes(s)) return 'danger';
  return 'neutral';
}

export const humanize = (value?: string | null): string =>
  (value || '').replace(/_/g, ' ').trim().toLowerCase();

/* ───────────────────────── controls ───────────────────────── */

export const btn = {
  primary:
    'inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2',
  outline:
    'inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
  /** Compact pill used for secondary actions in rows and toolbars. */
  chip:
    'inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-border bg-background px-3.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
  icon:
    'inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
  danger:
    'inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-red-200 bg-background px-3.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:pointer-events-none disabled:opacity-50',
};

export const field = {
  label: 'mb-1.5 block text-sm font-medium text-foreground',
  input:
    'h-11 w-full rounded-xl border border-input bg-background px-3.5 text-base text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60 sm:text-sm',
};

/* ───────────────────────── formatting ───────────────────────── */

export function formatMoney(amount: unknown, currency?: string | null): string {
  const n = Number(amount);
  if (!Number.isFinite(n)) return '—';
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: (currency || 'USD').toUpperCase() }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

export function formatDate(value?: string | null, month: 'short' | 'long' = 'short'): string {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-US', { day: 'numeric', month, year: 'numeric' });
}
