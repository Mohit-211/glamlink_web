/** The lists a professional's or brand's page shows, each with a "View all" page. */
export const PROFILE_SECTIONS = {
  media: { title: "Media & Images", empty: "No photos or videos yet." },
  products: { title: "Products", empty: "No products yet." },
  education: { title: "Education", empty: "No education posts yet." },
  articles: { title: "In the Glamlink Journal", empty: "No articles yet." },
  podcast: { title: "Featured on The Beauty Vault", empty: "No episodes yet." },
  videos: { title: "Watch", empty: "No videos yet." },
  magazine: { title: "In the Magazine", empty: "No issues yet." },
} as const;

export type ProfileSection = keyof typeof PROFILE_SECTIONS;

export const isProfileSection = (value: string): value is ProfileSection => Object.hasOwn(PROFILE_SECTIONS, value);

export const profileSectionHref = (slug: string, section: ProfileSection, page = 1) =>
  `/profiles/${encodeURIComponent(slug)}/${section}${page > 1 ? `?page=${page}` : ""}`;

/** One education post's own page. */
export const educationHref = (slug: string, itemSlug: string) =>
  `/profiles/${encodeURIComponent(slug)}/education/${encodeURIComponent(itemSlug)}`;
