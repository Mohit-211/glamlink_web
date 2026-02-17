"use client";

import { Download, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Issue, issues2025, issues2026 } from "@/data/issues";

interface IssueCardProps {
  issue: Issue;
}

const IssueCard = ({ issue }: IssueCardProps) => {
  const router = useRouter();

  const handleDigitalEdition = () => {
    router.push(`/magazine/${issue.slug}/digital`);
  };

  // Extract issue number (fallback to id)
  const issueNum =
    issue.title.match(/Issue\s*(\d+)/i)?.[1] || issue.id.toString();

  return (
    <div
      className="
        group relative overflow-hidden rounded-xl sm:rounded-2xl 
        bg-muted/10 shadow-md hover:shadow-xl hover:shadow-[#24bbcb]/20 
        transition-all duration-400 ease-out
        border border-border/30 hover:border-[#24bbcb]/30
      "
    >
      {/* Cover */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {issue.cover && (
          <img
            src={issue.cover}
            alt={issue.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-800 ease-out group-hover:scale-[1.04]"
            loading="lazy"
          />
        )}

        {/* Very light bottom gradient – just enough for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent pointer-events-none" />

        {/* Text overlay – white + text-shadow for contrast on dark covers */}
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white">
          <div className="flex items-center gap-3 mb-2 sm:mb-3">
            <span className="inline-flex px-2.5 py-1 rounded-full text-xs sm:text-sm font-semibold bg-[#24bbcb]/85 text-white backdrop-blur-sm border border-[#24bbcb]/40 shadow-sm">
              Issue {issueNum}
            </span>
          </div>

          <h3
            className="
              font-serif text-lg sm:text-2xl lg:text-2.5xl  
              leading-tight tracking-tight line-clamp-2
              drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] 
              group-hover:drop-shadow-[0_3px_12px_rgba(0,0,0,1)]
              transition-all duration-400
            "
          >
            {issue.title}
          </h3>
        </div>

        {/* Minimal hover shine */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-600 bg-gradient-to-br from-white/15 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Action button – revealed on hover (desktop), always visible on mobile */}
      <div className="absolute bottom-4 left-4 right-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 md:block hidden">
        <Button
          onClick={handleDigitalEdition}
          className="
            w-full rounded-full bg-[#24bbcb] hover:bg-[#1ea8b5] text-white 
            shadow-lg shadow-[#24bbcb]/30 hover:shadow-xl hover:shadow-[#24bbcb]/40 
            transition-all duration-300 font-medium text-sm sm:text-base
            active:scale-[0.98]
          "
        >
          <Download className="mr-2 h-4 w-4" />
          Digital Edition
        </Button>
      </div>

      {/* Mobile fallback – always visible, subtle */}
      <div className="p-5 pt-3 md:hidden bg-gradient-to-t from-background/90 to-transparent">
        <Button
          onClick={handleDigitalEdition}
          className="w-full rounded-full bg-[#24bbcb]/95 hover:bg-[#24bbcb] text-white text-sm"
        >
          <Download className="mr-2 h-4 w-4" />
          Digital Edition
        </Button>
      </div>
    </div>
  );
};

export default function MagazineIssues() {
  const sections = [
    { year: 2026, issues: issues2026 },
    { year: 2025, issues: issues2025 },
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-background to-secondary/5">
      <div className="container-glamlink max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {sections.map(({ year, issues }) => (
          <div key={year} className="mb-16 lg:mb-20">
            <div className="flex items-baseline justify-between gap-4 mb-8 lg:mb-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif  tracking-tight text-foreground">
                {year}
              </h2>
              <span className="text-sm sm:text-base font-medium text-muted-foreground tabular-nums">
                {issues.length} issues
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {issues.map((issue) => (
                <IssueCard key={issue.slug} issue={issue} />
              ))}
            </div>
          </div>
        ))}

        <div className="mt-12 lg:mt-16 text-center">
          <Button
            variant="outline"
            className="
              rounded-full px-8 py-6 text-base border-2 border-[#24bbcb]/50 
              hover:border-[#24bbcb] hover:bg-[#24bbcb]/5 hover:text-[#24bbcb] 
              transition-all duration-300 group
            "
          >
            Browse Full Archive
            <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
