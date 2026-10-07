'use client';

import React, { useMemo, useState } from 'react';
import {
  Receipt,
  ChevronDown,
  ExternalLink,
  XCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { CancelSubscription } from '@/api/Api';
import { cn } from '@/lib/utils';
import { EmptyState, PageHeader, StatusBadge, btn, formatDate, formatMoney, humanize, type Tone } from './shell/ui';

interface Payment {
  id: number;
  transaction_id: string;
  description: string;
  amount: string;
  created_at: string;
  payment_status: string;
  payment_mode?: string;
  receipt_url?: string;
  currency?: string;
  payment_type?: string; // e.g. 'SUBSCRIPTION_ONLY' | 'NFC_WITH_SUBSCRIPTION' | 'NFC_ONLY'
}

interface PaymentHistoryProps {
  payments?: Payment[];
}

const CANCELABLE_TYPES = ['SUBSCRIPTION_ONLY', 'NFC_WITH_SUBSCRIPTION'];

const getStatusConfig = (status: string): { label: string; tone: Tone } => {
  switch (status?.toUpperCase()) {
    case 'SUCCESS':
      return { label: 'Paid', tone: 'success' };
    case 'PENDING':
      return { label: 'Pending', tone: 'warning' };
    case 'FAILED':
      return { label: 'Failed', tone: 'danger' };
    case 'CANCELLED':
      return { label: 'Cancelled', tone: 'neutral' };
    default:
      return { label: humanize(status) || 'Unknown', tone: 'neutral' };
  }
};

const PURCHASE_LABELS: Record<string, string> = {
  SUBSCRIPTION_ONLY: 'Access Pro subscription',
  NFC_WITH_SUBSCRIPTION: 'Pro + NFC keychain',
  NFC_ONLY: 'NFC keychain',
};

// Shared column template so the header row and each payment row line up.
const COLUMNS = 'md:grid md:grid-cols-[minmax(0,1fr)_130px_120px_110px_100px_36px] md:items-center md:gap-4';

export default function PaymentHistory({
  payments = [],
}: PaymentHistoryProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [cancelledIds, setCancelledIds] = useState<Set<number>>(new Set());
  const [errorId, setErrorId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const summary = useMemo(() => {
    const successful = payments.filter((p) => p.payment_status?.toUpperCase() === 'SUCCESS');
    const total = successful.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const latest = [...payments]
      .filter((p) => !Number.isNaN(new Date(p.created_at).getTime()))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    return { total, currency: successful[0]?.currency, count: payments.length, latest };
  }, [payments]);

  const handleCancelSubscription = async (payment: Payment) => {
    setCancellingId(payment.id);
    setErrorId(null);
    setErrorMsg('');

    try {
      await CancelSubscription({}); // no payload needed, token is read internally
      setCancelledIds((prev) => new Set(prev).add(payment.id));
      setConfirmingId(null);
    } catch (err: any) {
      setErrorId(payment.id);
      setErrorMsg(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to cancel subscription. Please try again.'
      );
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div>
      <PageHeader title="Payment History" description="Receipts for your plan and keychain purchases." />

      {payments.length === 0 ? (
        <EmptyState
          bordered
          icon={Receipt}
          title="No payments yet"
          message="When you upgrade your plan or order an NFC keychain, your receipts will appear here."
        />
      ) : (
        <div className="space-y-6">
          {/* Summary */}
          <section
            aria-label="Billing summary"
            className="grid grid-cols-1 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0"
          >
            {[
              { label: 'Total paid', value: formatMoney(summary.total, summary.currency) },
              { label: 'Payments', value: String(summary.count) },
              { label: 'Last payment', value: summary.latest ? formatDate(summary.latest.created_at) : '—' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between gap-4 px-5 py-4 sm:block">
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                <p className="text-lg font-semibold tracking-tight text-foreground tabular-nums sm:mt-1 sm:text-2xl">{value}</p>
              </div>
            ))}
          </section>

          {/* List */}
          <section className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className={cn('hidden border-b border-border bg-secondary/40 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground', COLUMNS)}>
              <span>Description</span>
              <span>Date</span>
              <span>Method</span>
              <span>Status</span>
              <span className="text-right">Amount</span>
              <span className="sr-only">Details</span>
            </div>

            <ul className="divide-y divide-border">
              {payments.map((payment) => {
                const isCancelled = cancelledIds.has(payment.id);
                const config = isCancelled ? getStatusConfig('CANCELLED') : getStatusConfig(payment.payment_status);
                const isExpanded = expandedId === payment.id;
                const canCancel =
                  CANCELABLE_TYPES.includes(payment.payment_type || '') &&
                  !cancelledIds.has(payment.id);
                const isConfirming = confirmingId === payment.id;
                const isCancelling = cancellingId === payment.id;
                const hasError = errorId === payment.id;
                const method = humanize(payment.payment_mode) || '—';

                return (
                  <li key={payment.id}>
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : payment.id)}
                      aria-expanded={isExpanded}
                      className={cn(
                        'flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-secondary/40',
                        COLUMNS,
                        isExpanded && 'bg-secondary/40'
                      )}
                    >
                      {/* Description (+ mobile meta) */}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-foreground">{payment.description}</span>
                        {payment.payment_type && PURCHASE_LABELS[payment.payment_type] && (
                          <span className="hidden truncate text-xs text-muted-foreground md:block">
                            {PURCHASE_LABELS[payment.payment_type]}
                          </span>
                        )}
                        <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs capitalize text-muted-foreground md:hidden">
                          {formatDate(payment.created_at)} · {method}
                          <StatusBadge tone={config.tone}>{config.label}</StatusBadge>
                        </span>
                      </span>
                      <span className="hidden text-sm text-muted-foreground md:block">{formatDate(payment.created_at)}</span>
                      <span className="hidden truncate text-sm capitalize text-muted-foreground md:block">{method}</span>
                      <span className="hidden md:block">
                        <StatusBadge tone={config.tone}>{config.label}</StatusBadge>
                      </span>
                      <span className="flex-shrink-0 text-right text-sm font-semibold text-foreground tabular-nums">
                        {formatMoney(payment.amount, payment.currency)}
                      </span>
                      <ChevronDown
                        className={cn(
                          'mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform duration-200 md:mt-0 md:justify-self-end',
                          isExpanded && 'rotate-180'
                        )}
                        aria-hidden="true"
                      />
                    </button>

                    {isExpanded && (
                      <div className="border-t border-border bg-secondary/30 px-5 py-4">
                        <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                          <div>
                            <dt className="text-xs text-muted-foreground">Date</dt>
                            <dd className="mt-0.5 font-medium text-foreground">{formatDate(payment.created_at, 'long')}</dd>
                          </div>
                          <div>
                            <dt className="text-xs text-muted-foreground">Amount</dt>
                            <dd className="mt-0.5 font-medium text-foreground tabular-nums">{formatMoney(payment.amount, payment.currency)}</dd>
                          </div>
                          <div>
                            <dt className="text-xs text-muted-foreground">Payment mode</dt>
                            <dd className="mt-0.5 font-medium capitalize text-foreground">{payment.payment_mode || 'N/A'}</dd>
                          </div>
                          <div>
                            <dt className="text-xs text-muted-foreground">Currency</dt>
                            <dd className="mt-0.5 font-medium text-foreground">{(payment.currency || 'USD').toUpperCase()}</dd>
                          </div>
                        </dl>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          {payment.receipt_url && (
                            <a
                              href={payment.receipt_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={btn.chip}
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              View receipt
                            </a>
                          )}

                          {payment.payment_status !== "CANCELLED" && canCancel && !isConfirming && (
                            <button onClick={() => setConfirmingId(payment.id)} className={btn.danger}>
                              <XCircle className="h-3.5 w-3.5" />
                              Cancel subscription
                            </button>
                          )}

                          {canCancel && isConfirming && (
                            <div className="flex flex-wrap items-center gap-2 rounded-full border border-red-200 bg-red-50 py-1 pl-4 pr-1">
                              <span className="text-xs font-medium text-red-700">Cancel this subscription?</span>
                              <button
                                onClick={() => handleCancelSubscription(payment)}
                                disabled={isCancelling}
                                className="inline-flex h-8 items-center gap-1.5 rounded-full bg-red-600 px-3.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                              >
                                {isCancelling ? (
                                  <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    Cancelling...
                                  </>
                                ) : (
                                  'Yes, cancel'
                                )}
                              </button>
                              <button
                                onClick={() => setConfirmingId(null)}
                                disabled={isCancelling}
                                className="inline-flex h-8 items-center rounded-full bg-white px-3.5 text-xs font-semibold text-foreground hover:bg-secondary disabled:opacity-60"
                              >
                                Keep it
                              </button>
                            </div>
                          )}
                        </div>

                        {hasError && (
                          <p className="mt-3 flex items-center gap-1.5 text-xs text-red-600">
                            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                            {errorMsg}
                          </p>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
