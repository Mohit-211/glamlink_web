'use client';

import React, { useState } from 'react';
import {
  Receipt,
  ChevronDown,
  ChevronUp,
  CreditCard,
  ExternalLink,
  XCircle,
  Loader2,
} from 'lucide-react';
import { CancelSubscription } from '@/api/Api';

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

export default function PaymentHistory({
  payments = [],
}: PaymentHistoryProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [cancelledIds, setCancelledIds] = useState<Set<number>>(new Set());
  const [errorId, setErrorId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const getStatusConfig = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'SUCCESS':
        return {
          label: 'Success',
          cls: 'bg-green-100 text-green-700 border-green-200',
        };
      case 'PENDING':
        return {
          label: 'Pending',
          cls: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        };
      case 'FAILED':
        return {
          label: 'Failed',
          cls: 'bg-red-100 text-red-700 border-red-200',
        };
      default:
        return {
          label: status || 'Unknown',
          cls: 'bg-gray-100 text-gray-700 border-gray-200',
        };
    }
  };

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Payment History
          </h2>

          <p className="text-xs text-muted-foreground mt-0.5">
            {payments.length} payments total
          </p>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="card-glamlink flex flex-col items-center justify-center py-12 text-center !hover:transform-none">
          <CreditCard className="h-10 w-10 text-muted-foreground/40 mb-3" />

          <p className="text-sm font-medium text-muted-foreground">
            No payments found
          </p>

          <p className="text-xs text-muted-foreground mt-1">
            Your payment history will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => {
            const config = getStatusConfig(payment.payment_status);
            const isExpanded = expandedId === payment.id;
            const canCancel =
              CANCELABLE_TYPES.includes(payment.payment_type || '') &&
              !cancelledIds.has(payment.id);
            const isConfirming = confirmingId === payment.id;
            const isCancelling = cancellingId === payment.id;
            const hasError = errorId === payment.id;

            return (
              <div
                key={payment.id}
                className="rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] overflow-hidden"
              >
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent">
                    <Receipt className="h-5 w-5 text-accent-foreground" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        {payment.description}
                      </p>

                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${config.cls}`}
                      >
                        {config.label}
                      </span>

                      {cancelledIds.has(payment.id) && (
                        <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-500 border-gray-200">
                          Cancelled
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground mt-0.5">
                      {/* {payment.transaction_id} ·{' '} */}
                      {new Date(payment.created_at).toLocaleDateString(
                        'en-IN',
                        {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        }
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <p className="text-base font-bold text-primary">
                      ${Number(payment.amount).toFixed(2)}
                    </p>

                    <button
                      onClick={() =>
                        setExpandedId(
                          isExpanded ? null : payment.id
                        )
                      }
                      className="rounded-lg p-1.5 hover:bg-secondary transition-colors text-muted-foreground"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-border bg-secondary/30 px-5 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {/* <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                          Transaction ID
                        </p>

                        <p className="font-mono text-foreground break-all">
                          {payment.transaction_id}
                        </p>
                      </div> */}

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                          Date
                        </p>

                        <p className="text-foreground">
                          {new Date(payment.created_at).toLocaleDateString(
                            'en-IN',
                            {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            }
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                          Amount
                        </p>

                        <p className="font-semibold text-foreground">
                          ${Number(payment.amount).toFixed(2)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                          Status
                        </p>

                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${config.cls}`}
                        >
                          {config.label}
                        </span>
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                          Payment Mode
                        </p>

                        <p className="text-foreground">
                          {payment.payment_mode || 'N/A'}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                          Currency
                        </p>

                        <p className="text-foreground">
                          {payment.currency || 'USD'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      {payment.receipt_url && (
                        <a
                          href={payment.receipt_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:opacity-90"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View Receipt
                        </a>
                      )}

                      {canCancel && !isConfirming && (
                        <button
                          onClick={() => setConfirmingId(payment.id)}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4" />
                          Cancel Subscription
                        </button>
                      )}

                      {canCancel && isConfirming && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            Are you sure?
                          </span>

                          <button
                            onClick={() => handleCancelSubscription(payment)}
                            disabled={isCancelling}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60"
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
                            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary disabled:opacity-60"
                          >
                            Keep it
                          </button>
                        </div>
                      )}
                    </div>

                    {hasError && (
                      <p className="mt-2 text-xs text-red-600">{errorMsg}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}