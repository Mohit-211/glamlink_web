"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getAllPodcast } from "@/api/Api";


interface ScheduleItem {
  id: number;
  name: string;
  schedule_date: string;
  short_description: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  is_active?: boolean;
}

const PAGE_SIZE = 4;

function getInitials(name: string) {
  if (!name || name === "TBA") return "?";

  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(dateString: string) {
  if (!dateString) return "";

  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateString);

  const date = isDateOnly
    ? new Date(`${dateString}T00:00:00`)
    : new Date(dateString);

  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}


function AvatarCircle({ name }: { name: string }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
      {getInitials(name)}
    </div>
  );
}

export default function UpcomingSchedule() {
  const [visible, setVisible] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const ref = useRef<HTMLDivElement>(null);

  const shownItems = schedule.slice(0, visibleCount);
  const hasMore = visibleCount < schedule.length;

  const fetchPodcast = async () => {
    try {
      setLoading(true);

      const response = await getAllPodcast();
      setSchedule(response?.data || []);
    } catch (error) {
      console.error("Podcast fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPodcast();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);


  if (loading) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        Loading schedule...
      </div>
    );
  }

  if (schedule.length === 0) {
    return (
      <p className="px-5 py-6 text-center text-xs text-muted-foreground">
        No upcoming episodes scheduled yet.
      </p>
    );
  }

  return (
    <section ref={ref} className="relative">
      <div className="divide-y divide-border">
        {shownItems.map((item, i) => (
          <div
            key={item.id}
            className={`px-5 py-4 transition-all duration-500 ease-out hover:bg-accent/40 ${
              visible ? "translate-y-0" : "translate-y-2.5"
            }`}
            style={{ transitionDelay: `${i * 70}ms` }}
          >
            <div className="flex items-start gap-3">
              <AvatarCircle name={item.name} />

              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center justify-between gap-2">
                  <p className="truncate text-[13px] font-semibold leading-tight text-foreground">{item.name}</p>
                  <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-accent-foreground">
                    {formatDate(item.schedule_date)}
                  </span>
                </div>
                <p className="mb-2 text-xs leading-snug text-muted-foreground">{item.short_description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border bg-muted/40 px-5 py-3">
        <p className="text-[10px] text-muted-foreground">
          {shownItems.length} of {schedule.length} episodes
        </p>

        {hasMore ? (
          <button
            type="button"
            onClick={() => setVisibleCount((c) => Math.min(c + PAGE_SIZE, schedule.length))}
            className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-primary transition-opacity hover:opacity-70"
          >
            Load {Math.min(PAGE_SIZE, schedule.length - visibleCount)} more
            <ChevronDown className="h-3 w-3" strokeWidth={2.5} />
          </button>
        ) : schedule.length > PAGE_SIZE ? (
          <button
            type="button"
            onClick={() => setVisibleCount(PAGE_SIZE)}
            className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground transition-opacity hover:opacity-70"
          >
            Show less
            <ChevronUp className="h-3 w-3" strokeWidth={2.5} />
          </button>
        ) : null}
      </div>
    </section>
  );
}
