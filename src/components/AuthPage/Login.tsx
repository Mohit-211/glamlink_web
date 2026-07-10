"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Eye, EyeOff, Sparkles } from "lucide-react";
import { loginUser, sendOtp } from "@/api/Api";
import { message } from "antd";
import {
  getFormDataFromSession,
  clearFormDataFromSession,
} from "../glamcard/GlamCardForm/Formdatasessionstorage";
import { SubscriptionPaymentModal } from "../Dashboard/SubscriptionPay";

interface BusinessCardSummary {
  business_name: string;
  
  id: string | number;
  payment_status: string; // "pending" | "paid" | ...
}

interface LoginProps {
  /** If provided, called after a successful login (and payment is already
   *  complete, or there's nothing pending to pay) instead of doing the
   *  usual router redirect. Used when Login is rendered inside a modal. */
  onSuccess?: () => void;
  /** If provided, called instead of navigating to /verify-otp when the
   *  account isn't verified yet. Used inside the modal flow. */
  onNeedsVerification?: (email: string) => void;
  /** If provided, called instead of opening Login's own internal payment
   *  modal once a specific pending business card has been chosen — lets a
   *  parent (e.g. the register/otp/login wrapper modal) close itself and
   *  take over showing the payment modal on its own, avoiding two modals
   *  stacked on top of each other. */
  onPaymentRequired?: (businessCardId: string | number | null) => void;
}

