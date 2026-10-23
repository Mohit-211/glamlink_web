"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { resendVerification, verifyEmail } from "@/api/Api";
import { readApiError } from "@/lib/apiError";
import AuthShell from "./AuthShell";

// A link works once: guard against the effect running twice in development.
const attempted = new Set<string>();

/** Opened from the verification email (valid 24 hours). Verifying signs the person in. */
export default function VerifyEmail() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [state, setState] = useState<"verifying" | "invalid-link">(token ? "verifying" : "invalid-link");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!token || attempted.has(token)) return;
    attempted.add(token);
    verifyEmail(token)
      .then(() => {
        toast.success("Your email is verified.");
        router.replace("/dashboard");
      })
      .catch((error) => {
        const { code, message } = readApiError(error);
        if (code !== "INVALID_LINK") toast.error(message);
        setState("invalid-link");
      });
  }, [token, router]);

  if (state === "verifying") {
    return (
      <AuthShell>
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verifying your email…</p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <LinkIcon className="h-6 w-6 text-destructive" />
        </div>
        <h1 className="mt-4 text-xl font-semibold tracking-tight">This link has expired</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Verification links work once and for 24 hours. Enter your email for a new one.
        </p>
      </div>
      <form
        className="mt-6 space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!email.trim()) return;
          setSending(true);
          try {
            await resendVerification(email.trim());
            toast.success("If that email needs verifying, a new link is on its way.");
          } catch (error) {
            toast.error(readApiError(error).message);
          } finally {
            setSending(false);
          }
        }}
      >
        <input
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-glamlink"
        />
        <button type="submit" disabled={sending} className="btn-primary w-full disabled:opacity-50">
          {sending ? "Sending…" : "Send a new link"}
        </button>
      </form>
    </AuthShell>
  );
}
