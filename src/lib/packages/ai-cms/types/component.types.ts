/**
 * Component prop type definitions
 */

import { ReactNode } from 'react';
import { AIModel, AIGenerationState } from './ai.types';
import { FieldComparison, FieldDefinition } from './field.types';
import { GenerateRequest, RefineRequest } from './request.types';

// AI Dialog Props
export interface AIDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  children?: ReactNode;
}

export interface AIMultiFieldDialogProps extends AIDialogProps {
  contentType: 'basic-info' | 'cover-config' | 'custom-section';
  currentData: Record<string, any>;
  onApply: (updates: Record<string, any>) => void;
  sectionSchema?: any; // For custom sections
  fieldDefinitions?: FieldDefinition[];
  endpoint?: string; // Optional endpoint override
}

export interface AIContentBlockDialogProps extends AIDialogProps {
  section: any; // MagazineIssueSection type
  onApply: (updates: Record<string, any>) => void;
  blockMappings?: Record<string, any>;
}

// Model Selector Props
export interface ModelSelectorProps {
  selectedModel?: AIModel;
  onModelChange?: (model: AIModel) => void;
  variant?: 'default' | 'compact' | 'detailed';
  disabled?: boolean;
  showDescription?: boolean;
  className?: string;
}

// Field Comparison Props
export interface FieldComparisonProps {
  comparisons: FieldComparison[];
  onToggleField: (fieldName: string) => void;
  onToggleAll: (selected: boolean) => void;
  showHeader?: boolean;
  maxHeight?: string;
  groupByType?: boolean;
}

// Field Toggle Props
export interface FieldToggleProps {
  field: FieldComparison;
  onToggle: (fieldName: string) => void;
  disabled?: boolean;
  showPreview?: boolean;
  maxPreviewLength?: number;
}

// AI Tab Props
export interface AITabProps {
  section: any; // Partial<MagazineIssueSection>
  onUpdate: (updates: any) => void; // Partial<MagazineIssueSection>
  sectionSchema?: any;
  disabled?: boolean;
}

// AI Generation Hook Props
export interface UseAIGenerationProps {
  contentType: string;
  model?: AIModel;
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
  autoSave?: boolean;
}

// AI Model Hook Props
export interface UseAIModelProps {
  defaultModel?: AIModel;
  persistToStorage?: boolean;
  storageKey?: string;
}

// Field Comparison Hook Props
export interface UseFieldComparisonProps {
  originalData: Record<string, any>;
  generatedData: Record<string, any>;
  fieldDefinitions: FieldDefinition[];
  autoSelectChanged?: boolean;
}

// Refinement Hook Props
export interface UseRefinementProps {
  initialContent: Record<string, any>;
  maxIterations?: number;
  autoSave?: boolean;
  onIterationComplete?: (iteration: number, result: any) => void;
}

// Prompt History Hook Props
export interface UsePromptHistoryProps {
  maxHistory?: number;
  persistToStorage?: boolean;
  storageKey?: string;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
  canCancel?: boolean;
}

// Error States
export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string;
  retry?: () => void;
  dismiss?: () => void;
}

// Generation Progress
export interface GenerationProgress {
  stage: 'preparing' | 'generating' | 'processing' | 'validating' | 'complete';
  progress: number; // 0-100
  message: string;
  estimatedTimeRemaining?: number;
}

// AI Button Props
export interface AIButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
  className?: string;
}