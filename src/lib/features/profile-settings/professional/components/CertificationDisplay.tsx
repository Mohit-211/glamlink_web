"use client";

/**
 * CertificationDisplay - Certification visibility controls
 */

import { Award } from "lucide-react";
import { useProfessional } from "../hooks/useProfessional";
import type { CertificationDisplaySettings } from "../types";

interface ToggleFieldProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

function ToggleField({ label, description, checked, onChange, disabled }: ToggleFieldProps) {
  return (
    <div className="flex items-start justify-between py-3">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-900">{label}</label>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-glamlink-teal focus:ring-offset-2 ${
          checked ? 'bg-glamlink-teal' : 'bg-gray-200'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

export default function CertificationDisplay() {
  const { settings, isSaving, updateCertificationSettings } = useProfessional();

  const handleToggle = async (field: keyof CertificationDisplaySettings, value: boolean) => {
    try {
      await updateCertificationSettings({ [field]: value });
    } catch (err) {
      console.error('Failed to update certification setting:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Award className="w-5 h-5 text-glamlink-teal" />
        <h3 className="text-lg font-semibold text-gray-900">Certification Display</h3>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Control how your certifications appear on your profile
      </p>

      {/* Toggle switches */}
      <div className="space-y-1 divide-y divide-gray-100">
        <ToggleField
          label="Show certifications section"
          description="Display your certifications on your profile"
          checked={settings.certifications.showCertifications}
          onChange={(checked) => handleToggle('showCertifications', checked)}
          disabled={isSaving}
        />

        <ToggleField
          label="Show verified badge"
          description="Display verified checkmark on your profile"
          checked={settings.certifications.showVerifiedBadge}
          onChange={(checked) => handleToggle('showVerifiedBadge', checked)}
          disabled={isSaving}
        />

        <ToggleField
          label="Show certification dates"
          description="Display when you received certifications"
          checked={settings.certifications.showCertificationDates}
          onChange={(checked) => handleToggle('showCertificationDates', checked)}
          disabled={isSaving}
        />

        <ToggleField
          label="Show issuing organization"
          description="Display who issued your certifications"
          checked={settings.certifications.showIssuingOrganization}
          onChange={(checked) => handleToggle('showIssuingOrganization', checked)}
          disabled={isSaving}
        />
      </div>
    </div>
  );
}
