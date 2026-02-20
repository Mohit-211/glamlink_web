'use client';

import { useEffect } from 'react';
import { initializeAnalytics } from '@/lib/config/firebase';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export default function GoogleAnalytics() {
  useEffect(() => {
    // Initialize Firebase Analytics
    initializeAnalytics().catch(console.error);

    // Initialize Google Analytics gtag
    const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
    
    if (measurementId && typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer?.push(arguments);
      };
      
      window.gtag('js', new Date());
      window.gtag('config', measurementId, {
        page_path: window.location.pathname,
      });

      // Track route changes in Next.js
      const handleRouteChange = (url: string) => {
        if (window.gtag) {
          window.gtag('config', measurementId, {
            page_path: url,
          });
        }
      };

      // Listen to route changes
      const handlePopState = () => {
        handleRouteChange(window.location.pathname);
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, []);

  return null;
}