"use client";

import Image from "next/image";
import Link from "next/link";
import DownloadDialog from "./DownloadDialog";
import analytics from "@/lib/services/analytics";

interface UserProCombinedDownloadDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProCombinedDownloadDialog({ isOpen, onClose }: UserProCombinedDownloadDialogProps) {
  const handleUserAppStoreClick = () => {
    const url = "https://apps.apple.com/us/app/glamlink/id6502334118";
    analytics.trackAppDownloadClick({
      app_type: 'user',
      store_type: 'apple',
      link_url: url,
      dialog_source: 'combined_download_dialog'
    });
  };

  const handleProAppStoreClick = () => {
    const url = "https://apps.apple.com/us/app/glamlink-pro/id6502331317";
    analytics.trackAppDownloadClick({
      app_type: 'pro',
      store_type: 'apple',
      link_url: url,
      dialog_source: 'combined_download_dialog'
    });
  };

  return (
    <DownloadDialog isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <div className="text-6xl mb-6">✨</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Download the Glamlink App</h2>

        <p className="text-gray-700 mb-8">
          Discover beauty professionals, book appointments, and shop products — or showcase your work and grow your beauty business.
        </p>

        <div className="space-y-6">
          {/* For Users Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">For Clients</h3>
            <p className="text-sm text-gray-600 mb-4">Book with trusted beauty professionals near you</p>
            <Link
              href="https://apps.apple.com/us/app/glamlink/id6502334118"
              target="_blank"
              className="inline-block"
              onClick={handleUserAppStoreClick}
            >
              <Image src="/images/apple_app_icon.png" alt="Download Glamlink for Clients on the App Store" width={150} height={45} className="hover:opacity-90 transition-opacity" />
            </Link>
          </div>

          {/* For Professionals Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">For Professionals</h3>
            <p className="text-sm text-gray-600 mb-4">Set up your profile, showcase your work, and get booked</p>
            <Link
              href="https://apps.apple.com/us/app/glamlink-pro/id6502331317"
              target="_blank"
              className="inline-block"
              onClick={handleProAppStoreClick}
            >
              <Image src="/images/apple_app_icon.png" alt="Download Glamlink Pro for Professionals on the App Store" width={150} height={45} className="hover:opacity-90 transition-opacity" />
            </Link>
          </div>
        </div>
      </div>
    </DownloadDialog>
  );
}