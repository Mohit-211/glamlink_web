"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { KeychainAddOn } from "./KeychainOffer";
import { PlanGrid } from "./PlanCard";
import { ADD_ON_PLAN_IDS, isOwnedPlan, money, ownedNote, usePlans, type PlanId } from "./plans";
import { friendlyError } from "./messages";
import {
  cancelAccessSubscription,
  getAccessSubscription,
  openBillingPortal,
  resumeAccessSubscription,
} from "../../api/Api";
import { readApiError } from "@/lib/apiError";

export type { PlanId };

/** `GET /access/subscription`: the person's Access Pro seat (null without one). */
export interface AccessSubscription {
  /** Stripe's status: active, past_due, canceled, … */
  status: string;
  pro: boolean;
  source?: string;
  amount_cents: number | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at?: string | null;
  started_at?: string | null;
  /** The last renewal failed and Stripe is retrying it; the seat is still Pro meanwhile. */
  past_due?: boolean;
}

/** The last renewal failed (the API's flag; older answers only have Stripe's status). */
export const isPastDue = (s: AccessSubscription | null | undefined) =>
  Boolean(s && (s.past_due ?? s.status === "past_due"));

/** Ended: by the owner at the end of a paid month, by an admin, or after renewals failed. */
export const isCancelledSeat = (s: AccessSubscription | null | undefined) =>
  Boolean(s && !s.pro && (s.status === "canceled" || s.status === "cancelled"));

const isComplimentary = (s: AccessSubscription | null | undefined) =>
  s?.source === "comp" || s?.source === "complimentary";

const formatDate = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "";

interface Props {
  businessCardId?: string | number;
  /** Called after a cancel or resume so the dashboard can refresh. */
  onChanged?: () => void;
}

/**
 * The dashboard's plan tab: the current subscription (cancel at the end of the
 * paid month, or resume; Stripe's billing page to update the card or see
 * invoices), and the plans, shown as on /pricing. Checkout runs on /pricing.
 * Refunds and immediate cancellations are done by admins.
 */
