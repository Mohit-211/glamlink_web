// Page content configuration types
export interface ButtonConfig {
  text: string;
  action: string;
  style?: 'primary' | 'secondary';
}

export interface FeatureItem {
  title: string;
  description: string;
  icon?: string;
}

export interface StepItem {
  number: string;
  title: string;
  description: string;
}

export interface TestimonialItem {
  name: string;
  role: string;
  text: string;
  image?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// Home page content structure
export interface HomePageContent {
  hero: {
    title: string;
    subtitle: string;
    buttons: ButtonConfig[];
  };
  whyGlamLink: {
    title: string;
    subtitle: string;
    features: FeatureItem[];
  };
  bookTrustedPros: {
    title?: string;
    services: Array<{
      title: string;
      image: string;
      alt: string;
    }>;
  };
  founderBadge: {
    title: string;
    description: string;
    subtext: string;
    image: string;
  };
  testimonials: {
    title: string;
    items: TestimonialItem[];
  };
  finalCTA: {
    title: string;
    subtitle: string;
    userSection: {
      title: string;
      description: string;
      button: ButtonConfig;
    };
    proSection: {
      title: string;
      description: string;
      button: ButtonConfig;
    };
  };
}

// For Clients page content structure
export interface ForClientsPageContent {
  hero: {
    title: string;
    subtitle: string;
    buttons: ButtonConfig[];
  };
  features: {
    title: string;
    items: FeatureItem[];
  };
  howItWorks: {
    title: string;
    steps: StepItem[];
  };
  testimonial: {
    title: string;
    quote: string;
    author: string;
    role: string;
  };
  cta: {
    title: string;
    subtitle: string;
    buttons: ButtonConfig[];
  };
}

// For Professionals page content structure
export interface ForProfessionalsPageContent {
  hero: {
    title: string;
    subtitle: string;
    buttons: ButtonConfig[];
  };
  benefits: {
    title: string;
    items: FeatureItem[];
  };
  features: {
    title: string;
    items: FeatureItem[];
  };
  testimonials: {
    title: string;
    items: TestimonialItem[];
  };
  cta: {
    title: string;
    subtitle: string;
    buttons: ButtonConfig[];
  };
}

// About page content structure
export interface AboutPageContent {
  hero: {
    title: string;
    subtitle: string;
  };
  mission: {
    title: string;
    content: string;
  };
  values: {
    title: string;
    items: FeatureItem[];
  };
  team: {
    title: string;
    subtitle: string;
    members: Array<{
      name: string;
      role: string;
      bio: string;
      image?: string;
    }>;
  };
}

// FAQs page content structure
export interface FAQsPageContent {
  hero: {
    title: string;
    subtitle: string;
  };
  categories: Array<{
    name: string;
    faqs: FAQItem[];
  }>;
}

// Combined page content type
export interface PageContentMap {
  home: HomePageContent;
  forClients: ForClientsPageContent;
  forProfessionals: ForProfessionalsPageContent;
  about: AboutPageContent;
  faqs: FAQsPageContent;
}

export type PageContentId = keyof PageContentMap;

// Page content settings stored in database
export interface PageContentSettings {
  pages: Partial<PageContentMap>;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  version: number;
}

// Default content for each page (fallback)
export const defaultPageContent: PageContentMap = {
  home: {
    hero: {
      title: "THE PLATFORM POWERING THE BEAUTY INDUSTRY",
      subtitle: "Connect. Book. Sell. Grow. Everything beauty, in one seamless experience",
      buttons: [
        { text: "I'm a Client - Download Now", action: "download-client", style: "primary" },
        { text: "I'm a Beauty Pro - Grow With Glamlink", action: "download-pro", style: "secondary" }
      ]
    },
    whyGlamLink: {
      title: "Why Glamlink?",
      subtitle: "A smarter way to discover trusted beauty professionals and shop expert-approved products.",
      features: [
        {
          title: "Verified Professionals Only",
          description: "Discover local experts with real experience, real reviews, and real results.",
          icon: "PersonOutline"
        },
        {
          title: "Shop Pro-Approved Products",
          description: "Buy the exact products your beauty pro recommends - no more guessing.",
          icon: "ShoppingBagOutlined"
        },
        {
          title: "One-Stop Beauty Hub",
          description: "Book appointments, shop products, and manage everything in one app.",
          icon: "CalendarTodayOutlined"
        },
        {
          title: "Support Small Businesses",
          description: "Every purchase directly supports independent beauty entrepreneurs.",
          icon: "RocketLaunchOutlined"
        }
      ]
    },
    bookTrustedPros: {
      services: [
        {
          title: "Search by Service",
          image: "/images/search_by_service.png",
          alt: "Professional hair styling"
        },
        {
          title: "Book Trusted Pros",
          image: "/images/calendar_booked_w_glamlink_resized.png",
          alt: "Professional facial treatment"
        },
        {
          title: "Shop Professional Products",
          image: "/images/shop_professional_products.png",
          alt: "Relaxing spa massage"
        }
      ]
    },
    founderBadge: {
      title: "Founder Badge (First 100 Only)",
      description: "Early professionals get exclusive visibility, permanent perks, and first access to new tools.",
      subtext: "Join now and be recognized as a Founding Member.",
      image: "/images/gold_badge.png"
    },
    testimonials: {
      title: "What Our Users Are Saying",
      items: [
        {
          name: "Jessica M.",
          role: "Esthetician",
          text: "I'm so excited to have one platform where I can do everything for my esthetician business. Now I can focus on launching my new skincare line and sell it directly on Glamlink!",
          image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
        },
        {
          name: "Lina R.",
          role: "Brow Specialist",
          text: "I've been waiting for something like this. Glamlink lets me showcase my work, build my brand, and actually get discovered by people looking for what I do. It finally feels like a platform built for beauty pros.",
          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
        },
        {
          name: "Amanda J.",
          role: "Glamlink user",
          text: "I love seeing real results before I book. With the reviews and the option to shop, I actually feel confident in who I'm choosing and what I'm buying.",
          image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop"
        },
        {
          name: "Jasmine R.",
          role: "Glamlink user",
          text: "I didn't even know half these treatments existed. Glamlink opened up a whole new world — and now I can actually shop products I trust too.",
          image: "https://images.unsplash.com/photo-1514315384763-ba401779410f?w=100&h=100&fit=crop"
        }
      ]
    },
    finalCTA: {
      title: "Download Glamlink for Free",
      subtitle: "Whether you're booking a beauty service or building your business.",
      userSection: {
        title: "For Users",
        description: "Discover trusted pros, book instantly, and shop expert-approved products.",
        button: { text: "Download for Users", action: "download-user", style: "primary" }
      },
      proSection: {
        title: "For Professionals",
        description: "Build your brand, grow your client base, and sell products directly.",
        button: { text: "Download for Pros", action: "download-pro", style: "secondary" }
      }
    }
  },
  forClients: {
    hero: {
      title: "Your Beauty Journey Starts Here",
      subtitle: "Discover trusted beauty brands, certified professionals, and personalized recommendations all in one place. Glamlink makes finding the perfect beauty solutions simple and safe.",
      buttons: [
        { text: "Browse Brands", action: "/brand", style: "primary" },
        { text: "Try AI Analysis", action: "/image-analysis", style: "secondary" }
      ]
    },
    features: {
      title: "Everything You Need for Beauty Success",
      items: [
        {
          title: "Discover Trusted Brands",
          description: "Browse through our curated collection of beauty brands, each verified and quality-assured.",
          icon: "🌟"
        },
        {
          title: "Find Certified Professionals",
          description: "Connect with certified beauty professionals rated by real clients in your area.",
          icon: "👩‍🎨"
        },
        {
          title: "AI Beauty Analysis",
          description: "Get personalized skincare and beauty recommendations with our free AI analysis tool.",
          icon: "🤖"
        },
        {
          title: "Real Reviews",
          description: "Read authentic reviews from verified customers to make informed decisions.",
          icon: "💬"
        },
        {
          title: "Before & After Gallery",
          description: "See real transformation results from treatments and products.",
          icon: "✨"
        },
        {
          title: "Book with Confidence",
          description: "Easy booking system with secure payments and satisfaction guarantee.",
          icon: "📅"
        }
      ]
    },
    howItWorks: {
      title: "How Glamlink Works for You",
      steps: [
        {
          number: "1",
          title: "Browse or Search",
          description: "Explore brands, products, or find professionals based on your needs"
        },
        {
          number: "2",
          title: "Compare & Choose",
          description: "Read reviews, check ratings, and compare options to find your perfect match"
        },
        {
          number: "3",
          title: "Book or Purchase",
          description: "Schedule appointments or buy products directly through the platform"
        },
        {
          number: "4",
          title: "Enjoy & Review",
          description: "Experience great service and share your feedback to help others"
        }
      ]
    },
    testimonial: {
      title: "What Our Clients Say",
      quote: "Glamlink has completely transformed how I find beauty services. The AI analysis gave me personalized recommendations that actually work, and I love being able to read real reviews before booking appointments.",
      author: "Sarah Johnson",
      role: "Glamlink Client"
    },
    cta: {
      title: "Ready to Discover Your Perfect Beauty Match?",
      subtitle: "Join thousands of satisfied clients who've found their beauty solutions on Glamlink.",
      buttons: [
        { text: "Create Free Account", action: "/profile/signup", style: "primary" },
        { text: "Try AI Analysis First", action: "/image-analysis", style: "secondary" }
      ]
    }
  },
  forProfessionals: {
    hero: {
      title: "Grow Your Beauty Business with Glamlink",
      subtitle: "Join the platform that's revolutionizing how beauty professionals connect with clients and build their brands.",
      buttons: [
        { text: "Start Free Trial", action: "/profile/signup", style: "primary" },
        { text: "Learn More", action: "#features", style: "secondary" }
      ]
    },
    benefits: {
      title: "Why Beauty Professionals Choose Glamlink",
      items: [
        {
          title: "Build Your Brand",
          description: "Create a professional profile that showcases your work and expertise",
          icon: "🎨"
        },
        {
          title: "Reach New Clients",
          description: "Get discovered by clients actively searching for your services",
          icon: "🔍"
        },
        {
          title: "Sell Products",
          description: "Launch and sell your own beauty products directly to customers",
          icon: "💄"
        },
        {
          title: "Manage Everything",
          description: "Handle bookings, payments, and client communications in one place",
          icon: "📱"
        }
      ]
    },
    features: {
      title: "Powerful Features for Your Success",
      items: [
        {
          title: "Professional Portfolio",
          description: "Showcase before/after photos, certifications, and specialties",
          icon: "📸"
        },
        {
          title: "Booking Management",
          description: "Accept bookings, manage schedules, and send reminders automatically",
          icon: "📅"
        },
        {
          title: "Client Reviews",
          description: "Build trust with verified reviews from satisfied customers",
          icon: "⭐"
        },
        {
          title: "Analytics Dashboard",
          description: "Track your growth with insights on bookings, revenue, and client trends",
          icon: "📊"
        },
        {
          title: "Marketing Tools",
          description: "Promote special offers and reach new clients with built-in marketing",
          icon: "📢"
        },
        {
          title: "Secure Payments",
          description: "Get paid instantly with secure, integrated payment processing",
          icon: "💳"
        }
      ]
    },
    testimonials: {
      title: "Success Stories from Our Professionals",
      items: [
        {
          name: "Maria Rodriguez",
          role: "Hair Stylist",
          text: "Glamlink helped me go from working in someone else's salon to running my own successful business. The platform makes everything so easy!",
          image: ""
        },
        {
          name: "David Chen",
          role: "Makeup Artist",
          text: "I've doubled my client base in just 6 months. The booking system is fantastic and my clients love the professional experience.",
          image: ""
        }
      ]
    },
    cta: {
      title: "Ready to Take Your Beauty Business to the Next Level?",
      subtitle: "Join thousands of beauty professionals already growing with Glamlink",
      buttons: [
        { text: "Start Your Free Trial", action: "/profile/signup", style: "primary" },
        { text: "Schedule a Demo", action: "/contact", style: "secondary" }
      ]
    }
  },
  about: {
    hero: {
      title: "About Glamlink",
      subtitle: "Empowering beauty professionals and connecting them with clients worldwide"
    },
    mission: {
      title: "Our Mission",
      content: "Glamlink is on a mission to revolutionize the beauty industry by creating a seamless platform that connects beauty professionals with clients, enables brand building, and facilitates direct product sales. We believe every beauty professional deserves the tools to succeed independently."
    },
    values: {
      title: "Our Values",
      items: [
        {
          title: "Empowerment",
          description: "We empower beauty professionals to build and grow their own businesses",
          icon: "💪"
        },
        {
          title: "Trust",
          description: "We ensure all professionals are verified and reviews are authentic",
          icon: "🤝"
        },
        {
          title: "Innovation",
          description: "We continuously innovate to provide the best tools and features",
          icon: "💡"
        },
        {
          title: "Community",
          description: "We foster a supportive community of beauty professionals and clients",
          icon: "👥"
        }
      ]
    },
    team: {
      title: "Meet Our Team",
      subtitle: "Passionate about transforming the beauty industry",
      members: []
    }
  },
  faqs: {
    hero: {
      title: "Frequently Asked Questions",
      subtitle: "Find answers to common questions about Glamlink"
    },
    categories: [
      {
        name: "For Clients",
        faqs: [
          {
            question: "How do I book a beauty service?",
            answer: "Simply browse our professionals, select the service you want, choose a time that works for you, and book instantly through the platform."
          },
          {
            question: "Are the professionals verified?",
            answer: "Yes, all professionals on Glamlink go through a verification process to ensure they have proper certifications and experience."
          },
          {
            question: "What if I'm not satisfied with a service?",
            answer: "We have a satisfaction guarantee. If you're not happy with a service, contact our support team and we'll help resolve the issue."
          }
        ]
      },
      {
        name: "For Professionals",
        faqs: [
          {
            question: "How much does it cost to join Glamlink?",
            answer: "Glamlink offers a free trial period. After that, we have affordable monthly plans starting at $29/month with no commission on bookings."
          },
          {
            question: "Can I sell my own products?",
            answer: "Yes! Glamlink allows you to create and sell your own beauty products directly through the platform with integrated payment processing."
          },
          {
            question: "How do I get more clients?",
            answer: "Glamlink helps you get discovered through search, featured listings, and our marketing tools. The more complete your profile, the more visibility you get."
          }
        ]
      }
    ]
  }
};