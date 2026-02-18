import type { FieldDefinition } from '../../config/content-discovery';

export interface FieldComponentProps {
  field: FieldDefinition;
  value: any;
  onChange: (value: any) => void;
  issueId?: string;
  allProps?: Record<string, any>;
  onPropChange?: (propName: string, value: any) => void;
  /** Whether a paired typography field exists (e.g., titleTypography for title field) */
  hasTypographyField?: boolean;
}

export interface EnhancedFieldRendererProps extends FieldComponentProps {
  /** All field definitions for the current component (used to detect paired typography fields) */
  allFields?: FieldDefinition[];
}
