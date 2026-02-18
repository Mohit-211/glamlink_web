"use client";

import { GetFeaturedSubmission } from "../../types";

interface FieldRendererProps {
  submission: GetFeaturedSubmission;
}

// Helper component for rendering individual fields
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-sm font-medium text-gray-900 mb-2">{label}</h4>
      {children}
    </div>
  );
}

// Helper for rendering text fields
export function TextField({ value, label }: { value: any; label: string }) {
  // Handle different data types safely
  if (value === undefined || value === null) return null;

  // Convert to string if needed
  const stringValue = typeof value === 'string' ? value : String(value);
  if (stringValue.trim() === '') return null;

  return (
    <Field label={label}>
      <p className="text-gray-700 whitespace-pre-wrap">{stringValue}</p>
    </Field>
  );
}

// Helper for rendering URL fields
export function UrlField({ value, label }: { value: any; label: string }) {
  if (value === undefined || value === null) return null;

  const stringValue = typeof value === 'string' ? value : String(value);
  if (stringValue.trim() === '') return null;

  return (
    <Field label={label}>
      <a
        href={stringValue.startsWith('http') ? stringValue : `https://${stringValue}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-glamlink-teal hover:underline"
      >
        {stringValue}
      </a>
    </Field>
  );
}

// Helper for rendering email fields
export function EmailField({ value, label }: { value: any; label: string }) {
  if (value === undefined || value === null) return null;

  const stringValue = typeof value === 'string' ? value : String(value);
  if (stringValue.trim() === '') return null;

  return (
    <Field label={label}>
      <a
        href={`mailto:${stringValue}`}
        className="text-glamlink-teal hover:underline"
      >
        {stringValue}
      </a>
    </Field>
  );
}

// Helper for rendering phone fields
export function PhoneField({ value, label }: { value: any; label: string }) {
  if (value === undefined || value === null) return null;

  const stringValue = typeof value === 'string' ? value : String(value);
  if (stringValue.trim() === '') return null;

  return (
    <Field label={label}>
      <a
        href={`tel:${stringValue}`}
        className="text-gray-700 hover:text-glamlink-teal"
      >
        {stringValue}
      </a>
    </Field>
  );
}

// Helper for rendering checkbox/multi-select fields as tags
export function TagField({
  values,
  label,
  color = "teal"
}: {
  values: any[] | undefined;
  label: string;
  color?: "teal" | "red" | "blue" | "green" | "purple" | "orange";
}) {
  if (!values || values.length === 0) return null;

  const validValues = values.filter(v => {
    if (v === undefined || v === null) return false;
    const stringValue = typeof v === 'string' ? v : String(v);
    return stringValue.trim() !== '';
  });

  if (validValues.length === 0) return null;

  const colorClasses = {
    teal: "bg-glamlink-teal/10 text-glamlink-teal",
    red: "bg-red-50 text-red-700",
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    purple: "bg-purple-50 text-purple-700",
    orange: "bg-orange-50 text-orange-700"
  };

  return (
    <Field label={label}>
      <div className="flex flex-wrap gap-2">
        {validValues.map((value, index) => {
          const stringValue = typeof value === 'string' ? value : String(value);
          return (
            <span key={index} className={`px-3 py-1 rounded-full text-sm ${colorClasses[color]}`}>
              {stringValue}
            </span>
          );
        })}
      </div>
    </Field>
  );
}

// Helper for rendering boolean fields
export function BooleanField({
  value,
  label,
  trueText = "Yes",
  falseText = "No"
}: {
  value: boolean | undefined;
  label: string;
  trueText?: string;
  falseText?: string;
}) {
  if (value === undefined) return null;
  return (
    <Field label={label}>
      <p className="text-gray-700">
        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
          value
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? trueText : falseText}
        </span>
      </p>
    </Field>
  );
}

// Helper for rendering bullet-point arrays
export function BulletArrayField({
  values,
  label
}: {
  values: any[] | undefined;
  label: string;
}) {
  if (!values || values.length === 0) return null;

  const validValues = values.filter(v => {
    if (v === undefined || v === null) return false;
    const stringValue = typeof v === 'string' ? v : String(v);
    return stringValue.trim() !== '';
  });

  if (validValues.length === 0) return null;

  return (
    <Field label={label}>
      <ul className="space-y-2">
        {validValues.map((value, index) => {
          const stringValue = typeof value === 'string' ? value : String(value);
          return (
            <li key={index} className="flex items-start">
              <span className="text-glamlink-teal mt-1 mr-2">•</span>
              <span className="text-gray-700">{stringValue}</span>
            </li>
          );
        })}
      </ul>
    </Field>
  );
}

// Helper for rendering file uploads
export function FileUploadField({
  files,
  label
}: {
  files: Array<{ name: string; type: string; size: number; data?: string; url?: string }> | undefined;
  label: string;
}) {
  if (!files || files.length === 0) return null;

  // Filter out invalid files before rendering
  const validFiles = files.filter(file => {
    return file && file.name && (file.data || file.url);
  });

  if (validFiles.length === 0) {
    return (
      <Field label={label}>
        <div className="text-sm text-gray-500 italic">
          No valid files available
        </div>
      </Field>
    );
  }

  const downloadFile = (file: any) => {
    try {
      console.log('Downloading file:', file.name, 'Type:', file.type, 'Has URL:', !!file.url, 'Has Data:', !!file.data);

      const link = document.createElement('a');
      const mimeType = file.type || 'application/octet-stream';

      // Handle different file formats
      if (file.data) {
        // Old format: base64 data
        link.href = `data:${mimeType};base64,${file.data}`;
        console.log('Using base64 download for:', file.name);
      } else if (file.url) {
        // New format: Firebase Storage URL
        link.href = file.url;
        link.target = '_blank'; // Open in new tab for Firebase URLs
        console.log('Using Firebase Storage URL download for:', file.name);
      } else {
        // No file data available
        console.warn('No file data available for download:', file.name, 'File object:', file);
        return;
      }

      link.download = file.name || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('Download initiated for:', file.name);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const isImage = (type: string | undefined) => {
    if (!type) return false;
    // Check if it's an image MIME type
    if (type.startsWith('image/')) return true;
    // Fallback: check file extension for common image types
    const extension = type.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension || '');
  };

  const isVideo = (type: string | undefined) => {
    if (!type) return false;
    // Check if it's a video MIME type
    if (type.startsWith('video/')) return true;
    // Fallback: check file extension for common video types
    const extension = type.split('.').pop()?.toLowerCase();
    return ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v'].includes(extension || '');
  };

  const formatFileSize = (size: number | undefined) => {
    if (!size || typeof size !== 'number') return 'Unknown size';
    return `${(size / 1024).toFixed(1)} KB`;
  };

  const getFileTypeDisplay = (type: string | undefined) => {
    return type || 'Unknown type';
  };

  const getImageSrc = (file: any): string => {
    // Prioritize Firebase Storage URL over base64 data
    if (file.url) {
      return file.url;
    } else if (file.data) {
      return `data:${file.type};base64,${file.data}`;
    }
    return '';
  };

  const canDownloadFile = (file: any): boolean => {
    return !!(file.data || file.url);
  };

  return (
    <Field label={label}>
      <div className="space-y-4">
        {validFiles.map((file, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name || 'Unnamed file'}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)} • {getFileTypeDisplay(file.type)}
                </p>
              </div>
              <button
                onClick={() => downloadFile(file)}
                disabled={!canDownloadFile(file)}
                className={`ml-3 px-3 py-1 text-xs rounded transition-colors ${
                  canDownloadFile(file)
                    ? 'bg-glamlink-teal text-white hover:bg-glamlink-teal-dark'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {canDownloadFile(file) ? 'Download' : 'Unavailable'}
              </button>
            </div>
            {isImage(file.type) && (file.data || file.url) && (
              <div className="mt-3">
                <img
                  src={getImageSrc(file)}
                  alt={file.name || 'Image'}
                  className="max-w-full h-48 object-cover rounded"
                  onError={(e) => {
                    console.warn('Failed to load image:', file.name, 'Data present:', !!file.data, 'URL present:', !!file.url, 'Image src:', getImageSrc(file));
                    // Show fallback when image fails to load
                    e.currentTarget.src = '';
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}

            {isVideo(file.type) && (file.data || file.url) && (
              <div className="mt-3">
                <div className="relative">
                  <video
                    src={getImageSrc(file)}
                    controls
                    className="max-w-full h-48 object-cover rounded"
                    onError={(e) => {
                      console.warn('Failed to load video:', file.name);
                      // Show fallback when video fails to load
                      e.currentTarget.style.display = 'none';
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                  {/* Video indicator */}
                  <div className="absolute top-2 left-2 bg-black/50 rounded-full p-1.5">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Show fallback for media with no data */}
            {(isImage(file.type) || isVideo(file.type)) && !file.data && !file.url && (
              <div className="mt-3">
                <div className="w-full h-48 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
                  <div className="text-center p-4">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-500">
                      {isImage(file.type) ? 'Image' : 'Video'} not available
                    </p>
                    <p className="text-xs text-red-500 mt-1">Type: {file.type || 'undefined'}, Data: {file.data ? 'present' : 'missing'}, URL: {file.url ? 'present' : 'missing'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Field>
  );
}

// Helper for rendering conditional fields
export function ConditionalField({
  condition,
  label,
  children
}: {
  condition: any;
  label: string;
  children: React.ReactNode;
}) {
  if (!condition) return null;
  return <Field label={label}>{children}</Field>;
}