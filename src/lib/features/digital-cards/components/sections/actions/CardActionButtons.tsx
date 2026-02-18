'use client';

import { Link2, Check, Download, Loader2, X } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

export interface CardActionButtonsProps {
  /** Callback to copy URL */
  onCopyUrl: () => void;
  /** Whether the URL was just copied */
  isCopied: boolean;
  /** Callback to open save image modal */
  onSaveImage: () => void;
  /** Whether image is being saved */
  isSaving: boolean;
  /** Optional callback to close the modal */
  onClose?: () => void;
  /** Custom class name */
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function CardActionButtons({
  onCopyUrl,
  isCopied,
  onSaveImage,
  isSaving,
  onClose,
  className = '',
}: CardActionButtonsProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Close Button - Only shown when onClose is provided */}
      {onClose && (
        <button
          onClick={onClose}
          className="
            relative group flex items-center justify-center
            w-8 h-8 rounded-full
            transition-all duration-200
            bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800
          "
          title="Close"
          aria-label="Close"
        >
          <X className="w-4 h-4" />

          {/* Tooltip */}
          <span className="
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2
            px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded
            opacity-0 group-hover:opacity-100 transition-opacity
            whitespace-nowrap pointer-events-none
          ">
            Close
          </span>
        </button>
      )}

      {/* Copy URL Button */}
      <button
        onClick={onCopyUrl}
        disabled={isCopied}
        className={`
          relative group flex items-center justify-center
          w-8 h-8 rounded-full
          transition-all duration-200
          ${isCopied
            ? 'bg-green-100 text-green-600'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800'
          }
        `}
        title={isCopied ? 'Copied!' : 'Copy URL'}
        aria-label={isCopied ? 'URL copied' : 'Copy card URL'}
      >
        {isCopied ? (
          <Check className="w-4 h-4" />
        ) : (
          <Link2 className="w-4 h-4" />
        )}

        {/* Tooltip */}
        <span className="
          absolute bottom-full left-1/2 -translate-x-1/2 mb-2
          px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded
          opacity-0 group-hover:opacity-100 transition-opacity
          whitespace-nowrap pointer-events-none
        ">
          {isCopied ? 'Copied!' : 'Copy URL'}
        </span>
      </button>

      {/* Save as Image Button */}
      <button
        onClick={onSaveImage}
        disabled={isSaving}
        className={`
          relative group flex items-center justify-center
          w-8 h-8 rounded-full
          transition-all duration-200
          ${isSaving
            ? 'bg-glamlink-teal/20 text-glamlink-teal cursor-wait'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800'
          }
        `}
        title="Save as Image"
        aria-label="Save card as image"
      >
        {isSaving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}

        {/* Tooltip */}
        <span className="
          absolute bottom-full left-1/2 -translate-x-1/2 mb-2
          px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded
          opacity-0 group-hover:opacity-100 transition-opacity
          whitespace-nowrap pointer-events-none
        ">
          {isSaving ? 'Saving...' : 'Save as Image'}
        </span>
      </button>
    </div>
  );
}

export { CardActionButtons };
