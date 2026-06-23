'use client';

import { CreditCard } from 'lucide-react';

interface Props {
  payments: any[];
}

export default function PaymentTab({ payments }: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Payment History</h2>

      {payments?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No payment records found
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment, index) => (
            <div
              key={payment.id || index}
              className="border rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">
                    {payment.plan_name || 'Subscription Payment'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {payment.createdAt
                      ? new Date(payment.createdAt).toLocaleDateString()
                      : '-'}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  ₹{payment.amount || 0}
                </p>
                <p className="text-sm capitalize">
                  {payment.status || 'success'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}