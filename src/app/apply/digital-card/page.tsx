"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";

const GlamCardHero = dynamic(
  () => import("@/components/glamcard/GlamCardHero"),
  { ssr: false }
);

const GlamCardApplication = dynamic(
  () => import("@/components/glamcard/GlamCardApplication"),
  { ssr: false }
);

export default function DigitalApplyPage() {
  const applyRef = useRef<HTMLDivElement | null>(null);

  const scrollToApply = () => {
    applyRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-16 lg:pt-20">
        <section className="pb-20">
          <GlamCardHero onApplyClick={scrollToApply} />
        </section>

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
