"use client";

import { useEffect, useRef, useState } from "react";
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

function AvatarCircle({
  name,
  index,
}: {
  name: string;
  index: number;
}) {
  const palettes = [
    { bg: "hsl(184 50% 88%)", text: "hsl(184 70% 28%)" },
    { bg: "hsl(280 40% 90%)", text: "hsl(280 60% 35%)" },
    { bg: "hsl(30 50% 90%)", text: "hsl(30 70% 30%)" },
    { bg: "hsl(340 50% 90%)", text: "hsl(340 60% 35%)" },
    { bg: "hsl(200 50% 88%)", text: "hsl(200 70% 28%)" },
  ];

  const p = palettes[index % palettes.length];

  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-[12px] font-bold"
      style={{ background: p.bg, color: p.text }}
    >
      {getInitials(name)}
    </div>
  );
}

export default function UpcomingSchedule() {
  const [visible, setVisible] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const ref = useRef<HTMLDivElement>(null);

  const shownItems = schedule.slice(0, visibleCount);
  const hasMore = visibleCount < schedule.length;

  useEffect(() => {
    fetchPodcast();
  }, []);

  const fetchPodcast = async () => {
    try {
      setLoading(true);

      const response = await getAllPodcast();
console.log(response,"response=====")
      setSchedule(response?.data || []);
    } catch (error) {
      console.error("Podcast fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="py-10 text-center text-sm text-gray-500">
        Loading schedule...
      </div>
    );
  }

  return (
    <section
      ref={ref}
      className="relative"
      style={{
        fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
      }}
    >
      <div
        className="divide-y"
        style={{ borderColor: "hsl(204 14% 92%)" }}
      >
        {shownItems.map((item, i) => (
          <div
            key={item.id}
            className="px-5 py-4 transition-all duration-200 cursor-default"
            style={{
              // opacity: visible ? 1 : 0,
              transform: visible
                ? "translateY(0)"
                : "translateY(10px)",
              transition: `opacity 0.45s ease ${i * 70
                }ms, transform 0.45s ease ${i * 70
                }ms, background 0.15s ease`,
              background:
                hoveredIndex === i
                  ? "hsl(184 40% 97%)"
                  : "white",
            }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-start gap-3">
              <AvatarCircle
                name={item.name}
                index={i}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p
                    className="text-[13px] font-semibold leading-tight truncate"
                    style={{
                      color: "hsl(210 30% 10%)",
                    }}
                  >
                    {item.name}
                  </p>

                  <span
                    className="text-[9px] tracking-[0.15em] uppercase font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{
                      background: "hsl(184 50% 92%)",
                      color: "hsl(184 70% 28%)",
                    }}
                  >
                    {formatDate(item.schedule_date)}
                  </span>
                </div>

                <p
                  className="text-[12px] leading-snug mb-2"
                  style={{
                    color: "hsl(210 15% 42%)",
                  }}
                >
                  {item.short_description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{
          borderTop: "1px solid hsl(204 14% 92%)",
          background: "hsl(204 18% 98%)",
        }}
      >
        <p
          className="text-[10px]"
          style={{ color: "hsl(210 12% 60%)" }}
        >
          {shownItems.length} of {schedule.length} episodes
        </p>

        {hasMore ? (
          <button
            type="button"
            onClick={() =>
              setVisibleCount((c) =>
                Math.min(c + PAGE_SIZE, schedule.length)
              )
            }
            className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide transition-all duration-150 hover:opacity-70"
            style={{ color: "hsl(184 70% 35%)" }}
          >
            Load{" "}
            {Math.min(
              PAGE_SIZE,
              schedule.length - visibleCount
            )}{" "}
            more

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="w-3 h-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        ) : schedule.length > PAGE_SIZE ? (
          <button
            type="button"
            onClick={() => setVisibleCount(PAGE_SIZE)}
            className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide transition-all duration-150 hover:opacity-70"
            style={{ color: "hsl(210 12% 55%)" }}
          >
            Show less

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="w-3 h-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
        ) : null}
      </div>
    </section>
  );
}