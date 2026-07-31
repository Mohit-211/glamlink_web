"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { ArrowRight, Info, Loader2 } from "lucide-react";
import { SelectPlanAPI } from "@/api/Api";
import { PLANS, PlanCard } from "./PlanCard";
import type { PlanId } from "./plans";

interface PricingStepProps {
  businessCardId?: string | number | null;
}

export default function PricingStep({ businessCardId }: PricingStepProps) {
  const [selected, setSelected] = useState<PlanId>("proKeychain");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const plan = PLANS.find((p) => p.id === selected)!;

  const handleContinue = async () => {
    if (!businessCardId) {
      message.error("Missing business card reference. Please try again.");
      return;
    }
    try {
      setSubmitting(true);
      await SelectPlanAPI({
        business_card_id: businessCardId,
        plan_type: plan.isPro ? "pro" : "free",
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("SELECT PLAN ERROR 👉", error);
      message.error("Failed to select plan. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="page-soft w-[90%] px-4 py-14">
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

        <div className="mx-auto w-full m-10">
          <div className="mb-10">
            <h1 className="font-display mt-1 text-[26px] leading-tight text-foreground sm:text-[30px]">
              Choose your plan
            </h1>
            <p className="section-subtitle mt-2 max-w-md text-[15px] leading-6">
              Choose the plan that best fits your business. You can upgrade anytime.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((p) => (
              <PlanCard key={p.id} plan={p} selected={selected === p.id} onSelect={() => setSelected(p.id)} />
            ))}
          </div>

          <div className="mt-9 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={handleContinue}
              disabled={submitting}
              className="btn-primary w-full max-w-xs flex-col gap-0.5 py-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center gap-2">
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Setting up your plan...
                  </>
                ) : (
                  <>
                    Continue with {plan.name}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </span>
              {!submitting && (
                <span className="text-xs font-normal text-primary-foreground/80">
                  {plan.priceLabel}
                  {plan.priceSuffix ? ` ${plan.priceSuffix}` : ""}
                </span>
              )}
            </button>

            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Info className="h-3.5 w-3.5" />
              You can upgrade, downgrade, or switch plans anytime from your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}