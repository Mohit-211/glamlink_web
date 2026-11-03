"use client";

import { type ReactNode } from "react";
import { Check, Sparkles, Nfc } from "lucide-react";
import { featureLists, type PlanDef, type PlanFeature, type PlanId } from "./plans";

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
        className={`text-sm leading-5 ${
          soon ? "text-muted-foreground" : keychain ? "font-medium text-secondary" : "text-foreground"
        }`}
      >
        {children}
        {soon && (
          <span className="ml-2 rounded-full bg-muted px-2 py-0.5 eyebrow text-muted-foreground">
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
        selected ? "border-secondary bg-secondary" : "border-border bg-transparent"
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
  /** The card before this one: "Everything in <name>, plus:" above `features`. */
  includes?: string | null;
  /** What this card lists (default: all of the plan's features). */
  features?: PlanFeature[];
  /** Why the card can't be chosen, e.g. "Your plan". */
  note?: string | null;
}

export function PlanCard({
  plan,
  selected,
  onSelect,
  compact = false,
  disabled = false,
  includes = null,
  features = plan.features,
  note = null,
}: PlanCardProps) {
  const isSelected = selected && !disabled; // single source of truth

  return (
    <div
      role="button"
      aria-disabled={disabled}
      aria-pressed={isSelected}
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : onSelect}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`card-glamlink relative flex flex-col overflow-hidden text-left ${
        disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"
      } ${compact ? "p-4" : ""} ${
        isSelected
          ? plan.isPro
            ? "shadow-primary border-secondary bg-accent/40"
            : "shadow-medium border-secondary"
          : "border-border"
      }`}
    >

      <div className="relative flex items-center justify-between">
        {plan.badge ? (
          <span className="badge-soft">
            <Sparkles className="h-3 w-3" /> {plan.badge}
          </span>
        ) : plan.hasKeychain ? (
          <span className="inline-flex items-center gap-1 eyebrow text-muted-foreground">
            <Nfc className="h-3 w-3" /> With keychain
          </span>
        ) : (
          <span className="eyebrow text-muted-foreground">
            {plan.label}
          </span>
        )}
        {note ? (
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
            {note}
          </span>
        ) : (
          <PlanRadio selected={isSelected} />
        )}
      </div>

      <h3 className="relative mt-4 text-base font-semibold text-foreground">{plan.name}</h3>

      <p className="relative mt-2.5 flex flex-wrap items-baseline gap-1">
        {plan.listPriceLabel && (
          <span className="text-sm text-muted-foreground line-through">{plan.listPriceLabel}</span>
        )}
        <span className="text-2xl text-foreground">{plan.priceLabel}</span>
        {plan.priceSuffix && <span className="text-xs text-muted-foreground">{plan.priceSuffix}</span>}
      </p>
      {(plan.afterNote || plan.personal) && (
        <p className="relative mt-1 text-xs font-medium text-secondary">
          {plan.personal ? "Your personal price" : plan.afterNote}
        </p>
      )}

      <p className="relative mt-1.5 text-xs text-muted-foreground">{plan.tagline}</p>

      {!compact && (
        <div className="relative mt-4 flex-1 border-t border-border pt-4">
          {includes && (
            <p className="pb-1 text-sm font-semibold leading-5 text-foreground">
              Everything in {includes}
              {features.length ? ", plus:" : "."}
            </p>
          )}
          <ul>
            {features.map((f) => (
              <FeatureRow key={f.text} soon={f.soon} keychain={f.highlight === "keychain"}>
                {f.text}
              </FeatureRow>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

interface PlanGridProps {
  /** The plan cards in the order shown: each one builds on the card before it. */
  plans: PlanDef[];
  selected: PlanId | null;
  onSelect: (id: PlanId) => void;
  isDisabled?: (id: PlanId) => boolean;
  noteFor?: (id: PlanId) => string | null;
  className?: string;
}

/**
 * Plan cards side by side. The first lists its features; each next one says
 * "Everything in <the one before>, plus:" and lists only what it adds, so no
 * feature is repeated (plans.featureLists).
 */
export function PlanGrid({ plans, selected, onSelect, isDisabled, noteFor, className }: PlanGridProps) {
  const lists = featureLists(plans);
  return (
    <div className={className ?? "grid gap-5 md:grid-cols-3"}>
      {plans.map((p, i) => (
        <PlanCard
          key={p.id}
          plan={p}
          includes={lists[i].includes}
          features={lists[i].features}
          selected={selected === p.id}
          disabled={isDisabled?.(p.id) ?? false}
          note={noteFor?.(p.id) ?? null}
          onSelect={() => onSelect(p.id)}
        />
      ))}
    </div>
  );
}