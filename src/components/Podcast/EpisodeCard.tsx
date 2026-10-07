"use client";

import { Mic, Play } from "lucide-react";
import { Episode, formatEpisodeDate, formatEpisodeNumber } from "./episodes";

/** 16:9 thumbnail with duration badge and hover play button — shared by cards and the featured episode. */
export function EpisodeThumbnail({
  episode,
  large = false,
  priority = false,
}: {
  episode: Episode;
  large?: boolean;
  priority?: boolean;
}) {
  return (
    <div className="relative w-full aspect-video overflow-hidden bg-accent">
      {episode.thumbnail ? (
        <img
          src={episode.thumbnail}
          alt={episode.title}
          loading={priority ? "eager" : "lazy"}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-primary">
          <Mic className={large ? "w-10 h-10" : "w-8 h-8"} strokeWidth={1.5} />
          <span className="text-[10px] uppercase tracking-widest font-semibold">
            {formatEpisodeNumber(episode.number)}
          </span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

      {!episode.isPlaceholder && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-primary
              transition-all duration-300 ${large
                ? "w-16 h-16 opacity-95 group-hover:scale-105"
                : "w-12 h-12 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
              }`}
          >
            <Play className={`${large ? "w-6 h-6" : "w-5 h-5"} ml-0.5 fill-current`} />
          </span>
        </div>
      )}

      {episode.duration && (
        <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-medium text-white">
          {episode.duration}
        </span>
      )}
    </div>
  );
}

export default function EpisodeCard({
  episode,
  onPlay,
}: {
  episode: Episode;
  onPlay: (episode: Episode) => void;
}) {
  const date = formatEpisodeDate(episode.publishedAt);
  const playable = !episode.isPlaceholder;

  return (
    <article
      className={`group flex flex-col h-full w-full min-w-0 bg-card rounded-2xl overflow-hidden border border-border
        transition-all duration-300 ${playable ? "cursor-pointer hover:shadow-xl" : ""}`}
      onClick={() => playable && onPlay(episode)}
    >
      <EpisodeThumbnail episode={episode} />

      <div className="flex flex-col flex-1 min-w-0 p-4 sm:p-5">
        <p className="text-[10px] uppercase tracking-widest text-primary mb-1 truncate">
          {formatEpisodeNumber(episode.number)} · {episode.category}
        </p>

        <h3 className="font-display text-foreground text-[16px] sm:text-[18px] leading-[1.35] mb-2 line-clamp-2 wrap-break-word group-hover:text-primary transition-colors duration-200">
          {playable ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onPlay(episode); }}
              className="text-left focus-visible:outline-none focus-visible:underline"
            >
              {episode.title}
            </button>
          ) : (
            episode.title
          )}
        </h3>

        {episode.description && (
          <p className="text-[13px] leading-relaxed text-muted-foreground line-clamp-2 mb-4">
            {episode.description}
          </p>
        )}

        <div className="flex items-center gap-2 min-w-0 pt-3 border-t border-border mt-auto">
          <span className="text-[11px] text-muted-foreground whitespace-nowrap truncate">
            {[date, episode.duration].filter(Boolean).join(" · ") || "Coming soon"}
          </span>
          {playable && (
            <span className="ml-auto inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary whitespace-nowrap">
              <Play className="w-3.5 h-3.5 fill-current" />
              Listen
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
