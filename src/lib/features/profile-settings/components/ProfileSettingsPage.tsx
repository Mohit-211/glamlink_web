"use client";

/**
 * ProfileSettingsPage - Main settings overview with clickable section cards
 *
 * Used by both /profile/settings and /admin/settings
 */

import SettingsSectionCard from "./SettingsSectionCard";
import { getSectionsForVariant } from "../sectionsConfig";
import { useSettingsVisibility } from "../hooks/useSettingsVisibility";
import type { ProfileSettingsVariant } from "../types";

interface ProfileSettingsPageProps {
  variant?: ProfileSettingsVariant;
}

export default function ProfileSettingsPage({ variant = "profile" }: ProfileSettingsPageProps) {
  const allSections = getSectionsForVariant(variant);
  const { isLoading, isSubsectionVisible } = useSettingsVisibility();

  // Filter sections based on visibility settings (only for profile variant)
  const sections = variant === "profile"
    ? allSections.filter(section => isSubsectionVisible(section.id))
    : allSections;

  const title = variant === "admin" ? "Profile Settings" : "Profile Settings";
  const subtitle = "Manage your account settings and preferences";

  // Show loading state while fetching visibility
  if (variant === "profile" && isLoading) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      </div>

      {/* Settings Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => (
          <SettingsSectionCard key={section.id} section={section} variant={variant} />
        ))}
      </div>
    </div>
  );
}
