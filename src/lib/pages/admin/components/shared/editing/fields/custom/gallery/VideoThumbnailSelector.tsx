"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Check, Clock, Film, Upload, Image as ImageIcon } from "lucide-react";
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
  thumbnailSource?: 'video' | 'upload'; // Whether thumbnail came from video frame or custom upload
}

interface VideoThumbnailSelectorProps {
  item: GalleryItem;
  onThumbnailChange: (id: string, thumbnailUrl: string, frameTime: number) => void;
}

interface ThumbnailOption {
  time: number;
  dataUrl: string | null;
  isLoading: boolean;
}

// Global cache for video thumbnails to prevent re-fetching
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

  // Check cache first
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
        console.warn('Video load error');
        cleanup();
        resolve(null);
      };

      videoElement.load();
    };

    // Check if we need to use the proxy (Firebase Storage URLs)
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
        .catch(err => {
          console.warn('Failed to fetch proxied video:', err);
          resolve(null);
        });
    } else {
      setupVideoCapture(videoUrl);
    }

    // Timeout after 10 seconds
    setTimeout(() => {
      cleanup();
      resolve(null);
    }, 10000);
  });
}

/**
 * Parse duration string (mm:ss) to seconds
 */
function parseDuration(durationStr: string | undefined): number {
  if (!durationStr || durationStr === 'Loading...' || durationStr === 'Unknown' || durationStr === 'Processing...') {
    return 60; // Default to 60 seconds if unknown
  }
  const parts = durationStr.split(':');
  if (parts.length === 2) {
    const mins = parseInt(parts[0], 10);
    const secs = parseInt(parts[1], 10);
    if (!isNaN(mins) && !isNaN(secs)) {
      return mins * 60 + secs;
    }
  }
  return 60;
}

/**
 * Format seconds to mm:ss
 */
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Generate evenly distributed time points across video duration
 */
function generateTimePoints(durationSeconds: number, count: number = 6): number[] {
  if (durationSeconds <= 0) return [0];

  const points: number[] = [];
  const step = durationSeconds / (count - 1);

  for (let i = 0; i < count; i++) {
    const time = Math.round(step * i);
    points.push(Math.min(time, durationSeconds - 0.1));
  }

  return points;
}

