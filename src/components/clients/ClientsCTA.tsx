"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ClientsCTA = () => {
  return (
    <section className="relative py-20 md:py-28 lg:py-32 overflow-hidden">
      {/* Very soft background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#24bbcb]/3 to-white pointer-events-none" />

      <div className="container-glamlink px-5 md:px-8 relative z-10">
        <div className="relative rounded-3xl bg-white/70 backdrop-blur-xl border border-gray-100/80 shadow-2xl shadow-[#24bbcb]/10 p-8 md:p-12 lg:p-16 overflow-hidden">
          {/* Ultra-subtle pattern */}
          <div className="absolute inset-0 opacity-[0.04]">
            <svg className="w-full h-full" viewBox="0 0 800 800">
              <defs>
                <pattern
                  id="soft-dots"
                  width="60"
                  height="60"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="30" cy="30" r="1.5" fill="#24bbcb" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#soft-dots)" />
            </svg>
          </div>

          {/* Elegant glow accents */}
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#24bbcb]/8 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-[#24bbcb]/6 rounded-full blur-3xl animate-pulse-slow delay-1000" />

          {/* Content – centered & breathing */}
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 md:mb-8 leading-tight">
              Meet the Pros,
              <br className="hidden sm:block" /> Shop Their Secrets,
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-[#24bbcb] via-[#1ea8b5] to-[#24bbcb] bg-clip-text text-transparent">
                Elevate Your Best Self
              </span>
            </h2>

            <p className="text-lg md:text-xl text-gray-700 mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of beauty lovers discovering verified
              professionals, real transformations, and hand-curated products
              that truly transform their routines — all in one refined platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 md:gap-6">
              <Button
                size="lg"
                className="group min-w-[240px] bg-[#24bbcb] hover:bg-[#1ea8b5] text-white font-semibold text-base md:text-lg rounded-full shadow-xl shadow-[#24bbcb]/25 hover:shadow-2xl hover:shadow-[#24bbcb]/35 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] flex items-center gap-3 px-8 md:px-10 py-6 md:py-7"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
              </Button>

              <span className="text-base md:text-lg text-gray-600 font-medium">
                No credit card required • Free to join
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsCTA;