export default function Login({
  onSuccess,
  onNeedsVerification,
  onPaymentRequired,
}: LoginProps = {}) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // "form"       -> normal email/password sign-in
  // "selectCard" -> user has multiple business cards; must pick which
  //                 (pending) one to pay for before continuing
  const [step, setStep] = useState<"form" | "selectCard">("form");
  const [businessCards, setBusinessCards] = useState<BusinessCardSummary[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | number | null>(
    null
  );

  // Only used as a fallback when Login is rendered standalone (no
  // onPaymentRequired passed in) — e.g. the real /login page.
  const [payOpen, setPayOpen] = useState(false);
  const [pendingCardId, setPendingCardId] = useState<string | number | null>(null);
  

  useEffect(() => {
    const storedPayload = getFormDataFromSession();
    const savedEmail =
      storedPayload && typeof storedPayload.email === "string"
        ? storedPayload.email
        : null;
    if (savedEmail) {
      setForm((prev) => ({ ...prev, email: savedEmail }));
    }
  }, []);

  // Shared by both the "single pending card" auto-continue path and the
  // "user picked a card from the list" path.
  const goToPayment = (businessCardId: string | number | null) => {
    if (onPaymentRequired) {
      // Let the parent wrapper (e.g. GlamCardForm's auth modal) close
      // itself and take over showing the payment modal, instead of
      // stacking Login's own modal on top of it.
      onPaymentRequired(businessCardId);
    } else {
      setPendingCardId(businessCardId);
      setPayOpen(true);
    }
  };

  const handleCardConfirm = () => {
    if (selectedCardId == null) return;
    goToPayment(selectedCardId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await loginUser({
        email: form.email,
        password: form.password,
      });

      console.log("Login Response:", response);

      // User not verified
      if (response?.message?.includes("User is not verified yet")) {
        message.warning(response?.message);

        await sendOtp({
          email: form.email,
          type: "email_varification",
        });

        if (onNeedsVerification) {
          onNeedsVerification(form.email);
        } else {
          router.push(
            `/verify-otp?email=${encodeURIComponent(form.email)}&type=email_varification`
          );
        }
        return;
      }

      // Success
      if (response?.success) {
        const accessToken = response?.data?.tokens?.access?.token;
        const refreshToken = response?.data?.tokens?.refresh?.token;

        if (accessToken) {
          localStorage.setItem("GlamlinkaccessToken", accessToken);
        }
        if (refreshToken) {
          localStorage.setItem("GlamlinkrefreshToken", refreshToken);
        }

        message.success(response?.message || "Login successful");

        window.dispatchEvent(new Event("auth-change"));

        // Login succeeded — the GlamCard draft saved to sessionStorage (if
        // any) has served its purpose (prefilling email during the auth
        // detour) and shouldn't linger.
        clearFormDataFromSession();

        const cards: BusinessCardSummary[] =
          response?.data?.business_cards ?? [];
        const hasPaidCard = cards.some((c) => c.payment_status === "paid");
        const pendingCards = cards.filter(
          (c) => c.payment_status === "pending"
        );

        // If ANY card on the account is already paid, treat the account as
        // having access — don't block on other pending cards, just go to
        // the dashboard like a normal successful login.
        if (hasPaidCard) {
          if (onSuccess) {
            onSuccess();
            return;
          }

          const redirectPath = localStorage.getItem("postLoginRedirect");
          if (redirectPath) {
            localStorage.removeItem("postLoginRedirect");
            router.push(redirectPath);
          } else {
            router.push("/dashboard");
          }
          return;
        }

        // No paid card yet — only worry about payment if there's something
        // pending.
        if (pendingCards.length > 0) {
          if (pendingCards.length > 1) {
            // Multiple pending cards, none paid — don't guess which one the
            // user means, let them pick.
            setBusinessCards(cards);
            setStep("selectCard");
            return;
          }

          // Only one pending card and nothing paid — no ambiguity, go
          // straight to payment like before.
          goToPayment(pendingCards[0].id);
          return;
        }

        if (onSuccess) {
          onSuccess();
          return;
        }

        const redirectPath = localStorage.getItem("postLoginRedirect");
        if (redirectPath) {
          localStorage.removeItem("postLoginRedirect");
          router.push(redirectPath);
        } else {
          router.push("/dashboard");
        }

        return;
      }

      // API success:false
      message.error(response?.message || "Login failed");
    } catch (error: any) {
      console.error(error);

      const errorMessage =
        error?.response?.data?.message || error?.message || "Something went wrong";

      if (errorMessage.toLowerCase().includes("not verified")) {
        message.warning(errorMessage);
        if (onNeedsVerification) {
          onNeedsVerification(form.email);
        } else {
          router.push(
            `/verify-otp?email=${encodeURIComponent(form.email)}&type=email_varification`
          );
        }
        return;
      }

      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("GlamlinkaccessToken");

    if (accessToken) {
      router.replace("/dashboard");
    }
  }, [router]);
  return (
    <div className="page-soft min-h-screen flex items-center justify-center">
      {/* Ambient blobs */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="animate-pulse-slow absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="animate-pulse-slow animation-delay-700 absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <p className="mt-3 text-sm text-muted-foreground">
            {step === "form"
              ? "Welcome back — sign in to your account"
              : "One more step before payment"}
          </p>
        </div>

        {step === "form" && (
          <div className="card-glamlink !hover:transform-none rounded-2xl border bg-card p-8 shadow-[var(--shadow-medium)]">
            <h1 className="mb-6 text-xl font-semibold tracking-tight text-foreground">
              Sign in
            </h1>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-foreground"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 pr-11 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
              {/* Register Link */}
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-primary hover:underline"
                >
                  Create Access Account
                </Link>
              </p>
            </form>
          </div>
        )}

        {step === "selectCard" && (
          <div className="rounded-2xl border bg-card p-8 shadow-[var(--shadow-medium)]">
            <h1 className="mb-2 text-xl font-semibold tracking-tight text-foreground">
              Select a Business Card
            </h1>
            <p className="mb-6 text-sm text-muted-foreground">
              You have multiple business cards. Choose the one you'd like to
              complete payment for.
            </p>
            <div className="space-y-3">
              {businessCards.map((card) => {
                const isPaid = card.payment_status === "paid";
                const isSelected = selectedCardId === card.id;
                return (
                  <button
                    key={card.id}
                    type="button"
                    disabled={isPaid}
                    onClick={() => setSelectedCardId(card.id)}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${isPaid
                        ? "cursor-not-allowed border-border bg-muted opacity-60"
                        : isSelected
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-input hover:bg-secondary"
                      }`}
                  >
                    <span className="font-medium text-foreground">
                      Business Card :{card?.business_name}
                    </span>
                    {isPaid ? (
                      <span className="text-xs text-muted-foreground">
                        (you already paid for this)
                      </span>
                    ) : isSelected ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Payment pending
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              disabled={selectedCardId == null}
              onClick={handleCardConfirm}
              className="btn-primary mt-6 w-full justify-center disabled:opacity-50"
            >
              Continue to Payment
            </button>
          </div>
        )}
      </div>

      {/* Standalone fallback only — not used when onPaymentRequired is
          passed in, since the parent handles showing this modal instead. */}
      {!onPaymentRequired && (
        <SubscriptionPaymentModal
          open={payOpen}
          onClose={() => setPayOpen(false)}
          onSuccess={() => {
            setPayOpen(false);
            if (onSuccess) {
              onSuccess();
            } else {
              router.push("/dashboard");
            }
          }}
          businessCardId={pendingCardId}
          onGoToAddresses={() => {
            setPayOpen(false);
            router.push("/dashboard?tab=addresses");
          }}
        />
      )}
    </div>
  );
}