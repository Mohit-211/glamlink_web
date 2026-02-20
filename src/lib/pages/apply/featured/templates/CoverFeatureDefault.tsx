"use client";

import React from 'react';

// File is a global type in browser environments

interface CoverFeatureDefaultProps {
  data?: {
    fullName?: string;
    bio?: string;
    favoriteQuote?: string;
    achievements?: string[];
    professionalProduct?: string;
    excitementFeatures?: string[];
    headshots?: File[];
    workPhotos?: File[];
    confidenceStory?: string;
  };
  isPreview?: boolean;
}

export default function CoverFeatureDefault({
  data = {},
  isPreview = false
}: CoverFeatureDefaultProps) {
  // Extract and format data
  const fullName = data.fullName || 'Your Name';
  const bio = data.bio || 'Your professional story will appear here...';
  const favoriteQuote = data.favoriteQuote || 'Your favorite quote will inspire others...';
  const achievements = data.achievements?.filter(achievement => achievement.trim()) || [];
  const professionalProduct = data.professionalProduct || 'Share your favorite professional product...';
  const confidenceStory = data.confidenceStory || 'Tell us how you\'ve transformed someone\'s confidence...';

  return (
    <div className={`
      bg-white shadow-xl rounded-lg overflow-hidden
      ${isPreview ? 'scale-95 origin-top' : ''}
    `}>
      {/* Magazine Header */}
      <div className="bg-gradient-to-r from-glamlink-teal to-cyan-600 text-white p-6">
        <div className="text-center">
          <p className="text-sm font-medium tracking-wider uppercase mb-2">The Glamlink Edit</p>
          <h1 className="text-4xl font-bold mb-2">Featured Professional</h1>
          <div className="w-24 h-1 bg-white mx-auto rounded-full"></div>
        </div>
      </div>

      {/* Cover Photo Area */}
      <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Professional Headshot</p>
          </div>
        </div>
        {/* Magazine-style overlay */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <p className="text-xs font-semibold text-gray-800">BEAUTY PROFESSIONAL</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Professional Name and Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{fullName}</h2>
          <p className="text-lg text-gray-600">Beauty Professional & Entrepreneur</p>
        </div>

        {/* Bio Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-0.5 bg-glamlink-teal mr-3"></span>
            Your Story
          </h3>
          <p className="text-gray-700 leading-relaxed text-lg">
            {bio}
          </p>
        </div>

        {/* Achievements Section */}
        {achievements.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-0.5 bg-glamlink-teal mr-3"></span>
              Achievements
            </h3>
            <div className="space-y-3">
              {achievements.slice(0, 5).map((achievement, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-glamlink-teal/10 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-glamlink-teal">•</span>
                  </div>
                  <p className="ml-3 text-gray-700">{achievement}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Favorite Quote */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-0.5 bg-glamlink-teal mr-3"></span>
            Words to Live By
          </h3>
          <blockquote className="border-l-4 border-glamlink-teal pl-6 py-2 bg-gray-50 rounded-r-lg">
            <p className="text-xl text-gray-800 italic font-medium">
              "{favoriteQuote}"
            </p>
          </blockquote>
        </div>

        {/* Professional Product */}
        {professionalProduct && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-0.5 bg-glamlink-teal mr-3"></span>
              Product Spotlight
            </h3>
            <div className="bg-gradient-to-r from-glamlink-teal/5 to-cyan-50 p-6 rounded-lg border border-glamlink-teal/20">
              <p className="text-gray-700 leading-relaxed">
                {professionalProduct}
              </p>
            </div>
          </div>
        )}

        {/* Confidence Story */}
        {confidenceStory && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-0.5 bg-glamlink-teal mr-3"></span>
              Transformative Moment
            </h3>
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                {confidenceStory}
              </p>
            </div>
          </div>
        )}

        {/* Work Gallery Preview */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-0.5 bg-glamlink-teal mr-3"></span>
            Portfolio Showcase
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">
            Connect with {fullName} on Glamlink
          </p>
          <div className="flex justify-center space-x-4">
            <div className="px-4 py-2 bg-glamlink-teal text-white rounded-full text-sm font-medium">
              Book Appointment
            </div>
            <div className="px-4 py-2 border border-glamlink-teal text-glamlink-teal rounded-full text-sm font-medium">
              View Portfolio
            </div>
          </div>
        </div>
      </div>

      {/* Magazine Footer */}
      <div className="bg-gray-100 px-8 py-4">
        <div className="flex justify-between items-center text-xs text-gray-600">
          <p>© 2024 The Glamlink Edit</p>
          <p>Issue #124 • Beauty Professionals Spotlight</p>
        </div>
      </div>
    </div>
  );
}