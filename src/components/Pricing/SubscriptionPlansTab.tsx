"use client";

import { ArrowRight } from "lucide-react";
import { PLANS } from "./plans";
import { PlanCard } from "./PlanCard";
import type { PlanId } from "./plans";

export type { PlanId };

// Subscribing to "free" doesn't unlock editing, so only offer the 3 paid-ish options.
const UPGRADE_PLANS = PLANS.filter((p) => p.id !== "free");

interface SubscriptionPlansTabProps {
  selectedPlan: PlanId | null;
  onSelectPlan: (id: PlanId) => void;
  canContinue: boolean;
  onContinue: () => void;
}

export default function SubscriptionPlansTab({
  selectedPlan,
  onSelectPlan,
  canContinue,
  onContinue,
}: SubscriptionPlansTabProps) {
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
        {UPGRADE_PLANS.map((p) => (
          <PlanCard
            key={p.id}
            plan={p}
            selected={selectedPlan === p.id}
            onSelect={() => onSelectPlan(p.id)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onContinue}
        disabled={!canContinue}
        className="btn-primary mt-6 flex w-full items-center justify-center gap-2 !rounded-xl !py-3 !text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}