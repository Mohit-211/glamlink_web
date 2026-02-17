"use client";

import React from "react";

interface GlamCardHeroProps {
  onApplyClick: () => void;
}

const GlamCardHero: React.FC<GlamCardHeroProps> = ({ onApplyClick }) => {
  return (
    <section className="w-full bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Text Content */}
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-2xl md:text-5xl  tracking-tight text-gray-900 mb-5 leading-tight">
              The Link in Bio, Evolved.
            </h2>

            <p className="text-m sm:text-l text-gray-700 leading-relaxed mb-6">
              Your digital presence should be as refined as your craft. The{" "}
              <strong>Glam Card</strong> is the new industry standard—a
              high-conversion storefront designed to turn followers into clients
              instantly.
            </p>

            <p className="text-m sm:text-l text-gray-700 leading-relaxed mb-8">
              Feature a <strong>personal video greeting</strong>, a tour of your
              space, or a <strong>promo of your signature work</strong>{" "}
              alongside integrated mapping and{" "}
              <strong>one-touch booking</strong>.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Powered by Glamlink. Built for the Beauty + Wellness Pro.
            </h3>

            <p className="text-m sm:text-l text-gray-700 leading-relaxed mb-4">
              Centralize your entire brand in one destination—from{" "}
              <strong>Service Menus</strong> and <strong>Direct Booking</strong>{" "}
              to <strong>Clips</strong> and <strong>Photo Albums</strong>.
            </p>

            <p className="text-m sm:text-l text-gray-700 leading-relaxed mb-10">
              Build authority with <strong>Verified Reviews</strong> and prepare
              to scale with an <strong>Integrated Shop</strong> coming soon.
            </p>

            <button
              onClick={onApplyClick}
              className="
                inline-flex items-center px-10 py-5 text-base sm:text-lg font-semibold 
                text-white rounded-full shadow-md hover:shadow-lg 
                transition-all duration-300 hover:scale-[1.02] active:scale-98
              "
              style={{
                background:
                  "linear-gradient(135deg, #23aeb8 0%, #53bec6 50%, #5cc2d6 100%)",
              }}
            >
              Apply for Your Glam Card
            </button>
          </div>

          {/* Right Column - Mockup Card */}
          <div className="flex justify-center lg:justify-end">
            <div
              className="
              relative w-full max-w-md rounded-2xl bg-white 
              shadow-xl border border-gray-200 overflow-hidden
            "
            >
              {/* Header */}
              <div className="px-8 pt-10 pb-6 text-center">
                <h4 className="text-2xl font-semibold text-gray-900 leading-tight">
                  Connected to Glamlink Directory + Map
                </h4>
                <p className="mt-3 text-sm uppercase tracking-wider text-gray-500 font-medium">
                  INCLUDES A GLAMLINK PROFILE
                </p>
              </div>

              {/* Search Bar */}
              <div className="px-8 pb-8">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value="www.glamlink.net"
                    readOnly
                    className="
                      w-full pl-5 pr-12 py-3.5 rounded-full border border-gray-300 
                      bg-white text-gray-700 text-sm focus:outline-none
                    "
                  />
                  <div className="absolute right-3 text-gray-500 text-xl">
                    🔍
                  </div>
                </div>
              </div>

              {/* Mockups */}
              <div className="relative px-8 pb-16">
                <img
                  src="/directory-laptop.png"
                  alt="Directory Laptop Mockup"
                  className="w-full rounded-xl shadow-lg"
                />
                <img
                  src="/directory-mobile.png"
                  alt="Directory Mobile Mockup"
                  className="
                    absolute -bottom-10 left-1/2 -translate-x-1/2 
                    w-28 sm:w-32 rounded-xl shadow-2xl border-4 border-white
                  "
                />
              </div>

              {/* Subtle bottom accent */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#23aeb8]/10 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlamCardHero;
