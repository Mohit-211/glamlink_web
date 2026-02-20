'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Attachment } from '../types/attachment';
import { formatFileSize } from '../types/attachment';

interface AttachmentPreviewProps {
  /** Attachments to display */
  attachments: Attachment[];
  /** Whether to show in compact mode (for message bubbles) */
  compact?: boolean;
  /** Callback when user wants to download */
  onDownload?: (attachment: Attachment) => void;
}

export function AttachmentPreview({
  attachments,
  compact = false,
  onDownload,
}: AttachmentPreviewProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  if (attachments.length === 0) return null;

  const images = attachments.filter((a) => a.type === 'image');
  const documents = attachments.filter((a) => a.type !== 'image');

  return (
    <>
      <div className={`mt-2 ${compact ? 'space-y-1' : 'space-y-2'}`}>
        {/* Images */}
        {images.length > 0 && (
          <div className={`flex flex-wrap gap-2 ${compact ? '-mx-1' : ''}`}>
            {images.map((image) => (
              <button
                key={image.id}
                onClick={() => setLightboxImage(image.url)}
                className={`relative overflow-hidden rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-glamlink-purple focus:ring-offset-1 ${
                  compact ? 'w-20 h-20' : 'w-32 h-32'
                }`}
                aria-label={`View ${image.name}`}
              >
                <Image
                  src={image.url}
                  alt={image.name}
                  fill
                  className="object-cover"
                  sizes={compact ? '80px' : '128px'}
                />
              </button>
            ))}
          </div>
        )}

        {/* Documents */}
        {documents.length > 0 && (
          <div className="space-y-1">
            {documents.map((doc) => (
              <a
                key={doc.id}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (onDownload) {
                    e.preventDefault();
                    onDownload(doc);
                  }
                }}
                className={`flex items-center gap-2 rounded-lg transition-colors hover:bg-black/5 ${
                  compact ? 'p-1' : 'p-2 border border-gray-200'
                }`}
              >
                <div className={`flex-shrink-0 ${compact ? 'w-6 h-6' : 'w-8 h-8'}`}>
                  <DocumentIcon mimeType={doc.mimeType} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`truncate ${compact ? 'text-xs' : 'text-sm'} font-medium`}>
                    {doc.name}
                  </p>
                  {!compact && (
                    <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                  )}
                </div>
                <svg
                  className={`flex-shrink-0 ${compact ? 'w-3 h-3' : 'w-4 h-4'} text-gray-400`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox for images */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            aria-label="Close preview"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
            <Image
              src={lightboxImage}
              alt="Full size preview"
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 1024px"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Icon component for document types
 */
function DocumentIcon({ mimeType }: { mimeType: string }) {
  let color = 'text-gray-400';
  let icon = (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  );

  if (mimeType === 'application/pdf') {
    color = 'text-red-500';
    icon = (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
        <text x="7" y="17" className="text-[8px] font-bold fill-current" stroke="none">
          PDF
        </text>
      </>
    );
  } else if (mimeType.includes('word') || mimeType.includes('document')) {
    color = 'text-blue-500';
  } else if (mimeType === 'text/plain') {
    color = 'text-gray-600';
  }

  return (
    <svg className={`w-full h-full ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {icon}
    </svg>
  );
}

/**
 * Compact attachment indicator for use in lists
 */
export function AttachmentIndicator({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
        />
      </svg>
      <span>{count}</span>
    </span>
  );
}
