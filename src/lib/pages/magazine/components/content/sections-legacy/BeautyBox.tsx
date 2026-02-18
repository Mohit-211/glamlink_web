"use client";

import { BeautyBoxSubscription } from "../../../types";
import Image from "next/image";

interface BeautyBoxProps {
  subscriptions: BeautyBoxSubscription[];
  isLoading?: boolean;
  backgroundColor?: string | { main?: string; cards?: string; cta?: string };
}

export default function BeautyBox({ subscriptions, isLoading, backgroundColor }: BeautyBoxProps) {
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
  const ctaBgProps = getBackgroundProps(backgrounds?.cta);
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-96 mb-12"></div>
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-96"></div>
          ))}
        </div>
      </div>
    );
  }

  const getFrequencyLabel = (frequency: BeautyBoxSubscription["frequency"]) => {
    switch (frequency) {
      case "monthly":
        return "Every Month";
      case "quarterly":
        return "Every 3 Months";
      case "bi-annual":
        return "Every 6 Months";
    }
  };

  const getPersonalizationBadge = (level: BeautyBoxSubscription["personalizationLevel"]) => {
    switch (level) {
      case "basic":
        return { text: "Basic Match", color: "bg-gray-100 text-gray-700" };
      case "advanced":
        return { text: "Advanced Match", color: "bg-blue-100 text-blue-700" };
      case "ai-powered":
        return { text: "AI-Powered", color: "bg-purple-100 text-purple-700" };
    }
  };

  return (
    <div className={mainBgProps.className || ""} style={mainBgProps.style}>
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Beauty Box: Personalized Subscriptions</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Curated beauty delivered to your door - subscription businesses grow 5-8x faster</p>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {subscriptions.map((box) => {
          const badge = getPersonalizationBadge(box.personalizationLevel);

          return (
            <div key={box.id} className={`rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow ${cardsBgProps.className || "bg-white"}`} style={cardsBgProps.style}>
              {/* Box Image */}
              <div className="relative h-48 bg-gradient-to-br from-pink-100 to-purple-100">
                <Image src={box.image} alt={box.name} fill className="object-cover" />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>{badge.text}</span>
                </div>
              </div>

              <div className="p-6">
                {/* Box Info */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{box.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{box.description}</p>

                {/* Pricing */}
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">${box.price}</span>
                    <span className="text-gray-500 text-sm ml-1">/{getFrequencyLabel(box.frequency).toLowerCase()}</span>
                  </div>
                  <span className="text-sm text-gray-500">{box.productCount} products</span>
                </div>

                {/* Benefits */}
                <div className="space-y-2 mb-4">
                  {box.benefits.slice(0, 3).map((benefit: string, index: number) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {benefit}
                    </div>
                  ))}
                </div>

                {/* Brands Preview */}
                <div className="border-t pt-4">
                  <p className="text-xs text-gray-500 mb-2">Includes products from:</p>
                  <div className="flex flex-wrap gap-1">
                    {box.includedBrands.slice(0, 4).map((brand: string, index: number) => (
                      <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {brand}
                      </span>
                    ))}
                    {box.includedBrands.length > 4 && <span className="text-xs text-gray-500">+{box.includedBrands.length - 4} more</span>}
                  </div>
                </div>

                {/* CTA Button */}
                <button className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">Subscribe Now</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quiz CTA */}
      <div className={`text-center mt-12 rounded-lg p-8 ${ctaBgProps.className || "bg-gradient-to-r from-purple-50 to-pink-50"}`} style={ctaBgProps.style}>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Not Sure Which Box is Right for You?</h3>
        <p className="text-gray-600 mb-4">Take our 2-minute quiz to get personalized recommendations</p>
        <button className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors">Take the Quiz</button>
      </div>
    </div>
  );
}
