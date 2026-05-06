"use client";
import { useEffect, useState } from "react";
import GuestModal from "./GuestModal";
import NotifySection from "./Notifysection";
import UpcomingSchedule2 from "./UpcomingSchedule2";
import HeroSection from "./HeroSection";

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
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "16px", height: "16px" }}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "16px", height: "16px" }}>
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

const ApplePodcastsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "16px", height: "16px" }}>
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
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "clamp(1rem, 4vw, 2rem)",
        background: "rgba(4,20,18,0.96)", backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <div
        style={{ position: "relative", width: "100%", maxWidth: "900px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "-48px", right: 0,
            display: "flex", alignItems: "center", gap: "8px",
            color: "rgba(255,255,255,0.6)",
            background: "none", border: "none", cursor: "pointer",
            fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500,
            transition: "color 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "white")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
        >
          <span
            style={{
              width: "28px", height: "28px", borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "14px", height: "14px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
          Close
        </button>
        <div
          style={{
            position: "relative", width: "100%", borderRadius: "16px",
            overflow: "hidden", paddingTop: "56.25%",
            boxShadow: "0 40px 80px -20px rgba(0,0,0,0.8)",
          }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
          />
        </div>
        <p style={{ marginTop: "20px", fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.7)", textAlign: "center", lineHeight: 1.4 }}>
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
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Thumbnail */}
      <div
        style={{
          position: "relative", aspectRatio: "16/9", borderRadius: "16px",
          overflow: "hidden", marginBottom: "16px",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: hovered
            ? "0 20px 48px -12px rgba(0,0,0,0.18), 0 4px 12px -4px rgba(0,0,0,0.08)"
            : "0 2px 12px -4px rgba(0,0,0,0.08), 0 1px 3px -1px rgba(0,0,0,0.05)",
          transform: hovered ? "translateY(-3px)" : "none",
          transition: "box-shadow 0.4s ease, transform 0.4s ease",
          cursor: isFallback ? "default" : "pointer",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => !isFallback && onPlay(video)}
      >
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              transform: hovered ? "scale(1.05)" : "scale(1)",
              transition: "transform 0.7s ease",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%", height: "100%", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", background: ph.bg,
            }}
          >
            <span style={{ fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 300, lineHeight: 1, marginBottom: "4px", fontFamily: "'Cormorant Garamond', Georgia, serif", color: ph.text, opacity: 0.9 }}>
              {episodeNum}
            </span>
            <span style={{ fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 600, color: ph.text, opacity: 0.6 }}>
              Episode
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)",
            opacity: hovered ? 1 : 0, transition: "opacity 0.3s",
          }}
        />

        {/* Episode badge */}
        <div style={{ position: "absolute", top: "12px", left: "12px" }}>
          <span style={{
            fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase",
            fontWeight: 700, padding: "4px 10px", borderRadius: "100px",
            background: "rgba(255,255,255,0.92)", color: "hsl(184 70% 32%)", backdropFilter: "blur(4px)",
          }}>
            EP. {episodeNum}
          </span>
        </div>

        {/* Play overlay */}
        {!isFallback && (
          <div
            style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "flex-end", justifyContent: "space-between",
              padding: "16px", opacity: hovered ? 1 : 0, transition: "opacity 0.3s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "40px", height: "40px", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "hsl(184 70% 41%)", boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                  flexShrink: 0,
                }}
              >
                <svg viewBox="0 0 24 24" fill="white" style={{ width: "20px", height: "20px", marginLeft: "2px" }}>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span style={{ color: "white", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>
                Watch Now
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Meta */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{
          fontSize: "clamp(13px, 1.5vw, 14px)", lineHeight: 1.4, fontWeight: 600, marginBottom: "8px",
          color: "hsl(210 30% 10%)", fontFamily: "'DM Sans', system-ui, sans-serif",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {video.title}
        </h3>
        {!isFallback && (
          <p style={{ fontSize: "11px", marginTop: "auto", color: "hsl(210 12% 58%)" }}>
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
    <div style={{ borderRadius: "16px", overflow: "hidden", background: "white", border: "1px solid hsl(204 14% 88%)", boxShadow: "0 2px 12px -4px rgba(0,0,0,0.06)" }}>
      <div style={{ padding: "20px" }}>
        <p style={{ fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 600, marginBottom: "4px", color: "hsl(184 70% 38%)" }}>
          Listen On
        </p>
        <p style={{ fontSize: "12px", marginBottom: "16px", color: "hsl(210 12% 55%)" }}>Available on all major platforms</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {platforms.map(({ href, label, icon, color, bg }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "10px 14px", borderRadius: "12px", fontSize: "13px", fontWeight: 500,
                color: "hsl(210 30% 10%)", border: "1px solid hsl(204 14% 90%)",
                background: "hsl(204 18% 98%)", textDecoration: "none", transition: "all 0.2s",
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = bg; el.style.borderColor = color + "40"; el.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "hsl(204 18% 98%)"; el.style.borderColor = "hsl(204 14% 90%)"; el.style.transform = "none"; }}
            >
              <span style={{ width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: bg, color }}>
                {icon}
              </span>
              {label}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "12px", height: "12px", marginLeft: "auto", opacity: 0.25 }}>
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
    <div style={{
      borderRadius: "16px", padding: "20px", marginBottom: "24px",
      background: "linear-gradient(135deg, hsl(184 70% 41%) 0%, hsl(184 60% 34%) 100%)",
      boxShadow: "0 4px 20px -4px hsl(184 70% 35% / 0.35)",
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {stats.map(({ value, label }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <p style={{ fontSize: "20px", fontWeight: 700, lineHeight: 1, color: "white" }}>{value}</p>
            <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "2px", color: "rgba(255,255,255,0.6)" }}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PodcastMain() {
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
    <main style={{ minHeight: "100vh", color: "hsl(210 30% 10%)", background: "hsl(204 20% 96%)", fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif" }}>

      {/* Responsive styles */}
      <style>{`
        .podcast-layout {
          display: grid;
          grid-template-columns: 1fr 292px;
          gap: 40px;
          align-items: start;
        }
        .sidebar {
          position: sticky;
          top: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .episodes-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .about-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 48px;
          flex-wrap: wrap;
        }

        @media (max-width: 1024px) {
          .podcast-layout {
            grid-template-columns: 1fr;
          }
          .sidebar {
            position: static;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }
          .episodes-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            grid-template-columns: 1fr;
          }
          .episodes-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
          .section-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
          }
        }

        @media (max-width: 480px) {
          .episodes-grid {
            grid-template-columns: 1fr;
          }
          .about-stats {
            gap: 24px;
          }
        }
      `}</style>

      {/* Hero */}
      <div style={{ marginTop: "50px" }}>
        <HeroSection onGuestClick={() => setGuestModalOpen(true)} />
      </div>

      {/* Main Content */}
      <section style={{ padding: "clamp(2.5rem, 6vw, 4rem) clamp(1rem, 4vw, 1.5rem)", maxWidth: "1240px", margin: "0 auto" }}>
        <div className="podcast-layout">

          {/* LEFT — Episodes */}
          <div>
            {/* Section header */}
            <div
              className="section-header"
              style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "32px" }}
            >
              <div>
                <p style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, marginBottom: "6px", color: "hsl(184 70% 38%)" }}>
                  ✦ Now Streaming
                </p>
                <h2 style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 700, lineHeight: 1.1, color: "hsl(210 30% 8%)", letterSpacing: "-0.02em" }}>
                  Latest Episodes
                </h2>
              </div>

              {/* Filter pills */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px", borderRadius: "100px", background: "hsl(204 14% 88%)", flexShrink: 0 }}>
                {(["all", "recent"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: "6px 16px", borderRadius: "100px", fontSize: "11px", fontWeight: 600,
                      letterSpacing: "0.05em", textTransform: "capitalize", cursor: "pointer", border: "none",
                      background: filter === f ? "white" : "transparent",
                      color: filter === f ? "hsl(184 70% 35%)" : "hsl(210 12% 50%)",
                      boxShadow: filter === f ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                      transition: "all 0.2s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {f === "all" ? "All Episodes" : "Recent"}
                  </button>
                ))}
              </div>
            </div>

            {/* Episode grid */}
            {loading ? (
              <div className="episodes-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i}>
                    <div style={{ aspectRatio: "16/9", borderRadius: "16px", marginBottom: "16px", background: "hsl(204 14% 88%)", animation: "pulse 1.5s ease-in-out infinite" }} />
                    <div style={{ height: "12px", borderRadius: "8px", marginBottom: "10px", background: "hsl(204 14% 88%)", width: "60%" }} />
                    <div style={{ height: "16px", borderRadius: "8px", background: "hsl(204 14% 88%)", width: "90%" }} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="episodes-grid">
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
            <div style={{ marginTop: "48px", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <a
                href={YOUTUBE_PLAYLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "12px",
                  padding: "14px 32px", borderRadius: "100px",
                  fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase",
                  fontWeight: 700, color: "white", textDecoration: "none",
                  background: "linear-gradient(135deg, hsl(184 70% 41%) 0%, hsl(184 60% 34%) 100%)",
                  boxShadow: "0 4px 16px hsl(184 70% 35% / 0.3)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.filter = "brightness(1.1)"; el.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.filter = "none"; el.style.transform = "none"; }}
              >
                View All Episodes
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: "14px", height: "14px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </a>
              <span style={{ fontSize: "11px", color: "hsl(210 12% 55%)" }}>
                {episodeCount} episodes total
              </span>
            </div>
          </div>

          {/* RIGHT — Sidebar */}
          <div className="sidebar">
            <StatsBar episodeCount={episodeCount} />

            {/* Upcoming Schedule card */}
            <div style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid hsl(204 14% 86%)", boxShadow: "0 2px 12px -4px rgba(0,0,0,0.06)" }}>
              <div style={{ padding: "16px 20px", background: "linear-gradient(135deg, hsl(184 70% 41%) 0%, hsl(184 60% 34%) 100%)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "white", opacity: 0.7 }} />
                  <p style={{ fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 700, color: "rgba(255,255,255,0.65)" }}>
                    Coming Up
                  </p>
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "white", letterSpacing: "-0.01em" }}>Upcoming Schedule</h3>
              </div>
              <div style={{ background: "white" }}>
                <UpcomingSchedule2 />
              </div>
            </div>

            <ListenOnCard />
          </div>
        </div>
      </section>

      {/* Notify */}
      <NotifySection />

      {/* About Strip */}
      <section style={{ padding: "clamp(3rem, 6vw, 5rem) clamp(1rem, 4vw, 1.5rem)", background: "hsl(184 60% 34%)" }}>
        <div style={{ maxWidth: "768px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, marginBottom: "16px", color: "rgba(255,255,255,0.5)" }}>
            About the Show
          </p>
          <p style={{
            fontSize: "clamp(17px, 3vw, 22px)", lineHeight: 1.6, fontWeight: 300, marginBottom: "40px", color: "white",
            fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", letterSpacing: "0.01em",
          }}>
            Unfiltered conversations with the professionals, founders, and innovators actively shaping the future of beauty and wellness.
          </p>
          <div className="about-stats">
            {[
              { value: `${episodeCount}+`, label: "Episodes" },
              { value: "Weekly", label: "New Episodes" },
              { value: "3+", label: "Platforms" },
            ].map(({ value, label }, i, arr) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "48px" }}>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "clamp(28px, 5vw, 36px)", fontWeight: 700, color: "white", lineHeight: 1, letterSpacing: "-0.02em" }}>{value}</p>
                  <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "8px", color: "rgba(255,255,255,0.5)" }}>{label}</p>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ width: "1px", height: "48px", background: "rgba(255,255,255,0.15)" }} />
                )}
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