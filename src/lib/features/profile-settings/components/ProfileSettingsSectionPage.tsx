"use client";

/**
 * ProfileSettingsSectionPage - Displays a single settings section
 *
 * Used by /profile/settings/[id] and /admin/settings/[id]
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/features/auth/useAuth";
import { logout } from "@/lib/features/auth/authSlice";
import { usePasswordChange } from "../usePasswordChange";
import { useProfileEdit } from "../useProfileEdit";
import { usePrivacy } from "../privacy/hooks/usePrivacy";
import { useBrandSettings } from "../brand/hooks/useBrandSettings";
import { useAccountManagement } from "../account/hooks/useAccountManagement";
import { useSettingsVisibility } from "../hooks/useSettingsVisibility";
import ProfileEditSection from "./ProfileEditSection";
import AccountInfoSection from "./AccountInfoSection";
import SecuritySection from "./SecuritySection";
import TwoFactorSection from "./TwoFactorSection";
import DeviceManagementSection from "./DeviceManagementSection";
import SessionSection from "./SessionSection";
import VerificationSection from "./VerificationSection";
import ProfessionalSection from "./ProfessionalSection";
import NotificationsSection from "./NotificationsSection";
import { PrivacySection } from "../privacy/components";
import { PreferencesSection } from "../preferences";
import { BrandSettingsSection } from "../brand/components";
import { AccountManagementSection } from "../account/components";
import { CommunicationSection } from "../communication";
import SupportBotSettingsSection from "./SupportBotSettingsSection";
import MessagesSettingsSection from "./MessagesSettingsSection";
import { getSectionById } from "../sectionsConfig";
import type { ProfileSettingsVariant, SettingsSectionId } from "../types";
import { useAppDispatch } from "../../../../../store/hooks";

interface ProfileSettingsSectionPageProps {
  sectionId: SettingsSectionId;
  variant?: ProfileSettingsVariant;
}

export default function ProfileSettingsSectionPage({
  sectionId,
  variant = "profile",
}: ProfileSettingsSectionPageProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  // Get section info
  const section = getSectionById(sectionId);

  // Check visibility for profile variant
  const { isLoading, isSubsectionVisible } = useSettingsVisibility();

  // Hooks
  const profileEdit = useProfileEdit();
  const passwordChange = usePasswordChange();
  const privacy = usePrivacy();
  const brand = useBrandSettings();
  const account = useAccountManagement();

  // Sign out state
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Redirect to settings if this section is hidden (only for profile variant)
  useEffect(() => {
    if (variant === "profile" && !isLoading && !isSubsectionVisible(sectionId)) {
      router.replace("/profile/settings");
    }
  }, [variant, isLoading, isSubsectionVisible, sectionId, router]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await dispatch(logout());
      router.push("/profile/login");
    } catch (err) {
      console.error("Failed to sign out:", err);
      setIsSigningOut(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    const baseUrl = variant === "admin" ? "/admin/settings" : "/profile/settings";
    router.push(baseUrl);
  };

  // Show loading state while checking visibility (for profile variant)
  if (variant === "profile" && isLoading) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-4" />
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-lg bg-gray-200" />
            <div>
              <div className="h-6 bg-gray-200 rounded w-48 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-64" />
            </div>
          </div>
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  // Don't render if section is hidden (redirect will happen via useEffect)
  if (variant === "profile" && !isSubsectionVisible(sectionId)) {
    return null;
  }

  if (!section) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Section not found: {sectionId}
        </div>
      </div>
    );
  }

  const Icon = section.icon;

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Back button and Header */}
      <div className="mb-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-glamlink-teal mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Settings
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-glamlink-teal/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-glamlink-teal" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{section.title}</h1>
            <p className="mt-1 text-sm text-gray-500">{section.description}</p>
          </div>
        </div>
      </div>

      {/* Section Content */}
      <div>
        {sectionId === "profile" && <ProfileEditSection {...profileEdit} />}
        {sectionId === "account" && <AccountInfoSection email={user?.email} emailVerified={user?.emailVerified || false} />}
        {sectionId === "security" && (
          <>
            <SecuritySection {...passwordChange} />
            <TwoFactorSection />
            <DeviceManagementSection />
          </>
        )}
        {sectionId === "preferences" && <PreferencesSection />}
        {sectionId === "verification" && <VerificationSection />}
        {sectionId === "privacy" && <PrivacySection {...privacy} />}
        {sectionId === "brand-settings" && <BrandSettingsSection {...brand} />}
        {sectionId === "professional" && <ProfessionalSection />}
        {sectionId === "notifications" && <NotificationsSection />}
        {sectionId === "communication" && <CommunicationSection />}
        {sectionId === "support-bot" && <SupportBotSettingsSection />}
        {sectionId === "messages" && <MessagesSettingsSection />}
        {sectionId === "account-management" && <AccountManagementSection {...account} />}
        {sectionId === "session" && (
          <SessionSection isSigningOut={isSigningOut} onSignOut={handleSignOut} />
        )}
      </div>
    </div>
  );
}
