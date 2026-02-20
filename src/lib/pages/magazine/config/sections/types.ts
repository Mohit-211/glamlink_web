export type FieldType = 
  | "text" 
  | "textarea" 
  | "richtext" 
  | "number" 
  | "email" 
  | "url" 
  | "link-action" 
  | "date" 
  | "time" 
  | "image" 
  | "video" 
  | "file" 
  | "array" 
  | "object" 
  | "reference" 
  | "color" 
  | "icon" 
  | "select" 
  | "multiselect" 
  | "toggle" 
  | "checkbox" 
  | "typography-group"
  | "custom-blocks"
  | "html"
  | "icon-select"
  | "background-color";

export interface FieldSchema {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    options?: { value: string; label: string }[];
  };
  // For textarea
  rows?: number;
  // For arrays
  itemType?: FieldType;
  itemSchema?: FieldSchema[];
  maxItems?: number;
  minItems?: number;
  // For objects
  fields?: FieldSchema[];
  // For select/multiselect
  options?: { value: string; label: string }[];
  // Custom actions for specific fields (e.g., extract video thumbnail)
  customActions?: string[];
  // UI hints
  fullWidth?: boolean;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  width?: string; // For inline group fields
  inline?: boolean; // For group type - display fields horizontally
  inlineGroup?: string; // Group identifier for fields that should be displayed on the same line
  fieldGroup?: string; // Group identifier for fields that should be displayed together
  advanced?: boolean; // Marks field as advanced/optional - hidden by default
  // Conditional rendering
  condition?: {
    field: string;
    value: any;
  };
  showIf?: (formData: any) => boolean; // Dynamic visibility based on form data
}

export interface TabSchema {
  id: string;
  label: string;
  fields: FieldSchema[];
}

export interface SectionSchema {
  id: string;
  label: string;
  description: string;
  icon?: string;
  category: "content" | "commerce" | "social" | "interactive" | "editorial" | "special";
  fields: FieldSchema[];
  tabs?: TabSchema[]; // Optional tabs for complex sections
  preview?: string; // Preview image URL
  template?: any; // Default content template
}