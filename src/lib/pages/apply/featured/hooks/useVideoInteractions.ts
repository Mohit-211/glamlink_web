"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import HoverGif, { HoverGifRef } from "@/lib/components/HoverGif";

interface UseVideoInteractionsOptions {
  videoSrc?: string;
  sectionId?: string;
  enableMobileScroll?: boolean;
  /** Enable scroll-based autoplay on all devices (desktop + mobile) */
  enableScrollPlay?: boolean;
  /** Delay in milliseconds before playing video after section becomes visible. Only applies if explicitly set. */
  playDelay?: number;
  isMultiSection?: boolean;
}

interface UseVideoInteractionsReturn {
  videoRef: React.RefObject<HoverGifRef | null>;
  sectionRef?: React.RefObject<HTMLDivElement>;
  videoRefs?: React.MutableRefObject<{ [key: string]: HoverGifRef | null }>;
  sectionRefs?: React.MutableRefObject<{ [key: string]: HTMLElement | null }>;
  handleMouseEnter: (sectionId?: string) => void;
  handleMouseLeave: (sectionId?: string) => void;
  isMobile: boolean;
}

/**
 * Custom hook for managing video interactions (play/pause on hover + scroll-based playback)
 * Provides reusable logic for video components that need comprehensive playback control
 *
 * Features:
 * - Desktop: Hover-based play/pause (when enableScrollPlay is false)
 * - Scroll-based autoplay: When enableScrollPlay=true, plays when section scrolls into view (all devices)
 * - Mobile scroll: When enableMobileScroll=true, scroll-based playback on mobile only
 * - Optional play delay: When playDelay is set, waits before playing after section becomes visible
 * - Multi-section support for components with multiple videos
 */
export function useVideoInteractions({
  videoSrc,
  sectionId,
  enableMobileScroll = false,
  enableScrollPlay = false,
  playDelay,
  isMultiSection = false
}: UseVideoInteractionsOptions = {}): UseVideoInteractionsReturn {
  const videoRef = useRef<HoverGifRef | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [visibleSection, setVisibleSection] = useState<string | null>(null);

  // Multi-section refs for components like PreviewBlockContent
  const videoRefs = useRef<{ [key: string]: HoverGifRef | null }>({});
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768; // md: breakpoint
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track play delay timeouts for cleanup
  const playDelayTimeouts = useRef<{ [key: string]: NodeJS.Timeout }>({});

  // Intersection Observer for scroll-based video playback
  // Works on all devices when enableScrollPlay=true, or mobile-only when enableMobileScroll=true
  useEffect(() => {
    const shouldUseScrollPlay = enableScrollPlay || (enableMobileScroll && isMobile);
    if (!shouldUseScrollPlay) return;

    const playVideo = (currentSectionId: string) => {
      const doPlay = () => {
        if (isMultiSection) {
          if (videoRefs.current[currentSectionId]) {
            videoRefs.current[currentSectionId]?.play();
          }
        } else {
          if (videoRef.current) {
            videoRef.current.play();
          }
        }
      };

      // Apply delay only if playDelay is explicitly set
      if (playDelay !== undefined && playDelay > 0) {
        // Clear any existing timeout for this section
        if (playDelayTimeouts.current[currentSectionId]) {
          clearTimeout(playDelayTimeouts.current[currentSectionId]);
        }
        playDelayTimeouts.current[currentSectionId] = setTimeout(doPlay, playDelay);
      } else {
        doPlay();
      }
    };

    const pauseVideo = (currentSectionId: string) => {
      // Clear any pending play timeout
      if (playDelayTimeouts.current[currentSectionId]) {
        clearTimeout(playDelayTimeouts.current[currentSectionId]);
        delete playDelayTimeouts.current[currentSectionId];
      }

      if (isMultiSection) {
        if (videoRefs.current[currentSectionId]) {
          videoRefs.current[currentSectionId]?.pause();
        }
      } else {
        if (videoRef.current) {
          videoRef.current.pause();
        }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const currentSectionId = entry.target.getAttribute('data-section-id');
          if (!currentSectionId) return;

          if (entry.isIntersecting) {
            // Section is visible - play its video
            setVisibleSection(currentSectionId);
            playVideo(currentSectionId);
          } else if (visibleSection === currentSectionId) {
            // Section is no longer visible and was the previously visible one - pause it
            pauseVideo(currentSectionId);
          }
        });
      },
      {
        threshold: 0.5, // Play when 50% of the section is visible
        rootMargin: '-10% 0px -10% 0px' // Slightly reduce the viewport area
      }
    );

    // Set up observer with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      // Observe sections based on component type
      if (isMultiSection) {
        // Multi-section: observe all section refs
        Object.values(sectionRefs.current).forEach((ref) => {
          if (ref) {
            observer.observe(ref);
          }
        });
      } else {
        // Single section: observe the main section ref
        if (sectionRef.current) {
          observer.observe(sectionRef.current);
        }
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      // Clear all pending play timeouts
      Object.values(playDelayTimeouts.current).forEach(clearTimeout);
      playDelayTimeouts.current = {};
    };
  }, [enableMobileScroll, enableScrollPlay, isMobile, visibleSection, isMultiSection, playDelay]);

  const handleMouseEnter = useCallback((currentSectionId?: string) => {
    // Only use hover behavior on desktop when scroll play is disabled
    if (isMobile || enableScrollPlay) return;

    if (isMultiSection && currentSectionId) {
      // Multi-section: play specific section video
      if (videoRefs.current[currentSectionId]) {
        videoRefs.current[currentSectionId]?.play();
      }
    } else {
      // Single section: play the main video
      if (videoRef.current) {
        videoRef.current.play();
      }
    }
  }, [isMobile, isMultiSection, enableScrollPlay]);

  const handleMouseLeave = useCallback((currentSectionId?: string) => {
    // Only use hover behavior on desktop when scroll play is disabled
    if (isMobile || enableScrollPlay) return;

    if (isMultiSection) {
      // Multi-section: pause all videos
      Object.values(videoRefs.current).forEach(ref => {
        ref?.pause();
      });
    } else {
      // Single section: pause the main video
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [isMobile, isMultiSection, enableScrollPlay]);

  return {
    videoRef,
    sectionRef: sectionRef as React.RefObject<HTMLDivElement>,
    videoRefs: isMultiSection ? videoRefs : undefined,
    sectionRefs: isMultiSection ? sectionRefs : undefined,
    handleMouseEnter,
    handleMouseLeave,
    isMobile,
  };
}