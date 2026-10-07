"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import GuestModal from "./GuestModal";
import NotifySection from "./Notifysection";
import UpcomingSchedule from "./UpcomingSchedule";
import HeroSection from "./HeroSection";
import EpisodeCard from "./EpisodeCard";
import FeaturedEpisode from "./FeaturedEpisode";
import {
  CATEGORIES,
  Category,
  Episode,
  PLACEHOLDER_EPISODES,
  YOUTUBE_PLAYLIST_URL,
  extractIdFromSlug,
  fetchEpisodes,
  getEpisodeSlug,
} from "./episodes";

const EPISODES_PER_PAGE = 9;

type Filter = "All" | Category;

// ─── Video Modal ──────────────────────────────────────────────────────────────
function VideoModal({ episode, onClose }: { episode: Episode; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={episode.title || "Podcast episode"}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative w-full max-w-[1030px] mt-5" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-12 right-0 inline-flex items-center gap-2 text-[11px] uppercase tracking-widest font-medium text-white/70 hover:text-white transition-colors"
        >
          <span className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center">
            <X className="w-3.5 h-3.5" />
          </span>
          Close
        </button>
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-large">
          <iframe
            src={`https://www.youtube.com/embed/${episode.id}?autoplay=1&rel=0`}
            title={episode.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        </div>
        {episode.title && (
          <p className="mt-5 text-sm font-medium text-white/70 text-center leading-snug">{episode.title}</p>
        )}
      </div>
    </div>
  );
}

// ─── Category filter (same pill-tab treatment as the Journal top tabs) ────────
function CategoryFilter({
  options,
  active,
  onChange,
}: {
  options: Filter[];
  active: Filter;
  onChange: (f: Filter) => void;
}) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div
        role="tablist"
        aria-label="Filter episodes by category"
        className="flex w-max items-center gap-1 p-1 rounded-full bg-muted/40 border border-border/40"
      >
        {options.map((option) => {
          const isActive = option === active;
          return (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(option)}
              className={`px-3 sm:px-5 py-2 text-[11px] sm:text-sm font-semibold uppercase tracking-wide rounded-full whitespace-nowrap shrink-0 transition-all duration-200
                ${isActive ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border overflow-hidden bg-card">
      <div className="aspect-video bg-muted animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-1/3 rounded bg-muted animate-pulse" />
        <div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
        <div className="h-3 w-full rounded bg-muted animate-pulse" />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PodcastMain({ initialSlug }: { initialSlug?: string } = {}) {
  const router = useRouter();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("All");
  const [visibleCount, setVisibleCount] = useState(EPISODES_PER_PAGE);

  useEffect(() => {
    fetchEpisodes()
      .then(setEpisodes)
      .catch((error) => console.error("Podcast episodes fetch error:", error))
      .finally(() => setLoading(false));
  }, []);

  const allEpisodes = episodes.length > 0 ? episodes : PLACEHOLDER_EPISODES;
  const featured = allEpisodes[0];

  // Only offer categories that actually have episodes, in the canonical order.
  const filterOptions = useMemo<Filter[]>(
    () => ["All", ...CATEGORIES.filter((c) => allEpisodes.some((e) => e.category === c))],
    [allEpisodes]
  );

  // The featured episode is already shown above, so leave it out of the unfiltered grid.
  const filteredEpisodes = useMemo(
    () =>
      filter === "All"
        ? allEpisodes.filter((e) => e.id !== featured?.id)
        : allEpisodes.filter((e) => e.category === filter),
    [allEpisodes, featured, filter]
  );
  const shownEpisodes = filteredEpisodes.slice(0, visibleCount);

  const changeFilter = (f: Filter) => {
    setFilter(f);
    setVisibleCount(EPISODES_PER_PAGE);
  };

  // Open the modal for a video passed via the /podcast/{slug} URL once episodes are loaded.
  useEffect(() => {
    if (!initialSlug || loading) return;
    const match = allEpisodes.find((e) => getEpisodeSlug(e) === initialSlug);
    // Fallback: slug didn't match any known video — try to recover the raw YouTube ID.
    setActiveEpisode(
      match ?? { ...PLACEHOLDER_EPISODES[0], id: extractIdFromSlug(initialSlug), title: "", isPlaceholder: false }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSlug, loading]);

  const playEpisode = (episode: Episode) => {
    router.push(`/podcast/${getEpisodeSlug(episode)}`, { scroll: false });
  };

  const closeEpisode = () => {
    setActiveEpisode(null);
    router.push("/podcast", { scroll: false });
  };

  return (
    <main className="min-h-screen bg-background">
      <HeroSection onGuestClick={() => setGuestModalOpen(true)} />

      {/* Featured episode */}
      <section className="pt-16 md:pt-20">
        <div className="container-glamlink">
          <p className="text-[10px] uppercase tracking-widest text-primary mb-4">Featured Episode</p>
          {loading ? (
            <div className="rounded-2xl border border-border overflow-hidden grid md:grid-cols-[1.15fr_1fr]">
              <div className="aspect-video bg-muted animate-pulse" />
              <div className="p-8 space-y-4">
                <div className="h-3 w-1/4 rounded bg-muted animate-pulse" />
                <div className="h-6 w-5/6 rounded bg-muted animate-pulse" />
                <div className="h-4 w-full rounded bg-muted animate-pulse" />
              </div>
            </div>
          ) : (
            featured && <FeaturedEpisode episode={featured} onPlay={playEpisode} />
          )}
        </div>
      </section>

      {/* Episode listing */}
      <section id="episodes" className="scroll-mt-28 py-16 md:py-20">
        <div className="container-glamlink">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8 md:mb-10">
            <div className="min-w-0">
              <h2 className="section-title font-display">All Episodes</h2>
              <p className="section-subtitle">
                Beauty, wellness and business conversations with the people building the industry.
              </p>
            </div>
            {filterOptions.length > 2 && (
              <div className="min-w-0 lg:max-w-[60%]">
                <CategoryFilter options={filterOptions} active={filter} onChange={changeFilter} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? [...Array(6)].map((_, i) => <CardSkeleton key={i} />)
              : shownEpisodes.map((episode) => (
                <EpisodeCard key={episode.id} episode={episode} onPlay={playEpisode} />
              ))}
          </div>

          {!loading && shownEpisodes.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No other episodes in this category yet.
            </p>
          )}

          <div className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            {visibleCount < filteredEpisodes.length && (
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + EPISODES_PER_PAGE)}
                className="btn-primary"
              >
                Load more episodes
              </button>
            )}
            <a href={YOUTUBE_PLAYLIST_URL} target="_blank" rel="noopener noreferrer" className="btn-outline">
              View playlist on YouTube
            </a>
          </div>
        </div>
      </section>

      {/* Upcoming guests + notify */}
      <section className="section-glamlink border-t border-border">
        <div className="container-glamlink grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
            <div className="px-5 sm:px-6 pt-6 pb-4 border-b border-border">
              <p className="text-[10px] uppercase tracking-widest text-primary mb-2">Coming up</p>
              <h3 className="font-display text-2xl leading-snug text-foreground">Upcoming Guests</h3>
            </div>
            <UpcomingSchedule />
          </div>
          <NotifySection />
        </div>
      </section>

      {activeEpisode && <VideoModal episode={activeEpisode} onClose={closeEpisode} />}
      {guestModalOpen && <GuestModal open={guestModalOpen} onClose={() => setGuestModalOpen(false)} />}
    </main>
  );
}
