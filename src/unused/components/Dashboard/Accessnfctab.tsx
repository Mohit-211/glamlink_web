'use client';

import React, { useState } from 'react';
import { Nfc, ShoppingBag, Sparkles, Check as CheckIcon } from 'lucide-react';
import { PurchaseType } from './Purchasetypes';

type AccessNfcTabProps = {
  cardData: any;
  error?: string;
  /** Bubbles the chosen plan up so the parent can open the single shared
   *  NFC purchase modal (pricing summary + address, all in one place). */
  onSelectPlan?: (type: PurchaseType, businessId: string | number) => void;
};

const PLANS: {
  subLine?: string;
  type: PurchaseType;
  label: string;
  price: string;
  cadence: string;
  badge?: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  highlight?: boolean;
}[] = [
    {
      type: 'NFC_ONLY',
      label: 'NFC Card',
      price: '$39.99',
      cadence: 'one-time',
      description: 'A physical NFC card preloaded with your access card link.',
      features: ['Tap-to-share, no app needed', 'No monthly fees', 'Ships in 5–7 business days'],
      icon: <ShoppingBag className="h-4 w-4" />,
    },
    {
      type: 'NFC_WITH_SUBSCRIPTION',
      label: 'NFC Card + Subscription',
      price: '$39.99 one-time',
      subLine: '+ $4.99 / month subscription',
      cadence: '/month',
      badge: 'Best Value',
      description: 'Get the NFC card included, plus ongoing premium card features.',
      features: ['NFC card included', 'Premium card features unlocked', 'Cancel anytime'],
      icon: <Sparkles className="h-4 w-4" />,
      highlight: true,
    },
  ];

export default function AccessNfcTab({ cardData, error, onSelectPlan }: AccessNfcTabProps) {
  const [selectedType, setSelectedType] = useState<PurchaseType | null>(null);

  const cardsArray: any[] = Array.isArray(cardData) ? cardData : cardData ? [cardData] : [];
  const primaryCard = cardsArray[0] ?? null;
  const businessId = primaryCard?.id ?? '';

  // Just marks a plan as selected (highlights the card) — the actual
  // purchase flow (pricing summary + shipping address) only kicks off
  // once the person taps "Continue" below, and lives in one shared
  // modal owned by the parent dashboard.
  const handleSelectPlan = (type: PurchaseType) => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (!selectedType) return;
    onSelectPlan?.(selectedType, businessId);
  };

  if (error) return <div className="p-6 text-sm text-destructive">{error}</div>;
  if (!primaryCard) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        No business card found to write to NFC yet.
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Nfc className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">NFC Access Card</h3>
          <p className="text-xs text-muted-foreground">
            Write your card link to a physical NFC tag or card
          </p>
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-3 text-sm font-semibold text-foreground">Get a physical NFC card</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PLANS.map((plan) => {
            const isSelected = selectedType === plan.type;
            return (
              <button
                key={plan.type}
                type="button"
                onClick={() => handleSelectPlan(plan.type)}
                className={`relative flex flex-col rounded-2xl border px-5 py-5 text-left transition-all duration-150 ${
                  isSelected
                    ? 'border-primary bg-accent shadow-[var(--shadow-soft)]'
                    : 'border-border bg-card hover:border-primary/40'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-5 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
                    {plan.badge}
                  </span>
                )}

                <div className="mb-3 flex items-center justify-between">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground'
                    }`}
                  >
                    {plan.icon}
                  </div>
                  {isSelected && <CheckIcon className="h-4 w-4 text-primary" />}
                </div>

                <p className="text-sm font-semibold text-foreground">{plan.label}</p>
                <div className="mt-1 flex items-baseline gap-1">
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-foreground">{plan.price}</p>
                    {plan.subLine && (
                      <p className="text-xs font-medium text-muted-foreground mt-0.5">
                        {plan.subLine}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{plan.cadence}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{plan.description}</p>

                <ul className="mt-4 flex-1 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs text-foreground">
                      <CheckIcon className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={handleContinue}
            disabled={!selectedType}
            className="rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
}