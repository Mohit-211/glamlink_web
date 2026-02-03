// src/data/issues.ts

export interface Issue {
    id: number;
    slug: string;
    title: string;
    cover?: string;
    publuu: {
        accountId: number;
        flipbookId: number;
    };
}

/* =======================
   2026 ISSUES
======================= */
export const issues2026: Issue[] = [
    {
        id: 1,
        slug: "issue-110",
        title: "Issue 110",
        cover:
            "https://p6aqvvqp5i.execute-api.us-east-2.amazonaws.com/images/cover/992531/2328224",
        publuu: {
            accountId: 992531,
            flipbookId: 2328224,
        },
    },
    //   {
    //     id: 2,
    //     slug: "issue-111",
    //     title: "Issue 111",
    //     cover:
    //         "https://p6aqvvqp5i.execute-api.us-east-2.amazonaws.com/images/cover/992531/2282294",
    //     publuu: {
    //       accountId: 992531,
    //       flipbookId: 2282294,
    //     },
    //   },
];

/* =======================
   2025 ISSUES
======================= */
export const issues2025: Issue[] = [
    {
        id: 1,
        slug: "issue-109",
        title: "Issue 109",
        cover:
            "https://p6aqvvqp5i.execute-api.us-east-2.amazonaws.com/images/cover/992531/2282294",
        publuu: {
            accountId: 992531,
            flipbookId: 2282294,
        },
    },
    {
        id: 2,
        slug: "issue-108",
        title: "Issue 108",
        cover:
            "https://p6aqvvqp5i.execute-api.us-east-2.amazonaws.com/images/cover/992531/2236944",
        publuu: {
            accountId: 992531,
            flipbookId: 2236944,
        },
    },
    {
        id: 3,
        slug: "issue-107",
        title: "Issue 107",
        cover:
            "https://p6aqvvqp5i.execute-api.us-east-2.amazonaws.com/images/cover/992531/2215355",
        publuu: {
            accountId: 992531,
            flipbookId: 2215355,
        },
    }, {
        id: 2,
        slug: "issue-106",
        title: "Issue 106",
        cover:
            "https://p6aqvvqp5i.execute-api.us-east-2.amazonaws.com/images/cover/992531/2186674",
        publuu: {
            accountId: 992531,
            flipbookId: 2186674,
        },
    }, {
        id: 2,
        slug: "issue-105",
        title: "Issue 105",
        cover:
            "https://p6aqvvqp5i.execute-api.us-east-2.amazonaws.com/images/cover/992531/2214784",
        publuu: {
            accountId: 992531,
            flipbookId: 2214784,
        },
    }, {
        id: 2,
        slug: "issue-104",
        title: "Issue 104",
        cover:
            "https://p6aqvvqp5i.execute-api.us-east-2.amazonaws.com/images/cover/992531/2214779",
        publuu: {
            accountId: 992531,
            flipbookId: 2214779,
        },
    },

];

/* Optional: full archive if needed */
export const allIssues: Issue[] = [...issues2026, ...issues2025];
