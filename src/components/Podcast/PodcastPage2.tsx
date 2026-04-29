"use client";
import { useEffect, useState } from "react";
import GuestModal from "./GuestModal";
import NotifySection from "./Notifysection";
import HeroSection2 from "./HeroSection2";
import UpcomingSchedule2 from "./UpcomingSchedule2";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  duration?: string;
}

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || "";
const YOUTUBE_PLAYLIST_ID = "PLJPmuOJKw5YbrNAxnyi7SuQx9gNisadgY";
const YOUTUBE_PLAYLIST_URL = `https://www.youtube.com/playlist?list=${YOUTUBE_PLAYLIST_ID}`;
const SPOTIFY_URL = "https://open.spotify.com/show/0GEWcvRT3PFalAaN2faX4z?si=OWqOPcyZSZqNn7ATTnGJng";
const APPLE_PODCASTS_URL = "https://podcasts.apple.com/us/podcast/the-beauty-vault/id1885669168";

const PLACEHOLDER_PALETTE = [
  { bg: "linear-gradient(135deg,#e8f5f2 0%,#d0ede8 100%)", text: "#5bbfb0" },
  { bg: "linear-gradient(135deg,#f5f0eb 0%,#ede4d8 100%)", text: "#b8997a" },
  { bg: "linear-gradient(135deg,#eef1f7 0%,#dde4f0 100%)", text: "#7a95c0" },
  { bg: "linear-gradient(135deg,#f5eef7 0%,#ead8f0 100%)", text: "#a870c0" },
  { bg: "linear-gradient(135deg,#faf0ee 0%,#f0dbd7 100%)", text: "#c47a6e" },
  { bg: "linear-gradient(135deg,#eef5e8 0%,#d8eccc 100%)", text: "#6da855" },
];

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

const ApplePodcastsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M5.34 0A5.328 5.328 0 0 0 0 5.34v13.32A5.328 5.328 0 0 0 5.34 24h13.32A5.328 5.328 0 0 0 24 18.66V5.34A5.328 5.328 0 0 0 18.66 0zm7.006 2.06c3.106 0 5.633 1.02 7.585 3.026 1.773 1.802 2.7 4.198 2.7 6.942 0 5.747-3.9 9.847-9.378 9.847-5.478 0-9.385-4.1-9.385-9.847 0-2.744.927-5.14 2.7-6.942 1.958-2.006 4.477-3.026 7.583-3.026zm0 1.99c-2.617 0-4.73.882-6.228 2.55-1.397 1.558-2.13 3.64-2.13 5.993 0 4.835 3.136 7.96 7.758 7.96 4.623 0 7.752-3.125 7.752-7.96 0-2.354-.733-4.435-2.13-5.993-1.498-1.668-3.61-2.55-6.22-2.55zm.008 3.08c1.65 0 2.99 1.34 2.99 2.99s-1.34 2.99-2.99 2.99-2.99-1.34-2.99-2.99 1.34-2.99 2.99-2.99zm0 1.5a1.49 1.49 0 1 0 0 2.98 1.49 1.49 0 0 0 0-2.98zm0 4.79c2.26 0 4.09 1.83 4.09 4.09h-1.5a2.59 2.59 0 0 0-2.59-2.59 2.59 2.59 0 0 0-2.59 2.59H9.264c0-2.26 1.83-4.09 4.09-4.09z" />
  </svg>
);

const FALLBACK_EPISODES: Video[] = [
  { id: "fallback-1", title: "Behind the Glam: A Raiderettes Makeup Artist's Journey", thumbnail: "", publishedAt: "2025-01-01" },
  { id: "fallback-2", title: "Holistic + Non-Toxic Skincare: The Truth About Your Skincare", thumbnail: "", publishedAt: "2025-01-08" },
  { id: "fallback-3", title: "Innovation, Retinol and the Science Behind Results-Driven Skincare", thumbnail: "", publishedAt: "2025-01-15" },
  { id: "fallback-4", title: "Inside the Pretty Kitty: How Tricia Evans Built a Multi-Location Waxing Brand", thumbnail: "", publishedAt: "2025-01-22" },
];

