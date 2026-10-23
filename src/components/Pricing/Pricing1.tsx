"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Appearance } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  ArrowRight,
  Loader2,
  MapPin,
  ArrowLeft,
  AlertCircle,
  CreditCard,
  Lock,
  Truck,
  CheckCircle,
  MailCheck,
} from "lucide-react";
import {
  addNewAddressWithoutToken,
  claimCard,
  EditAddressWithoutTokenAPI,
  getAllStates,
  getCheckout,
  getCitiesByState,
  payCheckout,
  quoteCheckout,
  SelectPlanAPI,
} from "@/api/Api";
import { TOKENS } from "@/lib/designTokens";
import { readApiError } from "@/lib/apiError";
import { loginHref } from "@/lib/auth";
import { clearCardToken } from "@/lib/cardToken";
import { useSession } from "@/lib/useSession";
import { getStripe } from "@/lib/stripe";
import KeychainOffer from "./KeychainOffer";
import { PlanCard } from "./PlanCard";
import { ADD_ON_PLAN_IDS, money, usePlans, WITH_KEYCHAIN, type PlanDef, type PlanId } from "./plans";

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

interface PricingStepProps {
  businessCardId?: string | number | null;
  /** Set when a guest signed in to continue: claim the draft for their account first. */
  claim?: boolean;
  /** Preselects a plan (e.g. "nfc_only" from the dashboard's "Add keychain"). */
  initialPlan?: string | null;
  /**
   * Back from a payment method that leaves the site (a bank or wallet page):
   * the checkout id from the return URL, and Stripe's `redirect_status`.
   */
  returnCheckout?: string | null;
  redirectStatus?: string | null;
}

interface AddressFormState {
  address_line_1: string;
  address_line_2: string;
  state_id: string;
  city_id: string;
  postal_code: string;
}

/** `POST /access/checkout/quote`: what the plan costs this person now. */
interface Quote {
  checkout_id: number;
  plan_type: string;
  lines: { product: string; name?: string; amount: number; list: number; recurring: number | null; personal: boolean }[];
  shipping: {
    options: { rate_id: string; amount_cents: number; provider: string; service: string; estimated_days: number | null }[];
    selected: { rate_id: string } | null;
  } | null;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  monthly_cents: number | null;
}

const EMPTY_ADDRESS: AddressFormState = {
  address_line_1: "",
  address_line_2: "",
  state_id: "",
  city_id: "",
  postal_code: "",
};

const LINE_NAMES: Record<string, string> = { pro: "Access Pro, first month", keychain: "NFC keychain" };

type Step = "plan" | "address" | "review" | "payment";

const PLAN_IDS: PlanId[] = ["free", "nfc_only", "subscription_only", "nfc_with_subscription"];

