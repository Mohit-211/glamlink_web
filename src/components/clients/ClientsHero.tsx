"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import { useState } from "react";
import UserDownloadDialog from "../glamcard/UserDownloadDialog";

const ClientsHero = () => {
      const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <section className="hero-glamlink relative overflow-hidden bg-background">
      <div className="container-glamlink relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <span className="badge-soft text-xs sm:text-sm animate-fade-up">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            For Beauty Lovers
          </span>

          {/* Headline */}
          <h1 className="hero-title mt-6 animate-fade-up animation-delay-150">
            Redefining How The World{" "}
            <br className="hidden sm:block" />
            <span className="text-primary">
              Discovers Beauty
            </span>
          </h1>

          {/* Subheadline */}
          <p className="hero-subtitle mt-6 max-w-3xl mx-auto mb-10 animate-fade-up animation-delay-300">
            Glamlink connects you with trusted beauty professionals, real
            transformations, and expert-approved products you actually need —
            all in one beautifully designed platform.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 animate-fade-up animation-delay-500">
            <a
              href=""
              onClick={() => setIsModalOpen(true)}

              className="btn-primary btn-lg group"
            >
              <span>Download Glamlink</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href="#how-it-works"
              className="btn-outline btn-lg"
            >
              Learn How It Works
            </a>
          </div>

          {/* Trust signals */}
          <div className="mt-10 md:mt-12 flex flex-wrap justify-center gap-6 md:gap-10 text-sm md:text-base text-muted-foreground animate-fade-up animation-delay-700">
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
        <UserDownloadDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default ClientsHero;
