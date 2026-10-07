"use client";
// Shared building blocks for every auth screen (login, sign up, OTP, forgot /
// reset password): one split-screen shell plus the field, button and error
// pieces, so all of them look and behave the same.
import { ComponentProps, ReactNode, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import logo from "../../../public/header_logo.png";

export const OTP_LENGTH = 4;

// ─── Layout ───────────────────────────────────────────────────────────────────
export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  wide = false,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  /** Secondary link line under the form ("Don't have an account? …"). */
  footer?: ReactNode;
  /** Slightly wider column for forms with side-by-side fields. */
  wide?: boolean;
}) {
  return (
    <div className="min-h-dvh lg:h-dvh lg:overflow-hidden flex flex-col lg:flex-row bg-background">
      {/* Left: editorial visual (compact banner on mobile) */}
      <aside className="relative h-36 sm:h-48 lg:h-full lg:w-[52%] shrink-0 overflow-hidden bg-muted">
        <img
          src="/assets/blog-featured.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-black/5" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-12 xl:p-14">
          <p className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold text-white/75">
            Glamlink
          </p>
          <p className="mt-1.5 lg:mt-3 max-w-md font-display text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-semibold leading-tight tracking-tight text-white text-balance">
            Where beauty professionals and their community connect.
          </p>
        </div>
      </aside>

      {/* Right: form column */}
      <section className="flex flex-1 items-center justify-center px-5 sm:px-8 py-8 sm:py-10 lg:h-full lg:overflow-y-auto lg:py-6">
        <div className={`w-full ${wide ? "max-w-[440px]" : "max-w-[400px]"}`}>
          <Link href="/" className="inline-flex rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40" aria-label="Glamlink home">
            <Image src={logo} alt="Glamlink" width={140} height={40} className="h-auto w-[116px] xl:w-[128px] object-contain" priority />
          </Link>

          <h1 className="mt-6 xl:mt-8 [@media(max-height:760px)]:mt-4 font-display text-2xl xl:text-3xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{subtitle}</p>
          )}

          <div className="mt-6 xl:mt-8 [@media(max-height:760px)]:mt-5">{children}</div>

          {footer && (
            <p className="mt-6 [@media(max-height:760px)]:mt-4 text-center text-sm text-muted-foreground">{footer}</p>
          )}
        </div>
      </section>
    </div>
  );
}

// ─── Fields ───────────────────────────────────────────────────────────────────
export const authInputClass = (hasError?: boolean) =>
  `w-full h-11 rounded-xl border bg-background px-4 text-base sm:text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:ring-2 disabled:opacity-60 ${hasError
    ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
    : "border-input focus:border-primary focus:ring-primary/20"
  }`;

export const authLinkClass =
  "rounded font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";

export function AuthFieldError({ id, children }: { id?: string; children?: ReactNode }) {
  if (!children) return null;
  return <p id={id} className="text-xs text-red-500">{children}</p>;
}

type AuthInputProps = ComponentProps<"input"> & {
  id: string;
  label: string;
  error?: string;
};

export function AuthInput({ id, label, error, className, ...props }: AuthInputProps) {
  return (
    <div className="space-y-1.5 min-w-0">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">{label}</label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${authInputClass(!!error)} ${className ?? ""}`}
        {...props}
      />
      <AuthFieldError id={`${id}-error`}>{error}</AuthFieldError>
    </div>
  );
}

export function AuthPasswordInput({
  id,
  label,
  error,
  children,
  ...props
}: Omit<AuthInputProps, "type"> & { children?: ReactNode }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="space-y-1.5 min-w-0">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${authInputClass(!!error)} pr-12`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-1 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          aria-controls={id}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      <AuthFieldError id={`${id}-error`}>{error}</AuthFieldError>
      {children}
    </div>
  );
}

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["", "bg-red-400", "bg-yellow-400", "bg-emerald-400", "bg-emerald-500"];

/** 4-step strength bar; `score` is 0–4. */
export function PasswordStrength({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-3 pt-0.5" aria-live="polite">
      <div className="flex flex-1 gap-1" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= score ? STRENGTH_COLORS[score] : "bg-border"}`} />
        ))}
      </div>
      <p className="text-xs text-muted-foreground whitespace-nowrap">
        Strength: <span className="font-medium text-foreground">{STRENGTH_LABELS[score] || "Weak"}</span>
      </p>
    </div>
  );
}

// ─── Buttons & messages ───────────────────────────────────────────────────────
export function AuthSubmitButton({
  loading,
  loadingText,
  children,
  disabled,
  ...props
}: ComponentProps<"button"> & { loading: boolean; loadingText: string }) {
  return (
    <button
      type="submit"
      {...props}
      disabled={loading || disabled}
      className="btn-primary h-11 w-full justify-center disabled:opacity-70 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function AuthFormError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

// ─── OTP ──────────────────────────────────────────────────────────────────────
/**
 * One box per digit. `value` is always a contiguous digit string; typing,
 * pasting and phone autofill (one-time-code) all go through onChange.
 */
export function AuthOtpInput({
  value,
  onChange,
  error,
  disabled,
  length = OTP_LENGTH,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  disabled?: boolean;
  length?: number;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const focusBox = (i: number) => refs.current[Math.max(0, Math.min(length - 1, i))]?.focus();

  const handleChange = (i: number, raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return;
    const pos = Math.min(i, value.length);
    const next = (value.slice(0, pos) + digits + value.slice(pos + digits.length)).slice(0, length);
    onChange(next);
    focusBox(pos + digits.length);
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (value[i]) {
        onChange(value.slice(0, i) + value.slice(i + 1));
      } else if (i > 0) {
        onChange(value.slice(0, i - 1) + value.slice(i));
        focusBox(i - 1);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusBox(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusBox(Math.min(i + 1, value.length));
    }
  };

  return (
    <div className="space-y-1.5">
      <div role="group" aria-label="Verification code" className="grid gap-3" style={{ gridTemplateColumns: `repeat(${length}, minmax(0, 1fr))` }}>
        {Array.from({ length }, (_, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            maxLength={length}
            value={value[i] ?? ""}
            disabled={disabled}
            aria-label={`Digit ${i + 1} of ${length}`}
            aria-invalid={!!error}
            aria-describedby={error ? "otp-error" : undefined}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onFocus={(e) => {
              // Keep entry contiguous: jump to the first empty box.
              if (i > value.length) focusBox(value.length);
              else e.target.select();
            }}
            className={`h-14 w-full rounded-xl border bg-background text-center text-xl font-semibold text-foreground outline-none transition focus:ring-2 disabled:opacity-60 ${error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
              : "border-input focus:border-primary focus:ring-primary/20"
              }`}
          />
        ))}
      </div>
      <AuthFieldError id="otp-error">{error}</AuthFieldError>
    </div>
  );
}

/** "Didn't get a code? Resend" line shared by both OTP screens. */
export function ResendCode({
  cooldown,
  resending,
  onResend,
}: {
  cooldown: number;
  resending: boolean;
  onResend: () => void;
}) {
  return (
    <p className="text-center text-sm text-muted-foreground">
      Didn&apos;t get a code?{" "}
      <button
        type="button"
        onClick={onResend}
        disabled={cooldown > 0 || resending}
        className={`${authLinkClass} disabled:cursor-not-allowed disabled:font-medium disabled:text-muted-foreground disabled:no-underline`}
      >
        {cooldown > 0 ? `Resend in ${cooldown}s` : resending ? "Resending…" : "Resend code"}
      </button>
    </p>
  );
}
