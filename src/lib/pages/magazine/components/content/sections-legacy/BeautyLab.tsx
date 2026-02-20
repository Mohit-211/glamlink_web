"use client";

import { ClinicalTrial } from "../../../types";
import Image from "next/image";
import Link from "next/link";

interface BeautyLabProps {
  trials: ClinicalTrial[];
  isLoading?: boolean;
  backgroundColor?: string | { main?: string; cards?: string };
}

export default function BeautyLab({ trials, isLoading, backgroundColor }: BeautyLabProps) {
  // Parse background colors
  const backgrounds = typeof backgroundColor === "object" ? backgroundColor : { main: backgroundColor };

  // Check if a value is a Tailwind class
  const isTailwindClass = (value?: string) => {
    return value && (value.startsWith("bg-") || value.includes(" bg-") || value.includes("from-") || value.includes("to-"));
  };

  // Apply background style or class
  const getBackgroundProps = (bgValue?: string) => {
    if (!bgValue || bgValue === "transparent") return {};
    if (isTailwindClass(bgValue)) {
      return { className: bgValue };
    }
    return { style: { background: bgValue } };
  };

  const mainBgProps = getBackgroundProps(backgrounds?.main);
  const cardsBgProps = getBackgroundProps(backgrounds?.cards);
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-96 mb-12"></div>
        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={mainBgProps.className || ""} style={mainBgProps.style}>
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Beauty Lab: Clinical Trials & Results</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Real scientific data from dermatologist-approved clinical trials</p>
      </div>

      {/* Trials Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {trials.map((trial) => (
          <div key={trial.id} className={`rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow ${cardsBgProps.className || "bg-white"}`} style={cardsBgProps.style}>
            <div className="p-6">
              {/* Product Info */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Link href={`/brand/${trial.brandId}/products/${trial.productId}`} className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                    {trial.productName}
                  </Link>
                  <p className="text-sm text-gray-500">{trial.brandName}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{trial.clinicalRating}/5</div>
                  <p className="text-xs text-gray-500">Clinical Rating</p>
                </div>
              </div>

              {/* Trial Details */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-500">Duration</p>
                  <p className="font-medium">{trial.duration}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-500">Participants</p>
                  <p className="font-medium">{trial.participants} people</p>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-2 mb-4">
                <h4 className="font-medium text-gray-900">Clinical Results:</h4>
                {trial.results.map((result, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{result.metric}</span>
                    <span className="font-medium text-green-600">
                      {result.improvement} in {result.timeframe}
                    </span>
                  </div>
                ))}
              </div>

              {/* Dermatologist Review */}
              {trial.dermatologistReview && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 italic">"{trial.dermatologistReview}"</p>
                  <p className="text-xs text-gray-500 mt-1">- Board Certified Dermatologist</p>
                </div>
              )}

              {/* Before/After Preview */}
              {trial.beforeAfterImages && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Image src={trial.beforeAfterImages.before} alt="Before" width={150} height={150} className="rounded object-cover w-full h-32" />
                    <span className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">Before</span>
                  </div>
                  <div className="relative">
                    <Image src={trial.beforeAfterImages.after} alt="After" width={150} height={150} className="rounded object-cover w-full h-32" />
                    <span className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">After</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* View All Link */}
      <div className="text-center mt-12">
        <Link href="/clinical-trials" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
          View All Clinical Trials
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
