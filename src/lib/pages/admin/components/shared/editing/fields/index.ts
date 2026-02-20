// ============================================
// FIELD COMPONENT EXPORTS
// ============================================

// Shared utilities
export { BaseField, getInputClassName, inputClassName, inputErrorClassName } from './BaseField';

// Basic field components (simple, <150 lines) - re-exported from basic/
export {
  TextField,
  TextAreaField,
  SelectField,
  CheckboxField,
  NumberField,
  DateField,
  EmailField,
  UrlField,
  PhoneField,
} from './basic';

// Complex components (remain in root)
export { ArrayField } from './ArrayField';
export { HtmlField, RichTextField } from './html';
export { BackgroundColorField, ColorField, presetColors } from './backgroundColor';

// Wrapped custom components - all from custom/index.ts
export {
  ImageField,
  GalleryField,
  LocationField,
  MultiLocationField,
  SpecialtiesField,
  PromotionsField,
  LinkActionField,
  VideoField,
} from './custom';
export type { LinkActionType, LinkFieldValue, VideoSourceType } from './custom';

// Content block and professional selectors
// Note: Import directly from file to avoid circular dependency with block-selector/index.ts
// (block-selector/index.ts exports modal components which import FormRenderer which imports this file)
export { ContentBlockSelectorField } from './custom/block-selector/ContentBlockSelectorField';
export { ProfessionalSelectorField } from './ProfessionalSelectorField';

// Custom layout editor
// Note: Import directly from editor folder to avoid circular dependency via layout-objects/index.ts
// (layout-objects/index.ts re-exports block-selector which includes modal components that import FormRenderer)
export { CustomLayoutEditorField } from './custom/layout-objects/editor';

// Page link selector (for TOC entries to select internal page links)
export { PageLinkSelectorField } from './PageLinkSelectorField';

// User selector (for profile owner assignment)
export { UserSelectField } from './UserSelectField';

// ============================================
// NESTED FORM CONFIG EDITOR COMPONENTS
// ============================================

// Nested field components for form config editing
export {
  SectionArrayField,
  SectionEditorField,
  FieldArrayField,
  NestedFieldEditorField,
} from './nested';
export type {
  SectionArrayFieldProps,
  SectionEditorFieldProps,
  FieldArrayFieldProps,
  NestedFieldEditorFieldProps,
  LayoutOption,
  FieldTypeOption,
} from './nested';

// Config editor components
export {
  FormConfigEditor,
  NestedJsonEditorModal,
} from './config-editors';
export type {
  FormConfigEditorProps,
  NestedJsonEditorModalProps,
  IconOption,
} from './config-editors';

// ============================================
// FIELD COMPONENT REGISTRY
// ============================================

// Import all field components for the registry
import {
  TextField,
  TextAreaField,
  SelectField,
  CheckboxField,
  NumberField,
  DateField,
  EmailField,
  UrlField,
  PhoneField,
} from './basic';
import { ArrayField } from './ArrayField';
import { HtmlField } from './html';
import { BackgroundColorField } from './backgroundColor';
import {
  ImageField,
  GalleryField,
  LocationField,
  MultiLocationField,
  SpecialtiesField,
  PromotionsField,
  LinkActionField,
  VideoField,
  ThumbnailEditorField
} from './custom';
// Note: Import directly from file to avoid circular dependency (see export comment above)
import { ContentBlockSelectorField } from './custom/block-selector/ContentBlockSelectorField';
import { ProfessionalSelectorField } from './ProfessionalSelectorField';
// Note: Import directly from editor folder to avoid circular dependency (see export comment above)
import { CustomLayoutEditorField } from './custom/layout-objects/editor';
import { PageLinkSelectorField } from './PageLinkSelectorField';
import { UserSelectField } from './UserSelectField';
import { CondensedCardEditorField } from '@/lib/features/digital-cards/components/editor/admin';

import type { FieldConfig } from '@/lib/pages/admin/types/forms';

// Field component type
type FieldComponent = React.ComponentType<{ field: FieldConfig; error?: string }>;

// Field component registry - maps field type to component
export const FIELD_REGISTRY: Record<string, FieldComponent> = {
  // Basic input fields (from basic/)
  text: TextField,
  textarea: TextAreaField,
  select: SelectField,
  checkbox: CheckboxField,
  number: NumberField,
  date: DateField,
  email: EmailField,
  url: UrlField,
  tel: PhoneField,

  // Array field
  array: ArrayField,

  // Rich text field
  html: HtmlField,
  richtext: HtmlField, // Alias

  // Color picker field
  backgroundColor: BackgroundColorField,
  color: BackgroundColorField, // Alias

  // Media fields (wrapped legacy)
  image: ImageField,
  'image-array': ImageField, // Falls back to single image for now
  gallery: GalleryField,

  // Complex fields (wrapped legacy)
  locationInput: LocationField,
  multiLocation: MultiLocationField,  // Multi-location field (up to 30 locations)
  specialties: SpecialtiesField,
  promotions: PromotionsField,

  // Link action field
  'link-action': LinkActionField,

  // Video field
  video: VideoField,

  // Content block selector (for digital pages with custom blocks)
  'content-block-selector': ContentBlockSelectorField,

  // Professional selector (for business card content blocks)
  'professional-selector': ProfessionalSelectorField,

  // Custom layout editor (for page-custom object arrays)
  'custom-layout-editor': CustomLayoutEditorField,

  // Page link selector (for TOC entries)
  'page-link-selector': PageLinkSelectorField,

  // Condensed card editor (for condensed card image export configuration)
  condensedCardEditor: CondensedCardEditorField,

  // Thumbnail editor (for magazine thumbnail configuration)
  thumbnailEditor: ThumbnailEditorField,

  // User selector (for profile owner assignment)
  userSelect: UserSelectField,
};

// Helper function to get field component by type
export function getFieldComponent(type: string): FieldComponent | null {
  return FIELD_REGISTRY[type] || null;
}
