"use client";

import { useEffect, useMemo, useState } from "react";
import type { Appearance, PaymentIntent, StripePaymentElementOptions } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { CreditCard, Loader2, Lock, RefreshCw } from "lucide-react";
import { TOKENS } from "@/lib/designTokens";
import { getStripe } from "@/lib/stripe";
import { money } from "./plans";
import type { CheckoutView } from "./checkout";
import { paymentErrorMessage } from "./messages";
import { BackButton, ErrorNote, StepHeading } from "./ui";

// Stripe's Payment Element renders inside its own iframe, which cannot see the
// site's CSS: Manrope is loaded into it and the design tokens are passed here.
const ELEMENTS_FONTS = [{ cssSrc: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&display=swap" }];

const APPEARANCE: Appearance = {
  theme: "stripe",
  variables: {
    colorPrimary: TOKENS.primary,
    colorBackground: TOKENS.card,
    colorText: TOKENS.foreground,
    colorTextSecondary: TOKENS.mutedForeground,
    colorDanger: TOKENS.destructive,
    fontFamily: "Manrope, system-ui, -apple-system, sans-serif",
    borderRadius: "12px",
  },
  rules: {
    ".Input": { borderColor: TOKENS.input, boxShadow: "none" },
    ".Input:focus": { borderColor: TOKENS.primary, boxShadow: `0 0 0 3px ${TOKENS.primary}26` },
    ".Label": { fontWeight: "500" },
  },
};

/** Where a payment method that leaves the site (a bank's 3-D Secure page) sends the person back. */
const paymentReturnUrl = (businessCardId: string | number, checkoutId: number) =>
  `${window.location.origin}/pricing?businessCardId=${encodeURIComponent(String(businessCardId))}&checkout=${checkoutId}`;

interface PaymentStepProps {
  businessCardId: string | number;
  quote: CheckoutView;
  clientSecret: string;
  /** The key /pay answered with the secret (null: the API's key). */
  publishableKey: string | null;
  planLabel: string;
  /** The buyer's email when known: Link and the wallets need not ask for it. */
  email: string | null;
  /** Shown above the form, e.g. when an earlier attempt didn't go through. */
  notice?: string | null;
  onBack: () => void;
  /** Stripe took the payment (its PaymentIntent status); the API confirms it next. */
  onConfirmed: (status: PaymentIntent.Status | null) => void;
}

/**
 * The payment form: Stripe's Payment Element for the checkout's client secret.
 * Cards, Apple Pay, Google Pay and Link, as the payment allows (Stripe decides
 * which from the account's settings). If Stripe can't load, the person is told
 * and can try again; nothing is cached from a failed load.
 */
export default function PaymentStep(props: PaymentStepProps) {
  const { clientSecret, publishableKey, planLabel, onBack } = props;
  const [attempt, setAttempt] = useState(0);
  const [stripePromise, setStripePromise] = useState(() => getStripe(publishableKey));
  const [unavailable, setUnavailable] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    let active = true;
    void stripePromise.then((stripe) => {
      if (active) setUnavailable(!stripe);
    });
    return () => {
      active = false;
    };
  }, [stripePromise]);

  const retry = () => {
    setUnavailable(false);
    setStripePromise(getStripe(publishableKey));
    setAttempt((n) => n + 1);
  };

  return (
    <div className="mx-auto max-w-md">
      <BackButton onClick={onBack} disabled={paying}>
        Back
      </BackButton>
      <StepHeading icon={<CreditCard className="h-4.5 w-4.5 text-primary" />} title="Payment">
        Complete your {planLabel} purchase.
      </StepHeading>

      {unavailable ? (
        <PaymentsUnavailable onRetry={retry} />
      ) : (
        // A new client secret or a reload of Stripe needs a new Elements: Stripe fixes both at creation.
        <Elements
          key={`${clientSecret}:${attempt}`}
          stripe={stripePromise}
          options={{ clientSecret, appearance: APPEARANCE, fonts: ELEMENTS_FONTS }}
        >
          <PaymentForm {...props} onPaying={setPaying} onLoadFailed={retry} />
        </Elements>
      )}
    </div>
  );
}

function PaymentsUnavailable({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="card-glamlink space-y-4 text-center">
      <ErrorNote>Payments are unavailable right now. Try again in a minute.</ErrorNote>
      <button type="button" onClick={onRetry} className="btn-outline w-full">
        <RefreshCw className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}

function PaymentForm({
  businessCardId,
  quote,
  email,
  notice,
  onConfirmed,
  onPaying,
  onLoadFailed,
}: PaymentStepProps & { onPaying: (paying: boolean) => void; onLoadFailed: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState(notice ?? "");
  const [ready, setReady] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  const options = useMemo<StripePaymentElementOptions>(
    () => ({
      layout: "tabs",
      // The wallets first where the device has them, then the card form.
      wallets: { applePay: "auto", googlePay: "auto" },
      paymentMethodOrder: ["apple_pay", "google_pay", "card", "link"],
      ...(email ? { defaultValues: { billingDetails: { email } } } : {}),
    }),
    [email]
  );

  const setBusy = (busy: boolean) => {
    setPaying(busy);
    onPaying(busy);
  };

  async function handlePay(event: React.FormEvent) {
    event.preventDefault();
    if (!stripe || !elements || paying) return;
    setBusy(true);
    setErrorMsg("");
    // Cards and wallets confirm here, 3-D Secure in Stripe's own window; a
    // method that needs to leave the site comes back to the return URL.
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: paymentReturnUrl(businessCardId, quote.checkout_id) },
      redirect: "if_required",
    });
    if (error) {
      setErrorMsg(paymentErrorMessage(error));
      setBusy(false);
      return;
    }
    // Stays busy: the page now waits for the API to see the payment.
    onConfirmed(paymentIntent?.status ?? null);
  }

  if (loadFailed) {
    return (
      <div className="card-glamlink space-y-4 text-center">
        <ErrorNote>The payment form couldn&apos;t load. Payments may be unavailable for a moment.</ErrorNote>
        <button type="button" onClick={onLoadFailed} className="btn-outline w-full">
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handlePay}>
      <div className="card-glamlink space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-accent/40 px-4 py-3">
          <span className="text-sm font-semibold text-foreground">Total due today</span>
          <span className="text-sm font-semibold text-secondary">{money(quote.total_cents)}</span>
        </div>

        {errorMsg && <ErrorNote>{errorMsg}</ErrorNote>}

        <PaymentElement
          options={options}
          onReady={() => setReady(true)}
          onLoadError={(event) => {
            console.error("Stripe Payment Element failed to load:", event.error);
            setLoadFailed(true);
          }}
        />
        {!ready && (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={paying || !stripe || !elements || !ready}
        className="btn-primary mt-6 w-full py-3 disabled:opacity-50"
      >
        {paying ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="h-3.5 w-3.5" />
            Pay {money(quote.total_cents)}
          </>
        )}
      </button>
      {quote.monthly_cents ? (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Then {money(quote.monthly_cents)} / month until you cancel.
        </p>
      ) : null}
    </form>
  );
}
