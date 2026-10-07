'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNowStrict } from 'date-fns';
import { toast } from 'sonner';
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Check,
  Copy,
  CreditCard,
  ExternalLink,
  Eye,
  Lock,
  MousePointerClick,
  PenLine,
  Plus,
  QrCode,
  Receipt,
  RefreshCw,
  Share2,
  Sparkles,
  Users,
} from 'lucide-react';
import { getAccessCardAnalytics, getAccessCardAnalyticsEvents } from '@/api/Api';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { presetRange } from './analytics/AnalyticsDateFilter';
import { formatNumber, getEventTargetDisplay, parseUTCDate, prettyUrl } from './analytics/analyticsHelpers';
import { getEventConfig } from './analytics/eventConfig';
import type { AnalyticsEvent, AnalyticsSummary, ApiResponse, AnalyticsEvents, BusinessCardAnalytics } from './analytics/types';
import { getInitials, type TabId } from './shell/nav';
import { EmptyState, Panel, PanelLink, btn } from './shell/ui';

const RANGE_DAYS = 30;
const ACTIVITY_LIMIT = 5;
const PAYMENT_LIMIT = 3;

interface Props {
  userName: string;
  cards: any[];
  payments: any[];
  /** Access card fetch error from the dashboard ("Business card not found." means none yet). */
  cardError?: string;
  canEdit: boolean;
  onNavigate: (tab: TabId) => void;
  onEditCard: (card: any) => void;
}

const iconButton = btn.chip;

/* ───────────────────────── stats ───────────────────────── */

const STATS: { key: keyof AnalyticsSummary; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'total_views', label: 'Card views', icon: Eye },
  { key: 'unique_visitors', label: 'Unique visitors', icon: Users },
  { key: 'total_clicks', label: 'Link clicks', icon: MousePointerClick },
];

function StatsStrip({
  summary,
  loading,
  failed,
  onRetry,
}: {
  summary: AnalyticsSummary | null;
  loading: boolean;
  failed: boolean;
  onRetry: () => void;
}) {
  const allZero = !!summary && STATS.every((s) => !summary[s.key]);

  return (
    <section aria-label="Key statistics">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Performance</h2>
        <p className="text-xs text-muted-foreground">Last {RANGE_DAYS} days</p>
      </div>
      <div className="grid grid-cols-1 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {STATS.map(({ key, label, icon: Icon }) => (
          <div key={key} className="flex items-center justify-between gap-4 px-5 py-4 sm:block sm:py-5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon className="h-4 w-4 text-primary" />
              <p className="text-xs font-medium">{label}</p>
            </div>
            {loading ? (
              <Skeleton className="h-8 w-16 sm:mt-2" />
            ) : (
              <p className="text-2xl font-semibold tracking-tight text-foreground tabular-nums sm:mt-2 sm:text-3xl">
                {failed || !summary ? '—' : formatNumber(summary[key])}
              </p>
            )}
          </div>
        ))}
      </div>
      {failed && !loading ? (
        <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <AlertCircle className="h-3.5 w-3.5 text-destructive" />
          We couldn&apos;t load your statistics.
          <button type="button" onClick={onRetry} className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
            <RefreshCw className="h-3 w-3" /> Retry
          </button>
        </p>
      ) : allZero && !loading ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Your analytics will appear here once people start interacting with your profile.
        </p>
      ) : null}
    </section>
  );
}

/* ───────────────────────── access card ───────────────────────── */

