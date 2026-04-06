export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
}

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || "";

export async function fetchPlaylistVideos(playlistId: string): Promise<Video[]> {
  if (!API_KEY) {
    console.error("❌ Missing API Key");
    return [];
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=6&playlistId=${playlistId}&key=${API_KEY}`
    );

    if (!res.ok) {
      console.error("❌ API Error", res.status);
      return [];
    }

    const data = await res.json();

    return (data.items || []).map((item: any) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnail:
        item.snippet.thumbnails?.high?.url ||
        item.snippet.thumbnails?.medium?.url ||
        "",
      publishedAt: item.snippet.publishedAt,
    }));
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    return [];
  }
}