"use client";
import { useEffect, useState, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Play, X } from "lucide-react";
import GuestModal from "./GuestModal";
import NotifySection from "./Notifysection";
import UpcomingSchedule from "./UpcomingSchedule";
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

// ─── Slug helpers ─────────────────────────────────────────────────────────────
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Builds a readable, unique URL slug: title-based text + the YouTube video ID. */
function getVideoSlug(video: Video): string {
  const base = slugify(video.title);
  return base ? `${base}` : video.id;
}

/** Pulls the trailing YouTube video ID (11 chars) back out of a slug, as a fallback. */
function extractIdFromSlug(slug: string): string {
  const match = slug.match(/([a-zA-Z0-9_-]{11})$/);
  return match ? match[1] : slug;
}

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const SpotifyIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.020 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

const ApplePodcastsIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M5.34 0A5.328 5.328 0 0 0 0 5.34v13.32A5.328 5.328 0 0 0 5.34 24h13.32A5.328 5.328 0 0 0 24 18.66V5.34A5.328 5.328 0 0 0 18.66 0zm7.006 2.06c3.106 0 5.633 1.02 7.585 3.026 1.773 1.802 2.7 4.198 2.7 6.942 0 5.747-3.9 9.847-9.378 9.847-5.478 0-9.385-4.1-9.385-9.847 0-2.744.927-5.14 2.7-6.942 1.958-2.006 4.477-3.026 7.583-3.026zm0 1.99c-2.617 0-4.73.882-6.228 2.55-1.397 1.558-2.13 3.64-2.13 5.993 0 4.835 3.136 7.960 7.758 7.960 4.623 0 7.752-3.125 7.752-7.960 0-2.354-.733-4.435-2.13-5.993-1.498-1.668-3.61-2.55-6.22-2.55zm.008 3.08c1.65 0 2.99 1.34 2.99 2.99s-1.34 2.99-2.99 2.99-2.99-1.34-2.99-2.99 1.34-2.99 2.99-2.99zm0 1.5a1.49 1.49 0 1 0 0 2.98 1.49 1.49 0 0 0 0-2.98zm0 4.79c2.26 0 4.09 1.83 4.09 4.09h-1.5a2.59 2.59 0 0 0-2.59-2.59 2.59 2.59 0 0 0-2.59 2.59H9.264c0-2.26 1.83-4.09 4.09-4.09z" />
  </svg>
);

const PLATFORMS: { label: string; href: string; icon: ComponentType<{ className?: string }> }[] = [
  { label: "YouTube", href: YOUTUBE_PLAYLIST_URL, icon: YouTubeIcon },
  { label: "Spotify", href: SPOTIFY_URL, icon: SpotifyIcon },
  { label: "Apple Podcasts", href: APPLE_PODCASTS_URL, icon: ApplePodcastsIcon },
];

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

const eyebrow = "text-[10px] font-semibold uppercase tracking-[0.25em] text-primary";

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/95 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <div className="relative mt-5 w-full max-w-[1030px]" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20">
            <X className="h-3.5 w-3.5" />
          </span>
          Close
        </button>
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-large">
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
        <p className="mt-5 text-center text-[13px] font-medium leading-snug text-white/70">{video.title}</p>
      </div>
    </div>
  );
}

// ─── Episode Card ─────────────────────────────────────────────────────────────
function EpisodeCard({
  video, index, episodeNumber, onPlay,
}: {
  video: Video; index: number; episodeNumber?: number; onPlay: (video: Video) => void;
}) {
  const episodeNum = String(Math.max(1, episodeNumber ?? index + 1)).padStart(2, "0");
  const isFallback = video.id.startsWith("fallback");
  const formattedDate = new Date(video.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="group flex flex-col">
      {/* Thumbnail */}
      <div
        className={`relative mb-4 aspect-video overflow-hidden rounded-2xl border border-border shadow-soft transition-all duration-300 ${
          isFallback ? "cursor-default" : "cursor-pointer group-hover:-translate-y-0.5 group-hover:shadow-medium"
        }`}
        onClick={() => !isFallback && onPlay(video)}
      >
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-accent text-primary">
            <span className="mb-1 text-4xl font-light leading-none sm:text-5xl">{episodeNum}</span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.3em] opacity-70">Episode</span>
          </div>
        )}

        {/* Episode badge */}
        <span className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-accent-foreground backdrop-blur-sm">
          EP. {episodeNum}
        </span>

        {/* Play overlay */}
        {!isFallback && (
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/55 to-transparent to-55% p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary shadow-medium">
                <Play className="ml-0.5 h-5 w-5 fill-primary-foreground text-primary-foreground" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white">Watch Now</span>
            </div>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-1 flex-col">
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-snug text-foreground">{video.title}</h3>
        {!isFallback && <p className="mt-auto text-[11px] text-muted-foreground">{formattedDate}</p>}
      </div>
    </div>
  );
}

