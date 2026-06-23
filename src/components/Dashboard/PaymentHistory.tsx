'use client';

import React, { useState } from 'react';
import {
  Receipt,
  ChevronDown,
  ChevronUp,
  CreditCard,
} from 'lucide-react';

interface Payment {
  id: string;
  transactionId: string;
  title: string;
  amount: number;
  date: string;
  status: 'success' | 'pending' | 'failed';
}

interface PaymentHistoryProps {
  payments?: Payment[];
}

export default function PaymentHistory({
  payments = [],
}: PaymentHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const statusConfig = {
    success: {
      label: 'Success',
      cls: 'bg-green-100 text-green-700 border-green-200',
    },
    pending: {
      label: 'Pending',
      cls: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    },
    failed: {
      label: 'Failed',
      cls: 'bg-red-100 text-red-700 border-red-200',
    },
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
            const config =
              statusConfig[payment.status] ||
              statusConfig.success;

            const isExpanded = expandedId === payment.id;

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
                        {payment.title}
                      </p>

                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${config.cls}`}
                      >
                        {config.label}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground mt-0.5">
                      {payment.transactionId} ·{' '}
                      {new Date(payment.date).toLocaleDateString(
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
                      ₹{Number(payment.amount).toFixed(2)}
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
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                          Transaction ID
                        </p>

                        <p className="font-mono text-foreground break-all">
                          {payment.transactionId}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                          Date
                        </p>

                        <p className="text-foreground">
                          {new Date(payment.date).toLocaleDateString(
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
                          ₹{Number(payment.amount).toFixed(2)}
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