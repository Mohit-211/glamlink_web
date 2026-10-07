"use client";

import { Clock, Play } from "lucide-react";
import { EpisodeThumbnail } from "./EpisodeCard";
import {
  Episode,
  HOST_NAME,
  SPOTIFY_URL,
  formatEpisodeDate,
  formatEpisodeNumber,
} from "./episodes";

export default function FeaturedEpisode({
  episode,
  onPlay,
}: {
  episode: Episode;
  onPlay: (episode: Episode) => void;
}) {
  const date = formatEpisodeDate(episode.publishedAt);
  const playable = !episode.isPlaceholder;

  return (
    <article className="group rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
      <div className="grid md:grid-cols-[1.15fr_1fr] items-center">
        <button
          type="button"
          disabled={!playable}
          onClick={() => onPlay(episode)}
          aria-label={`Play ${episode.title}`}
          className="block w-full overflow-hidden text-left disabled:cursor-default"
        >
          <EpisodeThumbnail episode={episode} large priority />
        </button>

        <div className="p-6 sm:p-8 lg:p-10 min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-primary mb-3">
            {formatEpisodeNumber(episode.number)} · {episode.category}
          </p>

          <h2 className="font-display text-2xl md:text-3xl leading-snug tracking-tight text-foreground mb-4 line-clamp-3">
            {episode.title}
          </h2>

          {episode.description && (
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed line-clamp-3 mb-6">
              {episode.description}
            </p>
          )}

          {/* Host / guest */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">
              {HOST_NAME.charAt(0)}
            </div>
            <div className="min-w-0 text-sm leading-tight">
              <p className="font-medium text-foreground truncate">
                Hosted by {HOST_NAME}
              </p>
              {episode.guest && (
                <p className="text-muted-foreground truncate mt-0.5">with {episode.guest}</p>
              )}
            </div>
          </div>

          {/* Meta */}
          {(date || episode.duration) && (
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-4 border-t border-border mb-6">
              {date && <span>{date}</span>}
              {date && episode.duration && <span className="w-1 h-1 bg-border rounded-full" />}
              {episode.duration && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {episode.duration}
                </span>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={!playable}
              onClick={() => onPlay(episode)}
              className="btn-primary disabled:opacity-60"
            >
              <Play className="w-4 h-4 fill-current" />
              Play Episode
            </button>
            <a href={SPOTIFY_URL} target="_blank" rel="noopener noreferrer" className="btn-outline">
              Listen on Spotify
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
