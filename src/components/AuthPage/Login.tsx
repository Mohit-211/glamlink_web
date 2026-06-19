"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { loginUser, sendOtp } from "@/api/Api";
// import { message } from "antd";
export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await loginUser({
        email: form.email,
        password: form.password,
      });
      console.log("Login Response:", response);
      // User not verified
      if (
        response?.message?.includes(
          "User is not verified yet"
        )
      ) {
        await sendOtp({
          email: form.email,
          type: "email_varification",
        });
        router.push(
          `/verify-otp?email=${encodeURIComponent(
            form.email
          )}`
        );
        return;
      }
      // Login Success
      if (response?.success) {
        const accessToken =
          response?.data?.tokens?.access?.token;
        const refreshToken =
          response?.data?.tokens?.refresh?.token;
        if (accessToken) {
          localStorage.setItem(
            "GlamlinkaccessToken",
            accessToken
          );
        }
        if (refreshToken) {
          localStorage.setItem(
            "GlamlinkrefreshToken",
            refreshToken
          );
        }
     
        // message.success(
        //   response?.message || "Login successful"
        // );
        router.push("/dashboard");
        return;
      }
      // message.error(response?.message || "Login failed");
    } catch (error: any) {
      console.error(error);
      if (
        error?.response?.data?.message.toLowerCase().includes("not verified")
      ) {
        // message.warning(error?.response?.data?.message);
        router.push(
          `/verify-otp?email=${encodeURIComponent(
            form.email
          )}&type=email_varification`
        );
        return;
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="page-soft min-h-screen flex items-center justify-center m-5 p-20">
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
          {/* <Link
            href="/"
            className="inline-flex items-center gap-2"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
              <Sparkles className="h-5 w-5 text-white" />
            </span>
            <span className="font-display text-2xl font-bold gradient-text">
              Glamlink
            </span>
          </Link> */}
          <p className="mt-3 text-sm text-muted-foreground">
            Welcome back — sign in to your account
          </p>
        </div>
        {/* Card */}
        <div className="card-glamlink !hover:transform-none rounded-2xl border bg-card p-8 shadow-[var(--shadow-medium)]">
          <h1 className="mb-6 text-xl font-semibold tracking-tight text-foreground">
            Sign in
          </h1>
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
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
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
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
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 pr-11 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-50"
            >
              {loading
                ? "Signing in..."
                : "Sign in"}
            </button>
            {/* Register Link */}
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                Create Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}