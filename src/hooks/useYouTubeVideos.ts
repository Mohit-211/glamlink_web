"use client";

import { useEffect, useState } from "react";
import { fetchPlaylistVideos, Video } from "../lib/youtube";

export function useYouTubeVideos(playlistId: string) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlaylistVideos(playlistId).then((data) => {
      setVideos(data);
      setLoading(false);
    });
  }, [playlistId]);

  return { videos, loading };
}