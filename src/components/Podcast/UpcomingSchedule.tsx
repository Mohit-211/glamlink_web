"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// ─── Types ─────────────────────────────────────────────
export interface ScheduleEpisode {
  month: string;
  day: number;
  dayName: string;
  guest: string;
  company: string;
  platforms: string[];
  status: "dropping_soon" | "upcoming" | "tba" | "cover" | "live";
  note?: string;
}

// ─── Data (15+ items) ─────────────────────────────────
export const SCHEDULE: ScheduleEpisode[] = [
  {
    month: "APRIL",
    day: 27,
    dayName: "SUNDAY",
    guest: "Brianna Shaneybrook",
    company: "Omniluminous",
    platforms: ["YOUTUBE", "PODCAST", "GLAMLINK.NET"],
    status: "dropping_soon",
  },
  {
    month: "MAY",
    day: 4,
    dayName: "SUNDAY",
    guest: "Jessica Leigh",
    company: "The Legacy Collective",
    platforms: ["YOUTUBE", "PODCAST"],
    status: "upcoming",
  },
  {
    month: "MAY",
    day: 11,
    dayName: "SUNDAY",
    guest: "Sariah Yackee",
    company: "Marini Skin Solutions",
    platforms: ["YOUTUBE", "PODCAST"],
    status: "upcoming",
  },
  {
    month: "JUNE",
    day: 22,
    dayName: "SUNDAY",
    guest: "Stephani",
    company: "Nakedskn",
    platforms: ["YOUTUBE", "PODCAST"],
    status: "upcoming",
  },
  {
    month: "JUNE",
    day: 29,
    dayName: "SUNDAY",
    guest: "California Guest",
    company: "To Be Announced",
    platforms: ["SPECIAL EDITION"],
    status: "tba",
    note: "CALIFORNIA SESSIONS — COMING JUNE 29",
  },
  {
    month: "JULY",
    day: 6,
    dayName: "SUNDAY",
    guest: "Michael",
    company: "Philly Facial Surgery Issue Cover Feature",
    platforms: ["COVER FEATURE", "PRINT + DIGITAL"],
    status: "cover",
  },

  // EXTRA ITEMS
  {
    month: "JULY",
    day: 13,
    dayName: "SUNDAY",
    guest: "Ariana Cole",
    company: "SkinLab Studio",
    platforms: ["YOUTUBE", "PODCAST"],
    status: "upcoming",
  },
  {
    month: "JULY",
    day: 20,
    dayName: "SUNDAY",
    guest: "Daniel Cruz",
    company: "GlowTech Aesthetics",
    platforms: ["YOUTUBE"],
    status: "upcoming",
  },
  {
    month: "JULY",
    day: 27,
    dayName: "SUNDAY",
    guest: "Emily Rhodes",
    company: "Radiant Skin Co.",
    platforms: ["PODCAST"],
    status: "upcoming",
  },
  {
    month: "AUGUST",
    day: 3,
    dayName: "SUNDAY",
    guest: "Chris Walker",
    company: "Elite Derm Group",
    platforms: ["YOUTUBE"],
    status: "upcoming",
  },
  {
    month: "AUGUST",
    day: 10,
    dayName: "SUNDAY",
    guest: "Sophia Bennett",
    company: "Luxe Aesthetic Clinic",
    platforms: ["YOUTUBE", "SOCIAL"],
    status: "upcoming",
  },
  {
    month: "AUGUST",
    day: 17,
    dayName: "SUNDAY",
    guest: "Ryan Mitchell",
    company: "NextGen Skincare",
    platforms: ["PODCAST"],
    status: "upcoming",
  },
  {
    month: "AUGUST",
    day: 24,
    dayName: "SUNDAY",
    guest: "Isabella Moore",
    company: "Glow House",
    platforms: ["YOUTUBE"],
    status: "upcoming",
  },
  {
    month: "SEPTEMBER",
    day: 7,
    dayName: "SUNDAY",
    guest: "Liam Carter",
    company: "Advanced Aesthetics",
    platforms: ["SOCIAL"],
    status: "upcoming",
  },
  {
    month: "SEPTEMBER",
    day: 14,
    dayName: "SUNDAY",
    guest: "Olivia Harper",
    company: "Skin Revival Clinic",
    platforms: ["PODCAST"],
    status: "upcoming",
  },
];

// ─── Status Config ─────────────────────────────────────
const STATUS_CONFIG: Record<
  ScheduleEpisode["status"],
  { label: string; color: string; border: string }
> = {
  dropping_soon: {
    label: "DROPPING SOON",
    color: "hsl(184 70% 38%)",
    border: "hsl(184 70% 38%)",
  },
  live: {
    label: "LIVE",
    color: "#00ff9d",
    border: "#00ff9d",
  },
  upcoming: {
    label: "UPCOMING",
    color: "rgba(255,255,255,0.6)",
    border: "rgba(255,255,255,0.2)",
  },
  tba: {
    label: "TBA",
    color: "rgba(255,255,255,0.6)",
    border: "rgba(255,255,255,0.2)",
  },
  cover: {
    label: "COVER",
    color: "#f4c27a",
    border: "#f4c27a",
  },
};

// ─── Component ─────────────────────────────────────────
export default function UpcomingSchedule() {
  const [visibleCount, setVisibleCount] = useState(10);

  const visibleData = SCHEDULE.slice(0, visibleCount);

  return (
    <section
      style={{
        background:
          "radial-gradient(circle at top, hsl(184 45% 30%) 0%, hsl(184 50% 18%) 100%)",
        padding: "60px 0" ,marginTop: "60px",
      }}
    >
      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 mb-10">
        <h2 className="text-4xl text-white font-light">
          Upcoming <em>Episodes</em>
        </h2>
      </div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto px-6 space-y-5">
        {visibleData.map((ep, i) => {
          const cfg = STATUS_CONFIG[ep.status];

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl p-[1px] bg-white/10"
            >
              <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 flex justify-between flex-col md:flex-row gap-6 border border-white/10">

                {/* LEFT */}
                <div className="flex gap-5">
                  <div>
                    <div className="text-xs text-white/50">{ep.month}</div>
                    <div className="text-4xl text-white">{ep.day}</div>
                    <div className="text-xs text-white/40">{ep.dayName}</div>
                  </div>

                  <div>
                    <h3 className="text-xl text-white">{ep.guest}</h3>
                    <p className="text-xs text-white/50">{ep.company}</p>

                    <div className="flex gap-2 mt-2 flex-wrap">
                      {ep.platforms.map((p) => (
                        <span
                          key={p}
                          className="text-[10px] px-2 py-1 border border-white/20 rounded-full text-white/60"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center justify-between md:flex-col md:items-end gap-3">
                  <span
                    className="text-xs px-3 py-1 rounded-full"
                    style={{
                      color: cfg.color,
                      border: `1px solid ${cfg.border}`,
                    }}
                  >
                    {cfg.label}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Load More */}
      {visibleCount < SCHEDULE.length && (
        <div className="text-center mt-10">
          <button
            onClick={() => setVisibleCount((prev) => prev + 10)}
            className="px-6 py-2 border border-white/20 text-white rounded-full hover:bg-white/10 transition"
          >
            Load More
          </button>
        </div>
      )}
    </section>
  );
}