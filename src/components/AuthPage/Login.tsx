"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, MailCheck } from "lucide-react";
import { loginUser } from "@/api/Api";
import { toast } from "sonner";
import { readApiError } from "@/lib/apiError";
import { safeNextPath } from "@/lib/auth";
import { useSession } from "@/lib/useSession";
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

/** Where to go after signing in: `?next=` when it is a path on this site. */
const nextPath = () =>
  typeof window === "undefined"
    ? null
    : safeNextPath(new URLSearchParams(window.location.search).get("next"));

export default function Login({ onSuccess }: LoginProps = {}) {
  const router = useRouter();
  const session = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  // Shown instead of a toast when the account needs the person to act by email.
  const [notice, setNotice] = useState<{ kind: "verify" | "set-password"; email: string } | null>(null);

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

  // Already signed in (restored from the refresh cookie): skip the form.
  useEffect(() => {
    if (session.status === "signed-in" && !onSuccess) {
      router.replace(nextPath() ?? "/dashboard");
    }
  }, [session.status, router, onSuccess]);

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
      router.push(nextPath() ?? "/dashboard");
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
        case "PROFESSIONAL_REQUIRED":
          toast.error(
            "This is a Glamlink app account. The website is for professionals; sign in through the app."
          );
          break;
        default:
          toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

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
            Welcome back — sign in to your account
          </p>
        </div>

        <div className="card-glamlink !hover:transform-none rounded-2xl border bg-card p-8 shadow-medium">
          <h1 className="mb-6 text-xl font-semibold tracking-tight text-foreground">
            Sign in
          </h1>
          {notice && (
            <div className="mb-5 flex gap-3 rounded-xl border border-primary/25 bg-accent/60 p-4 text-sm text-foreground">
              <MailCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {notice.kind === "verify" ? (
                <p>
                  Please verify your email first. We&apos;ve sent a new link to{" "}
                  <span className="font-medium">{notice.email}</span>; open it to finish signing in.
                </p>
              ) : (
                <p>
                  This account doesn&apos;t have a password yet.{" "}
                  <Link href="/forgot-password" className="font-medium text-primary hover:underline">
                    Set one with &ldquo;Forgot password&rdquo;
                  </Link>
                  .
                </p>
              )}
            </div>
          )}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                aria-invalid={!!errors.email}
                className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                  errors.email ? "border-destructive" : "border-input"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
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
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  aria-invalid={!!errors.password}
                  className={`w-full rounded-xl border bg-background px-4 py-2.5 pr-11 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                    errors.password ? "border-destructive" : "border-input"
                  }`}
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
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
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
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                Create Access Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}