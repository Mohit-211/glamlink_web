/* ────────────────────────────────────────────────
   Glamlink Directory — shared types
   These shapes are provider-agnostic: the mock provider and a future
   Google Places provider both map their data into them, so the UI
   never needs to change when the data source does.
───────────────────────────────────────────────── */

export type ProfessionalTypeId = "esthetician" | "med-spa" | "hair-stylist";

export interface ProfessionalType {
  id: ProfessionalTypeId;
  /** Singular label shown in the dropdown and on cards. */
  label: string;
  /** Short helper text shown under the label in the type picker. */
  description: string;
  /** Plural label used in result headings, e.g. "Estheticians near Miami, FL". */
  pluralLabel: string;
  /** Free-text keyword to send to Google Places Text Search. */
  googleKeyword: string;
  /** Optional Google Places (New) `includedType` to narrow results. */
  googleIncludedType?: string;
}

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface DirectoryLocation {
  /** Human-readable label, e.g. "Miami, FL" or "Florida". */
  label: string;
  city?: string;
  state?: string;
  zip?: string;
  coordinates?: GeoCoordinates;
}

export interface DirectorySearchParams {
  /** `null` searches across every professional type. */
  professionalType: ProfessionalTypeId | null;
  /** Raw user input: "City, State", a state, or a ZIP. */
  location: string;
}

/** A business listing sourced from Google (or the mock stand-in). */
export interface DirectoryBusiness {
  /** Google `place_id` once connected to Places. */
  id: string;
  name: string;
  professionalType: ProfessionalTypeId;
  city: string;
  state: string;
  neighborhood?: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  /** Business website, when Google has one. */
  websiteUrl?: string;
  /** Google Maps listing URL — used when there is no website. */
  mapsUrl: string;
  source: "google";
  isClaimed: boolean;
}

export interface DirectorySearchResult {
  businesses: DirectoryBusiness[];
  /** `null` when the location could not be resolved. */
  location: DirectoryLocation | null;
}

export type FeatureSource = "Editorial" | "The Beauty Vault" | "Expert Takes";

/** A manually curated Glamlink profile (not Google-sourced). */
export interface FeaturedProfile {
  id: string;
  name: string;
  title: string;
  city: string;
  state: string;
  imageUrl: string;
  featuredIn: FeatureSource;
  href?: string;
}

/**
 * Contract every directory data source implements.
 * Swap the mock for a Google Places-backed implementation in
 * `src/lib/directory/index.ts` without touching any component.
 */
export interface DirectoryProvider {
  searchBusinesses(params: DirectorySearchParams): Promise<DirectorySearchResult>;
  getPopularBusinesses(): Promise<DirectoryBusiness[]>;
  getFeaturedProfiles(): Promise<FeaturedProfile[]>;
  reverseGeocode(coords: GeoCoordinates): Promise<DirectoryLocation | null>;
}
