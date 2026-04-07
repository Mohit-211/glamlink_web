"use client";

import { useRouter } from "next/navigation";
import { issues2025, issues2026 } from "@/data/issues";

export default function MediaKitHero() {
  const router = useRouter();

  const handleDigitalEdition = (slug: string) => {
    router.push(`/magazine/${slug}/digital`);
  };

  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-32 bg-[#fafaf9]">
      {/* Premium Editorial Background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,#fafaf9_0%,#f5f4f2_100%)]" />

      {/* Soft radial accents for depth */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_25%,rgba(30,168,181,0.08),transparent_50%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_70%,rgba(236,72,153,0.06),transparent_50%)]" />

      {/* Subtle noise/grain overlay (luxury print feel) */}
      <div className="absolute inset-0 -z-10 opacity-[0.015] bg-[radial-gradient(#000_0.8px,transparent_1px)] [background-size:4px_4px]" />

      <div className="container-glamlink relative mx-auto px-6 max-w-7xl">
        {/* Top Label */}
        <p className="text-xs tracking-[0.35em] uppercase text-primary/90 font-medium mb-6">
          Media Kit 2025–2026
        </p>

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Left — Text Content */}
          <div className="relative z-10 max-w-2xl">
            <h1 className="font-display text-[52px] md:text-[68px] lg:text-[76px] leading-[1.05] tracking-[-0.02em] text-balance mb-6">
              The Glamlink Edit
            </h1>

            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-8">
              Powered by Glamlink • Beauty &amp; Wellness Redefined
            </p>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-md mb-10">
              Where discovery meets credibility. A curated space connecting
              visionary professionals with the clients who seek them.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => router.push("/get-featured")}
                className="btn-primary group relative overflow-hidden px-10 py-4 text-base font-medium transition-all active:scale-[0.985]"
              >
                <span className="relative z-10">Get Featured</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-active:translate-y-0 transition-transform duration-300" />
              </button>

              <button
                onClick={() => router.push("/magazine")}
                className="px-8 py-4 text-base border border-primary/20 hover:border-primary/40 rounded-full transition-colors text-muted-foreground hover:text-foreground"
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
