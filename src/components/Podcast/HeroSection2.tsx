"use client";
import { useState } from "react";

const BRAND = "#1FA8B2";
const BRAND_DARK = "#157a82";
const BRAND_LIGHT = "#e4f6f8";

interface HeroSection2Props {
  onGuestClick: () => void;
}

export default function HeroSection2({ onGuestClick }: HeroSection2Props) {
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
        padding: "3.5rem 1.5rem 3rem",
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
        <div style={{ flex: 1 }}>
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
              }}
            />
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: BRAND_DARK,
                fontWeight: 600,
              }}
            >
              New Episode Every Week
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(40px, 5vw, 62px)",
              fontWeight: 300,
              lineHeight: 1.05,
              color: "#0f1a14",
              marginBottom: "1.25rem",
            }}
          >
            The Beauty{" "}
            <em
              style={{
                fontStyle: "italic",
                color: BRAND,
              }}
            >
              Vault
            </em>
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: "15px",
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
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
            <button
              onClick={onGuestClick}
              style={{
                background: suggestHovered ? BRAND_DARK : BRAND,
                color: "#fff",
                padding: "0.7rem 1.75rem",
                borderRadius: "100px",
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                transition: "background 0.2s, transform 0.15s",
                transform: suggestHovered ? "translateY(-1px)" : "none",
              }}
              onMouseEnter={() => setSuggestHovered(true)}
              onMouseLeave={() => setSuggestHovered(false)}
            >
              Suggest a Guest
            </button>
            <button
              style={{
                background: subscribeHovered ? BRAND_LIGHT : "transparent",
                color: BRAND,
                padding: "0.7rem 1.75rem",
                borderRadius: "100px",
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 700,
                border: `1.5px solid ${BRAND}`,
                cursor: "pointer",
                transition: "background 0.2s, transform 0.15s",
                transform: subscribeHovered ? "translateY(-1px)" : "none",
              }}
              onMouseEnter={() => setSubscribeHovered(true)}
              onMouseLeave={() => setSubscribeHovered(false)}
             onClick={handleSubscribe}
            >
              Subscribe
            </button>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: "2rem",
              paddingTop: "1.75rem",
              borderTop: "0.5px solid #d8e8e9",
            }}
          >
            {[
              { val: "24+", label: "Episodes" },
              { val: "Weekly", label: "New Drops" },
              { val: "3", label: "Platforms" },
            ].map((stat, i, arr) => (
              <div key={stat.label} style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                <div>
                  <div style={{ fontSize: "20px", fontWeight: 700, color: "#0f1a14", lineHeight: 1 }}>
                    {stat.val}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "#8fa898",
                      marginTop: "4px",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ width: "1px", height: "32px", background: "#d8e8e9" }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Logo / visual */}
        <div
          style={{
            flexShrink: 0,
            width: "176px",
            height: "176px",
            borderRadius: "24px",
            background: BRAND,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative ring */}
          <div
            style={{
              position: "absolute",
              width: "220px",
              height: "220px",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.12)",
              top: "-40px",
              right: "-40px",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: "160px",
              height: "160px",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.1)",
              bottom: "-60px",
              left: "-40px",
            }}
          />
          <span
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "72px",
              fontWeight: 300,
              color: "rgba(255,255,255,0.92)",
              lineHeight: 1,
              zIndex: 1,
            }}
          >
            BV
          </span>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "10px",
              background: "rgba(0,0,0,0.2)",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: "8px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.75)",
                fontWeight: 600,
              }}
            >
              Est. 2025
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heroPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>
    </section>
  );
}