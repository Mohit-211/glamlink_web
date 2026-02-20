// Import default content for templates
import { magazineClosingDefaults } from '@/lib/pages/admin/components/magazine/web/editor/config/content-defaults/magazine-closing-defaults';
import { topProductSpotlightDefaults } from '@/lib/pages/admin/components/magazine/web/editor/config/content-defaults/top-product-spotlight-defaults';
import { topTreatmentDefaults } from '@/lib/pages/admin/components/magazine/web/editor/config/content-defaults/top-treatment-defaults';
import { risingStarDefaults } from '@/lib/pages/admin/components/magazine/web/editor/config/content-defaults/rising-star-defaults';
import { coverProFeatureDefaults } from '@/lib/pages/admin/components/magazine/web/editor/config/content-defaults/cover-pro-feature-defaults';
import { mariesCornerDefaults } from '@/lib/pages/admin/components/magazine/web/editor/config/content-defaults/maries-corner-defaults';
import { coinDropDefaults } from '@/lib/pages/admin/components/magazine/web/editor/config/content-defaults/coin-drop-defaults';
import { glamlinkStoriesDefaults } from '@/lib/pages/admin/components/magazine/web/editor/config/content-defaults/glamlink-stories-defaults';
import { spotlightCityDefaults } from '@/lib/pages/admin/components/magazine/web/editor/config/content-defaults/spotlight-city-defaults';

// Custom pre-configured templates for custom sections
export interface CustomTemplate {
  name: string;
  description: string;
  icon?: string;
  data: any; // Full section data including content blocks
}

