"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { PLANS } from "./plans";
import { PlanCard } from "./PlanCard";
import type { PlanId } from "./plans";
import { SelectPlanAPI } from "../../api/Api";

export type { PlanId };

const UPGRADE_PLANS = PLANS.filter((p) => p.id !== "free");

const PLAN_REQUIREMENTS: Record<PlanId, { subscription: boolean; nfc: boolean }> = {
  free: { subscription: false, nfc: false },
  subscription_only: { subscription: true, nfc: false },
  nfc_only: { subscription: false, nfc: true },
  nfc_with_subscription: { subscription: true, nfc: true },
};

const PLAN_TO_TYPE: Partial<Record<PlanId, string>> = {
  subscription_only: "subscription_only",
  nfc_only: "nfc_only",
  nfc_with_subscription: "nfc_with_subscription",
};

const SUBSCRIPTION_PLAN_TYPES = new Set(["subscription_only", "nfc_with_subscription"]);

function cardHasSubscription(card: any): boolean {
  return SUBSCRIPTION_PLAN_TYPES.has((card?.plan_type || "").toLowerCase());
}

const NFC_PURCHASED_STATUSES = new Set(["purchased", "paid"]);

function cardHasNfc(card: any): boolean {
  // "nfc_only" / "nfc_with_subscription" both already bundle NFC, so treat
  // either as NFC being present — even if nfc_status hasn't been (or
  // wasn't) separately marked as purchased. Otherwise a card already on
  // the "nfc_only" plan would still show its own Keychain plan as
  // selectable instead of disabled.
  const planType = (card?.plan_type || "").toLowerCase();
  if (planType === "nfc_only" || planType === "nfc_with_subscription") return true;
  // Real API responses use "paid" (not "purchased") for nfc_status.
  return NFC_PURCHASED_STATUSES.has((card?.nfc_status || "").toLowerCase());
}

function isPlanAlreadyIncluded(planId: PlanId, card: any): boolean {
  const req = PLAN_REQUIREMENTS[planId];
  if (!req) return false;
  const hasSubscription = cardHasSubscription(card);
  const hasNfc = cardHasNfc(card);
  return (!req.subscription || hasSubscription) && (!req.nfc || hasNfc);
}

/**
 * The plan_type sent to the API must reflect what the card will actually
 * have AFTER this purchase, not just what the selected plan bundles on its
 * own. E.g. a card that already has NFC purchased and now buys the `pro`
 * (subscription-only) plan ends up with both subscription + NFC, so the
 * API needs "nfc_with_subscription" — not "subscription_only" — or the
 * two purchases won't be reconciled server-side.
 */
function getEffectivePlanType(planId: PlanId, card: any): string | undefined {
  const req = PLAN_REQUIREMENTS[planId];
  if (!req) return PLAN_TO_TYPE[planId];

  const willHaveSubscription = req.subscription || cardHasSubscription(card);
  const willHaveNfc = req.nfc || cardHasNfc(card);

  if (willHaveSubscription && willHaveNfc) return "nfc_with_subscription";
  if (willHaveSubscription) return "subscription_only";
  if (willHaveNfc) return "nfc_only";
  return PLAN_TO_TYPE[planId];
}


function expandWithDependencies(baseDisabled: Set<PlanId>): Set<PlanId> {
  const result = new Set(baseDisabled);
  let changed = true;
  while (changed) {
    changed = false;
    if ((result.has("subscription_only") || result.has("nfc_only")) && !result.has("nfc_with_subscription")) {
      result.add("nfc_with_subscription");
      changed = true;
    }
  }
  return result;
}

interface SubscriptionPlansTabProps {
  selectedPlan: PlanId | null;
  onSelectPlan: (id: PlanId | null) => void;
  canContinue: boolean;
  // Now receives the resolved backend plan_type (the same value that was
  // just persisted via SelectPlanAPI below) so the caller doesn't have to
  // re-derive it — and can't derive it incorrectly — from `selectedPlan`.
  onContinue: (effectivePlanType: string) => void;
  businessCard?: any;
  businessCardId?: string | number;
  disabledPlanIds?: PlanId[];
}

export default function SubscriptionPlansTab({
  selectedPlan,
  onSelectPlan,
  canContinue,
  onContinue,
  businessCard,
  businessCardId,
  disabledPlanIds: extraDisabledPlanIds = [],
}: SubscriptionPlansTabProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Step 1: gather every DIRECT reason a plan is disabled — explicit prop,
  // or already fully covered by the current business card.
  const baseDisabled = new Set<PlanId>(extraDisabledPlanIds);
  if (businessCard) {
    for (const p of UPGRADE_PLANS) {
      if (isPlanAlreadyIncluded(p.id, businessCard)) {
        baseDisabled.add(p.id);
      }
    }
  }

  // Step 2: cascade dependencies ONCE, after all direct sources are known.
  const disabledSet = expandWithDependencies(baseDisabled);
  const disabledPlanIds = Array.from(disabledSet);

  const isSelectedPlanDisabled = !!selectedPlan && disabledSet.has(selectedPlan);
  const effectiveCanContinue = canContinue && !isSelectedPlanDisabled && !submitting;

  // Requirement 4: if the selected plan becomes disabled (card data loads
  // in late, disabledPlanIds prop changes, etc.), clear the selection
  // instead of leaving a disabled plan sitting in state.
  useEffect(() => {
    if (isSelectedPlanDisabled) {
      onSelectPlan(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelectedPlanDisabled]);

  const handleContinue = async () => {
    if (!selectedPlan || !effectiveCanContinue) return;

    const planType = getEffectivePlanType(selectedPlan, businessCard);
    const cardId = businessCardId ?? businessCard?.id;

    if (planType && cardId) {
      try {
        setSubmitting(true);
        setSubmitError(null);
        await SelectPlanAPI({ business_card_id: cardId, plan_type: planType });
      } catch (err: any) {
        setSubmitError(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Something went wrong selecting the plan. Please try again."
        );
        setSubmitting(false);
        return;
      }
      setSubmitting(false);
    }

    // Pass the resolved plan type (same value just sent to SelectPlanAPI)
    // up to the caller so it can map to the correct PurchaseType instead
    // of re-deriving it from `selectedPlan`.
    onContinue(planType ?? selectedPlan);
  };

  return (
    <div>
      <style>{`
        @keyframes sheen {
          0% { transform: translateX(-120%) rotate(8deg); }
          100% { transform: translateX(220%) rotate(8deg); }
        }
        .sheen-sweep { animation: sheen 5s ease-in-out infinite; animation-delay: 1s; }
        @media (prefers-reduced-motion: reduce) {
          .sheen-sweep { animation: none; }
        }
      `}</style>

      <div className="grid gap-5 sm:grid-cols-3">
        {UPGRADE_PLANS.map((p) => {
          const isDisabled = disabledSet.has(p.id);
          return (
            <div key={p.id} className="relative">
              <div className={isDisabled ? "pointer-events-none opacity-50 grayscale-[35%]" : ""}>
                <PlanCard
                  plan={p}
                  selected={selectedPlan === p.id}
                  disabled={isDisabled}
                  onSelect={() => {
                    if (isDisabled) return;
                    onSelectPlan(p.id);
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {submitError && <p className="mt-3 text-xs text-destructive">{submitError}</p>}

      <button
        type="button"
        onClick={handleContinue}
        disabled={!effectiveCanContinue}
        className="btn-primary mt-6 flex w-full items-center justify-center gap-2 !rounded-xl !py-3 !text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Saving..." : "Continue"}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}