import { FieldDefinition } from './types';

// Standard typography fields that are always the same
const TYPOGRAPHY_FIELDS: FieldDefinition[] = [
  { 
    name: "fontSize", 
    label: "Font Size", 
    type: "select",
    options: [
      { value: "text-xs", label: "Extra Small" },
      { value: "text-sm", label: "Small" },
      { value: "text-base", label: "Medium" },
      { value: "text-lg", label: "Large" },
      { value: "text-xl", label: "Extra Large" }
    ],
    defaultValue: "text-sm"
  },
  { 
    name: "fontFamily", 
    label: "Font Family", 
    type: "select",
    options: [
      { value: "font-sans", label: "Sans Serif" },
      { value: "font-serif", label: "Serif" },
      { value: "font-mono", label: "Monospace" }
    ],
    defaultValue: "font-sans"
  },
  { 
    name: "fontWeight", 
    label: "Font Weight", 
    type: "select",
    options: [
      { value: "font-normal", label: "Normal" },
      { value: "font-medium", label: "Medium" },
      { value: "font-semibold", label: "Semi Bold" },
      { value: "font-bold", label: "Bold" }
    ],
    defaultValue: "font-medium"
  },
  { 
    name: "fontStyle", 
    label: "Font Style", 
    type: "select",
    options: [
      { value: "", label: "Normal" },
      { value: "italic", label: "Italic" }
    ],
    defaultValue: ""
  },
  { 
    name: "textDecoration", 
    label: "Text Decoration", 
    type: "select",
    options: [
      { value: "", label: "None" },
      { value: "underline", label: "Underline" },
      { value: "line-through", label: "Line Through" }
    ],
    defaultValue: ""
  },
  { 
    name: "color", 
    label: "Text Color", 
    type: "text",
    placeholder: "text-gray-700 or text-[#333333]",
    defaultValue: "text-gray-700"
  },
  { 
    name: "alignment", 
    label: "Text Alignment", 
    type: "select",
    options: [
      { value: "left", label: "Left" },
      { value: "center", label: "Center" },
      { value: "right", label: "Right" }
    ],
    defaultValue: "center"
  }
];

/**
 * Creates a typography field group with standard fields
 * @param name - Field name (e.g., "nameTypography")
 * @param label - Field label (e.g., "Author Name Typography")
 * @param overrides - Optional overrides for default values
 */
export function createTypographyField(
  name: string, 
  label: string,
  overrides?: Partial<Record<string, any>>
): FieldDefinition {
  const fields = TYPOGRAPHY_FIELDS.map(field => {
    if (overrides && overrides[field.name] !== undefined) {
      return { ...field, defaultValue: overrides[field.name] };
    }
    return field;
  });

  return {
    name,
    label,
    type: "typography-group",
    fields
  };
}

// Preset configurations for common use cases
export const TYPOGRAPHY_PRESETS = {
  title: { fontSize: "text-lg", fontWeight: "font-bold" },
  subtitle: { fontSize: "text-base", fontWeight: "font-medium" },
  body: { fontSize: "text-sm", fontWeight: "font-normal" },
  small: { fontSize: "text-xs", fontWeight: "font-normal", color: "text-gray-600" },
};