export default function PricingStep({
  businessCardId,
  claim = false,
  initialPlan,
  returnCheckout,
  redirectStatus,
}: PricingStepProps) {
  const router = useRouter();
  const session = useSession();
  const signedIn = session.status === "signed-in";
  const { plans, sale, owned, loading: plansLoading, error: plansError, reload } = usePlans(businessCardId);

  const requestedPlan = PLAN_IDS.includes(initialPlan as PlanId) ? (initialPlan as PlanId) : null;
  // The plan card picked. The keychain alone is not a card: it is offered after Free or Pro.
  const [selected, setSelected] = useState<PlanId>(
    requestedPlan && !ADD_ON_PLAN_IDS.includes(requestedPlan) ? requestedPlan : "nfc_with_subscription"
  );
  // What is being bought: the card picked, or that card with the keychain added.
  const [checkoutId, setCheckoutId] = useState<PlanId | null>(null);
  // The card whose keychain offer is open, and the card the keychain was added to.
  const [offerFor, setOfferFor] = useState<PlanId | null>(null);
  const [keychainFrom, setKeychainFrom] = useState<PlanId | null>(null);
  const [step, setStep] = useState<Step>("plan");
  const [submitting, setSubmitting] = useState(false);
  const [claiming, setClaiming] = useState(claim);
  const [claimConflict, setClaimConflict] = useState(false);
  // "expired": the 24-hour card token is gone; the guest must start again or sign in.
  const [fatal, setFatal] = useState<"expired" | null>(null);
  // "processing": a bank payment that confirms later; Stripe's webhook tells the API.
  const [done, setDone] = useState<"free" | "paid" | "processing" | null>(null);

  const [address, setAddress] = useState<AddressFormState>(EMPTY_ADDRESS);
  const [states, setStates] = useState<{ id: number; name: string }[]>([]);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [correctedTo, setCorrectedTo] = useState<string | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const cardPlans = plans.filter((p) => !ADD_ON_PLAN_IDS.includes(p.id));
  const plan = cardPlans.find((p) => p.id === selected) ?? cardPlans[0];
  const checkoutPlan = plans.find((p) => p.id === checkoutId) ?? plan;
  // A claim must run once, even when an effect runs twice (development).
  const claimStarted = useRef(false);
  const keychainStarted = useRef(false);
  const stripePromise = useMemo(() => getStripe(), []);

  // The guest signed in because their email already had an account: move the
  // draft card to that account (with its card token), then continue signed in.
  useEffect(() => {
    if (!claiming || !businessCardId || session.status === "loading") return;
    if (session.status === "signed-out") {
      router.replace(loginHref(`/pricing?businessCardId=${businessCardId}&claim=1`));
      return;
    }
    if (claimStarted.current) return;
    claimStarted.current = true;
    runClaim(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claiming, businessCardId, session.status]);

  // Back from a redirect: wait for the API to see the payment (its webhook), then confirm.
  const returnState = returnCheckout && redirectStatus ? (redirectStatus === "failed" ? "failed" : "confirming") : null;
  useEffect(() => {
    if (returnState !== "confirming" || !returnCheckout || !businessCardId) return;
    let active = true;
    waitUntilPaid(returnCheckout, businessCardId).then((paid) => {
      if (!active) return;
      if (paid) clearCardToken(businessCardId);
      setDone(paid ? "paid" : "processing");
    });
    return () => {
      active = false;
    };
  }, [returnState, returnCheckout, businessCardId]);

  async function runClaim(replace: boolean) {
    if (!businessCardId) return;
    try {
      await claimCard(businessCardId, replace);
      clearCardToken(businessCardId);
      setClaimConflict(false);
      toast.success("Your card is now on your account.");
      router.replace(`/pricing?businessCardId=${businessCardId}`);
    } catch (error) {
      const { code, message } = readApiError(error);
      if (code === "CARD_EXISTS") setClaimConflict(true);
      else if (code === "CARD_TOKEN_REQUIRED") setFatal("expired");
      else toast.error(message);
    } finally {
      setClaiming(false);
    }
  }

  // Blocked plans: what the signed-in person already owns cannot be bought again.
  const isOwned = (id: PlanId) =>
    (owned.subscription && (id === "subscription_only" || id === "nfc_with_subscription")) ||
    (owned.keychain && (id === "nfc_only" || id === "nfc_with_subscription"));

  /** The plan that adds the keychain to card `id`, while it can still be offered. */
  const keychainUpgrade = (id: PlanId | null): PlanDef | null => {
    const target = id ? WITH_KEYCHAIN[id] : undefined;
    if (!target || owned.keychain || isOwned(target)) return null;
    return plans.find((p) => p.id === target) ?? null;
  };

  // The dashboard's "Include NFC" asks for the keychain alone: start on its delivery address.
  useEffect(() => {
    if (requestedPlan !== "nfc_only" || keychainStarted.current || claiming || plansLoading || !plans.length) return;
    keychainStarted.current = true;
    if (!owned.keychain) void Promise.resolve().then(() => startPlan("nfc_only"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedPlan, claiming, plansLoading, plans.length, owned.keychain]);

  async function loadStates() {
    if (states.length) return;
    try {
      const res = await getAllStates();
      setStates(res?.data?.all_state || []);
    } catch (error) {
      console.error("LOAD STATES ERROR", error);
    }
  }

  async function handleStateChange(stateId: string) {
    setAddress((f) => ({ ...f, state_id: stateId, city_id: "" }));
    if (!stateId) {
      setCities([]);
      return;
    }
    const res = await getCitiesByState(stateId);
    setCities(res?.data?.all_city || res?.all_city || []);
  }

  /** Common refusals of the purchase calls. Returns true when handled. */
  function handlePurchaseError(error: unknown): boolean {
    const { code, message } = readApiError(error);
    if (code === "ACCOUNT_EXISTS") {
      toast.info("This email already has a Glamlink account. Sign in to continue.");
      router.push(loginHref(`/pricing?businessCardId=${businessCardId}&claim=1`));
      return true;
    }
    if (code === "CARD_TOKEN_REQUIRED") {
      setFatal("expired");
      return true;
    }
    if (code === "ALREADY_OWNED") {
      toast.error("You already have Access Pro.");
      return true;
    }
    if (code === "NFC_ALREADY_PURCHASED") {
      toast.error("You already have your NFC keychain.");
      return true;
    }
    if (code === "ADDRESS_NOT_VERIFIED" || code === "ADDRESS_NOT_FOUND") {
      setStep("address");
      setAddressError("Please enter your delivery address first.");
      return true;
    }
    toast.error(message);
    return false;
  }

  async function requestQuote(target: PlanDef, rateId?: string) {
    if (!businessCardId) return;
    setSubmitting(true);
    try {
      const res = await quoteCheckout({ business_card_id: businessCardId, plan_type: target.planType, rate_id: rateId });
      setQuote((res?.data ?? res) as Quote);
      setStep("review");
    } catch (error) {
      const { code, message } = readApiError(error);
      if (code === "SHIPPING_COUNTRY_UNSUPPORTED") {
        setStep("address");
        setAddressError("The keychain ships within the United States only.");
      } else if (code === "CHECKOUT_EXPIRED") {
        toast.error("Prices were refreshed. Please review your order again.");
      } else if (!handlePurchaseError(error)) {
        console.error(message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  // Step 1: the plan card. Free and Access Pro first offer the keychain.
  function handlePrimaryContinue() {
    if (!plan) return;
    if (keychainUpgrade(plan.id)) setOfferFor(plan.id);
    else startPlan(plan.id);
  }

  // The server decides whether payment and shipping are needed. `addedTo` is
  // the card the keychain offer added the keychain to, so it can be dropped again.
  async function startPlan(id: PlanId, addedTo: PlanId | null = null) {
    const target = plans.find((p) => p.id === id);
    if (!businessCardId || !target) {
      toast.error("Missing business card reference. Please create your card again.");
      return;
    }
    setCheckoutId(id);
    setKeychainFrom(addedTo);
    setSubmitting(true);
    try {
      const res = await SelectPlanAPI({ business_card_id: businessCardId, plan_type: target.planType });
      const data = res?.data ?? res;
      const planType = String(data?.plan_type ?? target.planType).trim();
      if (!data?.payment_required || planType === "free") {
        clearCardToken(businessCardId);
        setDone("free");
        return;
      }
      if (target.hasKeychain) {
        await loadStates();
        setStep("address");
        return;
      }
      setSubmitting(false);
      await requestQuote(target);
    } catch (error) {
      handlePurchaseError(error);
    } finally {
      setSubmitting(false);
      setOfferFor(null);
    }
  }

  async function handleSaveAddress() {
    if (!businessCardId) return;
    if (!address.address_line_1.trim() || !address.state_id || !address.city_id || !address.postal_code.trim()) {
      setAddressError("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    setAddressError(null);
    try {
      const payload = {
        address_line_1: address.address_line_1.trim(),
        ...(address.address_line_2.trim() && { address_line_2: address.address_line_2.trim() }),
        state_id: parseInt(address.state_id),
        city_id: parseInt(address.city_id),
        postal_code: address.postal_code.trim(),
        business_card_id: businessCardId,
      };
      const res = addressId
        ? await EditAddressWithoutTokenAPI(addressId, payload)
        : await addNewAddressWithoutToken(payload);
      const data = res?.data ?? res;
      const saved = data?.address ?? data;
      if (!addressId && (data?.address_id ?? saved?.id)) setAddressId(data?.address_id ?? saved?.id);
      // Shippo saves the address as it corrected it (abbreviations, ZIP+4).
      setCorrectedTo(
        data?.corrected
          ? [saved?.address_line_1, saved?.address_line_2, saved?.postal_code].filter(Boolean).join(", ")
          : null
      );
    } catch (error) {
      const { code, message } = readApiError(error);
      if (code === "ADDRESS_INVALID") setAddressError(message.replace(/^Address validation failed:\s*/i, ""));
      else if (code === "ADDRESS_CHECK_UNAVAILABLE")
        setAddressError("We couldn't check the address just now. Please try again.");
      else if (!handlePurchaseError(error)) setAddressError(message);
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
    await requestQuote(checkoutPlan);
  }

  // Step 3: the API starts the subscription or the keychain payment and returns
  // its client secret, which the Payment Element is created with.
  async function handleStartPayment() {
    if (!quote || !businessCardId) return;
    setSubmitting(true);
    try {
      const res = await payCheckout(quote.checkout_id, businessCardId);
      const secret = res?.data?.client_secret;
      if (!secret) {
        toast.error("Payment could not be started. Please try again.");
        return;
      }
      setClientSecret(secret);
      setStep("payment");
    } catch (error) {
      const { code } = readApiError(error);
      if (code === "ALREADY_PAID") {
        clearCardToken(businessCardId);
        setDone("paid");
      } else if (code === "CHECKOUT_EXPIRED") {
        toast.error("Prices were refreshed. Please review your order again.");
        setSubmitting(false);
        await requestQuote(checkoutPlan, quote.shipping?.selected?.rate_id);
      } else {
        handlePurchaseError(error);
      }
    } finally {
      setSubmitting(false);
    }
  }

  const ownerEmailNote = signedIn
    ? null
    : "We've emailed you a link to set your password. Use it to sign in and manage your card.";

  /* ── Page states before the steps ─────────────────────────────────────── */

  if (fatal === "expired") {
    return (
      <Centered>
        <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
        <h1 className="mt-4 text-xl">This purchase has timed out</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A card you build while signed out can be finished within 24 hours. Start again, or sign in if you already
          paid.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={() => router.push("/access")} className="btn-primary flex-1">
            Start again
          </button>
          <button type="button" onClick={() => router.push("/login")} className="btn-outline flex-1">
            Sign in
          </button>
        </div>
      </Centered>
    );
  }

  if (returnState === "failed" && !done) {
    return (
      <Centered>
        <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
        <h1 className="mt-4 text-xl">Your payment didn&apos;t go through</h1>
        <p className="mt-2 text-sm text-muted-foreground">Nothing was charged. Try again, or choose another way to pay.</p>
        <button
          type="button"
          onClick={() => router.replace(`/pricing?businessCardId=${businessCardId}`)}
          className="btn-primary mt-6 w-full"
        >
          Try again
        </button>
      </Centered>
    );
  }

  if (returnState === "confirming" && !done) {
    return (
      <Centered>
        <Loader2 className="mx-auto h-7 w-7 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Confirming your payment...</p>
      </Centered>
    );
  }

  if (claimConflict) {
    return (
      <Centered>
        <h1 className="text-xl">You already have an Access card</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Keep the card you have, or replace it with the one you just made. The new card keeps your public link, QR
          code, keychain and plan.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={() => router.push("/dashboard")} className="btn-outline flex-1">
            Keep my card
          </button>
          <button type="button" onClick={() => runClaim(true)} className="btn-primary flex-1">
            Replace it
          </button>
        </div>
      </Centered>
    );
  }

  if (done) {
    return (
      <Centered>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent">
          {ownerEmailNote ? <MailCheck className="h-7 w-7 text-primary" /> : <CheckCircle className="h-7 w-7 text-primary" />}
        </div>
        <h2 className="mt-4 text-xl text-foreground">
          {done === "paid" ? "Payment successful!" : done === "processing" ? "Payment processing" : "Welcome to Glamlink!"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {done === "paid"
            ? "Your order is confirmed and your card is live."
            : done === "processing"
              ? "Your bank is confirming the payment. We'll email you as soon as it's through."
              : "Your card is live on the Free plan."}
          {ownerEmailNote && <> {ownerEmailNote}</>}
        </p>
        {signedIn && (
          <button type="button" onClick={() => router.push("/dashboard")} className="btn-primary mt-6 w-full">
            Go to dashboard
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </Centered>
    );
  }

  if (claiming || plansLoading) {
    return (
      <Centered>
        <Loader2 className="mx-auto h-7 w-7 animate-spin text-primary" />
      </Centered>
    );
  }

  if (plansError || !plan) {
    return (
      <Centered>
        <p className="text-sm text-muted-foreground">{plansError ?? "No plans are available right now."}</p>
        <button type="button" onClick={reload} className="btn-outline mt-4">
          Try again
        </button>
      </Centered>
    );
  }

  /* ── Steps ────────────────────────────────────────────────────────────── */

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="page-soft w-[90%] px-4 py-14">
        <div className="mx-auto m-10 w-full">
          {step === "plan" && (
            <>
              <div className="mx-auto mb-10 max-w-5xl">
                <h1 className="mt-1 text-[26px] leading-tight text-foreground sm:text-[30px]">Choose your plan</h1>
                <p className="section-subtitle mt-2 max-w-md text-[15px] leading-6">
                  Choose the plan that best fits your business. You can upgrade anytime.
                </p>
                {sale && (
                  <p className="badge-soft mt-4">
                    {sale.name} sale
                    {sale.ends_at && ` · ends ${new Date(sale.ends_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                  </p>
                )}
              </div>

              <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
                {cardPlans.map((p) => (
                  <PlanCard
                    key={p.id}
                    plan={p}
                    selected={selected === p.id}
                    disabled={isOwned(p.id)}
                    onSelect={() => setSelected(p.id)}
                  />
                ))}
              </div>

              <div className="mt-9 flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrimaryContinue}
                  disabled={submitting || isOwned(plan.id)}
                  className="btn-primary w-full max-w-xs flex-col gap-0.5 py-3 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
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
              </div>

              <KeychainOffer
                plan={cardPlans.find((p) => p.id === offerFor) ?? null}
                withKeychain={keychainUpgrade(offerFor)}
                busy={submitting}
                onAdd={() => offerFor && startPlan(WITH_KEYCHAIN[offerFor] as PlanId, offerFor)}
                onSkip={() => offerFor && startPlan(offerFor)}
                onClose={() => setOfferFor(null)}
              />
            </>
          )}

          {step === "address" && (
            <div className="mx-auto max-w-md">
              <BackButton onClick={() => setStep("plan")} disabled={submitting}>
                Back to plans
              </BackButton>
              <StepHeading icon={<MapPin className="h-4.5 w-4.5 text-primary" />} title="Delivery address">
                Where should we ship your NFC keychain?
              </StepHeading>

              <div className="card-glamlink space-y-3.5">
                {addressError && <ErrorNote>{addressError}</ErrorNote>}
                <label className="block">
                  <span className="label-glamlink">
                    Street address <span className="text-destructive">*</span>
                  </span>
                  <input
                    value={address.address_line_1}
                    onChange={(e) => setAddress((f) => ({ ...f, address_line_1: e.target.value }))}
                    placeholder="e.g. 3730 S Las Vegas Blvd"
                    autoComplete="address-line1"
                    disabled={submitting}
                    className="input-glamlink"
                  />
                </label>
                <label className="block">
                  <span className="label-glamlink">Apartment, suite (optional)</span>
                  <input
                    value={address.address_line_2}
                    onChange={(e) => setAddress((f) => ({ ...f, address_line_2: e.target.value }))}
                    placeholder="e.g. Suite 5"
                    autoComplete="address-line2"
                    disabled={submitting}
                    className="input-glamlink"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="label-glamlink">
                      State <span className="text-destructive">*</span>
                    </span>
                    <select
                      value={address.state_id}
                      onChange={(e) => handleStateChange(e.target.value)}
                      disabled={submitting}
                      className="input-glamlink"
                    >
                      <option value="">Select state</option>
                      {states.map((s) => (
                        <option key={s.id} value={String(s.id)}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="label-glamlink">
                      City <span className="text-destructive">*</span>
                    </span>
                    <select
                      value={address.city_id}
                      onChange={(e) => setAddress((f) => ({ ...f, city_id: e.target.value }))}
                      disabled={!address.state_id || submitting}
                      className="input-glamlink"
                    >
                      <option value="">Select city</option>
                      {cities.map((c) => (
                        <option key={c.id} value={String(c.id)}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="block">
                  <span className="label-glamlink">
                    ZIP code <span className="text-destructive">*</span>
                  </span>
                  <input
                    value={address.postal_code}
                    onChange={(e) => setAddress((f) => ({ ...f, postal_code: e.target.value.toUpperCase() }))}
                    placeholder="Enter ZIP code"
                    autoComplete="postal-code"
                    maxLength={10}
                    disabled={submitting}
                    className="input-glamlink"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={handleSaveAddress}
                disabled={submitting}
                className="btn-primary mt-6 w-full py-3 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking address...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
              {keychainFrom && (
                <button
                  type="button"
                  onClick={() => startPlan(keychainFrom)}
                  disabled={submitting}
                  className="mt-3 w-full rounded-full py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
                >
                  Continue without the keychain
                </button>
              )}
            </div>
          )}

          {step === "review" && quote && (
            <div className="mx-auto max-w-md">
              <BackButton onClick={() => setStep(checkoutPlan.hasKeychain ? "address" : "plan")} disabled={submitting}>
                Back
              </BackButton>
              <StepHeading icon={<Truck className="h-4.5 w-4.5 text-primary" />} title="Your order">
                Review what you pay today before payment.
              </StepHeading>

              {correctedTo && (
                <p className="mb-4 rounded-xl border border-primary/25 bg-accent/60 px-3 py-2.5 text-xs text-foreground">
                  We corrected your address for delivery to <span className="font-medium">{correctedTo}</span>.
                </p>
              )}

              {quote.shipping && quote.shipping.options.length > 1 && (
                <div className="card-glamlink mb-4 space-y-2">
                  <p className="label-glamlink">Shipping</p>
                  {quote.shipping.options.map((o) => (
                    <label key={o.rate_id} className="flex cursor-pointer items-center gap-3 text-sm">
                      <input
                        type="radio"
                        name="rate"
                        checked={quote.shipping?.selected?.rate_id === o.rate_id}
                        onChange={() => requestQuote(checkoutPlan, o.rate_id)}
                        disabled={submitting}
                        className="accent-secondary"
                      />
                      <span className="flex-1">
                        {o.provider} {o.service}
                        {o.estimated_days ? (
                          <span className="text-muted-foreground"> · {o.estimated_days} days</span>
                        ) : null}
                      </span>
                      <span className="font-medium">{money(o.amount_cents)}</span>
                    </label>
                  ))}
                </div>
              )}

              <div className="card-glamlink space-y-2">
                {quote.lines.map((line) => (
                  <div key={line.product} className="flex justify-between text-[13px] text-muted-foreground">
                    <span>{line.name ?? LINE_NAMES[line.product] ?? line.product}</span>
                    <span>
                      {line.list > line.amount && <span className="mr-1.5 line-through">{money(line.list)}</span>}
                      {money(line.amount)}
                    </span>
                  </div>
                ))}
                {quote.shipping_cents > 0 && (
                  <div className="flex justify-between text-[13px] text-muted-foreground">
                    <span>Shipping</span>
                    <span>{money(quote.shipping_cents)}</span>
                  </div>
                )}
                <div className="h-px bg-border" />
                <div className="flex justify-between text-sm font-semibold text-foreground">
                  <span>Total due today</span>
                  <span className="text-primary">{money(quote.total_cents)}</span>
                </div>
                {quote.monthly_cents ? (
                  <p className="text-[11px] text-muted-foreground">
                    Then {money(quote.monthly_cents)} / month. Cancel anytime; Pro runs to the end of the paid month.
                  </p>
                ) : null}
              </div>

              <button
                type="button"
                onClick={handleStartPayment}
                disabled={submitting}
                className="btn-primary mt-6 w-full py-3 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Starting payment...
                  </>
                ) : (
                  <>
                    Continue to payment
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {step === "payment" && quote && businessCardId && clientSecret && (
            // A new client secret needs a new Elements: Stripe fixes it at creation.
            <Elements
              key={clientSecret}
              stripe={stripePromise}
              options={{ clientSecret, appearance: APPEARANCE, fonts: ELEMENTS_FONTS }}
            >
              <PaymentStep
                businessCardId={businessCardId}
                quote={quote}
                planLabel={checkoutPlan.name}
                onBack={() => setStep("review")}
                onDone={(result) => {
                  if (result === "paid") clearCardToken(businessCardId);
                  setDone(result);
                }}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Payment ──────────────────────────────────────────────────────────────── */

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Stripe tells the API through its webhook: waits up to 18 seconds for the checkout to be paid. */
async function waitUntilPaid(checkoutId: number | string, businessCardId: string | number): Promise<boolean> {
  for (let i = 0; i < 12; i++) {
    const check = await getCheckout(checkoutId, businessCardId).catch(() => null);
    if ((check?.data ?? check)?.status === "paid") return true;
    await wait(1500);
  }
  return false;
}

/** Where a payment method that leaves the site (a bank or wallet page) sends the person back. */
const paymentReturnUrl = (businessCardId: string | number, checkoutId: number) =>
  `${window.location.origin}/pricing?businessCardId=${encodeURIComponent(String(businessCardId))}&checkout=${checkoutId}`;

function PaymentStep({
  businessCardId,
  quote,
  planLabel,
  onBack,
  onDone,
}: {
  businessCardId: string | number;
  quote: Quote;
  planLabel: string;
  onBack: () => void;
  onDone: (result: "paid" | "processing") => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState<"idle" | "paying" | "confirming">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [ready, setReady] = useState(false);

  async function handlePay(event: React.FormEvent) {
    event.preventDefault();
    if (!stripe || !elements) return;
    setStatus("paying");
    setErrorMsg("");
    // Cards and wallets confirm here; bank and wallet pages that need a
    // redirect come back to the return URL.
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: paymentReturnUrl(businessCardId, quote.checkout_id) },
      redirect: "if_required",
    });
    if (error) {
      // Card and validation messages are written for the customer; others are not.
      setErrorMsg(
        (error.type === "card_error" || error.type === "validation_error") && error.message
          ? error.message
          : "Your payment could not be completed. Please try again."
      );
      setStatus("idle");
      return;
    }
    if (paymentIntent?.status === "processing") {
      onDone("processing");
      return;
    }
    setStatus("confirming");
    await waitUntilPaid(quote.checkout_id, businessCardId);
    onDone("paid");
  }

  const busy = status !== "idle";

  return (
    <div className="mx-auto max-w-md">
      <BackButton onClick={onBack} disabled={busy}>
        Back
      </BackButton>
      <StepHeading icon={<CreditCard className="h-4.5 w-4.5 text-primary" />} title="Payment">
        Complete your {planLabel} purchase.
      </StepHeading>

      <form onSubmit={handlePay}>
        <div className="card-glamlink space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-accent/40 px-4 py-3">
            <span className="text-sm font-semibold text-foreground">Total due today</span>
            <span className="text-sm font-semibold text-secondary">{money(quote.total_cents)}</span>
          </div>

          {errorMsg && <ErrorNote>{errorMsg}</ErrorNote>}

          <PaymentElement
            options={{ layout: "tabs" }}
            onReady={() => setReady(true)}
            onLoadError={() => setErrorMsg("The payment form could not load. Go back and try again.")}
          />
        </div>

        <button
          type="submit"
          disabled={busy || !stripe || !ready}
          className="btn-primary mt-6 w-full py-3 disabled:opacity-50"
        >
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {status === "confirming" ? "Confirming payment..." : "Processing..."}
            </>
          ) : (
            <>
              <Lock className="h-3.5 w-3.5" />
              Pay {money(quote.total_cents)}
            </>
          )}
        </button>
        {quote.monthly_cents ? (
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Then {money(quote.monthly_cents)} / month until you cancel.
          </p>
        ) : null}
      </form>
    </div>
  );
}

/* ── Small pieces ─────────────────────────────────────────────────────────── */

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card-glamlink w-full max-w-md text-center hover:translate-y-0">{children}</div>
    </div>
  );
}

function BackButton({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mb-6 flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground disabled:opacity-50"
    >
      <ArrowLeft className="h-4 w-4" /> {children}
    </button>
  );
}

function StepHeading({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent">{icon}</span>
      <div>
        <h2 className="text-xl text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}

function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-xs text-destructive">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {children}
    </div>
  );
}
