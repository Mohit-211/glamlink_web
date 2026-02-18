"use client";

import { formatMagazineDate } from "@/lib/pages/admin/utils/dateUtils";
import TypographyWrapper, { TypographySettings } from "../utils/TypographyWrapper";

interface MonthlyChallenge {
  title: string;
  description: string;
  coinReward: number;
  steps: string[];
  deadline?: string;
  participants?: number;
}

interface MonthlyChallengeProps {
  // Allow component to accept both nested challenge object and individual props
  challenge?: MonthlyChallenge;
  title?: string;
  titleTypography?: TypographySettings;
  description?: string;
  descriptionTypography?: TypographySettings;
  coinReward?: number;
  steps?: string[];
  deadline?: string;
  participants?: number;
  className?: string;
  backgroundColor?: string;
}

export default function MonthlyChallenge({ 
  challenge,
  title,
  titleTypography = {},
  description,
  descriptionTypography = {},
  coinReward,
  steps = [],
  deadline,
  participants,
  className = "",
  backgroundColor = "bg-white"
}: MonthlyChallengeProps) {
  // Use challenge object if provided, otherwise use individual props
  const challengeData = challenge || {
    title: title || '',
    description: description || '',
    coinReward: coinReward || 0,
    steps: steps || [],
    deadline,
    participants
  };

  if (!challengeData.title && !title) return null;

  return (
    <div className={`rounded-2xl shadow-lg p-8 ${backgroundColor} ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <TypographyWrapper 
          settings={titleTypography}
          defaultSettings={{
            fontSize: "text-2xl md:text-3xl",
            fontWeight: "font-bold",
            color: "text-gray-900"
          }}
          as="h3"
        >
          {challengeData.title}
        </TypographyWrapper>
        <div className="text-3xl font-bold text-glamlink-gold">
          +{challengeData.coinReward} 🥯
        </div>
      </div>
      
      <TypographyWrapper 
        settings={descriptionTypography}
        defaultSettings={{
          fontSize: "text-base",
          color: "text-gray-700"
        }}
        className="mb-6"
        as="p"
      >
        {challengeData.description}
      </TypographyWrapper>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-bold mb-3 text-gray-900">How to Participate:</h4>
          <ol className="space-y-2">
            {challengeData.steps.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="font-bold text-glamlink-gold mr-2">
                  {index + 1}.
                </span>
                <span className="text-gray-700">{step}</span>
              </li>
            ))}
          </ol>
        </div>
        
        <div>
          <h4 className="font-bold mb-3 text-gray-900">Challenge Details:</h4>
          <div className="space-y-2">
            {challengeData.deadline && (
              <div className="flex justify-between">
                <span className="text-gray-600">Deadline:</span>
                <span className="font-medium">
                  {formatMagazineDate(challengeData.deadline)}
                </span>
              </div>
            )}
            {challengeData.participants && (
              <div className="flex justify-between">
                <span className="text-gray-600">Participants:</span>
                <span className="font-medium">{challengeData.participants}+</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}