"use client";

import { useState } from "react";
import { BeautyInvestment as BeautyInvestmentType } from "../../../types";
import Image from "next/image";
import Link from "next/link";

interface BeautyInvestmentProps {
  investments?: BeautyInvestmentType[];
  isLoading?: boolean;
  backgroundColor?: string | { main?: string; calculator?: string; products?: string; tips?: string };
}

export default function BeautyInvestment({ investments, isLoading, backgroundColor }: BeautyInvestmentProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [customPrice, setCustomPrice] = useState<string>("");
  const [usageFrequency, setUsageFrequency] = useState<number>(1);

  // Mock data for when no investments are provided
  const mockInvestments: BeautyInvestmentType[] = [
    {
      productId: "inv-1",
      productName: "Professional Grade Vitamin C Serum",
      price: 89.0,
      costPerUse: 0.99,
      longevityDays: 90,
      roi: "3x value vs drugstore alternatives",
      comparisons: [
        { alternativeName: "Drugstore Vitamin C", alternativePrice: 15.99, savingsPerYear: -120 },
        { alternativeName: "DIY Vitamin C Mix", alternativePrice: 5.99, savingsPerYear: -180 },
      ],
    },
    {
      productId: "inv-2",
      productName: "Medical-Grade Retinol Treatment",
      price: 125.0,
      costPerUse: 1.39,
      longevityDays: 90,
      roi: "5x more effective than OTC retinol",
      comparisons: [
        { alternativeName: "OTC Retinol Cream", alternativePrice: 35.0, savingsPerYear: -60 },
        { alternativeName: "Prescription Tretinoin", alternativePrice: 150.0, savingsPerYear: 100 },
      ],
    },
    {
      productId: "inv-3",
      productName: "Luxury Face Oil Blend",
      price: 156.0,
      costPerUse: 2.6,
      longevityDays: 60,
      roi: "Replaces 3-4 separate products",
      comparisons: [
        { alternativeName: "Multiple Single Oils", alternativePrice: 180.0, savingsPerYear: 144 },
        { alternativeName: "Basic Face Oil", alternativePrice: 45.0, savingsPerYear: -222 },
      ],
    },
  ];

  const calculateInvestment = (price: number, frequency: number) => {
    const dailyUses = frequency;
    const bottleSize = 30; // ml
    const usagePerApplication = 0.5; // ml
    const daysToFinish = bottleSize / (usagePerApplication * dailyUses);
    const costPerUse = price / (daysToFinish * dailyUses);
    const yearlyBottles = 365 / daysToFinish;
    const yearlyCost = price * yearlyBottles;

    return {
      daysToFinish: Math.round(daysToFinish),
      costPerUse: costPerUse.toFixed(2),
      yearlyBottles: yearlyBottles.toFixed(1),
      yearlyCost: yearlyCost.toFixed(0),
    };
  };

  const displayInvestments = investments && investments.length > 0 ? investments : mockInvestments;

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
  const calculatorBgProps = getBackgroundProps(backgrounds?.calculator);
  const productsBgProps = getBackgroundProps(backgrounds?.products);
  const tipsBgProps = getBackgroundProps(backgrounds?.tips);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-96 mb-12"></div>
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-48"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div {...mainBgProps} className={mainBgProps?.className || ""}>
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Beauty Investment Calculator</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Understand the true value of premium beauty products with cost-per-use analysis</p>
      </div>

      {/* Investment Calculator */}
      <div className="bg-gradient-to-r from-gold-50 to-yellow-50 rounded-2xl p-8 mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Calculate Your Beauty ROI</h3>

        <div className="max-w-2xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Product Price Input */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Product Price ($)</label>
              <input type="number" value={customPrice} onChange={(e) => setCustomPrice(e.target.value)} placeholder="Enter price" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
            </div>

            {/* Usage Frequency */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Uses Per Day</label>
              <select value={usageFrequency} onChange={(e) => setUsageFrequency(Number(e.target.value))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                <option value={1}>Once daily</option>
                <option value={2}>Twice daily</option>
                <option value={3}>Three times daily</option>
              </select>
            </div>
          </div>

          {customPrice && Number(customPrice) > 0 && (
            <div className={`rounded-lg p-6 ${calculatorBgProps?.className || "bg-white"}`} {...(calculatorBgProps?.style && { style: calculatorBgProps.style })}>
              <h4 className="font-semibold text-gray-900 mb-4">Your Investment Analysis:</h4>
              {(() => {
                const calc = calculateInvestment(Number(customPrice), usageFrequency);
                return (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">${calc.costPerUse}</div>
                      <div className="text-sm text-gray-600">Per Use</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{calc.daysToFinish}</div>
                      <div className="text-sm text-gray-600">Days to Finish</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{calc.yearlyBottles}</div>
                      <div className="text-sm text-gray-600">Bottles/Year</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">${calc.yearlyCost}</div>
                      <div className="text-sm text-gray-600">Yearly Cost</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Featured Investment Products */}
      <div className="space-y-6">
        {displayInvestments.map((investment) => (
          <div key={investment.productId} className={`rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow ${productsBgProps?.className || "bg-white"}`} {...(productsBgProps?.style && { style: productsBgProps.style })}>
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{investment.productName}</h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-3xl font-bold text-gray-900">${investment.price}</span>
                    <span className="text-lg text-gray-600">${investment.costPerUse} per use</span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">{investment.longevityDays} day supply</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="text-sm text-gray-600 mb-1">Return on Investment:</div>
                  <div className="text-lg font-semibold text-green-600">{investment.roi}</div>
                </div>
              </div>

              {/* Comparisons */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Cost Comparison (Annual)</h4>
                <div className="space-y-3">
                  {investment.comparisons.map((comparison, idx) => {
                    const isSaving = comparison.savingsPerYear > 0;
                    return (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{comparison.alternativeName}</div>
                          <div className="text-sm text-gray-600">${comparison.alternativePrice} per bottle</div>
                        </div>
                        <div className={`text-lg font-semibold ${isSaving ? "text-green-600" : "text-red-600"}`}>
                          {isSaving ? "+" : ""}
                          {Math.abs(comparison.savingsPerYear)} {isSaving ? "saved" : "more"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Investment Tips */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <div className={`rounded-lg p-6 text-center ${tipsBgProps?.className || "bg-white"}`} {...(tipsBgProps?.style && { style: tipsBgProps.style })}>
          <div className="text-3xl mb-3">💡</div>
          <h4 className="font-semibold text-gray-900 mb-2">Buy in Bulk</h4>
          <p className="text-sm text-gray-600">Save 15-20% by purchasing larger sizes or multi-packs</p>
        </div>
        <div className={`rounded-lg p-6 text-center ${tipsBgProps?.className || "bg-white"}`} {...(tipsBgProps?.style && { style: tipsBgProps.style })}>
          <div className="text-3xl mb-3">🎯</div>
          <h4 className="font-semibold text-gray-900 mb-2">Target Key Products</h4>
          <p className="text-sm text-gray-600">Invest in serums and treatments for maximum impact</p>
        </div>
        <div className={`rounded-lg p-6 text-center ${tipsBgProps?.className || "bg-white"}`} {...(tipsBgProps?.style && { style: tipsBgProps.style })}>
          <div className="text-3xl mb-3">📊</div>
          <h4 className="font-semibold text-gray-900 mb-2">Track Results</h4>
          <p className="text-sm text-gray-600">Document improvements to justify premium purchases</p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">Ready to make smarter beauty investments?</p>
        <Link href="/brand" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-colors">
          Shop Investment-Worthy Products
        </Link>
      </div>
    </div>
  );
}
