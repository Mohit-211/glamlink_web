"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { registerUser, sendOtp } from "@/api/Api";
import { useRouter } from "next/navigation";
import { getFormDataFromSession } from "../glamcard/GlamCardForm/Formdatasessionstorage";

interface RegisterProps {
  /** If provided, called after a successful registration with the
   *  registered email, instead of navigating to /verify-otp. Used when
   *  Register is rendered inside a modal (e.g. GlamCardForm's post-create
   *  auth flow). */
  onSuccess?: (email: string) => void;
}

export default function Register({ onSuccess }: RegisterProps = {}) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirm_password: "",
  });

  // Prefill email from sessionStorage (if it was saved earlier in this
  // session — e.g. when GlamCardForm stored its submit payload).
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
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][passwordStrength];
  const strengthColor = [
    "",
    "bg-red-400",
    "bg-yellow-400",
    "bg-emerald-400",
    "bg-emerald-500",
  ][passwordStrength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // First Name Validation
    if (!form.name.trim()) {
      alert("Please enter first name");
      return;
    }
    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email address");
      return;
    }
    // Mobile Validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(form.mobile)) {
      alert("Please enter a valid 10 digit mobile number");
      return;
    }
    // Password Validation
    if (form.password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }
    // Confirm Password Validation
    if (form.password !== form.confirm_password) {
      alert("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      const response = await registerUser({
        name: `${form.name}`,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
        confirm_password: form.confirm_password,
      });
      console.log("Register Response:", response);

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
        error?.response?.data?.message || "Something went wrong";
      if (
        errorMessage.toLowerCase().includes("verify your otp") ||
        errorMessage.toLowerCase().includes("not verified")
      ) {
        // Account exists but isn't verified. Route into the same OTP step
        // either way (modal callback or real page) since both paths lead
        // to email verification.
        if (onSuccess) {
          onSuccess(form.email);
        } else {
          router.push(
            `/verify-otp?email=${encodeURIComponent(form.email)}&type=email_varification`
          );
        }
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-soft min-h-screen flex items-center justify-center ">
      {/* Background Effects */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="animate-pulse-slow absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="animate-pulse-slow animation-delay-500 absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        
        {/* Card */}
        <div className="rounded-2xl border bg-card p-8 shadow-[var(--shadow-medium)]">
          <h1 className="mb-6 text-xl font-semibold tracking-tight text-foreground">
            Create Your Access Account
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  required
                  placeholder="John"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
                />
              </div>
            </div>
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
              />
            </div>
            {/* Mobile */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium">Mobile Number</label>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="9876543210"
                value={form.mobile}
                onChange={(e) =>
                  setForm({ ...form, mobile: e.target.value.replace(/\D/g, "") })
                }
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
              />
            </div>
            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 pr-11 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {form.password.length > 0 && (
                <>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i <= passwordStrength ? strengthColor : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Password strength:
                    <span className="ml-1 font-medium text-foreground">
                      {strengthLabel}
                    </span>
                  </p>
                </>
              )}
            </div>
            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Confirm Password"
                value={form.confirm_password}
                onChange={(e) =>
                  setForm({ ...form, confirm_password: e.target.value })
                }
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
              />
            </div>
            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center"
            >
              {loading ? "Creating Access Account..." : "Create Access Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}