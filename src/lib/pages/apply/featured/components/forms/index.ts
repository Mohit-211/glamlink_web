// Base field component interfaces and exports
export interface BaseFieldProps {
  fieldKey: string;
  config: any;
  value: any;
  onChange: (fieldKey: string, value: any) => void;
  onBlur?: (fieldKey: string) => void;
  onFocus?: (fieldKey: string) => void;
  error?: string;
  disabled?: boolean;
}

// Re-export field components from fields subdirectory
export {
  TextField,
  TextareaField,
  FileUploadField,
  InputListField,
  CheckboxListField,
  RadioListField,
  EmailField,
  CharacterCountField,
  FileUploadWithTitleField,
  CheckboxOptionField,
  RadioOptionField,
  MultiCheckboxField
} from './fields';

// Export form components
export { default as CoverForm } from './CoverForm';
export { default as LocalSpotlightForm } from './LocalSpotlightForm';
export { default as TopTreatmentForm } from './TopTreatmentForm';
export { default as RisingStarForm } from './RisingStarForm';
export { default as MagazinePreviewSection } from './MagazinePreviewSection';
export { default as ProfileInfoForm } from './ProfileInfoForm';

// Form type definitions and utilities
export type FormType = 'cover' | 'local-spotlight' | 'top-treatment' | 'rising-star' | 'profile-only';

export interface FormTypeInfo {
  id: FormType;
  label: string;
  color: string;
  description: string;
}

export const FORM_TYPES: FormTypeInfo[] = [
  { id: 'cover', label: 'Cover Form', color: 'bg-purple-600', description: 'Get featured on Glamlink Magazine cover' },
  { id: 'local-spotlight', label: 'Local Spotlight', color: 'bg-teal-600', description: 'Featured as a local beauty professional' },
  { id: 'top-treatment', label: 'Top Treatment', color: 'bg-pink-600', description: 'Showcase your signature treatment' },
  { id: 'rising-star', label: 'Rising Star', color: 'bg-indigo-600', description: 'Emerging talent feature' },
  { id: 'profile-only', label: 'Profile Only', color: 'bg-gray-600', description: 'Basic profile submission' }
];

export function getFormTypeInfo(formType: FormType): FormTypeInfo | undefined {
  return FORM_TYPES.find(type => type.id === formType);
}

export function getFormTypeLabel(formType: FormType): string {
  const info = getFormTypeInfo(formType);
  return info?.label || formType;
}

export function getFormTypeColor(formType: FormType): string {
  const info = getFormTypeInfo(formType);
  return info?.color || 'bg-gray-600';
}