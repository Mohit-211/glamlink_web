/**
 * The Access checkout as the website follows it (`/access/checkout/*`).
 *
 * A checkout is quoted (`open`), then paid through Stripe (`pending` until
 * Stripe and the API agree it is `paid`). The page only says "paid" or "live"
 * once `GET /access/checkout/:id` says `paid`; that call asks Stripe itself
 * while the checkout waits, so it does not depend on the webhook alone.
 *
 * The checkout being paid is kept per card in sessionStorage, so a reload, the
 * browser's Back button or a return to /pricing in the same tab picks it up
 * again instead of starting a second payment.
 */
import type { PaymentIntent } from "@stripe/stripe-js";
import { getCheckout } from "@/api/Api";
import { readApiError } from "@/lib/apiError";
import { getStripe } from "@/lib/stripe";
import type { PlanId } from "./plans";

export type CheckoutStatus = "open" | "pending" | "processing" | "paid" | "expired" | "failed" | "cancelled";

export interface QuoteLine {
  product: string;
  name?: string;
  amount: number;
  list: number;
  recurring: number | null;
  personal: boolean;
}

export interface ShippingOption {
  rate_id: string;
  amount_cents: number;
  provider: string;
  service: string;
  estimated_days: number | null;
}

/** The quote (`POST /access/checkout/quote`) and the poll (`GET /access/checkout/:id`) answer this. */
export interface CheckoutView {
  checkout_id: number;
  status: CheckoutStatus | string;
  plan_type: string;
  lines: QuoteLine[];
  shipping: { options: ShippingOption[]; selected: { rate_id: string } | null } | null;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  monthly_cents: number | null;
  /** While the checkout can still be paid. */
  client_secret?: string | null;
  publishable_key?: string | null;
  email?: string | null;
  /** Once paid: the card it paid for. */
  card?: { business_card_id: number; status: string; business_card_link: string | null } | null;
}

export const isPaid = (view: CheckoutView | null | undefined) => view?.status === "paid";
/** No answer will change any more without the person acting. */
const isFinal = (status: string | undefined) =>
  status === "paid" || status === "expired" || status === "failed" || status === "cancelled";

const unwrap = (res: unknown) => ((res as { data?: CheckoutView } | null)?.data ?? res) as CheckoutView;

/** The checkout as it stands. */
export async function fetchCheckout(checkoutId: number | string, cardId: number | string): Promise<CheckoutView> {
  return unwrap(await getCheckout(checkoutId, cardId));
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Asks until the checkout is paid or final, `tries` times, `every` ms apart.
 * Resolves to the last answer (null when none came, e.g. offline), or stops
 * early when `isActive` turns false. Rejects with the API's refusal (no access,
 * no such checkout) when it never answered otherwise: asking again won't help.
 */
export async function waitForCheckout(
  checkoutId: number | string,
  cardId: number | string,
  { tries = 10, every = 2000, isActive = () => true }: { tries?: number; every?: number; isActive?: () => boolean } = {}
): Promise<CheckoutView | null> {
  let last: CheckoutView | null = null;
  for (let i = 0; i < tries && isActive(); i++) {
    if (i > 0) await wait(every);
    try {
      last = await fetchCheckout(checkoutId, cardId);
    } catch (error) {
      const { status } = readApiError(error);
      if (status >= 400 && status < 500 && status !== 429) {
        if (last) return last;
        throw error;
      }
    }
    if (isFinal(last?.status)) return last;
  }
  return last;
}

/**
 * What Stripe says of a payment, from its client secret: after a return from a
 * bank's page, or before showing the form again for a payment already started.
 * Null when Stripe can't be asked.
 */
export async function paymentIntentStatus(clientSecret: string, publishableKey: string | null): Promise<PaymentIntent.Status | null> {
  const stripe = await getStripe(publishableKey);
  if (!stripe) return null;
  try {
    const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
    return paymentIntent?.status ?? null;
  } catch {
    return null;
  }
}

/* ── The checkout being paid, per card, in this tab ─────────────────────── */

export interface SavedCheckout {
  checkoutId: number;
  planId: PlanId;
  /** The key /pay answered: Stripe.js must load with it to read this payment. */
  publishableKey: string | null;
  at: number;
}

const savedKey = (cardId: string | number) => `glamlink_checkout:${cardId}`;

/** A payment started more than a day ago is over: its checkout has expired. */
const SAVED_FOR_MS = 24 * 3600_000;

export function readSavedCheckout(cardId: string | number): SavedCheckout | null {
  try {
    const raw = sessionStorage.getItem(savedKey(cardId));
    if (!raw) return null;
    const saved = JSON.parse(raw) as SavedCheckout;
    if (saved?.checkoutId && Date.now() - saved.at < SAVED_FOR_MS) return saved;
    sessionStorage.removeItem(savedKey(cardId));
  } catch {
    // Storage blocked or unreadable: nothing saved.
  }
  return null;
}

export function saveCheckout(cardId: string | number, checkout: Omit<SavedCheckout, "at">) {
  try {
    sessionStorage.setItem(savedKey(cardId), JSON.stringify({ ...checkout, at: Date.now() }));
  } catch {
    // Storage blocked: a reload starts from the plans; the API still refuses a second payment.
  }
}

export function clearSavedCheckout(cardId: string | number) {
  try {
    sessionStorage.removeItem(savedKey(cardId));
  } catch {
    // Nothing to clear.
  }
}

