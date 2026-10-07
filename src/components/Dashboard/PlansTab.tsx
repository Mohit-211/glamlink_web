'use client';

import React from 'react';
import { Nfc, Sparkles } from 'lucide-react';
import SubscriptionPlansTab, { type PlanId } from '../Pricing/SubscriptionPlansTab';
import { FeatureRow } from '../Pricing/PlanCard';
import { FREE_FEATURES, KEYCHAIN_FEATURE, PLANS, PRO_FEATURES } from '../Pricing/plans';
import { Eyebrow, PageHeader, StatusBadge, humanize, toneForStatus } from './shell/ui';

type PlansTabProps = React.ComponentProps<typeof SubscriptionPlansTab> & {
  card?: any;
  planLabel: string;
};

/** Dashboard "Plans" page: current plan summary on top, the existing plan picker below. */
export default function PlansTab({ card, planLabel, ...pickerProps }: PlansTabProps) {
  const planType = String(card?.plan_type || 'free').toLowerCase();
  const plan = PLANS.find((p) => p.planType === planType) ?? PLANS[0];
  const subscriptionStatus: string | undefined = card?.business_user?.subscription_status;
  const nfcStatus: string | undefined = card?.business_user?.nfc_status || card?.nfc_status;

  return (
    <div>
      <PageHeader
        title="Plans"
        description="See what your current plan includes and upgrade whenever you're ready."
      />

      {/* Current plan */}
      <section className="relative overflow-hidden rounded-2xl border border-primary/30 bg-card">
        <div className="absolute inset-x-0 top-0 h-1 bg-primary" aria-hidden="true" />
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Eyebrow>Current plan</Eyebrow>
              <StatusBadge tone="brand">Active plan</StatusBadge>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                {plan.hasKeychain && !plan.isPro ? <Nfc className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-xl font-semibold tracking-tight text-foreground">{planLabel}</h2>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{plan.priceLabel}</span>
                  {plan.priceSuffix && <span> {plan.priceSuffix}</span>}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{plan.tagline}</p>

            <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
              <div className="min-w-0">
                <dt className="text-xs text-muted-foreground">Subscription</dt>
                <dd className="mt-1">
                  {subscriptionStatus ? (
                    <StatusBadge tone={toneForStatus(subscriptionStatus)}>{humanize(subscriptionStatus)}</StatusBadge>
                  ) : (
                    <StatusBadge tone="neutral">{plan.isPro ? 'Unknown' : 'None'}</StatusBadge>
                  )}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-xs text-muted-foreground">NFC keychain</dt>
                <dd className="mt-1">
                  {plan.hasKeychain || nfcStatus ? (
                    <StatusBadge tone={nfcStatus ? toneForStatus(nfcStatus) : 'success'}>
                      {nfcStatus ? humanize(nfcStatus) : 'Included'}
                    </StatusBadge>
                  ) : (
                    <StatusBadge tone="neutral">Not included</StatusBadge>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <div className="min-w-0 rounded-xl bg-secondary/50 p-4 sm:p-5">
            <Eyebrow className="mb-2">What&apos;s included</Eyebrow>
            <ul className="grid gap-x-6 sm:grid-cols-2">
              {plan.isPro ? (
                <>
                  <FeatureRow>Directory listing & digital card</FeatureRow>
                  {PRO_FEATURES.map((f, i) =>
                    typeof f === 'string' ? <FeatureRow key={i}>{f}</FeatureRow> : <FeatureRow key={i} soon>{f.text}</FeatureRow>
                  )}
                </>
              ) : (
                FREE_FEATURES.map((f) => <FeatureRow key={f}>{f}</FeatureRow>)
              )}
              {plan.hasKeychain && <FeatureRow keychain>{KEYCHAIN_FEATURE}</FeatureRow>}
            </ul>
          </div>
        </div>
      </section>

      {/* Upgrade options */}
      <div className="mb-4 mt-10">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Upgrade options</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select a plan, then continue to checkout. Plans you already have are marked as included.
        </p>
      </div>
      {!card && (
        <p className="mb-4 rounded-xl border border-dashed border-border bg-card px-4 py-3 text-sm text-muted-foreground">
          Plans are applied to your Access Card — create one first to check out.
        </p>
      )}
      <SubscriptionPlansTab {...pickerProps} businessCard={card} />

    </div>
  );
}

export type { PlanId };
