/**
 * Seed data for the Company Directory.
 *
 * The Node API backing src/api/Api.tsx has no Company/Brand entity or
 * endpoint yet (see src/lib/companies.ts). Until one exists, this is the
 * source of truth for the directory's Companies tab, modeled on the same
 * "hand-picked, genuinely real content" approach as
 * src/data/topicFallbackContent.ts.
 *
 * `relatedJournalIds` link to real, existing journal article ids — the
 * Company Profile page fetches those live via getBlogsById rather than
 * duplicating article content here, so Related Articles always reflect the
 * live journal.
 *
 * To wire this up to a real backend later: replace COMPANIES_SEED with a
 * `GET company` call and this file can be deleted — see the TODO in
 * src/lib/companies.ts.
 */

import { Company } from "@/types/company";

export const COMPANIES_SEED: Company[] = [
  {
    id: "image-skincare",
    name: "IMAGE Skincare",
    category: "brand",
    categoryLabel: "Professional Skincare Brand",
    logo: "https://node.glamlink.net/images/images-1789281496393.jpg",
    description:
      "A professional skincare brand delivering clinically-backed formulas for every skin type, from clinics and spas to at-home routines.",
    about:
      "IMAGE Skincare develops professional-grade skincare formulated with clean, vegan ingredients and proven active ingredients. Founded by Janna Ronert, the brand partners with estheticians, med spas, and dermatology practices worldwide to deliver visible results across skincare, sun care, and treatment lines.",
    city: "Boca Raton",
    state: "FL",
    country: "United States",
    website: "https://imageskincare.com",
    email: "info@imageskincare.com",
    social: {
      instagram: "https://instagram.com/imageskincare",
      facebook: "https://facebook.com/imageskincare",
      linkedin: "https://linkedin.com/company/image-skincare",
    },
    links: {
      website: "https://imageskincare.com",
      education: "https://imageskincare.com/pages/education",
    },
    relatedJournalIds: [84],
  },
  {
    id: "glamlink",
    name: "Glamlink",
    category: "software",
    categoryLabel: "Beauty Business Software",
    logo: "/header_logo.png",
    description:
      "The digital access card and business platform built for beauty and wellness professionals to grow their client base and brand.",
    about:
      "Glamlink gives beauty professionals a shareable digital access card, booking links, and a discovery directory so clients can find and connect with them in one tap.",
    city: "Los Angeles",
    state: "CA",
    country: "United States",
    website: "https://glamlink.net",
    social: {
      instagram: "https://instagram.com/glamlink",
    },
    links: {
      website: "https://glamlink.net",
      directoryProfile: "https://glamlink.net/directory",
    },
  },
  {
    id: "aesthetic-aftercare",
    name: "Aesthetic Aftercare",
    category: "other",
    categoryLabel: "Post-Op Recovery Services",
    logo: "https://node.glamlink.net/images/images-1789365371586.png",
    description:
      "Personalized in-home recovery support for patients after plastic surgery and aesthetic procedures.",
    about:
      "Founded by two emergency-room nurses, Aesthetic Aftercare brings hands-on, personalized post-operative care directly to patients recovering from plastic surgery, easing the transition from surgery center to home.",
    country: "United States",
    website: "https://aestheticaftercare.com",
    social: {
      instagram: "https://instagram.com/aestheticaftercare",
    },
    links: {
      website: "https://aestheticaftercare.com",
      booking: "https://aestheticaftercare.com/book",
    },
    relatedJournalIds: [85],
  },
  {
    id: "reshape-body-bar",
    name: "Reshape Body Bar",
    category: "other",
    categoryLabel: "Wellness & Recovery Studio",
    logo: "https://node.glamlink.net/images/images-1788823404399.jpg",
    description:
      "A Las Vegas recovery and wellness studio offering hyperbaric oxygen, infrared sauna, contrast therapy, and float therapy.",
    about:
      "Reshape Body Bar brings modern recovery technologies — hyperbaric oxygen therapy, infrared sauna, cold plunge, compression, and float therapy — together under one roof for everyday wellness and post-treatment recovery.",
    city: "Las Vegas",
    state: "NV",
    country: "United States",
    website: "https://reshapebodybar.com",
    social: {
      instagram: "https://instagram.com/reshapebodybar",
    },
    links: {
      website: "https://reshapebodybar.com",
      booking: "https://reshapebodybar.com/book",
    },
    relatedJournalIds: [81],
  },
  {
    id: "hydrinity",
    name: "Hydrinity",
    category: "manufacturer",
    categoryLabel: "Skincare Manufacturer",
    description:
      "A hydration-focused skincare line formulated for post-procedure recovery and everyday barrier repair.",
    about:
      "Hydrinity formulates dermatologist-developed skincare centered on deep hydration and skin-barrier repair, designed to support skin through in-office treatments and daily wear alike.",
    country: "United States",
    website: "https://hydrinity.com",
    social: {
      instagram: "https://instagram.com/hydrinityskincare",
    },
    links: {
      website: "https://hydrinity.com",
    },
  },
  {
    id: "the-jericho-strategy",
    name: "The Jericho Strategy",
    category: "other",
    categoryLabel: "Marketing & Growth Agency",
    description:
      "A marketing agency specializing in brand growth for plastic surgery and medical aesthetics practices.",
    about:
      "The Jericho Strategy partners with plastic surgery and medical aesthetics practices on brand growth, marketing strategy, and digital presence.",
    city: "Los Angeles",
    state: "CA",
    country: "United States",
    social: {
      instagram: "https://instagram.com/thejerichostrategy",
      linkedin: "https://linkedin.com/company/the-jericho-strategy",
    },
    links: {},
  },
];
