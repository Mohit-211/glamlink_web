"use client";

import React, { useState } from "react";
import FeatureFormModal from "@/components/mediaKit/form/FeatureFormModal";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] tracking-[0.22em] uppercase text-primary/80 mb-3">
      {children}
    </p>
  );
}

const GetFeaturedSection = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <section className="relative py-20 overflow-hidden bg-muted/40">

        <div className="container-glamlink text-center max-w-2xl">
          {/* LABEL */}
          <SectionLabel>Get Featured</SectionLabel>

          {/* HEADING */}
          <h2 className="section-title font-display mb-4">
            Step into the spotlight
          </h2>

          {/* DESCRIPTION */}
          <p className="text-base text-muted-foreground leading-relaxed mb-6">
            Apply to be featured in an upcoming issue of Glamlink. Each
            placement is curated — designed to position you, not just publish
            you.
          </p>

          {/* SCARCITY LINE */}
          <p className="text-xs text-primary mb-8 tracking-wide">
            Limited placements per issue · Selection based
          </p>

          {/* CTA */}
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary px-8 py-3 text-sm"
          >
            Apply for Feature →
          </button>
        </div>
      </section>

      {showForm && <FeatureFormModal onClose={() => setShowForm(false)} />}
    </>
  );
};

export default GetFeaturedSection;
