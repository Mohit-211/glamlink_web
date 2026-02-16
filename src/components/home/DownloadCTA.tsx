"use client";

import {
  Download,
  Users,
  Briefcase,
  Apple,
  Smartphone,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const DownloadCTA = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Subtle background gradient + pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#22bccb]/5 via-white to-[#22bccb]/5 pointer-events-none" />

      <div className="absolute inset-0 opacity-[0.04]">
        <svg className="w-full h-full" viewBox="0 0 800 800">
          <defs>
            <pattern
              id="dots"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="20" cy="20" r="2" fill="#22bccb" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="container-glamlink px-5 md:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-5">
              Download Glamlink <span className="text-[#22bccb]">for Free</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join thousands of beauty lovers discovering trusted professionals
              — and creators building thriving businesses — all in one modern
              platform.
            </p>
          </div>

          {/* Two-column CTA cards */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* For Clients */}
            <div className="group relative rounded-3xl bg-white border border-gray-200/80 shadow-xl shadow-[#22bccb]/5 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#22bccb]/15 hover:-translate-y-2">
              {/* Accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#22bccb] to-[#1ea8b5]" />

              <div className="p-8 lg:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#22bccb]/10 flex items-center justify-center text-[#22bccb] transition-transform group-hover:scale-110 group-hover:rotate-3">
                    <Users className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      For Clients
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Discover & book beauty pros
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed mb-8 text-base">
                  Instantly find verified beauty professionals near you, explore
                  portfolios, read real reviews, and book appointments —
                  effortlessly.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="flex-1 bg-black text-white hover:bg-black/90 rounded-xl py-7 text-base font-medium shadow-lg transition-all group-hover:scale-[1.02]"
                  >
                    <Apple className="w-5 h-5 mr-2" />
                    App Store
                  </Button>
                  <Button
                    size="lg"
                    className="flex-1 bg-black text-white hover:bg-black/90 rounded-xl py-7 text-base font-medium shadow-lg transition-all group-hover:scale-[1.02]"
                  >
                    <Smartphone className="w-5 h-5 mr-2" />
                    Google Play
                  </Button>
                </div>
              </div>
            </div>

            {/* For Professionals */}
            <div className="group relative rounded-3xl bg-gradient-to-br from-[#22bccb]/5 to-white border border-[#22bccb]/30 shadow-xl shadow-[#22bccb]/10 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#22bccb]/25 hover:-translate-y-2">
              {/* Accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#22bccb] to-[#1ea8b5]" />

              <div className="p-8 lg:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#22bccb]/10 flex items-center justify-center text-[#22bccb] transition-transform group-hover:scale-110 group-hover:rotate-3">
                    <Briefcase className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      For Professionals
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Grow your beauty business
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed mb-8 text-base">
                  Get discovered by local clients, manage flexible bookings,
                  accept payments, showcase your work, and scale your brand —
                  built for modern beauty creators.
                </p>

                <Button
                  size="lg"
                  className="w-full bg-[#22bccb] hover:bg-[#1ea8b5] text-white rounded-xl py-7 text-base font-semibold shadow-lg shadow-[#22bccb]/30 hover:shadow-xl hover:shadow-[#22bccb]/40 transition-all duration-300 group-hover:scale-[1.02]"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Join as Professional
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>

          {/* Small trust note */}
          <p className="text-center text-sm text-gray-500 mt-10">
            Free to download • No credit card required • Available worldwide
          </p>
        </div>
      </div>
    </section>
  );
};

export default DownloadCTA;
