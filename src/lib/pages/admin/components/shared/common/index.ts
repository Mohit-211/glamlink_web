// Shared common components for consistent UI patterns across admin pages

// State components (loading, error, empty states)
export { Loading, ErrorComponent, NoRecords } from './state';

// Navigation components
export { TabsNavigation, type TabItem } from './nav';

// Filter components
export {
  DisplayFilters,
  type DisplayFiltersProps,
  type SelectFilterConfig,
  type CheckboxFilterConfig,
  type StatBadgeConfig,
  type ActionButtonConfig
} from './filter';

// Collapse display components
export {
  CollapsibleSection,
  FieldDisplay,
  TextareaDisplay,
  LinkDisplay,
  ArrayDisplay,
  ListDisplay,
  ArrayBadgeDisplay,
  CheckboxArrayDisplay,
  FilesDisplay,
  type CollapsibleSectionProps,
  type FieldDisplayProps,
  type TextareaDisplayProps,
  type LinkDisplayProps,
  type ArrayDisplayProps,
  type ArrayBadgeDisplayProps,
  type BadgeColorScheme,
  type FilesDisplayProps,
  type SubmittedFile,
} from './collapse-display';

// Export all icons
export * from './Icons';