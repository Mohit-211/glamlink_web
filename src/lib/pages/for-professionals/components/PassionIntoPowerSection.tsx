"use client";

import { useState } from "react";
import Link from "next/link";
import ProDownloadDialog from "@/lib/components/modals/ProDownloadDialog";

export default function PassionIntoPowerSection() {
  const [showProDialog, setShowProDialog] = useState(false);

  return (
    <section className="pb-12 bg-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            Turn Your Passion Into Power
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-12">
            From viral content to e-commerce, Glamlink is where beauty meets technology. 
            With AI-driven discovery on the horizon, this is your chance to claim your space, 
            get discovered and thrive.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex flex-col items-center">
              <button
                onClick={() => setShowProDialog(true)}
                className="px-8 py-3 bg-glamlink-teal text-white font-semibold rounded-full hover:bg-glamlink-teal-dark transition-colors"
              >
                Become A Founding Pro
              </button>
              <span className="text-sm text-gray-600 mt-2">Limited to 100 pros</span>
            </div>
            
            <div className="flex flex-col items-center">
              <a
                href="https://crm.glamlink.net"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-white text-glamlink-teal font-semibold rounded-full border-2 border-glamlink-teal hover:bg-gray-50 transition-colors"
              >
                E-Commerce Panel
              </a>
              <span className="text-sm text-gray-600 mt-2">Existing Pro</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Download Dialog */}
      <ProDownloadDialog 
        isOpen={showProDialog} 
        onClose={() => setShowProDialog(false)} 
      />
    </section>
  );
}