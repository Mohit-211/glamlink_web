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
  { date: "MAY 4", day: "SUNDAY", guest: "Dr. Alexis Granite", topic: "Skin Longevity & the Science of Aging Gracefully", availableOn: ["YouTube", "Spotify", "Apple"] },
  { date: "MAY 11", day: "SUNDAY", guest: "Tara Miller", topic: "Building a 7-Figure Esthetics Business From Scratch", availableOn: ["YouTube", "Spotify", "Apple"] },
  { date: "MAY 18", day: "SUNDAY", guest: "Camille Noir", topic: "Fragrance as Identity: The Art of Scent Branding", availableOn: ["YouTube", "Spotify", "Apple"] },
  { date: "MAY 25", day: "SUNDAY", guest: "TBA", topic: "Wellness Rituals from Around the World", availableOn: ["YouTube", "Spotify", "Apple"] },
  { date: "JUN 1", day: "SUNDAY", guest: "Priya Desai", topic: "Ayurvedic Beauty: Ancient Secrets for Modern Skin", availableOn: ["YouTube", "Spotify", "Apple"] },
  { date: "JUN 8", day: "SUNDAY", guest: "Sofia Reyes", topic: "From Chair to CEO: Opening Your Own Salon Suite", availableOn: ["YouTube", "Spotify", "Apple"] },
  { date: "JUN 15", day: "SUNDAY", guest: "Dr. Naomi Kwon", topic: "The Truth About Laser Treatments & Skin of Color", availableOn: ["YouTube", "Spotify", "Apple"] },
  { date: "JUN 22", day: "SUNDAY", guest: "Jade Fontaine", topic: "Clean Beauty Myths Debunked by a Cosmetic Chemist", availableOn: ["YouTube", "Spotify", "Apple"] },
  { date: "JUN 29", day: "SUNDAY", guest: "TBA", topic: "Summer Skin Survival: Heat, Humidity & SPF", availableOn: ["YouTube", "Spotify", "Apple"] },
  { date: "JUL 6", day: "SUNDAY", guest: "Marcus Bell", topic: "Men's Grooming in the Age of Skincare Culture", availableOn: ["YouTube", "Spotify", "Apple"] },
];

const PAGE_SIZE = 4;

const PLATFORM_CONFIG: Record<string, { color: string; dot: string }> = {
  YouTube: { color: "hsl(0 72% 50%)", dot: "#ff0000" },
  Spotify: { color: "hsl(141 73% 36%)", dot: "#1DB954" },
  Apple: { color: "hsl(280 60% 50%)", dot: "#9B59B6" },
};

function getInitials(name: string) {
  if (name === "TBA") return "?";
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function AvatarCircle({ name, index }: { name: string; index: number }) {
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

export default function UpcomingSchedule2() {
  const [visible, setVisible] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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
      className="relative"
      style={{ fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif" }}
    >
      {/* Schedule list */}
      <div className="divide-y" style={{ borderColor: "hsl(204 14% 92%)" }}>
        {shownItems.map((item, i) => (
          <div
            key={i}
            className="px-5 py-4 transition-all duration-200 cursor-default"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(10px)",
              transition: `opacity 0.45s ease ${i * 70}ms, transform 0.45s ease ${i * 70}ms, background 0.15s ease`,
              background: hoveredIndex === i ? "hsl(184 40% 97%)" : "white",
            }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <AvatarCircle name={item.guest} index={i} />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p
                    className="text-[13px] font-semibold leading-tight truncate"
                    style={{
                      color: item.guest === "TBA" ? "hsl(210 12% 58%)" : "hsl(210 30% 10%)",
                      fontStyle: item.guest === "TBA" ? "italic" : "normal",
                    }}
                  >
                    {item.guest}
                  </p>
                  {/* Date pill */}
                  <span
                    className="text-[9px] tracking-[0.15em] uppercase font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: "hsl(184 50% 92%)", color: "hsl(184 70% 28%)" }}
                  >
                    {item.date}
                  </span>
                </div>
                <p className="text-[12px] leading-snug mb-2" style={{ color: "hsl(210 15% 42%)" }}>
                  {item.topic}
                </p>

                {/* Platform dots */}
                <div className="flex items-center gap-1.5">
                  {item.availableOn.map((p) => (
                    <span
                      key={p}
                      className="flex items-center gap-1 text-[9px] tracking-wide font-semibold"
                      style={{ color: PLATFORM_CONFIG[p]?.color ?? "hsl(210 12% 50%)" }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full inline-block"
                        style={{ background: PLATFORM_CONFIG[p]?.dot ?? "currentColor" }}
                      />
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More / Show Less footer */}
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{ borderTop: "1px solid hsl(204 14% 92%)", background: "hsl(204 18% 98%)" }}
      >
        <p className="text-[10px]" style={{ color: "hsl(210 12% 60%)" }}>
          {shownItems.length} of {SCHEDULE.length} episodes
        </p>

        {hasMore ? (
          <button
            type="button"
            onClick={() => setVisibleCount((c) => Math.min(c + PAGE_SIZE, SCHEDULE.length))}
            className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide transition-all duration-150 hover:opacity-70"
            style={{ color: "hsl(184 70% 35%)" }}
          >
            Load {Math.min(PAGE_SIZE, SCHEDULE.length - visibleCount)} more
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        ) : SCHEDULE.length > PAGE_SIZE ? (
          <button
            type="button"
            onClick={() => setVisibleCount(PAGE_SIZE)}
            className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide transition-all duration-150 hover:opacity-70"
            style={{ color: "hsl(210 12% 55%)" }}
          >
            Show less
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>
        ) : null}
      </div>
    </section>
  );
}