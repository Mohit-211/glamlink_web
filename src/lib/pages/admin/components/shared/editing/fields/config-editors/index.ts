/**
 * Config Editor Components
 *
 * High-level components for editing form configurations.
 * These components provide complete form builder interfaces.
 *
 * @example
 * ```tsx
 * import {
 *   FormConfigEditor,
 *   NestedJsonEditorModal,
 *   NestedEditorProvider,
 *   useNestedEditorContext,
 * } from '@/lib/pages/admin/components/shared/editing/fields/config-editors';
 * ```
 */

// Context and hooks for nested editor state
export {
  NestedEditorProvider,
  useNestedEditorContext,
  useNestedEditorContextOptional,
  default as NestedEditorContextDefault,
} from './NestedEditorContext';
export type {
  NestedEditorContextValue,
  JsonEditorTarget,
  JsonEditorTargetType,
} from './NestedEditorContext';

// Form config editor
export {
  FormConfigEditor,
  default as FormConfigEditorDefault,
} from './FormConfigEditor';
export type { FormConfigEditorProps, IconOption } from './FormConfigEditor';

// JSON editor modal
export {
  NestedJsonEditorModal,
  default as NestedJsonEditorModalDefault,
} from './NestedJsonEditorModal';
export type { NestedJsonEditorModalProps } from './NestedJsonEditorModal';
