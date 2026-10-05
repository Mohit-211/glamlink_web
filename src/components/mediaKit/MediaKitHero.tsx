"use client";

import { useRouter } from "next/navigation";
import { issues2025, issues2026 } from "@/data/issues";

export default function MediaKitHero() {
  const router = useRouter();

  const handleDigitalEdition = (slug: string) => {
    router.push(`/magazine/${slug}/digital`);
  };

  return (
    <section className="hero-glamlink relative overflow-hidden bg-background">
      <div className="container-glamlink relative">
        {/* Top Label */}
        <p className="text-xs tracking-[0.35em] uppercase text-primary/90 font-medium mb-6">
          Partner With Glamlink 2025–2026
        </p>

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Left — Text Content */}
          <div className="relative z-10 max-w-2xl">
            <h1 className="hero-title mb-6">
              The Glamlink Edit
            </h1>

            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-8">
              Powered by Glamlink • Beauty &amp; Wellness Redefined
            </p>

            {/* <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-md mb-10">
              Where discovery meets credibility. A curated space connecting
              visionary professionals with the clients who seek them.
            </p> */}
            <p className="hero-subtitle max-w-md mb-10">
              Glamlink offers opportunities across editorial, podcast, social, digital content, sponsorships and brand partnerships.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => router.push("/get-featured")}
                className="btn-primary btn-lg"
              >
                Get Featured
              </button>

              <button
                onClick={() => router.push("/magazine")}
                className="btn-outline btn-lg"
              >
                Explore All Editions
              </button>
            </div>
          </div>

          {/* Right — Magazine Covers Stack (Premium 3D-ish feel) */}
          <div className="relative h-[380px] md:h-[440px] lg:h-[480px] flex justify-center lg:justify-end">
            {/* Left card - slight negative rotation */}
            <div
              onClick={() => handleDigitalEdition(issues2026[0].slug)}
              className="absolute left-[-20px] md:left-[-50px] top-[60px] rotate-[-7deg] w-[155px] md:w-[185px] h-[220px] md:h-[260px] rounded-2xl overflow-hidden shadow-xl cursor-pointer group transition-all duration-500 hover:rotate-[-4deg] hover:-translate-y-2 hover:shadow-2xl"
            >
              <img
                src={issues2026[0].cover}
                alt={`${issues2026[0].title} - Digital Edition Cover`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Premium cover border + shine */}
              <div className="absolute inset-0 ring-1 ring-white/30 rounded-2xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Center card - main focus, elevated */}
            <div
              onClick={() => handleDigitalEdition(issues2026[1].slug)}
              className="absolute left-1/2 -translate-x-1/2 top-0 z-20 w-[195px] md:w-[235px] h-[275px] md:h-[330px] rounded-2xl overflow-hidden shadow-2xl cursor-pointer group transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_35px_60px_-15px_rgb(0,0,0,0.3)]"
            >
              <img
                src={issues2026[1].cover}
                alt={`${issues2026[1].title} - Digital Edition Cover`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
              />
              <div className="absolute inset-0 ring-1 ring-white/20 rounded-2xl" />
              {/* Subtle inner highlight */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10" />
            </div>

            {/* Right card - positive rotation */}
            <div
              onClick={() => handleDigitalEdition(issues2025[5].slug)}
              className="absolute right-[-20px] md:right-[-40px] top-[80px] rotate-[7deg] w-[155px] md:w-[185px] h-[220px] md:h-[260px] rounded-2xl overflow-hidden shadow-xl cursor-pointer group transition-all duration-500 hover:rotate-[4deg] hover:-translate-y-2 hover:shadow-2xl"
            >
              <img
                src={issues2025[5].cover}
                alt={`${issues2025[5].title} - Digital Edition Cover`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 ring-1 ring-white/30 rounded-2xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
