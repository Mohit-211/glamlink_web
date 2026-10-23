/** The lists a professional's or brand's page shows, each with a "See all" page. */
export const PROFILE_SECTIONS = {
  products: { title: "Products", empty: "No products yet." },
  articles: { title: "Featured in the Journal", empty: "No articles yet." },
  videos: { title: "Watch", empty: "No videos yet." },
  magazine: { title: "In the Magazine", empty: "No issues yet." },
} as const;

export type ProfileSection = keyof typeof PROFILE_SECTIONS;

export const isProfileSection = (value: string): value is ProfileSection => value in PROFILE_SECTIONS;

export const profileSectionHref = (slug: string, section: ProfileSection, page = 1) =>
  `/profiles/${encodeURIComponent(slug)}/${section}${page > 1 ? `?page=${page}` : ""}`;
