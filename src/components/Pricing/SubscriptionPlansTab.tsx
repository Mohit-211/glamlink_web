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
  pro: { subscription: true, nfc: false },
  freeKeychain: { subscription: false, nfc: true },
  proKeychain: { subscription: true, nfc: true },
};

const PLAN_TO_TYPE: Partial<Record<PlanId, string>> = {
  pro: "subscription_only",
  freeKeychain: "nfc_only",
  proKeychain: "nfc_with_subscription",
};

const SUBSCRIPTION_PLAN_TYPES = new Set(["subscription_only", "nfc_with_subscription"]);

function cardHasSubscription(card: any): boolean {
  return SUBSCRIPTION_PLAN_TYPES.has((card?.plan_type || "").toLowerCase());
}

function cardHasNfc(card: any): boolean {
  return (card?.nfc_status || "").toLowerCase() === "purchased";
}

function isPlanAlreadyIncluded(planId: PlanId, card: any): boolean {
  const req = PLAN_REQUIREMENTS[planId];
  if (!req) return false;
  const hasSubscription = cardHasSubscription(card);
  const hasNfc = cardHasNfc(card);
  return (!req.subscription || hasSubscription) && (!req.nfc || hasNfc);
}

/**
 * Expands a set of "directly" disabled plan ids to include everything that
 * depends on them. proKeychain bundles both the Pro subscription and the
 * NFC keychain, so it must be disabled whenever either `pro` or
 * `freeKeychain` is disabled — regardless of *why* those were disabled
 * (explicit prop vs. already-included-on-the-card). Runs as a fixed-point
 * loop so it can never again depend on evaluation order.
 */
function expandWithDependencies(baseDisabled: Set<PlanId>): Set<PlanId> {
  const result = new Set(baseDisabled);
  let changed = true;
  while (changed) {
    changed = false;
    if ((result.has("pro") || result.has("freeKeychain")) && !result.has("proKeychain")) {
      result.add("proKeychain");
      changed = true;
    }
  }
  return result;
}

interface SubscriptionPlansTabProps {
  selectedPlan: PlanId | null;
  onSelectPlan: (id: PlanId | null) => void;
  canContinue: boolean;
  onContinue: () => void;
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

    const planType = PLAN_TO_TYPE[selectedPlan];
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

    onContinue();
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