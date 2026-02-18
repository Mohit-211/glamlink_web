"use client";

/**
 * ProfessionalSection - Professional display settings summary for settings page
 */

import Link from "next/link";
import { Shield, Award, Image, DollarSign, Star, ArrowRight } from "lucide-react";
import { useProfessional } from "../hooks/useProfessional";
import { PORTFOLIO_ACCESS_OPTIONS, PRICING_DISPLAY_OPTIONS, REVIEW_VISIBILITY_OPTIONS } from "../config";

interface StatusItemProps {
  icon: typeof Award;
  label: string;
  value: string | undefined;
}

function StatusItem({ icon: Icon, label, value }: StatusItemProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-700">{label}</span>
      </div>
      <span className="text-sm font-medium text-gray-900">{value || "Not set"}</span>
    </div>
  );
}

export default function ProfessionalSection() {
  const { settings, isLoading } = useProfessional();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900">Professional Display</h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-glamlink-teal" />
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-semibold text-gray-900">Professional Display</h2>
      </div>

      {/* Quick Status Summary */}
      <div className="border-t border-gray-100 -mx-6 px-6 py-2">
        <StatusItem
          icon={Award}
          label="Certifications"
          value={settings.certifications.showCertifications ? "Visible" : "Hidden"}
        />
        <StatusItem
          icon={Image}
          label="Portfolio"
          value={PORTFOLIO_ACCESS_OPTIONS.find(o => o.value === settings.portfolio.access)?.label}
        />
        <StatusItem
          icon={DollarSign}
          label="Pricing"
          value={PRICING_DISPLAY_OPTIONS.find(o => o.value === settings.pricing.display)?.label}
        />
        <StatusItem
          icon={Star}
          label="Reviews"
          value={REVIEW_VISIBILITY_OPTIONS.find(o => o.value === settings.reviews.visibility)?.label}
        />
      </div>

      {/* Link to Detail Page */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link
          href="/profile/professional"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-glamlink-teal hover:text-glamlink-teal/80 transition-colors"
        >
          Manage Display Settings
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
