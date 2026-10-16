"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PlanCard } from "./PlanCard";
import { money, usePlans, type PlanId } from "./plans";
import { cancelAccessSubscription, getAccessSubscription, resumeAccessSubscription } from "../../api/Api";
import { readApiError } from "@/lib/apiError";

export type { PlanId };

/** `GET /access/subscription`: the person's Access Pro seat (null without one). */
export interface AccessSubscription {
  status: string;
  pro: boolean;
  source?: string;
  amount_cents: number | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "";

interface Props {
  businessCardId?: string | number;
  /** Called after a cancel or resume so the dashboard can refresh. */
  onChanged?: () => void;
}

/**
 * The dashboard's plan tab: the current subscription (cancel at the end of the
 * paid month, or resume), and the plans to upgrade to. Checkout runs on /pricing.
 */
export default function SubscriptionPlansTab({ businessCardId, onChanged }: Props) {
  const router = useRouter();
  const { plans, owned, loading, error, reload } = usePlans(businessCardId);
  const [subscription, setSubscription] = useState<AccessSubscription | null>(null);
  const [selected, setSelected] = useState<PlanId | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const loadSubscription = () =>
    getAccessSubscription()
      .then((res) => setSubscription((res?.data ?? null) as AccessSubscription | null))
      .catch(() => setSubscription(null));

  useEffect(() => {
    loadSubscription();
  }, []);

  const isOwned = (id: PlanId) =>
    (owned.subscription && (id === "subscription_only" || id === "nfc_with_subscription")) ||
    (owned.keychain && (id === "nfc_only" || id === "nfc_with_subscription"));

  const upgradePlans = plans.filter((p) => p.id !== "free");

  async function changeSubscription(action: "cancel" | "resume") {
    setBusy(true);
    try {
      const res = action === "cancel" ? await cancelAccessSubscription() : await resumeAccessSubscription();
      const next = (res?.data ?? null) as AccessSubscription | null;
      setSubscription(next);
      setConfirmCancel(false);
      toast.success(
        action === "cancel"
          ? `Your Pro plan ends on ${formatDate(next?.current_period_end ?? subscription?.current_period_end ?? null)}.`
          : "Your Pro plan will keep renewing."
      );
      onChanged?.();
      reload();
    } catch (err) {
      toast.error(readApiError(err).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      {subscription?.pro && (
        <section className="rounded-2xl border border-border bg-muted/40 p-5">
          <p className="label-glamlink">Your plan</p>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="text-lg font-semibold">
              Access Pro
              {subscription.amount_cents ? (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  {money(subscription.amount_cents)} / month
                </span>
              ) : null}
            </p>
            {subscription.source === "comp" || subscription.source === "complimentary" ? (
              <span className="badge-soft">Complimentary</span>
            ) : null}
          </div>
          {subscription.current_period_end && (
            <p className="mt-1 text-sm text-muted-foreground">
              {subscription.cancel_at_period_end
                ? `Ends on ${formatDate(subscription.current_period_end)}. Your card goes back to Free after that.`
                : `Renews on ${formatDate(subscription.current_period_end)}.`}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            {subscription.cancel_at_period_end ? (
              <button type="button" onClick={() => changeSubscription("resume")} disabled={busy} className="btn-primary">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Keep Access Pro
              </button>
            ) : confirmCancel ? (
              <>
                <p className="basis-full text-sm">
                  Cancel Access Pro? You keep it until {formatDate(subscription.current_period_end)}.
                </p>
                <button
                  type="button"
                  onClick={() => changeSubscription("cancel")}
                  disabled={busy}
                  className="btn-outline border-destructive/40 text-destructive hover:bg-destructive/5"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Yes, cancel
                </button>
                <button type="button" onClick={() => setConfirmCancel(false)} className="btn-outline">
                  Keep it
                </button>
              </>
            ) : (
              subscription.source !== "comp" &&
              subscription.source !== "complimentary" && (
                <button type="button" onClick={() => setConfirmCancel(true)} className="btn-outline">
                  Cancel subscription
                </button>
              )
            )}
          </div>
        </section>
      )}

      <section>
        <h3 className="mb-4 text-base font-semibold">
          {subscription?.pro ? "Add to your plan" : "Upgrade your card"}
        </h3>
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        ) : error ? (
          <div className="text-sm text-muted-foreground">
            {error}{" "}
            <button type="button" onClick={reload} className="font-medium text-primary hover:underline">
              Try again
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-3">
              {upgradePlans.map((p) => {
                const disabled = isOwned(p.id);
                return (
                  <div key={p.id} className={disabled ? "pointer-events-none opacity-50 grayscale-[35%]" : ""}>
                    <PlanCard
                      plan={p}
                      selected={selected === p.id}
                      disabled={disabled}
                      onSelect={() => setSelected(p.id)}
                    />
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              disabled={!selected || !businessCardId}
              onClick={() => router.push(`/pricing?businessCardId=${businessCardId}&plan=${selected}`)}
              className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </>
        )}
      </section>
    </div>
  );
}
