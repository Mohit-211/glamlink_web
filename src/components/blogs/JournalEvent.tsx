"use client";
import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const events = [
  { id: 1, title: "Glamlink Beauty Summit 2026", description: "A full day of masterclasses, panels, and live demos from top beauty founders and creators.", image: "https://picsum.photos/seed/beautysummit/600/400", date: "Aug 14, 2026", location: "New York, NY", type: "In-Person" },
  { id: 2, title: "Skincare Science Live Q&A", description: "Join dermatologists for a live session answering your most common skincare questions.", image: "https://picsum.photos/seed/skincareqa/600/400", date: "Aug 22, 2026", location: "Virtual", type: "Online" },
  { id: 3, title: "Indie Beauty Pop-Up Market", description: "Discover and shop from independent beauty brands in a curated pop-up experience.", image: "https://picsum.photos/seed/popupmarket/600/400", date: "Sep 5, 2026", location: "Los Angeles, CA", type: "In-Person" },
  { id: 4, title: "Hair Styling Workshop with Pro Stylists", description: "Hands-on workshop covering blowouts, updos, and heat-styling techniques.", image: "https://picsum.photos/seed/hairworkshop/600/400", date: "Sep 18, 2026", location: "Chicago, IL", type: "In-Person" },
];

const JournalEvent = () => {
  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-[11px] uppercase tracking-widest text-[#24bbcb] font-semibold">
          Save The Date
        </p>
        <h1 className="font-display text-2xl md:text-3xl tracking-tight">
          Upcoming Events
        </h1>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Meet the community, learn from experts, and experience beauty in
          person or online.
        </p>
      </div>

      {/* List */}
      <div className="space-y-5">
        {events.map((event) => (
          <div
            key={event.id}
            className="group flex flex-col sm:flex-row gap-5 border border-border/40 rounded-xl
              overflow-hidden bg-background hover:border-[#24bbcb]/50 hover:shadow-sm transition-all duration-200"
          >
            <div className="relative sm:w-56 aspect-[16/10] sm:aspect-auto bg-muted/30 flex-shrink-0 overflow-hidden">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex-1 p-5 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <span className="inline-block text-[10px] font-semibold uppercase tracking-wide text-[#24bbcb] bg-[#24bbcb]/10 px-2 py-1 rounded-full">
                  {event.type}
                </span>
                <h3 className="font-display text-base md:text-lg leading-snug group-hover:text-[#24bbcb] transition-colors">
                  {event.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
                  {event.description}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" /> {event.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> {event.location}
                  </span>
                </div>
                <Button
                  size="sm"
                  className="rounded-full bg-[#24bbcb] hover:bg-[#1ea5b4] text-white text-xs"
                >
                  Reserve Spot
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default JournalEvent;