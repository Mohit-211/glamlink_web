import React from 'react';
import type { FieldComponentProps } from './types';

// Import basic field components
import TextField from './fields/TextField';
import TextareaField from './fields/TextareaField';
import NumberField from './fields/NumberField';
import SelectField from './fields/SelectField';
import CheckboxField from './fields/CheckboxField';
import FallbackField from './fields/FallbackField';
import VideoThumbnailField from './fields/VideoThumbnailField';

// Import specialized components from shared editing
import { ImageUploadField, extractYouTubeId } from '@/lib/pages/admin/components/shared/editing/fields/custom/media';
import { StandaloneColorPicker } from '@/lib/pages/admin/components/shared/editing/fields/backgroundColor';
import { StandaloneLinkField } from '@/lib/pages/admin/components/shared/editing/fields/custom/link-action';
import TypographySettings from '@/lib/pages/admin/components/shared/editing/fields/typography/TypographySettings';
import StringArrayField from '../../fields/StringArrayField';
import ObjectArrayField from '../../fields/ObjectArrayField';

// Wrapper components for fields that need special handling
const DateField = ({ field, value, onChange }: FieldComponentProps) => (
  <input
    type="date"
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
  />
);

const TimeField = ({ field, value, onChange }: FieldComponentProps) => (
  <input
    type="time"
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
  />
);

const UrlField = ({ field, value, onChange }: FieldComponentProps) => (
  <input
    type="url"
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    placeholder={field.placeholder || 'https://...'}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
  />
);

const EmailField = ({ field, value, onChange }: FieldComponentProps) => (
  <input
    type="email"
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    placeholder={field.placeholder || 'email@example.com'}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
  />
);

const ImageField = ({ field, value, onChange, issueId }: FieldComponentProps) => {
  const imageUrl = typeof value === 'string' ? value : value?.url || '';
  return (
    <ImageUploadField
      field={field}
      value={imageUrl}
      onChange={(fieldName, newValue) => onChange(newValue)}
      issueId={issueId || 'admin'}
      imageType="content"
    />
  );
};

const BackgroundColorField = ({ field, value, onChange }: FieldComponentProps) => (
  <StandaloneColorPicker
    value={value || ''}
    onChange={onChange}
    placeholder={field.placeholder || '#ffffff or gradient'}
    disabled={field.disabled}
  />
);

const TypographyGroupField = ({ field, value, onChange }: FieldComponentProps) => (
  <TypographySettings
    settings={value || {}}
    onChange={onChange}
    showAlignment={field.showAlignment !== false}
    showColor={field.showColor !== false}
    showTag={field.showTag}
    tagOptions={field.tagOptions}
    defaultTag={field.defaultTag}
  />
);

const LinkActionField = ({ field, value, onChange }: FieldComponentProps) => (
  <StandaloneLinkField
    name={field.name}
    label=""
    value={value}
    onChange={onChange}
    placeholder={field.placeholder}
    showActionSelector={true}
    showQRCode={false}
  />
);

/**
 * Field component registry using object lookup pattern
 * This replaces the switch statement for cleaner, more maintainable code
 */
export const fieldComponents: Record<string, React.ComponentType<FieldComponentProps>> = {
  'text': TextField,
  'textarea': TextareaField,
  'number': NumberField,
  'date': DateField,
  'time': TimeField,
  'select': SelectField,
  'checkbox': CheckboxField,
  'url': UrlField,
  'email': EmailField,
  'image': ImageField,
  'background-color': BackgroundColorField,
  'typography-group': TypographyGroupField,
  'link-action': LinkActionField,
  'video-thumbnail': VideoThumbnailField,
};

/**
 * Get the appropriate field component for a field type
 * Returns FallbackField if type is not found in registry
 */
export function getFieldComponent(type: string): React.ComponentType<FieldComponentProps> {
  return fieldComponents[type] || FallbackField;
}

export default fieldComponents;
