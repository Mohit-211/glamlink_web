"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

export default function TwoBoxesSection() {
  const [showForm, setShowForm] = useState(false);
  const aiFeatures = [
    "Secure your spot as one of the first pros AI recommends",
    "Turn your expertise into constant client flow",
    "Glamlink AI connects clients with the most relevant, engaged pros",
    "Set up your shop early so your products are included in the future AI-driven recommendations"
  ];

  const foundersCriteria = [
    "Complete your profile with at least 2 photo albums with your best work",
    "Add Services & Hours if you'd like to be booked",
    "Add at least 1 Post and 1 Clip",
    "Refer 2 friends on the pinned post on Instagram @glamlink_app (& Follow)"
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* AI Box */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-2 bg-glamlink-teal"></div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Lock In Your Profile Before Glamlink AI Goes Live
                </h3>
                
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Glamlink is redefining how beauty professionals get discovered. 
                  Our upcoming AI will analyze clients needs and match them with 
                  the right treatments, products and professionals. AI connects 
                  your expertise with the right clients.
                </p>

                <div className="space-y-4 mb-8">
                  {aiFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-glamlink-teal/10 rounded-full flex items-center justify-center mt-0.5">
                        <Check className="w-4 h-4 text-glamlink-teal" />
                      </div>
                      <p className="text-gray-700">{feature}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowForm(true)}
                  className="block w-full text-center px-6 py-3 bg-glamlink-teal text-white font-semibold rounded-full hover:bg-glamlink-teal-dark transition-colors"
                >
                  Join Before AI Launches
                </button>
              </div>
            </div>

            {/* Founders Badge Box */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-2 bg-glamlink-teal"></div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Be One Of The 100 Founding Professionals
                </h3>
                
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Founding Pros get early visibility, priority features and a badge 
                  of authority that sets you apart. Get featured in "The Glamlink Edit", 
                  be discovered faster and lead the future of beauty.
                </p>

                <div className="mb-6">
                  <p className="font-semibold text-gray-900 mb-4">Criteria:</p>
                  <div className="space-y-3">
                    {foundersCriteria.map((criteria, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-glamlink-teal/10 rounded-full flex items-center justify-center mt-0.5">
                          <Check className="w-4 h-4 text-glamlink-teal" />
                        </div>
                        <p className="text-gray-700">{criteria}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowForm(true)}
                  className="block w-full text-center px-6 py-3 bg-glamlink-teal text-white font-semibold rounded-full hover:bg-glamlink-teal-dark transition-colors"
                >
                  Claim Your Founders Badge
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900">
                Apply to Get Featured
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Complete the application below to be considered for featuring in Glamlink.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setShowForm(false);
                  const formElement = document.getElementById('get-featured-form');
                  if (formElement) {
                    formElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-6 py-3 bg-glamlink-teal text-white font-semibold rounded-full hover:bg-glamlink-teal-dark transition-colors"
              >
                Go to Application Form
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}