import { HeroData, ProjectItem, ServiceItem, StatItem, TestimonialItem } from "./config";

export const mockHeroData: HeroData = {
  title: "The Future of Beauty Analysis",
  subtitle: "AI-Powered Beauty Insights",
  description: "Discover your unique beauty potential with advanced AI technology. Get personalized recommendations, explore premium brands, and connect with beauty professionals.",
  ctaText: "Explore Your Beauty",
  ctaLink: "/image-analysis",
  features: ["AI Beauty Analysis", "Professional Products", "Expert Insights"],
};

export const mockFeaturedProjects: ProjectItem[] = [
  {
    id: "1",
    title: "AI Beauty Analysis",
    description: "Upload your photo and receive comprehensive beauty insights powered by advanced AI. Get personalized recommendations for skincare, makeup, and more.",
    imageUrl: "https://source.unsplash.com/600x400/?beauty,face",
    technologies: ["AI Vision", "Machine Learning", "Real-time Analysis"],
    demoUrl: "/image-analysis",
  },
  {
    id: "2",
    title: "Brand Showcase",
    description: "Explore premium beauty brands, their products, and certified professionals. Connect with experts and discover your perfect beauty routine.",
    imageUrl: "https://source.unsplash.com/600x400/?cosmetics,makeup",
    technologies: ["E-commerce", "Brand Portal", "Professional Network"],
    demoUrl: "/brand",
  },
  {
    id: "3",
    title: "Beauty Community",
    description: "Join a vibrant community of beauty enthusiasts. Share your journey, get tips from professionals, and stay updated with the latest trends.",
    imageUrl: "https://source.unsplash.com/600x400/?beauty,community",
    technologies: ["Social Features", "Expert Advice", "Trending Topics"],
    demoUrl: "#",
  },
];

export const mockServices: ServiceItem[] = [
  {
    id: "1",
    title: "Personalized Analysis",
    description: "Get detailed insights about your skin quality, facial symmetry, and personalized beauty recommendations.",
    icon: "SparklesIcon",
    features: [
      "Skin quality assessment",
      "Facial symmetry analysis",
      "Custom recommendations",
      "Progress tracking",
    ],
  },
  {
    id: "2",
    title: "Brand Discovery",
    description: "Explore curated beauty brands and products that match your unique profile and preferences.",
    icon: "ShoppingBagIcon",
    features: [
      "Premium brand catalog",
      "Product matching",
      "Exclusive offers",
      "Brand stories",
    ],
  },
  {
    id: "3",
    title: "Professional Connect",
    description: "Connect with certified beauty professionals in your area for personalized consultations and treatments.",
    icon: "UserGroupIcon",
    features: [
      "Certified professionals",
      "Location-based search",
      "Booking system",
      "Reviews & ratings",
    ],
  },
  {
    id: "4",
    title: "Beauty Education",
    description: "Access expert-led tutorials, tips, and courses to enhance your beauty knowledge and skills.",
    icon: "AcademicCapIcon",
    features: [
      "Video tutorials",
      "Expert masterclasses",
      "Certification programs",
      "Trending techniques",
    ],
  },
];

export const mockStats: StatItem[] = [
  {
    id: "1",
    label: "Beauty Analyses",
    value: "10K+",
    description: "AI-powered insights",
  },
  {
    id: "2",
    label: "Accuracy Rate",
    value: "95%",
    description: "Analysis precision",
  },
  {
    id: "3",
    label: "Beauty Brands",
    value: "50+",
    description: "Premium partners",
  },
  {
    id: "4",
    label: "Happy Users",
    value: "25K+",
    description: "Beauty enthusiasts",
  },
];

export const mockTestimonials: TestimonialItem[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Beauty Influencer",
    company: "@sarahbeauty",
    content: "Beauty Andy's AI analysis completely transformed my skincare routine. The personalized recommendations were spot-on, and I've never felt more confident!",
    avatarUrl: "https://source.unsplash.com/100x100/?portrait,woman",
    rating: 5,
  },
  {
    id: "2",
    name: "Maria Rodriguez",
    role: "Professional MUA",
    company: "Glamour Studios",
    content: "As a makeup artist, this platform helps me provide better recommendations to my clients. The brand showcase feature is invaluable for discovering new products.",
    avatarUrl: "https://source.unsplash.com/100x100/?portrait,makeup",
    rating: 5,
  },
  {
    id: "3",
    name: "Emma Thompson",
    role: "Skincare Enthusiast",
    company: "Beauty Blogger",
    content: "The accuracy of the skin analysis blew me away! It identified issues I wasn't even aware of and helped me build a routine that actually works.",
    avatarUrl: "https://source.unsplash.com/100x100/?portrait,beauty",
    rating: 5,
  },
];

export const mockHomeData = {
  heroData: mockHeroData,
  featuredProjects: mockFeaturedProjects,
  services: mockServices,
  stats: mockStats,
  testimonials: mockTestimonials,
};