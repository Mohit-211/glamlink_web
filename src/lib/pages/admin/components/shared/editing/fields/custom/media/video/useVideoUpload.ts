'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import storageService from '@/lib/services/firebase/storageService';

export type VideoSourceType = 'none' | 'file' | 'youtube';

interface UseVideoUploadProps {
  value: string;
  fieldName: string;
  issueId: string;
  onChange: (fieldName: string, value: string) => void;
}

export interface UseVideoUploadReturn {
  // State
  isUploading: boolean;
  uploadProgress: number;
  previewUrl: string;
  videoType: VideoSourceType;
  isFirebaseUrl: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  error: string | null;

  // Setters
  setPreviewUrl: (url: string) => void;
  setVideoType: (type: VideoSourceType) => void;
  setError: (error: string | null) => void;

  // Handlers
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleUrlChange: (newUrl: string) => void;
  handleRemoveVideo: () => void;
  triggerFileInput: () => void;
}

// YouTube URL patterns
const YOUTUBE_PATTERNS = [
  /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
  /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
];

export function extractYouTubeId(url: string): string | null {
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

export function isYouTubeUrl(url: string): boolean {
  return YOUTUBE_PATTERNS.some(pattern => pattern.test(url));
}

// Alias for compatibility
export const extractYouTubeVideoId = extractYouTubeId;

/**
 * Get YouTube thumbnail URL
 */
export function getYouTubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

/**
 * Extract a frame from a video URL
 */
export function extractVideoFrame(videoUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.preload = 'metadata';

    video.onloadeddata = () => {
      video.currentTime = 0;
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        ctx.drawImage(video, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      } catch (err) {
        reject(err);
      }
    };

    video.onerror = () => reject(new Error('Failed to load video'));
    video.src = videoUrl;
    video.load();
  });
}

/**
 * Extract a frame from a video File object
 */
export function extractVideoFrameFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.muted = true;
    video.preload = 'metadata';
    const objectUrl = URL.createObjectURL(file);

    video.onloadeddata = () => {
      video.currentTime = 0;
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Could not get canvas context'));
          return;
        }
        ctx.drawImage(video, 0, 0);
        URL.revokeObjectURL(objectUrl);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load video'));
    };
    video.src = objectUrl;
    video.load();
  });
}

/**
 * Download an image URL and return as a File
 */
export async function downloadImageAsFile(url: string, filename: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
}

/**
 * Convert a data URL to a File object
 */
export function dataURLtoFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export function useVideoUpload({
  value,
  fieldName,
  issueId,
  onChange,
}: UseVideoUploadProps): UseVideoUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine video type from value
  const isFirebaseUrl = value?.includes('firebasestorage.googleapis.com') || false;
  const isYouTube = value ? isYouTubeUrl(value) : false;
  const [videoType, setVideoType] = useState<VideoSourceType>(() => {
    if (!value) return 'none';
    if (isYouTube) return 'youtube';
    return 'file';
  });

  const [previewUrl, setPreviewUrl] = useState<string>(value || '');

  // Update previewUrl when value prop changes
  useEffect(() => {
    setPreviewUrl(value || '');
    if (!value) {
      setVideoType('none');
    } else if (isYouTubeUrl(value)) {
      setVideoType('youtube');
    } else {
      setVideoType('file');
    }
  }, [value]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file type
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/mov'];
    if (!validTypes.some(type => file.type.includes(type.split('/')[1]))) {
      setError('Please select a valid video file (MP4, WebM, or MOV)');
      return;
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Video size must be less than 100MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload to Firebase
      const timestamp = Date.now();
      const extension = file.name.split('.').pop() || 'mp4';
      const fileName = `video_${timestamp}.${extension}`;
      const path = `admin/videos/${issueId}/${fileName}`;

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 5, 90));
      }, 200);

      const downloadUrl = await storageService.uploadImage(
        file,
        path,
        {
          contentType: file.type,
          customMetadata: {
            issueId,
            originalName: file.name,
            uploadedAt: new Date().toISOString(),
            fileType: 'video'
          }
        }
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      onChange(fieldName, downloadUrl);
      setPreviewUrl(downloadUrl);
      setVideoType('file');

      // Store in localStorage for potential gallery feature
      const storedVideos = JSON.parse(localStorage.getItem('adminVideos') || '[]');
      storedVideos.unshift({
        url: downloadUrl,
        path,
        issueId,
        uploadedAt: new Date().toISOString(),
        name: file.name
      });
      localStorage.setItem('adminVideos', JSON.stringify(storedVideos.slice(0, 20)));

    } catch (error) {
      console.error('Error uploading video:', error);
      setError('Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [fieldName, issueId, onChange]);

  const handleUrlChange = useCallback((newUrl: string) => {
    setError(null);

    // If it's a YouTube URL, validate it
    if (newUrl && !isYouTubeUrl(newUrl) && newUrl.includes('youtube') || newUrl.includes('youtu.be')) {
      setError('Invalid YouTube URL format');
      return;
    }

    onChange(fieldName, newUrl);
    setPreviewUrl(newUrl);

    if (newUrl && isYouTubeUrl(newUrl)) {
      setVideoType('youtube');
    }
  }, [fieldName, onChange]);

  const handleRemoveVideo = useCallback(() => {
    if (confirm('Are you sure you want to remove this video?')) {
      onChange(fieldName, '');
      setPreviewUrl('');
      setVideoType('none');
      setError(null);
    }
  }, [fieldName, onChange]);

  return {
    // State
    isUploading,
    uploadProgress,
    previewUrl,
    videoType,
    isFirebaseUrl,
    fileInputRef,
    error,

    // Setters
    setPreviewUrl,
    setVideoType,
    setError,

    // Handlers
    handleFileSelect,
    handleUrlChange,
    handleRemoveVideo,
    triggerFileInput,
  };
}
