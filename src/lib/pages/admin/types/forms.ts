// ============================================
// FORM AND FIELD TYPE DEFINITIONS
// ============================================

// Base field configuration
export interface BaseFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  helperText?: string;
  validation?: FieldValidation;
  hide?: boolean; // Hide this field from all forms and UI
}

// Field types
export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'password'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'time'
  | 'datetime'
  | 'file'
  | 'image'
  | 'image-array'
  | 'array'
  | 'object'
  | 'color'
  | 'url'
  | 'tel'
  | 'gallery'
  | 'specialties'
  | 'promotions'
  | 'html'
  | 'richtext'
  | 'backgroundColor'
  | 'background-color'  // Legacy alias for backgroundColor
  | 'locationInput'
  | 'multiLocation'
  | 'link-action'
  | 'video'
  | 'content-block-selector'
  | 'professional-selector'
  | 'custom-layout-editor'
  | 'page-link-selector'
  | 'sectionsConfig'
  | 'thumbnailEditor'
  | 'typography-group'  // Typography field group
  | 'icon-select'  // Icon selector field
  | 'icon'  // Icon field
  | 'userSelect'  // User selector field
  | 'video-thumbnail';  // Video thumbnail selector field

// Select field options
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

// Extended field configurations
export interface SelectFieldConfig extends BaseFieldConfig {
  type: 'select';
  options: SelectOption[];
  multiple?: boolean;
}

export interface ImageFieldConfig extends BaseFieldConfig {
  type: 'image' | 'image-array';
  contentType: 'product' | 'provider' | 'professional' | 'beforeafter' | 'training' | 'review';
  maxImages?: number;
  acceptedFormats?: string[];
  maxSize?: number; // in MB
}

export interface ArrayFieldConfig extends BaseFieldConfig {
  type: 'array';
  // Enhanced data type specification
  data?: 'string' | 'image' | 'object';
  // Legacy support
  itemType?: 'text' | 'number';
  // Item schema for object arrays
  itemSchema?: FieldConfig[];
  maxItems?: number;
  minItems?: number;
}

// Object field configuration for complex nested structures
export interface ObjectFieldConfig extends BaseFieldConfig {
  type: 'object';
  fields: FieldConfig[];
}

// Field validation
export interface FieldValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null; // Returns error message or null
}

// Additional field config interface for FormRenderer
export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  contentType?: 'product' | 'provider' | 'professional' | 'beforeafter' | 'training' | 'review';
  maxImages?: number;
  min?: number;
  max?: number;
  step?: number;
  validation?: FieldValidation;
  checkboxLabel?: string;
  helperText?: string;
  disabled?: boolean;
  minItems?: number;
  maxItems?: number;
  data?: 'string' | 'image' | 'object'; // Enhanced data type specification for array fields
  layout?: 'single' | 'double' | 'full'; // Layout in 2-column grid
  itemType?: 'text' | 'number' | 'object'; // Item type for arrays (text, number, or object)
  itemSchema?: {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  helperText?: string;
  contentType?: 'product' | 'provider' | 'professional' | 'beforeafter' | 'training' | 'review';
  rows?: number; // Number of rows for textarea fields in arrays
}[]; // Schema for array fields
  dynamicAspectRatio?: boolean; // For array fields with dynamic aspect ratio calculation
  objectFields?: FieldConfig[]; // Alternative to itemSchema for object arrays
  rows?: number; // Number of rows for textarea fields
  hide?: boolean; // Hide this field from all forms and UI
  conditionalDisplay?: {  // NEW: Show/hide field based on other field values
    field: string;  // Field name to check
    operator: '===' | '!==' | 'in' | 'not-in';
    value: any;  // Value to compare against
  };
  useTypography?: boolean;  // NEW: Enable typography settings for text fields
  typographyConfig?: {      // NEW: Configure which typography options to show
    showAlignment?: boolean;
    showColor?: boolean;
    showTag?: boolean;       // Show HTML tag dropdown (h1-h6, etc.)
    tagOptions?: string[];   // Override default tag options
    defaultTag?: string;     // Default tag value (default 'h3')
  };
  config?: any;  // Additional configuration for custom field types
  defaultValue?: any;  // Default value for the field
  fieldGroup?: string; // For grouping fields on the same line
}

// Form configuration - union type
export type ExtendedFieldConfig = 
  | BaseFieldConfig 
  | SelectFieldConfig 
  | ImageFieldConfig 
  | ArrayFieldConfig;

// Form state
export interface FormState<T = any> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Field component props interface
export interface FieldComponentProps {
  field: FieldConfig;
  value: any;
  onChange: (fieldName: string, value: any) => void;
  error?: string;
}

// Form handlers
export interface FormHandlers<T = any> {
  handleChange: (name: string, value: any) => void;
  handleBlur: (name: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setFieldValue: (name: string, value: any) => void;
  setFieldError: (name: string, error: string) => void;
  resetForm: () => void;
  validateField: (name: string) => string | null;
  validateForm: () => boolean;
}