import React, { useState, useEffect } from 'react';
import type { Professional, GalleryItem } from '@/lib/pages/for-professionals/types/professional';
import StyledSectionWrapper from '../components/StyledSectionWrapper';
import EmptySectionState from '../components/EmptySectionState';
import {
  VideoDisplay,
  isVideoItem,
  GalleryThumbnail,
  ThumbnailWithPlayButton
} from '@/lib/features/digital-cards/components/items/media';
import { useAppSelector } from '../../../../../../store/hooks';
import {
  selectPropsByInnerSectionType,
  selectSections
} from '@/lib/features/digital-cards/store';

interface SignatureWorkSettings {
  capturedVideoFrame?: number;
  showPlayButton?: boolean;
  displayFullWidth?: boolean;

  pageDisplayEnabled?: boolean;
  pageDisplaySize?: 'none' | 'width' | 'height' | 'both';
  pageDisplayWidth?: number;
  pageDisplayHeight?: number;

  imageDisplayEnabled?: boolean;
  imageDisplaySize?: 'none' | 'width' | 'height' | 'both';
  imageDisplayWidth?: number;
  imageDisplayHeight?: number;

  hideCaption?: boolean;
}

interface SignatureWorkSectionProps {
  professional: Partial<Professional>;
  sectionId: string;
  settings?: SignatureWorkSettings;
  sectionProps?: Record<string, any>;
}

interface InteractiveGalleryProps {
  gallery: GalleryItem[];
  onTitleChange: (title: string) => void;
  settings?: SignatureWorkSettings;
}

