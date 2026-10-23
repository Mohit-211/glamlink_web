import type { ProfessionalType, ProfessionalTypeId } from "./types";

/**
 * Professional types offered in the directory search.
 * Add a new category by appending an entry here (and its id to
 * `ProfessionalTypeId`) — the dropdown and headings pick it up automatically.
 */
export const PROFESSIONAL_TYPES: ProfessionalType[] = [
  {
    id: "esthetician",
    label: "Esthetician",
    pluralLabel: "Estheticians",
    description: "Facials, peels & skin care",
    googleKeyword: "esthetician",
    googleIncludedType: "skin_care_clinic",
  },
  {
    id: "med-spa",
    label: "Med Spa",
    pluralLabel: "Med Spas",
    description: "Injectables, lasers & aesthetics",
    googleKeyword: "med spa",
    googleIncludedType: "spa",
  },
  {
    id: "hair-stylist",
    label: "Hair Stylist",
    pluralLabel: "Hair Stylists",
    description: "Cuts, color & styling",
    googleKeyword: "hair stylist",
    googleIncludedType: "hair_salon",
  },
];

export function getProfessionalType(id: string | null | undefined) {
  return PROFESSIONAL_TYPES.find((type) => type.id === id) ?? null;
}

export function isProfessionalTypeId(value: unknown): value is ProfessionalTypeId {
  return PROFESSIONAL_TYPES.some((type) => type.id === value);
}
