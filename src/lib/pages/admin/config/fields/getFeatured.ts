// ============================================
// GET FEATURED FIELD CONFIGURATIONS
// ============================================

import { FieldConfig } from "@/lib/pages/admin/types";

// =============================================================================
// CONSTANTS
// =============================================================================

export const SUBMISSION_STATUS_OPTIONS = [
  { value: 'pending_review', label: 'Pending Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' }
];

export const FORM_TYPE_OPTIONS = [
  { value: 'cover', label: 'Cover Feature' },
  { value: 'local-spotlight', label: 'Local Spotlight' },
  { value: 'rising-star', label: 'Rising Star' },
  { value: 'top-treatment', label: 'Top Treatment' },
  { value: 'profile-only', label: 'Profile Only' }
];

export const FORM_FIELD_TYPE_OPTIONS = [
  { value: 'text', label: 'Text Input' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Phone' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'select', label: 'Dropdown Select' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'multi-checkbox', label: 'Multi-Select Checkboxes' },
  { value: 'file-upload', label: 'File Upload' },
  { value: 'bullet-array', label: 'Bullet Point List' }
];

export const FORM_ICON_OPTIONS = [
  { value: 'star', label: '⭐ Star' },
  { value: 'location', label: '📍 Location' },
  { value: 'rocket', label: '🚀 Rocket' },
  { value: 'sparkles', label: '✨ Sparkles' },
  { value: 'trophy', label: '🏆 Trophy' },
  { value: 'heart', label: '❤️ Heart' }
];

export const SECTION_LAYOUT_OPTIONS = [
  { value: 'single', label: 'Single Column' },
  { value: 'grid', label: 'Two Column Grid' }
];

// =============================================================================
// SUBMISSION VIEW FIELDS (Read-only display in modal)
// =============================================================================

/**
 * Fields for viewing submission details in modal
 * These are display-only fields for the SubmissionViewModal
 */
export const submissionViewFields: FieldConfig[] = [
  {
    name: 'fullName',
    label: 'Full Name',
    type: 'text',
    disabled: true
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    disabled: true
  },
  {
    name: 'phone',
    label: 'Phone Number',
    type: 'tel',
    disabled: true
  },
  {
    name: 'businessName',
    label: 'Business Name',
    type: 'text',
    disabled: true
  },
  {
    name: 'businessAddress',
    label: 'Business Address',
    type: 'text',
    disabled: true
  },
  {
    name: 'instagramHandle',
    label: 'Instagram Handle',
    type: 'text',
    disabled: true
  },
  {
    name: 'website',
    label: 'Website',
    type: 'url',
    disabled: true
  },
  {
    name: 'formType',
    label: 'Application Type',
    type: 'select',
    options: FORM_TYPE_OPTIONS,
    disabled: true
  },
  {
    name: 'status',
    label: 'Review Status',
    type: 'select',
    options: SUBMISSION_STATUS_OPTIONS,
    disabled: false
  }
];

// =============================================================================
// FORM CONFIG EDIT FIELDS (For FormConfigModal)
// =============================================================================

/**
 * Basic form configuration fields
 */
export const formConfigBasicFields: FieldConfig[] = [
  {
    name: 'id',
    label: 'Form ID',
    type: 'text',
    required: true,
    disabled: true,
    placeholder: 'e.g., cover, local-spotlight',
    helperText: 'Unique identifier (cannot be changed after creation)'
  },
  {
    name: 'title',
    label: 'Form Title',
    type: 'text',
    required: true,
    placeholder: 'e.g., Cover Feature Application'
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    required: true,
    rows: 3,
    placeholder: 'Describe what this form is for...'
  },
  {
    name: 'icon',
    label: 'Icon',
    type: 'select',
    options: FORM_ICON_OPTIONS,
    required: true
  },
  {
    name: 'bannerColor',
    label: 'Banner Color',
    type: 'text',
    placeholder: 'e.g., bg-gradient-to-r from-purple-600 to-pink-600',
    helperText: 'Tailwind CSS gradient classes'
  },
  {
    name: 'enabled',
    label: 'Form Enabled',
    type: 'checkbox',
    checkboxLabel: 'Allow new submissions for this form'
  },
  {
    name: 'order',
    label: 'Display Order',
    type: 'number',
    min: 1,
    max: 100
  }
];

/**
 * Section configuration fields (nested within form config)
 */
export const formSectionFields: FieldConfig[] = [
  {
    name: 'title',
    label: 'Section Title',
    type: 'text',
    required: true,
    placeholder: 'e.g., Your Story'
  },
  {
    name: 'description',
    label: 'Section Description',
    type: 'textarea',
    rows: 2,
    placeholder: 'Brief description of this section...'
  },
  {
    name: 'layout',
    label: 'Section Layout',
    type: 'select',
    options: SECTION_LAYOUT_OPTIONS
  },
  {
    name: 'order',
    label: 'Display Order',
    type: 'number',
    min: 1,
    max: 50
  }
];

/**
 * Individual field configuration within a section
 */
export const formFieldConfigFields: FieldConfig[] = [
  {
    name: 'name',
    label: 'Field Key',
    type: 'text',
    required: true,
    placeholder: 'e.g., bio, workPhotos',
    helperText: 'Unique key used in form data'
  },
  {
    name: 'label',
    label: 'Field Label',
    type: 'text',
    required: true,
    placeholder: 'e.g., Your Bio'
  },
  {
    name: 'type',
    label: 'Field Type',
    type: 'select',
    options: FORM_FIELD_TYPE_OPTIONS,
    required: true
  },
  {
    name: 'required',
    label: 'Required Field',
    type: 'checkbox',
    checkboxLabel: 'This field must be filled out'
  },
  {
    name: 'placeholder',
    label: 'Placeholder Text',
    type: 'text',
    placeholder: 'Text shown when field is empty...'
  },
  {
    name: 'helperText',
    label: 'Helper Text',
    type: 'text',
    placeholder: 'Additional guidance for the user...'
  },
  {
    name: 'maxLength',
    label: 'Max Length',
    type: 'number',
    min: 1,
    helperText: 'For text/textarea fields'
  },
  {
    name: 'rows',
    label: 'Textarea Rows',
    type: 'number',
    min: 1,
    max: 20,
    helperText: 'For textarea fields only'
  },
  {
    name: 'maxPoints',
    label: 'Max Bullet Points',
    type: 'number',
    min: 1,
    max: 10,
    helperText: 'For bullet-array fields'
  },
  {
    name: 'columns',
    label: 'Checkbox Columns',
    type: 'number',
    min: 1,
    max: 4,
    helperText: 'For multi-checkbox fields'
  },
  {
    name: 'minSelections',
    label: 'Min Selections',
    type: 'number',
    min: 0,
    helperText: 'For multi-checkbox fields'
  },
  {
    name: 'maxSelections',
    label: 'Max Selections',
    type: 'number',
    min: 1,
    helperText: 'For multi-checkbox fields'
  },
  {
    name: 'order',
    label: 'Display Order',
    type: 'number',
    min: 1,
    max: 100
  }
];

/**
 * Field validation configuration
 */
export const fieldValidationFields: FieldConfig[] = [
  {
    name: 'required',
    label: 'Required',
    type: 'checkbox',
    checkboxLabel: 'Field must be filled'
  },
  {
    name: 'minLength',
    label: 'Min Length',
    type: 'number',
    min: 0,
    helperText: 'Minimum number of characters'
  },
  {
    name: 'maxLength',
    label: 'Max Length',
    type: 'number',
    min: 1,
    helperText: 'Maximum number of characters'
  },
  {
    name: 'minChars',
    label: 'Min Chars (Display)',
    type: 'number',
    min: 0,
    helperText: 'Explicit minimum for error messages'
  },
  {
    name: 'pattern',
    label: 'Regex Pattern',
    type: 'text',
    placeholder: '^[a-zA-Z]+$',
    helperText: 'Regular expression for validation'
  },
  {
    name: 'minFiles',
    label: 'Min Files',
    type: 'number',
    min: 0,
    helperText: 'For file upload fields'
  },
  {
    name: 'maxFiles',
    label: 'Max Files',
    type: 'number',
    min: 1,
    helperText: 'For file upload fields'
  },
  {
    name: 'maxSize',
    label: 'Max File Size (MB)',
    type: 'number',
    min: 1,
    max: 100,
    helperText: 'Maximum file size in megabytes'
  },
  {
    name: 'accept',
    label: 'Accepted File Types',
    type: 'text',
    placeholder: 'image/*,video/*',
    helperText: 'MIME types for file upload'
  },
  {
    name: 'message',
    label: 'Error Message',
    type: 'text',
    placeholder: 'Custom error message...'
  }
];

/**
 * Field option configuration (for select, radio, checkbox)
 */
export const fieldOptionFields: FieldConfig[] = [
  {
    name: 'id',
    label: 'Option ID',
    type: 'text',
    required: true,
    placeholder: 'e.g., hair_stylist'
  },
  {
    name: 'label',
    label: 'Option Label',
    type: 'text',
    required: true,
    placeholder: 'e.g., Hair Stylist'
  },
  {
    name: 'description',
    label: 'Option Description',
    type: 'text',
    placeholder: 'Optional description...'
  }
];

// =============================================================================
// DEFAULT VALUES
// =============================================================================

/**
 * Default values for a new form configuration
 */
export const getDefaultFormConfigValues = () => ({
  id: '',
  title: '',
  description: '',
  icon: 'star',
  bannerColor: 'bg-gradient-to-r from-purple-600 to-pink-600',
  enabled: true,
  order: 1,
  sections: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

/**
 * Default values for a new section
 */
export const getDefaultSectionValues = () => ({
  id: `section_${Date.now()}`,
  title: '',
  description: '',
  fields: [],
  layout: 'single' as const,
  order: 1
});

/**
 * Default values for a new field configuration
 */
export const getDefaultFieldConfigValues = () => ({
  id: `field_${Date.now()}`,
  name: '',
  type: 'text' as const,
  label: '',
  required: false,
  placeholder: '',
  helperText: '',
  validation: {},
  options: [],
  order: 1
});

/**
 * Default values for field validation
 */
export const getDefaultValidationValues = () => ({
  required: false,
  minLength: undefined,
  maxLength: undefined,
  minChars: undefined,
  pattern: undefined,
  minFiles: undefined,
  maxFiles: undefined,
  maxSize: undefined,
  accept: undefined,
  message: ''
});

/**
 * Default values for a field option
 */
export const getDefaultOptionValues = () => ({
  id: `opt_${Date.now()}`,
  label: '',
  description: ''
});
