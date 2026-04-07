"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import PodcastImage from "../../../public/podcastcover.png";
import { useYouTubeVideos } from "@/hooks/useYouTubeVideos";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Video {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  duration?: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || "";

const YOUTUBE_PLAYLIST_ID = "PLJPmuOJKw5YbrNAxnyi7SuQx9gNisadgY";
const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@YourChannel";
const YOUTUBE_PLAYLIST_URL = `https://www.youtube.com/playlist?list=${YOUTUBE_PLAYLIST_ID}`;
const SPOTIFY_URL = "https://open.spotify.com/show/YOUR_SHOW_ID";
const APPLE_PODCASTS_URL = "https://podcasts.apple.com/podcast/YOUR_PODCAST";
const GUEST_FORM_URL = "https://your-guest-form-link.com";

// ─── Icons ────────────────────────────────────────────────────────────────────
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

// ─── Fallback Episodes ─────────────────────────────────────────────────────────
const FALLBACK_EPISODES: Video[] = [
  {
    id: "fallback-1",
    title: "Behind the Glam: A Raiderettes Makeup Artist's Journey",
    thumbnail: "",
    publishedAt: "2025-01-01",
  },
  {
    id: "fallback-2",
    title: "Holistic + Non-Toxic Skincare: The Truth About Your Skincare",
    thumbnail: "",
    publishedAt: "2025-01-08",
  },
  {
    id: "fallback-3",
    title: "Innovation, Retinol and the Science Behind Results-Driven Skincare",
    thumbnail: "",
    publishedAt: "2025-01-15",
  },
  {
    id: "fallback-4",
    title: "Inside the Pretty Kitty: How Tricia Evans Built a Multi-Location Waxing Brand",
    thumbnail: "",
    publishedAt: "2025-01-22",
  },
];

// ─── Fetch Helper ──────────────────────────────────────────────────────────────
async function fetchPlaylistVideos(playlistId: string): Promise<Video[]> {
  if (!YOUTUBE_API_KEY) return [];
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=6&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.items || []).map((item: any) => ({
    id: item.snippet.resourceId.videoId,
    title: item.snippet.title,
    thumbnail:
      item.snippet.thumbnails?.maxres?.url ||
      item.snippet.thumbnails?.high?.url ||
      item.snippet.thumbnails?.medium?.url ||
      "",
    publishedAt: item.snippet.publishedAt,
  }));
}

