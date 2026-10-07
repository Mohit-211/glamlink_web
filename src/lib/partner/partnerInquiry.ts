import { contactUs } from "@/api/Api";

/* ────────────────────────────────────────────────
   Partnership inquiry — API service
   Kept separate from the UI so the transport can change without
   touching the form. Today it reuses the existing Contact Us endpoint
   (already stored in the admin); swap `submitPartnerInquiry` to a
   dedicated endpoint when one exists.
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

export const PARTNER_INQUIRY_SUBJECT = "Partnership Inquiry";

/** Formats the inquiry into the Contact Us message body so the team sees every field. */
function buildMessage(inquiry: PartnerInquiry) {
  return [
    `Source: Partner With Glamlink page (/partner)`,
    `Company / Brand: ${inquiry.company}`,
    `Website or Instagram: ${inquiry.website || "—"}`,
    `Interested in: ${inquiry.interests.length ? inquiry.interests.join(", ") : "—"}`,
    "",
    inquiry.message,
  ].join("\n");
}

export async function submitPartnerInquiry(inquiry: PartnerInquiry) {
  const data = await contactUs({
    name: inquiry.name.trim(),
    email: inquiry.email.trim(),
    mobile: "",
    subject: `${PARTNER_INQUIRY_SUBJECT} – ${inquiry.company.trim()}`,
    message: buildMessage(inquiry),
  });

  // The API can report failure in a 200 response body.
  if (data && typeof data === "object" && data.success === false) {
    throw new Error(data.message || "Submission failed");
  }

  return data;
}
