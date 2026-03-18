'use client';

import { useState } from "react";
import { Download, X, BookOpen, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CategoryNav from "./CategoryNav";
import BlogGrid from "./BlogGrid";
import { issues2025, issues2026, Issue } from "@/data/issues";
import { useRouter } from "next/navigation";

// ── Flipbook Slide-in Panel ──────────────────────────────────────────────────
const FlipbookPanel = ({
  issue,
  onClose,
}: {

  issue: Issue | null;
  onClose: () => void;
}) => {
   const router = useRouter();

  const isOpen = !!issue;

  const issueNum = issue?.title.match(/Issue\s*(\d+)/i)?.[1] ?? issue?.id?.toString() ?? "";

  // Build publuu embed URL — expects issue.accountId + issue.flipbookId
  // OR issue.flipbookUrl as a fallback
const flipbookUrl =
  issue?.publuu?.accountId && issue?.publuu?.flipbookId
    ? `https://publuu.com/flip-book/${issue.publuu.accountId}/${issue.publuu.flipbookId}/page/1?embed`
    : issue?.flipbookUrl ?? null;
   const openMagazines = (slug:any) => {
  router.push(`/magazine/${slug}/digital`);
};


  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <div
        className={`
          fixed inset-y-0 right-0 z-40 flex flex-col
          w-full sm:w-[500px] lg:w-[460px]
          bg-background border-l border-border/40 shadow-2xl
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 bg-muted/20 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-muted/60 transition-colors flex-shrink-0"
              aria-label="Go back"
            >
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </button>
            {issue && (
              <div className="min-w-0">
                <span className="block text-[11px] font-semibold text-[#24bbcb]">
                  Issue {issueNum}
                </span>
                <p className="text-sm font-semibold text-foreground truncate leading-tight">
                  {issue.title}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted/60 transition-colors flex-shrink-0 ml-2"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Iframe */}
        <div className="flex-1 overflow-hidden bg-black/5 relative mt-6">
          {flipbookUrl ? (
            <iframe
              key={flipbookUrl} // remount on issue change
              src={flipbookUrl}
              width="100%"
              height="100%"
              scrolling="no"
              frameBorder={0}
              allow="clipboard-write; autoplay; fullscreen"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <BookOpen className="h-12 w-12 opacity-20" />
              <p className="text-sm text-center px-6">
                No flipbook URL configured for this issue.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border/30 bg-muted/10 flex-shrink-0">
          <Button
            size="sm"
            className="w-full rounded-full bg-[#24bbcb] hover:bg-[#1ea8b5] text-white text-xs shadow-md shadow-[#24bbcb]/20 transition-all duration-200"
            onClick={() => openMagazines(issue?.slug)}
            disabled={!flipbookUrl}
          >
            <Download className="mr-2 h-3.5 w-3.5" />
            Open Full Digital Edition
          </Button>
        </div>
      </div>
    </>
  );
};

// ── Sidebar Issue Card ───────────────────────────────────────────────────────
const SidebarIssueCard = ({
  issue,
  isActive,
  onClick,
}: {
  issue: Issue;
  isActive: boolean;
  onClick: () => void;
}) => {
  const issueNum =
    issue.title.match(/Issue\s*(\d+)/i)?.[1] || issue.id?.toString();

  return (
    <div
      onClick={onClick}
      className={`
        group flex items-center gap-3 p-2.5 rounded-lg cursor-pointer
        border transition-all duration-200
        ${isActive
          ? "bg-[#24bbcb]/10 border-[#24bbcb]/40 shadow-sm"
          : "border-transparent hover:bg-[#24bbcb]/5 hover:border-[#24bbcb]/15"
        }
      `}
    >
      {/* Thumbnail */}
      <div className="relative w-12 h-16 flex-shrink-0 rounded-md overflow-hidden bg-muted/30 shadow-sm">
        {issue.cover ? (
          <img
            src={issue.cover}
            alt={issue.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#24bbcb]/30 to-[#24bbcb]/10 flex items-center justify-center">
            <span className="text-[10px] font-bold text-[#24bbcb]">#{issueNum}</span>
          </div>
        )}
        {/* Active dot */}
        {isActive && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#24bbcb] ring-1 ring-white/60" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <span className="block text-[11px] font-semibold text-[#24bbcb] mb-0.5">
          Issue {issueNum}
        </span>
        <p
          className={`text-xs font-medium leading-snug line-clamp-2 transition-colors duration-200
            ${isActive ? "text-[#24bbcb]" : "text-foreground group-hover:text-[#24bbcb]"}
          `}
        >
          {issue.title}
        </p>
      </div>

      {/* Read icon */}
      <BookOpen
        className={`h-3.5 w-3.5 flex-shrink-0 transition-colors duration-200
          ${isActive ? "text-[#24bbcb]" : "text-muted-foreground/30 group-hover:text-[#24bbcb]"}
        `}
      />
    </div>
  );
};

// ── Magazine Sidebar ─────────────────────────────────────────────────────────
const MagazineSidebar = ({
  activeIssue,
  onIssueClick,
}: {
  activeIssue: Issue | null;
  onIssueClick: (issue: Issue) => void;
}) => {
  const [activeYear, setActiveYear] = useState<number>(2026);

  const issuesByYear: Record<number, Issue[]> = {
    2026: issues2026,
    2025: issues2025,
  };

  const years = Object.keys(issuesByYear).map(Number);
  const displayed = issuesByYear[activeYear] ?? [];

  return (
    <div className="border border-border/40 rounded-xl overflow-hidden bg-background shadow-sm">

      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-border/30">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">
            Magazines
          </h2>
          <div className="flex-1 h-px bg-[#24bbcb]" />
        </div>
        {/* Year tabs */}
        <div className="flex gap-1.5">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setActiveYear(year)}
              className={`
                px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200
                ${activeYear === year
                  ? "bg-[#24bbcb] text-white shadow-sm shadow-[#24bbcb]/30"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted/70"
                }
              `}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="p-2 max-h-[640px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#24bbcb]/20 scrollbar-track-transparent">
        {displayed.length > 0 ? (
          <ul className="space-y-0.5">
            {displayed.map((issue) => (
              <li key={issue.slug}>
                <SidebarIssueCard
                  issue={issue}
                  isActive={activeIssue?.slug === issue.slug}
                  onClick={() => onIssueClick(issue)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-8">
            No issues yet.
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border/30 bg-muted/5">
        <Button
          variant="outline"
          size="sm"
          className="
            w-full rounded-full text-xs border-[#24bbcb]/40
            hover:border-[#24bbcb] hover:bg-[#24bbcb]/5 hover:text-[#24bbcb]
            transition-all duration-200
          "
        >
          Browse Full Archive
        </Button>
      </div>
    </div>
  );
};

// ── Main Journal Layout ──────────────────────────────────────────────────────
const JournalClient = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const handleIssueClick = (issue: Issue) => {
    // Clicking the same issue again closes the panel
    setSelectedIssue((prev) => (prev?.slug === issue.slug ? null : issue));
  };

  return (
    <div className="min-h-screen bg-background">

      {/* ── PART 1: Category Nav ── */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryNav
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </div>
      </div>

      {/* ── PART 2 + 3: Blog + Sidebar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        <main className="flex-1 min-w-0">
          <BlogGrid activeCategory={activeCategory} />
        </main>

        <aside className="w-full lg:w-[300px] flex-shrink-0 lg:sticky lg:top-[72px] lg:self-start">
          <MagazineSidebar
            activeIssue={selectedIssue}
            onIssueClick={handleIssueClick}
          />
        </aside>
      </div>

      {/* ── Flipbook Panel (slides in from right) ── */}
      <FlipbookPanel
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
      />
    </div>
  );
};

export default JournalClient;