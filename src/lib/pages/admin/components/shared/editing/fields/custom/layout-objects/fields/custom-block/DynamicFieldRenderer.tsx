'use client';

import { useState, useRef } from 'react';
import { FieldSchema, validateField } from '@/lib/pages/magazine/config/sections';
import storageService from '@/lib/services/firebase/storageService';
// Import field components from admin shared editing fields
import ImageUploadField from '@/lib/pages/admin/components/shared/editing/fields/custom/media/imageUpload';
import { StandaloneHtmlField } from '@/lib/pages/admin/components/shared/editing/fields/html';
import { LinkField } from '@/lib/pages/admin/components/shared/editing/fields/custom/link';
import { StandaloneColorPicker as BackgroundColorField } from '@/lib/pages/admin/components/shared/editing/fields/backgroundColor';
import TypographySettings from '@/lib/pages/admin/components/shared/editing/fields/typography/TypographySettings';
import { VideoGallery } from '@/lib/pages/admin/components/shared/editing/fields/custom/gallery';
import {
  extractYouTubeVideoId,
  getYouTubeThumbnailUrl,
  extractVideoFrame,
  extractVideoFrameFromFile,
  downloadImageAsFile,
  dataURLtoFile
} from '@/lib/pages/admin/components/shared/editing/fields/custom/media/video';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Global cache for video files to enable thumbnail extraction
const videoFileCache = new Map<string, File>();

