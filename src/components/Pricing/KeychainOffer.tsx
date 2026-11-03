"use client";

import { Loader2, Nfc } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { money, type PlanDef } from "./plans";

interface KeychainOfferProps {
  /** The plan the person chose (Free or Access Pro); null closes the offer. */
  plan: PlanDef | null;
  /** The same plan with the keychain added, priced by the API. */
  withKeychain: PlanDef | null;
  busy?: boolean;
  onAdd: () => void;
  onSkip: () => void;
  onClose: () => void;
}

/**
 * Offered after a plan without the keychain is chosen, Free included: the NFC
 * keychain as a one-time add-on. Closing it goes back to the plans. Shipping is
 * not promised here: the order review shows it, or says it is included, once
 * the address is known.
 */
export default function KeychainOffer({ plan, withKeychain, busy = false, onAdd, onSkip, onClose }: KeychainOfferProps) {
  const cents = withKeychain?.keychainCents ?? null;
  const listCents = withKeychain?.keychainListCents ?? null;

  return (
    <Dialog open={!!plan && !!withKeychain} onOpenChange={(open) => !open && !busy && onClose()}>
      <DialogContent className="gap-0 overflow-hidden rounded-3xl p-0 sm:max-w-md">
        {plan && withKeychain && cents !== null && (
          <div className="p-6 text-center sm:p-8">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-secondary">
              <Nfc className="h-7 w-7" aria-hidden="true" />
            </span>
            <DialogTitle className="mt-5 text-2xl font-semibold">Add the NFC keychain?</DialogTitle>
            <DialogDescription className="mt-3 text-muted-foreground">
              Clients tap it with their phone to open your Access card. No app, no typing.
            </DialogDescription>

            <p className="mt-5 flex items-baseline justify-center gap-2">
              {listCents !== null && (
                <span className="text-sm text-muted-foreground line-through">{money(listCents)}</span>
              )}
              <span className="text-3xl text-foreground">{money(cents)}</span>
              <span className="text-sm text-muted-foreground">one-time</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {plan.isPro
                ? "Added to your first Access Pro payment. Ships within the US."
                : "Your card stays on the Free plan. Ships within the US."}
            </p>

            <button type="button" onClick={onAdd} disabled={busy} className="btn-primary mt-7 w-full py-3.5 disabled:opacity-50">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Nfc className="h-4 w-4" aria-hidden="true" />}
              Add keychain · {money(cents)}
            </button>
            <button
              type="button"
              onClick={onSkip}
              disabled={busy}
              className="mt-3 w-full rounded-full py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              No thanks, continue with {plan.name}
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/**
 * The keychain on its own, for someone with no plan card left that offers it
 * (they have Access Pro), or on the dashboard.
 */
export function KeychainAddOn({ plan, busy = false, onAdd }: { plan: PlanDef; busy?: boolean; onAdd: () => void }) {
  const cents = plan.keychainCents;
  if (cents === null) return null;
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft sm:flex-row sm:items-center">
      <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-accent text-secondary">
        <Nfc className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">Add the NFC keychain</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Clients tap it with their phone to open your Access card.{" "}
          {plan.keychainListCents !== null && (
            <span className="line-through">{money(plan.keychainListCents)}</span>
          )}{" "}
          <span className="font-medium text-foreground">{money(cents)}</span> one-time.
        </p>
      </div>
      <button type="button" onClick={onAdd} disabled={busy} className="btn-outline shrink-0 disabled:opacity-50">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Nfc className="h-4 w-4" aria-hidden="true" />}
        Add keychain
      </button>
    </div>
  );
}
