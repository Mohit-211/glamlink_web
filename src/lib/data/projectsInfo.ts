import { Project } from "@/lib/types";

export const projectsData: Project[] = [
  {
    id: "beauty-analysis",
    title: "AI Beauty Analysis",
    subtitle: "Advanced beauty assessment using AI",
    description: "An AI-powered beauty analysis tool that provides personalized skincare recommendations and facial feature analysis using computer vision technology.",
    problemSolved: "Provides accessible, personalized beauty and skincare advice without expensive consultations",
    role: "Full Stack Developer",
    keyFeatures: [
      "Real-time facial analysis using AI",
      "Personalized skincare recommendations",
      "Progress tracking over time",
      "Multiple analysis categories"
    ],
    impact: "Democratizing beauty consultations and helping users understand their unique features",
    learnings: [
      "Implementing AI/ML models in web applications",
      "Working with image processing and computer vision",
      "Building responsive, user-friendly interfaces",
      "Managing user data privacy and security"
    ],
    category: "AI/ML",
    technologies: ["Next.js", "TypeScript", "OpenAI Vision API", "Firebase", "Tailwind CSS"],
    github: "",
    demo: "",
    liveUrl: "/image-analysis",
    status: "published",
    lastModified: new Date().toISOString(),
    isFeatured: true,
    featuredImage: "/images/beauty-analysis-preview.png",
    order: 1
  },
  {
    id: "glamour-beauty-brand",
    title: "Glamour Beauty Co. Brand Page",
    subtitle: "E-commerce and community platform for beauty brands",
    description: "A comprehensive brand showcase platform featuring products, certified providers, training programs, and customer reviews with Firebase integration.",
    problemSolved: "Creating a unified platform for beauty brands to showcase products, connect with providers, and build community",
    role: "Full Stack Developer",
    keyFeatures: [
      "Product catalog with advanced filtering",
      "Certified provider directory",
      "Before/after transformation gallery",
      "Training program enrollment system"
    ],
    impact: "Streamlining the connection between beauty brands, professionals, and customers",
    learnings: [
      "Building scalable e-commerce architectures",
      "Implementing real-time data with Firebase",
      "Creating responsive grid layouts",
      "Managing complex state with Redux"
    ],
    category: "E-commerce",
    technologies: ["Next.js", "TypeScript", "Firebase", "Redux Toolkit", "Tailwind CSS"],
    github: "",
    demo: "",
    liveUrl: "/brand",
    status: "published",
    lastModified: new Date().toISOString(),
    isFeatured: true,
    featuredImage: "/images/brand-page-preview.png",
    order: 2
  }
];