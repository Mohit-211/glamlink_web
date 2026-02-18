// Main component exports
export { FormModal } from './FormModal';
export { FormProvider, useFormContext, FormContext } from './form/FormProvider';
export { FormRenderer } from './form/FormRenderer';
export { JsonEditor } from './form/JsonEditor';

// Hook exports
export { useFormProvider } from './form/useFormProvider';
export { useJsonEditor } from './form/useJsonEditor';
export { useFormModal, MODAL_SIZE_CLASSES } from './useFormModal';
export type { ModalSize, SubTabType, UseFormModalConfig, UseFormModalReturn } from './useFormModal';

// Modal component exports
export { ModalDisplay } from './modal/ModalDisplay';

// Type exports
export type {
  FormContextValue,
  FieldProps,
  BaseFieldProps,
  FormModalProps,
  FormRendererProps,
  JsonEditorProps,
  FieldComponentType,
  FieldRegistry,
} from './types';

// Re-export FieldConfig from central types
export type { FieldConfig } from '@/lib/pages/admin/types/forms';

// ============================================
// NESTED EDITOR CONTEXT & HOOKS
// ============================================

// Context for nested form config editing (from config-editors/)
export {
  NestedEditorProvider,
  useNestedEditorContext,
  useNestedEditorContextOptional,
} from './fields/config-editors';
export type {
  NestedEditorContextValue,
  JsonEditorTarget,
  JsonEditorTargetType,
} from './fields/config-editors';

// Hook for nested form config editing (from nested/)
export { useNestedEditor } from './fields/nested';
export type {
  UseNestedEditorConfig,
  UseNestedEditorReturn,
  BaseFormConfig,
  BaseSectionConfig,
  BaseFieldConfig,
  BaseOptionConfig,
} from './fields/nested';

// ============================================
// FIELD COMPONENT EXPORTS
// ============================================

// Basic field components
export {
  BaseField,
  TextField,
  TextAreaField,
  SelectField,
  CheckboxField,
  NumberField,
  DateField,
  EmailField,
  UrlField,
  PhoneField,
  ArrayField,
  ImageField,
  GalleryField,
  LocationField,
  SpecialtiesField,
  PromotionsField,
  FIELD_REGISTRY,
  getFieldComponent,
} from './fields';

// Nested form config editor components
export {
  SectionArrayField,
  SectionEditorField,
  FieldArrayField,
  NestedFieldEditorField,
  FormConfigEditor,
  NestedJsonEditorModal,
} from './fields';
export type {
  SectionArrayFieldProps,
  SectionEditorFieldProps,
  FieldArrayFieldProps,
  NestedFieldEditorFieldProps,
  FormConfigEditorProps,
  NestedJsonEditorModalProps,
  LayoutOption,
  FieldTypeOption,
  IconOption,
} from './fields';
