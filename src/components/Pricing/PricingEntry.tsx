"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getMyBusinessCardForDashboard } from "@/api/Api";
import { readApiError } from "@/lib/apiError";
import { loginHref } from "@/lib/auth";
import { useSession } from "@/lib/useSession";
import PricingStep from "./Pricing1";
import { Centered } from "./ui";

/** A card id the purchase calls accept: a positive whole number (not "undefined", not empty). */
const validCardId = (id: string | null) => (id && /^\d+$/.test(id) && Number(id) > 0 ? id : null);

/**
 * /pricing: the plans for one card, `?businessCardId=`. Without a valid id a
 * signed-in owner goes on with their own card (or to /access to make one); a
 * visitor is asked to make their card first.
 */
export default function PricingEntry() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const session = useSession();
  const cardId = validCardId(searchParams.get("businessCardId"));
  const claim = searchParams.get("claim") === "1";
  const plan = searchParams.get("plan");
  // The owner's card couldn't be looked up (offline, a server error).
  const [lookupFailed, setLookupFailed] = useState(false);

  useEffect(() => {
    if (cardId || session.status !== "signed-in") return;
    let active = true;
    getMyBusinessCardForDashboard()
      .then((res) => {
        if (!active) return;
        const data = res?.data ?? res;
        const card = Array.isArray(data) ? data[0] : data;
        if (card?.id) {
          router.replace(`/pricing?businessCardId=${card.id}${plan ? `&plan=${encodeURIComponent(plan)}` : ""}`);
        } else {
          router.replace("/access#create-profile");
        }
      })
      .catch((error) => {
        if (!active) return;
        // 404: no card yet.
        if (readApiError(error).status === 404) router.replace("/access#create-profile");
        else setLookupFailed(true);
      });
    return () => {
      active = false;
    };
  }, [cardId, session.status, plan, router]);

  if (cardId) {
    return (
      <PricingStep
        // A claim, or another card, starts the purchase afresh.
        key={`${cardId}:${claim ? "claim" : "buy"}`}
        businessCardId={cardId}
        claim={claim}
        initialPlan={plan}
        returnCheckout={searchParams.get("checkout")}
        redirectStatus={searchParams.get("redirect_status")}
        returnSecret={searchParams.get("payment_intent_client_secret")}
      />
    );
  }

  if (session.status === "signed-out" || lookupFailed) {
    return (
      <Centered>
        <h1 className="text-xl">Start with your Access card</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {lookupFailed
            ? "We couldn't open your card just now. Your dashboard shows your card and plan."
            : "Plans are chosen for a card. Create yours first, or sign in to continue with the card you have."}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {lookupFailed ? (
            <Link href="/dashboard?tab=subscription-plans" className="btn-primary flex-1">
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link href="/access#create-profile" className="btn-primary flex-1">
                Create your card
              </Link>
              <Link href={loginHref("/pricing")} className="btn-outline flex-1">
                Sign in
              </Link>
            </>
          )}
        </div>
      </Centered>
    );
  }

  return (
    <Centered>
      <Loader2 className="mx-auto h-7 w-7 animate-spin text-primary" />
    </Centered>
  );
}
