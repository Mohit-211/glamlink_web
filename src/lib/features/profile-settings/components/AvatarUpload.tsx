"use client";

/**
 * AvatarUpload - Profile photo upload component with preview
 */

import { useState, useRef } from "react";
import { Camera, X } from "lucide-react";
import { uploadImage, validateImageFile, IMAGE_UPLOAD_CONFIG } from "@/lib/utils/imageUpload";

interface AvatarUploadProps {
  currentPhotoURL: string;
  displayName: string;
  onPhotoChange: (url: string) => void;
  disabled?: boolean;
}

export default function AvatarUpload({
  currentPhotoURL,
  displayName,
  onPhotoChange,
  disabled = false,
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get initials for fallback avatar
  const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || "Invalid file");
      return;
    }

    // Create preview
    const objectURL = URL.createObjectURL(file);
    setPreviewURL(objectURL);

    // Upload
    setIsUploading(true);
    try {
      const result = await uploadImage(file);

      if (result.success && result.path) {
        onPhotoChange(result.path);
        setPreviewURL(null);
      } else {
        setUploadError(result.error || "Upload failed");
        setPreviewURL(null);
      }
    } catch {
      setUploadError("Failed to upload image");
      setPreviewURL(null);
    } finally {
      setIsUploading(false);
      // Clean up object URL
      URL.revokeObjectURL(objectURL);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemovePhoto = () => {
    onPhotoChange("");
    setPreviewURL(null);
    setUploadError(null);
  };

  const displayURL = previewURL || currentPhotoURL;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar Display */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-glamlink-pink to-glamlink-teal flex items-center justify-center">
          {displayURL ? (
            <img
              src={displayURL}
              alt={displayName || "Profile"}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl font-semibold text-white">
              {getInitials(displayName)}
            </span>
          )}
        </div>

        {/* Upload Overlay (when not disabled) */}
        {!disabled && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute inset-0 w-24 h-24 rounded-full bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <Camera className="w-6 h-6 text-white" />
            )}
          </button>
        )}

        {/* Remove Photo Button */}
        {displayURL && !disabled && !isUploading && (
          <button
            type="button"
            onClick={handleRemovePhoto}
            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-sm transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={IMAGE_UPLOAD_CONFIG.acceptedExtensions.join(",")}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Upload Button */}
      {!disabled && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="text-sm text-glamlink-teal hover:text-glamlink-teal/80 font-medium transition-colors disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : currentPhotoURL ? "Change Photo" : "Upload Photo"}
        </button>
      )}

      {/* Error Message */}
      {uploadError && (
        <p className="text-xs text-red-600">{uploadError}</p>
      )}

      {/* Helper Text */}
      {!disabled && (
        <p className="text-xs text-gray-500">
          JPG, PNG, WebP or GIF. Max 5MB.
        </p>
      )}
    </div>
  );
}
