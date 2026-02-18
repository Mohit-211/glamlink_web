/**
 * TaxFilingPage Component
 *
 * Tax information and automated filing
 */

'use client';

import { FileText, CheckCircle, Link as LinkIcon, Settings, DollarSign } from 'lucide-react';

export default function TaxFilingPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Automated Filing</h1>
        <p className="text-sm text-gray-500 mt-1">
          Simplify your tax filing process
        </p>
      </div>

      {/* Main CTA */}
      <div className="bg-gradient-to-br from-glamlink-teal to-glamlink-teal/80 rounded-lg p-8 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">
              Put your sales tax returns on autopilot
            </h2>
            <p className="text-white/90 mb-6">
              Automated filing prepares, files and remits your taxes for you.
            </p>
            <button className="px-6 py-3 bg-white text-glamlink-teal rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Get started
            </button>
          </div>
          <FileText className="h-24 w-24 text-white/20" />
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Streamlined filing
          </h3>
          <p className="text-sm text-gray-500">
            Automate tax returns in a few easy steps from your admin
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <LinkIcon className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Seamless integration
          </h3>
          <p className="text-sm text-gray-500">
            Reduce errors with data pulled directly from your store
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Settings className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Flexible controls
          </h3>
          <p className="text-sm text-gray-500">
            Choose what to file and how you want to review returns
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
            <DollarSign className="h-6 w-6 text-yellow-600" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            No hidden costs
          </h3>
          <p className="text-sm text-gray-500">
            Pay a flat fee of $75 per generated return
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Frequently asked questions
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {[
            {
              question: 'How does Glamlink Tax automated filing work?',
              answer: 'Automated filing integrates directly with your Glamlink store to pull transaction data, calculate taxes owed, and file returns with tax authorities on your behalf.',
            },
            {
              question: 'What types of returns are supported?',
              answer: 'We currently support sales tax returns for all 50 US states and local jurisdictions where applicable.',
            },
            {
              question: 'Will I have access to the returns filed on my behalf?',
              answer: 'Yes, you will have full access to view and download all returns filed through the automated system in your Finance dashboard.',
            },
            {
              question: 'Can I qualify for early or on-time filing discounts?',
              answer: 'Yes, our automated system files on time to help you qualify for any available discounts or avoid late penalties.',
            },
            {
              question: 'Does automated filing support marketplaces?',
              answer: 'Yes, Glamlink automated filing is designed specifically for marketplace sellers and handles complex multi-jurisdiction scenarios.',
            },
          ].map((faq, index) => (
            <details key={index} className="group">
              <summary className="px-6 py-4 cursor-pointer list-none flex items-center justify-between hover:bg-gray-50">
                <span className="text-sm font-medium text-gray-900">
                  {faq.question}
                </span>
                <span className="ml-6 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="px-6 pb-4 text-sm text-gray-500">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Tax Documents (future) */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tax Documents</h2>
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No tax documents available yet</p>
          <p className="text-xs text-gray-400 mt-1">
            1099-K forms will be generated annually in January
          </p>
        </div>
      </div>
    </div>
  );
}
