/**
 * Access plans come from the API (`GET /access/plans`): names, badge, tagline,
 * features and prices are stored there and admins can change them, run a sale
 * or give one client a personal price. Nothing here hard-codes a price.
 */
"use client";

import { useCallback, useEffect, useState } from "react";
import { getAccessPlans } from "@/api/Api";
import { readApiError } from "@/lib/apiError";

export type PlanId = "free" | "nfc_only" | "subscription_only" | "nfc_with_subscription";
export type BackendPlanType = PlanId;

export interface PlanFeature {
  text: string;
  soon?: boolean;
  /** "keychain" marks the keychain line. */
  highlight?: string;
}

interface PlanLine {
  product: "pro" | "keychain" | string;
  name: string;
  kind: "subscription" | "one_time";
  interval: string | null;
  /** Cents before any discount (show it struck through when higher). */
  list: number;
  /** Cents the first payment charges. */
  amount: number;
  /** Cents later monthly payments charge. */
  recurring: number | null;
  personal: boolean;
}

export interface ApiPlan {
  code: PlanId;
  name: string;
  label: string;
  badge: string | null;
  tagline: string;
  features: PlanFeature[];
  includes: { subscription: boolean; keychain: boolean };
  lines: PlanLine[];
  due_today: number;
  monthly: number | null;
}

export interface PlanSale {
  name: string;
  percent_off: number | null;
  amount_off_cents: number | null;
  applies_to: string[];
  ends_at: string | null;
}

export interface PlanDef {
  id: PlanId;
  /** What the purchase calls take as `plan_type`. */
  planType: PlanId;
  name: string;
  label: string;
  badge: string | null;
  tagline: string;
  features: PlanFeature[];
  hasKeychain: boolean;
  isPro: boolean;
  /** "$4.99" */
  priceLabel: string;
  /** "/ month + $39.99 one-time" */
  priceSuffix?: string;
  /** The list price, struck through, when a sale or personal price lowers it. */
  listPriceLabel?: string;
  /** "then $4.99 / month" when the discounted monthly price is temporary. */
  afterNote?: string;
  /** Whether this price is the client's own (set by an admin). */
  personal: boolean;
  dueTodayCents: number;
  monthlyCents: number | null;
  /** What this plan charges now for each product it includes (cents). */
  proCents: number | null;
  keychainCents: number | null;
}

/** Cents to "$4.99"; whole amounts keep their cents except zero ("$0"). */
export const money = (cents: number) => (cents === 0 ? "$0" : `$${(cents / 100).toFixed(2)}`);

export function toPlanDef(p: ApiPlan): PlanDef {
  const pro = p.lines.find((l) => l.product === "pro");
  const keychain = p.lines.find((l) => l.product === "keychain");
  const main = pro ?? keychain;
  return {
    id: p.code,
    planType: p.code,
    name: p.name,
    label: p.label,
    badge: p.badge,
    tagline: p.tagline,
    features: p.features ?? [],
    hasKeychain: p.includes?.keychain ?? Boolean(keychain),
    isPro: p.includes?.subscription ?? Boolean(pro),
    priceLabel: main ? money(main.amount) : "$0",
    priceSuffix: pro
      ? `/ month${keychain ? ` + ${money(keychain.amount)} one-time` : ""}`
      : keychain
        ? "one-time"
        : undefined,
    listPriceLabel: main && main.list > main.amount ? money(main.list) : undefined,
    afterNote:
      pro && pro.recurring !== null && pro.recurring !== pro.amount
        ? `then ${money(pro.recurring)} / month`
        : undefined,
    personal: p.lines.some((l) => l.personal),
    dueTodayCents: p.due_today,
    monthlyCents: p.monthly,
    proCents: pro?.amount ?? null,
    keychainCents: keychain?.amount ?? null,
  };
}

// Several price labels on one page share one request: anonymous answers are
// cached briefly (personal prices depend on the card or sign-in, so not those).
let publicCache: { at: number; promise: Promise<any> } | null = null;
const loadPlans = (businessCardId?: string | number | null) => {
  if (businessCardId) return getAccessPlans(businessCardId);
  if (!publicCache || Date.now() - publicCache.at > 60_000) {
    publicCache = { at: Date.now(), promise: getAccessPlans() };
    publicCache.promise.catch(() => (publicCache = null));
  }
  return publicCache.promise;
};

export interface PlansState {
  plans: PlanDef[];
  sale: PlanSale | null;
  /** Signed in: what the person already has (buying it again is refused). */
  owned: { subscription: boolean; keychain: boolean };
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * The plans with prices for whoever is looking: a signed-in professional sees
 * their personal prices and what they own; a guest passes their draft card id
 * (with its card token) for a personal price set on their email.
 */
export function usePlans(businessCardId?: string | number | null, enabled = true): PlansState {
  const [state, setState] = useState<Omit<PlansState, "reload">>({
    plans: [],
    sale: null,
    owned: { subscription: false, keychain: false },
    loading: true,
    error: null,
  });
  const [attempt, setAttempt] = useState(0);
  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    loadPlans(businessCardId)
      .then((res) => {
        if (!active) return;
        const data = res?.data ?? res;
        setState({
          plans: (data?.plans ?? []).map(toPlanDef),
          sale: data?.sale ?? null,
          owned: data?.owned ?? { subscription: false, keychain: false },
          loading: false,
          error: null,
        });
      })
      .catch((error) => {
        if (!active) return;
        setState((s) => ({ ...s, loading: false, error: readApiError(error, "Couldn't load the plans.").message }));
      });
    return () => {
      active = false;
    };
  }, [businessCardId, enabled, attempt]);

  return { ...state, reload };
}
