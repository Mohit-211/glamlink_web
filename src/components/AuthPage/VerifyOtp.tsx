"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyOtp, sendOtp } from "@/api/Api"; // NOTE: verify this export exists — guessed signature
import { message } from "antd";

interface VerifyOtpProps {
  email: string;
  type?: string; // e.g. "email_varification" — matches the type used when sendOtp was called
  /** If provided, called after successful verification instead of navigating.
   *  Used when rendered inside a modal. */
  onSuccess?: () => void;
}

const RESEND_SECONDS = 30;

export default function VerifyOtp({
  email,
  type = "email_varification",
  onSuccess,
}: VerifyOtpProps) {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(RESEND_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setResendCooldown((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{4,8}$/.test(otp.trim())) {
      alert("Please enter the verification code");
      return;
    }

    try {
      setLoading(true);
      // NOTE: guessed signature — confirm against the real verifyOtp API
      const response = await verifyOtp({
        email,
        otp: otp.trim(),
        type,
      });

      console.log("Verify OTP Response:", response);

      if (response?.success === false) {
        message.error(response?.message || "Invalid or expired code");
        return;
      }

      message.success(response?.message || "Verified successfully");

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/login");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Something went wrong";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      await sendOtp({ email, type });
      message.success("Verification code resent");
      setResendCooldown(RESEND_SECONDS);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Failed to resend code";
      message.error(errorMessage);
    }
  };

  return (
    <div className="page-soft min-h-screen flex items-center justify-center ">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="animate-pulse-slow absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="animate-pulse-slow animation-delay-500 absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="mt-3 text-sm text-muted-foreground">
            We sent a verification code to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-8 shadow-[var(--shadow-medium)]">
          <h1 className="mb-6 text-xl font-semibold tracking-tight text-foreground">
            Verify your email
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium">Verification Code</label>
              <input
                type="text"
                inputMode="numeric"
                required
                placeholder="Enter code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-center text-lg tracking-[0.3em] text-sm"
              />
            </div>
            <button
              type="submit"
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
                disabled={resendCooldown > 0}
                className="font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}