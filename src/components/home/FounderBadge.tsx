"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sparkles, ShieldCheck, ArrowRight, Download } from "lucide-react";

const FounderBadge = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white via-gray-50/70 to-white relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#24bbcb]/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#24bbcb]/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
      </div>

      <div className="container-glamlink px-5 md:px-8 relative z-10">
        {/* Founder Badge Section */}
        <div className="max-w-4xl mx-auto text-center mb-24 md:mb-32">
          <div className="inline-flex items-center justify-center mb-8 relative">
            {/* Glow effect behind badge */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#24bbcb]/30 via-transparent to-[#24bbcb]/10 rounded-full blur-2xl scale-125 opacity-70" />

            <div className="relative">
              <Image
                src="https://thumbs.dreamstime.com/b/golden-shield-emblem-empty-badge-symbol-award-merit-recognition-excellence-achievement-security-shiny-polished-metallic-410628199.jpg"
                alt="Glamlink Founder Shield Badge"
                width={180}
                height={180}
                className="rounded-full border-8 border-white shadow-2xl shadow-[#24bbcb]/20 object-cover"
                unoptimized
                priority
              />

              {/* Small exclusive badge overlay */}
              <div className="absolute -top-3 -right-3 bg-[#24bbcb] text-white text-xs  px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Exclusive
              </div>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl  tracking-tight text-gray-900 mb-5">
            Founder Badge
            <span className="text-[#24bbcb] block mt-2">First 100 Only</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-6 leading-relaxed">
            Be part of the first wave of beauty and wellness professionals
            shaping the future of Glamlink.
          </p>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8">
            <div className="flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-[#24bbcb]" />
              <span className="text-sm font-medium">Exclusive visibility</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
              <Sparkles className="w-5 h-5 text-[#24bbcb]" />
              <span className="text-sm font-medium">Permanent perks</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
              <ArrowRight className="w-5 h-5 text-[#24bbcb]" />
              <span className="text-sm font-medium">First access to tools</span>
            </div>
          </div>

          <p className="text-base font-medium text-gray-800">
            Join now and be officially recognized as a{" "}
            <span className="text-[#24bbcb] font-semibold">
              Founding Member
            </span>
            .
          </p>
        </div>

        {/* Download Glamlink Section */}
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl  tracking-tight text-gray-900 mb-5">
            Download Glamlink <span className="text-[#24bbcb]">for Free</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            The modern way to discover and book beauty services
          </p>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">
            {/* User Card */}
            <div className="group relative rounded-2xl bg-white border border-gray-200 p-8 shadow-sm hover:shadow-xl hover:shadow-[#24bbcb]/15 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute -top-3 left-6 bg-[#24bbcb] text-white text-xs  px-4 py-1.5 rounded-full shadow-md">
                For Users
              </div>

              <div className="mt-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 group-hover:text-[#24bbcb] transition-colors">
                  Discover & Book
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Find trusted beauty professionals near you, book instantly,
                  and shop expert-approved products — all in one elegant app.
                </p>
              </div>

              <div className="mt-8 flex justify-center">
                <Download className="w-12 h-12 text-[#24bbcb]/30 group-hover:text-[#24bbcb]/60 transition-colors" />
              </div>
            </div>

            {/* Pros Card */}
            <div className="group relative rounded-2xl bg-white border border-gray-200 p-8 shadow-sm hover:shadow-xl hover:shadow-[#24bbcb]/15 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute -top-3 left-6 bg-[#24bbcb] text-white text-xs  px-4 py-1.5 rounded-full shadow-md">
                For Professionals
              </div>

              <div className="mt-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 group-hover:text-[#24bbcb] transition-colors">
                  Build & Grow
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Create your digital presence, grow your client base, manage
                  bookings, and sell products directly — designed for modern
                  beauty creators.
                </p>
              </div>

              <div className="mt-8 flex justify-center">
                <Download className="w-12 h-12 text-[#24bbcb]/30 group-hover:text-[#24bbcb]/60 transition-colors" />
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Button
              size="lg"
              className="min-w-[220px] bg-[#24bbcb] hover:bg-[#1ea8b5] text-white font-semibold text-base py-7 rounded-full shadow-lg shadow-[#24bbcb]/25 hover:shadow-xl hover:shadow-[#24bbcb]/35 transition-all duration-300 group"
            >
              <span>Download for Users</span>
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="min-w-[220px] border-2 border-gray-800 text-gray-900 hover:bg-gray-900 hover:text-white font-semibold text-base py-7 rounded-full transition-all duration-300 group"
            >
              <span>Download for Pros</span>
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderBadge;
