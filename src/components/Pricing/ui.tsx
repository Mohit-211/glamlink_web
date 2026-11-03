"use client";

import type { ReactNode } from "react";
import { AlertCircle, ArrowLeft } from "lucide-react";

/* Small pieces the purchase steps share. */

export function Centered({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card-glamlink w-full max-w-md text-center hover:translate-y-0">{children}</div>
    </div>
  );
}

export function BackButton({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mb-6 flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground disabled:opacity-50"
    >
      <ArrowLeft className="h-4 w-4" /> {children}
    </button>
  );
}

export function StepHeading({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent">{icon}</span>
      <div>
        <h2 className="text-xl text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}

export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <div role="alert" className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-xs text-destructive">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {children}
    </div>
  );
}
