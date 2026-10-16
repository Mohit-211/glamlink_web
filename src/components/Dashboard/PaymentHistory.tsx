'use client';

import React, { useState } from 'react';
import {
  Receipt,
  ChevronDown,
  ChevronUp,
  CreditCard,
  ExternalLink,
} from 'lucide-react';

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


export default function PaymentHistory({
  payments = [],
}: PaymentHistoryProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const getStatusConfig = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'SUCCESS':
        return {
          label: 'Success',
          cls: 'bg-success/10 text-success border-success/30',
        };
      case 'PENDING':
        return {
          label: 'Pending',
          cls: 'bg-warning/10 text-warning border-warning/30',
        };
      case 'FAILED':
        return {
          label: 'Failed',
          cls: 'bg-destructive/10 text-destructive border-destructive/30',
        };
      default:
        return {
          label: status || 'Unknown',
          cls: 'bg-muted text-foreground/80 border-border',
        };
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

            return (
              <div
                key={payment.id}
                className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden"
              >
                <div className="flex items-center gap-3 px-3 py-3 sm:gap-4 sm:px-5 sm:py-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent">
                    <Receipt className="h-5 w-5 text-accent-foreground" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="break-words text-sm font-semibold text-foreground">
                        {payment.description}
                      </p>

                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${config.cls}`}
                      >
                        {config.label}
                      </span>

                    </div>

                    <p className="text-xs text-muted-foreground mt-0.5">
                      {/* {payment.transaction_id} ·{' '} */}
                      {new Date(payment.created_at).toLocaleDateString(
                        'en-US',
                        {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        }
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 sm:gap-3">
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

                        <p className="tabular-nums text-foreground break-all">
                          {payment.transaction_id}
                        </p>
                      </div> */}

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                          Date
                        </p>

                        <p className="text-foreground">
                          {new Date(payment.created_at).toLocaleDateString(
                            'en-US',
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

                    </div>

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