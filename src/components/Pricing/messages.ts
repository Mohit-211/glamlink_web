/**
 * Purchase errors worded for the person: no raw "Network Error", server text
 * or Stripe internals. Kept apart from checkout.ts so pages that only show
 * plans don't load Stripe.js.
 */
import type { StripeError } from "@stripe/stripe-js";
import { readApiError } from "@/lib/apiError";

/** An API refusal, worded for the person. */
export function friendlyError(error: unknown): string {
  const { status, code, message } = readApiError(error);
  if (status === 0) return "We can't reach Glamlink. Check your connection and try again.";
  if (code === "PAYMENT_FAILED") return "We couldn't start the payment. Please try again in a minute.";
  if (status >= 500) return "Something went wrong on our side. Please try again in a minute.";
  return message;
}

/** A Stripe.js confirmation error, worded for the person. Logs what isn't the person's to fix. */
export function paymentErrorMessage(error: StripeError): string {
  if (error.code === "payment_intent_authentication_failure") {
    return "Your bank couldn't confirm the payment. Try again, or use another card.";
  }
  if ((error.type === "card_error" || error.type === "validation_error") && error.message) return error.message;
  console.error("Stripe confirmPayment failed:", error);
  return "Your payment could not be completed. Please try again.";
}
