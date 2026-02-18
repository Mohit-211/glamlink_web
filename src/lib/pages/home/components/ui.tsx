// Home Page UI Utilities and Components

import React from "react";
import { HomeStateInterface } from "../config";

// Color System
const colorSystem = {
  primary: "indigo",
  success: "green",
  error: "red",
  warning: "yellow",
  info: "blue",
  neutral: "gray",
};

// Styling Utilities
export function getFeatureIconClass(index: number) {
  const colors = ["green", "blue", "purple"];
  const color = colors[index % colors.length];
  return `bg-${color}-100 dark:bg-${color}-900`;
}

export function getFeatureIconTextClass(index: number) {
  const colors = ["green", "blue", "purple"];
  const color = colors[index % colors.length];
  return `text-${color}-600 dark:text-${color}-400`;
}

export function getServiceCardClass(index: number) {
  const patterns = [
    "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-indigo-800",
    "bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900 dark:to-pink-800",
    "bg-gradient-to-br from-green-50 to-teal-100 dark:from-green-900 dark:to-teal-800",
    "bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900 dark:to-orange-800",
  ];
  return patterns[index % patterns.length];
}

export function getTestimonialRatingClass(rating: number) {
  if (rating >= 4.5) return "text-yellow-400";
  if (rating >= 4) return "text-yellow-300";
  return "text-gray-300";
}

export function getProjectTechBadgeClass(tech: string) {
  const techColors: Record<string, string> = {
    react: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    nextjs: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    typescript: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    mongodb: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    redis: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    tailwind: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
    node: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  };
  
  const techLower = tech.toLowerCase();
  return techColors[techLower] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
}

export function getStatCardClass(index: number) {
  const gradients = [
    "from-blue-500 to-blue-600",
    "from-green-500 to-green-600",
    "from-purple-500 to-purple-600",
    "from-orange-500 to-orange-600",
  ];
  return `bg-gradient-to-r ${gradients[index % gradients.length]}`;
}

// State Extraction Utilities
export function getComponentStates(state: HomeStateInterface) {
  const heroBanner_state = {
    heroData: state.heroData,
  };

  const featuredProjects_state = {
    projects: state.featuredProjects,
    isLoading: state.isLoading,
  };

  const servicesSection_state = {
    services: state.services,
  };

  const statsSection_state = {
    stats: state.stats,
  };

  const testimonialsSection_state = {
    testimonials: state.testimonials,
  };

  return {
    heroBanner_state,
    featuredProjects_state,
    servicesSection_state,
    statsSection_state,
    testimonialsSection_state,
  };
}

// Note: Reusable components have been moved to @/lib/components/ui/
// Import them using: import { LoadingSpinner, EmptyState } from '@/lib/components/ui';

// Section Container Component
export function SectionContainer({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <section className={`py-16 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  );
}

// Section Header Component
export function SectionHeader({ 
  title, 
  subtitle 
}: { 
  title: string; 
  subtitle?: string;
}) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// Button Variants
export function getButtonClass(variant: "primary" | "secondary" | "outline") {
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    outline: "border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-600 dark:hover:border-blue-400",
  };
  
  return `px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${variants[variant]}`;
}