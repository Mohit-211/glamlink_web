import type { ReactNode } from "react";

/** The frame the sign-in pages share: soft background, one centered card. */
export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="page-soft relative flex min-h-screen items-center justify-center px-4 py-24">
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="animate-pulse-slow absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="animate-pulse-slow animation-delay-700 absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
      </div>
      <div className="relative w-full max-w-md rounded-2xl border bg-card p-8 shadow-medium">{children}</div>
    </div>
  );
}
