"use client";

import { Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const MagazineHero = () => {
  return (
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
          {/* Era marker */}
          <div className="flex items-center justify-center gap-10 mb-8 md:mb-10">
            <div className="h-px w-20 bg-gray-300" />
            <span className="text-xs md:text-sm font-medium tracking-[0.5em] uppercase text-gray-500">
              ESTABLISHED 2025
            </span>
            <div className="h-px w-20 bg-gray-300" />
          </div>

          {/* Single-line friendly headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-light text-gray-950 tracking-tight leading-none mb-8 md:mb-10">
            The Glamlink <span className="italic text-[#24bbcb]">Edit</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12 md:mb-16">
            Your weekly curator of beauty excellence — spotlighting industry
            visionaries, rising talent, transformative treatments, hand-selected
            products, and exclusive insider perspectives from the world of
            aesthetics and wellness.
          </p>

          {/* Newsletter form – aligned heights, clean layout */}
          <div className="max-w-xl mx-auto">
            <form className="flex flex-col sm:flex-row items-stretch gap-4">
              {/* Input wrapper */}
              <div className="relative flex-1 min-w-0">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="Your email address"
                  className="
                    w-full h-14 pl-14 pr-6 rounded-full 
                    border border-gray-200 bg-white text-gray-900 
                    placeholder:text-gray-400 
                    outline-none focus:border-[#24bbcb] focus:ring-4 focus:ring-[#24bbcb]/15 
                    transition-all duration-300 shadow-sm hover:shadow
                  "
                />
              </div>

              {/* Button – same height as input */}
              <Button
                type="submit"
                className="
                  h-14 px-8 min-w-[160px] 
                  bg-[#24bbcb] hover:bg-[#1ea8b5] 
                  text-white font-medium rounded-full 
                  shadow-md hover:shadow-lg shadow-[#24bbcb]/20 hover:shadow-[#24bbcb]/30 
                  transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                  flex items-center gap-2
                "
              >
                <Sparkles className="w-4 h-4" />
                Subscribe
              </Button>
            </form>

            <p className="mt-5 text-sm text-gray-500">
              Join 12,000+ beauty enthusiasts • Unsubscribe anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MagazineHero;
