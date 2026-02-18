"use client";

import { useState, useEffect, useMemo } from "react";
import { VideoDisplay, ImageDisplay, GalleryThumbnail, ThumbnailWithPlayButton } from "../../items/media";
import { GalleryItem, Professional } from "@/lib/pages/for-professionals/types/professional";
import type { CondensedCardSectionInstance } from "@/lib/features/digital-cards/types/condensedCardConfig";
import { useAppSelector } from '../../../../../../../store/hooks';
import { selectPropsByInnerSectionType } from '@/lib/features/digital-cards/store';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

interface SignatureWorkProps {
  professional: Partial<Professional>;
  gallery?: GalleryItem[];
  // Legacy support: single video prop (will be merged into gallery display)
  video?: GalleryItem | null;
  section?: CondensedCardSectionInstance;
}

export default function SignatureWork({ professional, gallery, video, section }: SignatureWorkProps) {
  // READ FROM REDUX - direct selector for live updates
  const reduxProps = useAppSelector(selectPropsByInnerSectionType('signature-work'));

  // Merge props with Redux taking highest precedence
  const mergedProps = { ...section?.props, ...reduxProps };

  // Extract props from section or use defaults
  const hideTitle = mergedProps?.hideTitle ?? false;
  const hideCaption = mergedProps?.hideCaption ?? false;
  // showPlayButton: if undefined, will auto-detect based on item type (video = true, image = false)
  const showPlayButtonProp = mergedProps?.showPlayButton;
  const capturedVideoFrame = mergedProps?.capturedVideoFrame ?? 1;
  const displayedGalleryIndex = mergedProps?.displayedGalleryIndex ?? 0;
  const clickUrl = mergedProps?.clickUrl ?? '';

  // Image display settings - ALWAYS use saved values (toggle only controls editor visibility)
  // If no values saved, defaults to 'none' (auto)
  const displaySize = mergedProps?.imageDisplaySize ?? 'none';
  const displayWidth = mergedProps?.imageDisplayWidth ?? 100;
  const displayHeight = mergedProps?.imageDisplayHeight ?? 100;

  // Reference height for percentage calculation (300px base for condensed card)
  const BASE_HEIGHT = 300;

  // Build display styles based on displaySize setting
  const getDisplayStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {};

    if (displaySize === 'width' || displaySize === 'both') {
      styles.width = `${displayWidth}%`;
    }
    if (displaySize === 'height' || displaySize === 'both') {
      // Convert percentage to pixels for reliable height control
      styles.height = `${Math.round((displayHeight / 100) * BASE_HEIGHT)}px`;
    }

    return styles;
  };

  const displayStyles = getDisplayStyles();
  const hasDisplayStyles = displaySize !== 'none';

  // Helper to format URL
  const getFormattedUrl = (url: string): string | null => {
    if (!url || url.trim() === '') return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  const formattedClickUrl = getFormattedUrl(clickUrl);
  // Combine gallery items: use gallery prop, or fall back to single video prop
  const galleryItems = useMemo(() => {
    if (gallery && gallery.length > 0) {
      return gallery;
    }
    // Legacy: if only video prop is provided, wrap it in an array
    if (video) {
      return [video];
    }
    return [];
  }, [gallery, video]);

  // State for currently selected item
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [previousGalleryLength, setPreviousGalleryLength] = useState(0);

  // Initialize selected item when gallery changes
  useEffect(() => {
    if (galleryItems.length > 0 && !selectedItem) {
      // No item selected, select based on displayedGalleryIndex (clamped to valid range)
      const validIndex = Math.min(displayedGalleryIndex, galleryItems.length - 1);
      setSelectedItem(galleryItems[validIndex]);
      setPreviousGalleryLength(galleryItems.length);
    } else if (galleryItems.length > previousGalleryLength && galleryItems.length > 0) {
      // NEW ITEM ADDED - automatically select the newest item (last in array)
      const newestItem = galleryItems[galleryItems.length - 1];
      setSelectedItem(newestItem);
      setPreviousGalleryLength(galleryItems.length);
    } else if (galleryItems.length > 0 && selectedItem) {
      // Gallery updated but no new items - update selectedItem to pick up caption/data changes
      const updatedItem = galleryItems.find(item => item.id === selectedItem.id);
      if (updatedItem) {
        // Update to the latest version of the item (with new caption, etc.)
        setSelectedItem(updatedItem);
      } else {
        // Item no longer exists, select first item
        setSelectedItem(galleryItems[0]);
      }
      setPreviousGalleryLength(galleryItems.length);
    } else if (galleryItems.length === 0) {
      // No items, clear selection
      setSelectedItem(null);
      setPreviousGalleryLength(0);
    }
  }, [galleryItems, displayedGalleryIndex]);

  // Handle thumbnail click
  const handleThumbnailClick = (item: GalleryItem) => {
    setSelectedItem(item);
  };

  // Empty state: no gallery items - show nothing
  if (galleryItems.length === 0) {
    return null;
  }

  // If displayedGalleryIndex is specified and out of range, show nothing
  if (displayedGalleryIndex >= galleryItems.length) {
    return null;
  }

  // If displayedGalleryIndex is specified (section prop set), show only that specific item
  // This is the "single item display" mode for ContentContainer inner sections
  if (section?.props?.displayedGalleryIndex !== undefined) {
    const item = galleryItems[displayedGalleryIndex];

    // Auto-detect showPlayButton based on item type if not explicitly set
    // If showPlayButtonProp is undefined, show play button only for videos
    const showPlayButton = showPlayButtonProp !== undefined
      ? showPlayButtonProp
      : item?.type === 'video';

    // Wrapper component for clickable content
    const ClickableWrapper = ({ children }: { children: React.ReactNode }) => {
      if (formattedClickUrl) {
        return (
          <a
            href={formattedClickUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block cursor-pointer hover:opacity-90 transition-opacity"
          >
            {children}
          </a>
        );
      }
      return <>{children}</>;
    };

    // If showPlayButton is enabled (or auto-detected for videos), show thumbnail with play button overlay
    if (showPlayButton) {
      return (
        <div className="signature-work">
          {!hideTitle && (
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Signature Work</h3>
          )}
          <div style={hasDisplayStyles ? displayStyles : undefined} className={hasDisplayStyles ? 'mx-auto' : ''}>
            <ClickableWrapper>
              <ThumbnailWithPlayButton
                item={item}
                hideCaption={hideCaption}
                capturedVideoFrame={capturedVideoFrame}
                displayFullWidth={displaySize === 'width' || displaySize === 'both'}
                onPlay={() => {
                  // If clickUrl is set, navigate there; otherwise open video
                  if (formattedClickUrl) {
                    window.open(formattedClickUrl, '_blank');
                  } else if (item.url) {
                    window.open(item.url, '_blank');
                  }
                }}
              />
            </ClickableWrapper>
          </div>
        </div>
      );
    }

    // Regular display without play button
    return (
      <div className="signature-work">
        {!hideTitle && (
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Signature Work</h3>
        )}
        <div style={hasDisplayStyles ? displayStyles : undefined} className={hasDisplayStyles ? 'mx-auto' : ''}>
          <ClickableWrapper>
            {/* When hideCaption is true, render without the built-in caption */}
            {hideCaption ? (
              <div className="w-full flex justify-center">
                <div
                  className="relative bg-gray-100 rounded-lg overflow-hidden"
                  style={hasDisplayStyles ? { ...displayStyles, maxHeight: 'none' } : { maxHeight: '500px' }}
                >
                  {item.type === 'video' ? (
                    <video
                      src={item.url}
                      controls={!formattedClickUrl}
                      className={hasDisplayStyles ? "w-full h-full object-cover" : "max-h-[800px] w-auto h-auto object-contain"}
                      poster={item.thumbnail}
                    />
                  ) : (
                    <img
                      src={item.url || (item as any).src}
                      alt={item.title || "Gallery item"}
                      className={hasDisplayStyles ? "w-full h-full object-cover" : "max-h-[800px] w-auto h-auto object-contain"}
                    />
                  )}
                </div>
              </div>
            ) : (
              // With caption - use standard components
              item.type === 'video' ? (
                <VideoDisplay
                  video={item}
                  autoplay={false}
                  controls={!formattedClickUrl}
                  muted={false}
                  loop={false}
                  startTime={capturedVideoFrame}
                />
              ) : (
                <ImageDisplay image={item} />
              )
            )}
          </ClickableWrapper>
        </div>
      </div>
    );
  }

  // Single item in gallery: render without thumbnails
  if (galleryItems.length === 1) {
    const item = galleryItems[0];
    return (
      <div className="signature-work">
        {!hideTitle && (
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Signature Work</h3>
        )}
        {item.type === 'video' ? (
          <VideoDisplay
            video={item}
            autoplay={false}
            controls={true}
            muted={false}
            loop={false}
            startTime={capturedVideoFrame}
          />
        ) : (
          <ImageDisplay image={item} />
        )}
      </div>
    );
  }

  // Multiple items: render with thumbnails
  // IMPORTANT: Keep all items mounted to preserve video playback state
  // Use visibility:hidden + position:absolute instead of display:none
  // display:none causes browsers to unload video elements and reset playback
  return (
    <div className="signature-work">
      {!hideTitle && (
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Signature Work</h3>
      )}
      <div className="signature-work-gallery">
        {/* Main Display Area - All items stacked, only selected one visible */}
        {/* Selected item uses position:relative to set container height, others are absolute */}
        <div className="main-display mb-4 relative">
          {galleryItems.map((item) => {
            const isSelected = selectedItem?.id === item.id;
            return (
              <div
                key={item.id}
                style={{
                  // Use visibility instead of display to keep video elements loaded
                  visibility: isSelected ? 'visible' : 'hidden',
                  // Selected item sets container height with relative positioning
                  // Hidden items are absolute and fill container for vertical centering
                  position: isSelected ? 'relative' : 'absolute',
                  top: isSelected ? undefined : 0,
                  left: isSelected ? undefined : 0,
                  right: isSelected ? undefined : 0,
                  bottom: isSelected ? undefined : 0,
                  width: isSelected ? undefined : '100%',
                  // Selected item on top
                  zIndex: isSelected ? 10 : 1,
                  // Prevent interaction with hidden items
                  pointerEvents: isSelected ? 'auto' : 'none',
                }}
                className={!isSelected ? 'flex items-center justify-center' : ''}
              >
                {item.type === 'video' ? (
                  <VideoDisplay
                    video={item}
                    autoplay={false}
                    controls={true}
                    muted={false}
                    loop={false}
                    startTime={capturedVideoFrame}
                  />
                ) : (
                  <ImageDisplay image={item} />
                )}
              </div>
            );
          })}
          {/* Fallback if no item selected */}
          {!selectedItem && (
            <div className="flex justify-center">
              <div className="md:w-1/2 w-3/4 bg-gray-100 rounded-lg p-8 text-center">
                <p className="text-gray-500">Select an item to view</p>
              </div>
            </div>
          )}
        </div>

        {/* Thumbnail Strip - wraps to multiple rows on mobile */}
        <div className="thumbnail-strip flex flex-wrap gap-2 justify-center mt-4">
          {galleryItems.map((item) => (
            <GalleryThumbnail
              key={item.id}
              item={item}
              isActive={selectedItem?.id === item.id}
              onClick={() => handleThumbnailClick(item)}
              size={64}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
