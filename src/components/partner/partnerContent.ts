/** Anchor id of the inquiry form section (target of the hero CTA). */
export const INQUIRY_SECTION_ID = "partner-inquiry";

export interface PartnershipWay {
  id: string;
  title: string;
  description: string;
  /** Replace with the final image path (e.g. "/partner/beauty-vault.jpg"). */
  image: string;
  imageAlt: string;
  /** Optional CSS object-position to control the crop. */
  imagePosition?: string;
}

/* Placeholder imagery from existing Glamlink assets — swap in final images here. */
export const PARTNERSHIP_WAYS: PartnershipWay[] = [
  {
    id: "beauty-vault",
    title: "The Beauty Vault",
    description: "Podcast features, expert conversations and sponsored opportunities.",
    image: "/podcastcover.png",
    imageAlt: "The Beauty Vault podcast, powered by Glamlink",
    imagePosition: "40% center",
  },
  {
    id: "journal",
    title: "Glamlink Journal",
    description: "Editorial features, expert contributions and digital placements.",
    image: "/magazine/glamlinkedit_112.jpeg",
    imageAlt: "The Glamlink Edit magazine cover",
    imagePosition: "center top",
  },
  {
    id: "brand-partnerships",
    title: "Brand Partnerships",
    description: "Integrated campaigns across Glamlink, social, podcast and editorial.",
    image: "/assets/shop-hero.jpg",
    imageAlt: "Beauty products and tools arranged on marble",
  },
  {
    id: "education-industry",
    title: "Education + Industry",
    description: "Trainings, events, software, manufacturers and other industry partnerships.",
    image:
      "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=800&q=75",
    imageAlt: "Beauty professionals together in a salon",
  },
];
