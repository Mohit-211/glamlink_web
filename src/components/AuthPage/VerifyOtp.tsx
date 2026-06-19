"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, Mail, CheckCircle2, RotateCcw } from "lucide-react";
// import { message } from "antd";
import { sendOtp, verifyOtp } from "@/api/Api";
const OTP_LENGTH = 4;
const RESEND_COOLDOWN = 30; // seconds
export default function VerifyOtp() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";
    const type = searchParams.get("type") || "";
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [status, setStatus] = useState<
        "idle" | "loading" | "success" | "error"
    >("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
    const [canResend, setCanResend] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    // Focus first box on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);
    // Countdown timer
    useEffect(() => {
        if (countdown <= 0) {
            setCanResend(true);
            return;
        }
        const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [countdown]);
    const handleChange = (index: number, value: string) => {
        // Allow only digits
        const digit = value.replace(/\D/g, "").slice(-1);
        const next = [...otp];
        next[index] = digit;
        setOtp(next);
        setErrorMsg("");
        // Auto-advance
        if (digit && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            if (otp[index]) {
                const next = [...otp];
                next[index] = "";
                setOtp(next);
            } else if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
        if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
        if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
    };
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!pasted) return;
        const next = Array(OTP_LENGTH).fill("");
        pasted.split("").forEach((ch, i) => (next[i] = ch));
        setOtp(next);
        const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
        inputRefs.current[focusIdx]?.focus();
    };
    const handleVerify = async () => {
        const code = otp.join("");
        if (code.length < OTP_LENGTH) {
            setErrorMsg("Please enter all 4 digits.");
            return;
        }
        try {
            setStatus("loading");
            setErrorMsg("");
            const response = await verifyOtp({
                email,
                otp: code,
                type,
            });
            console.log("Verify OTP Response:", response);
            if (response?.success) {
                setStatus("success");
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
                return;
            }
            setStatus("error");
            setErrorMsg(
                response?.message || "Invalid OTP"
            );
        } catch (error: any) {
            console.error(error);
            setStatus("error");
            setErrorMsg(
                error?.response?.data?.message ||
                "OTP verification failed"
            );
            setOtp(Array(OTP_LENGTH).fill(""));
            inputRefs.current[0]?.focus();
        }
    };
    const handleResend = useCallback(async () => {
        if (!canResend) return;
        try {
            setCanResend(false);
            setCountdown(RESEND_COOLDOWN);
            setResendSuccess(false);
            setErrorMsg("");
            setOtp(Array(OTP_LENGTH).fill(""));
            inputRefs.current[0]?.focus();
            await sendOtp({
                email,
                type,
            });
            setResendSuccess(true);
            // message.success("OTP sent successfully");
            setTimeout(() => {
                setResendSuccess(false);
            }, 3000);
        } catch (error: any) {
            console.error(error);
            // message.error(
            //     error?.response?.data?.message ||
            //     "Failed to resend OTP"
            // );
            setCanResend(true);
        }
    }, [canResend, email, type]);
    /* ── Success screen ── */
    if (status === "success") {
        return (
            <div className="page-soft min-h-screen flex items-center justify-center px-4 py-16">
                <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
                    <div className="animate-pulse-slow absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
                    <div className="animate-pulse-slow animation-delay-700 absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
                </div>
                <div className="relative w-full max-w-md text-center">
                    <div className="mb-8">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
                                <Sparkles className="h-5 w-5 text-white" />
                            </span>
                            <span className="font-display text-2xl font-bold gradient-text">Glamlink</span>
                        </Link>
                    </div>
                    <div className="card-glamlink rounded-2xl border bg-card p-10 shadow-[var(--shadow-medium)] flex flex-col items-center">
                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent border border-primary/20 mb-5">
                            <CheckCircle2 className="h-8 w-8 text-primary" />
                        </span>
                        <h1 className="text-xl font-semibold text-foreground tracking-tight">
                            Email verified!
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                            Your account is now active. Welcome to Glamlink — let&apos;s get you started.
                        </p>
                        <Link href="/dashboard" className="btn-primary mt-8 w-full justify-center">
                            Go to dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
    /* ── Main OTP screen ── */
    return (
        <div className="page-soft min-h-screen flex items-center justify-center px-4 py-16">
            {/* Ambient blobs */}
            <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="animate-pulse-slow absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
                <div className="animate-pulse-slow animation-delay-700 absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
            </div>
            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <p className="mt-3 text-sm text-muted-foreground p-5">
                        Almost there — just verify your email
                    </p>
                </div>
                {/* Card */}
                <div className="card-glamlink !hover:transform-none rounded-2xl border bg-card p-8 shadow-[var(--shadow-medium)]">
                    {/* Mail icon + heading */}
                    <div className="flex flex-col items-center text-center mb-7">
                        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent border border-primary/20 mb-4">
                            <Mail className="h-7 w-7 text-primary" />
                        </span>
                        <h1 className="text-xl font-semibold tracking-tight text-foreground">
                            Check your inbox
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs">
                            We sent a 4-digit code to{" "}
                            <span className="font-medium text-foreground break-all">
                                {email}
                            </span>.
                            Enter it below to verify your account.
                        </p>
                    </div>
                    {/* OTP boxes */}
                    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
                        {otp.map((digit, i) => (
                            <input
                                key={i}
                                ref={(el) => { inputRefs.current[i] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(i, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                onPaste={i === 0 ? handlePaste : undefined}
                                aria-label={`OTP digit ${i + 1}`}
                                className={`h-12 w-10 sm:h-14 sm:w-12 rounded-xl border-2 bg-background text-center text-lg font-bold text-foreground outline-none transition-all duration-150
                  ${digit ? "border-primary bg-accent/40" : "border-input"}
                  ${status === "error" ? "border-foreground/30 bg-secondary" : ""}
                  focus:border-primary focus:ring-2 focus:ring-primary/20`}
                            />
                        ))}
                    </div>
                    {/* Separator line between groups (visual hint) */}
                    <div className="flex justify-center mb-5">
                        <div className="flex gap-2 sm:gap-3 opacity-0 pointer-events-none" aria-hidden>
                            {otp.map((_, i) => (
                                <div key={i} className={`w-10 sm:w-12 h-0.5 ${i === 2 ? "bg-border mx-1" : ""}`} />
                            ))}
                        </div>
                    </div>
                    {/* Error message */}
                    {errorMsg && (
                        <p className="mb-4 text-center text-sm text-foreground bg-secondary border border-border rounded-xl px-4 py-2.5">
                            {errorMsg}
                        </p>
                    )}
                    {/* Resend success */}
                    {resendSuccess && (
                        <p className="mb-4 text-center text-sm text-primary bg-accent border border-primary/20 rounded-xl px-4 py-2.5">
                            A new code has been sent to your email.
                        </p>
                    )}
                    {/* Verify button */}
                    <button
                        onClick={handleVerify}
                        disabled={status === "loading" || otp.join("").length < OTP_LENGTH}
                        className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        {status === "loading" ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                </svg>
                                Verifying…
                            </span>
                        ) : (
                            "Verify email"
                        )}
                    </button>
                    {/* Divider */}
                    <div className="my-6 flex items-center gap-3">
                        <span className="h-px flex-1 bg-border" />
                        <span className="text-xs text-muted-foreground">didn&apos;t receive it?</span>
                        <span className="h-px flex-1 bg-border" />
                    </div>
                    {/* Resend OTP */}
                    <button
                        onClick={handleResend}
                        disabled={!canResend}
                        className={`btn-outline w-full justify-center gap-2 transition-all ${!canResend ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        <RotateCcw className="h-4 w-4" />
                        {canResend
                            ? "Resend code"
                            : `Resend in ${countdown}s`}
                    </button>
                    <p className="mt-4 text-center text-xs text-muted-foreground">
                        Check your spam folder if you can&apos;t find the email.
                    </p>
                </div>
                {/* Back to register */}
                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Wrong email?{" "}
                    <Link href="/register" className="font-semibold text-primary hover:underline">
                        Go back
                    </Link>
                </p>
            </div>
        </div>
    );
}