import { VideoDisplayLegacy as VideoDisplay } from "../../items/media";
import { GalleryItem } from "@/lib/pages/for-professionals/types/professional";

interface VideoDisplaySectionProps {
  professional: any;
  video?: GalleryItem | null;
}

export default function VideoDisplaySection({ professional, video }: VideoDisplaySectionProps) {
  // Use provided video from gallery or create fallback video
  const videoItem = video || {
    id: "main-video",
    type: "video" as const,
    title: "My Signature Work",
    description: professional.bio || professional.description,
    url: "/videos/RisingStarPreview.mp4",
    thumbnail: undefined
  };

  return (
    <div>
      <VideoDisplay
        video={videoItem}
        autoplay={false}
        controls={true}
        muted={false}
        loop={false}
      />
    </div>
  );
}