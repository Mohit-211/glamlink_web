import type { MagazineIssue } from "@/lib/api/types";

/* Magazine display helpers, safe for client components (no data fetching). */

/** The number in an issue title ("Issue 117" gives 117). */
export const issueNumberFrom = (title: string) => Number(title.match(/\d+/)?.[0] ?? 0) || null;

/** The Publuu embed the digital edition shows, or the flipbook's own link. */
export function flipbookEmbedUrl(issue: Pick<MagazineIssue, "flipbook">): string | null {
  const book = issue.flipbook;
  if (!book) return null;
  if (book.publuu_account_id && book.publuu_flipbook_id) {
    return `https://publuu.com/flip-book/${book.publuu_account_id}/${book.publuu_flipbook_id}/page/1?embed`;
  }
  return book.url || null;
}

/** "Issue 117" style number, from the API's field or the title. */
export const issueNumber = (issue: Pick<MagazineIssue, "issue_number" | "title">) =>
  issue.issue_number ?? issueNumberFrom(issue.title) ?? 0;
