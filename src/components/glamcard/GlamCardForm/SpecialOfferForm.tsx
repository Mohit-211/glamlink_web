"use client";

import Link from "next/link";
import { Lock, Tag } from "lucide-react";
import type { GlamCardFormData } from "./types";

interface Props {
  data: GlamCardFormData;
  setData: React.Dispatch<React.SetStateAction<GlamCardFormData>>;
  /** Special offers are part of Access Pro; Free owners see why it is locked. */
  locked: boolean;
}

/** The card's special offer (`offer_promotion`, `promotion_details`): Access Pro only. */
export default function SpecialOfferForm({ data, setData, locked }: Props) {
  return (
    <section className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-6">
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-primary" />
        <h2 className="text-lg font-semibold">Special offer</h2>
      </div>

      {locked ? (
        <div className="flex items-start gap-3 rounded-xl bg-muted/60 p-4 text-sm">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-muted-foreground">
            Run a special offer on your card with Access Pro.{" "}
            <Link href="/dashboard?tab=subscription-plans" className="font-medium text-primary hover:underline">
              See plans
            </Link>
          </p>
        </div>
      ) : (
        <>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(data.offer_promotion)}
              onChange={(e) => setData((p) => ({ ...p, offer_promotion: e.target.checked }))}
              className="h-4 w-4 accent-[hsl(var(--primary))]"
            />
            Show a special offer on my card
          </label>
          {data.offer_promotion && (
            <label className="block">
              <span className="label-glamlink">Offer details</span>
              <textarea
                value={data.promotion_details || ""}
                onChange={(e) => setData((p) => ({ ...p, promotion_details: e.target.value }))}
                placeholder="e.g. 20% off your first facial this month"
                rows={3}
                className="input-glamlink resize-y"
              />
            </label>
          )}
        </>
      )}
    </section>
  );
}
