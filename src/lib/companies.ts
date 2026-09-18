import { getBlogsById } from "@/api/Api";
import { COMPANIES_SEED } from "@/data/companiesSeed";
import {
  Company,
  CompanyCategory,
  COMPANY_CATEGORY_LABELS,
} from "@/types/company";
import { TopicJournal } from "@/lib/topics";

/* --------------------------------
   Data loaders
-------------------------------- */

/**
 * TODO: replace with a real `GET company` API call once the backend adds a
 * Company entity — mirror getAllTopics()/getTopicById() in src/lib/topics.ts
 * (list endpoint + detail endpoint with relations) and delete
 * src/data/companiesSeed.ts. Wrapped in `cache()` now purely for parity with
 * that future shape.
 */
export async function getCompaniesList(): Promise<Company[]> {
  return COMPANIES_SEED;
}

export async function resolveCompany(idParam: string): Promise<Company | null> {
  const companies = await getCompaniesList();
  return companies.find((company) => company.id === idParam) ?? null;
}

/**
 * Related Articles are always fetched live by id — the seed only stores the
 * linkage (which article ids this company is tagged to), never a cached
 * copy of the article itself, so this section never goes stale.
 */
export async function getCompanyRelatedArticles(
  company: Company
): Promise<TopicJournal[]> {
  const ids = company.relatedJournalIds ?? [];
  if (ids.length === 0) return [];

  const results = await Promise.all(
    ids.map(async (id) => {
      try {
        const res = await getBlogsById(id);
        return (res?.data as TopicJournal) ?? null;
      } catch (error) {
        console.error(`Failed to load related article ${id}:`, error);
        return null;
      }
    })
  );

  return results.filter((article): article is TopicJournal => !!article);
}

/* --------------------------------
   Small display helpers
-------------------------------- */

export function getCompanyCategoryLabel(company: Company): string {
  return company.categoryLabel || COMPANY_CATEGORY_LABELS[company.category];
}

export function getCompanyLocation(
  company: Pick<Company, "city" | "state" | "country">
): string {
  return [company.city, company.state, company.country]
    .filter(Boolean)
    .join(", ");
}

export function getCompanyInitials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "C"
  );
}

export const COMPANY_CATEGORY_FILTERS: { value: CompanyCategory; label: string }[] = [
  { value: "brand", label: "Brands" },
  { value: "software", label: "Software Companies" },
  { value: "manufacturer", label: "Manufacturers" },
  { value: "other", label: "Other Businesses" },
];
