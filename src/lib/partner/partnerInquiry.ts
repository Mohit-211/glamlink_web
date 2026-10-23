import { partnershipInquiry } from "@/api/Api";

/* ────────────────────────────────────────────────
   Partnership inquiry — API service
   Kept separate from the UI so the transport can change without
   touching the form. Posts to the dedicated `partnership-inquiry`
   endpoint.
───────────────────────────────────────────────── */

export const PARTNER_INTEREST_OPTIONS = [
  "Podcast",
  "Journal / Editorial / Expert Takes",
  "Brand Partnership",
  "Advertising",
  "Education / Training",
  "Events",
  "Other",
] as const;

export type PartnerInterest = (typeof PARTNER_INTEREST_OPTIONS)[number];

export interface PartnerInquiry {
  name: string;
  company: string;
  email: string;
  website?: string;
  interests: PartnerInterest[];
  message: string;
}

export async function submitPartnerInquiry(inquiry: PartnerInquiry) {
  const data = await partnershipInquiry({
    name: inquiry.name.trim(),
    company_brand: inquiry.company.trim(),
    email: inquiry.email.trim(),
    website_instagram: inquiry.website?.trim() || "",
    interested_in: inquiry.interests,
    message: inquiry.message.trim(),
  });

  // The API can report failure in a 200 response body.
  if (data && typeof data === "object" && data.success === false) {
    throw new Error(data.message || "Submission failed");
  }

  return data;
}
