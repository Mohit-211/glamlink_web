/**
 * Field-related type definitions
 */

// Field Type Union - must be defined first
export type FieldType = 'text' | 'html' | 'number' | 'date' | 'select' | 'array' | 'textarea' | 'checkbox' | 'email' | 'url';

// Field Definition
export interface FieldDefinition {
  fieldName: string;
  displayName: string;
  fieldType: FieldType;
  description?: string;
  exclude?: boolean; // For fields that should not be updated by AI
  required?: boolean;
  validation?: FieldValidation;
  options?: string[]; // For select fields
}

export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  custom?: (value: any) => boolean | string;
}

// Field Comparison (for AI dialogs)
export interface FieldComparison {
  fieldName: string;
  displayName: string;
  fieldType: FieldDefinition['fieldType'];
  oldValue: any;
  newValue: any;
  shouldUpdate: boolean;
  hasChanged?: boolean;
  validationError?: string;
}

// Content Block Field (for complex sections)
export interface ContentBlockField {
  fieldPath: string;        // e.g., 'props.name', 'props.bio', 'props.accolades'
  displayName: string;      // Human-readable name
  fieldType: 'text' | 'html' | 'array' | 'number';
  description?: string;     // Help text for AI
  defaultValue?: any;
}

// Content Block Group
export interface ContentBlockGroup {
  groupName: string;
  displayName: string;
  blockIndex?: number; // For content blocks
  fields: {
    fieldPath: string;
    displayName: string;
    fieldType: 'text' | 'html' | 'array' | 'number';
    oldValue: any;
    newValue: any;
    shouldUpdate: boolean;
  }[];
  hasUpdates: boolean;
  updateCount: number;
}

// Field Mapping Configuration
export interface ContentTypeMapping {
  [contentType: string]: FieldDefinition[];
}

export interface FieldMappingConfig {
  [applicationContext: string]: ContentTypeMapping;
}

// Field Update Operations
export interface FieldUpdate {
  fieldName: string;
  oldValue: any;
  newValue: any;
  operation: 'create' | 'update' | 'delete';
  metadata?: {
    updatedBy: 'ai' | 'user';
    timestamp: Date;
    confidence?: number;
  };
}

// Field Comparison Options
export interface FieldComparisonOptions {
  showUnchanged?: boolean;
  groupByType?: boolean;
  sortBy?: 'name' | 'type' | 'status';
  filterBy?: {
    hasChanges?: boolean;
    fieldType?: FieldDefinition['fieldType'];
    required?: boolean;
  };
}

// Field Toggle State
export interface FieldToggleState {
  fieldName: string;
  enabled: boolean;
  locked?: boolean; // Cannot be toggled
  reason?: string; // Why it's locked
}

// Field Update Result
export interface FieldUpdateResult {
  success: boolean;
  fieldName: string;
  oldValue: any;
  newValue: any;
  error?: string;
}