"use client";

import { money, usePlans } from "./plans";

/**
 * A product's current price from the API (`GET /access/plans`), for marketing
 * copy: "pro" is Access Pro per month, "keychain" the one-time keychain. Shows
 * a sale price when one runs. Renders a dash until the plans load.
 */
export default function PlanPrice({ product }: { product: "pro" | "keychain" }) {
  const { plans } = usePlans();
  const bundle = plans.find((p) => p.id === "nfc_with_subscription");
  const cents = product === "pro" ? bundle?.proCents : bundle?.keychainCents;
  return <>{cents === null || cents === undefined ? "—" : money(cents)}</>;
}
