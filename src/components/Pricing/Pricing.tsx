"use client";

import { useState, type ReactNode } from "react";
import { Check, Sparkles, ArrowRight, Info, Nfc } from "lucide-react";

/* ──────────────────────────────────────────────
   Built on Glamlink's own theme tokens (globals.css):
     bg-primary / text-primary            → brand teal
     bg-accent  / text-accent-foreground  → light teal tint (Pro wash)
     bg-card, border-border, text-foreground, text-muted-foreground
     .card-glamlink / .badge-soft / .btn-primary / .page-soft / .font-display
     .shadow-soft / .shadow-medium / .shadow-primary (component classes)

   Product model: 4 plans = 2 tiers (Free / Pro) × Keychain add-on (on/off).
   Rather than 4 flat cards (which repeats the whole feature list twice),
   the Keychain is a toggle inside each tier card — same 4 outcomes,
   less to scan, and it reads correctly once more add-ons exist later.
─────────────────────────────────────────────── */

type PlanId = "free" | "pro";
type ProFeature = string | { text: string; soon: true };

const PRO_PRICE = 4.99;
const KEYCHAIN_PRICE = 39.99;

const FREE_FEATURES: string[] = [
  "Directory listing",
  "Digital card & QR code",
  "1 featured video",
  "Up to 4 photos",
  "Contact info & bio",
  "Specialties & booking link",
  "Social links, hours & location",
];

const PRO_FEATURES: ProFeature[] = [
  "Swap your featured video anytime",
  "Refresh your photos anytime",
  "Run special offers",
  { text: "Performance analytics", soon: true },
  { text: "Priority placement in search", soon: true },
];

interface FeatureRowProps {
  children: ReactNode;
  soon?: boolean;
}

