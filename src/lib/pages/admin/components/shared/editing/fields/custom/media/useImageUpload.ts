'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import storageService from '@/lib/services/firebase/storageService';
import { getImageUrl, getOriginalImageUrl, isImageObject } from './imageCropUtils';

interface UseImageUploadProps {
  value: string;
  fieldName: string;
  issueId: string;
  imageType: 'cover' | 'background' | 'content' | 'profile' | 'portrait';
  onChange: (fieldName: string, value: string) => void;
}

export interface UseImageUploadReturn {
  // State
  isUploading: boolean;
  uploadProgress: number;
  showCropModal: boolean;
  previewUrl: string;
  displayUrl: string;
  originalUrl: string;
  isFirebaseUrl: boolean;
  isReadOnly: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;

  // Object fit state (for advanced styling)
  currentObjectFit: string | undefined;
  currentPositionX: number | undefined;
  currentPositionY: number | undefined;

  // Setters
  setShowCropModal: (show: boolean) => void;
  setPreviewUrl: (url: string) => void;

  // Handlers
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleCropComplete: (croppedUrl: string, originalImageUrl: string, cropData: any) => void;
  handleUrlChange: (newUrl: string) => void;
  handleRemoveImage: () => void;
  triggerFileInput: () => void;

  // Object fit handlers (no-op for simple string URLs)
  handleObjectFitChange: (value?: string) => void;
  handleObjectPositionXChange: (value?: number) => void;
  handleObjectPositionYChange: (value?: number) => void;
}

export function useImageUpload({
  value,
  fieldName,
  issueId,
  imageType,
  onChange,
}: UseImageUploadProps): UseImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showCropModal, setShowCropModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract URLs from value (handle both string and object formats)
  const displayUrl = getImageUrl(value);
  const originalUrl = getOriginalImageUrl(value);
  const [previewUrl, setPreviewUrl] = useState<string>(displayUrl);

  // Check if URL is from Firebase Storage
  const isFirebaseUrl = displayUrl?.includes('firebasestorage.googleapis.com') || false;
  const isReadOnly = isFirebaseUrl;

  // Get current values for object fit (for image objects)
  const currentObjectFit = isImageObject(value) ? value.objectFit : undefined;
  const currentPositionX = isImageObject(value) ? value.objectPositionX : undefined;
  const currentPositionY = isImageObject(value) ? value.objectPositionY : undefined;

  // Update previewUrl when value prop changes
  useEffect(() => {
    setPreviewUrl(getImageUrl(value));
  }, [value]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Compress image if needed
      const compressedFile = file.size > 1024 * 1024
        ? await storageService.compressImage(file, 1200, 1200, 0.8)
        : file;

      // Upload to Firebase
      const timestamp = Date.now();
      const fileName = `${imageType}_${timestamp}_${file.name}`;
      const path = `admin/${imageType}/${fileName}`;

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const contentType = compressedFile instanceof Blob && compressedFile !== file
        ? compressedFile.type || file.type
        : file.type;

      const downloadUrl = await storageService.uploadImage(
        compressedFile,
        path,
        {
          contentType: contentType,
          customMetadata: {
            issueId,
            imageType,
            originalName: file.name,
            uploadedAt: new Date().toISOString()
          }
        }
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      onChange(fieldName, downloadUrl);
      setPreviewUrl(downloadUrl);

      // Store in localStorage for gallery
      const storedImages = JSON.parse(localStorage.getItem('adminImages') || '[]');
      storedImages.unshift({
        url: downloadUrl,
        path,
        imageType,
        issueId,
        uploadedAt: new Date().toISOString(),
        name: file.name
      });
      localStorage.setItem('adminImages', JSON.stringify(storedImages.slice(0, 50)));

    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [fieldName, issueId, imageType, onChange]);

  const handleCropComplete = useCallback((croppedUrl: string, originalImageUrl: string, cropData: any) => {
    onChange(fieldName, croppedUrl);
    setPreviewUrl(croppedUrl);
    setShowCropModal(false);
  }, [fieldName, onChange]);

  const handleUrlChange = useCallback((newUrl: string) => {
    if (!isReadOnly) {
      onChange(fieldName, newUrl);
      setPreviewUrl(newUrl);
    }
  }, [fieldName, onChange, isReadOnly]);

  const handleRemoveImage = useCallback(() => {
    if (confirm('Are you sure you want to remove this image? This action cannot be undone.')) {
      onChange(fieldName, '');
      setPreviewUrl('');
    }
  }, [fieldName, onChange]);

  // Object fit handlers (no-op for simple string URLs)
  const handleObjectFitChange = useCallback((value?: string) => {}, []);
  const handleObjectPositionXChange = useCallback((value?: number) => {}, []);
  const handleObjectPositionYChange = useCallback((value?: number) => {}, []);

  return {
    // State
    isUploading,
    uploadProgress,
    showCropModal,
    previewUrl,
    displayUrl,
    originalUrl,
    isFirebaseUrl,
    isReadOnly,
    fileInputRef,

    // Object fit state
    currentObjectFit,
    currentPositionX,
    currentPositionY,

    // Setters
    setShowCropModal,
    setPreviewUrl,

    // Handlers
    handleFileSelect,
    handleCropComplete,
    handleUrlChange,
    handleRemoveImage,
    triggerFileInput,

    // Object fit handlers
    handleObjectFitChange,
    handleObjectPositionXChange,
    handleObjectPositionYChange,
  };
}
