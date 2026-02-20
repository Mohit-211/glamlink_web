"use client";

import { Professional } from "@/lib/pages/for-professionals/types/professional";

interface BioSimpleProps {
  professional: Professional;
  className?: string;
}

export default function BioSimple({ professional, className = "" }: BioSimpleProps) {
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

  return (
    <div className={`bio-simple ${className}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="text-gray-700 leading-relaxed">
          <p>{bio}</p>
        </div>
      </div>
    </div>
  );
}
