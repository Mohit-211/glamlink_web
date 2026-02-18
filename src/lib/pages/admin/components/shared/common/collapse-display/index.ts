/**
 * Collapse Display Module
 *
 * Shared collapsible section and display components for rendering
 * structured data in expandable/collapsible containers.
 *
 * @example
 * ```tsx
 * import {
 *   CollapsibleSection,
 *   FieldDisplay,
 *   ArrayBadgeDisplay
 * } from '@/lib/pages/admin/components/shared/common/collapse-display';
 *
 * <CollapsibleSection title="Profile" defaultOpen={true}>
 *   <FieldDisplay label="Name" value={data.name} />
 *   <ArrayBadgeDisplay label="Skills" items={data.skills} />
 * </CollapsibleSection>
 * ```
 */

// Main collapsible container
export { CollapsibleSection, default as CollapsibleSectionDefault } from './CollapsibleSection';

// Display components
export {
  FieldDisplay,
  TextareaDisplay,
  LinkDisplay,
  ArrayDisplay,
  ListDisplay,
  ArrayBadgeDisplay,
  CheckboxArrayDisplay,
  FilesDisplay,
} from './displays';

// Types
export type {
  CollapsibleSectionProps,
  FieldDisplayProps,
  TextareaDisplayProps,
  LinkDisplayProps,
  ArrayDisplayProps,
  ArrayBadgeDisplayProps,
  BadgeColorScheme,
  FilesDisplayProps,
  SubmittedFile,
} from './types';
