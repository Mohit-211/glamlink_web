"use client";

import React from "react";

interface GlamCardHeroProps {
  onApplyClick: () => void;
}
const GlamCardHero: React.FC<GlamCardHeroProps> = ({
  onApplyClick,
}) => {
  return (
    <section className="w-full bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-[28px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]">

          {/* TOP GRADIENT ACCENT */}
          <div className="absolute left-0 top-0 h-[6px] w-full bg-gradient-to-r from-[#23aeb8] via-[#53bec6] to-[#5cc2d6]" />

          <div className="grid grid-cols-1 gap-14 px-10 py-16 lg:grid-cols-2 lg:px-16">

            {/* LEFT CONTENT */}
            <div>
              <h2 className="text-3xl font-semibold text-gray-900">
                The Link in Bio, Evolved.
              </h2>

              <p className="mt-6 text-base leading-relaxed text-gray-700">
                Your digital presence should be as refined as your craft.
                The <strong>Glam Card</strong> is the new industry standard—a
                high-conversion storefront designed to turn followers into
                clients instantly.
              </p>

              <p className="mt-4 text-base leading-relaxed text-gray-700">
                Feature a <strong>personal video greeting</strong>, a tour of
                your space, or a <strong>promo of your signature work</strong>{" "}
                alongside integrated mapping and{" "}
                <strong>one-touch booking</strong>.
              </p>

              <h3 className="mt-8 text-lg font-semibold text-gray-900">
                Powered by Glamlink. Built for the Beauty + Wellness Pro.
              </h3>

              <p className="mt-4 text-base leading-relaxed text-gray-700">
                Centralize your entire brand in one destination—from{" "}
                <strong>Service Menus</strong> and{" "}
                <strong>Direct Booking</strong> to{" "}
                <strong>Clips</strong> and <strong>Photo Albums</strong>.
              </p>

              <p className="mt-4 text-base leading-relaxed text-gray-700">
                Build authority with <strong>Verified Reviews</strong> and
                prepare to scale with an{" "}
                <strong>Integrated Shop</strong> coming soon.
              </p>

              {/* GRADIENT BUTTON */}
              <button
                className="mt-10 rounded-full px-9 py-4 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
                style={{
                  background:
                    "linear-gradient(135deg, #23aeb8 0%, #53bec6 50%, #5cc2d6 100%)",
                }}
                onClick={() => (window.location.href = "/apply/digital")}
              >
                Apply for Your Glam Card
              </button>
            </div>

            {/* RIGHT CARD */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-[340px] rounded-2xl bg-white shadow-[0_18px_50px_rgba(0,0,0,0.18)] overflow-hidden">

                {/* HEADER */}
                <div className="px-6 pt-8 text-center">
                  <h3 className="text-2xl font-medium text-gray-900 leading-snug">
                    Connected to
                    <br />
                    Glamlink Directory + Map
                  </h3>

                  <p className="mt-2 text-xs tracking-widest text-gray-500">
                    INCLUDES A GLAMLINK PROFILE
                  </p>
                </div>

                {/* SEARCH */}
                <div className="mt-6 flex items-center gap-3 px-6">
                  <div className="flex-1 rounded-full border px-4 py-2 text-sm text-gray-600">
                    www.glamlink.net
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border text-sm">
                    🔍
                  </div>
                </div>

                {/* MOCKUPS */}
                <div className="relative mt-8 px-6">
                  <img
                    src="/directory-laptop.png"
                    alt="Directory Laptop"
                    className="w-full rounded-lg"
                  />
                  <img
                    src="/directory-mobile.png"
                    alt="Directory Mobile"
                    className="absolute -bottom-6 left-6 w-[90px] rounded-lg shadow-xl"
                  />
                </div>

                {/* FOOTER GRADIENT */}
                <div className="mt-12 bg-gradient-to-t from-black to-transparent px-6 py-6 text-center">
                  <p className="text-xs tracking-widest text-white">
                    www.glamlink.net
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default GlamCardHero;
