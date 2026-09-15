/**
 * Fallback content for the Topic Detail page.
 *
 * The Topics feature is brand new — most topics don't have curated
 * `journals` / `professionals` / `shops` / `podcasts` relations yet. Rather
 * than leave those sections empty, each one shows this fallback: a fixed,
 * hand-picked set of genuinely-existing Glamlink content (real articles,
 * real shop products, real professionals, real podcast guests), so the page
 * still looks and feels complete.
 *
 * Every section that uses this data checks the topic's real relation first
 * and only falls back to these fixed picks when that relation is empty —
 * see src/app/topics/[id]/page.tsx.
 */

import { TopicExpert, TopicJournal } from "@/lib/topics";

export const FALLBACK_JOURNAL_ARTICLES: TopicJournal[] = [
  {
    id: 83,
    title: "Dr. Neil Vranis Advances Aesthetic and Revision Plastic Surgery in Beverly Hills",
    short_description:
      "At the forefront of surgical innovation, Dr. Neil Vranis is helping shape the next generation of plastic surgery, bringing emerging techniques, regenerative medicine, and a deeply individualized approach directly into patient care.",
    cover_image: "https://node.glamlink.net/images/images-1789272339627.png",
    publish_date: "2026-09-12T21:06:02.000Z",
    journal_category: { title: "Cover Feature" },
    journal_author: { name: "The Glamlink Edit" },
  },
  {
    id: 84,
    title: "Janna Ronert and IMAGE Skincare: GLP-1 Skin, Retinol, SPF and Professional Treatments",
    short_description:
      "IMAGE Skincare founder Janna Ronert talks GLP-1-related skin changes, simple skincare routines, retinol, sunscreen, and professional treatments worth knowing about.",
    cover_image: "https://node.glamlink.net/images/images-1789281496393.jpg",
    publish_date: "2026-09-12T23:37:48.000Z",
    journal_category: { title: "Professional Skincare" },
    journal_author: { name: "The Glamlink Edit" },
  },
  {
    id: 85,
    title: "Aesthetic Aftercare and What to Know About Post-Op Care After Plastic Surgery",
    short_description:
      "After years in nursing, including working together in the emergency room, Diana and Kristina created Aesthetic Aftercare to bring personalized recovery support directly to patients.",
    cover_image: "https://node.glamlink.net/images/images-1789365371586.png",
    publish_date: "2026-09-13T20:20:09.000Z",
    journal_category: { title: "Recovery" },
    journal_author: { name: "The Glamlink Edit" },
  },
  {
    id: 81,
    title: "Rethinking Recovery: Reshape Body Bar Brings a New Approach to Wellness in Las Vegas",
    short_description:
      "From hyperbaric oxygen and infrared sauna to contrast therapy, compression and float therapy, we explore what today's recovery technologies actually do.",
    cover_image: "https://node.glamlink.net/images/images-1788823404399.jpg",
    publish_date: "2026-09-06T15:19:43.000Z",
    journal_category: { title: "Recovery" },
    journal_author: { name: "The Glamlink Edit" },
  },
];

export interface FallbackProduct {
  id: number;
  title: string;
  brand: string;
  price: string;
  cover_image: string;
  category: string | null;
  link?: string;
}

export const FALLBACK_PRODUCTS: FallbackProduct[] = [
  {
    id: 7,
    title: "VOL.U.LIFT™ GLP-1 4D Skin Rebound Complex",
    brand: "Image",
    price: "134.00",
    cover_image: "https://node.glamlink.net/images/images-1788980727778.webp",
    category: "Skincare",
  },
  {
    id: 8,
    title: "DAILY PREVENTION Advanced Smartblend Mineral Moisturizer SPF 75",
    brand: "Image",
    price: "72.00",
    cover_image: "https://node.glamlink.net/images/images-1789002893561.webp",
    category: "Skincare",
  },
  {
    id: 9,
    title: "VITAL C Hydrating Enzyme Masque",
    brand: "Image",
    price: "46.00",
    cover_image: "https://node.glamlink.net/images/images-1789003094828.webp",
    category: "Skincare",
  },
  {
    id: 10,
    title: "VITAL C Hydrating Antioxidant A C E Serum",
    brand: "Image",
    price: "84.00",
    cover_image: "https://node.glamlink.net/images/images-1789003281558.webp",
    category: "Skincare",
  },
];

export interface FallbackPodcastGuest {
  id: number;
  name: string;
  short_description: string;
  schedule_date: string;
}

export const FALLBACK_PODCAST_GUESTS: FallbackPodcastGuest[] = [
  {
    id: 23,
    name: "Janna Ronert",
    short_description: "Founder of IMAGE Skincare",
    schedule_date: "2026-09-14",
  },
  {
    id: 25,
    name: "Christopher Khorsandi",
    short_description: "Plastic Surgeon — VIP Plastic Surgery",
    schedule_date: "2026-09-28",
  },
  {
    id: 26,
    name: "Keith O'Briant",
    short_description: "Hydrinity Founder",
    schedule_date: "2026-10-05",
  },
  {
    id: 22,
    name: "Reshape Body Bar",
    short_description: "Las Vegas Wellness Retreat",
    schedule_date: "2026-09-07",
  },
];

export interface FallbackTreatmentOption {
  id: number;
  label: string;
  image: string;
}

/**
 * Generic treatment-category tiles shown in the "Explore Treatment Options"
 * section. Topics don't have a curated relation for this yet, so every
 * topic shows this same evergreen set (mirrors the homepage's "Explore by
 * Topic" style grid) rather than leaving the section empty.
 */
export const FALLBACK_TREATMENT_OPTIONS: FallbackTreatmentOption[] = [
  { id: 1, label: "Skincare", image: "/assets/blog-1.jpg" },
  { id: 2, label: "Facials", image: "/assets/blog-2.jpg" },
  { id: 3, label: "Peels", image: "/assets/blog-3.jpg" },
  { id: 4, label: "Laser & Light Treatments", image: "/assets/blog-4.jpg" },
  { id: 5, label: "Prescription Options", image: "/assets/blog-5.jpg" },
  { id: 6, label: "Lifestyle & Wellness", image: "/assets/blog-6.jpg" },
];

export const FALLBACK_PROFESSIONALS: TopicExpert[] = [
  {
    id: 101,
    name: "Dr Neil Vranis",
    business_name: "Vranis Plastic Surgery",
    specialties: JSON.stringify([
      "Rhinoplasty",
      "Facelift",
      "Necklift",
      "Mommy Makeover",
    ]),
    locations: [{ city: "Beverly Hills", state: "CA" }],
    business_card_link: "https://glamlink.net/access-card/dr-neil-vranis",
  },
  {
    id: 133,
    name: "Michael Razzano",
    business_name: "Philly Facial Plastic Surgery",
    specialties: JSON.stringify([
      "Acne Facials",
      "Hydrafacial",
      "Microneedling",
    ]),
    locations: [{ city: "Philadelphia", state: "PA" }],
    business_card_link: "https://glamlink.net/access-card/michael-razzano",
  },
  {
    id: 100,
    name: "Joseph Jericho",
    business_name: "The Jericho Strategy",
    specialties: JSON.stringify([
      "Brand Growth",
      "Plastic Surgery Marketing",
      "Medical Aesthetics Marketing",
    ]),
    locations: [{ city: "Los Angeles", state: "CA" }],
    business_card_link: "https://glamlink.net/access-card/joseph-jericho",
  },
];
