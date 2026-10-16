"use client";

import { useState } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { toast } from "sonner";
import { forgotPasswordApi } from "@/api/Api";
import { readApiError } from "@/lib/apiError";
import AuthShell from "@/components/AuthPage/AuthShell";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Forgot password: the API emails a reset link (valid 1 hour) that opens
 * /reset-password. It answers the same whether or not the account exists.
 * This is also how an account made with Google or Apple sets a password.
 */
export default function ForgotPasswordClient() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_REGEX.test(value)) {
      setError("Please enter a valid email address");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await forgotPasswordApi({ email: value });
      setSentTo(value);
    } catch (err) {
      toast.error(readApiError(err).message);
    } finally {
      setLoading(false);
    }
  };

  if (sentTo) {
    return (
      <AuthShell>
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent">
            <MailCheck className="h-7 w-7 text-primary" />
          </div>
          <h1 className="mt-4 text-xl font-semibold tracking-tight">Check your email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            If an account exists for <span className="font-medium text-foreground">{sentTo}</span>, we&apos;ve
            sent a link to set a new password. It works for one hour.
          </p>
          <button
            type="button"
            onClick={() => setSentTo(null)}
            className="mt-6 text-sm font-medium text-primary hover:underline"
          >
            Use a different email
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <h1 className="text-xl font-semibold tracking-tight">Forgot your password?</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter your email and we&apos;ll send you a link to set a new one.
      </p>
      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        <label className="block">
          <span className="label-glamlink">Email address</span>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            aria-invalid={!!error}
            className="input-glamlink"
          />
          {error && <span className="mt-1.5 block text-xs text-destructive">{error}</span>}
        </label>
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? "Sending…" : "Send reset link"}
        </button>
        <p className="text-center text-sm text-muted-foreground">
          Remembered it?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
