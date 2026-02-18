// Main view modal
export { default as SubmissionViewModal } from './SubmissionViewModal';

// Hooks
export { useSubmissionView, formatDate } from './useSubmissionView';

// Re-export from shared collapse-display module (for backwards compatibility)
export {
  CollapsibleSection,
  FieldDisplay,
  TextareaDisplay,
  ArrayDisplay,
  CheckboxArrayDisplay,
  FilesDisplay,
} from '@/lib/pages/admin/components/shared/common/collapse-display';

// Re-export StatusControls from shared (for backwards compatibility)
export { StatusControls } from '@/lib/pages/admin/components/shared/editing/form/StatusControls';

// Local components
export {
  CoverDetails,
  LocalSpotlightDetails,
  RisingStarDetails,
  TopTreatmentDetails,
  GlamlinkIntegrationDetails
} from './FormTypeDetails';
