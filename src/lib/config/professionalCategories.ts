/**
 * Professional Categories Configuration
 *
 * Predefined category groups that map to professional specialties.
 * Used for:
 * - Home page Pro Discovery Map filtering
 * - Primary Specialty dropdown in forms
 * - Category-based search and filtering
 */

export interface ProfessionalCategory {
  id: string;
  label: string;
  /** Specialties that fall under this category (case-insensitive matching) */
  specialties: string[];
  /** Optional icon name for display */
  icon?: string;
}

/**
 * Predefined professional categories
 * - 'all' shows all professionals (no filtering)
 * - Other categories filter by matching specialties
 */
export const PROFESSIONAL_CATEGORIES: readonly ProfessionalCategory[] = [
  {
    id: 'all',
    label: 'All Pros',
    specialties: [],
    icon: 'Users',
  },
  {
    id: 'nails',
    label: 'Nails',
    specialties: [
      'Nail Art & Design',
      'Nail Services',
      'Manicure',
      'Pedicure',
      'Gel Nails',
      'Acrylic Nails',
      'Nail Technician',
    ],
    icon: 'Sparkles',
  },
  {
    id: 'hair',
    label: 'Hair',
    specialties: [
      'Hair Expert',
      'Hair Styling',
      'Hair Stylist',
      'Colorist',
      'Balayage',
      'Hair Extensions',
      'Keratin Treatments',
      'Braiding',
    ],
    icon: 'Scissors',
  },
  {
    id: 'wellness',
    label: 'Wellness + Med Spa',
    specialties: [
      'Medical Aesthetics',
      'Injectables',
      'Body Reshaping',
      'Esthetician',
      'Advanced Esthetician',
      'Jet Plasma',
      'Laser Treatments',
      'Body Contouring',
      'Wellness',
      'Med Spa',
    ],
    icon: 'Heart',
  },
  {
    id: 'skincare',
    label: 'Skincare',
    specialties: [
      'Skincare Specialist',
      'Skincare Expert',
      'Acne Treatment',
      'Acne/Acne Scars Specialist',
      'Sun Spot Specialist',
      'Facials',
      'Chemical Peels',
      'Microneedling',
    ],
    icon: 'Droplet',
  },
  {
    id: 'makeup',
    label: 'Makeup',
    specialties: [
      'Makeup & Beauty',
      'Makeup Artist',
      'Beauty Expert',
      'Bridal Makeup',
      'Special Effects Makeup',
      'Permanent Makeup',
      'Microblading',
    ],
    icon: 'Palette',
  },
  {
    id: 'waxing',
    label: 'Waxing & Hair Removal',
    specialties: [
      'Waxing Specialist',
      'Waxing',
      'Hair Removal',
      'Laser Hair Removal',
      'Sugaring',
      'Threading',
    ],
    icon: 'Zap',
  },
] as const;

/**
 * Type for category IDs
 */
export type CategoryId = (typeof PROFESSIONAL_CATEGORIES)[number]['id'];

/**
 * Get category by ID
 */
export function getCategoryById(id: string): ProfessionalCategory | undefined {
  return PROFESSIONAL_CATEGORIES.find((cat) => cat.id === id);
}

/**
 * Get all category options for dropdowns (excludes 'all')
 */
export function getCategoryOptions(): { value: string; label: string }[] {
  return PROFESSIONAL_CATEGORIES.filter((cat) => cat.id !== 'all').map((cat) => ({
    value: cat.id,
    label: cat.label,
  }));
}

/**
 * Get all specialty options (flat list of all specialties from all categories)
 */
export function getAllSpecialtyOptions(): string[] {
  const allSpecialties = PROFESSIONAL_CATEGORIES.flatMap((cat) => cat.specialties);
  return [...new Set(allSpecialties)].sort();
}

/**
 * Find category that contains a specialty
 */
export function findCategoryBySpecialty(specialty: string): ProfessionalCategory | undefined {
  const normalizedSpecialty = specialty.toLowerCase();
  return PROFESSIONAL_CATEGORIES.find(
    (cat) =>
      cat.id !== 'all' &&
      cat.specialties.some((s) => s.toLowerCase().includes(normalizedSpecialty) || normalizedSpecialty.includes(s.toLowerCase()))
  );
}

/**
 * Check if a professional matches a category
 * @param professional - Professional object with specialty/specialties fields
 * @param categoryId - Category ID to check against
 */
export function professionalMatchesCategory(
  professional: { specialty?: string; specialties?: string[] },
  categoryId: string
): boolean {
  // 'all' matches everything
  if (categoryId === 'all') return true;

  const category = getCategoryById(categoryId);
  if (!category) return false;

  // Check primary specialty
  if (professional.specialty) {
    const matches = category.specialties.some(
      (s) =>
        professional.specialty!.toLowerCase().includes(s.toLowerCase()) ||
        s.toLowerCase().includes(professional.specialty!.toLowerCase())
    );
    if (matches) return true;
  }

  // Check specialties array
  if (professional.specialties?.length) {
    return professional.specialties.some((ps) =>
      category.specialties.some(
        (s) => ps.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(ps.toLowerCase())
      )
    );
  }

  return false;
}
