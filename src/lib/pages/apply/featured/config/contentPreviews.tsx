"use client";

import { Star, MapPin, Sparkles, Crown } from "lucide-react";

export interface GifData {
  stillSrc: string;
  gifSrc: string;
  alt: string;
}

export interface ContentSection {
  id: string;
  title: string;
  subtitle?: string | null; // Optional subtitle field
  icon: null | string | boolean | React.ReactNode;
  color: string;
  description: string;
  benefits: string[];
  moreInfo?: string | null; // Optional additional information field
  gifData: GifData;
}

export const contentSections: ContentSection[] = [
  {
    id: "rising-star",
    title: "Be Seen As A Rising Star",
    subtitle: null,
    icon: false,
    color: "bg-glamlink-teal",
    description: "Our Rising Star highlights innovative professionals who are making waves in their specialty",
    benefits: [
      "Spotlight you and your journey",
      "Question led feature that sparks demand",
      "Build authority + credibility",
      "With your feature, you get a FREE profile on the new beauty/wellness platform",
      "Discoverable by your specialty & services-turn views into bookings and product sales from your feature"
    ],
    moreInfo: "**Limited placements. Apply to be considered-submissions may be offered Local Spotlight or Top Treatment.",
    gifData: {
      stillSrc: "/images/RisingStarPreview.png",
      gifSrc: "/videos/RisingStarPreview.mp4",
      alt: "Rising Star feature demonstration",
    },
  },
  {
    id: "local-spotlight",
    title: "Local Spotlight",
    subtitle: null,
    icon: false,
    color: "bg-glamlink-teal",
    description: "A small feature highlighting your services-built to be bookable",
    benefits: [
      "Your brand at a glance",
      "Share your location and favorite top treatments",
      "Build authority + credibility",
      "With your feature, you get a FREE profile on the new beauty/wellness platform",
      "Discoverable by your specialty & services-turn views into bookings and product sales from your feature"
    ],
    moreInfo: "Launch offer: <strong>free feature</strong> (limited amount, <strong>first approved</strong>). Reviews in <strong>3–5 days</strong>. We publish <strong>2 per issue</strong> in approval order. Pricing may apply later.",
    gifData: {
      stillSrc: "/images/LocalSpotlightPreview.png",
      gifSrc: "/videos/LocalSpotlightPreview.mp4",
      alt: "Local Spotlight feature demonstration",
    },
  },
  {
    id: "top-treatment",
    title: "Top Treatment",
    subtitle: null,
    icon: false,
    color: "bg-glamlink-teal",
    description: "Got a signature service that deserves the spotlight?",
    benefits: [
      "Raise awareness around your treatment",
      "Explain treatment and benefits",
      "Build authority + credibility",
      "With your feature, you get a FREE profile on the new beauty/wellness platform",
      "Discoverable by your specialty & services-turn views into bookings and product sales from your feature"
    ],
    moreInfo: null,
    gifData: {
      stillSrc: "/images/TopTreatmentPreview.png",
      gifSrc: "/videos/TopTreatmentPreview.mp4",
      alt: "Top Treatment feature demonstration",
    },
  },
  {
    id: "cover-feature",
    title: "Cover Feature",
    subtitle: null,
    icon: false,
    color: "bg-glamlink-teal",
    description: "Be the face of the cover",
    benefits: [
      "Share your story and achievements",
      "Show services and your niche",
      "Build authority + credibility",
      "With your feature, you receive a FREE profile on the new beauty/wellness platform",
      "Discoverable by your specialty & services-turn views into bookings and product sales from your feature"
    ],
    moreInfo: "*`Our covers highlight leaders in the space-generally established pros whose work and community impact are well-demonstrated.  Apply to be considered",
    gifData: {
      stillSrc: "/images/CoverFeatureProPreview.png",
      gifSrc: "/videos/CoverFeatureProPreview.mp4",
      alt: "Cover Feature demonstration",
    },
  },
  {
    id: "founding-profile",
    title: "Claim Your Founding Profile",
    subtitle: "FREE, Limited Time",
    icon: false,
    color: "bg-glamlink-teal",
    description: "Your feature in The Glamlink Edit connects directly to Glamlink, the new beauty/wellness app, so readers can discover you, see your work, and book.",
    benefits: [
      "Feature → Glamlink Profile",
      "Founding Pro Badge",
      "Be found for what you do-specialty & services with geolocation",
      "Tap-to-book, your way-add services and use Glamlink booking or your booking link (optional)",
      "Pro-led shop-sell your favorite professional products on Glamlink when you're ready (optional)",
      "Busy? Check \"Create it for me (free)\" and we'll draft your profile from your IG/website with your permission for your approval"
    ],
    moreInfo: "**Limited time offer**: Claim your founding profile status and be among the first professionals on the platform.",
    gifData: {
      stillSrc: "/images/GlamlinkProfile.png",
      gifSrc: "/videos/GlamlinkProfile.mp4",
      alt: "Glamlink founding profile demonstration",
    },
  },
];

// Function to get the appropriate icon for a section
export const getSectionIcon = (sectionId: string): React.ReactNode => {
  switch (sectionId) {
    case "rising-star":
      return <Star className="w-8 h-8" />;
    case "local-spotlight":
      return <MapPin className="w-8 h-8" />;
    case "top-treatment":
      return <Sparkles className="w-8 h-8" />;
    case "cover-feature":
      return <Crown className="w-8 h-8" />;
    case "founding-profile":
      return <Crown className="w-8 h-8" />;
    default:
      return null;
  }
};

// Function to get content sections with icons
export const getContentSectionsWithIcons = (): ContentSection[] => {
  return contentSections.map(section => {
    let finalIcon: React.ReactNode = null;

    // Handle different icon types
    if (section.icon === null || section.icon === false) {
      // No icon - keep as null
      finalIcon = null;
    } else if (section.icon === true) {
      // Use the default icon from getSectionIcon function
      finalIcon = getSectionIcon(section.id);
    } else if (typeof section.icon === 'string') {
      // Use the string value directly (could be text, emoji, etc.)
      finalIcon = <span className="text-2xl">{section.icon}</span>;
    } else {
      // Use the provided React.ReactNode directly
      finalIcon = section.icon;
    }

    return {
      ...section,
      icon: finalIcon
    };
  });
};