import { Upload, X, Play, Image as ImageIcon, Video, Plus, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useGalleryField } from "./useGalleryField";
import VideoThumbnailSelector from "./VideoThumbnailSelector";

interface FieldComponentProps {
  field: any;
  value: any;
  onChange: (fieldName: string, value: any) => void;
  error?: string;
  data?: any;
}

/**
 * Component to display video preview when no thumbnail exists
 * Fetches video via proxy with credentials and captures first frame as image
 */
function VideoPreviewLoader({ videoUrl }: { videoUrl: string }) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    async function captureFrame() {
      try {
        // Fetch video via proxy with credentials
        const proxiedUrl = videoUrl.includes('firebasestorage.googleapis.com')
          ? `/api/magazine/video-proxy?url=${encodeURIComponent(videoUrl)}`
          : videoUrl;

        const response = await fetch(proxiedUrl, { credentials: 'include' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const blob = await response.blob();
        if (cancelled) return;

        objectUrl = URL.createObjectURL(blob);

        // Create video element to capture frame
        const video = document.createElement('video');
        video.muted = true;
        video.playsInline = true;
        video.preload = 'auto';
        video.src = objectUrl;

        // Wait for video to load enough data
        await new Promise<void>((resolve, reject) => {
          video.onloadeddata = () => resolve();
          video.onerror = () => reject(new Error('Video load error'));
          setTimeout(() => reject(new Error('Video load timeout')), 5000);
        });

        if (cancelled) return;

        // Seek to 1 second for a better frame
        video.currentTime = Math.min(1, video.duration * 0.1);

        await new Promise<void>((resolve) => {
          video.onseeked = () => resolve();
          setTimeout(resolve, 1000); // Fallback timeout
        });

        if (cancelled) return;

        // Capture frame to canvas
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 320;
        canvas.height = video.videoHeight || 180;
        const ctx = canvas.getContext('2d');

        if (ctx && video.videoWidth > 0) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setThumbnailUrl(dataUrl);
        } else {
          throw new Error('Could not capture frame');
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Failed to capture video frame:', err);
        if (!cancelled) {
          setError(true);
          setIsLoading(false);
        }
      } finally {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      }
    }

    captureFrame();

    return () => {
      cancelled = true;
    };
  }, [videoUrl]);

  if (isLoading) {
    return (
      <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-glamlink-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !thumbnailUrl) {
    return (
      <div className="w-full h-32 bg-gray-300 flex items-center justify-center">
        <Video className="w-8 h-8 text-gray-500" />
      </div>
    );
  }

  return (
    <img
      src={thumbnailUrl}
      alt="Video thumbnail"
      className="w-full h-32 object-cover"
    />
  );
}

export default function GalleryField({ field, value, onChange, error }: FieldComponentProps) {
  const {
    gallery,
    isUploading,
    uploadProgress,
    fileInputRef,
    handleFileSelect,
    handleRemoveItem,
    handleCaptionChange,
    handleThumbnailFrameChange,
    moveItem,
    triggerFileInput,
    setThumbnail,
  } = useGalleryField({
    value: value || [],
    fieldName: field.name,
    onChange,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={isUploading}
          className="px-4 py-2 bg-glamlink-teal text-white rounded-lg hover:bg-glamlink-teal-dark transition-colors flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Uploading... {uploadProgress}%
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Upload Media
            </>
          )}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileSelect}
        disabled={isUploading}
        className="hidden"
      />

      {/* Upload Progress Bar */}
      {isUploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Uploading files...</span>
            <span className="text-sm text-blue-700">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-blue-100 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-blue-600 mt-1">
            Uploading to your gallery. Please wait...
          </p>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {gallery.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No media uploaded yet</p>
          <p className="text-sm text-gray-400">Add a short intro video (up to 60 seconds) and highlight your favorite treatments. Upload up to 5 photos of your best work.</p>
          <p className="text-xs text-gray-400 mt-2">🔒 Firebase Storage • Auto-thumbnails • Cloud backup</p>
        </div>
      ) : (
        <div className="space-y-3">
          {gallery.map((item, index) => (
            <div
              key={item.id}
              className={`border rounded-lg p-4 space-y-3 ${item.isThumbnail ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {item.type === 'video' ? (
                      <Video className="w-4 h-4 text-glamlink-teal" />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-glamlink-teal" />
                    )}
                    <span className="text-sm font-medium capitalize">{item.type}</span>
                    {item.duration && item.duration !== 'Loading...' && (
                      <span className="text-xs text-gray-500">({item.duration})</span>
                    )}
                    {/* Thumbnail Badge */}
                    {item.isThumbnail && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        Thumbnail
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === gallery.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      title="Move down"
                    >
                      ↓
                    </button>
                    {/* Set as Thumbnail Button */}
                    {!item.isThumbnail && (
                      <button
                        type="button"
                        onClick={() => setThumbnail(item.id)}
                        className="px-2 py-1 text-xs text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-colors border border-gray-300 hover:border-yellow-400"
                      >
                        Set Thumbnail
                      </button>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-1 text-red-500 hover:text-red-700"
                  title="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Media Preview */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.caption || 'Gallery image'}
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="relative">
                    {/* Use thumbnail if available, otherwise load video via proxy */}
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.caption || 'Video thumbnail'}
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <VideoPreviewLoader videoUrl={item.url} />
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Caption Input */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Caption
                </label>
                <input
                  type="text"
                  value={item.caption || ''}
                  onChange={(e) => handleCaptionChange(item.id, e.target.value)}
                  placeholder="Add a caption for this media..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-glamlink-teal focus:border-transparent"
                />
              </div>

              {/* Video Thumbnail Selector - Only show for videos */}
              {item.type === 'video' && (
                <VideoThumbnailSelector
                  item={item}
                  onThumbnailChange={handleThumbnailFrameChange}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Gallery Upload Limits</span>
          <span className="text-green-600">✓ Cloud Storage</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-gray-600">
          <div>• Max 1 video (60 seconds max)</div>
          <div>• Max 5 images (JPG, PNG, GIF, WebP)</div>
          <div>• Videos over 60s will be rejected</div>
          <div>• First item is your thumbnail</div>
        </div>
      </div>
    </div>
  );
}
