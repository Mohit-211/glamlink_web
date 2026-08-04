"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  ArrowRight,
  Loader2,
  MapPin,
  ArrowLeft,
  AlertCircle,
  CreditCard,
  Lock,
  Truck,
} from "lucide-react";
import {
  addNewAddressWithoutToken,
  getAllStates,
  getCitiesByState,
  SelectPlanAPI,
  ShippingRateWithoutTokenApi,
  CreateSubscriptionWIthOutTokenAPI,
  EditAddressWithoutTokenAPI,
} from "@/api/Api";
import { PlanCard } from "./PlanCard";
import { PLANS } from "./plans";
import type { PlanId } from "./plans";

// ── Stripe init ──────────────────────────────────────────────────────────────
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? "");

const ELEMENT_STYLE = {
  style: {
    base: {
      fontSize: "14px",
      color: "#0f172a",
      fontFamily: "inherit",
      "::placeholder": { color: "#94a3b8" },
    },
    invalid: { color: "#ef4444" },
  },
};

interface PricingStepProps {
  businessCardId?: string | number | null;
  /** Pass false when this flow runs before the user has an auth token (e.g. guest onboarding) */
  hasToken?: boolean;
}

interface AddressFormState {
  address_line_1: string;
  address_lat: string;
  address_long: string;
  state_id: string;
  city_id: string;
  postal_code: string;
}

interface ShippingData {
  nfc_price?: number;
  subscription_price?: number;
  shipping_amount: number;
  carrier: string;
  service: string;
  total_due_today: number;
}

const EMPTY_ADDRESS: AddressFormState = {
  address_line_1: "",
  address_lat: "",
  address_long: "",
  state_id: "",
  city_id: "",
  postal_code: "",
};

const INPUT =
  "w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50";
const LABEL =
  "mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground";

// Plan types returned by the server that require a physically shipped NFC card.
// (`SelectPlanAPI` can return this with trailing whitespace, so callers should
// always trim before comparing against this set.)
const SHIPPING_PLAN_TYPES = new Set(["nfc_only", "nfc_with_subscription"]);

type Step = "plan" | "address" | "shipping" | "payment";

