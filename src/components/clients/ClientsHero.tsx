"use client";

import { Sparkles, ArrowRight } from "lucide-react";

const ClientsHero = () => {
  return (
    <section className="relative pt-[120px] md:pt-[140px] pb-16 md:pb-24 lg:pb-32 overflow-hidden bg-gradient-to-b from-white via-[#24bbcb]/3 to-white">
      {/* Decorative background orbs */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-15%] w-[60%] h-[60%] bg-[#24bbcb]/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-[-15%] right-[-20%] w-[70%] h-[70%] bg-[#24bbcb]/8 rounded-full blur-3xl animate-pulse-slow delay-1000" />
      </div>

      <div className="container-glamlink px-5 md:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[#24bbcb]/10 border border-[#24bbcb]/20 mb-6 md:mb-8 animate-fade-up">
            <Sparkles className="w-5 h-5 text-[#24bbcb]" />
            <span className="text-sm md:text-base font-semibold text-[#24bbcb]">
              For Beauty Lovers
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight mb-5 md:mb-7 animate-fade-up animation-delay-150">
            Redefining How The World
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#24bbcb] via-[#1ea8b5] to-[#24bbcb] bg-clip-text text-transparent">
              Discovers Beauty
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8 md:mb-12 animate-fade-up animation-delay-300">
            Glamlink connects you with trusted beauty professionals, real
            transformations, and expert-approved products you actually need —
            all in one beautifully designed platform.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 animate-fade-up animation-delay-500">
            <a
              href="#download"
              className="group inline-flex items-center gap-3 px-8 py-4 md:py-5 bg-[#24bbcb] text-white font-semibold text-base md:text-lg rounded-full shadow-xl shadow-[#24bbcb]/30 hover:shadow-2xl hover:shadow-[#24bbcb]/40 transition-all duration-300 hover:scale-[1.03]"
            >
              <span>Download Glamlink</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-7 py-4 md:py-5 text-gray-800 font-medium text-base md:text-lg rounded-full border-2 border-gray-300 hover:border-[#24bbcb] hover:text-[#24bbcb] transition-all duration-300"
            >
              Learn How It Works
            </a>
          </div>

          {/* Trust signals */}
          <div className="mt-10 md:mt-14 flex flex-wrap justify-center gap-6 md:gap-10 text-sm md:text-base text-gray-600 animate-fade-up animation-delay-700">
            <div className="flex items-center gap-2">
              <span className="text-[#24bbcb] text-xl">★</span> Verified
              Professionals
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#24bbcb] text-xl">✓</span> Real
              Transformations
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#24bbcb] text-xl">🛍️</span> Expert-Approved
              Products
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsHero;
