"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import storageService from "@/lib/services/firebase/storageService";

interface GalleryItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  thumbnail?: string;
  caption?: string;
  duration?: string;
  uploadedAt?: string;
  isThumbnail?: boolean;
  thumbnailFrameTime?: number; // The frame time in seconds for the thumbnail
}

interface UseGalleryFieldProps {
  value: GalleryItem[];
  fieldName: string;
  onChange: (fieldName: string, value: GalleryItem[]) => void;
}

export interface UseGalleryFieldReturn {
  // State
  gallery: GalleryItem[];
  isUploading: boolean;
  uploadProgress: number;
  fileInputRef: React.RefObject<HTMLInputElement | null>;

  // Handlers
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRemoveItem: (id: string) => void;
  handleCaptionChange: (id: string, caption: string) => void;
  handleThumbnailFrameChange: (id: string, thumbnailUrl: string, frameTime: number) => void;
  moveItem: (index: number, direction: 'up' | 'down') => void;
  triggerFileInput: () => void;
  setThumbnail: (id: string) => void;
}

/**
 * Check if a video can be rendered in the browser (detects unsupported codecs like HEVC)
 * Returns true if video can be displayed, false if codec is unsupported
 */
async function checkVideoCodecSupported(videoElement: HTMLVideoElement): Promise<boolean> {
  return new Promise((resolve) => {
    // Try to seek and capture a frame
    videoElement.currentTime = 0.1;

    const timeoutId = setTimeout(() => {
      resolve(false); // Timeout = probably unsupported
    }, 3000);

    videoElement.onseeked = () => {
      clearTimeout(timeoutId);

      // Try to draw to canvas and check if we get actual pixels
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');

      if (!ctx || videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
        resolve(false);
        return;
      }

      try {
        ctx.drawImage(videoElement, 0, 0, 16, 16);
        const imageData = ctx.getImageData(0, 0, 16, 16);

        // Check if we got any non-black pixels (HEVC renders as all black/transparent)
        let hasContent = false;
        for (let i = 0; i < imageData.data.length; i += 4) {
          // Check RGB values (skip alpha)
          if (imageData.data[i] > 5 || imageData.data[i + 1] > 5 || imageData.data[i + 2] > 5) {
            hasContent = true;
            break;
          }
        }

        resolve(hasContent);
      } catch {
        resolve(false);
      }
    };

    videoElement.onerror = () => {
      clearTimeout(timeoutId);
      resolve(false);
    };
  });
}

/**
 * Format video duration from seconds to mm:ss
 */
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Maximum video duration in seconds
 */
const MAX_VIDEO_DURATION = 60;

