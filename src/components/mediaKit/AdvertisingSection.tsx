"use client";

import SectionLabel from "./shared/SectionLabel";
import SectionHeading from "./shared/SectionHeading";

export default function AdvertisingSection() {
  return (
    <section className="section-glamlink container-glamlink">
      <div className="text-center mb-10">
        <SectionLabel>Advertising</SectionLabel>
        <SectionHeading>Make your brand visible</SectionHeading>
      </div>

      <div className="card-glamlink max-w-xl mx-auto">
        <p className="text-3xl font-semibold text-primary mb-2">
          $50 <span className="text-sm text-muted-foreground">/ issue</span>
        </p>

        <h3 className="font-medium mb-2">Full Page Ad</h3>

        <p className="text-sm text-muted-foreground mb-4">
          Clean editorial placement across print and digital.
        </p>

        <ul className="text-sm text-muted-foreground space-y-2">
          <li>→ Print + digital placement</li>
          <li>→ Editorial-style layout</li>
          <li>→ Brand awareness focused</li>
        </ul>
      </div>
    </section>
  );
}
