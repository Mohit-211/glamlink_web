"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AuthFormError,
  AuthInput,
  AuthLayout,
  AuthPasswordInput,
  AuthSubmitButton,
  authLinkClass,
} from "./AuthLayout";
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


/** Only same-site paths are allowed, so ?redirect= can't send users off-site. */
function safeRedirectPath(path: string | null): string | null {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.startsWith("/login")) {
    return null;
  }
  return path;
}

/**
 * Where to go after login. A pending postLoginRedirect (set by flows such as the
 * Access card form before sending the user here) wins, then a ?redirect= query
 * param, then the dashboard.
 *
 * postLoginRedirect is deliberately left in storage: the destination page reads
 * it to know it should restore the user's saved draft, and clears it itself.
 */
function getPostLoginPath(): string {
  const pending = safeRedirectPath(localStorage.getItem("postLoginRedirect"));
  if (pending) return pending;
  const fromQuery = safeRedirectPath(new URLSearchParams(window.location.search).get("redirect"));
  return fromQuery ?? "/dashboard";
}

export default function Login({ onSuccess }: LoginProps = {}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const submittingRef = useRef(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

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
      router.replace(getPostLoginPath());
    }
  }, [router]);

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email.trim()) {
      next.email = "Please enter your email address";
    } else if (!emailRegex.test(form.email.trim())) {
      next.email = "Please enter a valid email address";
    }

    if (!form.password) {
      next.password = "Please enter your password";
    }

    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;

    setFormError("");
    const fieldErrors = validate();
    setErrors(fieldErrors);
    if (fieldErrors.email) {
      emailRef.current?.focus();
      return;
    }
    if (fieldErrors.password) {
      passwordRef.current?.focus();
      return;
    }

    try {
      submittingRef.current = true;
      setLoading(true);

      const response = await loginUser({
        email: form.email.trim(),
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

        router.push(getPostLoginPath());
        return;
      }

      setFormError(response?.message || "Login failed. Please check your details and try again.");
    } catch (error: any) {
      console.error(error);
      setFormError(
        error?.response?.data?.message || error?.message || "Something went wrong. Please try again."
      );
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (formError) setFormError("");
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/register" className={authLinkClass}>Sign Up</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4" aria-busy={loading}>
        <AuthFormError>{formError}</AuthFormError>

        <AuthInput
          ref={emailRef}
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

        <AuthPasswordInput
          ref={passwordRef}
          id="password"
          name="password"
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={form.password}
          disabled={loading}
          onChange={(e) => updateField("password", e.target.value)}
          error={errors.password}
        >
          <div className="flex justify-end pt-0.5">
            <Link href="/forgot-password" className={`${authLinkClass} text-xs font-medium`}>
              Forgot Password?
            </Link>
          </div>
        </AuthPasswordInput>

        <AuthSubmitButton loading={loading} loadingText="Signing in…">
          Sign In
        </AuthSubmitButton>
      </form>
    </AuthLayout>
  );
}
