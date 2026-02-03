"use client";

import { Eye, Download, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Issue, issues2025, issues2026 } from "@/data/issues";

interface IssueCardProps {
  issue: Issue;
}

const IssueCard = ({ issue }: IssueCardProps) => {
  const router = useRouter();

  const handleViewIssue = () => {
    router.push(`/magazine/${issue.slug}`);
  };

  const handleDigitalEdition = () => {
    router.push(`/magazine/${issue.slug}/digital`);
  };

  return (
    <div className="group">
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-secondary">
        {issue.cover && (
          <img
            src={issue.cover}
            alt={issue.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        

        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent opacity-80" />
      </div>

      <div className="flex gap-2">
        {/* View Issue (optional) */}
        {/* 
        <Button
          variant="outline"
          onClick={handleViewIssue}
          className="flex-1 rounded-full text-sm h-10 border-border hover:border-primary hover:text-primary"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Issue
        </Button>
        */}

        <Button
          variant="outline"
          onClick={handleDigitalEdition}
          className="flex-1 rounded-full text-sm h-10 border-border hover:border-primary hover:text-primary"
        >
          <Download className="w-4 h-4 mr-2" />
          Digital Edition
        </Button>
      </div>
    </div>
  );
};

export default function MagazineIssues() {
  return (
    <section className="py-16 lg:py-24 bg-secondary/20">
      <div className="container-glamlink">

        {[ 
          { year: 2026, list: issues2026 },
          { year: 2025, list: issues2025 }
        ].map(({ year, list }) => (
          <div key={year} className="mb-20">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-2xl lg:text-3xl font-serif text-foreground">
                {year} Issues
              </h2>
              <div className="flex-1 h-px bg-border" />
              <span className="text-sm text-muted-foreground">
                {list.length} issues
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {list.map((issue) => (
                <IssueCard key={issue.slug} issue={issue} />
              ))}
            </div>
          </div>
        ))}

        <div className="text-center mt-16">
          <Button variant="outline" className="rounded-full px-8 py-6 text-base border-2">
            Browse Full Archive
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>

          {/* <p className="text-sm text-muted-foreground mt-4">
            {issues2025.length + issues2026.length} issues available in our archive
          </p> */}
        </div>

      </div>
    </section>
  );
}
