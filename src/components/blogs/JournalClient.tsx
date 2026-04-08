"use client";

import { useState } from "react";
import { Download, X, BookOpen, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CategoryNav from "./CategoryNav";
import BlogGrid from "./BlogGrid";
import HeroSection from "./HeroSection";
import { issues2025, issues2026, Issue } from "@/data/issues";
import { useRouter } from "next/navigation";

/* ───────────────────────────────────────────────────────────── */
/* Flipbook Panel (UNCHANGED) */
/* ───────────────────────────────────────────────────────────── */

const FlipbookPanel = ({
  issue,
  onClose,
}: {
  issue: Issue | null;
  onClose: () => void;
}) => {
  const router = useRouter();
  const isOpen = !!issue;

  const issueNum =
    issue?.title.match(/Issue\s*(\d+)/i)?.[1] ?? issue?.id?.toString() ?? "";

  const flipbookUrl =
    issue?.publuu?.accountId && issue?.publuu?.flipbookId
      ? `https://publuu.com/flip-book/${issue.publuu.accountId}/${issue.publuu.flipbookId}/page/1?embed`
      : issue?.flipbookUrl ?? null;

  const openMagazines = (slug: any) => {
    router.push(`/magazine/${slug}/digital`);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-300
          ${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-y-0 right-0 z-40 flex flex-col
          w-full sm:w-[500px] lg:w-[460px]
          bg-background border-l border-border/40 shadow-2xl
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 bg-muted/20">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-muted/60"
            >
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </button>

            {issue && (
              <div>
                <span className="block text-[11px] font-semibold text-[#24bbcb]">
                  Issue {issueNum}
                </span>
                <p className="text-sm font-semibold text-foreground truncate">
                  {issue.title}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted/60"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden bg-black/5 relative mt-6">
          {flipbookUrl ? (
            <iframe
              src={flipbookUrl}
              className="w-full h-full"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="h-12 w-12 opacity-20" />
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-t border-border/30">
          <Button
            size="sm"
            className="w-full rounded-full bg-[#24bbcb] text-white text-xs"
            onClick={() => openMagazines(issue?.slug)}
          >
            <Download className="mr-2 h-3.5 w-3.5" />
            Open Full Digital Edition
          </Button>
        </div>
      </div>
    </>
  );
};

/* ───────────────────────────────────────────────────────────── */
/* Magazine Sidebar */
/* ───────────────────────────────────────────────────────────── */

const MagazineSidebar = ({
  activeIssue,
  onIssueClick,
}: {
  activeIssue: Issue | null;
  onIssueClick: (issue: Issue) => void;
}) => {
  // 👉 Extract issue number safely
  const getIssueNumber = (issue: Issue) => {
    return Number(issue.title.match(/\d+/)?.[0] || 0);
  };
const router = useRouter();
  // 👉 Merge + sort ALL issues correctly
  const sortedIssues = [...issues2026, ...issues2025].sort(
    (a, b) => getIssueNumber(b) - getIssueNumber(a)
  );

  // 👉 Latest 3 issues (113, 112, 111)
  const latestIssues = sortedIssues.slice(0, 3);

  return (
    <div className="border border-border/40 rounded-xl bg-background shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="px-4 pt-5 pb-4 border-b border-border/30">
        <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">
          The Glamlink Edit
        </h2>

        <p className="text-xs text-[#24bbcb] font-semibold mt-1">
          Interactive Edition
        </p>

        <p className="text-[11px] text-muted-foreground mt-2">
          Explore | Discover | Watch | Shop
        </p>
      </div>

      {/* CURATED ISSUES */}
      <div className="p-3 space-y-2">
        {latestIssues.map((issue) => {
          const isActive = activeIssue?.slug === issue.slug;
          const issueNum = getIssueNumber(issue);

          return (
            <div
              key={issue.slug}
              onClick={() => onIssueClick(issue)}
              className={`
                group flex items-center gap-3 p-2.5 rounded-lg cursor-pointer
                border transition-all duration-200
                ${
                  isActive
                    ? "bg-[#24bbcb]/10 border-[#24bbcb]/40"
                    : "border-transparent hover:bg-[#24bbcb]/5"
                }
              `}
            >
              {/* Thumbnail */}
              <div className="w-12 h-16 rounded-md overflow-hidden bg-muted/30 flex-shrink-0">
                {issue.cover ? (
                  <img
                    src={issue.cover}
                    alt={issue.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-[#24bbcb]">
                    #{issueNum}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <span className="block text-[11px] font-semibold text-[#24bbcb]">
                  Issue {issueNum}
                </span>

                <p className="text-xs font-medium line-clamp-2 text-foreground group-hover:text-[#24bbcb]">
                  {issue.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER CTA */}
     <div className="px-4 py-3 border-t border-border/30 bg-muted/5">

  <Button
    variant="outline"
    size="sm"
    onClick={() => router.push("/magazine")}
    className="w-full rounded-full text-xs border-[#24bbcb]/40 hover:border-[#24bbcb] hover:text-[#24bbcb]"
  >
    View All Issues
  </Button>

      </div>
    </div>
  );
};

/* ───────────────────────────────────────────────────────────── */
/* MAIN LAYOUT */
/* ───────────────────────────────────────────────────────────── */

const JournalClient = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue((prev) => (prev?.slug === issue.slug ? null : issue));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Wide but controlled container */}
      <div className="max-w-[1700px] mx-auto px-8 xl:px-14 py-14">
        {/* Properly balanced grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_300px] xl:grid-cols-[240px_1fr_320px] gap-12 xl:gap-16">
          {/* LEFT */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 pr-4 xl:pr-6">
              <CategoryNav
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                vertical
              />
            </div>
          </aside>

          {/* CENTER — flexible, not greedy */}
          <main className="space-y-12 w-full max-w-[1100px] mx-auto">
            <HeroSection />
            <BlogGrid activeCategory={activeCategory} />
          </main>

          {/* RIGHT — guaranteed space */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-10 pl-4 xl:pl-6">
              <MagazineSidebar
                activeIssue={selectedIssue}
                onIssueClick={handleIssueClick}
              />

              <div className="border border-border/40 rounded-xl p-6 text-center text-sm text-muted-foreground">
                Ad Space
              </div>
            </div>
          </aside>
        </div>
      </div>

      <FlipbookPanel
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
      />
    </div>
  );
};

export default JournalClient;
