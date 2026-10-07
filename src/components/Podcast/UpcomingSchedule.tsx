"use client";

import { useEffect, useState } from "react";
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
  const date = isDateOnly ? new Date(`${dateString}T00:00:00`) : new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function UpcomingSchedule() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const shownItems = schedule.slice(0, visibleCount);
  const hasMore = visibleCount < schedule.length;

  useEffect(() => {
    getAllPodcast()
      .then((response) => setSchedule(response?.data || []))
      .catch((error) => console.error("Podcast fetch error:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="divide-y divide-border">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-start gap-3 px-5 py-4">
            <div className="w-9 h-9 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
              <div className="h-3 w-5/6 rounded bg-muted animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (schedule.length === 0) {
    return (
      <p className="px-5 py-10 text-center text-sm text-muted-foreground">
        New guests are announced every week. Check back soon.
      </p>
    );
  }

  return (
    <div>
      <div className="divide-y divide-border">
        {shownItems.map((item) => (
          <div key={item.id} className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-accent/50">
            <div className="w-9 h-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center shrink-0 text-[12px] font-semibold">
              {getInitials(item.name)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <p className="text-sm font-semibold leading-tight text-foreground truncate">
                  {item.name}
                </p>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-primary shrink-0">
                  {formatDate(item.schedule_date)}
                </span>
              </div>
              <p className="text-[13px] leading-snug text-muted-foreground">
                {item.short_description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {schedule.length > PAGE_SIZE && (
        <div className="px-5 py-3 flex items-center justify-between border-t border-border">
          <p className="text-[11px] text-muted-foreground">
            {shownItems.length} of {schedule.length} upcoming
          </p>
          {hasMore ? (
            <button
              type="button"
              onClick={() => setVisibleCount((c) => Math.min(c + PAGE_SIZE, schedule.length))}
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary hover:opacity-80 transition-opacity"
            >
              Show more
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setVisibleCount(PAGE_SIZE)}
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Show less
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
