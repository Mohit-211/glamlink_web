"use client";

import { useState } from "react";
import { Search, MapPin, Sparkles } from "lucide-react";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="relative pt-24 lg:pt-32 pb-16 lg:pb-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container-glamlink">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-soft border border-primary/20 mb-8 animate-fade-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Trusted by 10,000+ beauty lovers
            </span>
          </div>

          {/* Headline */}
          <h1
            className="section-heading text-4xl sm:text-5xl lg:text-6xl mb-6 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            Discover Beauty Professionals{" "}
            <span className="gradient-text">Near You</span>
          </h1>

          {/* Subheadline */}
          <p
            className="section-subheading mx-auto mb-10 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Browse verified stylists, makeup artists, and beauty experts by
            location or specialty. Book instantly and look your best.
          </p>

          {/* Search Bar */}
          <div
            className="max-w-2xl mx-auto animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="search-pill flex-col sm:flex-row gap-3 sm:gap-2 p-3 sm:p-2">
              <div className="flex items-center gap-3 flex-1 px-2">
                <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Search by name, specialty, or service..."
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="hidden sm:block w-px h-8 bg-border" />

              <div className="flex items-center gap-3 flex-1 px-2">
                <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Location..."
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base"
                />
              </div>

              <button className="btn-primary shrink-0 py-3 px-6">Search</button>
            </div>
          </div>

          {/* Popular Searches */}
          <div
            className="flex flex-wrap items-center justify-center gap-2 mt-6 animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            <span className="text-sm text-muted-foreground">Popular:</span>
            {[
              "Hair Stylist",
              "Makeup Artist",
              "Nail Tech",
              "Lash Artist",
              "Barber",
            ].map((tag) => (
              <button
                key={tag}
                className="px-3 py-1.5 rounded-full bg-secondary text-sm font-medium text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
