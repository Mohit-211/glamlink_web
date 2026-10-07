"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Script from "next/script";
import {
  AuthInput,
  AuthLayout,
  AuthPasswordInput,
  AuthSubmitButton,
  PasswordStrength,
  authLinkClass,
} from "./AuthLayout";
import { registerUser, sendOtp } from "@/api/Api";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { getFormDataFromSession } from "../glamcard/GlamCardForm/Formdatasessionstorage";

// Site key comes from the Cloudflare Turnstile dashboard.
// Set NEXT_PUBLIC_TURNSTILE_SITE_KEY in your .env.local / deployment env.
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          action?: string;
          size?: "normal" | "compact" | "invisible";
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
        }
      ) => string;
      execute: (widgetIdOrContainer: string | HTMLElement) => void;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

interface RegisterProps {
  /** If provided, called after a successful registration with the
   *  registered email, instead of navigating to /verify-otp. Used when
   *  Register is rendered inside a modal (e.g. GlamCardForm's post-create
   *  auth flow). */
  onSuccess?: (email: string) => void;
}

type FieldErrors = {
  name?: string;
  email?: string;
  mobile?: string;
  password?: string;
  confirm_password?: string;
};

export default function Register({ onSuccess }: RegisterProps = {}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [turnstileScriptLoaded, setTurnstileScriptLoaded] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});

  // Invisible Turnstile still needs a container element to render into
  // (even though nothing visible appears there), and we track the
  // widget id so we can execute/reset the same widget on submit.
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Prefill name/email/mobile from sessionStorage (if saved earlier in this
  // session — e.g. when GlamCardForm stored its submit payload).
  useEffect(() => {
    const storedPayload = getFormDataFromSession();
    if (!storedPayload) return;

    setForm((prev) => ({
      ...prev,
      name:
        typeof storedPayload.name === "string" && storedPayload.name.trim()
          ? storedPayload.name
          : prev.name,
      email:
        typeof storedPayload.email === "string" && storedPayload.email.trim()
          ? storedPayload.email
          : prev.email,
      mobile:
        typeof storedPayload.phone === "string" && storedPayload.phone.trim()
          ? storedPayload.phone
          : prev.mobile,
    }));
  }, []);

  // Render the invisible widget once the script has loaded. We render it
  // up front (rather than on submit) so execute() has a widget ready to go.
  useEffect(() => {
    if (
      !turnstileScriptLoaded ||
      !TURNSTILE_SITE_KEY ||
      !window.turnstile ||
      !turnstileContainerRef.current ||
      widgetIdRef.current
    ) {
      return;
    }

    widgetIdRef.current = window.turnstile.render(
      turnstileContainerRef.current,
      {
        sitekey: TURNSTILE_SITE_KEY,
        action: "register",
        size: "invisible",
      }
    );
  }, [turnstileScriptLoaded]);

  const passwordStrength = (() => {
    const p = form.password;
    if (p.length === 0) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  })();

  // Live (pre-submit) checks — recomputed on every keystroke so the user
  // sees "too short" / "doesn't match" instantly instead of only after
  // hitting submit. Falls back to the submit-time error (from validate())
  // once that's been set, so the message doesn't flicker/disappear.
  const livePasswordError =
    form.password.length > 0 && form.password.length < 8
      ? "Password must be at least 8 characters"
      : undefined;
  const passwordError = errors.password || livePasswordError;

  const liveConfirmError =
    form.confirm_password.length > 0 && form.password !== form.confirm_password
      ? "Passwords do not match"
      : undefined;
  const confirmPasswordError = errors.confirm_password || liveConfirmError;

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};

    // Name
    if (!form.name.trim()) {
      next.name = "Please enter your first name";
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      next.email = "Please enter a valid email address";
    }

    // Mobile (optional) — only validate format if the user entered something
    const mobileRegex = /^[0-9]{10}$/;
    if (form.mobile.trim() && !mobileRegex.test(form.mobile)) {
      next.mobile = "Please enter a valid 10 digit mobile number";
    }

    // Password
    if (form.password.length < 8) {
      next.password = "Password must be at least 8 characters";
    }

    // Confirm password
    if (form.password !== form.confirm_password) {
      next.confirm_password = "Passwords do not match";
    }

    return next;
  };

  // Runs the invisible Turnstile challenge and resolves with a fresh token.
  // Tokens are single-use, so this runs right before submit rather than
  // being cached from page load.
  const getTurnstileToken = async (): Promise<string | null> => {
    if (!TURNSTILE_SITE_KEY) {
      // No site key configured — skip silently in local/dev environments
      // rather than blocking registration entirely.
      console.warn(
        "NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set; skipping captcha token."
      );
      return null;
    }

    if (!window.turnstile || !turnstileContainerRef.current) {
      message.error("Captcha failed to load. Please refresh and try again.");
      return null;
    }

    try {
      const token = await new Promise<string>((resolve, reject) => {
        // Re-render bound to this submit's callback so we get the token
        // from this specific execute() call rather than a stale render.
        const widgetId = window.turnstile!.render(
          turnstileContainerRef.current as HTMLElement,
          {
            sitekey: TURNSTILE_SITE_KEY,
            action: "register",
            size: "invisible",
            callback: (t) => resolve(t),
            "error-callback": () =>
              reject(new Error("Turnstile challenge failed")),
            "expired-callback": () =>
              reject(new Error("Turnstile token expired")),
          }
        );
        window.turnstile!.execute(widgetId);
      });
      return token;
    } catch (err) {
      console.error("Turnstile execute failed:", err);
      message.error("Captcha verification failed. Please try again.");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fieldErrors = validate();
    setErrors(fieldErrors);

    if (Object.keys(fieldErrors).length > 0) {
      // Surface the first error as a toast too, so it's noticeable even if
      // the field is off-screen.
      const firstError = Object.values(fieldErrors)[0];
      if (firstError) message.error(firstError);
      return;
    }

    try {
      setLoading(true);

      // Fetch a fresh, single-use token right before hitting the API.
      let turnstileToken: string | null = null;
      if (TURNSTILE_SITE_KEY) {
        turnstileToken = await getTurnstileToken();
        if (!turnstileToken) {
          // getTurnstileToken already surfaced an error toast.
          return;
        }
      }

      const response = await registerUser({
        name: `${form.name}`,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
        confirm_password: form.confirm_password,
        ...(turnstileToken ? { turnstile_token: turnstileToken } : {}),
      });
      console.log("Register Response:", response);

      if (response?.success === false) {
        message.error(response?.message || "Something went wrong");
        return;
      }

      message.success(response?.message || "Account created successfully");

      if (onSuccess) {
        onSuccess(form.email);
      } else {
        router.push(
          `/verify-otp?email=${encodeURIComponent(form.email)}&type=email_varification`
        );
      }
      return;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Something went wrong";

      if (
        errorMessage.toLowerCase().includes("verify your otp") ||
        errorMessage.toLowerCase().includes("not verified")
      ) {
        // Account exists but isn't verified. Route into the same OTP step
        // either way (modal callback or real page) since both paths lead
        // to email verification.
        message.warning(errorMessage);
        if (onSuccess) {
          onSuccess(form.email);
        } else {
          router.push(
            `/verify-otp?email=${encodeURIComponent(form.email)}&type=email_varification`
          );
        }
        return;
      }

      // Previously this fell through silently with no user-facing error.
      // Always surface something so the user knows the submit failed.
      message.error(errorMessage);
    } finally {
      setLoading(false);
      // Reset the widget so the next submit attempt gets a fresh token
      // instead of reusing a consumed/expired one.
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
      }
    }
  };

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    // Password and confirm-password are cross-validated, so a stale
    // submit-time error on one can outlive an edit to the other (e.g. submit
    // fails on mismatch, user then fixes it by editing "password" instead of
    // "confirm_password" — only editing "confirm_password" would normally
    // clear that error). Clear both together so the live check above always
    // wins once either field changes.
    if (field === "password" || field === "confirm_password") {
      if (errors.password || errors.confirm_password) {
        setErrors((prev) => ({
          ...prev,
          password: undefined,
          confirm_password: undefined,
        }));
      }
      return;
    }

    // Clear that field's error as soon as the user edits it.
    if (errors[field as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <AuthLayout
      wide
      title="Create Your Account"
      subtitle="Join Glamlink and connect with the beauty & wellness community."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className={authLinkClass}>Sign In</Link>
        </>
      }
    >
      {/* Cloudflare Turnstile script — invisible mode, no checkbox UI */}
      {TURNSTILE_SITE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
          onLoad={() => setTurnstileScriptLoaded(true)}
        />
      )}
      {/* Container Turnstile renders into — stays empty/invisible in "invisible" size */}
      <div ref={turnstileContainerRef} />

      <form onSubmit={handleSubmit} noValidate className="space-y-4 [@media(max-height:760px)]:space-y-3" aria-busy={loading}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 [@media(max-height:760px)]:gap-3">
          <AuthInput
            id="name"
            name="name"
            label="Name"
            autoComplete="name"
            placeholder="Jane Doe"
            value={form.name}
            disabled={loading}
            onChange={(e) => updateField("name", e.target.value)}
            error={errors.name}
          />
          <AuthInput
            id="mobile"
            name="mobile"
            label="Mobile (optional)"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            maxLength={10}
            placeholder="9876543210"
            value={form.mobile}
            disabled={loading}
            onChange={(e) => updateField("mobile", e.target.value.replace(/\D/g, ""))}
            error={errors.mobile}
          />
        </div>

        <AuthInput
          id="email"
          name="email"
          label="Email address"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="you@example.com"
          value={form.email}
          disabled={loading}
          onChange={(e) => updateField("email", e.target.value)}
          error={errors.email}
        />

        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 [@media(max-height:760px)]:gap-3">
            <AuthPasswordInput
              id="password"
              name="password"
              label="Password"
              autoComplete="new-password"
              minLength={8}
              placeholder="Min. 8 characters"
              value={form.password}
              disabled={loading}
              onChange={(e) => updateField("password", e.target.value)}
              error={passwordError}
            />
            <AuthPasswordInput
              id="confirm_password"
              name="confirm_password"
              label="Confirm password"
              autoComplete="new-password"
              placeholder="Re-enter password"
              value={form.confirm_password}
              disabled={loading}
              onChange={(e) => updateField("confirm_password", e.target.value)}
              error={confirmPasswordError}
            />
          </div>
          {form.password.length > 0 && <PasswordStrength score={passwordStrength} />}
        </div>

        <AuthSubmitButton loading={loading} loadingText="Creating account…">
          Create Account
        </AuthSubmitButton>

        {TURNSTILE_SITE_KEY && (
          <p className="text-[11px] leading-snug text-muted-foreground text-center">
            Protected by Cloudflare Turnstile. Its{" "}
            <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noreferrer" className="underline hover:text-foreground">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="https://www.cloudflare.com/website-terms/" target="_blank" rel="noreferrer" className="underline hover:text-foreground">
              Terms of Service
            </a>{" "}
            apply.
          </p>
        )}
      </form>
    </AuthLayout>
  );
}