async function fetchPlaylistVideos(playlistId: string): Promise<{ videos: Video[]; totalCount: number }> {
  if (!YOUTUBE_API_KEY) return { videos: [], totalCount: 0 };
  const allItems: Video[] = [];
  let pageToken = "";
  do {
    const pageParam = pageToken ? `&pageToken=${pageToken}` : "";
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}${pageParam}`;
    const res = await fetch(url);
    if (!res.ok) break;
    const data = await res.json();
    const items: Video[] = (data.items || [])
      .filter((item: any) => item.snippet?.resourceId?.videoId && item.snippet.title !== "Deleted video" && item.snippet.title !== "Private video")
      .map((item: any) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails?.maxres?.url || item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || "",
        publishedAt: item.snippet.publishedAt,
      }));
    allItems.push(...items);
    pageToken = data.nextPageToken || "";
  } while (pageToken);
  return { videos: [...allItems], totalCount: allItems.length };
}

// ─── Video Modal ──────────────────────────────────────────────────────────────
function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{ background: "rgba(4,20,18,0.96)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 flex items-center gap-2 text-white/60 hover:text-white transition-all duration-200 text-[11px] tracking-[0.2em] uppercase font-medium"
        >
          <span className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center hover:border-white/50 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
          Close
        </button>
        <div className="relative w-full rounded-2xl overflow-hidden" style={{ paddingTop: "56.25%", boxShadow: "0 40px 80px -20px rgba(0,0,0,0.8)" }}>
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            style={{ border: "none" }}
          />
        </div>
        <p className="mt-5 text-[13px] font-medium text-white/70 text-center leading-snug tracking-wide">
          {video.title}
        </p>
      </div>
    </div>
  );
}

// ─── Episode Card ─────────────────────────────────────────────────────────────
function EpisodeCard({
  video, index, episodeNumber, onPlay, placeholderStyle,
}: {
  video: Video; index: number; episodeNumber?: number; onPlay: (video: Video) => void; placeholderStyle?: { bg: string; text: string };
}) {
  const episodeNum = String(Math.max(1, episodeNumber ?? index + 1)).padStart(2, "0");
  const isFallback = video.id.startsWith("fallback");
  const ph = placeholderStyle ?? { bg: "linear-gradient(135deg,#e8f5f2,#d0ede8)", text: "#5bbfb0" };

  const date = new Date(video.publishedAt);
  const formattedDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="group flex flex-col">
      {/* Thumbnail */}
      <div
        className="relative aspect-video rounded-2xl overflow-hidden mb-4"
        style={{
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 2px 12px -4px rgba(0,0,0,0.08), 0 1px 3px -1px rgba(0,0,0,0.05)",
          transition: "box-shadow 0.4s ease, transform 0.4s ease",
        }}
      >
        <style>{`
          .ep-card-${index}:hover { box-shadow: 0 20px 48px -12px rgba(0,0,0,0.18), 0 4px 12px -4px rgba(0,0,0,0.08) !important; transform: translateY(-3px); }
        `}</style>
        <div className={`ep-card-${index} absolute inset-0`} style={{ transition: "box-shadow 0.4s ease, transform 0.4s ease" }} />

        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center" style={{ background: ph.bg }}>
            <span
              className="text-6xl font-light leading-none mb-1"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: ph.text, opacity: 0.9 }}
            >
              {episodeNum}
            </span>
            <span className="text-[9px] tracking-[0.3em] uppercase font-semibold" style={{ color: ph.text, opacity: 0.6 }}>
              Episode
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)" }}
        />

        {/* Episode badge */}
        <div className="absolute top-3 left-3">
          <span
            className="text-[9px] tracking-[0.2em] uppercase font-bold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.92)", color: "hsl(184 70% 32%)", backdropFilter: "blur(4px)" }}
          >
            EP. {episodeNum}
          </span>
        </div>

        {/* Play overlay */}
        {!isFallback && (
          <div
            className="absolute inset-0 flex items-end justify-between p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
            onClick={() => onPlay(video)}
          >
            <button
              className="flex items-center gap-2.5 text-white text-[11px] tracking-[0.15em] uppercase font-semibold"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 hover:scale-110"
                style={{ background: "hsl(184 70% 41%)", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}
              >
                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 ml-0.5">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              Watch Now
            </button>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-col flex-1">
        <h3
          className="text-[14px] leading-snug font-semibold mb-2 line-clamp-2 transition-colors duration-200 group-hover:text-[hsl(184_70%_32%)]"
          style={{ color: "hsl(210 30% 10%)", fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
          {video.title}
        </h3>
        {!isFallback && (
          <p className="text-[11px] mt-auto" style={{ color: "hsl(210 12% 58%)" }}>
            {formattedDate}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Listen On Card ───────────────────────────────────────────────────────────
function ListenOnCard() {
  const platforms = [
    { href: YOUTUBE_PLAYLIST_URL, label: "YouTube", icon: <YouTubeIcon />, color: "#ff0000", bg: "#fff1f1" },
    { href: SPOTIFY_URL, label: "Spotify", icon: <SpotifyIcon />, color: "#1DB954", bg: "#f0faf4" },
    { href: APPLE_PODCASTS_URL, label: "Apple Podcasts", icon: <ApplePodcastsIcon />, color: "#9B59B6", bg: "#f7f0fc" },
  ];

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "white", border: "1px solid hsl(204 14% 88%)", boxShadow: "0 2px 12px -4px rgba(0,0,0,0.06)" }}
    >
      <div className="p-5">
        <p className="text-[10px] tracking-[0.25em] uppercase font-semibold mb-1" style={{ color: "hsl(184 70% 38%)" }}>
          Listen On
        </p>
        <p className="text-[12px] mb-4" style={{ color: "hsl(210 12% 55%)" }}>Available on all major platforms</p>
        <div className="flex flex-col gap-2">
          {platforms.map(({ href, label, icon, color, bg }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-[13px] font-medium transition-all duration-200 hover:-translate-y-0.5"
              style={{ color: "hsl(210 30% 10%)", border: "1px solid hsl(204 14% 90%)", background: "hsl(204 18% 98%)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = bg; (e.currentTarget as HTMLElement).style.borderColor = color + "40"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "hsl(204 18% 98%)"; (e.currentTarget as HTMLElement).style.borderColor = "hsl(204 14% 90%)"; }}
            >
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: bg, color }}
              >
                {icon}
              </span>
              {label}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 ml-auto opacity-25">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar({ episodeCount }: { episodeCount: number }) {
  const stats = [
    { value: `${episodeCount}+`, label: "Episodes" },
    { value: "Weekly", label: "New Drops" },
    { value: "3", label: "Platforms" },
    { value: "Top 10%", label: "Beauty Pods" },
  ];
  return (
    <div
      className="rounded-2xl p-5 mb-6"
      style={{
        background: "linear-gradient(135deg, hsl(184 70% 41%) 0%, hsl(184 60% 34%) 100%)",
        boxShadow: "0 4px 20px -4px hsl(184 70% 35% / 0.35)",
      }}
    >
      <div className="grid grid-cols-2 gap-4">
        {stats.map(({ value, label }) => (
          <div key={label} className="text-center">
            <p className="text-[20px] font-bold leading-tight text-white">{value}</p>
            <p className="text-[9px] tracking-[0.2em] uppercase mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PodcastMain2() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "recent">("all");

  useEffect(() => {
    fetchPlaylistVideos(YOUTUBE_PLAYLIST_ID)
      .then(({ videos, totalCount }) => { setVideos(videos); setTotalCount(totalCount); })
      .finally(() => setLoading(false));
  }, []);

  const finalVideos = videos.length > 0 ? videos : FALLBACK_EPISODES;
  const episodeCount = totalCount > 0 ? totalCount : FALLBACK_EPISODES.length;
  const displayedVideos = filter === "recent" ? finalVideos.slice(0, 6) : finalVideos;

  return (
    <main
      className="min-h-screen text-[hsl(210_30%_10%)]"
      style={{ background: "hsl(204 20% 96%)", fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif" }}
    >
      {/* Hero */}
      <div style={{ marginTop: "50px" }}>
        <HeroSection2 onGuestClick={() => setGuestModalOpen(true)} />
      </div>

      {/* Main Content */}
      <section className="py-16 px-4 md:px-6" style={{ maxWidth: "1240px", margin: "0 auto" }}>
        <div className="grid gap-10 items-start" style={{ gridTemplateColumns: "1fr 292px" }}>

          {/* LEFT — Episodes */}
          <div>
            {/* Section header */}
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-1.5" style={{ color: "hsl(184 70% 38%)" }}>
                  ✦ Now Streaming
                </p>
                <h2 className="text-[30px] font-bold leading-tight" style={{ color: "hsl(210 30% 8%)", letterSpacing: "-0.02em" }}>
                  Latest Episodes
                </h2>
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-1.5 p-1 rounded-full" style={{ background: "hsl(204 14% 88%)" }}>
                {(["all", "recent"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className="px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-wide capitalize transition-all duration-200"
                    style={{
                      background: filter === f ? "white" : "transparent",
                      color: filter === f ? "hsl(184 70% 35%)" : "hsl(210 12% 50%)",
                      boxShadow: filter === f ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                    }}
                  >
                    {f === "all" ? "All Episodes" : "Recent"}
                  </button>
                ))}
              </div>
            </div>

            {/* Episode grid */}
            {loading ? (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-video rounded-2xl mb-4" style={{ background: "hsl(204 14% 88%)" }} />
                    <div className="h-3 rounded-lg mb-2.5" style={{ background: "hsl(204 14% 88%)", width: "60%" }} />
                    <div className="h-4 rounded-lg" style={{ background: "hsl(204 14% 88%)", width: "90%" }} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedVideos.map((video, i) => (
                  <EpisodeCard
                    key={video.id}
                    video={video}
                    index={i}
                    episodeNumber={episodeCount - i}
                    placeholderStyle={PLACEHOLDER_PALETTE[i % PLACEHOLDER_PALETTE.length]}
                    onPlay={setActiveVideo}
                  />
                ))}
              </div>
            )}

            {/* View All */}
            <div className="mt-12 flex items-center gap-4">
              <a
                href={YOUTUBE_PLAYLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-[11px] tracking-[0.18em] uppercase font-bold text-white transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg, hsl(184 70% 41%) 0%, hsl(184 60% 34%) 100%)",
                  boxShadow: "0 4px 16px hsl(184 70% 35% / 0.3)",
                }}
              >
                View All Episodes
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </a>
              <span className="text-[11px]" style={{ color: "hsl(210 12% 55%)" }}>
                {episodeCount} episodes total
              </span>
            </div>
          </div>

          {/* RIGHT — Sidebar */}
          <div className="flex flex-col gap-5" style={{ position: "sticky", top: "24px" }}>
            {/* Stats */}
            <StatsBar episodeCount={episodeCount} />

            {/* Upcoming Schedule card */}
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid hsl(204 14% 86%)", boxShadow: "0 2px 12px -4px rgba(0,0,0,0.06)" }}>
              <div className="px-5 py-4" style={{ background: "linear-gradient(135deg, hsl(184 70% 41%) 0%, hsl(184 60% 34%) 100%)" }}>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white opacity-70" />
                  <p className="text-[9px] tracking-[0.28em] uppercase font-bold" style={{ color: "rgba(255,255,255,0.65)" }}>
                    Coming Up
                  </p>
                </div>
                <h3 className="text-[17px] font-bold text-white tracking-tight">Upcoming Schedule</h3>
              </div>
              <div style={{ background: "white" }}>
                <UpcomingSchedule2 />
              </div>
            </div>

            {/* Listen On */}
            <ListenOnCard />
          </div>
        </div>
      </section>

      {/* Notify */}
      <NotifySection />

      {/* About Strip */}
      <section className="py-20 px-6" style={{ background: "hsl(184 60% 34%)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase font-bold mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
            About the Show
          </p>
          <p
            className="text-[22px] leading-relaxed font-light mb-10 text-white"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", letterSpacing: "0.01em" }}
          >
            Unfiltered conversations with the professionals, founders, and innovators actively shaping the future of beauty and wellness.
          </p>
          <div className="flex items-center justify-center gap-12">
            {[
              { value: `${episodeCount}+`, label: "Episodes" },
              { value: "Weekly", label: "New Episodes" },
              { value: "3+", label: "Platforms" },
            ].map(({ value, label }, i, arr) => (
              <div key={label} className="flex items-center gap-12">
                <div className="text-center">
                  <p className="text-[36px] font-bold text-white leading-none" style={{ letterSpacing: "-0.02em" }}>{value}</p>
                  <p className="text-[10px] tracking-[0.2em] uppercase mt-2" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</p>
                </div>
                {i < arr.length - 1 && <div className="w-px h-12" style={{ background: "rgba(255,255,255,0.15)" }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modals */}
      {activeVideo && <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />}
      {guestModalOpen && <GuestModal open={guestModalOpen} onClose={() => setGuestModalOpen(false)} />}
    </main>
  );
}