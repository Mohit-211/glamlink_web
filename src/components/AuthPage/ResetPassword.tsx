"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Eye, EyeOff, LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { resetPasswordApi } from "@/api/Api";
import { readApiError } from "@/lib/apiError";
import { PASSWORD_HINT, passwordProblem } from "@/lib/password";
import AuthShell from "./AuthShell";

/**
 * Opened from an email link: forgot password (valid 1 hour), or the Access
 * welcome email for a new card owner (valid 7 days). Worded to fit both.
 * Setting the password signs out every device and verifies the email.
 */
export default function ResetPassword() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [form, setForm] = useState({ password: "", confirm_password: "" });
  const [errors, setErrors] = useState<{ password?: string; confirm_password?: string }>({});
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<"form" | "done" | "invalid-link">(token ? "form" : "invalid-link");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    const problem = passwordProblem(form.password);
    if (problem) next.password = problem;
    if (form.password !== form.confirm_password) next.confirm_password = "Passwords do not match";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      await resetPasswordApi({ token, ...form });
      setState("done");
    } catch (error) {
      const { code, message } = readApiError(error);
      if (code === "INVALID_LINK") setState("invalid-link");
      else if (code === "WEAK_PASSWORD") setErrors({ password: message });
      else if (code === "PASSWORD_MISMATCH") setErrors({ confirm_password: message });
      else toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (state === "invalid-link") {
    return (
      <AuthShell>
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <LinkIcon className="h-6 w-6 text-destructive" />
          </div>
          <h1 className="mt-4 text-xl font-semibold tracking-tight">This link has expired</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Links to set a password work once and only for a limited time. Ask for a new one below.
          </p>
          <Link href="/forgot-password" className="btn-primary mt-6 w-full">
            Send a new link
          </Link>
        </div>
      </AuthShell>
    );
  }

  if (state === "done") {
    return (
      <AuthShell>
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent">
            <CheckCircle className="h-7 w-7 text-primary" />
          </div>
          <h1 className="mt-4 text-xl font-semibold tracking-tight">Your password is set</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in with your new password.</p>
          <button type="button" onClick={() => router.push("/login")} className="btn-primary mt-6 w-full">
            Sign in
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <h1 className="text-xl font-semibold tracking-tight">Set your password</h1>
      <p className="mt-2 text-sm text-muted-foreground">{PASSWORD_HINT}</p>
      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        <label className="block">
          <span className="label-glamlink">New password</span>
          <span className="relative block">
            <input
              type={show ? "text" : "password"}
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => {
                setForm((f) => ({ ...f, password: e.target.value }));
                setErrors({});
              }}
              aria-invalid={!!errors.password}
              className="input-glamlink pr-11"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </span>
          {errors.password && <span className="mt-1.5 block text-xs text-destructive">{errors.password}</span>}
        </label>
        <label className="block">
          <span className="label-glamlink">Confirm password</span>
          <input
            type={show ? "text" : "password"}
            autoComplete="new-password"
            value={form.confirm_password}
            onChange={(e) => {
              setForm((f) => ({ ...f, confirm_password: e.target.value }));
              setErrors({});
            }}
            aria-invalid={!!errors.confirm_password}
            className="input-glamlink"
          />
          {errors.confirm_password && (
            <span className="mt-1.5 block text-xs text-destructive">{errors.confirm_password}</span>
          )}
        </label>
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? "Saving…" : "Set password"}
        </button>
      </form>
    </AuthShell>
  );
}
