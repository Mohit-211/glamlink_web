"use client";

import { type ReactNode } from "react";
import { Check, Sparkles, Nfc } from "lucide-react";
import { PRO_FEATURES, FREE_FEATURES, KEYCHAIN_FEATURE, type PlanDef } from "./plans";

interface FeatureRowProps {
  children: ReactNode;
  soon?: boolean;
  keychain?: boolean;
}

export function FeatureRow({ children, soon = false, keychain = false }: FeatureRowProps) {
  return (
    <li className="flex items-start gap-2.5 py-1">
      <span
        className={`mt-0.5 flex h-4.5 w-4.5 flex-none items-center justify-center rounded-full ${
          soon ? "bg-muted" : keychain ? "bg-primary/15" : "bg-primary/10"
        }`}
      >
        {keychain ? (
          <Nfc className="h-2.5 w-2.5 text-primary" strokeWidth={2.5} />
        ) : (
          <Check className={`h-3 w-3 ${soon ? "text-muted-foreground" : "text-primary"}`} strokeWidth={3} />
        )}
      </span>
      <span
        className={`text-[13.5px] leading-5 ${
          soon ? "text-muted-foreground" : keychain ? "font-medium text-primary" : "text-foreground"
        }`}
      >
        {children}
        {soon && (
          <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Soon
          </span>
        )}
      </span>
    </li>
  );
}

export function PlanRadio({ selected }: { selected: boolean }) {
  return (
    <span
      className={`flex h-5 w-5 flex-none items-center justify-center rounded-full border-2 transition-colors duration-200 ${
        selected ? "border-primary bg-primary" : "border-border bg-transparent"
      }`}
    >
      {selected && <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />}
    </span>
  );
}

interface PlanCardProps {
  plan: PlanDef;
  selected: boolean;
  onSelect: () => void;
  compact?: boolean;
  disabled?: boolean;
}

export function PlanCard({ plan, selected, onSelect, compact = false, disabled = false }: PlanCardProps) {
  const isFeatured = plan.id === "proKeychain";
  const isSelected = selected && !disabled; // single source of truth

  return (
    <div
      role="button"
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : onSelect}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter") onSelect();
      }}
      className={`card-glamlink relative flex flex-col overflow-hidden text-left ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      } ${compact ? "p-4" : ""} ${
        isSelected
          ? plan.isPro
            ? "shadow-primary border-primary bg-accent/40"
            : "shadow-medium border-primary"
          : "border-border"
      }`}
    >

      <div className="relative flex items-center justify-between">
        {isFeatured ? (
          <span className="badge-soft">
            <Sparkles className="h-3 w-3" /> Most popular
          </span>
        ) : plan.hasKeychain ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <Nfc className="h-3 w-3" /> With keychain
          </span>
        ) : (
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {plan.isPro ? "Pro" : "Free"}
          </span>
        )}
        <PlanRadio selected={selected} />
      </div>

      <h3 className="relative mt-4 text-base font-semibold text-foreground">{plan.name}</h3>

      <p className="relative mt-2.5 flex flex-wrap items-baseline gap-1">
        <span className="font-display text-2xl text-foreground">{plan.priceLabel}</span>
        {plan.priceSuffix && <span className="text-xs text-muted-foreground">{plan.priceSuffix}</span>}
      </p>

      <p className="relative mt-1.5 text-xs text-muted-foreground">{plan.tagline}</p>

      {!compact && (
        <ul className="relative mt-4 flex-1 border-t border-border pt-4">
          {plan.isPro ? (
            <>
              <FeatureRow>Directory listing & digital card</FeatureRow>
              {PRO_FEATURES.map((f, i) =>
                typeof f === "string" ? <FeatureRow key={i}>{f}</FeatureRow> : <FeatureRow key={i} soon>{f.text}</FeatureRow>
              )}
            </>
          ) : (
            FREE_FEATURES.map((f) => <FeatureRow key={f}>{f}</FeatureRow>)
          )}
          {plan.hasKeychain && <FeatureRow keychain>{KEYCHAIN_FEATURE}</FeatureRow>}
        </ul>
      )}
    </div>
  );
}