// ─── Listen On Card ───────────────────────────────────────────────────────────
function ListenOnCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <p className={`${eyebrow} mb-1`}>Listen On</p>
      <p className="mb-4 text-xs text-muted-foreground">Available on all major platforms</p>
      <div className="flex flex-col gap-2">
        {PLATFORMS.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-accent"
          >
            <Icon className="h-4 w-4 text-primary" />
            {label}
          </a>
        ))}
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
    <div className="rounded-2xl bg-primary p-5 shadow-primary">
      <div className="grid grid-cols-2 gap-4">
        {stats.map(({ value, label }) => (
          <div key={label} className="text-center">
            <p className="text-xl font-semibold leading-none text-primary-foreground">{value}</p>
            <p className="mt-0.5 text-[9px] uppercase tracking-[0.2em] text-primary-foreground/70">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PodcastMain({ initialSlug }: { initialSlug?: string } = {}) {
  const router = useRouter();
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

  // Open the modal for a video passed via the /podcast/{slug} URL once episodes are loaded.
  useEffect(() => {
    if (!initialSlug || loading) return;
    const match = finalVideos.find((v) => getVideoSlug(v) === initialSlug);
    if (match) {
      setActiveVideo(match);
    } else {
      // Fallback: slug didn't match any known video (e.g. deep link to a video
      // not in the current playlist window) — try to recover the raw YouTube ID.
      setActiveVideo({ id: extractIdFromSlug(initialSlug), title: "", thumbnail: "", publishedAt: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSlug, loading]);

  const playVideo = (video: Video) => {
    router.push(`/podcast/${getVideoSlug(video)}`);
  };

  const closeVideo = () => {
    router.push("/podcast");
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <HeroSection onGuestClick={() => setGuestModalOpen(true)} />

      {/* Main Content */}
      <section className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 md:py-16">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_292px]">

          {/* LEFT — Episodes */}
          <div>
            {/* Section header */}
            <div className="mb-8 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className={`${eyebrow} mb-1.5`}>✦ Now Streaming</p>
                <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl">Latest Episodes</h2>
              </div>

              {/* Filter pills */}
              <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-muted p-1">
                {(["all", "recent"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`whitespace-nowrap rounded-full px-4 py-1.5 text-[11px] font-semibold tracking-wide transition-all ${
                      filter === f
                        ? "bg-card text-accent-foreground shadow-soft"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f === "all" ? "All Episodes" : "Recent"}
                  </button>
                ))}
              </div>
            </div>

            {/* Episode grid */}
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i}>
                    <div className="mb-4 aspect-video animate-pulse rounded-2xl bg-muted" />
                    <div className="mb-2.5 h-3 w-3/5 rounded-lg bg-muted" />
                    <div className="h-4 w-11/12 rounded-lg bg-muted" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                {displayedVideos.map((video, i) => (
                  <EpisodeCard
                    key={video.id}
                    video={video}
                    index={i}
                    episodeNumber={episodeCount - i}
                    onPlay={playVideo}
                  />
                ))}
              </div>
            )}

            {/* View All */}
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <a href={YOUTUBE_PLAYLIST_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                View All Episodes
                <ArrowRight className="h-4 w-4" />
              </a>
              <span className="text-[11px] text-muted-foreground">{episodeCount} episodes total</span>
            </div>
          </div>

          {/* RIGHT — Sidebar */}
          <div className="grid gap-4 md:grid-cols-3 lg:sticky lg:top-24 lg:flex lg:flex-col lg:gap-5">
            <StatsBar episodeCount={episodeCount} />

            {/* Upcoming Schedule card */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
              <div className="bg-primary px-5 py-4">
                <div className="mb-0.5 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/70" />
                  <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-primary-foreground/70">Coming Up</p>
                </div>
                <h3 className="text-[17px] font-semibold tracking-tight text-primary-foreground">Upcoming Schedule</h3>
              </div>
              <UpcomingSchedule />
            </div>

            <ListenOnCard />
          </div>
        </div>
      </section>

      {/* Notify */}
      <NotifySection />

      {/* About Strip */}
      <section className="bg-primary px-4 py-12 sm:px-6 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary-foreground/70">About the Show</p>
          <p className="mb-10 text-lg leading-relaxed text-primary-foreground md:text-[22px]">
            Unfiltered conversations with the professionals, founders, and innovators actively shaping the future of beauty and wellness.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
            {[
              { value: `${episodeCount}+`, label: "Episodes" },
              { value: "Weekly", label: "New Episodes" },
              { value: "3+", label: "Platforms" },
            ].map(({ value, label }, i, arr) => (
              <div key={label} className="flex items-center gap-6 sm:gap-12">
                <div className="text-center">
                  <p className="text-3xl font-semibold leading-none tracking-tight text-primary-foreground md:text-4xl">{value}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-primary-foreground/70">{label}</p>
                </div>
                {i < arr.length - 1 && <div className="h-12 w-px bg-primary-foreground/20" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modals */}
      {activeVideo && <VideoModal video={activeVideo} onClose={closeVideo} />}
      {guestModalOpen && <GuestModal open={guestModalOpen} onClose={() => setGuestModalOpen(false)} />}
    </main>
  );
}
