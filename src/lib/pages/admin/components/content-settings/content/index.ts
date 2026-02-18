// Content Section component
export { default as ContentSection } from './ContentSection';
export { useContentSection, availablePages } from './useContentSection';
export type { PageOption, PageEditorConfig } from './useContentSection';

// For Clients Types (explicit exports to avoid conflicts)
export type {
  ForClientsSectionType,
  ForClientsBannerConfig,
  ForClientsSection,
  ForClientsPageConfig
} from './sections/for-clients/types';

// Home Types (explicit exports to avoid conflicts)
export type {
  HomeSectionType,
  HomeSection,
  HomePageConfig
} from './sections/home/types';

// Editor Components and Hooks
export * from './editor';

// Section Field Configurations
export * from './sections';