export function useGalleryField({
  value,
  fieldName,
  onChange,
}: UseGalleryFieldProps): UseGalleryFieldReturn {
  const [gallery, setGallery] = useState<GalleryItem[]>(value || []);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync local state when parent value changes (e.g., from preview updates)
  useEffect(() => {
    setGallery(value || []);
  }, [value]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const newItems: GalleryItem[] = [];
      const totalFiles = files.length;

      // Count existing videos and images for limit checks
      const existingVideos = gallery.filter(item => item.type === 'video').length;
      const existingImages = gallery.filter(item => item.type === 'image').length;
      let videosAdded = 0;
      let imagesAdded = 0;

      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        const fileType = file.type.startsWith('video/') ? 'video' : 'image';

        // Check upload limits (max 1 video, max 5 images)
        if (fileType === 'video') {
          if (existingVideos + videosAdded >= 1) {
            alert(`Maximum 1 video allowed. "${file.name}" was not uploaded.`);
            continue;
          }
          videosAdded++;
        } else {
          if (existingImages + imagesAdded >= 5) {
            alert(`Maximum 5 images allowed. "${file.name}" was not uploaded.`);
            continue;
          }
          imagesAdded++;
        }

        // Validate file type
        const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const validVideoTypes = ['video/mp4', 'video/webm', 'video/mov', 'video/quicktime'];

        if (fileType === 'image' && !validImageTypes.includes(file.type)) {
          alert(`Invalid image format: ${file.name}. Please use JPG, PNG, GIF, or WebP.`);
          continue;
        }

        if (fileType === 'video' && !validVideoTypes.includes(file.type)) {
          alert(`Invalid video format: ${file.name}. Please use MP4, WebM, or MOV.`);
          continue;
        }

        // Validate file size (10MB for images, 100MB for videos)
        const maxSize = fileType === 'image' ? 10 * 1024 * 1024 : 100 * 1024 * 1024;
        if (file.size > maxSize) {
          alert(`File too large: ${file.name}. Maximum size is ${fileType === 'image' ? '10MB' : '100MB'}.`);
          continue;
        }

        // Create temporary preview
        const preview = URL.createObjectURL(file);

        let thumbnail: string | undefined;
        let duration: string | undefined;

        // Extract video metadata if it's a video
        // Use timeouts to prevent hanging on large files
        if (fileType === 'video') {
          try {
            const videoElement = document.createElement('video');
            videoElement.preload = 'metadata';

            // Helper to create a promise with timeout
            const withTimeout = <T>(promise: Promise<T>, timeoutMs: number, fallback: T): Promise<T> => {
              return Promise.race([
                promise,
                new Promise<T>((resolve) => setTimeout(() => resolve(fallback), timeoutMs))
              ]);
            };

            // Wait for metadata with 5 second timeout - if it fails, upload anyway
            const metadataLoaded = await withTimeout(
              new Promise<boolean>((resolve) => {
                videoElement.onloadedmetadata = () => resolve(true);
                videoElement.onerror = () => resolve(false);
                videoElement.src = preview;
              }),
              5000,
              false
            );

            if (metadataLoaded && videoElement.duration && !isNaN(videoElement.duration)) {
              const originalDuration = videoElement.duration;

              // Reject video if longer than 60 seconds
              if (originalDuration > MAX_VIDEO_DURATION) {
                const originalFormatted = formatDuration(originalDuration);
                alert(`Your video is ${originalFormatted} long. Please upload a video that is 60 seconds or less.`);
                URL.revokeObjectURL(preview);
                // Decrement the counter since we're skipping this video
                videosAdded--;
                continue;
              }

              duration = formatDuration(originalDuration);

              // Check if video codec is supported by browser (reject HEVC/H.265)
              const codecSupported = await checkVideoCodecSupported(videoElement);
              if (!codecSupported) {
                alert(`Video format not supported: "${file.name}"\n\nYour video uses a codec (likely HEVC/H.265) that doesn't work in web browsers.\n\nPlease re-export your video using H.264 codec, or use a video converter app before uploading.`);
                URL.revokeObjectURL(preview);
                videosAdded--;
                continue;
              }

              // Generate thumbnail - local blob URLs don't have CORS issues
              // Use longer timeout (10s) for large files that need more time to decode
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              canvas.width = 320;
              canvas.height = 180;

              videoElement.currentTime = 1;
              await withTimeout(
                new Promise<void>((resolve) => {
                  videoElement.onseeked = () => {
                    if (ctx && videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
                      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                      thumbnail = canvas.toDataURL('image/jpeg', 0.8);
                    }
                    resolve();
                  };
                }),
                10000, // 10 second timeout for large video files
                undefined
              );
            } else {
              console.log('Video metadata loading timed out or failed, proceeding with upload');
              duration = 'Processing...';
            }
          } catch (videoError) {
            console.error('Error processing video metadata:', videoError);
            duration = 'Unknown';
          }
        }

        // Upload to Firebase Storage
        const timestamp = Date.now();
        const fileName = `${fileType}_${timestamp}_${file.name}`;
        const path = `admin/gallery/${fileName}`;

        // Calculate base progress for this file (how much % of total this file represents)
        const fileBaseProgress = (i / totalFiles) * 100;
        const fileProgressWeight = (1 / totalFiles) * 100;

        const downloadUrl = await storageService.uploadImage(
          file,
          path,
          {
            contentType: file.type,
            customMetadata: {
              originalName: file.name,
              uploadedAt: new Date().toISOString(),
              fileType,
              galleryId: fieldName || 'default'
            }
          },
          // Progress callback for this individual file
          (fileProgress) => {
            // Calculate total progress: completed files + current file's progress
            const totalProgress = fileBaseProgress + (fileProgress / 100) * fileProgressWeight;
            setUploadProgress(Math.round(totalProgress));
          }
        );

        // Clean up temporary preview URL
        URL.revokeObjectURL(preview);

        const newItem: GalleryItem = {
          id: `gallery-${timestamp}-${i}`,
          url: downloadUrl,
          type: fileType,
          thumbnail,
          caption: '',
          duration,
          uploadedAt: new Date().toISOString(),
          isThumbnail: false  // Will be set below
        };

        newItems.push(newItem);

        // Update progress
        setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
      }

      // Auto-set first item as thumbnail if no thumbnail exists
      const existingThumbnail = gallery.some(item => item.isThumbnail);
      if (!existingThumbnail && newItems.length > 0) {
        newItems[0].isThumbnail = true;
      }

      const updatedGallery = [...gallery, ...newItems];
      setGallery(updatedGallery);
      onChange(fieldName, updatedGallery);

    } catch (error) {
      console.error('Error uploading gallery files:', error);
      alert('Failed to upload some files. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [gallery, fieldName, onChange]);

  const handleRemoveItem = useCallback((id: string) => {
    const removedItem = gallery.find(item => item.id === id);
    let updatedGallery = gallery.filter(item => item.id !== id);

    // If the removed item was the thumbnail, reassign to the first remaining item
    if (removedItem?.isThumbnail && updatedGallery.length > 0) {
      updatedGallery = updatedGallery.map((item, index) => ({
        ...item,
        isThumbnail: index === 0
      }));
    }

    setGallery(updatedGallery);
    onChange(fieldName, updatedGallery);
  }, [gallery, fieldName, onChange]);

  const handleCaptionChange = useCallback((id: string, caption: string) => {
    const updatedGallery = gallery.map(item =>
      item.id === id ? { ...item, caption } : item
    );
    setGallery(updatedGallery);
    onChange(fieldName, updatedGallery);
  }, [gallery, fieldName, onChange]);

  const moveItem = useCallback((index: number, direction: 'up' | 'down') => {
    const newGallery = [...gallery];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < newGallery.length) {
      [newGallery[index], newGallery[newIndex]] = [newGallery[newIndex], newGallery[index]];
      setGallery(newGallery);
      onChange(fieldName, newGallery);
    }
  }, [gallery, fieldName, onChange]);

  const setThumbnail = useCallback((id: string) => {
    const updatedGallery = gallery.map(item => ({
      ...item,
      isThumbnail: item.id === id
    }));
    setGallery(updatedGallery);
    onChange(fieldName, updatedGallery);
  }, [gallery, fieldName, onChange]);

  const handleThumbnailFrameChange = useCallback((id: string, thumbnailUrl: string, frameTime: number) => {
    const updatedGallery = gallery.map(item =>
      item.id === id ? { ...item, thumbnail: thumbnailUrl, thumbnailFrameTime: frameTime } : item
    );
    setGallery(updatedGallery);
    onChange(fieldName, updatedGallery);
  }, [gallery, fieldName, onChange]);

  return {
    // State
    gallery,
    isUploading,
    uploadProgress,
    fileInputRef,

    // Handlers
    handleFileSelect,
    handleRemoveItem,
    handleCaptionChange,
    handleThumbnailFrameChange,
    moveItem,
    triggerFileInput,
    setThumbnail,
  };
}

export type { GalleryItem };