export default function VideoThumbnailSelector({
  item,
  onThumbnailChange
}: VideoThumbnailSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [thumbnailSource, setThumbnailSource] = useState<'video' | 'upload'>(
    (item as any).thumbnailSource || 'video'
  );
  const [thumbnailOptions, setThumbnailOptions] = useState<ThumbnailOption[]>([]);
  const [customFrameTime, setCustomFrameTime] = useState<string>(
    item.thumbnailFrameTime !== undefined ? String(item.thumbnailFrameTime) : ''
  );
  const [customThumbnail, setCustomThumbnail] = useState<ThumbnailOption | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(item.thumbnailFrameTime ?? null);
  const [isGeneratingOptions, setIsGeneratingOptions] = useState(false);

  // Custom upload state
  const [uploadedThumbnail, setUploadedThumbnail] = useState<string | null>(
    thumbnailSource === 'upload' && item.thumbnail ? item.thumbnail : null
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const videoDuration = parseDuration(item.duration);

  // Generate thumbnail options when expanded
  const generateThumbnailOptions = useCallback(async () => {
    if (thumbnailOptions.length > 0) return; // Already generated

    setIsGeneratingOptions(true);
    const timePoints = generateTimePoints(videoDuration);

    // Initialize options with loading state
    const initialOptions: ThumbnailOption[] = timePoints.map(time => ({
      time,
      dataUrl: null,
      isLoading: true
    }));
    setThumbnailOptions(initialOptions);

    // Capture frames in parallel (but limit concurrency)
    const results = await Promise.all(
      timePoints.map(async (time) => {
        const dataUrl = await captureFrameAtTime(item.url, time);
        return { time, dataUrl };
      })
    );

    // Update options with results
    setThumbnailOptions(
      results.map(result => ({
        time: result.time,
        dataUrl: result.dataUrl,
        isLoading: false
      }))
    );
    setIsGeneratingOptions(false);
  }, [item.url, videoDuration, thumbnailOptions.length]);

  // Generate options when expanded and source is video
  useEffect(() => {
    if (isExpanded && thumbnailSource === 'video' && thumbnailOptions.length === 0) {
      generateThumbnailOptions();
    }
  }, [isExpanded, thumbnailSource, generateThumbnailOptions, thumbnailOptions.length]);

  // Handle custom frame time input
  const handleCustomFrameTimeChange = (value: string) => {
    setCustomFrameTime(value);
    setCustomThumbnail(null); // Reset custom thumbnail when typing
  };

  // Generate custom thumbnail when user finishes typing
  const handleGenerateCustomThumbnail = async () => {
    const frameTime = parseFloat(customFrameTime);
    if (isNaN(frameTime) || frameTime < 0 || frameTime > videoDuration) {
      alert(`Please enter a valid time between 0 and ${Math.floor(videoDuration)} seconds.`);
      return;
    }

    setCustomThumbnail({ time: frameTime, dataUrl: null, isLoading: true });
    const dataUrl = await captureFrameAtTime(item.url, frameTime);
    setCustomThumbnail({ time: frameTime, dataUrl, isLoading: false });
  };

  // Handle thumbnail selection from video frame
  const handleSelectThumbnail = (time: number, dataUrl: string | null) => {
    if (!dataUrl) return;
    setSelectedTime(time);
    setUploadedThumbnail(null); // Clear any uploaded thumbnail
    onThumbnailChange(item.id, dataUrl, time);
  };

  // Handle custom image upload
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Upload to Firebase Storage
      const timestamp = Date.now();
      const fileName = `video_thumbnail_${timestamp}_${file.name}`;
      const path = `admin/gallery/thumbnails/${fileName}`;

      const downloadUrl = await storageService.uploadImage(
        file,
        path,
        {
          contentType: file.type,
          customMetadata: {
            originalName: file.name,
            uploadedAt: new Date().toISOString(),
            videoId: item.id
          }
        }
      );

      // Set as the thumbnail
      setUploadedThumbnail(downloadUrl);
      setSelectedTime(null); // Clear video frame selection
      // Use -2 as a special marker for custom uploaded thumbnails
      onThumbnailChange(item.id, downloadUrl, -2);

    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      alert('Failed to upload thumbnail. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Check if a time is selected
  const isTimeSelected = (time: number) => {
    return selectedTime !== null && Math.abs(selectedTime - time) < 0.1;
  };

  // Check if custom upload is currently active
  const isUploadSelected = uploadedThumbnail !== null && selectedTime === null;

  return (
    <div className="mt-3 border-t border-gray-200 pt-3">
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

      {isExpanded && (
        <div className="mt-3 space-y-4">
          {/* Thumbnail Source Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">
              Choose thumbnail option
            </label>
            <select
              value={thumbnailSource}
              onChange={(e) => setThumbnailSource(e.target.value as 'video' | 'upload')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-glamlink-teal focus:border-transparent"
            >
              <option value="video">Use Image from video</option>
              <option value="upload">Upload custom image</option>
            </select>
          </div>

          {/* Video Frame Selection */}
          {thumbnailSource === 'video' && (
            <>
              {/* Info text */}
              <p className="text-xs text-gray-500">
                Select a frame from your video to use as the thumbnail, or enter a specific time.
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
                        onClick={() => handleSelectThumbnail(option.time, option.dataUrl)}
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
                          <img
                            src={option.dataUrl}
                            alt={`Frame at ${formatTime(option.time)}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-400">Failed</span>
                          </div>
                        )}

                        {/* Time label */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 px-1 py-0.5">
                          <span className="text-xs text-white font-mono">{formatTime(option.time)}</span>
                        </div>

                        {/* Selected indicator */}
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

              {/* Custom Frame Time Input */}
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
                    onChange={(e) => handleCustomFrameTimeChange(e.target.value)}
                    placeholder={`0-${Math.floor(videoDuration)}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-glamlink-teal focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateCustomThumbnail}
                    disabled={!customFrameTime || customThumbnail?.isLoading}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {customThumbnail?.isLoading ? (
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Preview'
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  Video duration: {formatTime(videoDuration)}
                </p>
              </div>

              {/* Custom Thumbnail Preview */}
              {customThumbnail && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">
                    Custom Frame Preview
                  </label>
                  <button
                    type="button"
                    onClick={() => handleSelectThumbnail(customThumbnail.time, customThumbnail.dataUrl)}
                    disabled={customThumbnail.isLoading || !customThumbnail.dataUrl}
                    className={`relative w-1/2 aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      isTimeSelected(customThumbnail.time)
                        ? 'border-glamlink-teal ring-2 ring-glamlink-teal ring-opacity-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${customThumbnail.isLoading || !customThumbnail.dataUrl ? 'opacity-50' : 'cursor-pointer'}`}
                  >
                    {customThumbnail.isLoading ? (
                      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-glamlink-teal border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : customThumbnail.dataUrl ? (
                      <img
                        src={customThumbnail.dataUrl}
                        alt={`Custom frame at ${formatTime(customThumbnail.time)}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                        <span className="text-xs text-gray-400">Failed to capture</span>
                      </div>
                    )}

                    {/* Time label */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 px-1 py-0.5">
                      <span className="text-xs text-white font-mono">{formatTime(customThumbnail.time)}</span>
                    </div>

                    {/* Selected indicator */}
                    {isTimeSelected(customThumbnail.time) && (
                      <div className="absolute top-1 right-1 bg-glamlink-teal rounded-full p-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                </div>
              )}
            </>
          )}

          {/* Custom Image Upload */}
          {thumbnailSource === 'upload' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500">
                Upload a custom image to use as your video thumbnail.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="hidden"
              />

              {uploadedThumbnail ? (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">
                    Current Thumbnail
                  </label>
                  <div className="relative w-1/2 aspect-video rounded-lg overflow-hidden border-2 border-glamlink-teal ring-2 ring-glamlink-teal ring-opacity-50">
                    <img
                      src={uploadedThumbnail}
                      alt="Custom thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1 bg-glamlink-teal rounded-full p-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {isUploading ? 'Uploading...' : 'Replace Image'}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-glamlink-teal hover:text-glamlink-teal transition-colors flex flex-col items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
              )}
            </div>
          )}

          {/* Current Selection Info */}
          {(selectedTime !== null || isUploadSelected) && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-2 flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700">
                {isUploadSelected ? (
                  <span>Using <strong>custom uploaded image</strong> as thumbnail</span>
                ) : (
                  <span>Thumbnail set to frame at <strong>{formatTime(selectedTime!)}</strong></span>
                )}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
