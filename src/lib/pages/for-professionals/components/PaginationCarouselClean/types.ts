export interface FoundingPro {
  id: string;
  name: string;
  title: string;
  specialty: string;
  location: string;
  instagram?: string;
  image?: string;
  isFounder?: boolean;
  certificationLevel: "Bronze" | "Silver" | "Gold" | "Platinum";
  yearsExperience: number;
}

export interface PaginationCarouselCleanProps {
  cardsPerPage?: number; // Number of cards to show per page (default: 5)
  title?: string; // Optional title for the header section
  subtitle?: string; // Optional subtitle for the header section
}

export type SortBy = "none" | "name" | "location" | "rating" | "experience";
export type SortDirection = "asc" | "desc";

// Hook interface re-exports for convenience
export type { UseAPIReturn } from "./hooks/useAPI";
export type { UseFilteringReturn } from "./hooks/useFiltering";
export type { UseNavigationReturn } from "./hooks/useNavigation";