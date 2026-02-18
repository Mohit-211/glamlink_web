"use client";

import { useState } from "react";
import Link from "next/link";
import ProDownloadDialog from "@/lib/components/modals/ProDownloadDialog";

export default function FinalCTASection() {
  const [showProDialog, setShowProDialog] = useState(false);

  return (
    <section className="py-12 bg-gradient-to-r from-glamlink-teal to-cyan-600">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Your Future in Beauty Starts Here
          </h2>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Join the first 100 founding professionals and shape the future of beauty commerce.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowProDialog(true)}
              className="px-8 py-4 bg-white text-glamlink-teal font-bold text-lg rounded-full hover:bg-gray-100 transition-colors shadow-lg"
            >
              Become a Founding Pro
            </button>
            <a
              href="https://crm.glamlink.net"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-transparent text-white font-bold text-lg rounded-full border-2 border-white hover:bg-white/10 transition-colors"
            >
              Access E-Commerce Panel
            </a>
          </div>
          
          <p className="mt-8 text-white/80">
            Limited spots available • No credit card required to start
          </p>
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