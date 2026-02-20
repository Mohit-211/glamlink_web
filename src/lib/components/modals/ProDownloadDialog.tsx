"use client";

import Image from "next/image";
import Link from "next/link";
import DownloadDialog from "./DownloadDialog";
import analytics from "@/lib/services/analytics";

interface ProDownloadDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProDownloadDialog({ isOpen, onClose }: ProDownloadDialogProps) {
  const handleAppStoreClick = () => {
    const url = "https://apps.apple.com/us/app/glamlink-pro/id6502331317";
    analytics.trackAppDownloadClick({
      app_type: 'pro',
      store_type: 'apple',
      link_url: url,
      dialog_source: 'pro_download_dialog'
    });
  };

  const handlePlayStoreClick = () => {
    const url = "https://play.google.com/store/apps/details?id=com.glamlinkprobeauty&pli=1";
    analytics.trackAppDownloadClick({
      app_type: 'pro',
      store_type: 'google',
      link_url: url,
      dialog_source: 'pro_download_dialog'
    });
  };
  return (
    <DownloadDialog isOpen={isOpen} onClose={onClose} backgroundColor="bg-cyan-50">
      <div className="text-center">
        <div className="text-6xl mb-6">✨</div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ready to grow your beauty brand?</h2>

        <p className="text-gray-700 mb-8">Set up your profile, showcase your work, sell products, and get booked—all from the Glamlink app.</p>

        <p className="text-lg font-semibold text-gray-900 mb-8">
          First 100 pros get a premium <span className="text-glamlink-teal-dark font-semibold">Founder Badge</span> and exclusive visibility perks
        </p>

        <div className="space-y-3">
          <Link 
            href="https://apps.apple.com/us/app/glamlink-pro/id6502331317" 
            target="_blank" 
            className="inline-block mr-4"
            onClick={handleAppStoreClick}
          >
            <Image src="/images/apple_app_icon.png" alt="Download on the App Store" width={150} height={45} className="hover:opacity-90 transition-opacity" />
          </Link>

          <Link 
            href="https://play.google.com/store/apps/details?id=com.glamlinkprobeauty&pli=1" 
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
