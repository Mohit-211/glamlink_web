"use client";

import { useState, useEffect } from 'react';
import MagazineShareButtons from '@/lib/pages/magazine/components/MagazineShareButtons';

export default function MagazineListingShare() {
  const [shareEnabled, setShareEnabled] = useState(false);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    // Check if share is enabled in localStorage
    const isEnabled = localStorage.getItem('magazine-share-enabled') === 'true';
    setShareEnabled(isEnabled);

    // Set up global console command (if not already set up by MagazineCTA)
    if (typeof window !== 'undefined' && !(window as any).showShareOptions) {
      (window as any).showShareOptions = () => {
        localStorage.setItem('magazine-share-enabled', 'true');
        console.log('Magazine share options enabled! Refreshing page...');
        window.location.reload();
      };
      
      (window as any).hideShareOptions = () => {
        localStorage.removeItem('magazine-share-enabled');
        console.log('Magazine share options disabled! Refreshing page...');
        window.location.reload();
      };
      
      // Log instruction if not enabled
      if (!isEnabled) {
        console.log('To enable magazine share buttons, run: window.showShareOptions()');
      }
    }
  }, []);

  // Only render if share is enabled
  if (!shareEnabled) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {!showShare ? (
        <button
          onClick={() => setShowShare(true)}
          className="flex items-center gap-2 px-4 py-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-lg rounded-full hover:shadow-xl transition-all"
          aria-label="Share The Glamlink Edit"
        >
          <svg className="w-5 h-5 text-glamlink-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.001 9.001 0 0012 21c4.474 0 8.268-3.12 9.032-7.326" />
          </svg>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Share Magazine</span>
        </button>
      ) : (
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Share The Glamlink Edit
            </h3>
            <button
              onClick={() => setShowShare(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close share menu"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <MagazineShareButtons
            title="The Glamlink Edit"
            description="Your weekly source for beauty trends, expert insights, and industry innovations"
          />
        </div>
      )}
    </div>
  );
}