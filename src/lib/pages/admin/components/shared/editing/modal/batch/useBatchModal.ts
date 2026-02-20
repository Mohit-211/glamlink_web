'use client';

import { useState, useCallback, useRef } from 'react';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  itemCount?: number;
}

export interface UploadResult {
  success: boolean;
  message: string;
  count?: number;
}

export interface UseBatchModalConfig {
  itemTypeName: string;
  sampleData?: any[];
  currentData?: any[];
  maxFileSize?: number;
  onUpload: (data: any[]) => Promise<void>;
  onClose: () => void;
}

export interface UseBatchModalReturn {
  // State
  activeTab: 'upload' | 'editor';
  jsonInput: string;
  uploadedFile: File | null;
  parsedData: any[] | null;
  validation: ValidationResult | null;
  isUploading: boolean;
  uploadResult: UploadResult | null;
  formatAsTypeScript: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;

  // Handlers
  setActiveTab: (tab: 'upload' | 'editor') => void;
  setFormatAsTypeScript: (value: boolean) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleJsonInputChange: (value: string) => void;
  loadSampleData: () => void;
  loadCurrentData: () => void;
  copyToClipboard: () => Promise<void>;
  handleUpload: () => Promise<void>;
  handleClose: () => void;
}

/**
 * useBatchModal - Hook for BatchModal state and handlers
 *
 * Handles:
 * - Tab state (upload/editor)
 * - File upload and parsing
 * - JSON input validation
 * - Sample/current data loading
 * - Upload execution
 */
export function useBatchModal({
  itemTypeName,
  sampleData,
  currentData,
  maxFileSize = 5,
  onUpload,
  onClose,
}: UseBatchModalConfig): UseBatchModalReturn {
  const [activeTab, setActiveTab] = useState<'upload' | 'editor'>('upload');
  const [jsonInput, setJsonInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[] | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [formatAsTypeScript, setFormatAsTypeScript] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateJsonData = useCallback((data: any): ValidationResult => {
    if (!Array.isArray(data)) {
      return { isValid: false, error: 'Data must be an array of objects' };
    }

    if (data.length === 0) {
      return { isValid: false, error: 'Array cannot be empty' };
    }

    // Basic validation - each item should be an object with an id
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (typeof item !== 'object' || item === null) {
        return { isValid: false, error: `Item ${i + 1} is not a valid object` };
      }
      if (!item.id) {
        return { isValid: false, error: `Item ${i + 1} is missing required 'id' field` };
      }
    }

    return { isValid: true, itemCount: data.length };
  }, []);

  const parseJsonInput = useCallback((input: string): ValidationResult => {
    try {
      const data = JSON.parse(input);
      const validationResult = validateJsonData(data);
      if (validationResult.isValid) {
        setParsedData(data);
        return validationResult;
      } else {
        setParsedData(null);
        return validationResult;
      }
    } catch (error) {
      setParsedData(null);
      return { isValid: false, error: 'Invalid JSON format: ' + (error instanceof Error ? error.message : 'Unknown error') };
    }
  }, [validateJsonData]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      setValidation({ isValid: false, error: `File size (${fileSizeMB.toFixed(1)}MB) exceeds maximum (${maxFileSize}MB)` });
      return;
    }

    // Check file type
    if (!file.type.includes('json') && !file.name.endsWith('.json')) {
      setValidation({ isValid: false, error: 'File must be a JSON file' });
      return;
    }

    setUploadedFile(file);
    setValidation(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonInput(content);
      const validationResult = parseJsonInput(content);
      setValidation(validationResult);
    };
    reader.readAsText(file);
  }, [maxFileSize, parseJsonInput]);

  const handleJsonInputChange = useCallback((value: string) => {
    setJsonInput(value);
    setUploadedFile(null);

    if (value.trim()) {
      const validationResult = parseJsonInput(value);
      setValidation(validationResult);
    } else {
      setValidation(null);
      setParsedData(null);
    }
  }, [parseJsonInput]);

  const loadSampleData = useCallback(() => {
    if (!sampleData || sampleData.length === 0) {
      setValidation({ isValid: false, error: 'No sample data available' });
      return;
    }
    const formattedData = JSON.stringify(sampleData, null, 2);
    handleJsonInputChange(formattedData);
  }, [sampleData, handleJsonInputChange]);

  const loadCurrentData = useCallback(() => {
    if (!currentData || currentData.length === 0) {
      setValidation({ isValid: false, error: `No current ${itemTypeName.toLowerCase()} data available` });
      return;
    }
    if (formatAsTypeScript) {
      const varName = `sample${itemTypeName}Data`;
      const formattedData = `export const ${varName} = ${JSON.stringify(currentData, null, 2)};`;
      setJsonInput(formattedData);
      setValidation(null);
      setParsedData(null);
    } else {
      const formattedData = JSON.stringify(currentData, null, 2);
      handleJsonInputChange(formattedData);
    }
  }, [currentData, itemTypeName, formatAsTypeScript, handleJsonInputChange]);

  const copyToClipboard = useCallback(async () => {
    if (!jsonInput) return;
    try {
      await navigator.clipboard.writeText(jsonInput);
      // Brief visual feedback could be added here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }, [jsonInput]);

  const handleUpload = useCallback(async () => {
    if (!parsedData || !validation?.isValid) {
      setUploadResult({ success: false, message: 'Please fix validation errors before uploading' });
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      await onUpload(parsedData);
      setUploadResult({
        success: true,
        message: `Successfully uploaded ${validation.itemCount} ${itemTypeName}`,
        count: validation.itemCount
      });

      // Auto-close after 2 seconds on success
      setTimeout(() => {
        handleCloseInternal();
      }, 2000);
    } catch (error) {
      setUploadResult({
        success: false,
        message: error instanceof Error ? error.message : 'Upload failed'
      });
    } finally {
      setIsUploading(false);
    }
  }, [parsedData, validation, onUpload, itemTypeName]);

  const handleCloseInternal = useCallback(() => {
    // Reset all state
    setActiveTab('upload');
    setJsonInput('');
    setUploadedFile(null);
    setParsedData(null);
    setValidation(null);
    setIsUploading(false);
    setUploadResult(null);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    onClose();
  }, [onClose]);

  return {
    // State
    activeTab,
    jsonInput,
    uploadedFile,
    parsedData,
    validation,
    isUploading,
    uploadResult,
    formatAsTypeScript,
    fileInputRef,

    // Handlers
    setActiveTab,
    setFormatAsTypeScript,
    handleFileUpload,
    handleJsonInputChange,
    loadSampleData,
    loadCurrentData,
    copyToClipboard,
    handleUpload,
    handleClose: handleCloseInternal,
  };
}