function InteractiveGallery({
  gallery,
  onTitleChange,
  settings
}: InteractiveGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [playingVideos, setPlayingVideos] = useState<Set<number>>(new Set());

  const hasMultipleItems = gallery.length > 1;

  const capturedVideoFrame = settings?.capturedVideoFrame ?? 4;
  const hideCaption = settings?.hideCaption ?? true;

  const displaySize = settings?.pageDisplaySize ?? 'none';
  const displayWidth = settings?.pageDisplayWidth ?? 100;
  const displayHeight = settings?.pageDisplayHeight ?? 100;

  const BASE_HEIGHT = 400;

  const getDisplayStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {};

    if (displaySize === 'width' || displaySize === 'both') {
      styles.width = `${displayWidth}%`;
    }

    if (displaySize === 'height' || displaySize === 'both') {
      styles.height = `${Math.round((displayHeight / 100) * BASE_HEIGHT)}px`;
    }

    return styles;
  };

  const displayStyles = getDisplayStyles();
  const hasDisplayStyles = displaySize !== 'none';
  const displayFullWidth =
    displaySize === 'width' || displaySize === 'both';

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
    const item = gallery[index];
    const newTitle =
      item.title || item.caption || 'Signature Work';
    onTitleChange(newTitle);
  };

  const handlePlayClick = (index: number) => {
    setPlayingVideos(prev => new Set(prev).add(index));
  };

  return (
    <div className="interactive-gallery">
      <div className="main-display mb-3 relative">
        <div
          style={hasDisplayStyles ? displayStyles : undefined}
          className={hasDisplayStyles ? 'mx-auto' : ''}
        >
          {gallery.map((item, index) => {
            const isSelected = index === selectedIndex;
            const isVideo = isVideoItem(item);
            const hasStartedPlaying = playingVideos.has(index);
            const imageUrl = item?.url || (item as any)?.src;

            return (
              <div
                key={item.id || index}
                style={{
                  visibility: isSelected ? 'visible' : 'hidden',
                  position: isSelected ? 'relative' : 'absolute',
                  top: isSelected ? undefined : 0,
                  left: isSelected ? undefined : 0,
                  right: isSelected ? undefined : 0,
                  bottom: isSelected ? undefined : 0,
                  width: '100%',
                  zIndex: isSelected ? 10 : 1,
                  pointerEvents: isSelected ? 'auto' : 'none'
                }}
                className={
                  !isSelected
                    ? 'flex items-center justify-center'
                    : ''
                }
              >
                {isVideo ? (
                  hasStartedPlaying ? (
                    <VideoDisplay
                      video={item}
                      autoplay
                      controls
                      muted={false}
                      loop={false}
                      hideCaption={hideCaption}
                      isActive={isSelected}
                    />
                  ) : (
                    <ThumbnailWithPlayButton
                      item={item}
                      hideCaption={hideCaption}
                      capturedVideoFrame={capturedVideoFrame}
                      displayFullWidth={displayFullWidth}
                      onPlay={() =>
                        handlePlayClick(index)
                      }
                    />
                  )
                ) : (
                  <div className="w-full flex justify-center">
                    <div
                      className={`relative bg-gray-100 rounded-lg overflow-hidden ${
                        displayFullWidth &&
                        !hasDisplayStyles
                          ? 'w-full'
                          : ''
                      }`}
                      style={
                        hasDisplayStyles
                          ? {
                              ...displayStyles,
                              maxHeight: 'none'
                            }
                          : { maxHeight: '800px' }
                      }
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={
                            item?.title ||
                            item?.caption ||
                            'Gallery image'
                          }
                          className={
                            hasDisplayStyles
                              ? 'w-full h-full object-cover'
                              : 'max-h-[800px] w-auto h-auto object-contain'
                          }
                        />
                      ) : (
                        <div className="flex items-center justify-center p-8 bg-gray-100">
                          <p className="text-gray-500">
                            No image available
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {hasMultipleItems && (
        <div className="thumbnail-strip flex gap-2 overflow-x-auto pb-2 justify-center">
          {gallery.map((item, index) => (
            <GalleryThumbnail
              key={item.id || index}
              item={item}
              size={60}
              isActive={index === selectedIndex}
              onClick={() =>
                handleThumbnailClick(index)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SignatureWorkSection({
  professional,
  sectionId,
  settings,
  sectionProps = {}
}: SignatureWorkSectionProps) {
  const reduxProps = useAppSelector(
    selectPropsByInnerSectionType('signature-work')
  );
  const sections = useAppSelector(selectSections);

  const signatureSection = sections.find(
    (s) =>
      s.props?.innerSectionType ===
        'signature-work' ||
      s.props?.innerSectionType ===
        'signature-work-actions'
  );

  const wrapperProps = signatureSection?.props || {};

  const [dynamicTitle, setDynamicTitle] =
    useState('Signature Work');

  const hasGalleryData =
    !!(
      professional.gallery &&
      professional.gallery.length > 0
    );

  const mergedSettings: SignatureWorkSettings = {
    ...settings,
    ...sectionProps,
    ...reduxProps
  };

  const showCustomTitle =
    wrapperProps.showCustomTitle ?? false;

  const customTitle = wrapperProps.title || '';

  const titleAlignment =
    wrapperProps.titleAlignment ??
    'center-with-lines';

  const titleFontFamily =
    wrapperProps.titleFontFamily;
  const titleFontSize =
    wrapperProps.titleFontSize;
  const titleFontWeight =
    wrapperProps.titleFontWeight;
  const titleColor = wrapperProps.titleColor;
  const titleTextTransform =
    wrapperProps.titleTextTransform;
  const titleLetterSpacing =
    wrapperProps.titleLetterSpacing;

  useEffect(() => {
    if (
      hasGalleryData &&
      professional.gallery &&
      professional.gallery.length > 0
    ) {
      const firstItem =
        professional.gallery[0];
      const initialTitle =
        firstItem.title ||
        firstItem.caption ||
        'Signature Work';
      setDynamicTitle(initialTitle);
    }
  }, [hasGalleryData, professional.gallery]);

  const displayTitle = showCustomTitle
    ? customTitle
    : dynamicTitle;

  return (
    <StyledSectionWrapper
      key={sectionId}
      title={displayTitle}
      titleAlignment={titleAlignment}
      titleFontFamily={titleFontFamily}
      titleFontSize={titleFontSize}
      titleFontWeight={titleFontWeight}
      titleColor={titleColor}
      titleTextTransform={titleTextTransform}
      titleLetterSpacing={titleLetterSpacing}
    >
      {hasGalleryData &&
      professional.gallery ? (
        <InteractiveGallery
          gallery={professional.gallery}
          onTitleChange={setDynamicTitle}
          settings={mergedSettings}
        />
      ) : (
        <EmptySectionState
          message="Add photos or videos to showcase your work"
          icon="video"
        />
      )}
    </StyledSectionWrapper>
  );
}