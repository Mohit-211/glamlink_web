"use client";

import { useState } from "react";
import { Search } from "lucide-react";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="pt-40 pb-20 bg-white">
      <div className="container-glamlink">
        {/* Heading */}
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="section-heading text-3xl sm:text-4xl mb-3">
            Discover Beauty Professionals Near You
          </h1>

          <p className="section-subheading mb-6">
            Browse by location or speciality
          </p>

          {/* Search */}
          <div className="flex justify-center mb-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, specialty, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-border px-11 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Showing 4 professionals
          </p>
        </div>

        {/* Map + Card */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2 rounded-xl border overflow-hidden">
            <iframe
              title="Map"
              src="https://www.google.com/maps?q=Las%20Vegas&z=12&output=embed"
              className="w-full h-[420px]"
              loading="lazy"
            />
          </div>

          {/* Empty State Card */}
          <div className="h-[420px] rounded-xl border flex flex-col items-center justify-center text-center bg-white">
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
              <Search className="w-6 h-6 text-muted-foreground" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-foreground">
              Select a Professional
            </h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-[220px]">
              Click on a map marker to view their digital card
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
