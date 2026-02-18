"use client";

import { GalleryItem } from "@/lib/pages/for-professionals/types/professional";
import { useVideo } from "./useVideo";
import OnlineVideo from "./OnlineVideo";
import DirectURLVideo from "./DirectURLVideo";

interface VideoDisplayProps {
  video: GalleryItem;
  className?: string;
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  startTime?: number; // Initial time to seek to when video loads (in seconds)
  hideCaption?: boolean; // Hide the caption/title when it's shown elsewhere (e.g., in section header)
  isActive?: boolean; // Whether this video is currently selected/visible - controls pause/play
}

// Helper component for video metadata (shows caption as semibold title)
function VideoMetadata({ video }: { video: GalleryItem }) {
  // Use caption if available, fallback to title, or don't show if neither exists
  const displayText = video.caption || video.title;

  if (!displayText) return null;

  return (
    <div className="mb-3 text-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{displayText}</h3>
    </div>
  );
}

// Helper component for video tags
function VideoTags({ tags }: { tags: string[] }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2 justify-center">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="inline-block px-2 py-1 bg-glamlink-teal bg-opacity-10 text-glamlink-teal-dark text-xs rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export default function VideoDisplay({
  video,
  className = "",
  autoplay = false,
  controls = true,
  muted = true,
  loop = false,
  startTime,
  hideCaption = false,
  isActive = true,
}: VideoDisplayProps) {
  // Custom hook for all video logic
  const {
    isPlaying,
    isMuted,
    isLoading,
    error,
    isFullscreen,
    videoType,
    videoUrl,
    getYouTubeEmbedUrl,
    getVimeoEmbedUrl,
    handlePlayPause,
    handleMuteToggle,
    handleFullscreen,
    handleError,
    setIsLoading,
    setIsPlaying,
  } = useVideo(video, autoplay, muted, controls, loop);

  // Render YouTube or Vimeo video
  if (videoType === 'youtube' || videoType === 'vimeo') {
    const embedUrl = videoType === 'youtube'
      ? getYouTubeEmbedUrl(videoUrl)
      : getVimeoEmbedUrl(videoUrl);

    return (
      <div className={`video-display ${className}`}>
        {/* Video Title and Metadata - hidden when title is shown in section header */}
        {!hideCaption && <VideoMetadata video={video} />}

        {/* Video Content - full width */}
        <div className="w-full flex justify-center">
          <OnlineVideo
            video={video}
            videoType={videoType}
            embedUrl={embedUrl}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            handleError={handleError}
          />
        </div>

        {/* Video Tags */}
        {video.tags && <VideoTags tags={video.tags} />}
      </div>
    );
  }

  // Render direct video URL
  return (
    <div className={`video-display ${className}`}>
      {/* Video Title and Metadata - hidden when title is shown in section header */}
      {!hideCaption && <VideoMetadata video={video} />}

      {/* Video Content - full width */}
      <div className="w-full flex justify-center">
        <DirectURLVideo
          video={video}
          videoUrl={videoUrl}
          autoplay={autoplay}
          controls={controls}
          muted={muted}
          isMuted={isMuted}
          loop={loop}
          isLoading={isLoading}
          error={error}
          isPlaying={isPlaying}
          startTime={startTime}
          isActive={isActive}
          handlePlayPause={handlePlayPause}
          handleMuteToggle={handleMuteToggle}
          handleFullscreen={handleFullscreen}
          handleError={handleError}
          setIsLoading={setIsLoading}
          setIsPlaying={setIsPlaying}
        />
      </div>

      {/* Video Tags */}
      {video.tags && <VideoTags tags={video.tags} />}
    </div>
  );
}
