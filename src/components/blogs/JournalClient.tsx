"use client";
import { useState, useMemo } from "react";
import { Download, X, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CategoryNav from "./CategoryNav";
import BlogGrid from "./BlogGrid";
import HeroSection from "./HeroSection";
import { issues2025, issues2026, Issue } from "@/data/issues";
import { useRouter } from "next/navigation";
import EducationPage from "./JournalEducation";
/* ─────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────── */
const MOBILE_ISSUES_PER_PAGE = 4;
const SIDEBAR_ISSUES_PER_PAGE = 3;
/* ─────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────── */
const getIssueNumber = (issue: Issue) =>
  Number(issue.title.match(/\d+/)?.[0] || 0);
const allSortedIssues = [...issues2026, ...issues2025].sort(
  (a, b) => getIssueNumber(b) - getIssueNumber(a)
);
/* ─────────────────────────────────────────────────────────────
   Pagination controls (reusable)
───────────────────────────────────────────────────────────── */
const PaginationControls = ({
  page,
  totalPages,
  onPrev,
  onNext,
  compact = false,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  compact?: boolean;
}) => {
  if (totalPages <= 1) return null;
  return (
    <div className={`flex items-center justify-between gap-2 ${compact ? "pt-2" : "pt-3"}`}>
      <button
        onClick={onPrev}
        disabled={page === 1}
        className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground
          hover:text-[#24bbcb] disabled:opacity-30 disabled:cursor-not-allowed
          transition-colors duration-150"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        {!compact && "Prev"}
      </button>
      <span className="text-[11px] text-muted-foreground">
        {page} / {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={page === totalPages}
        className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground
          hover:text-[#24bbcb] disabled:opacity-30 disabled:cursor-not-allowed
          transition-colors duration-150"
      >
        {!compact && "Next"}
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
/* ─────────────────────────────────────────────────────────────
   Mobile Magazine Carousel (with pagination)
───────────────────────────────────────────────────────────── */
const MobileMagazineCarousel = ({
  onIssueClick,
}: {
  onIssueClick: (issue: Issue) => void;
}) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(allSortedIssues.length / MOBILE_ISSUES_PER_PAGE);
  const visibleIssues = useMemo(() => {
    const start = (page - 1) * MOBILE_ISSUES_PER_PAGE;
    return allSortedIssues.slice(start, start + MOBILE_ISSUES_PER_PAGE);
  }, [page]);
  return (
    <div className="lg:hidden mt-2 px-0.5">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase text-foreground tracking-wide">
          Latest Issues
        </h3>
        <span className="text-[10px] text-muted-foreground">
          {allSortedIssues.length} issues
        </span>
      </div>
      {/* Scrollable row */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {visibleIssues.map((issue) => {
          const issueNum = getIssueNumber(issue);
          return (
            <div
              key={issue.slug}
              onClick={() => onIssueClick(issue)}
              className="min-w-[100px] flex-shrink-0 cursor-pointer group"
            >
              <div className="w-full h-[134px] rounded-lg overflow-hidden bg-muted/30 border border-border/30 group-hover:border-[#24bbcb]/50 transition-colors">
                {issue.cover ? (
                  <img
                    src={issue.cover}
                    alt={issue.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-[#24bbcb] font-bold">
                    #{issueNum}
                  </div>
                )}
              </div>
              <p className="text-[11px] mt-1.5 text-center font-medium line-clamp-1 text-foreground group-hover:text-[#24bbcb] transition-colors">
                Issue {issueNum}
              </p>
            </div>
          );
        })}
      </div>
      {/* Pagination */}
      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        compact
      />
    </div>
  );
};
/* ─────────────────────────────────────────────────────────────
   Flipbook Panel
───────────────────────────────────────────────────────────── */
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
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-40 flex flex-col
          w-full sm:w-[480px] lg:w-[460px]
          bg-background border-l border-border/40 shadow-2xl
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 bg-muted/20">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-muted/60 flex-shrink-0"
            >
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </button>
            {issue && (
              <div className="min-w-0">
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
            className="p-1.5 rounded-lg hover:bg-muted/60 flex-shrink-0"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        {/* Flipbook */}
        <div className="flex-1 overflow-hidden bg-black/5 relative mt-6">
          {flipbookUrl ? (
            <iframe src={flipbookUrl} className="w-full h-full" allowFullScreen />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="h-12 w-12 opacity-20" />
            </div>
          )}
        </div>
        {/* Footer */}
        <div className="px-4 py-3 border-t border-border/30">
          <Button
            size="sm"
            className="w-full rounded-full bg-[#24bbcb] text-white text-xs"
            onClick={() => router.push(`/magazine/${issue?.slug}/digital`)}
          >
            <Download className="mr-2 h-3.5 w-3.5" />
            Open Full Digital Edition
          </Button>
        </div>
      </div>
    </>
  );
};
/* ─────────────────────────────────────────────────────────────
   Magazine Sidebar (desktop, with pagination)
───────────────────────────────────────────────────────────── */
const MagazineSidebar = ({
  activeIssue,
  onIssueClick,
}: {
  activeIssue: Issue | null;
  onIssueClick: (issue: Issue) => void;
}) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(allSortedIssues.length / SIDEBAR_ISSUES_PER_PAGE);
  const visibleIssues = useMemo(() => {
    const start = (page - 1) * SIDEBAR_ISSUES_PER_PAGE;
    return allSortedIssues.slice(start, start + SIDEBAR_ISSUES_PER_PAGE);
  }, [page]);
  return (
    <div className="border border-border/40 rounded-xl bg-background shadow-sm overflow-hidden">
      {/* Header */}
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
      {/* Issue list */}
      <div className="p-3 space-y-2">
        {visibleIssues.map((issue) => {
          const isActive = activeIssue?.slug === issue.slug;
          const issueNum = getIssueNumber(issue);
          return (
            <div
              key={issue.slug}
              onClick={() => onIssueClick(issue)}
              className={`group flex items-center gap-3 p-2.5 rounded-lg cursor-pointer
                border transition-all duration-200
                ${isActive
                  ? "bg-[#24bbcb]/10 border-[#24bbcb]/40"
                  : "border-transparent hover:bg-[#24bbcb]/5"
                }`}
            >
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
              <div className="flex-1 min-w-0">
                <span className="block text-[11px] font-semibold text-[#24bbcb]">
                  Issue {issueNum}
                </span>
                <p className="text-xs font-medium line-clamp-2 text-foreground group-hover:text-[#24bbcb] transition-colors">
                  {issue.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {/* Pagination */}
      <div className="px-4 pb-3">
        <PaginationControls
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        />
      </div>
      {/* Footer CTA */}
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
/* ─────────────────────────────────────────────────────────────
   MAIN LAYOUT
───────────────────────────────────────────────────────────── */
const JournalClient = ({ path }: { path: string }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue((prev) => (prev?.slug === issue.slug ? null : issue));
  };
  console.log(path,"path in client===")
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 xl:px-14 py-8 lg:py-14">
        {/* ── Mobile layout ── */}
        <div className="lg:hidden space-y-4">
          {/* Horizontal category nav */}
          <CategoryNav
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
          {/* Magazine carousel with pagination */}
          <MobileMagazineCarousel onIssueClick={handleIssueClick} />
          {path === "journal" &&
            <>
              <HeroSection />
              <BlogGrid activeCategory={activeCategory} />
            </>
          }
        </div>
        {/* ── Desktop 3-column layout ── */}
        <div className="hidden lg:grid grid-cols-[200px_1fr_300px] xl:grid-cols-[220px_1fr_300px] 2xl:grid-cols-[240px_1fr_320px] gap-10 xl:gap-14">
          {/* LEFT – category nav */}
          <aside>

            <div className="sticky top-28 pr-4">
              <CategoryNav
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                vertical
                path={path}
              />
            </div>

          </aside>
          {path === "journal" ?
            <main className="space-y-6 min-w-0">
              <HeroSection />
              <BlogGrid activeCategory={activeCategory} />
            </main>
            :
            <EducationPage />
          }
          {/* RIGHT – magazine sidebar */}
          <aside>
            <div className="sticky top-28 space-y-10 pl-4">
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