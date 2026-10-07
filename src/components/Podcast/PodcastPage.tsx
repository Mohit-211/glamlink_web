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
            <span style={{ fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 300, lineHeight: 1, marginBottom: "4px", fontFamily: "inherit", color: ph.text, opacity: 0.9 }}>
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
            background: "rgba(255,255,255,0.92)", color: "hsl(186 70% 32%)", backdropFilter: "blur(4px)",
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
                  background: "hsl(186 70% 41%)", boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
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
          color: "hsl(210 30% 10%)",
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

function CardSkeleton() {
  return (
    <div style={{ borderRadius: "16px", overflow: "hidden", background: "white", border: "1px solid hsl(204 14% 88%)", boxShadow: "0 2px 12px -4px rgba(0,0,0,0.06)" }}>
      <div style={{ padding: "20px" }}>
        <p style={{ fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 600, marginBottom: "4px", color: "hsl(186 70% 38%)" }}>
          Listen On
        </p>
        <p style={{ fontSize: "12px", marginBottom: "16px", color: "hsl(210 12% 55%)" }}>Available on all major platforms</p>
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
      background: "#24bbcb",
      boxShadow: "0 4px 20px -4px hsl(186 70% 35% / 0.35)",
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {stats.map(({ value, label }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <p style={{ fontSize: "20px", fontWeight: 600, lineHeight: 1, color: "white" }}>{value}</p>
            <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "2px", color: "rgba(255,255,255,0.6)" }}>{label}</p>
          </div>
        ))}
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
    <main style={{ minHeight: "100vh", color: "hsl(210 30% 10%)", background: "hsl(204 20% 96%)" }}>

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
      <HeroSection onGuestClick={() => setGuestModalOpen(true)} />

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
                <p style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, marginBottom: "6px", color: "#24bbcb" }}>
                  ✦ Now Streaming
                </p>
                <h2 style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 600, lineHeight: 1.1, color: "hsl(210 30% 8%)", letterSpacing: "-0.02em" }}>
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
                      color: filter === f ? "#24bbcb" : "hsl(210 12% 50%)",
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
                background: "#24bbcb",
                  boxShadow: "0 4px 16px hsl(186 70% 35% / 0.3)",
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
              <div style={{ padding: "16px 20px", background: "#24bbcb" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "white", opacity: 0.7 }} />
                  <p style={{ fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>
                    Coming Up
                  </p>
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 600, color: "white", letterSpacing: "-0.01em" }}>Upcoming Schedule</h3>
              </div>
              <div style={{ background: "white" }}>
                <UpcomingSchedule />
              </div>
            </div>

            <ListenOnCard />
          </div>
        </div>
      </section>

      {/* Notify */}
      <NotifySection />

      {/* About Strip */}
      <section style={{ padding: "clamp(3rem, 6vw, 5rem) clamp(1rem, 4vw, 1.5rem)", background: "#24bbcb" }}>
        <div style={{ maxWidth: "768px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 600, marginBottom: "16px", color: "rgba(255,255,255,0.5)" }}>
            About the Show
          </p>
          <p style={{
            fontSize: "clamp(17px, 3vw, 22px)", lineHeight: 1.6, fontWeight: 400, marginBottom: "40px", color: "white",
            fontFamily: "inherit", letterSpacing: "0.01em",
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
                  <p style={{ fontSize: "clamp(28px, 5vw, 36px)", fontWeight: 600, color: "white", lineHeight: 1, letterSpacing: "-0.02em" }}>{value}</p>
                  <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "8px", color: "rgba(255,255,255,0.5)" }}>{label}</p>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ width: "1px", height: "48px", background: "rgba(255,255,255,0.15)" }} />
                )}
              </div>
            ))}
          </div>
          <NotifySection />
        </div>
      </section>

      {activeEpisode && <VideoModal episode={activeEpisode} onClose={closeEpisode} />}
      {guestModalOpen && <GuestModal open={guestModalOpen} onClose={() => setGuestModalOpen(false)} />}
    </main>
  );
}
