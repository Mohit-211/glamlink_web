// ============================================
// MODAL COMPONENT TYPE DEFINITIONS
// ============================================

import { ReactNode } from "react";
import { FieldConfig } from './forms';

// FormRenderer props - for the FormRenderer component
export interface FormRendererProps {
  fields: FieldConfig[];
  data: Record<string, any>;
  onChange: (fieldName: string, value: any) => void;
  errors?: Record<string, string>;
  fieldWrapper?: (field: FieldConfig, children: ReactNode) => ReactNode;
  className?: string;
}

// CreateModal props - for create-only modals
export interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  title: string;
  fields: FieldConfig[];
  brandId: string;
  isLoading?: boolean;
}

// Delete confirmation modal props
export interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  message: string;
  itemName?: string;
  isLoading?: boolean;
}

// Image crop modal props
export interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCrop: (cropData: any) => void;
  imageUrl: string;
  aspectRatio?: number;
  title?: string;
}

// Gallery modal props for image selection
export interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (images: string[]) => void;
  brandId: string;
  contentType?: 'product' | 'provider' | 'professional' | 'beforeafter' | 'training' | 'review';
  multiple?: boolean;
  maxImages?: number;
}

// Generic modal props
export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

// Modal state hook return type
export interface ModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

// Progress dialog props for long-running operations
export interface ProgressDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  steps: ProgressStep[];
  currentStep?: string;
  onCancel?: () => void;
}

// Progress step definition
export interface ProgressStep {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
  progress?: number; // 0-100
}