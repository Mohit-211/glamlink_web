// Magazine section mappings for AI-CMS package
import { 
  SECTION_FIELD_MAPPINGS,
  SECTION_PROMPT_TEMPLATES,
  AI_MODELS,
  getRecommendedModel
} from '@/lib/pages/magazine/config/ai-cms';

export interface MagazineSectionConfig {
  sectionType: string;
  fieldMappings: any;
  promptTemplate: any;
  defaultModel: string;
  complexity: 'low' | 'medium' | 'high';
}

// Export magazine section configurations for AI-CMS package use
export const MAGAZINE_SECTION_CONFIGS: Record<string, MagazineSectionConfig> = {};

// Initialize configurations
Object.entries(SECTION_FIELD_MAPPINGS).forEach(([sectionType, mapping]) => {
  const promptTemplate = SECTION_PROMPT_TEMPLATES[sectionType];
  const defaultModel = getRecommendedModel(sectionType, 'mainStory');

  MAGAZINE_SECTION_CONFIGS[sectionType] = {
    sectionType,
    fieldMappings: mapping,
    promptTemplate,
    defaultModel,
    complexity: mapping.complexity
  };
});

// Helper functions for AI-CMS package integration
export function getMagazineSectionConfig(sectionType: string): MagazineSectionConfig | undefined {
  return MAGAZINE_SECTION_CONFIGS[sectionType];
}

export function getAllMagazineSectionTypes(): string[] {
  return Object.keys(MAGAZINE_SECTION_CONFIGS);
}

export function getMagazineSectionsByComplexity(complexity: 'low' | 'medium' | 'high'): string[] {
  return Object.entries(MAGAZINE_SECTION_CONFIGS)
    .filter(([_, config]) => config.complexity === complexity)
    .map(([sectionType]) => sectionType);
}