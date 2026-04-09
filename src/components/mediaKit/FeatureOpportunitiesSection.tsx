"use client";

import SectionLabel from "./shared/SectionLabel";
import SectionHeading from "./shared/SectionHeading";
import { Star, Mic, Crown, Building2, Megaphone } from "lucide-react";

export default function FeaturedComponent() {
  const features = [
    {
      title: "Pro Spotlight Feature",
      desc: "A curated editorial feature designed to highlight your work, expertise and services.",
      icon: Star,
      points: [
        "1-page feature in The Glamlink Edit (print + digital)",
        "Inclusion in web editorial (journal)",
        "Professional exposure to new clients",
        "Social media visibility opportunities",
      ],
    },
    {
      title: "Interview + Feature",
      desc: "A deeper editorial experience that positions you as an authority.",
      icon: Mic,
      points: [
        "Full 25 min interview for The Beauty Vault Podcast",
        "Web article with direct links",
        "Professional storytelling + brand positioning",
        "Visibility across YouTube, Spotify & Apple Podcasts",
      ],
    },
    {
      title: "Cover Feature",
      desc: "Premium placement for standout professionals and brands.",
      icon: Crown,
      highlight: true,
      points: [
        "Cover placement in The Glamlink Edit",
        "Full editorial feature / podcast included",
        "Highlighted across digital and social channels",
        "Positioned as a leading voice in the industry",
      ],
    },
    {
      title: "Med Spa / Business Feature",
      desc: "A full business spotlight designed to showcase your location, services and brand.",
      icon: Building2,
      points: [
        "Multi-page feature",
        "Interview and/or brand story",
        "Visual highlights of your space and offerings",
        "Strong positioning for trust and discovery",
      ],
    },
    {
      title: "Advertising",
      desc: "Full-page ad designed for visibility and awareness.",
      icon: Megaphone,
      points: [
        "Print + digital placement",
        "Clean editorial-style layout",
        "Ideal for promotions, services or brand awareness",
      ],
      note: "Recommended: 3-month minimum for best results",
    },
  ];

  return (
    <section className="section-glamlink container-glamlink">
      {/* HEADER */}
      <div className="max-w-xl mb-14">
        <SectionLabel>Opportunities</SectionLabel>

        <SectionHeading>Feature Opportunities</SectionHeading>

        <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
          Choose how you want to be seen. Each feature is designed to position
          you with intent — from editorial exposure to full-scale authority
          building.
        </p>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 gap-8">
        {features.map((item, i) => {
          const Icon = item.icon;

          return (
            <div
              key={i}
              className={`card-glamlink p-6 relative group ${
                item.highlight
                  ? "border-primary/40 shadow-[var(--shadow-medium)]"
                  : ""
              }`}
            >
              {/* ICON */}
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Icon className="w-5 h-5 text-primary" />
              </div>

              {/* TITLE */}
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>

              {/* DESC */}
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {item.desc}
              </p>

              {/* POINTS */}
              <ul className="space-y-2 mb-4">
                {item.points.map((p, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-primary" />
                    {p}
                  </li>
                ))}
              </ul>

              {/* NOTE */}
              {item.note && (
                <p className="text-xs text-primary mt-2">{item.note}</p>
              )}

              {/* HIGHLIGHT BADGE */}
              {item.highlight && (
                <span className="absolute top-4 right-4 text-[10px] uppercase tracking-wide text-primary">
                  Premium
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
