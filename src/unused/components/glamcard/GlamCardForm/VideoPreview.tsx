import React, { useRef, useState } from "react";

interface Props {
  file?: File | null;
  videoUrl?: string;
  thumbnail?: string;
}

const VideoPreview: React.FC<Props> = ({ file, videoUrl, thumbnail }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const source = file
    ? URL.createObjectURL(file)
    : videoUrl || "";

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  if (!source) return null;

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-xl">
      <video
        ref={videoRef}
        src={source}
        poster={thumbnail}
        className="w-full h-auto"
        controls={isPlaying}
      />

      {!isPlaying && (
        <div
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer transition"
        >
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="black"
              viewBox="0 0 24 24"
              className="w-10 h-10 ml-1"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPreview;