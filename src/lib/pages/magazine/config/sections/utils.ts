import { FieldSchema, SectionSchema } from './types';

// Helper function to validate field value
export function validateField(field: FieldSchema, value: any): string | null {
  if (field.required && !value) {
    return `${field.label} is required`;
  }

  if (field.validation) {
    const { min, max, minLength, maxLength, pattern } = field.validation;

    if (typeof value === "string") {
      if (minLength && value.length < minLength) {
        return `${field.label} must be at least ${minLength} characters`;
      }
      if (maxLength && value.length > maxLength) {
        return `${field.label} must be no more than ${maxLength} characters`;
      }
      if (pattern && !new RegExp(pattern).test(value)) {
        return `${field.label} format is invalid`;
      }
    }

    if (typeof value === "number") {
      if (min !== undefined && value < min) {
        return `${field.label} must be at least ${min}`;
      }
      if (max !== undefined && value > max) {
        return `${field.label} must be no more than ${max}`;
      }
    }
  }

  return null;
}

// Helper to get default values for a schema
export function getDefaultValues(schema: SectionSchema): any {
  const defaults: any = { type: schema.id };

  schema.fields.forEach((field) => {
    if (field.defaultValue !== undefined) {
      defaults[field.name] = field.defaultValue;
    } else if (field.type === "array") {
      defaults[field.name] = [];
    } else if (field.type === "object" && field.fields) {
      const objDefaults: any = {};
      field.fields.forEach((subField) => {
        if (subField.defaultValue !== undefined) {
          objDefaults[subField.name] = subField.defaultValue;
        }
      });
      defaults[field.name] = objDefaults;
    } else if (field.type === "toggle" || field.type === "checkbox") {
      defaults[field.name] = false;
    } else if (field.type === "number") {
      defaults[field.name] = 0;
    }
  });

  return defaults;
}