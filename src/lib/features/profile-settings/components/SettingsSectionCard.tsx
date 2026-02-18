"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { SettingsSection, ProfileSettingsVariant } from "../types";

interface SettingsSectionCardProps {
  section: SettingsSection;
  variant: ProfileSettingsVariant;
}

export default function SettingsSectionCard({ section, variant }: SettingsSectionCardProps) {
  const Icon = section.icon;
  const baseUrl = variant === "admin" ? "/admin/settings" : "/profile/settings";
  const href = `${baseUrl}/${section.id}`;

  return (
    <Link
      href={href}
      className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:border-glamlink-teal hover:shadow-md transition-all duration-200"
    >
      <div className="p-6 flex items-center gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-glamlink-teal/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-glamlink-teal" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 mb-1">{section.title}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{section.description}</p>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0">
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </Link>
  );
}
