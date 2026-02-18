"use client";

import { useMemo } from "react";
import { MemoizedMapSection, BusinessHours } from "../contact";
import { SimpleSpecialtiesDisplay } from "../../items/lists";
import QuickActions from "../QuickActions";
import { Professional } from "@/lib/pages/for-professionals/types/professional";
import { normalizeLocations } from "@/lib/utils/migrations/locationMigration";

interface AboutMeProps {
  professional: Professional;
  className?: string;
  showMap?: boolean;
  showContact?: boolean;
  showHours?: boolean;
  showAddressOverlay?: boolean;
  showAddressBelowMap?: boolean;
}

export default function AboutMe({
  professional,
  className = "",
  showMap = true,
  showContact = true,
  showHours = true,
  showAddressOverlay = true,
  showAddressBelowMap = false,
}: AboutMeProps) {
  // Enhanced bio if not available
  const getProfessionalBio = () => {
    if (professional.bio) return professional.bio;
    if (professional.description) return professional.description;

    const firstName = professional.name.split(' ')[0];
    const pronoun = 'she'; // Default to she/her for better UX
    const pronounPossessive = 'her';
    const expandSkills = pronoun === 'she' ? 'expands' : 'expand';

    return `${professional.name} is a certified ${professional.specialty} professional with over ${professional.yearsExperience || 5} years of experience. ` +
    `Specializing in ${professional.specialty.toLowerCase()} services, ${firstName} is dedicated to providing exceptional beauty and wellness services ` +
    `to clients in the ${professional.location || 'the'} area. With a passion for the latest trends and techniques, ${pronoun} ` +
    `continuously ${expandSkills} skills to deliver outstanding results.`;
  };

  const bio = getProfessionalBio();

  // Format experience years
  const getExperienceText = () => {
    const years = professional.yearsExperience || 5;
    if (years === 1) return "1 year of experience";
    return `${years}+ years of experience`;
  };

  // Certification levels - using type assertion to allow general certifications
  const certifications: string[] = professional.certificationLevel ? [professional.certificationLevel] : [];
  if (certifications.length === 0) {
    certifications.push(
      "Licensed Cosmetologist",
      "Advanced Color Specialist",
      "CPR & First Aid Certified"
    );
  }

  // Check if there are locations with valid coordinates (for conditional rendering)
  const hasLocations = useMemo(() => {
    const locations = normalizeLocations(professional);
    // Only return true if at least one location has valid lat/lng coordinates
    return locations.some(loc =>
      loc.lat !== undefined &&
      loc.lng !== undefined &&
      loc.lat !== 0 &&
      loc.lng !== 0 &&
      !isNaN(loc.lat) &&
      !isNaN(loc.lng)
    );
  }, [professional.locations, professional.locationData]);

  return (
    <div className={`about-me ${className}`}>
      {/* Main Layout: Map (70%) and Specialties (30%) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        {/* Google Maps - Full width on desktop (since specialties are hidden), 8 columns on mobile layout */}
        {showMap && hasLocations && (
          <div className="md:col-span-12">
            {/* Memoized Map Section - only re-renders when locations change */}
            <MemoizedMapSection
              professional={professional}
              showAddressOverlay={showAddressOverlay}
              showAddressBelowMap={showAddressBelowMap}
            />

            {/* Professional Bio - Below map, same width as map */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6 shadow-sm">
              <div className="text-gray-700 leading-relaxed">
                <p>{bio}</p>
              </div>
            </div>
          </div>
        )}

        {/* Specialties & Quick Actions - Right side (4 columns on mobile only, hidden on desktop) */}
        <div className="md:hidden md:col-span-4 space-y-6">
          {/* Specialties Display */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Specialties</h3>
            <SimpleSpecialtiesDisplay specialties={professional.specialties} />
          </div>

          {/* Business Hours */}
          <div>
            <BusinessHours professional={professional} />
          </div>

          {/* Quick Actions Buttons (No Title) */}
          <div>
            <QuickActions professional={professional} layout="list" />
          </div>
        </div>
      </div>
    </div>
  );
}