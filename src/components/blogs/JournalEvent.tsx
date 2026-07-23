"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTypeBlogs } from "@/api/Api";
import Link from "next/link";
const JournalEvent = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await getTypeBlogs("event");
        console.log(res, "res")
        setEvents(res?.data?.rows || res || []);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);
  if (loading) {
    return (
      <section className="py-10">
        <div className="text-center text-muted-foreground">
          Loading events...
        </div>
      </section>
    );
  }
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
        {events.length > 0 ? (
          events.map((event: any) => (
            <div
              key={event.id}
              className="group flex flex-col sm:flex-row gap-5 border border-border/40 rounded-xl overflow-hidden bg-background hover:border-[#24bbcb]/50 hover:shadow-sm transition-all duration-200"
            >
              <div className="relative sm:w-56 aspect-[16/10] sm:aspect-auto bg-muted/30 flex-shrink-0 overflow-hidden">
                <img
                  src={event.cover_image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 p-5 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wide text-[#24bbcb] bg-[#24bbcb]/10 px-2 py-1 rounded-full">
                    {event.type || "Event"}
                  </span>
                  <h3 className="font-display text-base md:text-lg leading-snug group-hover:text-[#24bbcb] transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
                    {event.description ||
                      event.short_description ||
                      event.summary}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {new Date(event.event_date).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {event.location || "Virtual"}
                    </span>
                  </div>
                  <Link

                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="sm"
                      className="rounded-full bg-[#24bbcb] hover:bg-[#1ea5b4] text-white text-xs cursor-pointer"
                    >
                      Reserve Spot
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center text-muted-foreground">
            No events found.
          </div>
        )}
      </div>
    </section>
  );
};
export default JournalEvent;