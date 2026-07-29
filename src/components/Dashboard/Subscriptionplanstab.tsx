'use client';
import React from 'react';
import { CheckCircle } from 'lucide-react';

export type PlanId = 'subscription' | 'subscription-nfc';

// ── Subscription Plans data ──
// Plan A: Subscription only — $4.99/month
// Plan B: Subscription + NFC — $39.99 one-time (NFC card) + $4.99/month subscription
const PLANS: {
  id: PlanId;
  name: string;
  description: string;
  priceLine: string;
  subLine?: string;
  features: string[];
  highlighted?: boolean;
}[] = [
  {
    id: 'subscription',
    name: 'Subscription',
    description: 'Your GlamCard access card, no physical NFC hardware.',
    priceLine: '$4.99/month',
    subLine: '',
    features: [
      'Digital access card (GlamCard)',
      'Shareable link & QR code',
      'Order history & dashboard access',
    ],
  },
  {
    id: 'subscription-nfc',
    name: 'Subscription + NFC',
    description: 'Everything in Subscription, plus a physical NFC tap card.',
    priceLine: '$39.99 one-time',
    subLine: '+ $4.99 / month subscription',
    features: [
      'Everything in Subscription',
      'Physical NFC card (one-time cost)',
      'Tap-to-share for in-person clients',
    ],
    highlighted: true,
  },
];

interface SubscriptionPlansTabProps {
  selectedPlan: PlanId | null;
  onSelectPlan: (id: PlanId) => void;
  onContinue: () => void;
  canContinue: boolean;
}

export default function SubscriptionPlansTab({
  selectedPlan,
  onSelectPlan,
  onContinue,
  canContinue,
}: SubscriptionPlansTabProps) {
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Subscription Plans</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose the plan that works best for you. You can switch plans later from this tab.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          return (
            <button
              key={plan.id}
              onClick={() => onSelectPlan(plan.id)}
              className={`relative text-left rounded-2xl border p-5 transition-all duration-150 ${
                isSelected
                  ? 'border-primary bg-accent shadow-[var(--shadow-soft)]'
                  : 'border-border bg-card hover:border-primary/40'
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-2.5 right-4 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                  Most Popular
                </span>
              )}

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-foreground">{plan.name}</h3>
                {isSelected && <CheckCircle className="h-4 w-4 text-primary" />}
              </div>

              <p className="text-xs text-muted-foreground mb-4">{plan.description}</p>

              <div className="mb-4">
                <p className="text-2xl font-bold text-foreground">{plan.priceLine}</p>
                {plan.subLine && (
                  <p className="text-xs font-medium text-muted-foreground mt-0.5">
                    {plan.subLine}
                  </p>
                )}
              </div>

              <ul className="space-y-1.5">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                    <CheckCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-primary/70" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          onClick={onContinue}
          disabled={!canContinue}
          className="rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}