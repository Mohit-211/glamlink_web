"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import CloseIcon from "@mui/icons-material/Close";

interface DownloadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  backgroundColor?: string;
  maxWidth?: string;
}

export default function DownloadDialog({ isOpen, onClose, children, backgroundColor = "bg-white", maxWidth = "max-w-md" }: DownloadDialogProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Use createPortal to render the modal at the document body level
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className={`relative ${backgroundColor} rounded-2xl p-8 ${maxWidth} w-full shadow-2xl`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <CloseIcon />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}