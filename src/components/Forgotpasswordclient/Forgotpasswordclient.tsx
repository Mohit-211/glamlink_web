"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { message } from "antd";
import { forgotPasswordApi, sendOtp, verifyOtp } from "@/api/Api";

type Step = "request" | "otp" | "reset";

type FieldErrors = {
  email?: string;
  password?: string;
  confirm?: string;
};

const RESEND_SECONDS = 30;

/* ── Password Strength ───────────────────────── */
function getStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

function strengthLabel(score: number) {
  if (score < 2) return "Weak";
  if (score === 2) return "Fair";
  if (score === 3) return "Good";
  return "Strong";
}

/* ── Reusable password field (matches Login page styling) ─────── */
function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete="new-password"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          className={`w-full rounded-xl border bg-background px-4 py-2.5 pr-11 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
            error ? "border-red-500" : "border-input"
          }`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function ForgotPasswordClient() {
  const router = useRouter();
  const params = useSearchParams();

  const urlEmail = params.get("email") || "";
  const urlToken = params.get("token") || "";

  // If a token already arrived via URL (e.g. an emailed reset link, if you
  // keep that path around too), skip straight to the reset step.
  const [step, setStep] = useState<Step>(urlToken ? "reset" : "request");

  const [email, setEmail] = useState(urlEmail);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [otpError, setOtpError] = useState<string | null>(null);
  const [token, setToken] = useState(urlToken);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCooldown = () => {
    setResendCooldown(RESEND_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendCooldown((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
  };

  const strength = useMemo(() => getStrength(password), [password]);
  const mismatch = confirm.length > 0 && password !== confirm;

  /* ── Step 1: request OTP ─────────────────────── */
  const handleRequestOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors({ email: "Please enter a valid email address" });
      message.error("Please enter a valid email address");
      return;
    }
    setErrors({});

    try {
      setLoading(true);
      // type must match what the backend expects for a password-reset OTP
      const response = await sendOtp({ email, type: "forgot_password" });
      if (response?.success === false) {
        message.error(response?.message || "Failed to send code");
        return;
      }
      message.success(response?.message || "Verification code sent");
      setStep("otp");
      startCooldown();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Something went wrong";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 2: verify OTP, capture token ───────── */
  const handleVerifyOtp = async () => {
    const trimmed = otp.trim();
    if (!/^\d{4,8}$/.test(trimmed)) {
      setOtpError("Please enter a valid verification code");
      message.error("Please enter a valid verification code");
      return;
    }
    setOtpError(null);

    try {
      setLoading(true);
      const response = await verifyOtp({
        email,
        otp: trimmed,
        type: "forgot_password",
      });

      if (response?.success === false) {
        message.error(response?.message || "Invalid or expired code");
        return;
      }

      // NOTE: confirm the actual field name the backend returns the reset
      // token under — checking a few likely shapes here.
      const receivedToken =
        response?.token || response?.data?.token || response?.reset_token;

      if (!receivedToken) {
        message.error("Verification succeeded but no reset token was returned");
        return;
      }

      message.success(response?.message || "Code verified");
      setToken(receivedToken);
      setStep("reset");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Something went wrong";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;
    try {
      setResending(true);
      await sendOtp({ email, type: "forgot_password" });
      message.success("Verification code resent");
      startCooldown();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Failed to resend code";
      message.error(errorMessage);
    } finally {
      setResending(false);
    }
  };

  /* ── Step 3: reset password ──────────────────── */
  const updateField = (field: "password" | "confirm", value: string) => {
    if (field === "password") setPassword(value);
    else setConfirm(value);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateReset = (): FieldErrors => {
    const next: FieldErrors = {};

    if (!password) {
      next.password = "Please enter a new password";
    } else if (strength < 3) {
      next.password =
        "Password is too weak — use 8+ characters with a mix of case, numbers, and symbols";
    }

    if (!confirm) {
      next.confirm = "Please confirm your password";
    } else if (password !== confirm) {
      next.confirm = "Passwords do not match";
    }

    return next;
  };

  const handleReset = async () => {
    const fieldErrors = validateReset();
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      const firstError = Object.values(fieldErrors)[0];
      if (firstError) message.error(firstError);
      return;
    }

    if (!token) {
      message.error("Reset session expired. Please request a new code.");
      setStep("request");
      return;
    }

    // Tokens obtained via the OTP step are used as-is. Only a token that
    // arrived through a URL (e.g. legacy emailed link) needs base64 decoding.
    let finalToken = token;
    if (urlToken && token === urlToken) {
      try {
        finalToken = atob(token);
      } catch (err) {
        console.error("Failed to decode reset token:", err);
        message.error("Reset link is invalid or expired. Please request a new one.");
        return;
      }
    }

    try {
      setLoading(true);

      const payload = {
        email,
        password,
        confirm_password: confirm,
        token: finalToken,
      };

      const response = await forgotPasswordApi(payload);

      if (response?.success) {
        message.success(response?.message || "Password reset successful");
        setTimeout(() => {
          router.push("/login");
        }, 1200);
      } else {
        message.error(response?.message || "Reset failed");
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error?.response?.data?.message || error?.message || "Something went wrong";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-soft min-h-screen flex items-center justify-center">
      {/* Ambient blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="animate-pulse-slow absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="animate-pulse-slow animation-delay-700 absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {step === "request" && "Forgot Password"}
            {step === "otp" && "Verify your email"}
            {step === "reset" && "Reset Password"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {step === "request" && "Enter your email to receive a verification code"}
            {step === "otp" && (
              <>
                We sent a code to{" "}
                <span className="font-medium text-foreground">{email}</span>
              </>
            )}
            {step === "reset" && "Create a new password for your account"}
          </p>
        </div>

        <div className="card-glamlink !hover:transform-none rounded-2xl border bg-card p-8 shadow-[var(--shadow-medium)]">
          {step === "request" && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                  }}
                  aria-invalid={!!errors.email}
                  className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                    errors.email ? "border-red-500" : "border-input"
                  }`}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={loading}
                className="btn-primary w-full justify-center disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </button>
              <p className="text-center text-sm text-muted-foreground">
                Back to{" "}
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="font-medium text-primary hover:underline"
                >
                  Login
                </button>
              </p>
            </div>
          )}

          {step === "otp" && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground">
                  Verification Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter code"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ""));
                    if (otpError) setOtpError(null);
                  }}
                  aria-invalid={!!otpError}
                  className={`w-full rounded-xl border bg-background px-4 py-2.5 text-center text-lg tracking-[0.3em] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                    otpError ? "border-red-500" : "border-input"
                  }`}
                />
                {otpError && <p className="text-xs text-red-500 text-center">{otpError}</p>}
              </div>
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading}
                className="btn-primary w-full justify-center disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
              <p className="text-center text-sm text-muted-foreground">
                Didn't get a code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || resending}
                  className="font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
                >
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : resending
                      ? "Resending..."
                      : "Resend code"}
                </button>
              </p>
            </div>
          )}

          {step === "reset" && (
            <div className="space-y-5">
              {email && <p className="text-center text-sm font-semibold text-primary">{email}</p>}

              <PasswordInput
                id="password"
                label="New password"
                value={password}
                onChange={(e) => updateField("password", e.target.value)}
                placeholder="••••••••"
                error={errors.password}
              />

              <PasswordInput
                id="confirm"
                label="Confirm password"
                value={confirm}
                onChange={(e) => updateField("confirm", e.target.value)}
                placeholder="••••••••"
                error={errors.confirm}
              />

              {password && !errors.password && (
                <p className="text-xs text-muted-foreground">
                  Strength: <span className="font-semibold">{strengthLabel(strength)}</span>
                </p>
              )}

              {mismatch && !errors.confirm && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}

              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="btn-primary w-full justify-center disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <p className="text-center text-sm text-muted-foreground">
                Back to{" "}
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="font-medium text-primary hover:underline"
                >
                  Login
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}