"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Search, X, Loader2, SearchX, Compass, Sparkles } from "lucide-react";
import { getAllTopics } from "@/api/Api";
import { Topic } from "@/lib/topics";
import TopicCard from "./TopicCard";

const SEARCH_DEBOUNCE_MS = 250;
const POPULAR_TOPICS_COUNT = 6;

const TopicsPageClient = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await getAllTopics();
        const rows: Topic[] = Array.isArray(res?.data) ? res.data : [];
        setTopics(rows.filter((topic) => topic?.is_active !== false));
      } catch (error) {
        console.error("Error fetching topics:", error);
        setTopics([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setIsSearching(false);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredTopics = useMemo(() => {
    if (!normalizedQuery) return topics;
    return topics.filter((topic) =>
      topic.name?.toLowerCase().includes(normalizedQuery)
    );
  }, [topics, normalizedQuery]);

  const popularTopics = useMemo(
    () => topics.slice(0, POPULAR_TOPICS_COUNT),
    [topics]
  );

  return (
    <div className="min-h-screen bg-white">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
         
        />
        <div className="relative max-w-[1200px] mx-auto px-5 sm:px-6 pt-28 pb-16 md:pt-36 md:pb-24">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-10 items-center">
            {/* Copy + search */}
            <div className="lg:py-12">
              <div className="inline-flex items-center gap-2 text-[10px] tracking-[.2em] uppercase text-[#24bbcb] font-medium mb-5 bg-[#24bbcb]/8 px-3.5 py-1.5 rounded-full">
                <Sparkles className="h-3 w-3" />
                Glamlink Topics
              </div>
              <h1 className="font-serif text-[clamp(34px,5vw,54px)] leading-[1.05] tracking-tight text-gray-900">
                Discover what you
                <br className="hidden sm:block" /> want to know
              </h1>
              <p className="mt-5 text-[15px] md:text-base leading-relaxed text-gray-500 font-light max-w-md">
                Explore beauty concerns, treatments, skincare, hair, and
                wellness through expert insights, trusted articles, and the
                professionals behind them — all organized by topic.
              </p>

              {/* Search */}
              <div className="mt-9 max-w-lg">
                <div
                  className="relative flex items-center rounded-full bg-white border border-gray-200
                    shadow-sm transition-colors duration-200 focus-within:border-[#24bbcb]
                    focus-within:ring-2 focus-within:ring-[#24bbcb]/15"
                >
                  <Search className="absolute left-5 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    role="searchbox"
                    aria-label="Search topics"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search topics, concerns, treatments..."
                    className="w-full bg-transparent pl-13 pr-12 py-4 text-[15px] text-gray-900
                      placeholder:text-gray-400 focus:outline-none rounded-full"
                  />
                  <div className="absolute right-4 flex items-center">
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 text-[#24bbcb] animate-spin" />
                    ) : searchInput ? (
                      <button
                        type="button"
                        onClick={() => setSearchInput("")}
                        aria-label="Clear search"
                        className="p-1 rounded-full text-gray-400 hover:text-[#24bbcb] hover:bg-gray-50 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                </div>

                {/* Popular topic chips */}
                {!loading && popularTopics.length > 0 && !searchInput && (
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <span className="text-[11px] uppercase tracking-widest text-gray-400 mr-1">
                      Popular
                    </span>
                    {popularTopics.map((topic) => (
                      <a
                        key={topic.id}
                        href={`/topics/${topic.slug || topic.id}`}
                        className="text-[13px] font-medium text-gray-600 bg-white px-3.5 py-1.5 rounded-full
                          border border-gray-200 hover:border-[#24bbcb]/50 hover:text-[#24bbcb] transition-colors duration-150"
                      >
                        {topic.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Editorial image panel */}
            <div className="relative hidden lg:block">
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(36,187,203,0.35)]">
                <Image
                  src="/assets/blog-featured.jpg"
                  alt="Glamlink beauty editorial"
                  fill
                  unoptimized={process.env.NODE_ENV === "development"}
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/10" />
              </div>

              {/* Floating stat card */}
              {/* <div className="absolute -bottom-6 -left-8 bg-white rounded-2xl shadow-xl border border-gray-100 px-5 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#24bbcb]/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-[#24bbcb]" />
                </div>
                <div>
                  <p className="font-serif text-lg text-gray-900 leading-none">
                    {topics.length || "—"}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {topics.length === 1 ? "topic" : "topics"} covered
                  </p>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* ── BROWSE ALL TOPICS ── */}
      <section className="max-w-[1200px] mx-auto px-5 sm:px-6 py-16 md:py-20">
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-[10px] tracking-[.15em] uppercase text-gray-400 mb-2">
              {normalizedQuery ? "Search results" : "Browse"}
            </p>
            <h2 className="font-serif text-3xl text-gray-900">
              {normalizedQuery ? `Topics matching "${searchQuery}"` : "All Topics"}
            </h2>
            {!normalizedQuery && (
              <p className="text-sm text-gray-500 font-light mt-2 max-w-md">
                Every concern, treatment, and specialty Glamlink covers —
                pick one to dive into expert insights, articles, and trusted
                professionals.
              </p>
            )}
          </div>
          {!loading && (
            <p className="text-[12px] text-gray-400 hidden sm:block">
              {filteredTopics.length}{" "}
              {filteredTopics.length === 1 ? "topic" : "topics"}
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl overflow-hidden border border-gray-100"
              >
                <div className="w-full aspect-[16/9] bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            {normalizedQuery ? (
              <SearchX className="h-8 w-8 text-gray-300" />
            ) : (
              <Compass className="h-8 w-8 text-gray-300" />
            )}
            <p className="text-sm font-medium text-gray-800">
              {normalizedQuery
                ? `No topics match "${searchQuery}"`
                : "No topics available yet."}
            </p>
            <p className="max-w-sm text-xs text-gray-400">
              {normalizedQuery
                ? "Try a different keyword, or browse everything we currently cover."
                : "Check back soon — we're building out topic coverage."}
            </p>
            {normalizedQuery && (
              <button
                onClick={() => setSearchInput("")}
                className="text-xs font-medium text-[#24bbcb] hover:underline mt-1"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTopics.map((topic, index) => (
              <div
                key={topic.id}
                className="animate-fade-up"
                style={{ animationDelay: `${Math.min(index, 8) * 0.05}s` }}
              >
                <TopicCard topic={topic} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default TopicsPageClient;
