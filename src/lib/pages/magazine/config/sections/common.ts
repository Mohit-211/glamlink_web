import { FieldSchema } from './types';
import { fontSizeOptions, fontFamilyOptions, fontWeightOptions, textColorOptions } from '../universalStyles';

// Helper to add common fields to all sections
export const addCommonFields = (fields: FieldSchema[]): FieldSchema[] => {
  return [
    {
      name: "urlSlug",
      label: "URL Slug",
      type: "text",
      placeholder: "e.g., from-the-treatment-room",
      helperText: "URL-friendly identifier for this section (optional)",
      validation: {
        pattern: "^[a-z0-9-]+$",
      },
    },
    ...fields,
  ];
};

// Helper to add typography fields for any text element
export const addTypographyFields = (
  fieldPrefix: string,
  label: string,
  defaults: {
    size?: string;
    family?: string;
    weight?: string;
    color?: string;
  } = {}
): FieldSchema[] => {
  const groupId = `${fieldPrefix}_typography`;
  return [
    {
      name: `${fieldPrefix}FontSize`,
      label: `${label} Size`,
      type: "select",
      options: fontSizeOptions,
      defaultValue: defaults.size || "text-base",
      fieldGroup: groupId,
    },
    {
      name: `${fieldPrefix}FontFamily`,
      label: `${label} Font`,
      type: "select",
      options: fontFamilyOptions,
      defaultValue: defaults.family || "font-sans",
      fieldGroup: groupId,
    },
    {
      name: `${fieldPrefix}FontWeight`,
      label: `${label} Weight`,
      type: "select",
      options: fontWeightOptions,
      defaultValue: defaults.weight || "font-normal",
      fieldGroup: groupId,
    },
    {
      name: `${fieldPrefix}Color`,
      label: `${label} Color`,
      type: "select",
      options: textColorOptions,
      defaultValue: defaults.color || "text-gray-700",
      fieldGroup: groupId,
    },
  ];
};