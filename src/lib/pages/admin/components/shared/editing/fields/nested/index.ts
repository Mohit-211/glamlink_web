/**
 * Nested Field Components
 *
 * Components for editing nested form configurations (sections and fields).
 * These components work together to provide a complete form builder interface.
 *
 * @example
 * ```tsx
 * import {
 *   SectionArrayField,
 *   SectionEditorField,
 *   NestedFieldEditorField,
 *   FieldArrayField,
 *   useNestedEditor,
 * } from '@/lib/pages/admin/components/shared/editing/fields/nested';
 * ```
 */

// Hook for nested form config editing
export {
  useNestedEditor,
  default as useNestedEditorDefault,
} from './useNestedEditor';
export type {
  UseNestedEditorConfig,
  UseNestedEditorReturn,
  BaseFormConfig,
  BaseSectionConfig,
  BaseFieldConfig,
  BaseOptionConfig,
} from './useNestedEditor';

// Section Components
export {
  SectionArrayField,
  default as SectionArrayFieldDefault,
} from './SectionArrayField';
export type { SectionArrayFieldProps } from './SectionArrayField';

export {
  SectionEditorField,
  default as SectionEditorFieldDefault,
} from './SectionEditorField';
export type { SectionEditorFieldProps, LayoutOption } from './SectionEditorField';

// Field Components
export {
  FieldArrayField,
  default as FieldArrayFieldDefault,
} from './FieldArrayField';
export type { FieldArrayFieldProps } from './FieldArrayField';

export {
  NestedFieldEditorField,
  default as NestedFieldEditorFieldDefault,
} from './NestedFieldEditorField';
export type { NestedFieldEditorFieldProps, FieldTypeOption } from './NestedFieldEditorField';
