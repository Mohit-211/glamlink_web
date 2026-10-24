"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A row of cards that scrolls sideways: swiped on phones and tablets, stepped a
 * view at a time with the arrows beside it from lg up. The arrows show only when
 * the row is wider than its space. Children are the row's <li>s.
 */
export default function HomeCarousel({ label, children }: { label: string; children: ReactNode }) {
  const rowRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const update = () =>
      setEdges({
        start: row.scrollLeft <= 4,
        end: row.scrollLeft + row.clientWidth >= row.scrollWidth - 4,
      });
    update();
    row.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(row);
    return () => {
      row.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  const step = (direction: 1 | -1) => {
    const row = rowRef.current;
    if (!row) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollBy({ left: direction * row.clientWidth, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const scrolls = !(edges.start && edges.end);

  return (
    <div className="relative">
      <ul
        ref={rowRef}
        aria-label={label}
        className={cn(
          // Bleeds to the screen edge on phones; scroll-padding keeps the first card on the page gutter
          "no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2",
          "sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0"
        )}
      >
        {children}
      </ul>

      {scrolls && (
        <>
          <ArrowButton direction={-1} disabled={edges.start} onClick={() => step(-1)} />
          <ArrowButton direction={1} disabled={edges.end} onClick={() => step(1)} />
        </>
      )}
    </div>
  );
}

function ArrowButton({ direction, disabled, onClick }: { direction: 1 | -1; disabled: boolean; onClick: () => void }) {
  const Icon = direction === 1 ? ChevronRight : ChevronLeft;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 1 ? "Next" : "Previous"}
      className={cn(
        "absolute top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-medium transition-colors lg:flex",
        "not-disabled:hover:border-secondary not-disabled:hover:text-secondary disabled:opacity-40",
        direction === 1 ? "-right-5" : "-left-5"
      )}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
