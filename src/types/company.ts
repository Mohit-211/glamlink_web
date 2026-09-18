/**
 * Company / Brand directory entity.
 *
 * There is no backend Company entity yet (see src/lib/companies.ts for the
 * seed-data note) — this type is the target shape a future
 * `GET company` / `GET company/:id` API should return, modeled after how
 * `Topic` (src/lib/topics.ts) already shapes journal-related data.
 */

export type CompanyCategory =
  | "brand"
  | "software"
  | "manufacturer"
  | "other";

export const COMPANY_CATEGORY_LABELS: Record<CompanyCategory, string> = {
  brand: "Brand",
  software: "Software Company",
  manufacturer: "Manufacturer",
  other: "Other Business",
};

export interface CompanySocialLinks {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  youtube?: string;
  x?: string;
  tiktok?: string;
}

export interface CompanyOtherLink {
  label: string;
  url: string;
}

export interface CompanyLinks {
  website?: string;
  education?: string;
  booking?: string;
  directoryProfile?: string;
  other?: CompanyOtherLink[];
}

export interface Company {
  id: string;
  name: string;
  category: CompanyCategory;
  /** Human-readable subtitle, e.g. "Professional Skincare Brand" — falls back to COMPANY_CATEGORY_LABELS[category] when absent. */
  categoryLabel?: string;
  logo?: string;
  description?: string;
  about?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  website?: string;
  phone?: string;
  email?: string;
  social?: CompanySocialLinks;
  links?: CompanyLinks;
  /**
   * Real journal article ids this company is tagged/associated with.
   * Related Articles are always fetched live via getBlogsById so the
   * profile page never shows stale/static copies of article content.
   */
  relatedJournalIds?: number[];
}
