"use client";

import React from 'react';

// File is a global type in browser environments

interface RisingStarDefaultProps {
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
    phone?: string;
    email?: string;
  };
  isPreview?: boolean;
}

export default function RisingStarDefault({
  data = {},
  isPreview = false
}: RisingStarDefaultProps) {
  // Extract and format data
  const fullName = data.fullName || 'Your Name';
  const bio = data.bio || 'Your journey in the beauty industry begins here...';
  const favoriteQuote = data.favoriteQuote || 'Share your inspiration with others...';
  const achievements = data.achievements?.filter(achievement => achievement.trim()) || [];
  const confidenceStory = data.confidenceStory || 'Your confidence-building transformations await...';

  return (
    <div className={`
      bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl rounded-lg overflow-hidden border border-purple-100
      ${isPreview ? 'scale-95 origin-top' : ''}
    `}>
      {/* Rising Star Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <svg className="w-8 h-8 text-yellow-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <h1 className="text-3xl font-bold">Rising Star</h1>
            <svg className="w-8 h-8 text-yellow-300 ml-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
          <p className="text-sm font-medium tracking-wider uppercase mb-2">The Glamlink Edit</p>
          <h2 className="text-2xl font-light">Emerging Beauty Professional</h2>
        </div>
      </div>

      {/* Profile Section */}
      <div className="p-8">
        {/* Professional Profile */}
        <div className="flex items-center mb-8">
          {/* Profile Photo */}
          <div className="w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center mr-6">
            <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>

          {/* Name and Title */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{fullName}</h3>
            <p className="text-gray-600 mb-2">Beauty Professional • Rising Star</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Available in Your Area
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Verified Professional
              </span>
            </div>
          </div>
        </div>

        {/* Journey Section */}
        <div className="mb-8">
          <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <span className="w-6 h-0.5 bg-purple-600 mr-3"></span>
            Journey in Beauty
          </h4>
          <div className="bg-white p-6 rounded-lg border border-purple-100">
            <p className="text-gray-700 leading-relaxed">
              {bio}
            </p>
          </div>
        </div>

        {/* Achievements Timeline */}
        {achievements.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-6 h-0.5 bg-purple-600 mr-3"></span>
              Path to Success
            </h4>
            <div className="space-y-4">
              {achievements.slice(0, 3).map((achievement, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 relative">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-purple-600">{index + 1}</span>
                    </div>
                    {index < achievements.length - 1 && (
                      <div className="absolute top-8 left-4 w-0.5 h-16 bg-purple-200"></div>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-gray-700 bg-purple-50 p-4 rounded-lg">
                      {achievement}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inspirational Quote */}
        <div className="mb-8">
          <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <span className="w-6 h-0.5 bg-purple-600 mr-3"></span>
            Words of Inspiration
          </h4>
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg">
            <blockquote className="text-center">
              <svg className="w-8 h-8 text-purple-300 mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
              <p className="text-xl text-gray-800 italic font-medium mb-3">
                "{favoriteQuote}"
              </p>
              <p className="text-sm text-purple-600 font-medium">— {fullName}</p>
            </blockquote>
          </div>
        </div>

        {/* Transformative Impact */}
        {confidenceStory && (
          <div className="mb-8">
            <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
              <span className="w-6 h-0.5 bg-purple-600 mr-3"></span>
              Making a Difference
            </h4>
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                </svg>
                <p className="text-gray-700 leading-relaxed">
                  {confidenceStory}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Work Showcase */}
        <div className="mb-8">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <span className="w-6 h-0.5 bg-purple-600 mr-3"></span>
            Portfolio Highlights
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* Connect Section */}
        <div className="text-center bg-white rounded-lg border border-purple-200 p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-3">Connect With {fullName}</h4>
          <p className="text-gray-600 mb-4">Join this rising beauty professional on their journey</p>
          <div className="flex justify-center space-x-3">
            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-medium hover:shadow-lg transition-shadow">
              Book Consultation
            </button>
            <button className="px-4 py-2 border border-purple-600 text-purple-600 rounded-full text-sm font-medium hover:bg-purple-50 transition-colors">
              View Profile
            </button>
          </div>
        </div>
      </div>

      {/* Magazine Footer */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-8 py-4">
        <div className="flex justify-between items-center text-xs text-gray-600">
          <p>© 2024 The Glamlink Edit</p>
          <div className="flex items-center">
            <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <p>Rising Stars Series • Issue #45</p>
          </div>
        </div>
      </div>
    </div>
  );
}