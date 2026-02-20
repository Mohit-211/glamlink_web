"use client";

import { useState, useEffect } from 'react';
import { Share2, BookOpen, X } from 'lucide-react';
import Image from 'next/image';
import MagazineShareButtons from '../MagazineShareButtons';

interface MagazineCTAProps {
  issueId?: string;
  issueTitle?: string;
  pageTitle?: string; // e.g., "Table of Contents", "Editor's Note", section name
  pageType?: string; // e.g., "section", "toc", "editors-note"
}

export default function MagazineCTA({ issueId, issueTitle, pageTitle, pageType }: MagazineCTAProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shareEnabled, setShareEnabled] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Generate appropriate share title based on page context
  let shareTitle = 'The Glamlink Edit';
  let shareDescription = '';

  if (pageTitle && pageType) {
    // For specific pages like Table of Contents or sections
    shareTitle = pageTitle;
    // Check if issue title already contains "The Glamlink Edit" to avoid redundancy
    if (issueTitle && issueTitle.includes('Glamlink Edit')) {
      shareDescription = `Read ${pageTitle} in ${issueTitle}`;
    } else if (issueTitle) {
      shareDescription = `Read ${pageTitle} in ${issueTitle} on The Glamlink Edit`;
    } else {
      shareDescription = `Read ${pageTitle} in The Glamlink Edit`;
    }
  } else if (issueTitle) {
    // For main issue page
    shareTitle = issueTitle;
    // Check if issue title already contains "The Glamlink Edit"
    if (issueTitle.includes('Glamlink Edit')) {
      shareDescription = `Check out ${issueTitle}`;
    } else {
      shareDescription = `Check out ${issueTitle} on The Glamlink Edit`;
    }
  } else {
    // Fallback
    shareDescription = 'Discover The Glamlink Edit magazine';
  }

  // Check localStorage on mount and set up console command
  useEffect(() => {
    // Check if share is enabled in localStorage
    const isEnabled = localStorage.getItem('magazine-share-enabled') === 'true';
    setShareEnabled(isEnabled);

    // Set up global console command
    if (typeof window !== 'undefined') {
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

  // Share handlers are now in MagazineShareButtons component

  // Only render if share is enabled
  if (!shareEnabled) {
    return null;
  }

  return (
    <>
      {/* Main CTA Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className={`
          bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg
          border border-gray-200 dark:border-gray-700
          shadow-2xl rounded-2xl
          transition-all duration-300 ease-in-out
          ${isExpanded ? 'w-72' : 'w-auto'}
        `}>
          {!isExpanded ? (
            <button
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-3 px-5 py-3 text-gray-900 dark:text-gray-100 hover:text-glamlink-teal dark:hover:text-glamlink-teal transition-colors"
              aria-label="Share and view full issue"
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-sm font-medium whitespace-nowrap">View Full Issue</span>
              <Share2 className="w-5 h-5" />
            </button>
          ) : (
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Share This Issue
                </span>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label="Close share menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Share Buttons and View Full Issue - all inline */}
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <MagazineShareButtons
                  url={currentUrl}
                  title={shareTitle}
                  description={shareDescription}
                />

                {/* View Full Issue Link - inline with share buttons */}
                {issueId && (
                  <a
                    href={`/magazine/${issueId}`}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-glamlink-teal text-white rounded-full hover:bg-glamlink-teal-dark transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span className="text-xs font-medium">View Full Issue</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile-optimized watermark text */}
      <div className="fixed bottom-20 right-6 z-40 pointer-events-none sm:hidden">
        <p className="text-xs text-gray-400 dark:text-gray-600 opacity-70">
          The Glamlink Edit
        </p>
      </div>
    </>
  );
}
