"use client";

import { X } from "lucide-react";
import Image from "next/image";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserDownloadDialog = ({ isOpen, onClose }: DownloadModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Emoji */}
        <div className="text-5xl text-center mb-4">👩‍🦰</div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-4">
          Welcome to Glamlink - your new favorite beauty app
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-center mb-6 leading-relaxed">
          Discover trusted beauty professionals near you. Book with ease, and
          shop expert-approved products - all in one place.
        </p>

        <p className="text-gray-800 font-medium text-center mb-6">
          Get the full experience — download the app:
        </p>

        {/* Store Buttons */}
        <div className="flex justify-center gap-4">
          <a
            href="https://apps.apple.com/us/app/glamlink-pro/id6502331317"
            className="hover:scale-105 transition"
          >
            <Image
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="App Store"
              width={140}
              height={40}
              unoptimized
            />
          </a>

          <a
            href="https://play.google.com/store/apps/details?id=com.glamlinkprobeauty&pli=1"
            className="hover:scale-105 transition"
          >
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Google Play"
              width={160}
              height={40}
              unoptimized
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserDownloadDialog;