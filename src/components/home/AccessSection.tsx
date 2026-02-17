"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

const AccessSection: React.FC = () => {
  const router = useRouter();

  return (
    <section className="w-full bg-gradient-to-b from-white via-gray-50/70 to-white py-20 md:py-28">
      <div className="container-glamlink px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 items-center">
          {/* Left – Content */}
          <div className="space-y-8 lg:space-y-10 max-w-xl">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#24bbcb]/10 text-[#24bbcb] text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>Modern Link in Bio</span>
              </div>

              <h2 className="text-4xl sm:text-5xl  tracking-tight text-gray-900 leading-tight">
                Access by Glamlink
              </h2>

              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                The clean, professional link-in-bio built especially for beauty
                experts.
              </p>
            </div>

            <div className="space-y-6 text-gray-600">
              <p className="text-base leading-relaxed">
                Replace chaotic link trees with one elegant, structured page
                that answers every client question before they even ask.
              </p>

              <p className="text-base leading-relaxed font-medium text-[#24bbcb]">
                Every Access Card also connects directly to your free Glamlink
                profile and the beauty professional directory — so your link
                doesn’t just organize your business… it helps new clients
                actually discover you by location and specialty.
              </p>

              <p className="text-base leading-relaxed">
                Clients instantly see your services, location, pricing vibe,
                reviews and booking options. No guesswork. No endless messages.
                Just faster bookings and happier clients.
              </p>
            </div>

            <button
              onClick={() => router.push("/apply/digital-card")}
              className="group relative inline-flex items-center gap-3 px-8 py-4.5 bg-gradient-to-r from-[#24bbcb] via-[#1ea8b5] to-[#24bbcb] 
                         text-white font-semibold text-base rounded-full shadow-lg shadow-[#24bbcb]/25 
                         hover:shadow-xl hover:shadow-[#24bbcb]/35 transition-all duration-300 
                         hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Claim Your FREE Access Card</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Right – Visual */}
          <div className="relative flex justify-center lg:justify-end mt-8 lg:mt-0">
            {/* Subtle background glow + mock phone frame effect */}
            <div className="relative">
              {/* Glow behind */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#24bbcb]/20 via-transparent to-[#24bbcb]/10 rounded-[3.5rem] blur-3xl scale-110 opacity-70" />

              {/* Card with modern phone-like presentation */}
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-black/15 border border-gray-200/60 bg-white transform transition-transform hover:scale-[1.02] duration-500">
                <img
                  src="/access-card-preview.png"
                  alt="Glamlink Access Card Preview – clean professional profile"
                  className="w-full max-w-[320px] sm:max-w-[360px] md:max-w-[380px] object-cover"
                  loading="lazy"
                />
              </div>

              {/* Optional subtle badge/ribbon (can remove if not wanted) */}
              <div className="absolute -top-3 -right-3 rotate-12 bg-[#24bbcb] text-white text-xs  px-4 py-1.5 rounded-full shadow-md">
                Live Preview
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccessSection;
