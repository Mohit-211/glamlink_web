// Types
export interface BaseFieldProps {
  fieldKey: string;
  config: any;
  value: any;
  onChange: (fieldKey: string, value: any) => void;
  onBlur?: (fieldKey: string) => void;
  onFocus?: (fieldKey: string) => void;
  error?: string;
  disabled?: boolean;
}

// Field components exports
export { default as TextField } from './TextField';
export { default as TextareaField } from './TextareaField';
export { default as FileUploadField } from './FileUploadField';
export { default as InputListField } from './InputListField';
export { default as CheckboxListField } from './CheckboxListField';
export { default as RadioListField } from './RadioListField';

// New specialized field components
export { default as EmailField } from './EmailField';
export { default as CharacterCountField } from './CharacterCountField';
export { default as FileUploadWithTitleField } from './FileUploadWithTitleField';
export { default as CheckboxField } from './CheckboxField';
export { default as CheckboxOptionField } from './CheckboxOptionField';
export { default as RadioOptionField } from './RadioOptionField';
export { default as MultiCheckboxField } from './MultiCheckboxField';
export { default as SelectField } from './SelectField';
export { default as PhoneField } from './PhoneField';
export { default as TiptapField } from './TiptapField';