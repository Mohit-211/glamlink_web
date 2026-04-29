"use client";
import { useEffect, useRef, useState } from "react";

interface ScheduleItem {
  date: string;
  day: string;
  guest: string;
  topic: string;
  availableOn: string[];
}

const SCHEDULE: ScheduleItem[] = [
  {
    date: "MAY 4",
    day: "SUNDAY",
    guest: "Dr. Alexis Granite",
    topic: "Skin Longevity & the Science of Aging Gracefully",
    availableOn: ["YouTube", "Spotify", "Apple"],
  },
  {
    date: "MAY 11",
    day: "SUNDAY",
    guest: "Tara Miller",
    topic: "Building a 7-Figure Esthetics Business From Scratch",
    availableOn: ["YouTube", "Spotify", "Apple"],
  },
  {
    date: "MAY 18",
    day: "SUNDAY",
    guest: "Camille Noir",
    topic: "Fragrance as Identity: The Art of Scent Branding",
    availableOn: ["YouTube", "Spotify", "Apple"],
  },
  {
    date: "MAY 25",
    day: "SUNDAY",
    guest: "TBA",
    topic: "Wellness Rituals from Around the World",
    availableOn: ["YouTube", "Spotify", "Apple"],
  },
  {
    date: "JUN 1",
    day: "SUNDAY",
    guest: "Priya Desai",
    topic: "Ayurvedic Beauty: Ancient Secrets for Modern Skin",
    availableOn: ["YouTube", "Spotify", "Apple"],
  },
  {
    date: "JUN 8",
    day: "SUNDAY",
    guest: "Sofia Reyes",
    topic: "From Chair to CEO: Opening Your Own Salon Suite",
    availableOn: ["YouTube", "Spotify", "Apple"],
  },
  {
    date: "JUN 15",
    day: "SUNDAY",
    guest: "Dr. Naomi Kwon",
    topic: "The Truth About Laser Treatments & Skin of Color",
    availableOn: ["YouTube", "Spotify", "Apple"],
  },
  {
    date: "JUN 22",
    day: "SUNDAY",
    guest: "Jade Fontaine",
    topic: "Clean Beauty Myths Debunked by a Cosmetic Chemist",
    availableOn: ["YouTube", "Spotify", "Apple"],
  },
  {
    date: "JUN 29",
    day: "SUNDAY",
    guest: "TBA",
    topic: "Summer Skin Survival: Heat, Humidity & SPF",
    availableOn: ["YouTube", "Spotify", "Apple"],
  },
  {
    date: "JUL 6",
    day: "SUNDAY",
    guest: "Marcus Bell",
    topic: "Men's Grooming in the Age of Skincare Culture",
    availableOn: ["YouTube", "Spotify", "Apple"],
  },
];

const PAGE_SIZE = 4;

const PlatformBadge = ({ name }: { name: string }) => {
  const colors: Record<string, string> = {
    YouTube: "hsl(0 72% 50%)",
    Spotify: "hsl(141 73% 42%)",
    Apple: "hsl(280 60% 55%)",
  };
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] tracking-[0.12em] uppercase font-semibold text-white mr-1.5"
      style={{ background: colors[name] ?? "hsl(210 30% 40%)" }}
    >
      {name}
    </span>
  );
};

