"use client";

import Image from "next/image";
import Link from "next/link";
import DownloadDialog from "./DownloadDialog";
import analytics from "@/lib/services/analytics";

interface UserDownloadDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDownloadDialog({ isOpen, onClose }: UserDownloadDialogProps) {
  console.log("UserDownloadDialog render, isOpen:", isOpen);
  
  const handleAppStoreClick = () => {
    const url = "https://apps.apple.com/us/app/glamlink/id6502334118";
    analytics.trackAppDownloadClick({
      app_type: 'user',
      store_type: 'apple',
      link_url: url,
      dialog_source: 'user_download_dialog'
    });
  };

  const handlePlayStoreClick = () => {
    const url = "https://play.google.com/store/apps/details?id=com.glamlinkUser";
    analytics.trackAppDownloadClick({
      app_type: 'user',
      store_type: 'google',
      link_url: url,
      dialog_source: 'user_download_dialog'
    });
  };
  
  return (
    <DownloadDialog isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <div className="text-6xl mb-6">👩‍🦰</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Glamlink - your new favorite beauty app</h2>

        <p className="text-gray-700 mb-8">Discover trusted beauty professionals near you. Book with ease, and shop expert-approved products - all in one place.</p>

        <p className="text-lg font-semibold text-gray-900 mb-6">Get the full experience — download the app:</p>

        <div className="space-y-3">
          <Link 
            href="https://apps.apple.com/us/app/glamlink/id6502334118" 
            target="_blank" 
            className="inline-block mr-4"
            onClick={handleAppStoreClick}
          >
            <Image src="/images/apple_app_icon.png" alt="Download on the App Store" width={150} height={45} className="hover:opacity-90 transition-opacity" />
          </Link>

          <Link 
            href="https://play.google.com/store/apps/details?id=com.glamlinkUser" 
            target="_blank" 
            className="inline-block"
            onClick={handlePlayStoreClick}
          >
            <Image src="/images/google_app_icon.png" alt="Get it on Google Play" width={150} height={45} className="hover:opacity-90 transition-opacity" />
          </Link>
        </div>
      </div>
    </DownloadDialog>
  );
}
