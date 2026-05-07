"use client";
import { useState } from "react";

const BRAND = "#1FA8B2";
const BRAND_DARK = "#157a82";
const BRAND_LIGHT = "#e4f6f8";

interface HeroSectionProps {
  onGuestClick: () => void;
}

export default function HeroSection({ onGuestClick }: HeroSectionProps) {
  const [suggestHovered, setSuggestHovered] = useState(false);
  const [subscribeHovered, setSubscribeHovered] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    window.open("https://mailchi.mp/glamlink/subscribe", "_blank");
  };

  return (
    <section
      style={{
        background: "#fff",
        borderBottom: "0.5px solid #d0e8ea",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: "3rem",
        }}
      >
        {/* Text content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Eyebrow */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: BRAND_LIGHT,
              border: `0.5px solid ${BRAND}`,
              borderRadius: "100px",
              padding: "4px 14px",
              marginBottom: "1.25rem",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: BRAND,
                display: "inline-block",
                animation: "heroPulse 2s ease-in-out infinite",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "clamp(9px, 2vw, 10px)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: BRAND_DARK,
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              New Episode Every Week
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(32px, 7vw, 62px)",
              fontWeight: 300,
              lineHeight: 1.05,
              color: "#0f1a14",
              marginBottom: "1.25rem",
            }}
          >
            The Beauty{" "}
            <em style={{ fontStyle: "italic", color: BRAND }}>Vault</em>
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: "clamp(13px, 2vw, 15px)",
              lineHeight: 1.7,
              color: "#4a5e55",
              maxWidth: "480px",
              marginBottom: "2rem",
            }}
          >
            Unfiltered conversations with the professionals, founders, and
            innovators actively shaping the future of beauty and wellness.
          </p>

          {/* CTAs */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              marginBottom: "2.5rem",
            }}
          >
            <button
              onClick={onGuestClick}
              style={{
                background: suggestHovered ? BRAND_DARK : BRAND,
                color: "#fff",
                padding: "clamp(0.6rem, 2vw, 0.7rem) clamp(1.2rem, 4vw, 1.75rem)",
                borderRadius: "100px",
                fontSize: "clamp(10px, 2vw, 11px)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                transition: "background 0.2s, transform 0.15s",
                transform: suggestHovered ? "translateY(-1px)" : "none",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={() => setSuggestHovered(true)}
              onMouseLeave={() => setSuggestHovered(false)}
            >
              Apply to be a guest
            </button>
            <button
              style={{
                background: subscribeHovered ? BRAND_LIGHT : "transparent",
                color: BRAND,
                padding: "clamp(0.6rem, 2vw, 0.7rem) clamp(1.2rem, 4vw, 1.75rem)",
                borderRadius: "100px",
                fontSize: "clamp(10px, 2vw, 11px)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 700,
                border: `1.5px solid ${BRAND}`,
                cursor: "pointer",
                transition: "background 0.2s, transform 0.15s",
                transform: subscribeHovered ? "translateY(-1px)" : "none",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={() => setSubscribeHovered(true)}
              onMouseLeave={() => setSubscribeHovered(false)}
              onClick={handleSubscribe}
            >
              Subscribe
            </button>
          </div>

        
        </div>
      </div>

      <style>{`
        @keyframes heroPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }

        @media (max-width: 480px) {
          /* Stack stats vertically on very small screens */
        }
      `}</style>
    </section>
  );
}