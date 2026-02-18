// Main export file for AI-CMS configuration
export * from './sectionFieldMappings';
export * from './promptTemplates';
export * from './modelConfig';

// Content blocks configuration
export * from './content-blocks';

// Re-export commonly used types and functions
export type {
  AIEnabledField,
  ContentBlock,
  SectionMapping
} from './sectionFieldMappings';

export type {
  ContentBlockPrompt,
  SectionPromptTemplate
} from './promptTemplates';

export type {
  AIModel,
  ModelRecommendation
} from './modelConfig';

// Configuration constants
export const AI_CMS_CONFIG = {
  MAX_SECTIONS_PER_REQUEST: 10,
  MAX_PARALLEL_REQUESTS: 3,
  DEFAULT_TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 2,
  PROGRESS_UPDATE_INTERVAL: 500, // ms
} as const;