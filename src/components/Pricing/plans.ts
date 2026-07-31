export type PlanId = "free" | "freeKeychain" | "pro" | "proKeychain";
export type ProFeature = string | { text: string; soon: true };

export const PRO_PRICE = 4.99;
export const KEYCHAIN_PRICE = 39.99;

export const FREE_FEATURES: string[] = [
  "Directory listing",
  "Digital card & QR code",
  "1 featured video",
  "Up to 4 photos",
  "Contact info & bio",
  "Specialties & booking link",
  "Social links, hours & location",
];

export const PRO_FEATURES: ProFeature[] = [
  "Swap your featured video anytime",
  "Refresh your photos anytime",
  "Run special offers",
  { text: "Performance analytics", soon: true },
  { text: "Priority placement in search", soon: true },
];

export const KEYCHAIN_FEATURE = "NFC keychain — tap to share your profile";

export interface PlanDef {
  id: PlanId;
  name: string;
  hasKeychain: boolean;
  isPro: boolean;
  priceLabel: string;
  priceSuffix?: string;
  tagline: string;
}

export const PLANS: PlanDef[] = [
  {
    id: "free",
    name: "Free access",
    hasKeychain: false,
    isPro: false,
    priceLabel: "$0",
    tagline: "Get listed, no cost.",
  },
  {
    id: "freeKeychain",
    name: "Free + keychain",
    hasKeychain: true,
    isPro: false,
    priceLabel: `$${KEYCHAIN_PRICE.toFixed(2)}`,
    priceSuffix: "one-time",
    tagline: "Free listing, plus a tap-to-share NFC keychain.",
  },
  {
    id: "pro",
    name: "Access Pro",
    hasKeychain: false,
    isPro: true,
    priceLabel: `$${PRO_PRICE.toFixed(2)}`,
    priceSuffix: "/ month",
    tagline: "Everything in Free, plus ongoing control.",
  },
  {
    id: "proKeychain",
    name: "Pro + keychain",
    hasKeychain: true,
    isPro: true,
    priceLabel: `$${PRO_PRICE.toFixed(2)}`,
    priceSuffix: `/ month + $${KEYCHAIN_PRICE.toFixed(2)} one-time`,
    tagline: "Full Pro plan with the NFC keychain included.",
  },
];