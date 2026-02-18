"use client";

import { useState } from "react";
import UserDownloadDialog from "@/lib/components/modals/UserDownloadDialog";
import ProDownloadDialog from "@/lib/components/modals/ProDownloadDialog";
import { HomePageContent } from "@/lib/config/pageContent";

interface FinalCTAProps {
  content: HomePageContent["finalCTA"];
}

export default function FinalCTA({ content }: FinalCTAProps) {
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showProDialog, setShowProDialog] = useState(false);

  const handleUserClick = () => {
    if (content.userSection.button.action === "download-user") {
      setShowUserDialog(true);
    }
  };

  const handleProClick = () => {
    if (content.proSection.button.action === "download-pro") {
      setShowProDialog(true);
    }
  };

  return (
    <>
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-semibold text-gray-900 mb-8">{content.title}</h2>

            <p className="text-lg text-gray-700 mb-12">{content.subtitle}</p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{content.userSection.title}</h3>
                <p className="text-gray-700">{content.userSection.description}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{content.proSection.title}</h3>
                <p className="text-gray-700">{content.proSection.description}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">You Ask. Glamlink Answers.</h3>
              <p className="text-lg text-gray-700">AI-Powered Results, Trusted Professionals, and Personalized Solutions - Coming Soon!</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={handleUserClick} className={`inline-flex items-center justify-center px-8 py-3 font-medium rounded-full transition ${content.userSection.button.style === "primary" ? "bg-glamlink-teal text-white hover:bg-teal-700" : "bg-gray-900 text-white hover:bg-gray-800"}`}>
                {content.userSection.button.text}
              </button>
              <button onClick={handleProClick} className={`inline-flex items-center justify-center px-8 py-3 font-medium rounded-full transition ${content.proSection.button.style === "primary" ? "bg-glamlink-teal text-white hover:bg-teal-700" : "bg-gray-900 text-white hover:bg-gray-800"}`}>
                {content.proSection.button.text}
              </button>
            </div>
          </div>
        </div>
      </section>

      <UserDownloadDialog isOpen={showUserDialog} onClose={() => setShowUserDialog(false)} />

      <ProDownloadDialog isOpen={showProDialog} onClose={() => setShowProDialog(false)} />
    </>
  );
}
