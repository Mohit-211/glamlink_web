"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { PaymentIntent } from "@stripe/stripe-js";
import {
  ArrowRight,
  Loader2,
  MapPin,
  AlertCircle,
  Truck,
  CheckCircle,
  MailCheck,
  Clock,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import {
  addNewAddressWithoutToken,
  claimCard,
  EditAddressWithoutTokenAPI,
  getAllStates,
  getCitiesByState,
  payCheckout,
  quoteCheckout,
  SelectPlanAPI,
} from "@/api/Api";
import { readApiError } from "@/lib/apiError";
import { loginHref } from "@/lib/auth";
import { claimPath, clearCardToken, clearPendingClaim } from "@/lib/cardToken";
import { useSession } from "@/lib/useSession";
import { getFormDataFromSession } from "../glamcard/GlamCardForm/Formdatasessionstorage";
import KeychainOffer, { KeychainAddOn } from "./KeychainOffer";
import { PlanGrid } from "./PlanCard";
import PaymentStep from "./PaymentStep";
import {
  ADD_ON_PLAN_IDS,
  isOwnedPlan,
  money,
  ownedNote,
  usePlans,
  WITH_KEYCHAIN,
  type PlanDef,
  type PlanId,
} from "./plans";
import {
  clearSavedCheckout,
  fetchCheckout,
  paymentIntentStatus,
  readSavedCheckout,
  saveCheckout,
  waitForCheckout,
  type CheckoutView,
  type SavedCheckout,
} from "./checkout";
import { friendlyError } from "./messages";
import { BackButton, Centered, ErrorNote, StepHeading } from "./ui";

interface PricingStepProps {
  /** The card being bought for (a positive integer; the page checks it). */
  businessCardId: string;
  /** Set when a guest signed in to continue: claim the draft for their account first. */
  claim?: boolean;
  /** Preselects a plan (e.g. "nfc_only" from the dashboard's "Include NFC"). */
  initialPlan?: string | null;
  /**
   * A checkout to show: back from a bank's page (with Stripe's `redirect_status`
   * and `payment_intent_client_secret`), or a reload after paying.
   */
  returnCheckout?: string | null;
  redirectStatus?: string | null;
  returnSecret?: string | null;
}

interface AddressFormState {
  address_line_1: string;
  address_line_2: string;
  state_id: string;
  city_id: string;
  postal_code: string;
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

/** The end of a purchase. "paid" only once the API says so. */
type Done =
  | { result: "free" }
  | { result: "paid"; checkoutId: number; cardLink: string | null; live: boolean }
  | { result: "processing"; checkoutId: number };

/** Why the purchase can't go on here. `retry`: a claim that failed for a passing reason. */
type Fatal = { kind: "expired" | "unavailable" | "unclaimable"; retry?: boolean };

const PLAN_IDS: PlanId[] = ["free", "nfc_only", "subscription_only", "nfc_with_subscription"];
const DEFAULT_PLAN: PlanId = "nfc_with_subscription";
const CONFIRMING = "Confirming your payment...";

/** The email typed into the card form in this tab (a guest's), if it is still kept. */
function savedFormEmail(): string | null {
  const payload = getFormDataFromSession();
  return typeof payload?.email === "string" && payload.email.trim() ? payload.email.trim() : null;
}

export default function PricingStep({
  businessCardId,
  claim = false,
  initialPlan,
  returnCheckout,
  redirectStatus,
  returnSecret,
}: PricingStepProps) {
  const router = useRouter();
  const session = useSession();
  const signedIn = session.status === "signed-in";
  const { plans, sale, owned, loading: plansLoading, error: plansError, reload: reloadPlans } = usePlans(businessCardId);

  const requestedPlan = PLAN_IDS.includes(initialPlan as PlanId) ? (initialPlan as PlanId) : null;
  // The plan card picked. The keychain alone is not a card: it is offered after Free or Pro.
  const [selected, setSelected] = useState<PlanId | null>(
    requestedPlan && !ADD_ON_PLAN_IDS.includes(requestedPlan) ? requestedPlan : null
  );
  // What is being bought: the card picked, or that card with the keychain added.
  const [checkoutPlanId, setCheckoutPlanId] = useState<PlanId | null>(null);
  // The card whose keychain offer is open, and the card the keychain was added to.
  const [offerFor, setOfferFor] = useState<PlanId | null>(null);
  const [keychainFrom, setKeychainFrom] = useState<PlanId | null>(null);
  const [step, setStep] = useState<Step>("plan");
  const [submitting, setSubmitting] = useState(false);
  const [claiming, setClaiming] = useState(claim);
  const [claimConflict, setClaimConflict] = useState(false);
  const [fatal, setFatal] = useState<Fatal | null>(null);
  // Looking for a payment already under way (a reload, a return from the bank) before showing the plans.
  const [starting, setStarting] = useState(true);
  // The message while the page waits for the API to see a payment.
  const [settling, setSettling] = useState<string | null>(null);
  // The checkout whose payment didn't go through.
  const [failedPayment, setFailedPayment] = useState<number | null>(null);
  const [done, setDone] = useState<Done | null>(null);
  const [checking, setChecking] = useState(false);

  const [address, setAddress] = useState<AddressFormState>(EMPTY_ADDRESS);
  const [states, setStates] = useState<{ id: number; name: string }[]>([]);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [correctedTo, setCorrectedTo] = useState<string | null>(null);
  const [quote, setQuote] = useState<CheckoutView | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [publishableKey, setPublishableKey] = useState<string | null>(null);
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);

  // Blocked plans: what the person already has is not sold again (Free is part of Pro).
  const canBuy = (id: PlanId) => !isOwnedPlan(id, owned);
  const cardPlans = plans.filter((p) => !ADD_ON_PLAN_IDS.includes(p.id));
  const keychainPlan = plans.find((p) => p.id === "nfc_only") ?? null;
  // The picked card, else the first that can be bought (the bundle first).
  const plan =
    cardPlans.find((p) => p.id === selected && canBuy(p.id)) ??
    cardPlans.find((p) => p.id === DEFAULT_PLAN && canBuy(p.id)) ??
    cardPlans.find((p) => canBuy(p.id)) ??
    null;
  const checkoutPlan = plans.find((p) => p.id === checkoutPlanId) ?? plan;
  // Someone with Pro and no keychain has no card left that offers it.
  const showKeychainAddOn = owned.subscription && !owned.keychain && !!keychainPlan;

  // The return or reload this page opened with; later URL changes (this page's own) don't restart it.
  const initialReturn = useRef({ checkout: returnCheckout, redirectStatus, secret: returnSecret });
  const claimStarted = useRef(false);
  const started = useRef(false);
  const keychainStarted = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // The guest signed in because their email already had an account: move the
  // draft card to that account (with its card token), then continue signed in.
  useEffect(() => {
    if (!claiming || session.status === "loading" || claimStarted.current) return;
    if (session.status === "signed-out") {
      router.replace(loginHref(claimPath(businessCardId)));
      return;
    }
    claimStarted.current = true;
    void Promise.resolve().then(() => runClaim(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once, when the session is known
  }, [claiming, businessCardId, session.status]);

  // Once the session is known (and any claim is done): pick up a payment already under way.
  useEffect(() => {
    if (started.current || claiming || session.status === "loading" || fatal || claimConflict) return;
    started.current = true;
    void Promise.resolve().then(start);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once
  }, [claiming, session.status, fatal, claimConflict]);

  // The dashboard's "Include NFC" asks for the keychain alone: start on its delivery address.
  useEffect(() => {
    if (requestedPlan !== "nfc_only" || keychainStarted.current || starting || claiming || plansLoading) return;
    if (!plans.length || done || settling || failedPayment !== null || step !== "plan") return;
    keychainStarted.current = true;
    if (!owned.keychain) void Promise.resolve().then(() => startPlan("nfc_only"));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- startPlan reads the current render
  }, [requestedPlan, starting, claiming, plansLoading, plans.length, owned.keychain, done, settling, failedPayment, step]);

  /** Moves the draft to the signed-in account. The caller shows `claiming`. */
  async function runClaim(replace: boolean) {
    try {
      await claimCard(businessCardId, replace);
      // The card is the account's now: the access token covers it (this also forgets the kept claim).
      clearCardToken(businessCardId);
      toast.success("Your card is now on your account.");
      // The page starts afresh for the claimed card (PricingEntry keys it by the claim), its plans
      // priced for the account. The spinner stays until then.
      router.replace(`/pricing?businessCardId=${businessCardId}`);
    } catch (error) {
      const { status, code } = readApiError(error);
      if (code === "CARD_EXISTS") setClaimConflict(true);
      else if (code === "CARD_TOKEN_REQUIRED") setFatal({ kind: "expired" });
      else if (status === 0 || status >= 500) setFatal({ kind: "unclaimable", retry: true });
      else {
        // CARD_NOT_CLAIMABLE, or the card is gone: there is nothing to buy for it here.
        clearPendingClaim(businessCardId);
        setFatal({ kind: "unclaimable" });
      }
      setClaiming(false);
    }
  }

  /* ── Payments under way ─────────────────────────────────────────────────── */

  /** Back from a bank's page, a reload, or a payment left in this tab: carry on with it. */
  async function start() {
    const { checkout, redirectStatus: returnStatus, secret } = initialReturn.current;
    const saved = readSavedCheckout(businessCardId);
    try {
      const returned = Number(checkout);
      if (checkout && Number.isInteger(returned) && returned > 0) {
        keychainStarted.current = true;
        if (returnStatus === "failed") setFailedPayment(returned);
        else if (secret) await settleReturn(returned, secret, saved);
        else await settle(returned, { tries: 3 });
        return;
      }
      // A plan asked for by name (the dashboard) wins over a payment left for another plan.
      if (saved && (!requestedPlan || requestedPlan === saved.planId)) {
        keychainStarted.current = true;
        await resume(saved.checkoutId, saved);
      } else if (saved) {
        clearSavedCheckout(businessCardId);
      }
    } finally {
      if (mounted.current) setStarting(false);
    }
  }

  /** Back from a bank's page: Stripe says whether it went through, then the API confirms it. */
  async function settleReturn(checkoutId: number, secret: string, saved: SavedCheckout | null) {
    setSettling(CONFIRMING);
    const status = await paymentIntentStatus(secret, saved?.checkoutId === checkoutId ? saved.publishableKey : null);
    if (!mounted.current) return;
    if (status === "requires_payment_method" || status === "requires_action" || status === "canceled") {
      setSettling(null);
      setFailedPayment(checkoutId);
      return;
    }
    await settle(checkoutId, { tries: status === "processing" ? 2 : 10 });
  }

  /** Waits for the API to see the payment, then shows how it ended. */
  async function settle(checkoutId: number, { tries = 10 }: { tries?: number } = {}) {
    setSettling(CONFIRMING);
    let view: CheckoutView | null = null;
    try {
      view = await waitForCheckout(checkoutId, businessCardId, { tries, isActive: () => mounted.current });
    } catch (error) {
      if (!mounted.current) return;
      setSettling(null);
      checkoutRefused(error);
      return;
    }
    if (!mounted.current) return;
    setSettling(null);
    showOutcome(checkoutId, view);
  }

  /** The API refused to show the checkout: no access (the timed-out screen), or it is gone. */
  function checkoutRefused(error: unknown) {
    if (readApiError(error).status === 404) {
      clearSavedCheckout(businessCardId);
      toast.error("We couldn't find that payment. Please choose your plan again.");
      resetToPlans();
    } else if (!handlePurchaseError(error)) {
      resetToPlans();
    }
  }

  /** The end of a payment, as the API reports it. Paid and live only when it says so. */
  function showOutcome(checkoutId: number, view: CheckoutView | null) {
    const status = view?.status;
    if (status === "paid") {
      clearSavedCheckout(businessCardId);
      clearPendingClaim(businessCardId);
      const card = view?.card;
      const link = card?.business_card_link;
      setDone({
        result: "paid",
        checkoutId,
        cardLink: link && /^https?:\/\//i.test(link) ? link : null,
        // A paid checkout made the card live (the API answers its status; older answers have no card).
        live: !card || card.status === "accepted",
      });
      keepCheckoutInUrl(checkoutId);
      return;
    }
    if (status === "failed") {
      setFailedPayment(checkoutId);
      return;
    }
    if (status === "expired" || status === "cancelled") {
      clearSavedCheckout(businessCardId);
      toast.info(status === "cancelled" ? "This order was cancelled." : "This checkout expired. Please choose your plan again.");
      resetToPlans();
      return;
    }
    // Still being confirmed (a slow bank or a busy Stripe), or no answer yet: never "paid".
    setDone({ result: "processing", checkoutId });
    keepCheckoutInUrl(checkoutId);
  }

  /** A reload of the result asks the API again instead of starting over. */
  function keepCheckoutInUrl(checkoutId: number) {
    const url = `/pricing?businessCardId=${encodeURIComponent(businessCardId)}&checkout=${checkoutId}`;
    if (window.location.pathname + window.location.search !== url) window.history.replaceState(null, "", url);
  }

  function resetToPlans() {
    setDone(null);
    setFailedPayment(null);
    setQuote(null);
    setClientSecret(null);
    setPaymentNotice(null);
    setCheckoutPlanId(null);
    setStep("plan");
  }

  /** Back to a checkout already started for this card: its payment, never a second one. */
  async function resume(checkoutId: number, saved: SavedCheckout | null) {
    let view: CheckoutView | null = null;
    try {
      view = await fetchCheckout(checkoutId, businessCardId);
    } catch {
      // Gone or not ours: start from the plans.
    }
    if (!mounted.current) return;
    if (!view || view.status === "expired") {
      clearSavedCheckout(businessCardId);
      return;
    }
    if (view.status === "paid" || view.status === "processing" || view.status === "cancelled") {
      showOutcome(checkoutId, view);
      return;
    }
    const planId = (saved?.checkoutId === checkoutId ? saved.planId : view.plan_type) as PlanId;
    const key = view.publishable_key ?? (saved?.checkoutId === checkoutId ? saved.publishableKey : null);
    // Stripe may already have it while the API catches up: wait for that instead of a new attempt.
    if (view.client_secret && view.status !== "open") {
      const stripeStatus = await paymentIntentStatus(view.client_secret, key);
      if (stripeStatus === "succeeded" || stripeStatus === "processing") {
        await settle(checkoutId);
        return;
      }
    }
    if (!mounted.current) return;
    setCheckoutPlanId(planId);
    if (!ADD_ON_PLAN_IDS.includes(planId)) setSelected(planId);
    setQuote(view);
    if (view.client_secret) {
      setClientSecret(view.client_secret);
      setPublishableKey(key);
      setPaymentNotice(view.status === "failed" ? "Your last payment didn't go through. Try again, or use another card." : null);
      setStep("payment");
    } else {
      setStep("review");
    }
  }

  /** "Check again" while a payment is being confirmed. */
  async function checkAgain(checkoutId: number) {
    setChecking(true);
    let view: CheckoutView | null = null;
    try {
      view = await waitForCheckout(checkoutId, businessCardId, { tries: 3, every: 1500, isActive: () => mounted.current });
    } catch (error) {
      if (!mounted.current) return;
      setChecking(false);
      setDone(null);
      checkoutRefused(error);
      return;
    }
    if (!mounted.current) return;
    setChecking(false);
    if (view && view.status !== "pending" && view.status !== "processing" && view.status !== "open") {
      setDone(null);
      showOutcome(checkoutId, view);
    } else {
      toast.info("Your payment is still being confirmed. We'll email you as soon as it's through.");
    }
  }

  /** "Try again" after a payment that didn't go through: the same checkout, paid again. */
  async function retryPayment(checkoutId: number) {
    setFailedPayment(null);
    window.history.replaceState(null, "", `/pricing?businessCardId=${encodeURIComponent(businessCardId)}`);
    setSettling("Getting your payment ready...");
    await resume(checkoutId, readSavedCheckout(businessCardId));
    if (mounted.current) setSettling(null);
  }

  /* ── The steps ──────────────────────────────────────────────────────────── */

  /** The plan that adds the keychain to card `id`, while it can still be offered. */
  const keychainUpgrade = (id: PlanId | null): PlanDef | null => {
    const target = id ? WITH_KEYCHAIN[id] : undefined;
    if (!target || owned.keychain || !canBuy(target)) return null;
    return plans.find((p) => p.id === target) ?? null;
  };

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

  /**
   * Common refusals of the purchase calls. Returns true when handled.
   * `card`: the call names the card, so a 404 means the card is gone.
   */
  function handlePurchaseError(error: unknown, { card = false }: { card?: boolean } = {}): boolean {
    const { status, code } = readApiError(error);
    if (code === "ACCOUNT_EXISTS") {
      toast.info("This email already has a Glamlink account. Sign in to continue.");
      router.push(loginHref(claimPath(businessCardId)));
      return true;
    }
    if (code === "CARD_TOKEN_REQUIRED") {
      setFatal({ kind: "expired" });
      return true;
    }
    if (status === 403 || (card && status === 404)) {
      setFatal({ kind: "unavailable" });
      return true;
    }
    if (code === "ALREADY_OWNED") {
      toast.error("You already have Access Pro.");
      reloadPlans();
      return true;
    }
    if (code === "NFC_ALREADY_PURCHASED") {
      toast.error("You already have your NFC keychain.");
      reloadPlans();
      return true;
    }
    if (code === "ADDRESS_NOT_VERIFIED" || code === "ADDRESS_NOT_FOUND") {
      setStep("address");
      setAddressError("Please enter your delivery address first.");
      return true;
    }
    toast.error(friendlyError(error));
    return false;
  }

  /** 409 CHECKOUT_IN_PROGRESS: a payment for this card is going through already. Follow it, don't pay twice. */
  async function followPaymentInProgress(details: Record<string, unknown> | null, planId: PlanId) {
    const checkoutId = Number(details?.checkout_id);
    if (!checkoutId) {
      toast.info("A payment for this card is already being confirmed.");
      return;
    }
    saveCheckout(businessCardId, { checkoutId, planId, publishableKey: null });
    await settle(checkoutId);
  }

  async function requestQuote(target: PlanDef, rateId?: string) {
    setSubmitting(true);
    try {
      const res = await quoteCheckout({ business_card_id: businessCardId, plan_type: target.planType, rate_id: rateId });
      const view = (res?.data ?? res) as CheckoutView;
      // Another plan than the payment kept for this card: that one is left behind.
      const saved = readSavedCheckout(businessCardId);
      if (saved && saved.checkoutId !== view.checkout_id) clearSavedCheckout(businessCardId);
      setQuote(view);
      setStep("review");
    } catch (error) {
      const { code, details } = readApiError(error);
      if (code === "SHIPPING_COUNTRY_UNSUPPORTED") {
        setStep("address");
        setAddressError("The keychain ships within the United States only.");
      } else if (code === "CHECKOUT_IN_PROGRESS") {
        await followPaymentInProgress(details, target.id);
      } else {
        handlePurchaseError(error, { card: true });
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
    if (!target) return;
    setCheckoutPlanId(id);
    setKeychainFrom(addedTo);
    setSubmitting(true);
    try {
      const res = await SelectPlanAPI({ business_card_id: businessCardId, plan_type: target.planType });
      const data = res?.data ?? res;
      const planType = String(data?.plan_type ?? target.planType).trim();
      if (!data?.payment_required || planType === "free") {
        // The card is live on Free. Its card token stays for the rest of this tab's visit.
        clearPendingClaim(businessCardId);
        setDone({ result: "free" });
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
      handlePurchaseError(error, { card: true });
    } finally {
      setSubmitting(false);
      setOfferFor(null);
    }
  }

  async function handleSaveAddress() {
    if (!address.address_line_1.trim() || !address.state_id || !address.city_id || !address.postal_code.trim()) {
      setAddressError("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    setAddressError(null);
    try {
      const payload = {
        address_line_1: address.address_line_1.trim(),
        // Always sent, so clearing it on a second save clears it.
        address_line_2: address.address_line_2.trim(),
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
      else if (!handlePurchaseError(error, { card: true })) setAddressError(friendlyError(error));
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
    if (checkoutPlan) await requestQuote(checkoutPlan);
  }

  // Step 3: the API starts the subscription or the keychain payment and returns
  // its client secret, which the Payment Element is created with.
  async function handleStartPayment() {
    if (!quote) return;
    const planId = (checkoutPlan?.id ?? quote.plan_type) as PlanId;
    setSubmitting(true);
    try {
      const res = await payCheckout(quote.checkout_id, businessCardId);
      const data = res?.data ?? res;
      if (data?.paid) {
        // Nothing to pay today: the API settles it without Stripe.js.
        saveCheckout(businessCardId, { checkoutId: quote.checkout_id, planId, publishableKey: null });
        await settle(quote.checkout_id);
        return;
      }
      const secret: string | undefined = data?.client_secret;
      if (!secret) {
        toast.error("Payment could not be started. Please try again.");
        return;
      }
      const key: string | null = data?.publishable_key ?? null;
      // Kept for this tab: a reload or a return comes back to this payment.
      saveCheckout(businessCardId, { checkoutId: quote.checkout_id, planId, publishableKey: key });
      // A payment started before (another tab, a reload) may have gone through already.
      if (quote.status === "pending") {
        const stripeStatus = await paymentIntentStatus(secret, key);
        if (stripeStatus === "succeeded" || stripeStatus === "processing") {
          await settle(quote.checkout_id);
          return;
        }
      }
      setClientSecret(secret);
      setPublishableKey(key);
      setPaymentNotice(null);
      setStep("payment");
    } catch (error) {
      const { code, details } = readApiError(error);
      if (code === "ALREADY_PAID") {
        await settle(quote.checkout_id);
      } else if (code === "CHECKOUT_IN_PROGRESS") {
        await followPaymentInProgress(details, planId);
      } else if (code === "CHECKOUT_EXPIRED") {
        toast.error("Prices were refreshed. Please review your order again.");
        setSubmitting(false);
        if (checkoutPlan) await requestQuote(checkoutPlan, quote.shipping?.selected?.rate_id);
      } else {
        handlePurchaseError(error);
      }
    } finally {
      setSubmitting(false);
    }
  }

  /** Stripe took the payment: wait for the API (a bank still confirming is only checked briefly). */
  function handleConfirmed(status: PaymentIntent.Status | null) {
    if (!quote) return;
    void settle(quote.checkout_id, { tries: status === "processing" || status === "requires_action" ? 2 : 10 });
  }

  /* ── Page states before the steps ─────────────────────────────────────── */

  if (fatal) {
    const retryClaim = () => {
      setFatal(null);
      setClaiming(true);
      void runClaim(false);
    };
    return <FatalScreen fatal={fatal} signedIn={signedIn} onRetryClaim={retryClaim} />;
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
          <button
            type="button"
            onClick={() => {
              clearPendingClaim(businessCardId);
              router.push("/dashboard");
            }}
            disabled={claiming}
            className="btn-outline flex-1 disabled:opacity-50"
          >
            Keep my card
          </button>
          <button
            type="button"
            onClick={() => {
              setClaiming(true);
              void runClaim(true);
            }}
            disabled={claiming}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {claiming && <Loader2 className="h-4 w-4 animate-spin" />}
            Replace it
          </button>
        </div>
      </Centered>
    );
  }

  if (done) {
    // A guest's account is made when the card goes live (Free, or once paid), with a link to set a password.
    const guestNote =
      !signedIn && done.result !== "processing"
        ? "We've emailed you a link to set your password. Use it to sign in and manage your card."
        : null;
    return (
      <Centered>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent">
          {done.result === "processing" ? (
            <Clock className="h-7 w-7 text-primary" />
          ) : guestNote ? (
            <MailCheck className="h-7 w-7 text-primary" />
          ) : (
            <CheckCircle className="h-7 w-7 text-primary" />
          )}
        </div>
        <h2 className="mt-4 text-xl text-foreground">
          {done.result === "paid" ? "Payment successful!" : done.result === "processing" ? "Payment processing" : "Welcome to Glamlink!"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {done.result === "paid"
            ? done.live
              ? "Your order is confirmed and your card is live."
              : "Your order is confirmed."
            : done.result === "processing"
              ? "Your payment is being confirmed. This usually takes a moment, and we'll email you as soon as it's through. There's no need to pay again."
              : "Your card is live on the Free plan."}
          {guestNote && <> {guestNote}</>}
        </p>
        {done.result === "processing" && (
          <button
            type="button"
            onClick={() => checkAgain(done.checkoutId)}
            disabled={checking}
            className="btn-primary mt-6 w-full disabled:opacity-50"
          >
            {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Check again
          </button>
        )}
        {done.result === "paid" && done.live && done.cardLink && (
          <a href={done.cardLink} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6 w-full">
            <ExternalLink className="h-4 w-4" />
            View your card
          </a>
        )}
        {signedIn && (
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className={`${done.result === "free" || (done.result === "paid" && !(done.live && done.cardLink)) ? "btn-primary mt-6" : "btn-outline mt-3"} w-full`}
          >
            Go to dashboard
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </Centered>
    );
  }

  if (settling) {
    return (
      <Centered>
        <Loader2 className="mx-auto h-7 w-7 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">{settling}</p>
      </Centered>
    );
  }

  if (failedPayment !== null) {
    return (
      <Centered>
        <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
        <h1 className="mt-4 text-xl">Your payment didn&apos;t go through</h1>
        <p className="mt-2 text-sm text-muted-foreground">Nothing was charged. Try again, or use another card.</p>
        <button type="button" onClick={() => retryPayment(failedPayment)} className="btn-primary mt-6 w-full">
          Try again
        </button>
      </Centered>
    );
  }

  if (claiming || starting || plansLoading) {
    return (
      <Centered>
        <Loader2 className="mx-auto h-7 w-7 animate-spin text-primary" />
      </Centered>
    );
  }

  if (plansError || !cardPlans.length) {
    return (
      <Centered>
        <p className="text-sm text-muted-foreground">{plansError ?? "No plans are available right now."}</p>
        <button type="button" onClick={reloadPlans} className="btn-outline mt-4">
          Try again
        </button>
      </Centered>
    );
  }

  /* ── Steps ────────────────────────────────────────────────────────────── */

  const paymentEmail = step === "payment" ? quote?.email || session.user?.email || savedFormEmail() : null;
  const keychainInQuote = !!quote?.lines.some((line) => line.product === "keychain");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="page-soft w-[90%] px-4 py-14">
        <div className="mx-auto m-10 w-full">
          {step === "plan" && (
            <>
              <div className="mx-auto mb-10 max-w-5xl">
                <h1 className="mt-1 text-2xl leading-tight text-foreground sm:text-3xl">Choose your plan</h1>
                <p className="section-subtitle mt-2 max-w-md text-base leading-6">
                  Choose the plan that best fits your business. You can upgrade anytime.
                </p>
                {sale && (
                  <p className="badge-soft mt-4">
                    {sale.name} sale
                    {sale.ends_at && ` · ends ${new Date(sale.ends_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                  </p>
                )}
              </div>

              <PlanGrid
                plans={cardPlans}
                selected={plan?.id ?? null}
                onSelect={setSelected}
                isDisabled={(id) => !canBuy(id)}
                noteFor={(id) => ownedNote(id, owned)}
                className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3"
              />

              {showKeychainAddOn && keychainPlan && (
                <div className="mx-auto mt-6 max-w-5xl">
                  <KeychainAddOn plan={keychainPlan} busy={submitting} onAdd={() => startPlan("nfc_only")} />
                </div>
              )}

              <div className="mt-9 flex flex-col items-center gap-3">
                {plan ? (
                  <button
                    type="button"
                    onClick={handlePrimaryContinue}
                    disabled={submitting}
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
                ) : (
                  !showKeychainAddOn && (
                    <>
                      <p className="text-sm text-muted-foreground">You already have Access Pro and the keychain.</p>
                      <button type="button" onClick={() => router.push("/dashboard")} className="btn-outline">
                        Go to dashboard
                      </button>
                    </>
                  )
                )}
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
              <BackButton onClick={() => setStep(checkoutPlan?.hasKeychain ? "address" : "plan")} disabled={submitting}>
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
                        onChange={() => checkoutPlan && requestQuote(checkoutPlan, o.rate_id)}
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
                  <div key={line.product} className="flex justify-between text-sm text-muted-foreground">
                    <span>{line.name ?? LINE_NAMES[line.product] ?? line.product}</span>
                    <span>
                      {line.list > line.amount && <span className="mr-1.5 line-through">{money(line.list)}</span>}
                      {money(line.amount)}
                    </span>
                  </div>
                ))}
                {/* The keychain's shipping follows the quote: a line when charged, else included. */}
                {quote.shipping_cents > 0 ? (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span>{money(quote.shipping_cents)}</span>
                  </div>
                ) : keychainInQuote ? (
                  <p className="text-xs text-muted-foreground">Shipping and tax included.</p>
                ) : null}
                <div className="h-px bg-border" />
                <div className="flex justify-between text-sm font-semibold text-foreground">
                  <span>Total due today</span>
                  <span className="text-primary">{money(quote.total_cents)}</span>
                </div>
                {quote.monthly_cents ? (
                  <p className="text-xs text-muted-foreground">
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

          {step === "payment" && quote && clientSecret && (
            <PaymentStep
              key={clientSecret}
              businessCardId={businessCardId}
              quote={quote}
              clientSecret={clientSecret}
              publishableKey={publishableKey}
              planLabel={checkoutPlan?.name ?? "Access"}
              email={paymentEmail || null}
              notice={paymentNotice}
              onBack={() => setStep("review")}
              onConfirmed={handleConfirmed}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/** Why the purchase can't go on here, worded for whether the person is signed in. */
function FatalScreen({ fatal, signedIn, onRetryClaim }: { fatal: Fatal; signedIn: boolean; onRetryClaim: () => void }) {
  const router = useRouter();
  const startAgain = (
    <button type="button" onClick={() => router.push("/access")} className="btn-outline flex-1">
      Start again
    </button>
  );
  const dashboard = (
    <button type="button" onClick={() => router.push("/dashboard")} className="btn-primary flex-1">
      Go to dashboard
    </button>
  );

  let title: string;
  let body: string;
  let actions: React.ReactNode;
  if (fatal.kind === "expired" && !signedIn) {
    title = "This purchase has timed out";
    body =
      "A card you build while signed out can be finished within 24 hours, in the tab you made it in. Start again, or sign in if you already paid.";
    actions = (
      <>
        {startAgain}
        <button type="button" onClick={() => router.push(loginHref())} className="btn-primary flex-1">
          Sign in
        </button>
      </>
    );
  } else if (fatal.kind === "expired") {
    title = "We can't continue this purchase";
    body =
      "This card isn't on your account, or the time to finish it ran out. Your dashboard shows your card and plan.";
    actions = (
      <>
        {startAgain}
        {dashboard}
      </>
    );
  } else if (fatal.kind === "unavailable") {
    title = "This card isn't available";
    body = "It may have been replaced or deleted, or it belongs to another account.";
    actions = signedIn ? (
      <>
        {startAgain}
        {dashboard}
      </>
    ) : (
      <button type="button" onClick={() => router.push("/access")} className="btn-primary flex-1">
        Create your card
      </button>
    );
  } else {
    title = "We couldn't move this card to your account";
    body = fatal.retry
      ? "Something went wrong on our side. Try again in a moment."
      : "It was already finished or moved to an account. Open your dashboard, or start a new card.";
    actions = fatal.retry ? (
      <>
        {dashboard}
        <button type="button" onClick={onRetryClaim} className="btn-outline flex-1">
          Try again
        </button>
      </>
    ) : (
      <>
        {startAgain}
        {dashboard}
      </>
    );
  }

  return (
    <Centered>
      <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
      <h1 className="mt-4 text-xl">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">{actions}</div>
    </Centered>
  );
}
