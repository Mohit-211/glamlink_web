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
    <DownloadDialog isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      <div className="text-center max-h-[80vh] overflow-y-auto">
        <div className="text-6xl mb-6">✨</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter the Giveaway: Small-Area Laser Hair Removal</h2>
        <p className="text-sm text-gray-600 mb-6">
          <strong>Partner:</strong> Parie Medical Spa (Summerlin) ✦ Our latest cover in The Glamlink Edit
        </p>

        {/* For Users Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">I'm a Client (Users)</h3>
          <div className="text-left text-sm text-gray-600 mb-4">
            <ol className="list-decimal list-inside space-y-2">
              <li><strong>Download Glamlink</strong> (button below)</li>
              <li><strong>Use referral code:</strong> <span className="text-glamlink-teal-dark font-medium">glampariemedspa</span></li>
              <li><strong>Follow "Parie Med Spa"</strong> on Glamlink <strong>and</strong> comment "<strong>Parie</strong>" on Parie's Giveaway Ad on IG</li>
            </ol>
          </div>
          <Link href="https://apps.apple.com/us/app/glamlink/id6502334118" target="_blank" className="hidden lg-custom:block px-6 py-2.5 text-sm-custom font-medium text-white bg-glamlink-teal rounded-full hover:bg-glamlink-teal-dark transition-colors duration-200 w-auto" onClick={handleUserAppStoreClick}>
            Download Glamlink (clients)
          </Link>
        </div>

        {/* For Professionals Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">I'm a Pro (Glamlink Pro)</h3>
          <div className="text-left text-sm text-gray-600 mb-4">
            <ol className="list-decimal list-inside space-y-2">
              <li><strong>Download Glamlink Pro</strong> (button below)</li>
              <li><strong>Use referral code:</strong> <span className="text-glamlink-teal-dark font-medium">glampariemedspa</span></li>
              <li><strong>Create your profile:</strong> headshot, specialty, add business address, and hours, <strong>add a few photos or clips</strong> (and your booking link if you have one)</li>
              <li><strong>Follow "Parie Med Spa"</strong> on Glamlink <strong>and</strong> comment "<strong>Parie</strong>" on Parie's Giveaway Ad on IG</li>
            </ol>
          </div>
          <Link href="https://apps.apple.com/us/app/glamlink-pro/id6502331317" target="_blank" className="hidden lg-custom:block px-6 py-2.5 text-sm-custom font-medium text-white bg-glamlink-teal rounded-full hover:bg-glamlink-teal-dark transition-colors duration-200 w-auto" onClick={handleProAppStoreClick}>
            Download Glamlink Pro (pros)
          </Link>
        </div>

        {/* Benefits Section */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="text-md font-semibold text-gray-900 mb-3">With Glamlink you can:</h4>
          <div className="text-left space-y-2 text-sm text-gray-700">
            <div className="flex items-start">
              <span className="text-glamlink-teal mr-2">•</span>
              <span><strong>Get discovered locally</strong></span>
            </div>
            <div className="flex items-start">
              <span className="text-glamlink-teal mr-2">•</span>
              <span><strong>Discover, book, shop, leave reviews</strong> in one profile</span>
            </div>
            <div className="flex items-start">
              <span className="text-glamlink-teal mr-2">•</span>
              <span>Add your <strong>booking link (free)</strong> → one-tap "Request Booking"</span>
            </div>
          </div>
        </div>

        {/* Giveaway Image */}
        <div className="flex justify-center mb-6">
          <img
            src="/images/referral_code.png"
            alt="Glamlink Giveaway - Referral Code: glampariemedspa"
            className="w-full max-w-md h-auto rounded-lg shadow-md"
          />
        </div>

        {/* Dates & Eligibility */}
        <div className="border-t pt-4">
          <h4 className="text-md font-semibold text-gray-900 mb-3">Dates & Eligibility</h4>
          <div className="text-left space-y-2 text-sm text-gray-700">
            <div className="flex items-start">
              <span className="text-glamlink-teal mr-2">•</span>
              <span><span className="font-medium">Winner announced:</span> Fri, October 17</span>
            </div>
            <div className="flex items-start">
              <span className="text-glamlink-teal mr-2">•</span>
              <span><span className="font-medium">Prize:</span> Small-Area Laser Hair Removal (sponsored by Parie Medical Spa)</span>
            </div>
            <div className="flex items-start">
              <span className="text-glamlink-teal mr-2">•</span>
              <span><span className="font-medium">Eligibility:</span> 18+. Must be a candidate for laser. No purchase necessary.</span>
            </div>
          </div>
        </div>
      </div>
    </DownloadDialog>
  );
}