// Collapsible Typography Wrapper Component
function CollapsibleTypographyWrapper({
  field,
  value,
  onChange
}: {
  field: FieldSchema;
  value: any;
  onChange: (value: any) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800"
      >
        {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        Typography Settings
      </button>

      {isExpanded && (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <TypographySettings
            settings={value || {}}
            onChange={onChange}
            showAlignment={true}
            showColor={true}
          />
        </div>
      )}
    </div>
  );
}

interface DynamicFieldRendererProps {
  field: FieldSchema;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
  sectionType?: string;
  formData?: any;
  compact?: boolean;
  issueId?: string;
}

export default function DynamicFieldRenderer({
  field,
  value,
  onChange,
  error,
  disabled = false,
  sectionType,
  formData,
  compact = false
}: DynamicFieldRendererProps) {
  const [localError, setLocalError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showVideoGallery, setShowVideoGallery] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (newValue: any) => {
    const validationError = validateField(field, newValue);
    setLocalError(validationError);
    onChange(newValue);
  };

  const validateUrl = (url: string): boolean => {
    if (!url) return true; // Empty is okay
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validateYouTubeUrl = (url: string): boolean => {
    if (!url) return true; // Empty is okay
    if (!validateUrl(url)) return false;
    
    // Check if it's a YouTube URL
    const youtubePatterns = [
      /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
      /^https?:\/\/youtu\.be\/[\w-]+/,
      /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/,
      /^https?:\/\/(www\.)?youtube\.com\/v\/[\w-]+/
    ];
    
    return youtubePatterns.some(pattern => pattern.test(url));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setLocalError(null);

    try {
      // Generate a unique ID for this upload
      const issueId = 'temp'; // This should be passed from parent in a real app
      const sectionId = `field_${field.name}`;
      
      // Upload to Firebase Storage
      const downloadUrl = await storageService.uploadMagazineImage(
        issueId,
        sectionId,
        file,
        'content'
      );
      
      // Update the field value with the download URL
      handleChange(downloadUrl);
    } catch (error) {
      console.error('Upload error:', error);
      setLocalError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <input
            type={field.type}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal disabled:opacity-50"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value ? Number(e.target.value) : '')}
            placeholder={field.placeholder}
            min={field.validation?.min}
            max={field.validation?.max}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal disabled:opacity-50"
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            rows={field.rows || 3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal disabled:opacity-50"
          />
        );

      case 'html':
      case 'richtext':
        return (
          <StandaloneHtmlField
            label=""
            value={value || ''}
            onChange={handleChange}
            disabled={disabled}
            minHeight={field.rows ? field.rows * 24 : 100}
            placeholder={field.placeholder}
            showPreview={true}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal disabled:opacity-50"
          />
        );

      case 'time':
        return (
          <input
            type="time"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal disabled:opacity-50"
          />
        );

      case 'image':
        // Handle video thumbnail extraction for Top Treatment hero image
        const handleExtractVideoThumbnail = async () => {
          if (sectionType === 'top-treatment' && field.name === 'heroImage' && formData) {
            try {
              setUploading(true);
              setLocalError(null);
              
              const videoSettings = formData.heroVideoSettings || {};
              const videoType = videoSettings.videoType;
              
              let thumbnailFile: File | null = null;
              
              if (videoType === 'youtube' && videoSettings.videoUrl) {
                // Extract YouTube thumbnail
                const videoId = extractYouTubeVideoId(videoSettings.videoUrl);
                if (videoId) {
                  const thumbnailUrl = getYouTubeThumbnailUrl(videoId);
                  thumbnailFile = await downloadImageAsFile(thumbnailUrl, `youtube-thumbnail-${videoId}.jpg`);
                }
              } else if (videoType === 'file' && videoSettings.video) {
                // Extract frame from video file
                try {
                  // First check if we have the file cached
                  const cachedFile = videoFileCache.get(videoSettings.video);
                  
                  if (cachedFile) {
                    // Extract from cached File object - NO CORS!
                    setLocalError('Extracting thumbnail from cached video...');
                    const frameDataUrl = await extractVideoFrameFromFile(cachedFile);
                    thumbnailFile = dataURLtoFile(frameDataUrl, `video-thumbnail-${Date.now()}.jpg`);
                    setLocalError(null);
                  } else if (videoSettings.video.includes('firebasestorage.googleapis.com')) {
                    // Use proxy to bypass CORS for Firebase videos
                    setLocalError('Extracting thumbnail via proxy (bypassing CORS)...');
                    
                    // Create proxy URL
                    const proxyUrl = `/api/magazine/video-proxy?url=${encodeURIComponent(videoSettings.video)}`;
                    
                    // Extract frame using the proxy URL (no CORS!)
                    const frameDataUrl = await extractVideoFrame(proxyUrl);
                    thumbnailFile = dataURLtoFile(frameDataUrl, `video-thumbnail-${Date.now()}.jpg`);
                    setLocalError(null);
                  } else {
                    // Non-Firebase URL, try direct approach
                    setLocalError('Extracting thumbnail from video...');
                    const frameDataUrl = await extractVideoFrame(videoSettings.video);
                    thumbnailFile = dataURLtoFile(frameDataUrl, `video-thumbnail-${Date.now()}.jpg`);
                    setLocalError(null);
                  }
                } catch (error) {
                  console.error('Error extracting video frame:', error);
                  setLocalError(`Could not extract frame from video: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
              }
              
              if (thumbnailFile) {
                // Upload the thumbnail to Firebase
                const downloadUrl = await storageService.uploadMagazineImage(
                  'temp', // issueId
                  `thumbnail_${field.name}`,
                  thumbnailFile,
                  'content'
                );
                handleChange(downloadUrl);
                setLocalError(null);
              } else {
                setLocalError('No video found to extract thumbnail from');
              }
            } catch (error) {
              console.error('Error extracting video thumbnail:', error);
              setLocalError('Failed to extract video thumbnail');
            } finally {
              setUploading(false);
            }
          }
        };
        
        const showExtractButton = 
          sectionType === 'top-treatment' && 
          field.name === 'heroImage' &&
          field.customActions?.includes('extractVideoThumbnail');
        
        return (
          <>
            <ImageUploadField
              value={typeof value === 'string' ? value : value?.url || ''}
              onChange={(fieldName, newValue) => handleChange(newValue)}
              issueId="temp"
              imageType="content"
              placeholder={field.placeholder || "Enter image URL"}
              required={field.required}
              fieldName={field.name}
              showObjectFitControls={true}
            />
            {showExtractButton && (
              <button
                type="button"
                onClick={handleExtractVideoThumbnail}
                disabled={uploading}
                className="mt-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors disabled:opacity-50"
              >
                {uploading ? 'Extracting...' : '🎬 Extract from Video'}
              </button>
            )}
            {uploading && (
              <p className="text-sm text-gray-600 mt-2">Extracting video thumbnail...</p>
            )}
          </>
        );
        
      case 'url':
        return (
          <div className="space-y-2">
            <input
              type="url"
              value={value || ''}
              onChange={(e) => {
                handleChange(e.target.value);
                // Check if this is a YouTube URL field
                const isYouTubeField = field.name?.includes('YouTube') || field.placeholder?.includes('youtube');
                
                if (e.target.value) {
                  if (isYouTubeField && !validateYouTubeUrl(e.target.value)) {
                    setLocalError('Please enter a valid YouTube URL (e.g., https://www.youtube.com/watch?v=...)');
                  } else if (!isYouTubeField && !validateUrl(e.target.value)) {
                    setLocalError('Please enter a valid URL starting with http:// or https://');
                  } else {
                    setLocalError(null);
                  }
                } else {
                  setLocalError(null);
                }
              }}
              placeholder={field.placeholder || 'https://example.com'}
              disabled={disabled}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal disabled:opacity-50 ${
                localError ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {localError && (
              <p className="text-sm text-red-600">{localError}</p>
            )}
          </div>
        );
        
      case 'link-action':
        return (
          <LinkField
            value={value}
            onChange={handleChange}
            placeholder={field.placeholder}
            helperText={field.helperText}
            required={field.required}
            showActionSelector={true}
            showQRCode={false}
            modalOptions={{
              allowModal: true,
              defaultModalType: 'content'
            }}
          />
        );

      case 'video':
        return (
          <>
            <div className="space-y-2">
              {value && (
                <div className="space-y-2">
                  <video 
                    src={value} 
                    controls 
                    className="w-full rounded-md border border-gray-300"
                    style={{ maxHeight: '300px' }}
                  >
                    Your browser does not support the video tag.
                  </video>
                  <button
                    type="button"
                    onClick={() => handleChange('')}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove Video
                  </button>
                </div>
              )}
              
              {!value && (
                <>
                  <div className="flex gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        // Check file size (limit to 100MB)
                        if (file.size > 100 * 1024 * 1024) {
                          setLocalError('Video file size must be less than 100MB');
                          return;
                        }
                        
                        setUploading(true);
                        setLocalError(null);
                        
                        try {
                          const issueId = 'temp'; // This should be passed from parent
                          const sectionId = `field_${field.name}`;
                          
                          // Upload to Firebase Storage
                          const downloadUrl = await storageService.uploadMagazineVideo(
                            issueId,
                            sectionId,
                            file,
                            'content'
                          );
                          
                          // IMPORTANT: Cache the file for thumbnail extraction
                          videoFileCache.set(downloadUrl, file);
                          
                          // Store video metadata in localStorage
                          const storedVideos = JSON.parse(localStorage.getItem('magazineEditorVideos') || '[]');
                          storedVideos.unshift({
                            url: downloadUrl,
                            path: `magazine/${issueId}/${sectionId}/video_${Date.now()}_${file.name}`,
                            videoType: 'content',
                            issueId,
                            uploadedAt: new Date().toISOString(),
                            name: file.name
                          });
                          
                          // Keep only last 30 videos
                          localStorage.setItem('magazineEditorVideos', JSON.stringify(storedVideos.slice(0, 30)));
                          
                          handleChange(downloadUrl);
                        } catch (error) {
                          console.error('Video upload error:', error);
                          setLocalError('Failed to upload video. Please try again.');
                        } finally {
                          setUploading(false);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }
                      }}
                      disabled={disabled || uploading}
                      className="flex-1"
                    />
                    
                    <button
                      type="button"
                      onClick={() => setShowVideoGallery(true)}
                      className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors whitespace-nowrap"
                    >
                      📁 Use Existing
                    </button>
                  </div>
                  
                  {uploading && (
                    <p className="text-sm text-gray-600">Uploading video... This may take a moment.</p>
                  )}
                  {localError && (
                    <p className="text-sm text-red-600">{localError}</p>
                  )}
                </>
              )}
            </div>
            
            {showVideoGallery && (
              <VideoGallery
                isOpen={showVideoGallery}
                onClose={() => setShowVideoGallery(false)}
                onSelect={(url) => {
                  handleChange(url);
                  setShowVideoGallery(false);
                  // Note: Gallery videos won't be cached, only newly uploaded ones
                }}
                currentVideoType="content"
              />
            )}
          </>
        );

      case 'file':
        return (
          <div className="space-y-2">
            <input
              type="url"
              value={value || ''}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={`Enter ${field.type} URL`}
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal disabled:opacity-50"
            />
          </div>
        );

      case 'toggle':
      case 'checkbox':
        return (
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleChange(e.target.checked)}
              disabled={disabled}
              className="h-4 w-4 text-glamlink-teal focus:ring-glamlink-teal border-gray-300 rounded"
            />
            {field.placeholder && (
              <span className="ml-2 text-sm text-gray-600">{field.placeholder}</span>
            )}
          </label>
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            className={compact 
              ? "w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-glamlink-teal disabled:opacity-50"
              : "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal disabled:opacity-50"
            }
          >
            <option value="">{compact ? field.label.replace('Title/Role 2 ', '') : 'Select...'}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'icon-select':
        const iconOptions = [
          { value: '', label: 'No icon' },
          { value: '👀', label: '👀 Eyes' },
          { value: '💫', label: '💫 Sparkle' },
          { value: '⭐', label: '⭐ Star' },
          { value: '❤️', label: '❤️ Heart' },
          { value: '✅', label: '✅ Check' },
          { value: '🔥', label: '🔥 Fire' },
          { value: '✨', label: '✨ Sparkles' },
          { value: '🏆', label: '🏆 Trophy' },
          { value: '👑', label: '👑 Crown' },
          { value: '💎', label: '💎 Gem' },
          { value: '🚀', label: '🚀 Rocket' },
          { value: '🤖', label: '🤖 Robot' },
          { value: '📸', label: '📸 Camera' },
          { value: '💡', label: '💡 Light Bulb' },
          { value: '📈', label: '📈 Chart' },
          { value: '🎯', label: '🎯 Target' },
          { value: '🌟', label: '🌟 Glowing Star' },
          { value: '🎨', label: '🎨 Palette' },
          { value: '🎁', label: '🎁 Gift' },
          { value: '🎉', label: '🎉 Party' },
          { value: '💰', label: '💰 Money Bag' },
          { value: '💳', label: '💳 Credit Card' },
          { value: '🔔', label: '🔔 Bell' },
          { value: '📱', label: '📱 Phone' },
          { value: '💻', label: '💻 Computer' },
          { value: '🌍', label: '🌍 Globe' },
          { value: '🔒', label: '🔒 Lock' },
          { value: '🔓', label: '🔓 Unlock' },
          { value: '🎓', label: '🎓 Graduation Cap' },
          { value: '📚', label: '📚 Books' },
          { value: '💼', label: '💼 Briefcase' },
          { value: '🛍️', label: '🛍️ Shopping Bag' },
          { value: '🏅', label: '🏅 Medal' },
          { value: '🌈', label: '🌈 Rainbow' },
          { value: '⚡', label: '⚡ Lightning' },
          { value: '🔮', label: '🔮 Crystal Ball' },
        ];

        return (
          <select
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            className={compact 
              ? "w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-glamlink-teal disabled:opacity-50"
              : "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal disabled:opacity-50"
            }
          >
            {iconOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'typography-group':
        return (
          <CollapsibleTypographyWrapper
            field={field}
            value={value || {}}
            onChange={handleChange}
          />
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={(value || []).includes(option.value)}
                  onChange={(e) => {
                    const current = value || [];
                    if (e.target.checked) {
                      handleChange([...current, option.value]);
                    } else {
                      handleChange(current.filter((v: string) => v !== option.value));
                    }
                  }}
                  disabled={disabled}
                  className="h-4 w-4 text-glamlink-teal focus:ring-glamlink-teal border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'array':
        return (
          <ArrayFieldRenderer
            field={field}
            value={value || []}
            onChange={handleChange}
            disabled={disabled}
          />
        );

      case 'object':
        return (
          <ObjectFieldRenderer
            field={field}
            value={value || {}}
            onChange={handleChange}
            disabled={disabled}
          />
        );

      case 'background-color':
        return (
          <BackgroundColorField
            value={value}
            onChange={handleChange}
            placeholder={field.placeholder}
            helperText={field.helperText}
            disabled={disabled}
          />
        );

      case 'color':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={value || '#000000'}
              onChange={(e) => handleChange(e.target.value)}
              disabled={disabled}
              className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={value || ''}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="#000000"
              disabled={disabled}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal disabled:opacity-50"
            />
          </div>
        );

      case 'icon':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal disabled:opacity-50"
          >
            <option value="">No icon</option>
            <option value="⏱️">⏱️ Timer</option>
            <option value="📅">📅 Calendar</option>
            <option value="💰">💰 Money</option>
            <option value="⭐">⭐ Star</option>
            <option value="❤️">❤️ Heart</option>
            <option value="✅">✅ Check</option>
            <option value="🔥">🔥 Fire</option>
            <option value="✨">✨ Sparkles</option>
            <option value="🏆">🏆 Trophy</option>
            <option value="👑">👑 Crown</option>
            <option value="💎">💎 Gem</option>
            <option value="🚀">🚀 Rocket</option>
            <option value="🤖">🤖 Robot</option>
            <option value="📸">📸 Camera</option>
            <option value="💡">💡 Light Bulb</option>
            <option value="📈">📈 Chart</option>
            <option value="🎯">🎯 Target</option>
            <option value="🌟">🌟 Glowing Star</option>
          </select>
        );

      case 'custom-blocks':
        // Import the CustomSectionEditor dynamically
        const CustomSectionEditor = require('@/lib/pages/admin/components/magazine/web/editor/components/custom-section-editor').CustomSectionEditor;
        return (
          <CustomSectionEditor
            section={{ 
              type: 'custom-section', 
              contentBlocks: value || [], 
              headerLayout: formData?.headerLayout || 'default',
              headerInlineComponent: formData?.headerInlineComponent,
              sectionTitle: formData?.sectionTitle,
              sectionSubtitle: formData?.sectionSubtitle,
              sectionDescription: formData?.sectionDescription,
              layout: formData?.layout,
              spacing: formData?.spacing,
              sectionBackground: formData?.sectionBackground,
              sectionBorder: formData?.sectionBorder,
              ...formData 
            }}
            onUpdate={(updates: any) => {
              // Only handle contentBlocks updates through this onChange
              // Other fields like headerLayout should be handled separately through the form
              if (updates.contentBlocks !== undefined) {
                handleChange(updates.contentBlocks);
              }
              // Store other updates in formData for access
              if (updates.headerLayout !== undefined || updates.headerInlineComponent !== undefined) {
                Object.keys(updates).forEach(key => {
                  if (key !== 'contentBlocks' && formData) {
                    formData[key] = updates[key];
                  }
                });
              }
            }}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-glamlink-teal disabled:opacity-50"
          />
        );
    }
  };

  return (
    <div className={`${field.fullWidth ? 'col-span-full' : ''}`}>
      {!compact && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {renderField()}
      {!compact && field.helperText && (
        <p className="mt-1 text-xs text-gray-500">{field.helperText}</p>
      )}
      {(error || localError) && (
        <p className="mt-1 text-xs text-red-600">{error || localError}</p>
      )}
    </div>
  );
}

// Array field renderer component
function ArrayFieldRenderer({ field, value, onChange, disabled }: any) {
  const handleAdd = () => {
    const newItem = field.itemType === 'object' ? {} : '';
    onChange([...value, newItem]);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_: any, i: number) => i !== index));
  };

  const handleItemChange = (index: number, newValue: any) => {
    const updated = [...value];
    updated[index] = newValue;
    onChange(updated);
  };

  const canAdd = !field.maxItems || value.length < field.maxItems;

  return (
    <div className="space-y-2">
      {value.map((item: any, index: number) => (
        <div key={index} className="flex items-start space-x-2">
          <div className="flex-1">
            {field.itemType === 'object' && (field.objectFields || field.fields) ? (
              <ObjectFieldRenderer
                field={{ ...field, fields: field.objectFields || field.fields }}
                value={item}
                onChange={(v: any) => handleItemChange(index, v)}
                disabled={disabled}
              />
            ) : (
              <DynamicFieldRenderer
                field={{ ...field, type: field.itemType, label: '' }}
                value={item}
                onChange={(v: any) => handleItemChange(index, v)}
                disabled={disabled}
              />
            )}
          </div>
          <button
            type="button"
            onClick={() => handleRemove(index)}
            disabled={disabled || (field.minItems && value.length <= field.minItems)}
            className="px-2 py-1 text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      ))}
      {canAdd && (
        <button
          type="button"
          onClick={handleAdd}
          disabled={disabled}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          Add {field.label}
        </button>
      )}
    </div>
  );
}

// Object field renderer component
function ObjectFieldRenderer({ field, value, onChange, disabled }: any) {
  const handleFieldChange = (fieldName: string, fieldValue: any) => {
    // Find the field definition to check if it's a typography-group
    const fieldDef = field.fields?.find((f: any) => f.name === fieldName);

    // If it's a typography-group field with an object value, flatten it
    if (fieldDef?.type === 'typography-group' && fieldValue && typeof fieldValue === 'object' && !Array.isArray(fieldValue)) {
      // Flatten typography object into individual properties
      const updated = { ...value };
      Object.keys(fieldValue).forEach(key => {
        updated[key] = fieldValue[key];
      });
      onChange(updated);
    } else {
      // Regular field update
      onChange({ ...value, [fieldName]: fieldValue });
    }
  };

  if (!field.fields) return null;

  // Filter fields based on conditions
  const visibleFields = field.fields.filter((subField: FieldSchema) => {
    if (!subField.condition) return true;
    
    // Check if the condition field value matches
    const conditionFieldValue = value[subField.condition.field];
    return conditionFieldValue === subField.condition.value;
  });

  // Check if we should display fields horizontally
  const isHorizontal = field.columns && field.columns > 1;
  
  if (isHorizontal) {
    // Horizontal layout using flex
    return (
      <div className="p-3 bg-gray-50 rounded-md">
        <div className="flex flex-wrap gap-3">
          {visibleFields.map((subField: FieldSchema) => {
            // For horizontal layout, show labels above fields
            return (
              <div key={subField.name} className="flex-1 min-w-0">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {subField.label}
                  {subField.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <DynamicFieldRenderer
                  field={{ ...subField, label: '' }} // Remove label since we're showing it above
                  value={value[subField.name]}
                  onChange={(v) => handleFieldChange(subField.name, v)}
                  formData={value}
                  disabled={disabled}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Vertical layout (default)
  return (
    <div className="space-y-3 p-3 bg-gray-50 rounded-md">
      {visibleFields.map((subField: FieldSchema) => (
        <DynamicFieldRenderer
          key={subField.name}
          field={subField}
          value={value[subField.name]}
          onChange={(v) => handleFieldChange(subField.name, v)}
          formData={value}
          disabled={disabled}
        />
      ))}
    </div>
  );
}