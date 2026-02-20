'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import type { Crop, PixelCrop } from 'react-image-crop';
import { base64ToFile, createImage } from './imageCropUtils';
import storageService from '@/lib/services/firebase/storageService';

interface UseImageCropModalProps {
  imageUrl: string;
  issueId: string;
  imageType: 'cover' | 'background' | 'content' | 'profile' | 'portrait';
  fieldName: string;
  onCropComplete: (croppedUrl: string, originalUrl: string, cropData: any) => void;
  customAspectRatio?: { ratio: number; label: string } | null;
  hideFreeOption?: boolean;
}

/**
 * Get proxied URL for Firebase Storage images to bypass CORS
 */
function getProxiedImageUrl(url: string): string {
  if (url.includes('firebasestorage.googleapis.com')) {
    return `/api/magazine/image-proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
}

export interface UseImageCropModalReturn {
  // State
  crop: Crop;
  completedCrop: PixelCrop | undefined;
  isProcessing: boolean;
  aspectRatioValue: number | undefined;
  selectedAspectRatio: string;
  cropWidth: number;
  cropHeight: number;
  imageWidth: number;
  imageHeight: number;
  imgRef: React.RefObject<HTMLImageElement | null>;
  scale: number;
  rotate: number;
  displayImageUrl: string;

  // Setters
  setCrop: (crop: Crop) => void;
  setCompletedCrop: (crop: PixelCrop | undefined) => void;
  setScale: (scale: number) => void;
  setRotate: (rotate: number) => void;

  // Handlers
  onImageLoad: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  handleDimensionChange: (dimension: 'width' | 'height', value: number) => void;
  handleAspectRatioChange: (ratioKey: string) => void;
  handleApplyCrop: () => Promise<void>;
  setFullImage: () => void;

  // Constants
  commonAspectRatios: { name: string; key: string; ratio: number | undefined }[];
}

export function useImageCropModal({
  imageUrl,
  issueId,
  imageType,
  fieldName,
  onCropComplete,
  customAspectRatio,
  hideFreeOption = false,
}: UseImageCropModalProps): UseImageCropModalReturn {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('free');
  const [imageWidth, setImageWidth] = useState<number>(1920);
  const [imageHeight, setImageHeight] = useState<number>(1080);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  // Compute aspect ratio value from selected key
  const aspectRatioValue = useMemo(() => {
    if (selectedAspectRatio === 'free' || selectedAspectRatio === 'all') {
      return undefined;
    }
    const parts = selectedAspectRatio.split(':');
    if (parts.length === 2) {
      return Number(parts[0]) / Number(parts[1]);
    }
    if (selectedAspectRatio === 'custom' && customAspectRatio) {
      return customAspectRatio.ratio;
    }
    return undefined;
  }, [selectedAspectRatio, customAspectRatio]);

  // Crop dimensions in pixels
  const cropWidth = Math.round(completedCrop?.width || 0);
  const cropHeight = Math.round(completedCrop?.height || 0);

  const commonAspectRatios = useMemo(() => {
    const baseRatios: { name: string; key: string; ratio: number | undefined }[] = [];

    if (!hideFreeOption) {
      baseRatios.push({ name: 'Free', key: 'free', ratio: undefined });
    }

    // Add "All (Full Image)" option at the top
    baseRatios.push({ name: 'All (Full Image)', key: 'all', ratio: undefined });

    baseRatios.push(
      { name: '1:1', key: '1:1', ratio: 1 },
      { name: '4:3', key: '4:3', ratio: 4 / 3 },
      { name: '16:9', key: '16:9', ratio: 16 / 9 },
      { name: '9:16', key: '9:16', ratio: 9 / 16 },
      { name: '3:2', key: '3:2', ratio: 3 / 2 },
      { name: '2:3', key: '2:3', ratio: 2 / 3 }
    );

    if (customAspectRatio && customAspectRatio.ratio > 0) {
      baseRatios.push({
        name: customAspectRatio.label,
        key: 'custom',
        ratio: customAspectRatio.ratio
      });
    }

    return baseRatios;
  }, [customAspectRatio, hideFreeOption]);

  // Set full image crop (All option)
  const setFullImage = useCallback(() => {
    if (!imgRef.current) return;

    const img = imgRef.current;
    const newCrop: Crop = {
      unit: 'px',
      x: 0,
      y: 0,
      width: img.width,
      height: img.height,
    };
    setCrop(newCrop);
    setCompletedCrop({
      unit: 'px',
      x: 0,
      y: 0,
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
    setSelectedAspectRatio('all');
  }, []);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageWidth(img.naturalWidth);
    setImageHeight(img.naturalHeight);

    // Set initial crop to center 80% of image
    const width = img.width * 0.8;
    const height = img.height * 0.8;
    const x = (img.width - width) / 2;
    const y = (img.height - height) / 2;

    const initialCrop: Crop = {
      unit: 'px',
      x,
      y,
      width,
      height,
    };
    setCrop(initialCrop);

    // Calculate pixel crop based on display to natural ratio
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    setCompletedCrop({
      unit: 'px',
      x: Math.round(x * scaleX),
      y: Math.round(y * scaleY),
      width: Math.round(width * scaleX),
      height: Math.round(height * scaleY),
    });
  }, []);

  // Handle dimension changes - update crop in real-time
  const handleDimensionChange = useCallback((dimension: 'width' | 'height', value: number) => {
    if (!imgRef.current || !completedCrop) return;

    const img = imgRef.current;
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;

    // Clamp value to image bounds
    const clampedValue = Math.max(10, Math.min(
      value,
      dimension === 'width' ? imageWidth : imageHeight
    ));

    let newWidth = completedCrop.width;
    let newHeight = completedCrop.height;
    let newX = completedCrop.x;
    let newY = completedCrop.y;

    if (dimension === 'width') {
      newWidth = clampedValue;
      // If aspect ratio locked, adjust height
      if (aspectRatioValue) {
        newHeight = Math.round(newWidth / aspectRatioValue);
      }
    } else {
      newHeight = clampedValue;
      // If aspect ratio locked, adjust width
      if (aspectRatioValue) {
        newWidth = Math.round(newHeight * aspectRatioValue);
      }
    }

    // Ensure crop stays within bounds
    if (newX + newWidth > imageWidth) {
      newX = Math.max(0, imageWidth - newWidth);
    }
    if (newY + newHeight > imageHeight) {
      newY = Math.max(0, imageHeight - newHeight);
    }

    // Update completed crop (pixel values)
    setCompletedCrop({
      unit: 'px',
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
    });

    // Update visual crop (display values)
    setCrop({
      unit: 'px',
      x: newX / scaleX,
      y: newY / scaleY,
      width: newWidth / scaleX,
      height: newHeight / scaleY,
    });
  }, [completedCrop, imageWidth, imageHeight, aspectRatioValue]);

  const handleAspectRatioChange = useCallback((ratioKey: string) => {
    setSelectedAspectRatio(ratioKey);

    if (ratioKey === 'all') {
      setFullImage();
      return;
    }

    if (!imgRef.current || !completedCrop) return;

    // If switching to a fixed aspect ratio, adjust the crop
    if (ratioKey !== 'free') {
      const ratio = commonAspectRatios.find(r => r.key === ratioKey)?.ratio;
      if (ratio) {
        const img = imgRef.current;
        const scaleX = img.naturalWidth / img.width;
        const scaleY = img.naturalHeight / img.height;

        // Calculate new dimensions maintaining the aspect ratio
        let newWidth = completedCrop.width;
        let newHeight = Math.round(newWidth / ratio);

        // If height exceeds image, scale down
        if (newHeight > imageHeight) {
          newHeight = imageHeight;
          newWidth = Math.round(newHeight * ratio);
        }
        if (newWidth > imageWidth) {
          newWidth = imageWidth;
          newHeight = Math.round(newWidth / ratio);
        }

        // Center the crop
        const newX = Math.max(0, Math.min(completedCrop.x, imageWidth - newWidth));
        const newY = Math.max(0, Math.min(completedCrop.y, imageHeight - newHeight));

        setCompletedCrop({
          unit: 'px',
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        });

        setCrop({
          unit: 'px',
          x: newX / scaleX,
          y: newY / scaleY,
          width: newWidth / scaleX,
          height: newHeight / scaleY,
        });
      }
    }
  }, [completedCrop, imageWidth, imageHeight, commonAspectRatios, setFullImage]);

  const handleApplyCrop = useCallback(async () => {
    if (!completedCrop || !imgRef.current) return;

    setIsProcessing(true);
    try {
      // Create canvas for cropping
      const image = imgRef.current;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No 2d context');

      // Calculate scale from display size to natural size
      // ReactCrop gives us coordinates in display pixels, but ctx.drawImage needs natural pixels
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      // Convert display coordinates to natural image coordinates
      const naturalCrop = {
        x: Math.round(completedCrop.x * scaleX),
        y: Math.round(completedCrop.y * scaleY),
        width: Math.round(completedCrop.width * scaleX),
        height: Math.round(completedCrop.height * scaleY),
      };

      // Set canvas size to cropped dimensions (in natural pixels)
      canvas.width = naturalCrop.width;
      canvas.height = naturalCrop.height;

      // Handle rotation
      const rotateRads = rotate * (Math.PI / 180);
      const scaleMultiplier = scale;

      // If there's rotation, we need more complex handling
      if (rotate !== 0) {
        const centerX = naturalCrop.width / 2;
        const centerY = naturalCrop.height / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate(rotateRads);
        ctx.scale(scaleMultiplier, scaleMultiplier);
        ctx.translate(-centerX, -centerY);
      }

      // Draw the cropped portion using natural coordinates
      ctx.drawImage(
        image,
        naturalCrop.x,
        naturalCrop.y,
        naturalCrop.width,
        naturalCrop.height,
        0,
        0,
        naturalCrop.width,
        naturalCrop.height
      );

      // Convert to base64
      const croppedImage = canvas.toDataURL('image/jpeg', 0.9);

      // Upload cropped image to Firebase
      const timestamp = Date.now();
      const fileName = `${imageType}_${fieldName}_cropped_${timestamp}.jpg`;
      const path = `admin/${imageType}/cropped/${fileName}`;

      const file = base64ToFile(croppedImage, fileName);

      const downloadUrl = await storageService.uploadImage(
        file,
        path,
        {
          contentType: 'image/jpeg',
          customMetadata: {
            issueId,
            imageType,
            fieldName,
            cropped: 'true',
            originalUrl: imageUrl,
            uploadedAt: new Date().toISOString(),
            cropData: JSON.stringify({
              crop: naturalCrop,
              scale,
              rotate,
            })
          }
        }
      );

      onCropComplete(downloadUrl, imageUrl, {
        crop: naturalCrop,
        scale,
        rotate,
      });

    } catch (error) {
      console.error('Error cropping image:', error);
      alert('Failed to crop image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [completedCrop, rotate, scale, imageUrl, onCropComplete, issueId, imageType, fieldName]);

  // Create proxied URL for display
  const displayImageUrl = useMemo(() => getProxiedImageUrl(imageUrl), [imageUrl]);

  return {
    // State
    crop: crop || { unit: 'px', x: 0, y: 0, width: 100, height: 100 },
    completedCrop,
    isProcessing,
    aspectRatioValue,
    selectedAspectRatio,
    cropWidth,
    cropHeight,
    imageWidth,
    imageHeight,
    imgRef,
    scale,
    rotate,
    displayImageUrl,

    // Setters
    setCrop,
    setCompletedCrop,
    setScale,
    setRotate,

    // Handlers
    onImageLoad,
    handleDimensionChange,
    handleAspectRatioChange,
    handleApplyCrop,
    setFullImage,

    // Constants
    commonAspectRatios,
  };
}
