"use client";
import { useEffect, useState } from "react";

// ─── Platform Icons ───────────────────────────────────────────────────────────
const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

const ApplePodcastsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M5.34 0A5.328 5.328 0 0 0 0 5.34v13.32A5.328 5.328 0 0 0 5.34 24h13.32A5.328 5.328 0 0 0 24 18.66V5.34A5.328 5.328 0 0 0 18.66 0zm7.006 2.06c3.106 0 5.633 1.02 7.585 3.026 1.773 1.802 2.7 4.198 2.7 6.942 0 5.747-3.9 9.847-9.378 9.847-5.478 0-9.385-4.1-9.385-9.847 0-2.744.927-5.14 2.7-6.942 1.958-2.006 4.477-3.026 7.583-3.026zm0 1.99c-2.617 0-4.73.882-6.228 2.55-1.397 1.558-2.13 3.64-2.13 5.993 0 4.835 3.136 7.96 7.758 7.96 4.623 0 7.752-3.125 7.752-7.96 0-2.354-.733-4.435-2.13-5.993-1.498-1.668-3.61-2.55-6.22-2.55zm.008 3.08c1.65 0 2.99 1.34 2.99 2.99s-1.34 2.99-2.99 2.99-2.99-1.34-2.99-2.99 1.34-2.99 2.99-2.99zm0 1.5a1.49 1.49 0 1 0 0 2.98 1.49 1.49 0 0 0 0-2.98zm0 4.79c2.26 0 4.09 1.83 4.09 4.09h-1.5a2.59 2.59 0 0 0-2.59-2.59 2.59 2.59 0 0 0-2.59 2.59H9.264c0-2.26 1.83-4.09 4.09-4.09z" />
  </svg>
);