export default function SubscriptionPlansTab({ businessCardId, onChanged }: Props) {
  const router = useRouter();
  const { plans, owned, loading, error, reload } = usePlans(businessCardId);
  const [subscription, setSubscription] = useState<AccessSubscription | null>(null);
  const [subscriptionState, setSubscriptionState] = useState<"loading" | "ready" | "error">("loading");
  const [selected, setSelected] = useState<PlanId | null>(null);
  const [busy, setBusy] = useState(false);
  const [portalBusy, setPortalBusy] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const loadSubscription = () =>
    getAccessSubscription()
      .then((res) => {
        setSubscription((res?.data ?? null) as AccessSubscription | null);
        setSubscriptionState("ready");
      })
      .catch(() => setSubscriptionState("error"));

  useEffect(() => {
    void loadSubscription();
  }, []);

  // The same cards as /pricing: Free, then each plan building on the one before. Free is never bought
  // here (leaving Pro is a cancellation); the keychain alone is the add-on below.
  const cardPlans = plans.filter((p) => !ADD_ON_PLAN_IDS.includes(p.id));
  const keychainPlan = plans.find((p) => p.id === "nfc_only") ?? null;
  const canChoose = (id: PlanId) => id !== "free" && !isOwnedPlan(id, owned);
  const noteFor = (id: PlanId) => (id === "free" ? (owned.subscription ? "Included in Pro" : "Your plan") : ownedNote(id, owned));
  const choice = selected && canChoose(selected) ? selected : null;
  const goToPricing = (plan: PlanId) => router.push(`/pricing?businessCardId=${businessCardId}&plan=${plan}`);

  const pastDue = isPastDue(subscription);
  const cancelled = isCancelledSeat(subscription);
  const complimentary = isComplimentary(subscription);

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
      toast.error(friendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  /** Stripe's billing page: update the card, pay a failed renewal, see invoices. It returns to this tab. */
  async function manageBilling() {
    setPortalBusy(true);
    try {
      const res = await openBillingPortal(`${window.location.origin}/dashboard?tab=subscription-plans`);
      const url = (res?.data ?? res)?.url;
      if (typeof url === "string" && url.startsWith("https://")) {
        window.location.assign(url);
        return;
      }
      toast.error("Billing isn't available right now. Please try again in a minute.");
    } catch (err) {
      const { code, status } = readApiError(err);
      toast.error(
        code === "NO_CUSTOMER"
          ? "There are no billing details to show yet."
          : status === 404
            ? "Billing isn't available yet. Please try again later."
            : friendlyError(err)
      );
    }
    setPortalBusy(false);
  }

  const showSeat = subscriptionState === "ready" && (subscription?.pro || cancelled);
  const statusChip = complimentary
    ? "Complimentary"
    : pastDue
      ? "Payment failed"
      : cancelled
        ? "Cancelled"
        : subscription?.cancel_at_period_end
          ? "Ending"
          : "Active";

  return (
    <div className="space-y-8">
      {subscriptionState === "error" && (
        <p className="text-sm text-muted-foreground">
          Couldn&apos;t load your plan.{" "}
          <button
            type="button"
            onClick={() => {
              setSubscriptionState("loading");
              void loadSubscription();
            }}
            className="link-glamlink"
          >
            Try again
          </button>
        </p>
      )}

      {showSeat && subscription && (
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
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                pastDue
                  ? "border-destructive/30 bg-destructive/10 text-destructive"
                  : cancelled
                    ? "border-border bg-muted text-muted-foreground"
                    : "border-primary/20 bg-primary/10 text-secondary"
              }`}
            >
              {statusChip}
            </span>
          </div>

          {pastDue ? (
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2.5">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
              <div>
                <p className="text-sm font-semibold text-destructive">Payment failed: update your card</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Your last Access Pro payment didn&apos;t go through. Stripe will try again; update your card to keep
                  Pro.
                </p>
              </div>
            </div>
          ) : cancelled ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {subscription.canceled_at || subscription.current_period_end
                ? `Cancelled on ${formatDate(subscription.canceled_at ?? subscription.current_period_end)}. `
                : "Cancelled. "}
              Your card is on the Free plan.
            </p>
          ) : (
            subscription.current_period_end && (
              <p className="mt-1 text-sm text-muted-foreground">
                {subscription.cancel_at_period_end
                  ? `Ends on ${formatDate(subscription.current_period_end)}. Your card goes back to Free after that.`
                  : `Renews on ${formatDate(subscription.current_period_end)}.`}
              </p>
            )
          )}

          {!cancelled && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {pastDue && !complimentary && (
                <button type="button" onClick={manageBilling} disabled={portalBusy} className="btn-primary disabled:opacity-50">
                  {portalBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
                  Update card
                </button>
              )}
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
                !complimentary && (
                  <button type="button" onClick={() => setConfirmCancel(true)} className="btn-outline">
                    Cancel subscription
                  </button>
                )
              )}
              {!pastDue && !complimentary && !confirmCancel && (
                <button
                  type="button"
                  onClick={manageBilling}
                  disabled={portalBusy}
                  className="link-glamlink inline-flex items-center gap-1.5 text-sm disabled:opacity-50"
                >
                  {portalBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ExternalLink className="h-3.5 w-3.5" />}
                  Manage billing
                </button>
              )}
            </div>
          )}
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
            <button type="button" onClick={reload} className="link-glamlink">
              Try again
            </button>
          </div>
        ) : !businessCardId ? (
          <p className="text-sm text-muted-foreground">
            Plans are chosen for your card.{" "}
            <Link href="/access#create-profile" className="link-glamlink">
              Create your card first
            </Link>
            .
          </p>
        ) : (
          <>
            <PlanGrid
              plans={cardPlans}
              selected={choice}
              onSelect={setSelected}
              isDisabled={(id) => !canChoose(id)}
              noteFor={noteFor}
              className="grid gap-5 md:grid-cols-3"
            />
            {!owned.keychain && keychainPlan && (
              <div className="mt-5">
                <KeychainAddOn plan={keychainPlan} onAdd={() => goToPricing("nfc_only")} />
              </div>
            )}
            {cardPlans.some((p) => canChoose(p.id)) && (
              <button
                type="button"
                disabled={!choice}
                onClick={() => choice && goToPricing(choice)}
                className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </>
        )}
      </section>
    </div>
  );
}
