'use client';

/**
 * FilesDisplay - File/image gallery display component
 *
 * Displays uploaded files with media type detection.
 * Renders images, videos, or generic file links appropriately.
 * Returns null if files array is empty.
 */

import { ExternalLink } from 'lucide-react';
import type { FilesDisplayProps } from '../types';

const COLUMN_CLASSES = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

export function FilesDisplay({
  label,
  files,
  columns = 2,
  showNames = false,
}: FilesDisplayProps) {
  if (!files || files.length === 0) return null;

  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className={`mt-2 grid ${COLUMN_CLASSES[columns]} gap-4`}>
        {files.map((file, index) => (
          <a
            key={index}
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            {file.type?.startsWith('image/') ? (
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={file.url}
                  alt={file.name || 'Uploaded file'}
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                />
                {showNames && file.name && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 px-2 py-1">
                    <span className="text-xs text-white truncate block">{file.name}</span>
                  </div>
                )}
              </div>
            ) : file.type?.startsWith('video/') ? (
              <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                <span className="text-white text-xs">Video</span>
                {showNames && file.name && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 px-2 py-1">
                    <span className="text-xs text-white truncate block">{file.name}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100">
                <ExternalLink className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700 truncate">{file.name || 'File'}</span>
              </div>
            )}
          </a>
        ))}
      </dd>
    </div>
  );
}

export default FilesDisplay;
