/**
 * Stripe.js, loaded with the publishable key the API reports
 * (`GET /payment/stripe/stripe-key`), so the website always uses the same
 * Stripe account and mode (test or live) as the API's secret key.
 * NEXT_PUBLIC_STRIPE_PUBLIC_KEY is only a fallback if that call fails.
 */
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { API_URL } from "@/lib/config";

let stripePromise: Promise<Stripe | null> | null = null;

async function publishableKey(): Promise<string> {
  try {
    const res = await fetch(`${API_URL}/payment/stripe/stripe-key`);
    const body = await res.json();
    const key = body?.data?.publishable_key;
    if (typeof key === "string" && key.startsWith("pk_")) return key;
  } catch {
    // Fall back below.
  }
  return process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? "";
}

export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) stripePromise = publishableKey().then((key) => (key ? loadStripe(key) : null));
  return stripePromise;
}
