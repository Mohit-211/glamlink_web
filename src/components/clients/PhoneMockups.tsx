"use client";

import Image from "next/image";
import { Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import phone1 from "../../../public/assets/phone1.jpg";
import phone2 from "../../../public/assets/phone2.jpg";
import phone3 from "../../../public/assets/phone3.jpg";

const images = [phone1, phone2, phone3];

const PhoneMockups = () => {
  return (
    <section className="relative py-16 md:py-20 lg:py-24 overflow-hidden bg-gradient-to-b from-white via-[#24bbcb]/2 to-white">
      {/* Softer background glows */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-48 md:w-72 h-48 md:h-72 bg-[#24bbcb]/6 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-1/4 w-48 md:w-64 h-48 md:h-64 bg-[#24bbcb]/5 rounded-full blur-3xl animate-pulse-slow delay-1000" />
      </div>

      <div className="container-glamlink px-5 md:px-8">
        {/* Header – compact */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Your All-In-One
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#24bbcb] via-[#1ea8b5] to-[#24bbcb] bg-clip-text text-transparent">
              Beauty Platform
            </span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover professionals, browse transformations, book instantly, and
            shop expert-curated products — all in one beautifully designed
            experience.
          </p>
        </div>

        {/* Phones – smaller & better spaced */}
        <div className="relative flex items-center justify-center mb-12 md:mb-16">
          {/* Subtle center glow */}
          <div className="absolute w-[180px] md:w-[260px] h-[180px] md:h-[260px] bg-[#24bbcb]/10 rounded-full blur-3xl -z-10 animate-pulse-slow" />

          <div className="flex flex-row items-end justify-center gap-4 xs:gap-6 sm:gap-8 md:gap-12 lg:gap-16 perspective-[900px]">
            {images.map((image, index) => {
              const isCenter = index === 1;
              const tilt = isCenter
                ? "rotateY(0deg)"
                : index === 0
                ? "rotateY(-10deg)"
                : "rotateY(10deg)";

              return (
                <div
                  key={index}
                  className={`
                    relative transition-all duration-700 ease-out transform-gpu
                    ${
                      isCenter
                        ? "z-20 scale-105 md:scale-108"
                        : "scale-90 md:scale-95 opacity-90 hover:opacity-100"
                    }
                    group
                  `}
                  style={{
                    transform: `perspective(900px) ${tilt} rotateX(${
                      isCenter ? "3deg" : "5deg"
                    })`,
                  }}
                >
                  <div
                    className={`
                      relative w-[160px] xs:w-[180px] sm:w-[200px] md:w-[240px] lg:w-[280px]
                      aspect-[9/19] rounded-[1.8rem] md:rounded-[2.2rem] overflow-hidden
                      border-[8px] md:border-[12px] border-black/90 shadow-lg shadow-black/20
                      transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-[0_20px_50px_rgba(34,188,203,0.2)]
                    `}
                  >
                    <Image
                      src={image}
                      alt={`Glamlink app screen ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={isCenter}
                      quality={85}
                    />

                    {/* Light screen overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5 pointer-events-none" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            size="lg"
            className="group px-7 md:px-9 py-5 md:py-6 bg-[#24bbcb] hover:bg-[#1ea8b5] text-white font-semibold text-base md:text-lg rounded-full shadow-lg shadow-[#24bbcb]/25 hover:shadow-xl hover:shadow-[#24bbcb]/35 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] flex items-center gap-2.5 mx-auto"
          >
            <Download className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
            Download Glamlink
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>

          <p className="mt-4 text-sm text-gray-500">
            Free on iOS & Android • No credit card needed
          </p>
        </div>
      </div>
    </section>
  );
};

export default PhoneMockups;
