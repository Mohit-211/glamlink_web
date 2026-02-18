// Redux Hook
export { useProfessionalsRedux } from './useProfessionalsRedux';

// Tab Component
export { default as ProfessionalsTab } from './ProfessionalsTab';

// Modal Component
export { default as ProfessionalModal } from './ProfessionalModal';

// Other Components
export { default as ProfessionalItem } from './ProfessionalItem';
export { default as ProfessionalsList } from './ProfessionalsList';

// Utility Hooks
export {
  useProfessionalsTab,
  useProfessionalModal,
  getShortLocation,
  getCertificationColor,
  getDefaultProfessionalData,
  transformProfessionalForSave,
  transformProfessionalsForDisplay,
} from './useProfessionals';

// Types from useProfessionals
export type {
  UseProfessionalsTabReturn,
  UseProfessionalModalReturn,
} from './useProfessionals';

// Re-export professional field configurations from the main editFields config
// This ensures all professional components use the enhanced field definitions
export {
  professionalEditFields,
  getProfessionalFieldsForModalType,
  getDefaultProfessionalValues,
} from '@/lib/pages/admin/config/editFields';
