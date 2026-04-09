"use client";

import SectionLabel from "./shared/SectionLabel";
import SectionHeading from "./shared/SectionHeading";
import { PenLine, Syringe } from "lucide-react";

export default function CommunitySection() {
  const items = [
    {
      title: "Share Your Story",
      desc: "Contribute your journey, insights, or perspective and be part of the editorial conversation.",
      icon: PenLine,
    },
    {
      title: "Feature a Treatment",
      desc: "Showcase your expertise by highlighting treatments and services you offer.",
      icon: Syringe,
    },
  ];

  return (
    <section className="section-glamlink container-glamlink">
      {/* HEADER */}
      <div className="max-w-xl mb-12">
        <SectionLabel>Community</SectionLabel>

        <SectionHeading>Start with visibility — no barriers</SectionHeading>

        <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
          Not everything starts with a paid feature. Glamlink offers open
          opportunities to contribute, get noticed, and become part of the
          ecosystem before stepping into premium placements.
        </p>
      </div>

      {/* CARDS */}
      <div className="grid sm:grid-cols-2 gap-6">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="card-glamlink p-6 group relative overflow-hidden"
            >
              {/* BACKGROUND HOVER GLOW */}
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition duration-300" />

              {/* TOP ROW */}
              <div className="flex items-center justify-between mb-4 relative z-10">
                {/* ICON */}
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>

                <span className="badge-soft">Free</span>
              </div>

              {/* CONTENT */}
              <h4 className="text-base font-medium mb-2 relative z-10">
                {item.title}
              </h4>

              <p className="text-sm text-muted-foreground leading-relaxed relative z-10">
                {item.desc}
              </p>

              {/* SUBTLE CTA */}
              <p className="text-xs text-primary mt-4 opacity-0 group-hover:opacity-100 transition relative z-10">
                Contribute →
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
