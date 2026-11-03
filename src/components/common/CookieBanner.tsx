"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  getConsent,
  onCookieSettings,
  setConsent,
  subscribeConsent,
  type Consent,
  type CookieSettingsReason,
} from "@/lib/consent";
import { clearSaved } from "@/lib/savedProducts";

/** On the server, and while hydrating, the choice is unknown: the banner waits for the browser. */
const UNKNOWN = "unknown" as const;
const unknownOnServer = () => UNKNOWN;

/**
 * The cookie banner (the owner, Nov 3): Accept all or Reject, nothing else. It shows until the visitor picks, and
 * again from the footer's Cookie settings or when they try to save a product without having accepted.
 */
export default function CookieBanner() {
  const consent = useSyncExternalStore<Consent | null | typeof UNKNOWN>(subscribeConsent, getConsent, unknownOnServer);
  const [reopened, setReopened] = useState<CookieSettingsReason | null>(null);
  const acceptRef = useRef<HTMLButtonElement>(null);

  useEffect(() => onCookieSettings(setReopened), []);

  // Opened on purpose (Cookie settings, a Save): the choice gets the focus; on arrival it doesn't take it
  useEffect(() => {
    if (reopened) acceptRef.current?.focus();
  }, [reopened]);

  if (!reopened && consent !== null) return null;

  const choose = (choice: Consent) => {
    if (choice === "necessary") clearSaved();
    setConsent(choice);
    setReopened(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-text"
      className="animate-banner-in fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-large sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <div className="min-w-0 flex-1">
          <h2 id="cookie-banner-title" className="text-base">
            Cookies on Glamlink
          </h2>
          {reopened === "save" && (
            <p className="mt-1 text-sm font-medium text-secondary">Saving products uses a cookie. Accept to save it.</p>
          )}
          <p id="cookie-banner-text" className="mt-1 text-sm text-muted-foreground">
            We use the cookies the site needs to work. With your OK, we also use them to remember the products you
            save, measure visits and personalize ads.{" "}
            <Link href="/privacy" className="link-glamlink">
              Privacy Policy
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <button type="button" onClick={() => choose("necessary")} className="btn-outline flex-1 py-2.5 sm:flex-none">
            Reject
          </button>
          <button ref={acceptRef} type="button" onClick={() => choose("all")} className="btn-primary flex-1 py-2.5 sm:flex-none">
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
