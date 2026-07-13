"use client";
import Image from "next/image";
import { Clock, BarChart2 } from "lucide-react";

const educationItems = [
  { id: 1, title: "Skincare 101: Building Your Perfect Routine", description: "Learn the fundamentals of a daily skincare routine tailored to your skin type, from cleansing to SPF.", image: "https://picsum.photos/seed/skincare101/600/375", category: "Skincare", level: "Beginner", duration: "12 min read" },
  { id: 2, title: "The Science of Hair Color: What Really Happens", description: "A deep dive into hair pigmentation, bleaching, and how to keep color-treated hair healthy and vibrant.", image: "https://picsum.photos/seed/haircolor/600/375", category: "Hair", level: "Intermediate", duration: "9 min read" },
  { id: 3, title: "Mastering Makeup Application for Beginners", description: "Step-by-step guidance on foundation, blending, and creating a natural everyday look.", image: "https://picsum.photos/seed/makeupbasics/600/375", category: "Makeup", level: "Beginner", duration: "15 min read" },
  { id: 4, title: "Understanding Ingredient Labels Like a Pro", description: "Decode common cosmetic ingredients so you can shop smarter and avoid what doesn't work for you.", image: "https://picsum.photos/seed/ingredients/600/375", category: "Wellness", level: "Intermediate", duration: "7 min read" },
  { id: 5, title: "Nail Care Fundamentals: Health Before Polish", description: "Why nail health matters more than color, and the routine that keeps nails strong between manicures.", image: "https://picsum.photos/seed/nailcare/600/375", category: "Nails", level: "Beginner", duration: "6 min read" },
  { id: 6, title: "Advanced Contouring Techniques", description: "Take your contour and highlight game further with professional blending tools and tricks.", image: "https://picsum.photos/seed/contouring/600/375", category: "Makeup", level: "Advanced", duration: "11 min read" },
];

const levelColor: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-600",
  Intermediate: "bg-amber-500/10 text-amber-600",
  Advanced: "bg-rose-500/10 text-rose-600",
};

const JournalEducation = () => {
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
        {educationItems.map((item) => (
          <div
            key={item.id}
            className="group border border-border/40 rounded-xl overflow-hidden bg-background
              hover:border-[#24bbcb]/50 hover:shadow-sm transition-all duration-200 cursor-pointer"
          >
            <div className="relative aspect-[16/10] bg-muted/30 overflow-hidden">
              <Image
                src={item?.image}
                alt={item?.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span
                className={`absolute top-3 left-3 text-[10px] font-semibold px-2 py-1 rounded-full ${levelColor[item.level]}`}
              >
                {item.level}
              </span>
            </div>
            <div className="p-4 space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-[#24bbcb] font-semibold">
                {item.category}
              </p>
              <h3 className="font-display text-sm md:text-base leading-snug group-hover:text-[#24bbcb] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {item.description}
              </p>
              <div className="flex items-center gap-3 pt-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {item.duration}
                </span>
                <span className="flex items-center gap-1">
                  <BarChart2 className="h-3 w-3" /> {item.level}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default JournalEducation;