"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Clock, BarChart2, CalendarDays } from "lucide-react";
import { getTypeBlogs } from "@/api/Api";
import Link from "next/link";

const levelColor: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-600",
  Intermediate: "bg-amber-500/10 text-amber-600",
  Advanced: "bg-rose-500/10 text-rose-600",
};

const JournalEducation = () => {
  const [educationItems, setEducationItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const res = await getTypeBlogs("education");
        console.log(res, "====>>")
        // Supports either:
        // { data: [...] }
        // or directly [...]
        setEducationItems(res?.data?.rows || res || []);
      } catch (error) {
        console.error("Failed to fetch education blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  if (loading) {
    return (
      <section className="py-10">
        <div className="text-center text-muted-foreground">
          Loading education articles...
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-[11px] uppercase tracking-widest text-[#24bbcb] font-semibold">
          Learn &amp; Grow
        </p>

        <h1 className="font-display text-2xl md:text-3xl tracking-tight">
          Beauty Education Hub
        </h1>

        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Guides, tutorials, and expert breakdowns to help you understand the
          &quot;why&quot; behind every beauty routine.
        </p>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {educationItems.length > 0 ? (
          educationItems.map((item: any) => (
            <Link
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div
                key={item.id}
                className="group border border-border/40 rounded-xl overflow-hidden bg-background hover:border-[#24bbcb]/50 hover:shadow-sm transition-all duration-200 cursor-pointer"
              >
                <div className="relative aspect-[16/10] bg-muted/30 overflow-hidden">
                  <img
                    src={item.cover_image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />

                  <span
                    className={`absolute top-3 left-3 text-[10px] font-semibold px-2 py-1 rounded-full ${levelColor[item.level || "Beginner"]
                      }`}
                  >
                    {item.level || "Beginner"}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <p className="text-[10px] uppercase tracking-widest text-[#24bbcb] font-semibold">
                    {item.category || item.type || "Education"}
                  </p>

                  <h3 className="font-display text-sm md:text-base leading-snug group-hover:text-[#24bbcb] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {item.description ||
                      item.short_description ||
                      item.summary}
                  </p>


                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground py-10">
            No education articles found.
          </div>
        )}
      </div>
    </section>
  );
};

export default JournalEducation;