/**
 * Preview Section Configuration Types
 *
 * Types for the styled digital card preview system (non-condensed).
 * Used by SectionRenderer and preview components.
 */

import { Professional } from "@/lib/pages/for-professionals/types/professional";

export interface SectionConfig {
  id: string;
  label: string;
  component?: React.ComponentType<any>; // Optional if nested
  break?: 'sm' | 'md' | 'lg' | 'xl'; // Responsive breakpoint for nested sections
  props?: Record<string, any>;        // Component-specific props
  condition?: (p: Professional) => boolean; // Show/hide logic
  containerClassName?: string;        // Additional styling
  nested?: SectionConfig[];           // For same-row rendering
  span?: number; // Column span when nested (1-12)
}

export type SectionConfigItem = SectionConfig | SectionConfig[];

export interface SectionProps {
  professional: Professional;
  [key: string]: any;
}