// ─── Episode Card ──────────────────────────────────────────────────────────────
function EpisodeCard({ video, index }: { video: Video; index: number }) {
  const episodeNum = String(index + 1).padStart(2, "0");
  const ytUrl = video.id.startsWith("fallback")
    ? YOUTUBE_PLAYLIST_URL
    : `https://www.youtube.com/watch?v=${video.id}&list=${YOUTUBE_PLAYLIST_ID}`;

  return (
    <a
      href={ytUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-white rounded-xl overflow-hidden mb-4 border border-[hsl(204_14%_88%)] shadow-[0_2px_8px_-2px_hsl(210_30%_10%/0.06)] transition-shadow duration-300 group-hover:shadow-[0_6px_20px_-4px_hsl(210_30%_10%/0.12)]">
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[hsl(204_18%_94%)]">
            <span
              className="text-5xl font-light"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                color: "hsl(184 40% 70%)",
              }}
            >
              {episodeNum}
            </span>
          </div>
        )}
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
            style={{ background: "hsl(184 70% 41%)" }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="white"
              className="w-5 h-5 ml-0.5"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div>
        <span
          className="text-[10px] tracking-[0.2em] font-medium uppercase mb-2 block"
          style={{ color: "hsl(184 70% 38%)" }}
        >
          EP. {episodeNum}
        </span>
        <h3
          className="text-[15px] leading-snug font-medium transition-colors duration-200"
          style={{ color: "hsl(210 30% 10%)" }}
        >
          {video.title}
        </h3>
      </div>
    </a>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function PodcastMain() {
  const { videos, loading } = useYouTubeVideos(YOUTUBE_PLAYLIST_ID);

  const finalVideos = videos.length > 0 ? videos : FALLBACK_EPISODES;
  const episodeCount = finalVideos.length;

  return (
    <main
      className="min-h-screen text-[hsl(210_30%_10%)]"
      style={{
        background: "hsl(204 18% 94%)",
        fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
      }}
    >

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-16">

          {/* Cover Art */}
          <div className="flex-shrink-0">
            <div className="w-44 h-44 md:w-56 md:h-56 rounded-2xl overflow-hidden relative shadow-[0_8px_32px_-8px_hsl(210_30%_10%/0.16)] border border-[hsl(204_14%_88%)]">
              <Image
                src={PodcastImage}
                alt="The Beauty Vault"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Text + Buttons */}
          <div className="flex-1 text-center md:text-left">
            {/* Glamlink-style teal eyebrow label */}
            <p
              className="text-[11px] tracking-[0.18em] uppercase mb-4 font-medium"
              style={{ color: "hsl(184 70% 38%)" }}
            >
              A Podcast by Glamlink
            </p>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-4 leading-[1.05]"
              style={{ color: "hsl(210 30% 10%)" }}
            >
              The Beauty Vault
            </h1>

            <p
              className="text-sm md:text-base font-normal leading-relaxed max-w-sm mb-8 mx-auto md:mx-0"
              style={{ color: "hsl(210 12% 48%)" }}
            >
              Conversations with the professionals shaping beauty&nbsp;&amp;&nbsp;wellness.
            </p>

            {/* Platform Buttons */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <a
                href={YOUTUBE_PLAYLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs tracking-wide font-medium transition-all duration-200 bg-white border border-[hsl(204_14%_86%)] hover:border-[hsl(184_70%_41%)] hover:text-[hsl(184_70%_38%)]"
                style={{ color: "hsl(210 25% 30%)" }}
              >
                <YouTubeIcon />
                YouTube
              </a>

              <a
                href={SPOTIFY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs tracking-wide font-medium transition-all duration-200 bg-white border border-[hsl(204_14%_86%)] hover:border-[hsl(184_70%_41%)] hover:text-[hsl(184_70%_38%)]"
                style={{ color: "hsl(210 25% 30%)" }}
              >
                <SpotifyIcon />
                Spotify
              </a>

              <a
                href={APPLE_PODCASTS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs tracking-wide font-medium transition-all duration-200 bg-white border border-[hsl(204_14%_86%)] hover:border-[hsl(184_70%_41%)] hover:text-[hsl(184_70%_38%)]"
                style={{ color: "hsl(210 25% 30%)" }}
              >
                <ApplePodcastsIcon />
                Apple Podcasts
              </a>

              {/* Glamlink-style teal CTA pill */}
              <a
                href={GUEST_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs tracking-wide font-semibold text-white transition-all duration-200 hover:brightness-110"
                style={{ background: "hsl(184 70% 41%)" }}
              >
                Want to Be a Guest?
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="border-t border-[hsl(204_14%_88%)]" />
      </div>

      {/* ── Episodes Grid ─────────────────────────────────────────────────── */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="flex items-baseline justify-between mb-12">
          <div>
            <p
              className="text-[10px] tracking-[0.25em] uppercase mb-2 font-medium"
              style={{ color: "hsl(184 70% 38%)" }}
            >
              Now Playing
            </p>
            <h2
              className="text-[28px] font-semibold"
              style={{ color: "hsl(210 30% 10%)" }}
            >
              Latest Episodes
            </h2>
          </div>
          <p
            className="text-[11px] tracking-[0.15em] uppercase hidden md:block"
            style={{ color: "hsl(210 12% 55%)" }}
          >
            New episodes weekly
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video rounded-xl bg-white mb-4" />
                <div className="h-3 bg-white w-1/4 mb-3 rounded" />
                <div className="h-4 bg-white w-3/4 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {finalVideos.map((video, i) => (
              <EpisodeCard key={video.id} video={video} index={i} />
            ))}
          </div>
        )}

        {/* View All */}
        <div className="mt-16 text-center">
          <a
            href={YOUTUBE_PLAYLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-[11px] tracking-[0.15em] uppercase font-semibold text-white transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5"
            style={{ background: "hsl(184 70% 41%)" }}
          >
            View All Episodes
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* ── About Strip ───────────────────────────────────────────────────── */}
      <section
        className="py-16 px-6"
        style={{ background: "hsl(204 18% 89%)" }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <p
            className="text-[10px] tracking-[0.25em] uppercase mb-4 font-medium"
            style={{ color: "hsl(184 70% 38%)" }}
          >
            About the Show
          </p>
          <p
            className="text-[18px] leading-relaxed font-normal"
            style={{ color: "hsl(210 25% 22%)" }}
          >
            Unfiltered conversations with the professionals, founders, and innovators
            actively shaping the future of beauty and wellness.
          </p>
          <div className="mt-8 flex items-center justify-center gap-8 text-center">
            <div>
              <p
                className="text-3xl font-semibold"
                style={{ color: "hsl(210 30% 10%)" }}
              >
                {episodeCount}+
              </p>
              <p
                className="text-[10px] tracking-widest uppercase mt-1"
                style={{ color: "hsl(210 12% 52%)" }}
              >
                Episodes
              </p>
            </div>
            <div
              className="w-px h-10"
              style={{ background: "hsl(204 14% 80%)" }}
            />
            {/* <div>
              <p
                className="text-3xl font-semibold"
                style={{ color: "hsl(210 30% 10%)" }}
              >
                3
              </p>
              <p
                className="text-[10px] tracking-widest uppercase mt-1"
                style={{ color: "hsl(210 12% 52%)" }}
              >
                Platforms
              </p>
            </div> */}
          </div>
        </div>
      </section>

    </main>
  );
}