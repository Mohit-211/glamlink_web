"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import IssueCard from "./IssueCard";
import EmailSignupModal from "@/lib/components/modals/EmailSignupModal";
import { MagazineIssueCard } from "../../types";

interface MagazineListingProps {
  issues: MagazineIssueCard[];
  issuesByYear: Record<number, MagazineIssueCard[]>;
}

export default function MagazineListing({ issues, issuesByYear }: MagazineListingProps) {
  const router = useRouter();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<MagazineIssueCard | null>(null);
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [showNewsletterOnly, setShowNewsletterOnly] = useState(false);
  const [isDigitalEdition, setIsDigitalEdition] = useState(false);

  // Check if user has already subscribed
  useEffect(() => {
    const subscribed = localStorage.getItem("glamlink_newsletter_subscribed");
    setHasSubscribed(subscribed === "true");
  }, []);

  const handleIssueClick = (e: React.MouseEvent, issue: MagazineIssueCard) => {
    e.preventDefault();
    setSelectedIssue(issue);
    setIsDigitalEdition(false);

    // Check if user has already subscribed
    const subscribed = localStorage.getItem("glamlink_newsletter_subscribed");

    if (subscribed === "true") {
      // Already subscribed, go directly to issue
      router.push(`/magazine/${issue.urlId || issue.id}`);
    } else {
      // Show email signup modal
      setShowEmailModal(true);
    }
  };

  const handleDigitalEditionClick = (e: React.MouseEvent, issue: MagazineIssueCard) => {
    e.preventDefault();
    setSelectedIssue(issue);
    setIsDigitalEdition(true);

    // Check if user has already subscribed
    const subscribed = localStorage.getItem("glamlink_newsletter_subscribed");

    if (subscribed === "true") {
      // Already subscribed, go directly to digital edition
      router.push(`/magazine/${issue.urlId || issue.id}/digital`);
    } else {
      // Show email signup modal
      setShowEmailModal(true);
    }
  };

  const handleContinueAsGuest = () => {
    setShowEmailModal(false);
    if (selectedIssue) {
      if (isDigitalEdition) {
        router.push(`/magazine/${selectedIssue.urlId || selectedIssue.id}/digital`);
      } else {
        router.push(`/magazine/${selectedIssue.urlId || selectedIssue.id}`);
      }
    }
  };

  const handleModalClose = () => {
    setShowEmailModal(false);
    setSelectedIssue(null);
    setShowNewsletterOnly(false);
    setIsDigitalEdition(false);
  };

  const handleNewsletterButtonClick = () => {
    setShowNewsletterOnly(true);
    setSelectedIssue(null);
    setShowEmailModal(true);
  };

  const sortedIssues = [...issues].sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());

  return (
    <>
      {/* Newsletter Signup Button - Always visible in hero */}
      <div className="container mx-auto px-4 pb-8">
        <div className="flex justify-center gap-3 flex-wrap">
          <button onClick={handleNewsletterButtonClick} className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-glamlink-teal to-teal-600 text-white font-semibold rounded-full hover:from-glamlink-teal-dark hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Subscribe to Newsletter
          </button>
        </div>
      </div>

      {/* Issues Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 magazine-issues">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">Issues</h2>

          {sortedIssues.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-4">No magazine issues available at the moment.</p>
              <p className="text-gray-400">Check back soon for new content!</p>
            </div>
          ) : (
            <>
              {/* Year Groups */}
              {Object.entries(issuesByYear)
                .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
                .map(([year, yearIssues]) => (
                  <div key={year} className="mb-16">
                    {/* Year Header */}
                    <div className="flex items-center gap-4 mb-8">
                      <h3 className="text-3xl font-bold text-gray-900">{year}</h3>
                      <span className="text-gray-500 text-lg">{yearIssues.length} ISSUES</span>
                    </div>

                    {/* Issues Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                      {yearIssues.map((issue) => (
                        <div key={issue.id} className="flex flex-col">
                          <IssueCard issue={issue} onClick={() => handleIssueClick(new MouseEvent("click") as any, issue)} />
                          <div className="mt-4 flex justify-center gap-3">
                            <button onClick={(e) => handleIssueClick(e, issue)} className="inline-block text-center px-6 py-3 bg-glamlink-teal text-white font-semibold rounded-full hover:bg-glamlink-teal-dark transition-colors">
                              View Issue
                            </button>
                            {/* Digital Edition Button - Only show if publuuLink exists */}
                            {(issue as any).publuuLink && (
                              <button onClick={(e) => handleDigitalEditionClick(e, issue)} className="inline-flex items-center px-6 py-3 bg-gray-800 text-white font-semibold rounded-full hover:bg-gray-900 transition-colors">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                  />
                                </svg>
                                Digital Edition
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>
      </section>

      {/* Email Signup Modal */}
      <EmailSignupModal isOpen={showEmailModal} onClose={handleModalClose} onContinueAsGuest={showNewsletterOnly ? undefined : handleContinueAsGuest} issueTitle={showNewsletterOnly ? undefined : selectedIssue?.title} />
    </>
  );
}
