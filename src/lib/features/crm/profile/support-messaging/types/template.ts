/**
 * Type definitions for Message Templates feature
 */

/**
 * Category of a message template
 */
export type TemplateCategory = 'greeting' | 'solution' | 'followup' | 'closure' | 'custom';

/**
 * A saved message template that admins can quickly insert
 */
export interface MessageTemplate {
  /** Unique identifier */
  id: string;
  /** Display name for the template */
  name: string;
  /** The message content */
  content: string;
  /** Category for organization */
  category: TemplateCategory;
  /** User ID who created the template */
  createdBy: string;
  /** When the template was created */
  createdAt: Date;
  /** When the template was last updated */
  updatedAt: Date;
  /** Number of times this template has been used */
  usageCount: number;
}

/**
 * Input for creating a new template
 */
export interface CreateTemplateInput {
  name: string;
  content: string;
  category: TemplateCategory;
}

/**
 * Input for updating an existing template
 */
export interface UpdateTemplateInput {
  name?: string;
  content?: string;
  category?: TemplateCategory;
}

/**
 * Category labels for display
 */
export const TEMPLATE_CATEGORY_LABELS: Record<TemplateCategory, { label: string; icon: string }> = {
  greeting: { label: 'Greetings', icon: '👋' },
  solution: { label: 'Solutions', icon: '💡' },
  followup: { label: 'Follow-ups', icon: '📝' },
  closure: { label: 'Closures', icon: '✅' },
  custom: { label: 'Custom', icon: '📌' },
};
