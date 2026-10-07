"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyOtp, sendOtp } from "@/api/Api"; // NOTE: verify this export exists — guessed signature
import { message } from "antd";
import Link from "next/link";
import {
  AuthLayout,
  AuthOtpInput,
  AuthSubmitButton,
  OTP_LENGTH,
  ResendCode,
  authLinkClass,
} from "./AuthLayout";

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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
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

  const validateOtp = (): string | null => {
    const trimmed = otp.trim();
    if (!trimmed) {
      return "Please enter the verification code";
    }
    if (!/^\d{4,8}$/.test(trimmed)) {
      return "Please enter a valid verification code";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateOtp();
    if (validationError) {
      setError(validationError);
      message.error(validationError);
      return;
    }
    setError(null);

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
    if (resendCooldown > 0 || resending) return;
    try {
      setResending(true);
      await sendOtp({ email, type });
      message.success("Verification code resent");
      setResendCooldown(RESEND_SECONDS);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Failed to resend code";
      message.error(errorMessage);
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={
        <>
          Enter the {OTP_LENGTH}-digit code we sent to{" "}
          <span className="font-medium text-foreground break-all">{email || "your email"}</span>
        </>
      }
      footer={
        <>
          Wrong email?{" "}
          <Link href="/register" className={authLinkClass}>Back to Sign Up</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5" aria-busy={loading}>
        <AuthOtpInput
          value={otp}
          onChange={(v) => {
            setOtp(v);
            if (error) setError(null);
          }}
          error={error}
          disabled={loading}
        />
        <AuthSubmitButton loading={loading} loadingText="Verifying…">
          Verify
        </AuthSubmitButton>
        <ResendCode cooldown={resendCooldown} resending={resending} onResend={handleResend} />
      </form>
    </AuthLayout>
  );
}