export default function UpcomingSchedule() {
  const [visible, setVisible] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const ref = useRef<HTMLDivElement>(null);

  const shownItems = SCHEDULE.slice(0, visibleCount);
  const hasMore = visibleCount < SCHEDULE.length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: "hsl(184 52% 38%)",
        fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
      }}
    >
      {/* Watermark "VAULT" text */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-end pr-6 select-none"
        aria-hidden
      >
        <span
          className="text-[clamp(80px,18vw,200px)] font-bold leading-none tracking-tight"
          style={{
            color: "hsl(184 52% 44%)",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            opacity: 0.45,
            userSelect: "none",
          }}
        >
          VAULT
        </span>
      </div>

      {/* Subtle grid texture overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 39px, hsl(184 52% 36% / 0.25) 39px, hsl(184 52% 36% / 0.25) 40px)",
          opacity: 0.4,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p
              className="text-[9px] tracking-[0.3em] uppercase font-semibold mb-3"
              style={{ color: "hsl(184 90% 78%)" }}
            >
              What's Coming Up
            </p>
            <h2
              className="text-[clamp(26px,4vw,42px)] font-semibold leading-tight"
              style={{
                color: "hsl(0 0% 98%)",
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
                letterSpacing: "-0.01em",
              }}
            >
              Upcoming Episodes
            </h2>
          </div>
          <p
            className="text-[10px] tracking-[0.2em] uppercase hidden md:block"
            style={{ color: "hsl(184 50% 75%)" }}
          >
            New episodes every Sunday
          </p>
        </div>

        {/* Schedule Table */}
        <div className="overflow-x-auto -mx-2">
          <table className="w-full min-w-[580px]">
            <thead>
              <tr>
                {["Date", "Guest", "Topic", "Available On"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-[9px] tracking-[0.25em] uppercase font-medium pb-3 pr-8 last:pr-0"
                    style={{
                      color: "hsl(184 50% 72%)",
                      borderBottom: "1px solid hsl(184 40% 48%)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shownItems.map((item, i) => (
                <tr
                  key={i}
                  className="group transition-all duration-300"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(12px)",
                    transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms`,
                    borderBottom: "1px solid hsl(184 40% 44%)",
                  }}
                >
                  {/* Date */}
                  <td className="py-5 pr-8 align-top">
                    <div>
                      <p
                        className="text-[15px] font-semibold leading-tight"
                        style={{ color: "hsl(0 0% 98%)" }}
                      >
                        {item.date}
                      </p>
                      <p
                        className="text-[9px] tracking-[0.18em] uppercase mt-0.5"
                        style={{ color: "hsl(184 50% 72%)" }}
                      >
                        {item.day}
                      </p>
                    </div>
                  </td>

                  {/* Guest */}
                  <td className="py-5 pr-8 align-top">
                    <p
                      className="text-[14px] font-medium"
                      style={{
                        color: item.guest === "TBA" ? "hsl(184 50% 72%)" : "hsl(0 0% 98%)",
                        fontStyle: item.guest === "TBA" ? "italic" : "normal",
                      }}
                    >
                      {item.guest}
                    </p>
                  </td>

                  {/* Topic */}
                  <td className="py-5 pr-8 align-top max-w-[260px]">
                    <p
                      className="text-[13px] leading-snug"
                      style={{ color: "hsl(184 30% 84%)" }}
                    >
                      {item.topic}
                    </p>
                  </td>

                  {/* Platforms */}
                  <td className="py-5 align-top">
                    <div className="flex flex-wrap gap-y-1">
                      {item.availableOn.map((p) => (
                        <PlatformBadge key={p} name={p} />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom note */}
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p
            className="text-[10px] tracking-[0.15em] uppercase"
            style={{ color: "hsl(184 40% 65%)" }}
          >
            ✦ Schedule subject to change — follow us for live updates
          </p>

          {hasMore && (
            <button
              type="button"
              onClick={() => setVisibleCount((c) => Math.min(c + PAGE_SIZE, SCHEDULE.length))}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] tracking-[0.18em] uppercase font-semibold transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 shrink-0"
              style={{
                background: "hsl(184 50% 30% / 0.6)",
                border: "1px solid hsl(184 50% 52% / 0.45)",
                color: "hsl(0 0% 96%)",
                backdropFilter: "blur(4px)",
              }}
            >
              Load More
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              <span style={{ color: "hsl(184 60% 72%)" }}>
                {SCHEDULE.length - visibleCount} more
              </span>
            </button>
          )}

          {!hasMore && SCHEDULE.length > PAGE_SIZE && (
            <button
              type="button"
              onClick={() => setVisibleCount(PAGE_SIZE)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] tracking-[0.18em] uppercase font-semibold transition-all duration-200 hover:brightness-110 shrink-0"
              style={{
                background: "transparent",
                border: "1px solid hsl(184 50% 52% / 0.35)",
                color: "hsl(184 50% 72%)",
              }}
            >
              Show Less
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}