// ─── Animated sound wave bars ─────────────────────────────────────────────────
function SoundWave() {
  return (
    <div className="flex items-end gap-[3px] h-6" aria-hidden>
      {[0.6, 1, 0.75, 0.45, 0.9, 0.55, 1, 0.7, 0.4, 0.85, 0.6, 0.95].map((h, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full"
          style={{
            height: `${h * 100}%`,
            background: "hsl(184 90% 78%)",
            opacity: 0.7,
            animation: `soundBar 1.2s ease-in-out ${i * 0.08}s infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes soundBar {
          from { transform: scaleY(0.3); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}

// ─── Floating decorative gem/diamond shape ─────────────────────────────────────
function DiamondAccent({ className = "", size = 8, opacity = 0.18 }: { className?: string; size?: number; opacity?: number }) {
  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: "hsl(184 90% 85%)",
        opacity,
        transform: "rotate(45deg)",
        borderRadius: 1,
      }}
    />
  );
}

// ─── Main Hero ────────────────────────────────────────────────────────────────
export default function HeroSection({ onGuestClick }: { onGuestClick?: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // tiny delay so CSS transitions fire after first paint
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const fade = (delay: number) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
  });

  return (
    <header
      className="relative overflow-hidden"
      style={{
        background: "hsl(184 50% 36%)",
        fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
        minHeight: "clamp(440px, 56vw, 620px)",
      }}
    >
      {/* ── Background texture: horizontal lines ───────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 39px, hsl(184 50% 34% / 0.35) 39px, hsl(184 50% 34% / 0.35) 40px)",
        }}
      />

      {/* ── Radial glow centre-right ────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 65% at 68% 50%, hsl(184 80% 52% / 0.18) 0%, transparent 70%)",
        }}
      />

      {/* ── Giant watermark ────────────────────────────────────────────── */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none pr-4 md:pr-8 leading-none"
        aria-hidden
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(90px, 20vw, 220px)",
          fontWeight: 700,
          color: "hsl(184 50% 42%)",
          opacity: 0.55,
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        VAULT
      </div>

      {/* ── Diamond scatter ────────────────────────────────────────────── */}
      <DiamondAccent className="top-10 left-[38%]" size={7} opacity={0.22} />
      <DiamondAccent className="top-1/3 left-[22%]" size={5} opacity={0.15} />
      <DiamondAccent className="bottom-14 left-[55%]" size={9} opacity={0.14} />
      <DiamondAccent className="bottom-8 left-[30%]" size={5} opacity={0.18} />
      <DiamondAccent className="top-8 left-[60%]" size={6} opacity={0.12} />

      {/* ── Content ────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-14 pb-16 flex flex-col justify-center h-full">

        {/* Pill tag */}
        <div style={fade(0)}>
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] tracking-[0.28em] uppercase font-semibold mb-7"
            style={{
              background: "hsl(184 50% 30% / 0.55)",
              color: "hsl(184 90% 82%)",
              border: "1px solid hsl(184 50% 48% / 0.4)",
              backdropFilter: "blur(4px)",
            }}
          >
            <SoundWave />
            Beauty · Wellness · No Filter
          </span>
        </div>

        {/* Main title */}
        <div style={fade(120)}>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(48px, 9vw, 104px)",
              fontWeight: 600,
              color: "hsl(0 0% 98%)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              marginBottom: "0.15em",
            }}
          >
            The Beauty
          </h1>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(48px, 9vw, 104px)",
              fontWeight: 600,
              fontStyle: "italic",
              color: "hsl(0 0% 98%)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              marginBottom: "clamp(20px, 3vw, 36px)",
            }}
          >
            Vault
          </h1>
        </div>

        {/* Divider line */}
        <div style={fade(200)}>
          <div
            style={{
              width: "clamp(48px, 8vw, 72px)",
              height: 1,
              background: "hsl(184 70% 72%)",
              marginBottom: "clamp(16px, 2.5vw, 28px)",
              opacity: 0.7,
            }}
          />
        </div>

        {/* Hosted by + tagline */}
        <div style={fade(280)}>
          <p
            className="text-[11px] tracking-[0.22em] uppercase mb-1.5"
            style={{ color: "hsl(184 60% 78%)" }}
          >
            Hosted by
          </p>
          <p
            className="font-medium mb-5"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(18px, 2.8vw, 26px)",
              color: "hsl(0 0% 96%)",
              letterSpacing: "0.01em",
              fontStyle: "italic",
            }}
          >
            Marie Matteucci
          </p>
          <p
            className="text-[11px] tracking-[0.2em] uppercase"
            style={{ color: "hsl(184 50% 72%)" }}
          >
            New episodes every Sunday
          </p>
        </div>

        {/* CTA buttons */}
        <div
          className="flex flex-wrap gap-3 mt-10"
          style={fade(380)}
        >
          <a
            href="https://www.youtube.com/playlist?list=PLJPmuOJKw5YbrNAxnyi7SuQx9gNisadgY"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] tracking-[0.12em] uppercase font-semibold text-white transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5"
            style={{ background: "hsl(184 70% 41%)", border: "1px solid hsl(184 70% 50%)" }}
          >
            <YouTubeIcon /> Watch on YouTube
          </a>
          <a
            href="https://open.spotify.com/show/0GEWcvRT3PFalAaN2faX4z"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] tracking-[0.12em] uppercase font-semibold transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: "transparent",
              border: "1px solid hsl(184 50% 55% / 0.5)",
              color: "hsl(0 0% 94%)",
            }}
          >
            <SpotifyIcon /> Spotify
          </a>
          <a
            href="https://podcasts.apple.com/us/podcast/the-beauty-vault/id1885669168"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] tracking-[0.12em] uppercase font-semibold transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: "transparent",
              border: "1px solid hsl(184 50% 55% / 0.5)",
              color: "hsl(0 0% 94%)",
            }}
          >
            <ApplePodcastsIcon /> Apple Podcasts
          </a>
          <button
            type="button"
            onClick={onGuestClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] tracking-[0.12em] uppercase font-semibold text-white transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5"
            style={{
              background: "hsl(340 65% 52%)",
              border: "1px solid hsl(340 65% 62%)",
              boxShadow: "0 2px 12px hsl(340 65% 52% / 0.35)",
            }}
          >
            ✦ Wanna Be a Guest?
          </button>
        </div>
      </div>

      {/* ── Bottom fade into next section ──────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent, hsl(184 52% 38% / 0.6))",
        }}
      />
    </header>
  );
}