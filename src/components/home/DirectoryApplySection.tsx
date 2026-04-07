"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, MapPin, FileText, Sparkles } from "lucide-react";

const DirectoryApplySection: React.FC = () => {
  const router = useRouter();

  return (
    <section className="w-full bg-gradient-to-b from-gray-50/60 via-white to-gray-50/60 py-20 md:py-28">
      <div className="container-glamlink px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 items-center">

          {/* LEFT CONTENT */}
          <div className="space-y-8 max-w-xl">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#24bbcb]/10 text-[#24bbcb] text-sm font-medium">
                <MapPin className="w-4 h-4" />
                <span>Directory + Map Visibility</span>
              </div>

              <h2 className="text-4xl sm:text-5xl tracking-tight text-gray-900 leading-tight">
                Get Discovered on Glamlink
              </h2>

              <p className="text-lg text-gray-700 leading-relaxed">
                Apply once — get listed across the Glamlink directory, map,
                treatment pages, and more.
              </p>
            </div>

            <div className="space-y-6 text-gray-600">
              <p>
                When you submit your application, our team reviews and approves
                your profile — then you’re instantly visible inside the Glamlink
                ecosystem.
              </p>

              <p>
                Clients can discover you by{" "}
                <span className="font-semibold text-gray-900">
                  location, specialty, and treatments
                </span>{" "}
                like Botox, microneedling, facials, and more — directly on the
                map.
              </p>

              <p>
                Your services can also be featured inside{" "}
                <span className="font-semibold text-gray-900">
                  treatment articles
                </span>{" "}
                with QR codes that drive real clients to your profile.
              </p>

              <p className="text-[#24bbcb] font-medium">
                This powers your Access Card, improves discovery, and unlocks
                email marketing opportunities — all automatically.
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={() => router.push("/directory-form-apply")}
              className="group inline-flex items-center gap-3 px-8 py-4.5 
              bg-gradient-to-r from-[#24bbcb] to-[#1ea8b5] 
              text-white font-semibold rounded-full shadow-lg 
              hover:scale-[1.03] transition-all duration-300"
            >
              Apply to Directory
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>

            {/* Checkbox Preview */}
            <div className="flex items-start gap-3 p-4 border border-[#DCF0F6] rounded-xl bg-white">
              <input type="checkbox" checked readOnly className="mt-1 accent-[#24bbcb]" />
              <p className="text-sm text-gray-700 leading-relaxed">
                Yes, create my <span className="font-semibold text-[#24bbcb]">
                FREE Access digital business card
                </span> and map listing.
              </p>
            </div>
          </div>

          {/* RIGHT VISUAL */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">

              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#24bbcb]/20 to-transparent blur-3xl rounded-3xl scale-110" />

              {/* Card */}
              <div className="relative z-10 bg-white rounded-3xl border border-gray-200 shadow-2xl p-6 w-[320px] sm:w-[360px]">

                {/* Map preview */}
                <div className="bg-[#EEF9FC] rounded-xl p-4 mb-4 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-[#24bbcb]" />
                </div>

                {/* Features */}
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#24bbcb]" />
                    Directory Listing
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#24bbcb]" />
                    Map Discovery
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#24bbcb]" />
                    Treatment Articles + QR
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DirectoryApplySection;