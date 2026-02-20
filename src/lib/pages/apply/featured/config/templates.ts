import { ComponentType } from "react";

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: 'featured-cover' | 'rising-star';
  component: ComponentType<any> | null;
  isAvailable: boolean;
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
}

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    id: 'featured-cover',
    name: 'Featured Cover',
    description: 'Showcase your profile as a featured cover story'
  },
  {
    id: 'rising-star',
    name: 'Rising Star',
    description: 'Highlight your journey as an emerging beauty professional'
  }
];

// Import template components (lazy loading to avoid circular dependencies)
let CoverFeatureDefault: ComponentType<any> | null = null;
let RisingStarDefault: ComponentType<any> | null = null;

// Dynamic import function
const loadTemplateComponents = async () => {
  if (!CoverFeatureDefault) {
    const module = await import('../templates/CoverFeatureDefault');
    CoverFeatureDefault = module.default;
  }
  if (!RisingStarDefault) {
    const module = await import('../templates/RisingStarDefault');
    RisingStarDefault = module.default;
  }
  return { CoverFeatureDefault, RisingStarDefault };
};

export const TEMPLATES: TemplateConfig[] = [
  // Featured Cover Templates
  {
    id: 'cover-feature-default',
    name: 'Default',
    description: 'Standard featured cover layout with balanced content presentation',
    category: 'featured-cover',
    component: null, // Will be set dynamically
    isAvailable: true
  },
  {
    id: 'cover-feature-modern',
    name: 'Modern',
    description: 'Contemporary design with emphasis on imagery and bold typography',
    category: 'featured-cover',
    component: null,
    isAvailable: false
  },
  {
    id: 'cover-feature-elegant',
    name: 'Elegant',
    description: 'Sophisticated layout with refined typography and spacing',
    category: 'featured-cover',
    component: null,
    isAvailable: false
  },
  {
    id: 'cover-feature-bold',
    name: 'Bold Impact',
    description: 'Eye-catching design with strong visual elements',
    category: 'featured-cover',
    component: null,
    isAvailable: false
  },

  // Rising Star Templates
  {
    id: 'rising-star-default',
    name: 'Default',
    description: 'Classic rising star presentation with focus on journey and achievements',
    category: 'rising-star',
    component: null, // Will be set dynamically
    isAvailable: true
  },
  {
    id: 'rising-star-spotlight',
    name: 'Spotlight',
    description: 'Enhanced focus on professional achievements and expertise',
    category: 'rising-star',
    component: null,
    isAvailable: false
  },
  {
    id: 'rising-star-minimal',
    name: 'Minimal',
    description: 'Clean, minimalist design focusing on essential information',
    category: 'rising-star',
    component: null,
    isAvailable: false
  },
  {
    id: 'rising-star-story',
    name: 'Story-Driven',
    description: 'Narrative-focused layout emphasizing your professional journey',
    category: 'rising-star',
    component: null,
    isAvailable: false
  }
];

// Initialize template components
export const initializeTemplates = async (): Promise<void> => {
  const { CoverFeatureDefault: DefaultCover, RisingStarDefault: DefaultStar } = await loadTemplateComponents();

  // Update the template configurations with actual components
  TEMPLATES.forEach(template => {
    if (template.id === 'cover-feature-default') {
      template.component = DefaultCover;
    } else if (template.id === 'rising-star-default') {
      template.component = DefaultStar;
    }
  });
};

// Helper functions for template management
export const getTemplatesByCategory = (category: 'featured-cover' | 'rising-star'): TemplateConfig[] => {
  return TEMPLATES.filter(template => template.category === category);
};

export const getTemplateById = (id: string): TemplateConfig | undefined => {
  return TEMPLATES.find(template => template.id === id);
};

export const getDefaultTemplate = (category: 'featured-cover' | 'rising-star'): TemplateConfig | undefined => {
  return TEMPLATES.find(template =>
    template.category === category &&
    template.isAvailable &&
    template.id.includes('default')
  );
};

export const getAvailableTemplates = (category: 'featured-cover' | 'rising-star'): TemplateConfig[] => {
  return TEMPLATES.filter(template =>
    template.category === category &&
    template.isAvailable
  );
};