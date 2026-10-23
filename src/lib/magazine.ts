import { issues2025, issues2026, type Issue } from "@/data/issues";
import { getIssue, getIssues } from "@/lib/api/public";
import type { MagazineIssue, MagazineIssueDetail } from "@/lib/api/types";
import { issueNumberFrom } from "@/lib/magazineFormat";

/*
 * Magazine issues come from the API (backend handoff, 10.10). Until the deployed
 * API serves them, the list the site shipped with (src/data/issues.ts) stands in,
 * in the API's shape, so every page reads one kind of issue.
 */

function fromBundled(issue: Issue): MagazineIssue {
  return {
    id: issue.id,
    slug: issue.slug,
    title: issue.title,
    issue_number: issueNumberFrom(issue.title),
    cover_image: issue.cover ?? null,
    publish_date: null,
    short_description: null,
    flipbook: issue.publuu
      ? { publuu_account_id: issue.publuu.accountId, publuu_flipbook_id: issue.publuu.flipbookId }
      : issue.flipbookUrl
        ? { url: issue.flipbookUrl }
        : null,
  };
}

/** The bundled issues, newest first. */
const bundledIssues = (): MagazineIssue[] =>
  [...issues2026, ...issues2025].map(fromBundled).sort((a, b) => (b.issue_number ?? 0) - (a.issue_number ?? 0));

/** Every published issue, newest first. */
export async function getMagazineIssues(): Promise<MagazineIssue[]> {
  const fromApi = await getIssues({ limit: 50 });
  return fromApi.rows.length > 0 ? fromApi.rows : bundledIssues();
}

/** One issue with who appears in it (no one, for a bundled stand-in). */
export async function getMagazineIssue(slug: string): Promise<MagazineIssueDetail | null> {
  const fromApi = await getIssue(slug);
  if (fromApi) return fromApi;
  const bundled = bundledIssues().find((issue) => issue.slug === slug);
  return bundled ? { ...bundled, features: [] } : null;
}
