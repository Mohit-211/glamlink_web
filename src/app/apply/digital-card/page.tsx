"use client";

import React, { useRef } from "react";
import GlamCardHero from "@/components/glamcard/GlamCardHero";
import GlamCardApplication from "@/components/glamcard/GlamCardApplication";

export default function DigitalApplyPage() {
  // ✅ Properly typed ref
  const applyRef = useRef<HTMLDivElement | null>(null);

  // ✅ Safe scroll handler
  const scrollToApply = () => {
    if (applyRef.current) {
      applyRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-16 lg:pt-20">
        {/* HERO SECTION */}
        <section className="pb-20">
          {/* ✅ Pass handler safely */}
          <GlamCardHero onApplyClick={scrollToApply} />
        </section>

        {/* APPLICATION SECTION */}
        <section
          ref={applyRef}
          className="bg-muted/30 py-20 scroll-mt-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <GlamCardApplication />
          </div>
        </section>
      </main>
    </div>
  );
}
