// ============================================
// REFACTORED FORM SYSTEM - TYPE DEFINITIONS
// ============================================

// Re-export existing types
export type { FieldConfig, FieldType, SelectOption, FieldValidation } from '@/lib/pages/admin/types/forms';

// Re-export form provider types
export type { UpdateFieldsFn, OnFieldChangeCallback } from './form/useFormProvider';

// Import for internal use in this file
import type { OnFieldChangeCallback as _OnFieldChangeCallback } from './form/useFormProvider';

// Form Context Value - the shape of data provided by FormProvider
export interface FormContextValue<T = Record<string, any>> {
  // Data access
  formData: T;
  getFieldValue: (name: string) => any;

  // Data mutation
  updateField: (name: string, value: any) => void;
  updateFields: (updates: Partial<T>) => void;
  setFormData: (data: T) => void;

  // Validation
  errors: Record<string, string>;
  setFieldError: (name: string, error: string) => void;
  clearFieldError: (name: string) => void;
  validateField: (name: string) => string | null;
  validateAllFields: () => boolean;

  // State
  isDirty: boolean;
  isSubmitting: boolean;

  // Additional context (e.g., issueId for nested components)
  context: Record<string, any>;
}

// Props for individual field components
export interface FieldProps {
  field: import('@/lib/pages/admin/types/forms').FieldConfig;
  // Note: value and onChange come from context, not props
}

// Props for BaseField wrapper
export interface BaseFieldProps {
  field: import('@/lib/pages/admin/types/forms').FieldConfig;
  error?: string;
  children: React.ReactNode;
}

// Custom tab configuration
export interface CustomTab {
  id: string;
  label: string;
  fields: import('@/lib/pages/admin/types/forms').FieldConfig[];
  icon?: React.ComponentType<{ className?: string }>;
}

// Generic preview component configuration
export interface GenericPreviewComponent<TData = any> {
  id: string;
  label: string;
  component: React.ComponentType<{ [key: string]: TData }>;
}

// Props for custom preview container - receives previewComponents and renders them
export interface PreviewContainerProps<TPreview = any> {
  previewComponents: TPreview[];
}

// Props for FormModal
export interface FormModalProps<T = Record<string, any>> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialData?: Partial<T>;
  fields: import('@/lib/pages/admin/types/forms').FieldConfig[];
  onSave: (data: T) => Promise<void>;
  /**
   * Callback when a field value changes.
   * Receives updateFields function to allow updating other fields (e.g., for linked fields).
   */
  onFieldChange?: _OnFieldChangeCallback<T>;

  // Optional configuration
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  saveButtonText?: string;
  cancelButtonText?: string;
  showTabs?: boolean;
  defaultTab?: string;  // Now supports custom tab IDs in addition to 'form' | 'json'
  customTabs?: CustomTab[];  // NEW: Custom tab configuration
  onTabChange?: (tabId: string) => void;  // NEW: Tab change callback
  previewComponents?: any[];  // Preview components for magazine issues or other entities
  // Custom preview container component (for non-magazine modals like professionals)
  PreviewContainer?: React.ComponentType<PreviewContainerProps<any>>;
  // External saving state from Redux - ensures loading indicator stays visible during API calls
  isSaving?: boolean;
  // Custom action bar to render above the form content (e.g., JSON Export/Import buttons)
  customActionBar?: React.ReactNode;
}

// Props for FormRenderer
export interface FormRendererProps {
  fields: import('@/lib/pages/admin/types/forms').FieldConfig[];
  columns?: 1 | 2;
}

// Props for JsonEditor
export interface JsonEditorProps<T = Record<string, any>> {
  onApply: (data: T) => void;
  entityType?: string;
  fields?: import('@/lib/pages/admin/types/forms').FieldConfig[];  // NEW: Optional field filtering
}

// Field component registry type
export type FieldComponentType = React.ComponentType<FieldProps>;

export interface FieldRegistry {
  [key: string]: FieldComponentType;
}
