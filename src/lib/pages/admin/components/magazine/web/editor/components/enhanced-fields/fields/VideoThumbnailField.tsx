'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Check, Clock, Film, Upload, Image as ImageIcon, Scissors } from 'lucide-react';
import type { FieldComponentProps } from '../types';
import storageService from '@/lib/services/firebase/storageService';

// Import the ImageCropModal for cropping functionality
import ImageCropModal from '@/lib/pages/admin/components/shared/editing/fields/custom/media/ImageCropModal';

interface ThumbnailOption {
  time: number;
  dataUrl: string | null;
  isLoading: boolean;
}

// Global cache for video thumbnails
const thumbnailCache = new Map<string, string>();

function getCacheKey(videoUrl: string, frameTime: number): string {
  return `${videoUrl}:${frameTime}`;
}

/**
 * Get proxied URL for Firebase Storage videos to bypass CORS
 */
function getProxiedVideoUrl(url: string): string {
  if (url.includes('firebasestorage.googleapis.com')) {
    return `/api/magazine/video-proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
}

/**
 * Capture a frame from a video at a specific time
 */
async function captureFrameAtTime(
  videoUrl: string,
  frameTime: number
): Promise<string | null> {
  const cacheKey = getCacheKey(videoUrl, frameTime);

  if (thumbnailCache.has(cacheKey)) {
    return thumbnailCache.get(cacheKey)!;
  }

  return new Promise((resolve) => {
    let blobUrl: string | null = null;
    let videoElement: HTMLVideoElement | null = null;

    const cleanup = () => {
      if (videoElement) {
        videoElement.onloadedmetadata = null;
        videoElement.onseeked = null;
        videoElement.onerror = null;
        videoElement.src = '';
        videoElement.load();
        videoElement = null;
      }
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
        blobUrl = null;
      }
    };

    const setupVideoCapture = (videoSrc: string) => {
      videoElement = document.createElement('video');
      videoElement.crossOrigin = 'anonymous';
      videoElement.src = videoSrc;
      videoElement.muted = true;
      videoElement.preload = 'metadata';

      videoElement.onloadedmetadata = () => {
        if (!videoElement) return;
        const seekTime = Math.min(frameTime, videoElement.duration - 0.1);
        videoElement.currentTime = Math.max(0.1, seekTime);
      };

      videoElement.onseeked = () => {
        if (!videoElement) {
          cleanup();
          resolve(null);
          return;
        }
        try {
          if (videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
            const canvas = document.createElement('canvas');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(videoElement, 0, 0);
              const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
              thumbnailCache.set(cacheKey, dataUrl);
              cleanup();
              resolve(dataUrl);
              return;
            }
          }
        } catch (e) {
          console.warn('Failed to capture video frame:', e);
        }
        cleanup();
        resolve(null);
      };

      videoElement.onerror = () => {
        cleanup();
        resolve(null);
      };

      videoElement.load();
    };

    if (videoUrl.includes('firebasestorage.googleapis.com')) {
      const proxiedUrl = getProxiedVideoUrl(videoUrl);
      fetch(proxiedUrl, { credentials: 'include' })
        .then(response => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.blob();
        })
        .then(blob => {
          blobUrl = URL.createObjectURL(blob);
          setupVideoCapture(blobUrl);
        })
        .catch(() => resolve(null));
    } else {
      setupVideoCapture(videoUrl);
    }

    setTimeout(() => {
      cleanup();
      resolve(null);
    }, 10000);
  });
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function generateTimePoints(durationSeconds: number, count: number = 6): number[] {
  if (durationSeconds <= 0) return [0];
  const points: number[] = [];
  const step = durationSeconds / (count - 1);
  for (let i = 0; i < count; i++) {
    points.push(Math.min(Math.round(step * i), durationSeconds - 0.1));
  }
  return points;
}

/**
 * VideoThumbnailField - Video thumbnail selector with frame extraction and cropping
 *
 * Props expected:
 * - videoUrl: URL to the video
 * - allProps: All block props (to access videoUrl, videoFile)
 * - onPropChange: Callback to update multiple props
 *
 * Outputs:
 * - thumbnail: The final thumbnail URL (cropped or original)
 * - thumbnailFrameTime: The frame time used
 * - thumbnailSource: 'video' or 'upload'
 */
export default function VideoThumbnailField({ field, value, onChange, issueId, allProps, onPropChange }: FieldComponentProps) {
  // Get video URL from allProps
  const videoUrl = allProps?.videoFile || allProps?.videoUrl || '';
  const thumbnailFrameTime = allProps?.thumbnailFrameTime ?? 0;
  const thumbnailSource = allProps?.thumbnailSource || 'video';

  const [isExpanded, setIsExpanded] = useState(false);
  const [source, setSource] = useState<'video' | 'upload'>(thumbnailSource);
  const [thumbnailOptions, setThumbnailOptions] = useState<ThumbnailOption[]>([]);
  const [customFrameTime, setCustomFrameTime] = useState<string>(String(thumbnailFrameTime));
  const [customThumbnail, setCustomThumbnail] = useState<ThumbnailOption | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(thumbnailFrameTime);
  const [isGeneratingOptions, setIsGeneratingOptions] = useState(false);
  const [videoDuration, setVideoDuration] = useState(60);

  // Thumbnail state
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(value || '');
  const [pendingThumbnail, setPendingThumbnail] = useState<string | null>(null);

  // Crop modal state
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>('');

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load video duration
  useEffect(() => {
    if (!videoUrl) return;

    const video = document.createElement('video');
    video.preload = 'metadata';

    const loadMetadata = () => {
      if (!isNaN(video.duration) && video.duration > 0) {
        setVideoDuration(video.duration);
      }
    };

    video.onloadedmetadata = loadMetadata;

    if (videoUrl.includes('firebasestorage.googleapis.com')) {
      fetch(getProxiedVideoUrl(videoUrl), { credentials: 'include' })
        .then(res => res.blob())
        .then(blob => {
          video.src = URL.createObjectURL(blob);
        })
        .catch(() => {});
    } else {
      video.src = videoUrl;
    }

    return () => {
      video.onloadedmetadata = null;
    };
  }, [videoUrl]);

  // Generate thumbnail options when expanded
  const generateThumbnailOptions = useCallback(async () => {
    if (!videoUrl || thumbnailOptions.length > 0) return;

    setIsGeneratingOptions(true);
    const timePoints = generateTimePoints(videoDuration);

    const initialOptions: ThumbnailOption[] = timePoints.map(time => ({
      time,
      dataUrl: null,
      isLoading: true
    }));
    setThumbnailOptions(initialOptions);

    const results = await Promise.all(
      timePoints.map(async (time) => {
        const dataUrl = await captureFrameAtTime(videoUrl, time);
        return { time, dataUrl };
      })
    );

    setThumbnailOptions(
      results.map(result => ({
        time: result.time,
        dataUrl: result.dataUrl,
        isLoading: false
      }))
    );
    setIsGeneratingOptions(false);
  }, [videoUrl, videoDuration, thumbnailOptions.length]);

  useEffect(() => {
    if (isExpanded && source === 'video' && thumbnailOptions.length === 0 && videoUrl) {
      generateThumbnailOptions();
    }
  }, [isExpanded, source, generateThumbnailOptions, thumbnailOptions.length, videoUrl]);

  const handleGenerateCustomThumbnail = async () => {
    const frameTime = parseFloat(customFrameTime);
    if (isNaN(frameTime) || frameTime < 0 || frameTime > videoDuration) {
      alert(`Please enter a valid time between 0 and ${Math.floor(videoDuration)} seconds.`);
      return;
    }

    setCustomThumbnail({ time: frameTime, dataUrl: null, isLoading: true });
    const dataUrl = await captureFrameAtTime(videoUrl, frameTime);
    setCustomThumbnail({ time: frameTime, dataUrl, isLoading: false });
  };

  // When a thumbnail frame is selected, show it as pending and offer "Save & Crop"
  const handleSelectFrame = (time: number, dataUrl: string | null) => {
    if (!dataUrl) return;
    setSelectedTime(time);
    setPendingThumbnail(dataUrl);

    // Update frame time in props
    if (onPropChange) {
      onPropChange('thumbnailFrameTime', time);
      onPropChange('thumbnailSource', 'video');
    }
  };

  // Save thumbnail and open crop modal
  const handleSaveThumbnail = async () => {
    if (!pendingThumbnail) return;

    // Upload the data URL to Firebase first
    setIsUploading(true);
    try {
      const response = await fetch(pendingThumbnail);
      const blob = await response.blob();
      const file = new File([blob], `video_thumbnail_${Date.now()}.jpg`, { type: 'image/jpeg' });

      const path = `admin/magazine/${issueId}/video-thumbnails/${file.name}`;
      const uploadedUrl = await storageService.uploadImage(file, path, {
        contentType: 'image/jpeg'
      });

      // Set the uploaded URL and open crop modal
      setImageToCrop(uploadedUrl);
      setShowCropModal(true);
    } catch (error) {
      console.error('Failed to upload thumbnail:', error);
      // Fall back to using data URL directly for cropping
      setImageToCrop(pendingThumbnail);
      setShowCropModal(true);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle crop complete
  const handleCropComplete = (croppedImageUrl: string) => {
    setThumbnailUrl(croppedImageUrl);
    setPendingThumbnail(null);
    onChange(croppedImageUrl);
    setShowCropModal(false);
  };

  // Handle custom image upload
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    setIsUploading(true);
    try {
      const path = `admin/magazine/${issueId}/video-thumbnails/custom_${Date.now()}_${file.name}`;
      const uploadedUrl = await storageService.uploadImage(file, path, {
        contentType: file.type
      });

      // Update props
      if (onPropChange) {
        onPropChange('thumbnailSource', 'upload');
        onPropChange('thumbnailFrameTime', -2);
      }

      // Open crop modal with uploaded image
      setImageToCrop(uploadedUrl);
      setShowCropModal(true);
    } catch (error) {
      console.error('Failed to upload thumbnail:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const isTimeSelected = (time: number) => selectedTime !== null && Math.abs(selectedTime - time) < 0.1;

  if (!videoUrl) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center text-gray-500">
        <Film className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Upload a video first to select a thumbnail</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Current thumbnail preview */}
      {thumbnailUrl && (
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-700">Current Thumbnail</label>
          <div className="relative w-48 aspect-video rounded-lg overflow-hidden border-2 border-glamlink-teal">
            <img src={thumbnailUrl} alt="Current thumbnail" className="w-full h-full object-cover" />
            <div className="absolute top-1 right-1 bg-glamlink-teal rounded-full p-0.5">
              <Check className="w-3 h-3 text-white" />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-glamlink-teal hover:text-glamlink-teal-dark flex items-center gap-1"
          >
            <Scissors className="w-4 h-4" />
            Change Thumbnail
          </button>
        </div>
      )}

      {/* Expand/collapse toggle */}
      {!thumbnailUrl && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm text-glamlink-teal hover:text-glamlink-teal-dark transition-colors"
        >
          <Film className="w-4 h-4" />
          <span>{isExpanded ? 'Hide' : 'Choose'} Thumbnail Frame</span>
          <svg
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}

      {isExpanded && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          {/* Source selector */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Choose thumbnail option</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as 'video' | 'upload')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-glamlink-teal"
            >
              <option value="video">Use Image from video</option>
              <option value="upload">Upload custom image</option>
            </select>
          </div>

          {/* Video frame selection */}
          {source === 'video' && (
            <>
              <p className="text-xs text-gray-500">
                Select a frame from your video to use as the thumbnail.
              </p>

              {/* Thumbnail Grid */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">
                  Select Thumbnail ({thumbnailOptions.length} options)
                </label>

                {isGeneratingOptions && thumbnailOptions.length === 0 ? (
                  <div className="flex items-center justify-center h-24 bg-gray-100 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="w-5 h-5 border-2 border-glamlink-teal border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm">Generating thumbnails...</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {thumbnailOptions.map((option, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSelectFrame(option.time, option.dataUrl)}
                        disabled={option.isLoading || !option.dataUrl}
                        className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                          isTimeSelected(option.time)
                            ? 'border-glamlink-teal ring-2 ring-glamlink-teal ring-opacity-50'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${option.isLoading || !option.dataUrl ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {option.isLoading ? (
                          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-glamlink-teal border-t-transparent rounded-full animate-spin" />
                          </div>
                        ) : option.dataUrl ? (
                          <img src={option.dataUrl} alt={`Frame at ${formatTime(option.time)}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-400">Failed</span>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 px-1 py-0.5">
                          <span className="text-xs text-white font-mono">{formatTime(option.time)}</span>
                        </div>
                        {isTimeSelected(option.time) && (
                          <div className="absolute top-1 right-1 bg-glamlink-teal rounded-full p-0.5">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Frame Time */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Custom Frame Time (seconds)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    max={Math.floor(videoDuration)}
                    step="1"
                    value={customFrameTime}
                    onChange={(e) => setCustomFrameTime(e.target.value)}
                    placeholder={`0-${Math.floor(videoDuration)}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-glamlink-teal"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateCustomThumbnail}
                    disabled={!customFrameTime || customThumbnail?.isLoading}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 disabled:opacity-50"
                  >
                    {customThumbnail?.isLoading ? (
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Preview'
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-400">Video duration: {formatTime(videoDuration)}</p>
              </div>

              {/* Custom thumbnail preview */}
              {customThumbnail && customThumbnail.dataUrl && (
                <button
                  type="button"
                  onClick={() => handleSelectFrame(customThumbnail.time, customThumbnail.dataUrl)}
                  className={`relative w-1/2 aspect-video rounded-lg overflow-hidden border-2 ${
                    isTimeSelected(customThumbnail.time) ? 'border-glamlink-teal ring-2 ring-glamlink-teal ring-opacity-50' : 'border-gray-200'
                  }`}
                >
                  <img src={customThumbnail.dataUrl} alt="Custom frame" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 px-1 py-0.5">
                    <span className="text-xs text-white font-mono">{formatTime(customThumbnail.time)}</span>
                  </div>
                </button>
              )}

              {/* Save & Crop button */}
              {pendingThumbnail && (
                <div className="pt-2 border-t border-gray-200">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-3 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">
                      Frame at <strong>{formatTime(selectedTime!)}</strong> selected
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveThumbnail}
                    disabled={isUploading}
                    className="w-full px-4 py-2 bg-glamlink-teal text-white rounded-lg text-sm font-medium hover:bg-glamlink-teal-dark disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Scissors className="w-4 h-4" />
                        Save Thumbnail & Crop
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}

          {/* Custom upload */}
          {source === 'upload' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500">Upload a custom image to use as your video thumbnail.</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-glamlink-teal hover:text-glamlink-teal flex flex-col items-center gap-2 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-glamlink-teal border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Uploading...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8" />
                    <span className="text-sm font-medium">Upload Thumbnail</span>
                    <span className="text-xs text-gray-400">JPG, PNG, GIF (max 5MB)</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Image Crop Modal */}
      {showCropModal && imageToCrop && (
        <ImageCropModal
          isOpen={showCropModal}
          onClose={() => {
            setShowCropModal(false);
            setImageToCrop('');
          }}
          imageUrl={imageToCrop}
          onCropComplete={handleCropComplete}
          issueId={issueId || 'admin'}
        />
      )}
    </div>
  );
}
