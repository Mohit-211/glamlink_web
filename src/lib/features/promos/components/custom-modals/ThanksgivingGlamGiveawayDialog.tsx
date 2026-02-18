"use client";

import Link from "next/link";
import DownloadDialog from "@/lib/components/modals/DownloadDialog";
import analytics from "@/lib/services/analytics";

interface ThanksgivingGlamGiveawayDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThanksgivingGlamGiveawayDialog({
  isOpen,
  onClose,
}: ThanksgivingGlamGiveawayDialogProps) {
  const handleUserAppStoreClick = () => {
    const url = "https://apps.apple.com/us/app/glamlink/id6502334118";
    analytics.trackAppDownloadClick({
      app_type: "user",
      store_type: "apple",
      link_url: url,
      dialog_source: "thanksgiving_giveaway_dialog",
    });
  };

  const handleProAppStoreClick = () => {
    const url = "https://apps.apple.com/us/app/glamlink-pro/id6502331317";
    analytics.trackAppDownloadClick({
      app_type: "pro",
      store_type: "apple",
      link_url: url,
      dialog_source: "thanksgiving_giveaway_dialog",
    });
  };

  return (
    <DownloadDialog isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      <div className="text-center max-h-[80vh] overflow-y-auto pb-6">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Thanksgiving Glam Giveaway
        </h2>

        <div className="text-left">
          <p className="text-sm text-gray-900 mb-6">
            In the spirit of Thanksgiving, Glamlink wants to thank all the beauty professionals who keep us glowing and confident all year long
          </p>
          <p className="text-sm text-gray-900 mb-6">
            We're giving back with a special Glam Giveaway! One lucky winner will recieve a <strong>free glam makeover</strong> with <Link href="https://www.instagram.com/showoff_makeup/" target="_blank" className="font-medium text-glamlink-teal hover:underline">@showoff_makeup</Link> 💄
          </p>
        </div>
        {/* How to Enter */}
        <div className="mb-8 text-left">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            How to Enter
          </h3>
          <ol className="list-decimal list-inside text-sm text-gray-900 space-y-3">
            <li>
              Follow <Link href="https://www.instagram.com/glamlink_app/" target="_blank" className="font-medium text-glamlink-teal hover:underline">@glamlink_app</Link>
            </li>
            <li>
              Follow <Link href="https://www.instagram.com/showoff_makeup/" target="_blank" className="font-medium text-glamlink-teal hover:underline">@showoff_makeup</Link>
            </li>
            <li>
              Like the giveaway post ❤️
            </li>
            <li>
              Tag your favorite beauty professional (limit 3 tags = 3 entries)
            </li>
          </ol>
        </div>

        {/* Bonus Entries */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left">
          <h4 className="text-md font-semibold text-gray-900 mb-3">
            Bonus Entries ✨
          </h4>
          <p className="text-sm text-gray-900 mb-4">
            Download <strong>Glamlink</strong> or <strong>Glamlink Pro</strong>{" "}
            for <strong>3 extra entries</strong>.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="https://apps.apple.com/us/app/glamlink/id6502334118"
              target="_blank"
              onClick={handleUserAppStoreClick}
              className="hidden lg-custom:block px-6 py-2.5 text-sm-custom font-medium text-white bg-glamlink-teal rounded-full hover:bg-glamlink-teal-dark transition-colors duration-200"
            >
              Download Glamlink (Users)
            </Link>

            <Link
              href="https://apps.apple.com/us/app/glamlink-pro/id6502331317"
              target="_blank"
              onClick={handleProAppStoreClick}
              className="hidden lg-custom:block px-6 py-2.5 text-sm-custom font-medium text-white bg-glamlink-teal rounded-full hover:bg-glamlink-teal-dark transition-colors duration-200"
            >
              Download Glamlink Pro (Pros)
            </Link>
          </div>
        </div>

        {/* Prize Details */}
        <div className="mb-8 text-left">
          <h4 className="text-md font-semibold text-gray-900 mb-3">
            Prize Details 🎁
          </h4>
          <ul className="space-y-2 text-sm text-gray-900">
            <li>
              • One (1) <strong>free glam makeover</strong> with{" "}
              <Link href="https://www.instagram.com/showoff_makeup/" target="_blank" className="font-medium text-glamlink-teal hover:underline">@showoff_makeup</Link>
            </li>
            <li>• Must be redeemed within 60 days of winner announcement</li>
            <li>• Location: Durango Hotel, Las Vegas</li>
            <li>• Transportation not included</li>
            <li>
              • Winner must be comfortable being photographed and/or filmed for
              social media content
            </li>
          </ul>
        </div>

        {/* Dates */}
        <div className="border-t pt-4 text-left">
          <h4 className="text-md font-semibold text-gray-900 mb-3">
            Dates & Info
          </h4>
          <p className="text-sm text-gray-900 mb-2">
            🕰️ <strong>Giveaway ends:</strong> Nov 25 at 11:59 PM PT
          </p>
          <p className="text-sm text-gray-900">
            🏆 <strong>Winner announced:</strong> Nov 26 on <Link href="https://www.instagram.com/glamlink_app/" target="_blank" className="font-medium text-glamlink-teal hover:underline">@glamlink_app</Link>
          </p>
        </div>
      </div>
    </DownloadDialog>
  );
}