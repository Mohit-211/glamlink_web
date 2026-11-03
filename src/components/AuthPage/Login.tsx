"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, MailCheck } from "lucide-react";
import { loginUser, updateCard } from "@/api/Api";
import { toast } from "sonner";
import { readApiError } from "@/lib/apiError";
import { afterSignInPath, claimedCardOf, keepClaimThroughSignIn, safeNextPath, withNext } from "@/lib/auth";
import { clearPendingClaim, getCardToken } from "@/lib/cardToken";
import { useSession } from "@/lib/useSession";
import AuthShell from "./AuthShell";
import {
  getFormDataFromSession,
  clearFormDataFromSession,
} from "../glamcard/GlamCardForm/Formdatasessionstorage";

interface LoginProps {
  /** If provided, called after a successful login instead of the usual
   *  router redirect. Used when Login is rendered inside a modal. */
  onSuccess?: () => void;
}

type FieldErrors = {
  email?: string;
  password?: string;
};

type Notice =
  | { kind: "verify" | "set-password"; email: string }
  /** The email is an app account, which can't sign in here: the draft card can take another email. */
  | { kind: "app-account"; email: string; cardId: string };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login({ onSuccess }: LoginProps = {}) {
  const router = useRouter();
  const session = useSession();
  // Where to go after signing in: `?next=` when it is a path on this site.
  const next = safeNextPath(useSearchParams().get("next"));
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  // Shown instead of a toast when the account needs the person to act by email.
  const [notice, setNotice] = useState<Notice | null>(null);
  const [cardEmail, setCardEmail] = useState("");
  const [cardEmailError, setCardEmailError] = useState<string | null>(null);
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    const storedPayload = getFormDataFromSession();
    const savedEmail =
      storedPayload && typeof storedPayload.email === "string"
        ? storedPayload.email
        : null;
    // A guest sent here to claim their draft card: keep the claim through the
    // email links (verify, set or reset the password) that open new tabs.
    keepClaimThroughSignIn(next, savedEmail);
    if (savedEmail) {
      setForm((prev) => ({ ...prev, email: savedEmail }));
    }
  }, [next]);

  // Already signed in (restored from the refresh cookie): skip the form.
  useEffect(() => {
    if (session.status === "signed-in" && !onSuccess) {
      router.replace(afterSignInPath(next, session.user?.email));
    }
  }, [session.status, session.user?.email, router, onSuccess, next]);

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email.trim()) {
      next.email = "Please enter your email address";
    } else if (!emailRegex.test(form.email)) {
      next.email = "Please enter a valid email address";
    }

    if (!form.password) {
      next.password = "Please enter your password";
    }

    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fieldErrors = validate();
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      const firstError = Object.values(fieldErrors)[0];
      if (firstError) toast.error(firstError);
      return;
    }

    try {
      setLoading(true);
      setNotice(null);

      const response = await loginUser({
        email: form.email.trim(),
        password: form.password,
      });

      toast.success(response?.message || "Signed in.");
      clearFormDataFromSession();

      if (onSuccess) {
        onSuccess();
        return;
      }
      router.push(afterSignInPath(next, response?.data?.user?.email ?? form.email.trim()));
    } catch (error: any) {
      const { code, message } = readApiError(error);
      switch (code) {
        case "EMAIL_NOT_VERIFIED":
          // The API has emailed a new verification link.
          setNotice({ kind: "verify", email: form.email.trim() });
          break;
        case "PASSWORD_NOT_SET":
          setNotice({ kind: "set-password", email: form.email.trim() });
          break;
        case "INVALID_CREDENTIALS":
          setErrors({ password: "Invalid email or password." });
          toast.error("Invalid email or password.");
          break;
        case "PROFESSIONAL_REQUIRED": {
          // Sent here to claim a draft card made with this email: the card can take another email instead.
          const cardId = claimedCardOf(next);
          if (cardId && getCardToken(cardId)) {
            setNotice({ kind: "app-account", email: form.email.trim(), cardId });
          } else {
            toast.error(
              "This is a Glamlink app account. The website is for professionals; sign in through the app."
            );
          }
          break;
        }
        default:
          toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  /** Gives the guest's draft card another email, so it can be bought without the app account. */
  const switchCardEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (notice?.kind !== "app-account") return;
    const email = cardEmail.trim();
    if (!EMAIL_REGEX.test(email)) {
      setCardEmailError("Please enter a valid email address");
      return;
    }
    if (email.toLowerCase() === notice.email.toLowerCase()) {
      setCardEmailError("Use an email other than your app account's.");
      return;
    }
    setSwitching(true);
    setCardEmailError(null);
    try {
      const formData = new FormData();
      formData.append("email", email);
      await updateCard(notice.cardId, formData);
      clearPendingClaim(notice.cardId);
      // The form's saved copy holds the old email (the payment form would prefill it).
      clearFormDataFromSession();
      toast.success(`Your card now uses ${email}.`);
      router.push(`/pricing?businessCardId=${encodeURIComponent(notice.cardId)}`);
    } catch (error) {
      const { code, message } = readApiError(error);
      if (code === "INVALID_CARD") setCardEmailError(message);
      else if (code === "CARD_TOKEN_REQUIRED" || code === "SIGN_IN_REQUIRED")
        setCardEmailError("This card can no longer be changed. Please create your card again.");
      else toast.error(message);
    } finally {
      setSwitching(false);
    }
  };

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <AuthShell>
      <h1 className="text-xl font-semibold tracking-tight">Sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Welcome back — sign in to your account
      </p>
      {notice?.kind === "app-account" ? (
        <div className="mt-6 rounded-xl border border-primary/25 bg-accent/60 p-4 text-sm text-foreground">
          <p>
            <span className="font-medium">{notice.email}</span> is a Glamlink app account, which signs in through the
            app. To finish your Access card here, give the card another email.
          </p>
          <form onSubmit={switchCardEmail} noValidate className="mt-3 space-y-2">
            <label htmlFor="card-email" className="label-glamlink">
              Email for your card
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id="card-email"
                type="email"
                autoComplete="email"
                placeholder="you@yourbusiness.com"
                value={cardEmail}
                onChange={(e) => {
                  setCardEmail(e.target.value);
                  setCardEmailError(null);
                }}
                aria-invalid={!!cardEmailError}
                className="input-glamlink"
              />
              <button type="submit" disabled={switching} className="btn-primary shrink-0 disabled:opacity-50">
                {switching && <Loader2 className="h-4 w-4 animate-spin" />}
                Use this email
              </button>
            </div>
            {cardEmailError && <p className="text-xs text-destructive">{cardEmailError}</p>}
          </form>
        </div>
      ) : notice ? (
        <div className="mt-6 flex gap-3 rounded-xl border border-primary/25 bg-accent/60 p-4 text-sm text-foreground">
          <MailCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          {notice.kind === "verify" ? (
            <p>
              Please verify your email first. We&apos;ve sent a new link to{" "}
              <span className="font-medium">{notice.email}</span>; open it to finish signing in.
            </p>
          ) : (
            <p>
              This account doesn&apos;t have a password yet.{" "}
              <Link href={withNext("/forgot-password", next)} className="link-glamlink text-secondary">
                Set one with &ldquo;Forgot password&rdquo;
              </Link>
              .
            </p>
          )}
        </div>
      ) : null}
      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        {/* Email */}
        <div>
          <label htmlFor="email" className="label-glamlink">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            aria-invalid={!!errors.email}
            className="input-glamlink"
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-destructive">{errors.email}</p>
          )}
        </div>
        {/* Password */}
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="password" className="label-glamlink">
              Password
            </label>
            <Link href={withNext("/forgot-password", next)} className="link-glamlink text-xs">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              aria-invalid={!!errors.password}
              className="input-glamlink pr-11"
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
          {errors.password && (
            <p className="mt-1.5 text-xs text-destructive">{errors.password}</p>
          )}
        </div>
        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
        {/* Register Link */}
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href={withNext("/register", next)} className="link-glamlink">
            Create Access Account
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}