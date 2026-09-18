"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "@/api/Api";
import { message } from "antd";
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

export default function Login({ onSuccess }: LoginProps = {}) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});

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

  useEffect(() => {
    const accessToken = localStorage.getItem("GlamlinkaccessToken");
    if (accessToken) {
      router.replace("/dashboard");
    }
  }, [router]);

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
      if (firstError) message.error(firstError);
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser({
        email: form.email,
        password: form.password,
      });

      if (response?.success) {
        const accessToken = response?.data?.tokens?.access?.token;
        const refreshToken = response?.data?.tokens?.refresh?.token;

        try {
          if (accessToken) {
            localStorage.setItem("GlamlinkaccessToken", accessToken);
          }
          if (refreshToken) {
            localStorage.setItem("GlamlinkrefreshToken", refreshToken);
          }
        } catch (storageError) {
          console.error("Failed to persist auth tokens:", storageError);
        }

        message.success(response?.message || "Login successful");
        window.dispatchEvent(new Event("auth-change"));
        clearFormDataFromSession();

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

      message.error(response?.message || "Login failed");
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error?.response?.data?.message || error?.message || "Something went wrong";
      message.error(errorMessage);
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

        <div className="card-glamlink !hover:transform-none rounded-2xl border bg-card p-8 shadow-[var(--shadow-medium)]">
          <h1 className="mb-6 text-xl font-semibold tracking-tight text-foreground">
            Sign in
          </h1>
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
                  errors.email ? "border-red-500" : "border-input"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
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
                    errors.password ? "border-red-500" : "border-input"
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
                <p className="text-xs text-red-500">{errors.password}</p>
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
      </div>
    </div>
  );
}