export default function PricingStep({ businessCardId, hasToken = true }: PricingStepProps) {
  const [selected, setSelected] = useState<PlanId>("proKeychain");
  const [step, setStep] = useState<Step>("plan");
  const [submitting, setSubmitting] = useState(false);

  const [address, setAddress] = useState<AddressFormState>(EMPTY_ADDRESS);
  const [states, setStates] = useState<{ id: number; name: string }[]>([]);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [statesLoaded, setStatesLoaded] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
const [addressId, setAddressId] = useState<number | null>(null);
  // What the server actually decided the plan_type is (trimmed), and the
  // resulting shipping quote once we have an address for NFC plans.
  const [resolvedPlanType, setResolvedPlanType] = useState<string | null>(null);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);

  const router = useRouter();
  const plan = PLANS.find((p) => p.id === selected)!;

  async function loadStatesIfNeeded() {
    if (statesLoaded) return;
    try {
      const res = await getAllStates();
      setStates(res?.data?.all_state || []);
      setStatesLoaded(true);
    } catch (error) {
      console.error("LOAD STATES ERROR 👉", error);
    }
  }

  async function handleStateChange(stateId: string) {
    setAddress((f) => ({ ...f, state_id: stateId, city_id: "" }));
    if (!stateId) {
      setCities([]);
      return;
    }
    try {
      const res = await getCitiesByState(stateId);
      setCities(res?.data?.all_city || res?.all_city || []);
    } catch (error) {
      console.error("LOAD CITIES ERROR 👉", error);
    }
  }

  function set(key: keyof AddressFormState) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setAddress((f) => ({ ...f, [key]: e.target.value }));
  }

  function validateAddress(): boolean {
    if (
      !address.address_line_1.trim() ||
      !address.state_id ||
      !address.city_id ||
      !address.postal_code.trim()
    ) {
      setAddressError("Please fill in all required fields.");
      return false;
    }
    return true;
  }

  // Step 1 — user picks a plan and hits "Continue". Select the plan on the
  // server first (this is the source of truth for plan_type / payment_required),
  // then branch the UI based on what comes back.
  async function handlePrimaryContinue() {
    if (!businessCardId) {
      message.error("Missing business card reference. Please try again.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await SelectPlanAPI({
        business_card_id: businessCardId,
        plan_type: plan.planType,
      });

      const data = res?.data ?? res;
      const planType = String(data?.plan_type ?? plan.planType).trim();
      const paymentRequired = Boolean(data?.payment_required);
      setResolvedPlanType(planType);

      if (!paymentRequired || planType === "free") {
        // Free plan — nothing further to pay or ship.
        router.push("/dashboard");
        return;
      }

      if (SHIPPING_PLAN_TYPES.has(planType)) {
        // nfc_only / nfc_with_subscription — need a shipping address first.
        await loadStatesIfNeeded();
        setStep("address");
      } else {
        // subscription_only (or any other paid, non-shipping plan) — go
        // straight to payment, no address/shipping step needed.
        setStep("payment");
      }
    } catch (error) {
      console.error("SELECT PLAN ERROR 👉", error);
      message.error("Failed to select plan. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

 async function handleSaveAddressAndGetShipping() {
  if (!validateAddress() || !businessCardId) return;

  setSubmitting(true);
  setAddressError(null);
  try {
    const addressPayload = {
      address_line_1: address.address_line_1.trim(),
      ...(address.address_lat && { address_lat: parseFloat(address.address_lat) }),
      ...(address.address_long && { address_long: parseFloat(address.address_long) }),
      state_id: parseInt(address.state_id),
      city_id: parseInt(address.city_id),
      postal_code: address.postal_code.trim(),
      business_card_id: businessCardId,
    };

    if (addressId) {
      // We already created an address earlier in this session — edit it
      // instead of creating a duplicate.
      const editRes = await EditAddressWithoutTokenAPI(addressId, addressPayload);
      if (editRes?.success === false) {
        setAddressError(
          editRes?.message || "Please enter a valid address, city, state and postal code."
        );
        setSubmitting(false);
        return;
      }
    } else {
      const addressRes = await addNewAddressWithoutToken(addressPayload);
      if (addressRes?.success === false) {
        setAddressError(
          addressRes?.message || "Please enter a valid address, city, state and postal code."
        );
        setSubmitting(false);
        return;
      }
      // Remember the id so a later resubmission edits rather than duplicates.
      const newAddressId = addressRes?.address_id ?? addressRes?.data?.address_id;
      if (newAddressId) setAddressId(newAddressId);
    }
  } catch (error: any) {
    console.error("ADD/EDIT ADDRESS ERROR 👉", error);
    setAddressError(
      error?.response?.data?.message ===
        "Address validation failed: Unable to find a valid city, state or 5-digit zip. Please check the accuracy of the submitted address."
        ? "Please enter a valid address, city, state and postal code."
        : error?.response?.data?.message || "Failed to save address. Please try again."
    );
    setSubmitting(false);
    return;
  }

  setLoadingShipping(true);
  setShippingError(null);
  try {
    const shipRes = await ShippingRateWithoutTokenApi({ business_card_id: businessCardId });
    setShippingData(shipRes?.data ?? shipRes);
    setStep("shipping");
  } catch (error: any) {
    console.error("SHIPPING RATE ERROR 👉", error);
    setShippingError(
      error?.response?.data?.message || "Could not calculate shipping. Please try again."
    );
  } finally {
    setLoadingShipping(false);
    setSubmitting(false);
  }
}
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="page-soft w-[90%] px-4 py-14">
        <style>{`
          @keyframes sheen {
            0% { transform: translateX(-120%) rotate(8deg); }
            100% { transform: translateX(220%) rotate(8deg); }
          }
          .sheen-sweep { animation: sheen 5s ease-in-out infinite; animation-delay: 1s; }
          @media (prefers-reduced-motion: reduce) {
            .sheen-sweep { animation: none; }
          }
        `}</style>

        <div className="mx-auto w-full m-10">
          {step === "plan" && (
            <>
              <div className="mb-10">
                <h1 className="font-display mt-1 text-[26px] leading-tight text-foreground sm:text-[30px]">
                  Choose your plan
                </h1>
                <p className="section-subtitle mt-2 max-w-md text-[15px] leading-6">
                  Choose the plan that best fits your business. You can upgrade anytime.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {PLANS.map((p) => (
                  <PlanCard
                    key={p.id}
                    plan={p}
                    selected={selected === p.id}
                    onSelect={() => setSelected(p.id)}
                  />
                ))}
              </div>

              <div className="mt-9 flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrimaryContinue}
                  disabled={submitting}
                  className="btn-primary w-full max-w-xs flex-col gap-0.5 py-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
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
            </>
          )}

          {step === "address" && (
            <div className="mx-auto max-w-md">
              <button
                type="button"
                onClick={() => setStep("plan")}
                disabled={submitting}
                className="mb-6 flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4" /> Back to plans
              </button>

              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-accent">
                  <MapPin className="h-4.5 w-4.5 text-primary" />
                </span>
                <div>
                  <h2 className="font-display text-xl text-foreground">Delivery address</h2>
                  <p className="text-sm text-muted-foreground">
                    Where should we ship your {plan.name} keychain?
                  </p>
                </div>
              </div>

              <div className="card-glamlink space-y-3.5">
                {addressError && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {addressError}
                  </div>
                )}

                <div>
                  <label className={LABEL}>
                    Address Line 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={address.address_line_1}
                    onChange={set("address_line_1")}
                    placeholder="e.g. 3730 S Las Vegas Blvd"
                    disabled={submitting}
                    className={INPUT}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={LABEL}>
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={address.state_id}
                      onChange={(e) => handleStateChange(e.target.value)}
                      disabled={submitting}
                      className={INPUT}
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state.id} value={String(state.id)}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={LABEL}>
                      City <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={address.city_id}
                      onChange={(e) => setAddress((f) => ({ ...f, city_id: e.target.value }))}
                      disabled={!address.state_id || submitting}
                      className={INPUT}
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city.id} value={String(city.id)}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={LABEL}>
                    Zip Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={address.postal_code}
                    onChange={(e) =>
                      setAddress((f) => ({ ...f, postal_code: e.target.value.toUpperCase() }))
                    }
                    placeholder="Enter ZIP Code"
                    maxLength={10}
                    disabled={submitting}
                    className={INPUT}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveAddressAndGetShipping}
                disabled={submitting || loadingShipping}
                className="btn-primary mt-6 flex w-full items-center justify-center gap-2 py-3 disabled:opacity-50"
              >
                {submitting || loadingShipping ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Calculating shipping...
                  </>
                ) : (
                  <>
                    Continue to shipping
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {step === "shipping" && (
            <div className="mx-auto max-w-md">
              <button
                type="button"
                onClick={() => setStep("address")}
                className="mb-6 flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" /> Back to address
              </button>

              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-accent">
                  <Truck className="h-4.5 w-4.5 text-primary" />
                </span>
                <div>
                  <h2 className="font-display text-xl text-foreground">Shipping</h2>
                  <p className="text-sm text-muted-foreground">
                    Review your delivery cost before payment.
                  </p>
                </div>
              </div>

              {shippingError && (
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {shippingError}
                </div>
              )}

              <div className="card-glamlink space-y-2">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      {shippingData?.carrier} · {shippingData?.service}
                    </p>
                    <p className="text-[11px] text-muted-foreground">Estimated delivery method</p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    ${shippingData?.shipping_amount?.toFixed(2)}
                  </p>
                </div>

                {shippingData?.nfc_price !== undefined && (
                  <div className="flex justify-between text-[13px] text-muted-foreground">
                    <span>NFC Card</span>
                    <span>${shippingData.nfc_price.toFixed(2)}</span>
                  </div>
                )}
                {shippingData?.subscription_price !== undefined && (
                  <div className="flex justify-between text-[13px] text-muted-foreground">
                    <span>Subscription</span>
                    <span>${shippingData.subscription_price.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[13px] text-muted-foreground">
                  <span>Shipping ({shippingData?.carrier})</span>
                  <span>${shippingData?.shipping_amount?.toFixed(2)}</span>
                </div>

                <div className="h-px bg-border" />

                <div className="flex justify-between text-sm font-bold text-foreground">
                  <span>Total due today</span>
                  <span className="text-primary">
                    ${shippingData?.total_due_today?.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep("payment")}
                className="btn-primary mt-6 flex w-full items-center justify-center gap-2 py-3"
              >
                Continue to payment
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {step === "payment" && (
            <Elements stripe={stripePromise}>
              <GuestPaymentStep
                businessCardId={businessCardId}
                planLabel={plan.name}
                shipping={shippingData}
                purchaseType={resolvedPlanType || plan.planType}
                onBack={() =>
                  setStep(SHIPPING_PLAN_TYPES.has(resolvedPlanType || "") ? "shipping" : "plan")
                }
                onSuccess={() => router.push("/dashboard")}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Guest payment step (no auth token) ───────────────────────────────────────
interface GuestPaymentStepProps {
  businessCardId?: string | number | null;
  planLabel: string;
  shipping: ShippingData | null;
  purchaseType: string;
  onBack: () => void;
  onSuccess: () => void;
}

function GuestPaymentStep({
  businessCardId,
  planLabel,
  shipping,
  purchaseType,
  onBack,
  onSuccess,
}: GuestPaymentStepProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [cardName, setCardName] = useState("");

  const totalAmount = shipping ? shipping.total_due_today : 4.99;

  async function handlePay() {
    if (!stripe || !elements || !businessCardId) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const cardNumber = elements.getElement(CardNumberElement);
      if (!cardNumber) throw new Error("Card element not found");

      const response = await CreateSubscriptionWIthOutTokenAPI({
        business_card_id: Number(businessCardId),
        purchase_type: purchaseType,
      });

      const clientSecret =
        response?.data?.clientSecret || response?.clientSecret || response?.client_secret;
      if (!clientSecret) throw new Error("Client secret not received from server.");

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumber,
          billing_details: { name: cardName },
        },
      });

      if (paymentResult.error) throw new Error(paymentResult.error.message);

      if (paymentResult.paymentIntent?.status === "succeeded") {
        setStatus("success");
        setTimeout(onSuccess, 1500);
      } else {
        throw new Error("Payment was not completed successfully.");
      }
    } catch (error: any) {
      console.error("PAYMENT ERROR 👉", error);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Payment processing failed. Please try again.";
      setStatus("error");
      setErrorMsg(msg);
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-base font-semibold text-foreground">Payment successful!</p>
          <p className="mt-1 text-sm text-muted-foreground">Your order has been confirmed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <button
        type="button"
        onClick={onBack}
        disabled={status === "loading"}
        className="mb-6 flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground disabled:opacity-50"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-accent">
          <CreditCard className="h-4.5 w-4.5 text-primary" />
        </span>
        <div>
          <h2 className="font-display text-xl text-foreground">Payment</h2>
          <p className="text-sm text-muted-foreground">Complete your {planLabel} purchase.</p>
        </div>
      </div>

      <div className="card-glamlink space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-accent/40 px-4 py-3">
          <span className="text-sm font-semibold text-foreground">
            {shipping ? "Order Summary" : "Subscription Plan"}
          </span>
          <span className="text-sm font-bold text-primary">${totalAmount.toFixed(2)}</span>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {errorMsg}
          </div>
        )}

        <div>
          <label className={LABEL}>Name on card</label>
          <input
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="Name on card"
            className={INPUT}
          />
        </div>

        <div>
          <label className={LABEL}>Card number</label>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-3 transition focus-within:ring-2 focus-within:ring-primary/30">
            <div className="flex-1">
              <CardNumberElement
                options={{ ...ELEMENT_STYLE, placeholder: "Card number (16 digits)" }}
              />
            </div>
            <CreditCard className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL}>Expiry</label>
            <div className="rounded-xl border border-border bg-card px-3.5 py-3 transition focus-within:ring-2 focus-within:ring-primary/30">
              <CardExpiryElement options={ELEMENT_STYLE} />
            </div>
          </div>
          <div>
            <label className={LABEL}>CVC</label>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-3 transition focus-within:ring-2 focus-within:ring-primary/30">
              <div className="flex-1">
                <CardCvcElement options={ELEMENT_STYLE} />
              </div>
              <Lock className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handlePay}
        disabled={status === "loading" || !stripe}
        className="btn-primary mt-6 flex w-full items-center justify-center gap-2 py-3 disabled:opacity-50"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="h-3.5 w-3.5" />
            Pay ${totalAmount.toFixed(2)}
          </>
        )}
      </button>
    </div>
  );
}