// ============================================
// PROFESSIONAL PREVIEW COMPONENTS CONFIGURATION
// ============================================

import type { Professional } from '@/lib/pages/for-professionals/types/professional';
import { CardPreview, StyledDigitalCardPreview } from '@/lib/features/digital-cards/preview';
import { CondensedCardPreview } from '@/lib/features/digital-cards/components/condensed';

/**
 * Props interface for all professional preview components
 */
export interface ProfessionalPreviewComponentProps {
  professional: Partial<Professional>;
  /** Callback to notify parent when professional data is updated (e.g., default image saved) */
  onProfessionalUpdate?: (updatedProfessional: Partial<Professional>) => void;
}

/**
 * Configuration for a single professional preview component
 */
export interface ProfessionalPreviewComponent {
  id: string;
  label: string;
  component: React.ComponentType<ProfessionalPreviewComponentProps>;
}

/**
 * List of available preview components for professionals
 * Used to populate the preview dropdown in the Default and Preview tabs
 *
 * To add a new preview:
 * 1. Create the preview component in /components/preview/professionals/
 * 2. Import it here
 * 3. Add to this array with unique id and label
 */
export const professionalPreviewComponents: ProfessionalPreviewComponent[] = [
  { id: 'card', label: 'Professional Card', component: CardPreview },
  { id: 'digital-card', label: 'Access Card Page', component: StyledDigitalCardPreview },
  { id: 'condensed-card', label: 'Access Card Image', component: CondensedCardPreview },
];