function FeatureRow({ children, soon = false }: FeatureRowProps) {
  return (
    <li className="flex items-start gap-3 py-1.5">
      <span
        className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full ${
          soon ? "bg-muted" : "bg-primary/10"
        }`}
      >
        <Check
          className={`h-3.5 w-3.5 ${soon ? "text-muted-foreground" : "text-primary"}`}
          strokeWidth={3}
        />
      </span>
      <span className={`text-[15px] leading-6 ${soon ? "text-muted-foreground" : "text-foreground"}`}>
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

interface KeychainToggleProps {
  checked: boolean;
  onChange: () => void;
}

/** NFC keychain add-on — tap to share your profile, no app needed. */
function KeychainToggle({ checked, onChange }: KeychainToggleProps) {
  return (
    <div
      className={`relative mt-6 flex items-center gap-3 rounded-xl border p-3.5 transition-colors duration-200 ${
        checked ? "border-primary bg-primary/5" : "border-border bg-secondary/40"
      }`}
    >
      <span
        className={`flex h-9 w-9 flex-none items-center justify-center rounded-full transition-colors duration-200 ${
          checked ? "bg-primary/15" : "bg-muted"
        }`}
      >
        <Nfc
          className={`h-4.5 w-4.5 transition-transform duration-200 ${
            checked ? "text-primary scale-110" : "text-muted-foreground scale-100"
          }`}
        />
      </span>

      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">Add NFC keychain</p>
        <p className="text-xs text-muted-foreground">Tap to share your profile — one-time, ships to you.</p>
      </div>

      <div className="flex flex-none flex-col items-end gap-1.5">
        <span
          className={`flex items-center gap-1 text-xs font-semibold ${
            checked ? "text-primary" : "text-foreground"
          }`}
        >
          {checked && <Check className="h-3 w-3" strokeWidth={3} />}
          +${KEYCHAIN_PRICE.toFixed(2)}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label="Add NFC keychain"
          onClick={(e) => {
            e.stopPropagation();
            onChange();
          }}
          className={`relative h-5 w-9 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1 ${
            checked ? "bg-primary" : "bg-border"
          }`}
        >
          <span
            className={`absolute top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow transition-transform duration-200 ${
              checked ? "translate-x-4" : "translate-x-0.5"
            }`}
          >
            <Nfc
              className={`h-2.5 w-2.5 transition-opacity duration-150 ${
                checked ? "text-primary opacity-100" : "opacity-0"
              }`}
            />
          </span>
        </button>
      </div>
    </div>
  );
}

interface PlanRadioProps {
  selected: boolean;
}

function PlanRadio({ selected }: PlanRadioProps) {
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

export default function PricingStep() {
  const [selected, setSelected] = useState<PlanId>("pro");
  const [freeKeychain, setFreeKeychain] = useState(false);
  const [proKeychain, setProKeychain] = useState(false);
  const [pauseSheen, setPauseSheen] = useState(false);

  const planLabel = selected === "pro" ? "Access Pro" : "Free Access";
  const keychainOn = selected === "pro" ? proKeychain : freeKeychain;

  const totalLabel =
    selected === "pro"
      ? `$${PRO_PRICE.toFixed(2)}/mo${proKeychain ? ` + $${KEYCHAIN_PRICE.toFixed(2)} one-time` : ""}`
      : freeKeychain
        ? `$${KEYCHAIN_PRICE.toFixed(2)} one-time`
        : "Free";

  const bumpSheen = () => {
    setPauseSheen(true);
    window.setTimeout(() => setPauseSheen(false), 300);
  };

  return (
    <div className="page-soft min-h-screen w-full px-4 py-14">
      <style>{`
        @keyframes sheen {
          0% { transform: translateX(-120%) rotate(8deg); }
          100% { transform: translateX(220%) rotate(8deg); }
        }
        .sheen-sweep { animation: sheen 5s ease-in-out infinite; animation-delay: 1s; }
        .sheen-sweep.paused { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .sheen-sweep { animation: none; }
        }
      `}</style>

      <div className="mx-auto w-full max-w-3xl mt-10">
        {/* ── Step header ───────────────────────── */}
        <div className="mb-10 flex items-start gap-4">
    
          <div>
            
            <h1 className="font-display mt-1 text-[26px] leading-tight text-foreground sm:text-[30px]">
              Choose your plan
            </h1>
            <p className="section-subtitle mt-2 max-w-md text-[15px] leading-6">
              Choose the plan that best fits your business. You can upgrade anytime.
            </p>
          </div>
        </div>

        {/* ── Plans ───────────────────────── */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Free */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setSelected("free")}
            onKeyDown={(e) => e.key === "Enter" && setSelected("free")}
            className={`card-glamlink cursor-pointer text-left ${
              selected === "free" ? "shadow-medium border-primary" : "border-border"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Free access</h3>
              <PlanRadio selected={selected === "free"} />
            </div>

            <p className="mt-3 flex items-baseline gap-1.5">
              <span className="font-display text-3xl text-foreground">
                {freeKeychain ? `$${KEYCHAIN_PRICE.toFixed(2)}` : "$0"}
              </span>
              {freeKeychain && <span className="text-sm text-muted-foreground">one-time</span>}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Everything you need to get listed.
            </p>

            <ul className="mt-6 border-t border-border pt-5">
              {FREE_FEATURES.map((f) => (
                <FeatureRow key={f}>{f}</FeatureRow>
              ))}
              {freeKeychain && <FeatureRow>NFC keychain included</FeatureRow>}
            </ul>

            <KeychainToggle
              checked={freeKeychain}
              onChange={() => {
                setFreeKeychain((v) => !v);
                bumpSheen();
              }}
            />
          </div>

          {/* Pro */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setSelected("pro")}
            onKeyDown={(e) => e.key === "Enter" && setSelected("pro")}
            className={`card-glamlink relative cursor-pointer overflow-hidden text-left ${
              selected === "pro" ? "shadow-primary border-primary bg-accent/40" : "border-border"
            }`}
          >
            {/* signature: soft sheen sweep in the brand teal, like light catching a polished surface */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div
                className={`sheen-sweep absolute -top-1/2 h-[220%] w-1/3 ${pauseSheen ? "paused" : ""}`}
                style={{
                  background:
                    "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.10), transparent)",
                }}
              />
            </div>

            <div className="relative flex items-center justify-between">
              <span className="badge-soft">
                <Sparkles className="h-3 w-3" /> Most popular
              </span>
              <PlanRadio selected={selected === "pro"} />
            </div>

            <h3 className="relative mt-4 text-lg font-semibold text-foreground">Access Pro</h3>
            <p className="relative mt-3 flex items-baseline gap-1.5">
              <span className="font-display text-3xl text-foreground">${PRO_PRICE.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground">/ month</span>
              {proKeychain && (
                <span className="text-sm text-muted-foreground">
                  &nbsp;+ ${KEYCHAIN_PRICE.toFixed(2)} one-time
                </span>
              )}
            </p>
            <p className="relative mt-1 text-sm font-medium text-primary">
              Everything in Free, plus:
            </p>

            <ul className="relative mt-5 border-t border-border pt-5">
              {PRO_FEATURES.map((f, i) =>
                typeof f === "string" ? (
                  <FeatureRow key={i}>{f}</FeatureRow>
                ) : (
                  <FeatureRow key={i} soon>
                    {f.text}
                  </FeatureRow>
                )
              )}
              {proKeychain && <FeatureRow>NFC keychain included</FeatureRow>}
            </ul>

            <div className="relative">
              <KeychainToggle
                checked={proKeychain}
                onChange={() => {
                  setProKeychain((v) => !v);
                  bumpSheen();
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Continue ───────────────────────── */}
        <div className="mt-9 flex flex-col items-center gap-3">
          <button type="button" className="btn-primary w-full max-w-xs flex-col gap-0.5 py-3 sm:w-auto">
            <span className="flex items-center gap-2">
              Continue with {planLabel}
              {keychainOn ? " + keychain" : ""}
              <ArrowRight className="h-4 w-4" />
            </span>
            <span className="text-xs font-normal text-primary-foreground/80">{totalLabel}</span>
          </button>

          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5" />
            You can upgrade, downgrade, or add a keychain anytime from your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}