import {
  User,
  Mail,
  Lock,
  Palette,
  ShieldCheck,
  Eye,
  Briefcase,
  Award,
  Bell,
  MessageSquare,
  Settings,
  LogOut,
  Bot,
  Inbox,
} from "lucide-react";
import type { SettingsSection } from "./types";

export const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    id: "profile",
    title: "Profile",
    description: "Manage your display name, username, and bio",
    icon: User,
  },
  {
    id: "account",
    title: "Account",
    description: "View and manage your email address",
    icon: Mail,
  },
  {
    id: "security",
    title: "Security",
    description: "Change your password and manage security settings",
    icon: Lock,
  },
  {
    id: "preferences",
    title: "Preferences",
    description: "Customize your experience with theme, language, and regional settings",
    icon: Palette,
  },
  {
    id: "verification",
    title: "Business Verification",
    description: "Verify your business to build trust and unlock features",
    icon: ShieldCheck,
    variant: ["profile"], // Only for profile, not admin
  },
  {
    id: "privacy",
    title: "Privacy Settings",
    description: "Control who can see your information and activity",
    icon: Eye,
    variant: ["profile"], // Only for profile
  },
  {
    id: "brand-settings",
    title: "Brand Settings",
    description: "Manage your business hours, location, and brand information",
    icon: Briefcase,
    variant: ["profile"], // Only for profile
  },
  {
    id: "professional",
    title: "Professional Display",
    description: "Configure how your certifications and services are displayed",
    icon: Award,
    variant: ["profile"], // Only for profile
  },
  {
    id: "notifications",
    title: "Notification Preferences",
    description: "Manage how we communicate with you",
    icon: Bell,
    variant: ["profile"], // Only for profile
  },
  {
    id: "communication",
    title: "Communication",
    description: "Manage contact methods, booking availability, and auto-replies",
    icon: MessageSquare,
    variant: ["profile"], // Only for profile
  },
  {
    id: "support-bot",
    title: "AI Support Bot",
    description: "Configure the AI-powered support assistant and FAQ responses",
    icon: Bot,
    variant: ["profile"], // Only for profile
  },
  {
    id: "messages",
    title: "Messages",
    description: "Manage your support conversations and messaging preferences",
    icon: Inbox,
    variant: ["profile"], // Only for profile
  },
  {
    id: "account-management",
    title: "Account Management",
    description: "Manage your data, account status, and brand",
    icon: Settings,
    variant: ["profile"], // Only for profile
  },
  {
    id: "session",
    title: "Session",
    description: "Sign out of your account",
    icon: LogOut,
  },
];

/**
 * Get sections for a specific variant
 */
export function getSectionsForVariant(variant: "profile" | "admin"): SettingsSection[] {
  return SETTINGS_SECTIONS.filter((section) => {
    // If no variant specified, available for both
    if (!section.variant) return true;
    // Otherwise, check if this variant is included
    return section.variant.includes(variant);
  });
}

/**
 * Get a section by ID
 */
export function getSectionById(id: string): SettingsSection | undefined {
  return SETTINGS_SECTIONS.find((section) => section.id === id);
}
