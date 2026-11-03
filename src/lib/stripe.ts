/**
 * Stripe.js, loaded with the publishable key that matches the payment:
 *
 * 1. the key `POST /access/checkout/:id/pay` answered with the client secret,
 *    which is always the key of the account and mode that made the payment;
 * 2. otherwise the key the API reports (`GET /payment/stripe/stripe-key`), so
 *    the site follows the API's Stripe mode (test or live);
 * 3. NEXT_PUBLIC_STRIPE_PUBLIC_KEY only if that call fails.
 *
 * A failed load is never kept: the next call tries again. getStripe resolves to
 * null when Stripe can't load, and the page shows that payments are unavailable.
 */
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { apiUrl } from "@/lib/config";

const isKey = (key: unknown): key is string => typeof key === "string" && key.startsWith("pk_");

let reportedKey: Promise<string | null> | null = null;
const loaded = new Map<string, Promise<Stripe | null>>();

/** The API's publishable key, kept once it answers; null when it can't be had. */
function apiPublishableKey(): Promise<string | null> {
  if (!reportedKey) {
    reportedKey = fetch(apiUrl("payment/stripe/stripe-key"))
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => {
        const key = body?.data?.publishable_key;
        if (isKey(key)) return key;
        throw new Error("The API did not report a Stripe publishable key.");
      })
      .catch((error) => {
        reportedKey = null;
        const fallback = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
        if (isKey(fallback)) return fallback;
        console.error("Stripe publishable key unavailable:", error);
        return null;
      });
  }
  return reportedKey;
}

/** Stripe.js for `publishableKey` (the one /pay answered), else for the API's key. Null when it can't load. */
export async function getStripe(publishableKey?: string | null): Promise<Stripe | null> {
  const key = isKey(publishableKey) ? publishableKey : await apiPublishableKey();
  if (!key) return null;
  let stripe = loaded.get(key);
  if (!stripe) {
    stripe = loadStripe(key).catch((error) => {
      console.error("Stripe.js failed to load:", error);
      return null;
    });
    loaded.set(key, stripe);
    // Never keep a failure: the next call loads again.
    void stripe.then((result) => {
      if (!result) loaded.delete(key);
    });
  }
  return stripe;
}
