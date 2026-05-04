// src/data/issues.ts
export interface Issue {
  id: number;
  title: string;
  slug: string;
  cover?: string;
  // ✅ FIXED STRUCTURE
  publuu?: {
    accountId: number;
    flipbookId: number;
  };
  flipbookUrl?: string;
}
/* =======================
   2026 ISSUES
======================= */
export const issues2026: Issue[] = [
  {
    id: 1,
    slug: "issue-110",
    title: "Issue 110",
    cover: "/magazine/issue_110.jpg",
    publuu: {
      accountId: 992531,
      flipbookId: 2328224,
    },
  },
  {
    id: 2,
    slug: "issue-111",
    title: "Issue 111",
    cover: "/magazine/the_glamlink_edit.jpg",
    publuu: {
      accountId: 992531,
      flipbookId: 2357200,
    },
  },
  {
    id: 3,
    slug: "issue-112",
    title: "Issue 112",
    cover: "/magazine/glamlinkedit_112.jpeg",
    publuu: {
      accountId: 992531,
      flipbookId: 2383857,
    },
  },
  {
    id: 4,
    slug: "issue-113",
    title: "Issue 113",
    cover: "/magazine/issue_113.jpeg",
    publuu: {
      accountId: 992531,
      flipbookId: 2418451,
    },
  },
   {
    id: 5,
    slug: "issue-114",
    title: "Issue 114",
    cover: "/magazine/issue_114.jpeg",
    publuu: {
      accountId: 992531,
      flipbookId: 2453514,
    },
  },
];
/* =======================
   2025 ISSUES
======================= */
export const issues2025: Issue[] = [
  {
    id: 1,
    slug: "issue-109",
    title: "Issue 109",
    cover: "/magazine/issue_109.png",
    publuu: {
      accountId: 992531,
      flipbookId: 2282294,
    },
  },
  {
    id: 2,
    slug: "issue-108",
    title: "Issue 108",
    cover: "/magazine/issue_108.jpg",
    publuu: {
      accountId: 992531,
      flipbookId: 2236944,
    },
  },
  {
    id: 3,
    slug: "issue-107",
    title: "Issue 107",
    cover: "/magazine/issue_107.jpg",
    publuu: {
      accountId: 992531,
      flipbookId: 2215355,
    },
  },
  {
    id: 4,
    slug: "issue-106",
    title: "Issue 106",
    cover: "/magazine/issue_106.jpg",
    publuu: {
      accountId: 992531,
      flipbookId: 2186674,
    },
  },
  {
    id: 5,
    slug: "issue-105",
    title: "Issue 105",
    cover: "/magazine/issue_105.jpg",
    publuu: {
      accountId: 992531,
      flipbookId: 2214784,
    },
  },
  {
    id: 6,
    slug: "issue-104",
    title: "Issue 104",
    cover: "/magazine/issue_104.jpg",
    publuu: {
      accountId: 992531,
      flipbookId: 2214779,
    },
  },
];
export const allIssues: Issue[] = [...issues2026, ...issues2025];