function AccessCardPreview({
  card,
  extraCards,
  canEdit,
  onNavigate,
  onEditCard,
}: {
  card: any;
  extraCards: number;
  canEdit: boolean;
  onNavigate: (tab: TabId) => void;
  onEditCard: (card: any) => void;
}) {
  const [copied, setCopied] = useState(false);
  const link: string = card?.business_card_link || '';
  const isRejected = (card?.status || '').toLowerCase() === 'rejected';

  const copyLink = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success('Link copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Unable to copy link');
    }
  };

  const shareLink = async () => {
    if (!link) return;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: card?.name ? `${card.name} on Glamlink` : 'My Glamlink Access Card', url: link });
      } catch (err: any) {
        if (err?.name !== 'AbortError') copyLink();
      }
    } else {
      copyLink();
    }
  };

  return (
    <Panel
      title="Your Access Card"
      action={<PanelLink onClick={() => onNavigate('my-card')}>{extraCards > 0 ? `All cards (${extraCards + 1})` : 'Manage'}</PanelLink>}
    >
      {/* Mini card — mirrors the public card: teal edge, avatar, name, title */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-background">
        <div className="absolute inset-y-0 left-0 w-1 bg-primary" aria-hidden="true" />
        <div className="flex items-center gap-4 py-4 pl-5 pr-4">
          {card?.profile_image ? (
            <img src={card.profile_image} alt="" className="h-14 w-14 flex-shrink-0 rounded-full object-cover ring-2 ring-primary/20" />
          ) : (
            <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-accent text-base font-semibold text-accent-foreground ring-2 ring-primary/20">
              {getInitials(card?.name)}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold text-foreground">{card?.name || 'Your name'}</p>
            {card?.professional_title && <p className="truncate text-sm font-medium text-primary">{card.professional_title}</p>}
            {card?.business_name && <p className="truncate text-xs text-muted-foreground">{card.business_name}</p>}
          </div>
        </div>
        {link && !isRejected && (
          <div className="flex items-center gap-2 border-t border-border bg-secondary/40 py-2 pl-5 pr-2">
            <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-muted-foreground">{prettyUrl(link)}</span>
            <button
              type="button"
              onClick={copyLink}
              aria-label="Copy link"
              className="flex-shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        )}
      </div>

      {isRejected && (
        <div role="alert" className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
          <span>Your Access Card was rejected. Update your details and submit it again — it stays hidden until approved.</span>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <a
          href={isRejected || !link ? undefined : link}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={isRejected || !link}
          onClick={(e) => (isRejected || !link) && e.preventDefault()}
          className={cn('btn-primary !h-9 !px-4 !py-0 !text-xs !shadow-none', (isRejected || !link) && 'pointer-events-none opacity-50')}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View card
        </a>
        {canEdit ? (
          <button type="button" onClick={() => onEditCard(card)} className={iconButton}>
            <PenLine className="h-3.5 w-3.5" /> Edit
          </button>
        ) : (
          <button type="button" onClick={() => onNavigate('subscription-plans')} className={iconButton} title="Subscribe to unlock editing">
            <Lock className="h-3.5 w-3.5" /> Unlock editing
          </button>
        )}
        <button type="button" onClick={shareLink} disabled={!link || isRejected} className={iconButton}>
          <Share2 className="h-3.5 w-3.5" /> Share
        </button>
        <button type="button" onClick={() => onNavigate('qr-code')} className={iconButton}>
          <QrCode className="h-3.5 w-3.5" /> QR code
        </button>
      </div>
    </Panel>
  );
}

function NoAccessCard() {
  return (
    <section className="flex flex-col items-start gap-5 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
          <CreditCard className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Create your Glamlink Access Card</h2>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
            One link for your services, booking, socials and location — ready to share with every client.
          </p>
        </div>
      </div>
      <Link href="/access" className="btn-primary w-full flex-shrink-0 sm:w-auto">
        <Plus className="h-4 w-4" />
        Create Access Card
      </Link>
    </section>
  );
}

/* ───────────────────────── activity / payments ───────────────────────── */

function relativeTime(value: string): string {
  const d = parseUTCDate(value);
  return d ? formatDistanceToNowStrict(d, { addSuffix: true }) : '';
}

function RecentActivityList({
  rows,
  loading,
  failed,
  onRetry,
  onViewAll,
}: {
  rows: AnalyticsEvent[];
  loading: boolean;
  failed: boolean;
  onRetry: () => void;
  onViewAll: () => void;
}) {
  return (
    <Panel title="Recent activity" action={rows.length > 0 ? <PanelLink onClick={onViewAll}>View all</PanelLink> : undefined}>
      {loading ? (
        <ul className="space-y-4" aria-busy="true">
          {Array.from({ length: 4 }, (_, i) => (
            <li key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-2.5 w-1/3" />
              </div>
            </li>
          ))}
        </ul>
      ) : failed ? (
        <EmptyState
          icon={AlertCircle}
          title="Unable to load activity"
          action={
            <button type="button" onClick={onRetry} className={iconButton}>
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </button>
          }
        />
      ) : rows.length === 0 ? (
        <EmptyState icon={BarChart3} title="No recent activity yet." message="Views and clicks on your Access Card will show up here." />
      ) : (
        <ul className="divide-y divide-border">
          {rows.slice(0, ACTIVITY_LIMIT).map((event) => {
            const { activityLabel, icon: Icon } = getEventConfig(event.event_type);
            const target = getEventTargetDisplay(event).text;
            return (
              <li key={event.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{activityLabel}</p>
                  {target && target !== '—' && <p className="truncate text-xs text-muted-foreground">{target}</p>}
                </div>
                <span className="flex-shrink-0 text-[11px] text-muted-foreground">{relativeTime(event.created_at)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}

const PAYMENT_STATUS: Record<string, string> = {
  SUCCESS: 'bg-emerald-500',
  PENDING: 'bg-amber-400',
  FAILED: 'bg-red-500',
};

function RecentPayments({ payments, onViewAll }: { payments: any[]; onViewAll: () => void }) {
  return (
    <Panel title="Recent payments" action={payments.length > 0 ? <PanelLink onClick={onViewAll}>View all</PanelLink> : undefined}>
      {payments.length === 0 ? (
        <EmptyState icon={Receipt} title="No payments yet" message="Receipts for your plan and NFC orders will appear here." />
      ) : (
        <ul className="divide-y divide-border">
          {payments.slice(0, PAYMENT_LIMIT).map((p) => {
            const status = String(p?.payment_status || '').toUpperCase();
            const date = p?.created_at ? new Date(p.created_at) : null;
            return (
              <li key={p.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{p?.description || 'Payment'}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs capitalize text-muted-foreground">
                    <span className={cn('h-1.5 w-1.5 rounded-full', PAYMENT_STATUS[status] ?? 'bg-muted-foreground/50')} aria-hidden="true" />
                    {status.toLowerCase() || 'unknown'}
                    {date && !isNaN(date.getTime()) && (
                      <> · {date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</>
                    )}
                  </p>
                </div>
                <span className="flex-shrink-0 text-sm font-semibold text-foreground tabular-nums">
                  ${Number(p?.amount || 0).toFixed(2)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}

/* ───────────────────────── quick actions ───────────────────────── */

function QuickActions({ hasCard, canEdit, onNavigate }: { hasCard: boolean; canEdit: boolean; onNavigate: (tab: TabId) => void }) {
  const actions: { tab: TabId; label: string; hint: string; icon: React.ComponentType<{ className?: string }> }[] = [
    canEdit
      ? { tab: 'edit-card', label: 'Edit Access Card', hint: 'Update details and links', icon: PenLine }
      : { tab: 'subscription-plans', label: 'Upgrade plan', hint: 'Unlock editing and more', icon: Sparkles },
    { tab: 'analytics', label: 'View analytics', hint: 'Views, clicks, devices', icon: BarChart3 },
    { tab: 'qr-code', label: 'QR code', hint: 'Download or share', icon: QrCode },
    { tab: 'payment-history', label: 'Payments', hint: 'Receipts and subscription', icon: Receipt },
  ];

  return (
    <section aria-label="Quick actions" className="min-w-0">
      <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Quick actions</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {actions.map(({ tab, label, hint, icon: Icon }) => {
          const disabled = !hasCard && tab !== 'payment-history' && tab !== 'subscription-plans';
          return (
            <button
              key={tab}
              type="button"
              disabled={disabled}
              onClick={() => onNavigate(tab)}
              className="group flex min-h-[56px] items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-primary/[0.03] disabled:pointer-events-none disabled:opacity-50"
            >
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-foreground">{label}</span>
                <span className="block truncate text-xs text-muted-foreground">{hint}</span>
              </span>
              <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ───────────────────────── page ───────────────────────── */

export default function DashboardOverview({ userName, cards, payments, cardError, canEdit, onNavigate, onEditCard }: Props) {
  const card = cards[0] ?? null;
  const cardId = card?.id != null ? String(card.id) : '';
  const hasCard = !!card && cardError !== 'Business card not found.';

  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(hasCard);
  const [failed, setFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const requestRef = useRef(0);

  useEffect(() => {
    if (!hasCard || !cardId) {
      setLoading(false);
      return;
    }
    const requestId = ++requestRef.current;
    setLoading(true);
    setFailed(false);
    const params = presetRange(RANGE_DAYS);
    Promise.all([
      getAccessCardAnalytics(cardId, params) as Promise<ApiResponse<BusinessCardAnalytics>>,
      getAccessCardAnalyticsEvents(cardId, params) as Promise<ApiResponse<AnalyticsEvents>>,
    ])
      .then(([summaryRes, eventsRes]) => {
        if (requestId !== requestRef.current) return;
        if (!summaryRes?.data?.summary) throw new Error('Malformed analytics response');
        setSummary(summaryRes.data.summary);
        setEvents(Array.isArray(eventsRes?.data?.rows) ? eventsRes.data.rows : []);
      })
      .catch((err: unknown) => {
        if (requestId !== requestRef.current) return;
        console.error('Dashboard overview analytics failed:', err);
        setSummary(null);
        setEvents([]);
        setFailed(true);
      })
      .finally(() => {
        if (requestId === requestRef.current) setLoading(false);
      });
  }, [hasCard, cardId, reloadKey]);

  const retry = useCallback(() => setReloadKey((k) => k + 1), []);
  const firstName = (userName || '').trim().split(' ')[0];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
            Welcome back{firstName ? `, ${firstName}` : ''}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {hasCard
              ? 'Here’s how your Glamlink presence is performing.'
              : 'Set up your Access Card to start sharing your work with clients.'}
          </p>
        </div>
        {hasCard && card?.business_card_link && (card?.status || '').toLowerCase() !== 'rejected' && (
          <a href={card.business_card_link} target="_blank" rel="noopener noreferrer" className="btn-outline !py-2.5 self-start sm:self-auto">
            <ExternalLink className="h-4 w-4" />
            View public card
          </a>
        )}
      </section>

      {hasCard ? (
        <>
          <StatsStrip summary={summary} loading={loading} failed={failed} onRetry={retry} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="min-w-0 lg:col-span-3">
              <AccessCardPreview
                card={card}
                extraCards={cards.length - 1}
                canEdit={canEdit}
                onNavigate={onNavigate}
                onEditCard={onEditCard}
              />
            </div>
            <div className="min-w-0 lg:col-span-2">
              <RecentActivityList
                rows={events}
                loading={loading}
                failed={failed}
                onRetry={retry}
                onViewAll={() => onNavigate('analytics')}
              />
            </div>
          </div>
        </>
      ) : (
        <NoAccessCard />
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="min-w-0 lg:col-span-3">
          <QuickActions hasCard={hasCard} canEdit={canEdit} onNavigate={onNavigate} />
        </div>
        <div className="min-w-0 lg:col-span-2 lg:pt-[26px]">
          <RecentPayments payments={payments} onViewAll={() => onNavigate('payment-history')} />
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── skeleton for first load ───────────────────────── */

export function DashboardOverviewSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading dashboard">
      <div>
        <Skeleton className="h-8 w-64 max-w-full" />
        <Skeleton className="mt-2 h-4 w-80 max-w-full" />
      </div>
      <div>
        <Skeleton className="mb-3 h-3 w-24" />
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-border sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="px-5 py-5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-3 h-8 w-16" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Skeleton className="h-[230px] rounded-2xl lg:col-span-3" />
        <Skeleton className="h-[230px] rounded-2xl lg:col-span-2" />
      </div>
    </div>
  );
}
