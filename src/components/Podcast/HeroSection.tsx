"use client";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onGuestClick: () => void;
}

export default function HeroSection({ onGuestClick }: HeroSectionProps) {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    window.open("https://mailchi.mp/glamlink/subscribe", "_blank");
  };

  return (
<<<<<<< HEAD
    <section className="relative pt-18 pb-18 md:pt-20 md:pb-20 overflow-hidden bg-white">
      {/* Very subtle luxury texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.006]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #e0e0e0 1px, transparent 0)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="container-glamlink px-5 md:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
=======
    <section
      style={{
        background: "#fff",
        borderBottom: "0.5px solid #d0e8ea",
        padding: "clamp(2rem, 5vw, 3.5rem) clamp(1rem, 4vw, 1.5rem) clamp(1.5rem, 4vw, 3rem)",
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
>>>>>>> 30a95675f69487a1ecbe33c4b72d31fa8e1de320
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-[#e4f6f8] border border-[#24bbcb] rounded-full px-4 py-1 mb-6 md:mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#24bbcb] animate-pulse" />
            <span className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#157a82] font-semibold whitespace-nowrap">
              New Episode Every Week
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-light text-gray-950 tracking-tight leading-none mb-8 md:mb-10">
            The Beauty <span className="text-[#24bbcb]">Vault</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12 md:mb-16">
            Unfiltered conversations with the professionals, founders, and
            innovators actively shaping the future of beauty and wellness.
          </p>

          {/* CTAs */}
          <div className="max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4">
              <Button
                onClick={onGuestClick}
                className="
                  h-14 px-8 min-w-[160px]
                  bg-[#24bbcb] hover:bg-[#1ea8b5]
                  text-white font-medium rounded-full
                  shadow-md hover:shadow-lg shadow-[#24bbcb]/20 hover:shadow-[#24bbcb]/30
                  transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                "
              >
                Apply to be a guest
              </Button>

              <Button
                onClick={handleSubscribe}
                variant="outline"
                className="
                  h-14 px-8 min-w-[160px]
                  border border-[#24bbcb] bg-white text-[#24bbcb]
                  hover:bg-[#e4f6f8] font-medium rounded-full shadow-sm hover:shadow
                  transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                "
              >
                Subscribe
              </Button>
            </div>

            <p className="mt-5 text-sm text-gray-500">
              Join beauty enthusiasts • Unsubscribe anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