export const customTemplates: CustomTemplate[] = [
  // Rising Star Feature Template
  {
    name: "Rising Star Feature",
    description: "Complete rising star profile with bio, achievements, gallery, and social links",
    icon: "⭐",
    data: {
      type: "custom-section",
      title: "Rising Star",
      id: `section-${Date.now()}-rising-star`,
      subtitle: "Featured Professional Spotlight",
      content: {
        urlSlug: "rising-star",
        contentBlocks: [
          {
            id: `block-${Date.now()}-1`,
            type: "StarProfile",
            category: "rising-star",
            enabled: true,
            order: 0,
            props: risingStarDefaults.StarProfile,
            backgroundColor: "transparent",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0,
          },
          {
            id: `block-${Date.now()}-2`,
            type: "RichContent",
            category: "shared",
            enabled: true,
            order: 1,
            props: risingStarDefaults.RichContent,
            backgroundColor: "transparent",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0,
          },
          {
            id: `block-${Date.now()}-3`,
            type: "AchievementsGrid",
            category: "rising-star",
            enabled: true,
            order: 2,
            props: risingStarDefaults.AchievementsGrid,
            backgroundColor: "transparent",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0,
          },
          {
            id: `block-${Date.now()}-4`,
            type: "PhotoGallery",
            category: "shared",
            enabled: true,
            order: 3,
            props: risingStarDefaults.PhotoGallery,
            backgroundColor: "transparent",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0,
          },
          {
            id: `block-${Date.now()}-5`,
            type: "SocialLinks",
            category: "shared",
            enabled: true,
            order: 4,
            props: risingStarDefaults.SocialLinks,
            backgroundColor: "transparent",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0,
          },
        ],
        sectionBorder: true,
        layout: "single-column",
        titleAlignment: "center",
        titleFontSize: "text-3xl md:text-4xl",
        titleFontWeight: "font-bold",
        titleFontFamily: "font-sans",
        subtitleAlignment: "center",
        subtitleFontSize: "text-lg md:text-xl",
        subtitleFontWeight: "font-medium",
        subtitleColor: "text-gray-600",
        subtitleFontFamily: "font-sans",
      }
    }
  },
  
  // Top Treatment Showcase Template
  {
    name: "Top Treatment Showcase",
    description: "Complete treatment feature with before/after, details, pro insights, and rich content",
    icon: "💆",
    data: {
      type: "custom-section",
      title: "Top Treatment",
      id: `section-${Date.now()}-treatment`,
      subtitle: "This Week's Featured Treatment",
      content: {
        urlSlug: "top-treatment",
        contentBlocks: [
          {
            id: `block-${Date.now()}-6`,
            type: "BeforeAfterImages",
            category: "top-treatment",
            enabled: true,
            order: 0,
            props: topTreatmentDefaults.BeforeAfterImages,
            backgroundColor: "transparent",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0,
          },
          {
            id: `block-${Date.now()}-7`,
            type: "TreatmentDetails",
            category: "top-treatment",
            enabled: true,
            order: 1,
            props: topTreatmentDefaults.TreatmentDetails,
            backgroundColor: "transparent",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0,
          },
          {
            id: `block-${Date.now()}-8`,
            type: "ProInsights",
            category: "top-treatment",
            enabled: true,
            order: 2,
            props: topTreatmentDefaults.ProInsights,
            backgroundColor: "transparent",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0,
          },
          {
            id: `block-${Date.now()}-9`,
            type: "RichContent",
            category: "shared",
            enabled: true,
            order: 3,
            props: {
              ...topTreatmentDefaults.RichContent.introduction,
              backgroundColor: "#ffffff",
            },
            backgroundColor: "transparent",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0,
          },
          {
            id: `block-${Date.now()}-10`,
            type: "RichContent",
            category: "shared",
            enabled: true,
            order: 4,
            props: topTreatmentDefaults.RichContent.expectedResults,
            backgroundColor: "transparent",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0,
          },
          {
            id: `block-${Date.now()}-11`,
            type: "RichContent",
            category: "shared",
            enabled: true,
            order: 5,
            props: topTreatmentDefaults.RichContent.goodToKnow,
            backgroundColor: "transparent",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0,
          },
        ],
        sectionBorder: true,
        layout: "single-column",
        titleAlignment: "center",
        titleFontSize: "text-3xl md:text-4xl",
        titleFontWeight: "font-bold",
        titleFontFamily: "font-sans",
        subtitleAlignment: "center",
        subtitleFontSize: "text-lg md:text-xl",
        subtitleFontWeight: "font-medium",
        subtitleColor: "text-glamlink-teal",
        subtitleFontFamily: "font-sans",
      }
    }
  },
  
  // Product Spotlight Complete Template
  {
    name: "Product Spotlight Complete",
    description: "Full product showcase with details, gallery, and similar products",
    icon: "🛍️",
    data: {
      type: "custom-section",
      title: "Top Product Spotlight",
      id: `section-${Date.now()}-product`,
      subtitle: "This Week's Must-Have Product",
      content: {
        urlSlug: "product-spotlight",
        contentBlocks: [
          {
            id: `block-${Date.now()}-12`,
            type: "ProductDetails",
            category: "top-product-spotlight",
            enabled: true,
            order: 0,
            props: topProductSpotlightDefaults.ProductDetails,
            backgroundColor: "transparent",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0,
          },
          {
            id: `block-${Date.now()}-13`,
            type: "PhotoGalleryProducts",
            category: "shared",
            enabled: true,
            order: 1,
            props: topProductSpotlightDefaults.PhotoGalleryProducts,
            backgroundColor: "transparent",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0,
          },
        ],
        sectionBorder: true,
        layout: "single-column",
        titleAlignment: "center",
        titleFontSize: "text-3xl md:text-4xl",
        titleFontWeight: "font-bold",
        titleFontFamily: "font-sans",
        subtitleAlignment: "center",
        subtitleFontSize: "text-lg md:text-xl",
        subtitleFontWeight: "font-medium",
        subtitleColor: "text-gray-600",
        subtitleFontFamily: "font-sans",
      }
    }
  },
  
  // Magazine Closing Package Template
  {
    name: "Magazine Closing Package",
    description: "Complete closing section with next issue preview, spotlight reel, and call to action",
    icon: "🎬",
    data: {
      type: "custom-section",
      title: "Until Next Time",
      id: `section-${Date.now()}-closing`,
      subtitle: "See You Next Week",
      content: {
        urlSlug: "magazine-closing",
        contentBlocks: [
          {
            id: `block-${Date.now()}-14`,
            type: "NextIssuePreview",
            category: "magazine-closing",
            enabled: true,
            order: 0,
            props: magazineClosingDefaults.NextIssuePreview,
            backgroundColor: "transparent",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0,
          },
          {
            id: `block-${Date.now()}-15`,
            type: "SpotlightReel",
            category: "magazine-closing",
            enabled: true,
            order: 1,
            props: magazineClosingDefaults.SpotlightReel,
            backgroundColor: "transparent",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0,
          },
          {
            id: `block-${Date.now()}-16`,
            type: "CallToAction",
            category: "shared",
            enabled: true,
            order: 2,
            props: magazineClosingDefaults.CallToAction,
            backgroundColor: "transparent",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0,
          },
        ],
        sectionBorder: true,
        layout: "single-column",
        titleAlignment: "center",
        titleFontSize: "text-3xl md:text-4xl",
        titleFontWeight: "font-bold",
        titleFontFamily: "font-sans",
        subtitleAlignment: "center",
        subtitleFontSize: "text-lg md:text-xl",
        subtitleFontWeight: "font-medium",
        subtitleColor: "text-gray-600",
        subtitleFontFamily: "font-sans",
      }
    }
  },
  
  // Cover Pro Feature Template
  {
    name: "Cover Pro Feature",
    description: "Complete professional feature with bio, journey story, achievements, and gallery",
    icon: "👤",
    data: {
      type: "custom-section",
      title: "Cover Pro Feature",
      id: `section-${Date.now()}-cover-pro`,
      subtitle: "Melanie Marks: Building the Future of Beauty",
      content: {
        urlSlug: "cover-feature-pro",
        titleAlignment: "left",
        titleFontSize: "text-3xl md:text-4xl",
        titleFontFamily: "font-[Montserrat,sans-serif]",
        titleColor: "text-gray-900",
        subtitleAlignment: "left",
        subtitleFontSize: "text-lg md:text-xl",
        subtitleFontFamily: "font-[Roboto,sans-serif]",
        layout: "single-column",
        contentBlocks: [
          {
            id: `block-${Date.now()}-17`,
            type: "ProfessionalProfile",
            category: "cover-pro-feature",
            enabled: true,
            order: 0,
            props: coverProFeatureDefaults.ProfessionalProfile,
            backgroundColor: "transparent",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0,
          },
          {
            id: `block-${Date.now()}-18`,
            type: "RichContent",
            category: "shared",
            enabled: true,
            order: 1,
            props: coverProFeatureDefaults.RichContent,
            backgroundColor: "transparent",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0,
          },
          {
            id: `block-${Date.now()}-19`,
            type: "SectionHeader",
            category: "shared",
            enabled: true,
            order: 2,
            props: coverProFeatureDefaults.SectionHeader,
            backgroundColor: "transparent",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0,
          },
          {
            id: `block-${Date.now()}-20`,
            type: "AccoladesList",
            category: "cover-pro-feature",
            enabled: true,
            order: 3,
            props: coverProFeatureDefaults.AccoladesList,
            backgroundColor: "transparent",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0,
          },
          {
            id: `block-${Date.now()}-21`,
            type: "PhotoGallery",
            category: "shared",
            enabled: true,
            order: 4,
            props: coverProFeatureDefaults.PhotoGallery,
            backgroundColor: "transparent",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0,
          },
        ],
      }
    }
  },
  
  // Marie's Corner Template
  {
    name: "Marie's Corner",
    description: "Professional column layout with author badge, main story, tips, and social follow",
    icon: "✍️",
    data: {
      type: "custom-section",
      title: "From The Treatment Room",
      id: `section-${Date.now()}-maries`,
      subtitle: "Retinol: The Beauty Myth That's Aging Your Skin",
      subtitle2: "Why one skincare expert says its time to rethink the industry's \"gold standard\" ingredient and what to do instead",
      backgroundColor: "#FAF7F2",
      content: {
        urlSlug: "maries-corner",
        layout: "flex-columns",
        column1Width: 62,
        column2Width: 38,
        column3Width: 0,
        headerLayout: "inline-right",
        headerInlineComponent: {
          id: `header-inline-${Date.now()}`,
          type: "AuthorBadge",
          category: "maries-corner",
          enabled: true,
          order: -1,
          props: mariesCornerDefaults.AuthorBadge,
        },
        titleAlignment: "left",
        titleFontSize: "text-3xl md:text-4xl",
        titleFontFamily: "font-[Roboto,sans-serif]",
        subtitleAlignment: "left",
        subtitleFontSize: "text-lg md:text-xl",
        subtitleFontWeight: "font-light",
        subtitleColor: "text-yellow-600",
        subtitle2Alignment: "left",
        subtitle2FontSize: "text-base",
        subtitle2FontFamily: "font-[Lato,sans-serif]",
        subtitle2Color: "text-gray-900",
        gridFlow: "row",
        contentBlocks: [
          {
            id: `block-${Date.now()}-22`,
            type: "QuoteBlock",
            category: "maries-corner",
            enabled: true,
            order: 0,
            columnAssignment: "1",
            gridRowSpan: "2",
            props: mariesCornerDefaults.QuoteBlock,
            backgroundColor: "#f3f4f6",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0,
          },
          {
            id: `block-${Date.now()}-23`,
            type: "RichContent",
            category: "shared",
            enabled: true,
            order: 1,
            gridRowSpan: "2",
            alignSelf: "stretch",
            props: mariesCornerDefaults.RichContent,
            backgroundColor: "transparent",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0,
          },
          {
            id: `block-${Date.now()}-24`,
            type: "SocialFollow",
            category: "maries-corner",
            enabled: true,
            order: 2,
            columnAssignment: "2",
            gridColumn: "2",
            gridSpan: "1",
            gridRowSpan: "1",
            alignSelf: "start",
            props: mariesCornerDefaults.SocialFollow,
            backgroundColor: "transparent",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0,
          },
          {
            id: `block-${Date.now()}-25`,
            type: "NumberedTips",
            category: "maries-corner",
            enabled: true,
            order: 3,
            columnAssignment: "2",
            gridColumn: "2",
            alignSelf: "start",
            props: mariesCornerDefaults.NumberedTips,
            backgroundColor: "transparent",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0,
          },
          {
            id: `block-${Date.now()}-26`,
            type: "PhotoGallery",
            category: "shared",
            enabled: true,
            order: 4,
            columnAssignment: "2",
            props: mariesCornerDefaults.PhotoGallery,
            backgroundColor: "#fef3c7",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 20,
            padding: 0,
          },
        ],
      }
    }
  },
  
  // Original Glam Drop Template
  {
    name: "The Glam Drop",
    description: "Features, Launches & Events - Complete What's New section with 3 components",
    icon: "🎯",
    data: {
      type: "custom-section",
      title: "The Glam Drop",
      id: `section-${Date.now()}`,
      subtitle: "Features, Launches & Events",
      content: {
        urlSlug: "the-glam-drop",
        masonryColumns: "",
        contentBlocks: [
          {
            borderWidth: 0,
            backgroundColor: "transparent",
            borderColor: "#e5e7eb",
            category: "whats-new-glamlink",
            enabled: true,
            props: {
              title: "New Features",
              features: [
                {
                  icon: "🎯",
                  availability: "Now Live",
                  description: "Clients can search for any service or specialty, from facial to lymphatic and instantly see a curated list of professionals.",
                  title: "Geolocation Discovery"
                },
                {
                  title: "Posts & Clips",
                  icon: "❤️",
                  availability: "Now Live",
                  description: "Every post and clip builds your footprint in the beauty and wellness space. Show your work, share your expertise, and let your personality shine. Whether it's a transformation video, a behind-the-scenes moment, or your professional tips."
                },
                {
                  description: "Highlight your story, share your accomplishments, and give potential clients a clear picture of why you're the best at what you do. Create multiple galleries dedicated to your treatments, each with before-and-after results, process videos, testimonials, and real client transformations. It's your work-organized, professional, and ready to turn curiosity into bookings.",
                  title: "Photo Album",
                  icon: "📸",
                  availability: "Now Live"
                },
                {
                  icon: "✅",
                  availability: "Now Live",
                  title: "Trusted Reviews",
                  description: "Ask your favorite clients to share their experience, every review builds your credibility and helps new clients feel confident booking with you. Soon, our curated post-booking review feature will make it effortless for clients to leave feedback right after their appointment, so your best work is always fresh in the spotlight."
                },
                {
                  description: "Add your treatments and set your hours of availability so clients can easily request appointments. Stay in control of your calendar, confirm bookings with a tap, and never miss an opportunity to turn interest into a confirmed client.",
                  availability: "Now Live",
                  title: "Bookings",
                  icon: "💎"
                },
                {
                  icon: "✨",
                  availability: "Now Live",
                  description: "Our weekly digital magazine celebrates the best in beauty and wellness, highlighting top professionals from across the U.S. Each issue features a trending treatment, showcased by a pro offering it inside the app and our pick for the top product of the week. Want to be featured? Share your story, treatment or product with us at theglamlinkedit@glamlink.net and you could be our next spotlight.",
                  title: "The GLAMLINK Edit"
                },
                {
                  description: "Be among the first 100 to complete your profile and earn lifetime recognition as a Glamlink Founder. This exclusive badge celebrates the pros shaping beauty + wellness from day one.",
                  icon: "👑",
                  title: "Elite Founder Badge",
                  availability: "Now Live"
                }
              ]
            },
            padding: 0,
            id: "block-1755726833141",
            type: "FeatureList",
            order: 0,
            borderRadius: 0
          },
          {
            borderRadius: 0,
            backgroundColor: "transparent",
            props: {
              peeks: [
                {
                  title: "Join Us At Women's Expo 8/23 At Orleans Arena",
                  teaser: "Come support women in business and experience the future of beauty and wellness. Get a hands-on demo of the Glamlink app, sign up on the spot, and unlock exclusive perks-including opportunities to be spotlighted in The Glamlink Edit.",
                  releaseDate: "2025-08-24"
                },
                {
                  teaser: "Launch your own shop inside Glamlink and turn every recommendation into revenue. From pro-grade products to must-have tools, you'll sell directly to beauty lovers who are ready to buy from you.",
                  releaseDate: "2025",
                  title: "Sell Your Favorite Professional Products"
                },
                {
                  releaseDate: "2025-08-31",
                  title: "Glam Coins-Earn While Building",
                  teaser: "Earn Glam Coins every time you post, sell, or engage on Glamlink. Redeem them for boosts, spotlight features, ads, and more. Every coin you earn fuels your visibility, your reach, and your revenue."
                },
                {
                  title: "AI Discovery That Works For You",
                  releaseDate: "2025-09-30",
                  teaser: "Beauty's smartest matchmaker working behind the scenes to connect the right clients to the right pros, treatments, and products"
                }
              ],
              titleTag: "h3",
              title: "Coming Soon",
              titleIcon: "👀",
              titleTypography: {
                fontSize: "text-lg md:text-xl",
                fontFamily: "font-[Roboto,sans-serif]",
                fontWeight: "font-bold",
                color: "text-glamlink-teal"
              }
            },
            borderColor: "#e5e7eb",
            id: "block-1755727532806",
            padding: 0,
            type: "SneakPeeks",
            order: 1,
            enabled: true,
            borderWidth: 0,
            category: "whats-new-glamlink"
          },
          {
            type: "TipsList",
            enabled: true,
            padding: 0,
            order: 2,
            borderColor: "#e5e7eb",
            props: {
              tips: [
                {
                  icon: "💫",
                  link: "",
                  title: "Share Your Beauty Journey",
                  description: "Showcase your artistry, passion and results behind your work. Every photo, post and clip builds trust, inspires clients, and grows your business."
                },
                {
                  icon: "💫",
                  description: "Fill out your photo albums, treatments, shop, reviews. A complete profile gets more clicks, more trust, and more bookings",
                  link: "",
                  title: "Build a Scroll Stopping Profile"
                },
                {
                  icon: "💫",
                  title: "Grow Together, Win Together",
                  description: "Invite other professionals to join Glamlink. The bigger our community, the more clients we all reach and the more your own profile gets discovered.",
                  link: ""
                }
              ],
              title: "Pro Tips",
              titleIcon: "💡",
              titleTag: "h3",
              titleTypography: {
                fontSize: "text-lg md:text-xl",
                fontFamily: "font-[Roboto,sans-serif]",
                fontWeight: "font-bold",
                color: "text-glamlink-teal"
              }
            },
            borderWidth: 0,
            borderRadius: 0,
            id: "block-1755728543776",
            category: "whats-new-glamlink",
            backgroundColor: "transparent"
          }
        ],
        sectionBorder: true,
        subtitleFontSize: "text-lg md:text-xl",
        titleFontWeight: "font-bold",
        layout: "single-column",
        subtitleFontWeight: "font-medium",
        subtitleAlignment: "center",
        titleFontSize: "text-3xl md:text-4xl",
        type: "custom-section",
        subtitleColor: "text-glamlink-teal",
        titleFontFamily: "font-[Montserrat,sans-serif]",
        subtitleFontFamily: "font-[Roboto,sans-serif]",
        titleAlignment: "center"
      }
    }
  },
  // Quote Wall Template
  {
    name: "Quote Wall",
    description: "Inspirational quotes collection with beautiful typography",
    icon: "💬",
    data: {
      type: "custom-section",
      title: "Quote Wall",
      id: `section-${Date.now()}-quote-wall`,
      subtitle: "Inspiration & Motivation",
      content: {
        urlSlug: "quote-wall",
        contentBlocks: [
          {
            id: `block-${Date.now()}-1`,
            type: "QuoteCarousel",
            category: "quote-wall",
            enabled: true,
            order: 0,
            props: {
              quotes: [
                {
                  text: "Beauty begins the moment you decide to be yourself.",
                  author: "Coco Chanel",
                  role: "Fashion Designer"
                },
                {
                  text: "The best thing is to look natural, but it takes makeup to look natural.",
                  author: "Calvin Klein",
                  role: "Fashion Designer"
                },
                {
                  text: "Beauty is power; a smile is its sword.",
                  author: "John Ray",
                  role: "Naturalist"
                },
                {
                  text: "Elegance is the only beauty that never fades.",
                  author: "Audrey Hepburn",
                  role: "Actress & Icon"
                },
                {
                  text: "Invest in your skin. It is going to represent you for a very long time.",
                  author: "Linden Tyler",
                  role: "Skincare Expert"
                }
              ],
              theme: "Empowerment & Self-Care",
              displayStyle: "carousel",
              autoRotate: true,
              rotationSpeed: 5000,
              showAuthor: true,
              showRole: true,
              backgroundColor: "#f9fafb",
              textColor: "#1f2937",
              accentColor: "#14b8a6"
            },
            backgroundColor: "transparent",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0,
          }
        ],
        sectionBorder: true,
        layout: "single-column",
        titleAlignment: "center",
        titleFontSize: "text-3xl md:text-4xl",
        titleFontWeight: "font-bold",
        titleFontFamily: "font-[Montserrat,sans-serif]",
        titleColor: "text-gray-900",
        subtitleAlignment: "center",
        subtitleFontSize: "text-lg md:text-xl",
        subtitleFontWeight: "font-medium",
        subtitleFontFamily: "font-[Roboto,sans-serif]",
        subtitleColor: "text-gray-600"
      }
    }
  },

  // Coin Drop Template
  {
    name: "Coin Drop Challenge",
    description: "Complete coin rewards section with monthly challenge, leaderboard, and special offers",
    icon: "🪙",
    data: {
      type: "custom-section",
      title: "Coin Drop",
      subtitle: "Earn Rewards & Win Prizes",
      id: `section-${Date.now()}-coin-drop`,
      content: {
        urlSlug: "coin-drop",
        contentBlocks: [
          {
            id: `block-${Date.now()}-cd-1`,
            type: "MonthlyChallenge",
            category: "coin-drop",
            enabled: true,
            order: 0,
            props: coinDropDefaults.MonthlyChallenge,
            backgroundColor: "bg-white",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0
          },
          {
            id: `block-${Date.now()}-cd-2`,
            type: "Stats",
            category: "shared",
            enabled: true,
            order: 1,
            props: {
              items: coinDropDefaults.WaysToEarn,
              title: "💰 Ways to Earn This Month",
              titleTypography: {
                fontSize: "text-xl",
                fontWeight: "font-bold",
                fontFamily: "font-sans",
                color: "text-gray-900"
              },
              layout: "grid",
              columns: 2,
              itemClassName: "hover:bg-glamlink-gold/10"
            },
            backgroundColor: "bg-white",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0
          },
          {
            id: `block-${Date.now()}-cd-3`,
            type: "Stats",
            category: "shared",
            enabled: true,
            order: 2,
            props: {
              items: coinDropDefaults.FeaturedRewards.map((reward: any) => ({
                title: reward.name,
                subtitle: reward.valueText,
                value: reward.costText,
                image: reward.image,
                icon: reward.icon
              })),
              title: "🎁 Featured Rewards",
              titleTypography: {
                fontSize: "text-xl",
                fontWeight: "font-bold",
                fontFamily: "font-sans",
                color: "text-gray-900"
              },
              layout: "grid",
              columns: 2,
              itemClassName: "hover:bg-glamlink-purple/10"
            },
            backgroundColor: "bg-white",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0
          },
          {
            id: `block-${Date.now()}-cd-4`,
            type: "Leaderboard",
            category: "coin-drop",
            enabled: true,
            order: 3,
            props: coinDropDefaults.Leaderboard,
            backgroundColor: "bg-white",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0
          },
          {
            id: `block-${Date.now()}-cd-5`,
            type: "SpecialOffers",
            category: "coin-drop",
            enabled: true,
            order: 4,
            props: coinDropDefaults.SpecialOffers,
            backgroundColor: "bg-white",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0
          },
          {
            id: `block-${Date.now()}-cd-6`,
            type: "CTAStat",
            category: "shared",
            enabled: true,
            order: 5,
            props: coinDropDefaults.CoinBalance,
            backgroundColor: "bg-white",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0
          }
        ],
        sectionBorder: true,
        layout: "single-column",
        titleAlignment: "center",
        titleFontSize: "text-3xl md:text-4xl",
        titleFontWeight: "font-bold",
        titleFontFamily: "font-sans",
        titleColor: "text-gray-900",
        subtitleAlignment: "center",
        subtitleFontSize: "text-lg md:text-xl",
        subtitleFontWeight: "font-medium",
        subtitleColor: "text-gray-600",
        subtitleFontFamily: "font-sans"
      }
    }
  },

  // Glamlink Stories Template
  {
    name: "Glamlink Stories",
    description: "Instagram-style stories grid with featured content and full typography control",
    icon: "📸",
    data: {
      type: "custom-section",
      title: "Glamlink Stories",
      subtitle: "Community Highlights & Transformations",
      id: `section-${Date.now()}-glamlink-stories`,
      content: {
        urlSlug: "glamlink-stories",
        contentBlocks: [
          {
            id: `block-${Date.now()}-gs-1`,
            type: "StoryContent",
            category: "glamlink-stories",
            enabled: true,
            order: 0,
            props: glamlinkStoriesDefaults.StoryContent,
            backgroundColor: "bg-white",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0
          },
          {
            id: `block-${Date.now()}-gs-2`,
            type: "FeaturedThisWeek",
            category: "glamlink-stories",
            enabled: true,
            order: 1,
            props: glamlinkStoriesDefaults.FeaturedThisWeek,
            backgroundColor: "bg-gray-50",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0
          }
        ],
        sectionBorder: true,
        sectionRounded: true
      }
    }
  },

  // Spotlight City Template
  {
    name: "Spotlight City",
    description: "City spotlight with top professionals, trends, and events with full typography control",
    icon: "🌆",
    data: {
      type: "custom-section",
      title: "Spotlight City",
      subtitle: "Discover Beauty Scenes Across America",
      id: `section-${Date.now()}-spotlight-city`,
      content: {
        urlSlug: "spotlight-city",
        contentBlocks: [
          {
            id: `block-${Date.now()}-sc-1`,
            type: "CityHero",
            category: "spotlight-city",
            enabled: true,
            order: 0,
            props: spotlightCityDefaults.CityHero,
            backgroundColor: "bg-white",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0
          },
          {
            id: `block-${Date.now()}-sc-2`,
            type: "LocalPros",
            category: "spotlight-city",
            enabled: true,
            order: 1,
            props: spotlightCityDefaults.LocalPros,
            backgroundColor: "bg-gray-50",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0
          },
          {
            id: `block-${Date.now()}-sc-3`,
            type: "LocalTrends",
            category: "spotlight-city",
            enabled: true,
            order: 2,
            props: spotlightCityDefaults.LocalTrends,
            backgroundColor: "bg-white",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0
          },
          {
            id: `block-${Date.now()}-sc-4`,
            type: "EventsList",
            category: "shared",
            enabled: true,
            order: 3,
            props: spotlightCityDefaults.LocalEvents,
            backgroundColor: "bg-gray-50",
            borderWidth: 0,
            borderColor: "#e5e7eb",
            borderRadius: 0,
            padding: 0
          }
        ],
        sectionBorder: true,
        sectionRounded: true
      }
    }
  }
];