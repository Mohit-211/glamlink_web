"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function TermsOfUsePage() {
  const [activeSection, setActiveSection] = useState<string>("");

  const sections = [
    { id: "1", title: "Service Providers", anchor: "service-providers" },
    { id: "2", title: "Client Booking Service", anchor: "client-booking-service" },
    { id: "3", title: "Website Access", anchor: "website-access" },
    { id: "4", title: "Third-Party Content / Interactive Features", anchor: "third-party-content" },
    { id: "5", title: "Intellectual Property Information", anchor: "intellectual-property" },
    { id: "6", title: "Warranty Disclaimer", anchor: "warranty-disclaimer" },
    { id: "7", title: "Limitation of Liability", anchor: "limitation-of-liability" },
    { id: "8", title: "Unsolicited Material and Ideas", anchor: "unsolicited-material" },
    { id: "9", title: "Indemnity", anchor: "indemnity" },
    { id: "10", title: "Digital Millennium Copyright Act", anchor: "dmca" },
    { id: "11", title: "Privacy Policy", anchor: "privacy" },
    { id: "12", title: "Governing Law / Disputes", anchor: "governing-law" },
    { id: "13", title: "Assignment / Modification", anchor: "assignment-modification" },
    { id: "14", title: "Ability to Accept Terms of Use", anchor: "ability-to-accept" },
    { id: "15", title: "Consent", anchor: "consent" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map((section) => ({
        id: section.id,
        element: document.getElementById(section.anchor),
      })).filter(({ element }) => element !== null);

      if (sectionElements.length === 0) return;

      // Find the section that's currently most visible
      const currentSection = sectionElements.find(({ element }) => {
        const rect = element!.getBoundingClientRect();
        return rect.top <= 150 && rect.bottom > 150;
      });

      // If no section is exactly at the threshold, find the closest one above
      if (!currentSection && sectionElements.length > 0) {
        const lastSection = sectionElements.reduce((prev, current) => {
          const prevRect = prev.element!.getBoundingClientRect();
          const currentRect = current.element!.getBoundingClientRect();
          return (prevRect.top < currentRect.top && prevRect.top > 0) ? prev : current;
        });

        if (lastSection) {
          const rect = lastSection.element!.getBoundingClientRect();
          if (rect.top < 300) { // If we're close enough to the section
            setActiveSection(lastSection.id);
            return;
          }
        }
      }

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Small delay to ensure DOM is ready
    setTimeout(handleScroll, 100);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (anchorId: string) => {
    const element = document.getElementById(anchorId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-10">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Use</h1>
            <p className="text-lg text-gray-600 mb-6">Last revised on January 25, 2025</p>
            <nav className="flex flex-wrap gap-2 justify-center">
              <Link href="/" className="text-glamlink-teal hover:text-glamlink-teal-dark">
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Terms of Use</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Table of Contents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {sections.map((section) => (
                <button key={section.id} onClick={() => scrollToSection(section.anchor)} className={`text-left px-4 py-2 rounded-lg transition-colors ${activeSection === section.id ? "bg-glamlink-teal text-white font-medium" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}>
                  <span className="text-sm font-medium">{section.id}.</span> {section.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border p-8 md:p-12">
              {/* Introduction */}
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Estheticians 4 You LLC, a Nevada limited liability company ("Glamlink") provides the Glamlink and Glamlink Pro app, the glamlink.net site, and related goods and services, including any and all mobile applications, online software, and other services (collectively, the "Glamlink
                  Service") subject to your compliance with the terms and conditions set forth below. Your use of the Glamlink Service signifies your acknowledgement of and agreement to these Terms of Use.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  These Terms of Use apply to all users of the Glamlink Service. The term "users" includes both registered members of the Glamlink Service and any other person that accesses or uses the Glamlink Service at any point for any amount of time.
                </p>
              </div>
              {/* Section 1: Service Providers */}
              <div id="service-providers" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">1. SERVICE PROVIDERS</h3>
                <p className="text-gray-700 leading-relaxed mb-8">If you are a beauty professional or use the Glamlink Service for commercial or promotional purposes (collectively, "Beauty Professional"), the following provisions will apply in addition to the other Terms of Use.</p>

                {/* Subsections */}
                <div className="space-y-8">
                  <div className="border-l-4 border-glamlink-teal pl-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">1.1. Beauty Professional Accounts</h4>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      When you register to use the Glamlink Service, you agree to provide true, accurate, current, and complete information about your business and services. You may not promote any goods or services unless you and your business are properly licensed to provide the goods and services
                      under all applicable laws, rules, and regulations.
                    </p>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">1.2. Beauty Professional Responsibilities</h4>
                    <p className="text-gray-700 leading-relaxed mb-4">If you promote your goods or services using the Glamlink Service, you are responsible for:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                      <li>the content of all promotions</li>
                      <li>landing pages and other destinations users are sent, such as mobile applications, along with all related URLs, waypoints, and redirects (collectively, "Landing Pages")</li>
                      <li>all goods and services promoted on the Glamlink Service and on destinations where your promotions direct users</li>
                    </ul>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">1.3. Responding to Client Inquiries</h4>
                    <p className="text-gray-700 leading-relaxed mb-6">You are solely responsible for all interactions you have with Glamlink users. You agree that Glamlink has no responsibility or liability for any interactions you have with Glamlink users.</p>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">1.4. No Spam Policy</h4>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      You understand and agree that sending unsolicited email advertisements through the Glamlink Service is expressly prohibited. Any unauthorized use of the Glamlink Service for unsolicited email advertisements is a violation of the Terms of Use and certain federal and state laws,
                      including without limitation the Computer Fraud and Abuse Act (18 U.S.C. § 1030 et seq.).
                    </p>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">1.5. Promotional Guidelines</h4>
                    <p className="text-gray-700 leading-relaxed mb-4">Any promotions for your goods and services in any form, including business pages, posts, and interactions with Glamlink users (collectively, "Promotional Content") must follow these promotional guidelines:</p>

                    <div className="space-y-4 ml-4 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-gray-900 mb-2">(a) Limitation of Promotional Content</h5>
                        <p className="text-gray-700">Promotional Content is only allowed for aesthetic and beauty goods and services and not for any other goods or services whatsoever.</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-gray-900 mb-2">(b) Landing Pages / Destination URLs</h5>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                          <li>Promotional Content that contains a URL or domain must link to that same URL or domain</li>
                          <li>All users must be sent to the same landing page when a link in Promotional Content is clicked</li>
                          <li>Landing Pages that generate a pop-up (including "pop-overs" and "pop-unders") when a user enters or leaves the page are not allowed</li>
                          <li>Landing Pages cannot utilize "mouse trapping" or "fake" page close behavior whereby the advertiser does not allow users to use their browser "back button" or "close" button in the standard manner</li>
                          <li>Landing Pages may not contain Glamlink trademarks or logos, or otherwise reference Glamlink in the content of the landing page</li>
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-gray-900 mb-2">(c) Accurate promotional text</h5>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                          <li>Promotional Content must directly relate to the content on the Landing Pages</li>
                          <li>Promotional Content must clearly state and represent the company, product, or brand that is being advertised</li>
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-gray-900 mb-2">(d) Language and image content</h5>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                          <li>Provocative images may not be used on Promotional Content</li>
                          <li>Promotional Content or any Landing Pages may not contain, facilitate, or promote adult content, including nudity, sexual terms, and/or images of people in positions or activities that are excessively suggestive or sexual</li>
                          <li>Promotional Content or any Landing Pages may not contain, facilitate, or promote offensive, profane, vulgar, obscene, or inappropriate language</li>
                          <li>Promotional Content or any Landing Pages may not contain, facilitate, or promote defamatory, libelous, slanderous, and/or unlawful content</li>
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-gray-900 mb-2">(e) No incentives</h5>
                        <p className="text-gray-700">No Promotional Content may offer incentives to viewers for clicking on the ad, for submitting personal information, or for performing any other tasks.</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-gray-900 mb-2">(f) Prices, discounts, and free offers</h5>
                        <p className="text-gray-700">
                          Promotional Content may not be deceptive or fraudulent about any offer it makes. If an ad includes a price, discount, or "free" offer, the Landing Page must link to a page that clearly and accurately offers the exact deal the Promotional Content has displayed. If
                          Promotional Content includes a price, discount, or "free" offer, the Promotional Content must clearly state what action or set of actions is required to qualify for the offer.
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-gray-900 mb-2">(g) Third Party Rights</h5>
                        <p className="text-gray-700">Promotional Content may not include any content that infringes upon the rights of any third party, including copyright, trademark, privacy, publicity or other personal or proprietary right, or that is deceptive or fraudulent.</p>
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">1.6. Legal Responsibility</h4>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      You are legally and solely responsible for the Promotional Content and Booking Listings you post and your interactions with any users or Beauty Professionals. By posting Promotional Content and using the Booking Service, you warrant that all aspects of the content comply with
                      Glamlink's published policies and that you may legally sell or offer for sale the goods or services promoted.
                    </p>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">1.7. Payments / Fees</h4>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      The Glamlink Service may have recurring subscription fees disclosed at the time of the initial enrolment for certain services. You are responsible for such recurring fees according to the terms and conditions of the Glamlink Service. Subscription and membership fees are subject
                      to change at any time at the sole and absolute discretion of Glamlink.
                    </p>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">1.8. Automatic Recurring Billing</h4>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      In accordance with the terms and conditions of the Glamlink Service, subscription fees may be automatically renewed at or after the end of the original term selected, for a similar period of time and for a similar or lower amount, unless notice of cancellation is received from
                      you. Unless and until your subscription is cancelled in accordance with the Terms of Use, you hereby authorize Glamlink to charge your chosen payment method to pay for the ongoing cost of membership. You hereby further authorize Glamlink to charge your chosen payment method for
                      any and all additional purchases of materials you purchase on the Glamlink Service.
                    </p>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">1.9. Rejection of Orders</h4>
                    <p className="text-gray-700 leading-relaxed mb-4">Glamlink may reject orders for services for any reason. Reasons for rejecting an order include:</p>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-6">
                      <li>pricing error</li>
                      <li>unavailability</li>
                      <li>rejection of payment</li>
                      <li>suspected fraudulent activity</li>
                      <li>orders connected with a previous credit card dispute</li>
                    </ul>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">1.10. Sales Tax</h4>
                    <p className="text-gray-700 leading-relaxed mb-6">Glamlink charges sales tax where required by law. If sales tax is charged, the appropriate charges will be added to your purchase and displayed in your shopping cart and on your invoice.</p>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">1.11. Price Changes</h4>
                    <p className="text-gray-700 leading-relaxed mb-6">Glamlink may change the price of any membership tier, item, or service at any time.</p>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">1.12. Cancellation</h4>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      At any time, and without cause, any service may be terminated by you, Glamlink, or the Glamlink Service. When you cancel, you are liable for all charges incurred up to and including through your current subscription or service period. Once you cancel a subscription or service,
                      it will result loss of access to at the end of your current subscription period. Cancellation requests may take up to 3 business days.
                    </p>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">1.13. Cardholder Disputes/Chargebacks</h4>
                    <p className="text-gray-700 leading-relaxed mb-6">All chargebacks are thoroughly investigated and may prevent you from making future purchases for other Glamlink subscriptions or services.</p>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">1.14. Fraudulent Activities</h4>
                    <p className="text-gray-700 leading-relaxed mb-6">Glamlink will prosecute to the fullest extent of the law any fraudulent activities related to any chargebacks or reversals of a valid charge for an order.</p>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">1.15. Returns / No Warranties</h4>
                    <p className="text-gray-700 leading-relaxed mb-6">There are no product or service warranties of any kind. Subscriptions, services, and digital content are not eligible to be returned or exchanged.</p>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">1.16. No Transfer of Access Rights</h4>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      You may not under any circumstances transfer your account, subscriptions, or services to any other person or entity. You are required to keep your access rights strictly confidential. If any breach of security, theft or loss of access rights, or unauthorized disclosure of
                      access rights information occurs, you must immediately notify Glamlink of the security breach.
                    </p>
                  </div>
                </div>
              </div>
              {/* Section 2: Client Booking Service */}
              <div id="client-booking-service" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">2. CLIENT BOOKING SERVICE</h3>

                <div className="space-y-6">
                  <div className="border-l-4 border-glamlink-teal pl-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">2.1. Booking Services</h4>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      The Glamlink Service may allow users to book appointments or request other goods and services with Beauty Professionals ("Booking Service"). Glamlink is not involved in the actual transactions between Beauty Professionals and their clients. Rather, Glamlink merely allows Beauty
                      Professionals to promote their own goods and services through the Booking Service and Promotional Content. The transactions regarding any Beauty Professional goods or services is directly between the Beauty Professionals and their clients. Glamlink may charge Beauty
                      Professionals fees for the Booking Service which may be updated from time to time in Glamlink's sole discretion.
                    </p>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">2.2. No Control Over Listings</h4>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Glamlink has no control over and does not guarantee the existence, quality, safety or legality of goods or services advertised through the Booking Service; the truth or accuracy of Beauty Professionals' content or listings; the ability of Beauty Professionals to offer any goods
                      or services; the ability of users to pay for items offered by Beauty Professionals; or that a Beauty Professional and user will actually complete a transaction or show up for an appointment.
                    </p>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">2.3. Legal Compliance</h4>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      You agree not to use the Booking Service to buy or sell goods or services which are illegal in Nevada, the United States, or in your local jurisdiction. By using the Booking Service, you agree to comply with all applicable domestic and international laws, statutes, ordinances
                      and regulations regarding listing, appointments, purchases, solicitation of offers to purchase, and sale goods or services.
                    </p>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">2.4. Use of the Booking Service</h4>
                    <p className="text-gray-700 leading-relaxed mb-4">Use of Booking Service is at your own risk. If you choose to use the Booking Service, you agree to:</p>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-6">
                      <li>pay for goods or services purchased by you</li>
                      <li>deliver goods or services sold by you</li>
                      <li>post accurate information about yourself and any goods and services sold by you</li>
                      <li>list items for sale in appropriate categories</li>
                      <li>abide by all applicable laws, third party rights, and Glamlink policies</li>
                    </ul>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">2.5. Responding to Listings</h4>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      If you request goods or services through the Booking Service, you are legally responsible for your interactions with any sellers. You further warrant that you are in compliance with Glamlink's published policies. You are responsible for reading the full item or service listing
                      before using the Booking Service. When you use the Booking Service you are entering into an agreement directly with the Beauty Professional, not with Glamlink.
                    </p>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">2.6. Scams</h4>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Use common sense when using the Booking Service. Use the same common sense you would use in the real world when reading an ad. If it is too good to be true, it may be a scam. For more information about various online scams and how to avoid them, go to{" "}
                      <a href="https://OnGuardOnline.gov" target="_blank" className="text-glamlink-teal underline">
                        https://OnGuardOnline.gov.
                      </a>
                    </p>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">2.7. Cancellation of Listings or Accounts</h4>
                    <p className="text-gray-700 leading-relaxed mb-6">Glamlink reserves the right to terminate any Booking Service listing or to cancel the account of any user at any time and for any reason.</p>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">2.8. Limitation of Liability</h4>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      You agree that Glamlink is not responsible or liable for any goods or services from any Beauty Professionals you purchase which do not meet your expectations, are lost, stolen or damages, or any damages or injuries you incur from the use of any goods or services provided by any
                      user or Beauty Professional. You further agree that in the event that a court or arbitrator determines that Glamlink has any liability to you for any goods or services from any user or Beauty Professional, Glamlink's maximum liability are limited to the fees paid to Glamlink
                      for the specific transaction or the promotion of the Beauty Professional or Promotional Content related to those goods or services.
                    </p>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">2.9. Additional Policies</h4>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      The use of the Booking Service is subject to published policies posted on the Glamlink Service, including policies regarding listing items, selling items, buying goods and services. Your use of the Booking Service is subject to those policies, which are incorporated into this
                      Agreement by this reference.
                    </p>
                  </div>
                </div>
              </div>
              {/* Add remaining sections in similar format */}
              <div id="website-access" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">3. WEBSITE ACCESS</h3>
                <div className="border-l-4 border-glamlink-teal pl-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">3.1. Access</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">Glamlink grants you a limited, revocable, nonexclusive license to access the Glamlink Service for your own use.</p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">3.2. Account Creation</h4>

                  <p className="text-gray-700 leading-relaxed mb-6">
                    In order to access some features of the Glamlink Service, you will have to create an account. You may never use another&#39;s account. When creating your account, you must provide accurate and complete information. Should any of your information change after submitting it to the
                    Glamlink Service, you are required to update that information immediately.
                  </p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">3.3. Account Activity</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    You are solely responsible for the activity that occurs on your account, and you must keep your account password secure. You must notify Glamlink immediately of any breach of security or unauthorized use of your account. Although Glamlink will not be liable for your losses caused
                    by any unauthorized use of your account, you may be liable for the losses of Glamlink or others due to such unauthorized use.
                  </p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">3.4. Automated Systems</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    You agree not to use or launch any automated system, including without limitation, &quot;scrapers,&quot; &quot;robots,&quot; &quot;spiders,&quot; and &quot;offline readers&quot; that access the Glamlink Service. You agree not to collect or harvest any personally identifiable
                    information, including account names, from the Glamlink Service, nor to use the communication systems provided by the Glamlink Service for any commercial solicitation or illegal or improper purposes.
                  </p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">3.5. Search Engines</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Notwithstanding the foregoing, Glamlink grants the operators of recognized international public search engines, such as Google, Bing, and DuckDuckGo permission to use spiders to copy materials from the site for the sole purpose of creating publicly available searchable indices of
                    the materials. Glamlink reserves the right to revoke these exceptions either generally or in specific cases.
                  </p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">3.6. Artificial Intelligence Bots and Tools</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Glamlink prohibits the use of any material on glamlink.net or the Glamlink Service from being used for training or any other purpose by artificial intelligence systems (&quot;AI&quot;) including large language models (&quot;LLMs&quot;). Any use of any material on glamlink.net or
                    the Glamlink Service by AI or LLMs is a violation of these Terms of Use and Glamlink&#39;s intellectual property rights.
                  </p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">3.7. Termination of Account</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    You agree that Glamlink, in its sole discretion, has the right (but not the obligation) to delete or deactivate your account, block your email or IP address, or otherwise terminate your access to or use of the Glamlink Service (or any part thereof), immediately and without
                    notice, and remove and discard any content within the Glamlink Service, for any reason, including, without limitation, if Glamlink believes that you have acted inconsistently with the letter or spirit of the Terms of Use. Further, you agree that Glamlink shall not be liable to
                    you or any third-party for any termination of your access to the Glamlink Service. Further, you agree not to attempt to use the Glamlink Service after said termination.
                    {/* Placeholder for remaining sections - they would follow the same pattern */}
                  </p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">3.8. Termination of Service</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Glamlink may modify, suspend, discontinue, or restrict the use of any portion of the Glamlink Service, including the availability of any portion of the content at any time, without notice or liability. The Glamlink Service may deny access to any registered member or other user at
                    any time for any reason, or no reason at all in our sole discretion. In addition, the Glamlink Service or Glamlink may at any time transfer rights and obligations under these Terms of Use to any Glamlink affiliate, subsidiary or business unit, or any of their affiliated companies
                    or divisions, or any entity that acquires Glamlink, the Glamlink Service or any of their respective assets. You agree that Glamlink shall not be liable to you or to any third party for any modification, suspension, or discontinuance of any service.
                  </p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">3.9. Third Party Links</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    The Glamlink Service may contain links to third party websites that Glamlink does not own or control, including links to a Beauty Professional website. Glamlink assumes no responsibility for the content, privacy policies, or practices of any Beauty Professional or third-party
                    websites. In addition, Glamlink will not and cannot censor or edit the content of any third-party site. You expressly relieve Glamlink from any and all liability arising from your use of any third-party website. Accordingly, we encourage you to be aware when you leave the
                    Glamlink Service and to read the terms and conditions and privacy policy of other websites that you visit.
                  </p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">3.10. Consent to Electronic Service</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    When you use the Glamlink Service or send e-mails to us, you are communicating with us electronically. You consent to receive communications from us electronically. We will communicate with you by e-mail or by posting notices on the Glamlink Service. You agree that all
                    agreements, notices, disclosures and other communications that we provide to you electronically satisfy any legal requirement that such communications be in writing.
                  </p>
                </div>
              </div>
              <div id="third-party-content" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">4. THIRD-PARTY CONTENT / INTERACTIVE FEATURES</h3>

                <div className="border-l-4 border-glamlink-teal pl-6 mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">4.1. Submission of Third-Party Content</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    The Glamlink Service may permit the submission, hosting, sharing, and/or publishing of text, photographs, audio, videos, reviews, or other content, including as part of Promotional Content and Booking Services, by you, other users, and other third parties such as our partners or
                    affiliates ("Third-Party Content").
                  </p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">4.2. Interactive Areas</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">Third-Party Content also includes, but is not limited to, direct messaging between users, profile submissions, and any other interactive area of the Glamlink Service.</p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">4.3. License to Glamlink</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    By posting, submitting or uploading Third-Party Content to any area of the Glamlink Service, you automatically grant, and you represent and warrant that you have the right to grant, to Glamlink an irrevocable, perpetual, non-exclusive, fully paid, sublicensable, transferable,
                    worldwide license to host, use, distribute, modify, run, copy, publicly perform, display, and translate said Third-Party Content and to prepare derivative works of, or incorporate into other works, said Third-Party Content, and to grant and authorize sublicenses (through multiple
                    tiers) of the foregoing. Furthermore, by posting Third-Party Content to the Glamlink Service, you automatically grant Glamlink all rights necessary to prohibit any subsequent aggregation, display, copying, duplication, reproduction, or exploitation of the Third-Party Content by
                    any party for any purpose. You acknowledge that by participating in any interactive area on this website, you are granting Glamlink the unrestricted right, throughout the world and in perpetuity, to copy, sublicense, adapt, transmit, perform, display or otherwise use, at no cost
                    whatsoever to Glamlink, any and all material or content you post or submit, including, without limitation, all intellectual property rights embodied therein.
                  </p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">4.4. No Expectation of Privacy</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    You acknowledge that the interactive features on the Glamlink Service are not for private communications. You acknowledge that you have no expectation of privacy with regard to any content you submit to the Glamlink Service. Glamlink cannot guarantee the security of any
                    information you disclose through the Glamlink Service. You make such disclosures at your own risk. Glamlink has no obligation to retain or provide you copies of Third-Party Content.
                  </p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">4.5. Rules for Posting Third-Party Content</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">By posting Third-Party Content to the Glamlink Service or by using any other interactive area of the website, you specifically agree to comply with each of the following:</p>
                  <ul className="ml-6 mt-2 space-y-1 mb-6">
                    <li className="flex items-start">
                      <span className="text-glamlink-teal mr-3 mt-1">•</span>
                      <span className="text-gray-700">You will not post or transmit any material that violates or infringes the rights of any other party, including, without limitation, rights of privacy, rights of publicity, copyright, trademark, or other intellectual property rights.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-glamlink-teal mr-3 mt-1">•</span>
                      <span className="text-gray-700">If your employer has rights to intellectual property you create, you have either received permission from your employer to post or make available the material, or secured a waiver as to all rights in the material.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-glamlink-teal mr-3 mt-1">•</span>
                      <span className="text-gray-700">You have fully complied with any third-party licenses relating to the material you post or transmit.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-glamlink-teal mr-3 mt-1">•</span>
                      <span className="text-gray-700">You will not post or transmit any material that is false, deceptive, misleading, or deceitful.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-glamlink-teal mr-3 mt-1">•</span>
                      <span className="text-gray-700">You will not post or transmit abusive, hateful, racist, bigoted, sexist, harassing, threatening, inflammatory, defamatory, vulgar, obscene, sexually-oriented, profane content, or any content violating applicable law.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-glamlink-teal mr-3 mt-1">•</span>
                      <span className="text-gray-700">You will not deceptively impersonate any person or entity.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-glamlink-teal mr-3 mt-1">•</span>
                      <span className="text-gray-700">Your name, username, or the material you submit is not misleading.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-glamlink-teal mr-3 mt-1">•</span>
                      <span className="text-gray-700">You will not post content that constitutes or contains advertising, solicitation, or is for commercial purposes.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-glamlink-teal mr-3 mt-1">•</span>
                      <span className="text-gray-700">You will not post or transmit any software or files that contain malware, viruses, worms, Trojans, spyware, adware, or other malicious code.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-glamlink-teal mr-3 mt-1">•</span>
                      <span className="text-gray-700">You will not post content intended to promote or commit an illegal act.</span>
                    </li>
                  </ul>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">4.6. No Posting Agents</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    When posting Third-Party Content, you agree never to use a third-party agent, service, or intermediary that offers to post Third-Party Content to the Glamlink Service on your behalf ("Posting Agent"). Posting Agents are not permitted to post Third-Party Content on behalf of
                    others without express written permission from Glamlink.
                  </p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">4.7. Description and Keywords</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    You must not describe or assign keywords to your Third-Party Content in a misleading or unlawful manner, including in a manner intended to trade on the name or reputation of others. Glamlink may change or remove any description or keyword that it considers inappropriate or
                    unlawful in its sole discretion.
                  </p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">4.8. Responsibility for Content</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    You are solely responsible for any Third-Party Content you post or which is posted through your account. Any information you disclose through the Glamlink Service becomes public information and can be used by people you do not know. Disclosures are at your own risk.
                  </p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">4.9. Exposure to Content</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    You understand that when using the Glamlink Service, you may be exposed to Third-Party Content from a variety of sources. Glamlink is not responsible for the accuracy, usefulness, safety, or intellectual property rights of such content. You waive any legal or equitable rights
                    against Glamlink in this regard and agree to indemnify Glamlink and its affiliates to the fullest extent allowed by law.
                  </p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">4.10. Views and Opinions</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Third-Party Content may contain the views and opinions of individual authors. Glamlink does not endorse any Third-Party Content or any opinion, recommendation, or advice expressed therein, and expressly disclaims liability in connection with Third-Party Content.
                  </p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">4.11. Monitoring and Removal</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Glamlink does not prescreen Third-Party Content and has no duty to monitor interactive areas. Although Glamlink may review Third-Party Content from time to time, each user is solely responsible and liable for their content. Glamlink may remove, edit, or take action on any
                    submission at its discretion.
                  </p>
                </div>
              </div>
              <div id="intellectual-property" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">5. INTELLECTUAL PROPERTY INFORMATION</h3>

                <div className="border-l-4 border-glamlink-teal pl-6 mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">5.1. Ownership</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Other than Third-Party Content, all content on the Glamlink Service, including without limitation, the text, software, scripts, tools, graphics, photos, sounds, music, videos, and interactive features ("Glamlink Content") and the trademarks, service marks and logos contained
                    therein ("Marks"), are owned by or licensed to Glamlink. The Glamlink Content and Marks are protected to the maximum extent permitted by intellectual property laws and international treaties. The Glamlink Service is protected by copyright law, including as a collective work
                    and/or compilation, pursuant to copyright laws and international conventions.
                  </p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">5.2. Derivative Works / Redistribution Prohibited</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Any reproduction, modification, creation of derivative works from or redistribution of the site or the collective work, and/or copying or reproducing the sites or any portion thereof to any other server or location for further reproduction or redistribution is prohibited without
                    the express written consent of Glamlink.
                  </p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">5.3. Reproduction Prohibited</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    You further agree not to reproduce, duplicate or copy Content from the Glamlink Service, or incorporate the Content into an AI system or LLM, without the express written consent of Glamlink, and agree to abide by any and all copyright and other legal notices displayed on the
                    Glamlink Service. You may not decompile or disassemble, reverse engineer or otherwise attempt to discover any source code contained in the Glamlink Service. Without limiting the foregoing, you agree not to reproduce, duplicate, copy, sell, resell or exploit for any commercial
                    purposes, any aspect of the Glamlink Service.
                  </p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">5.4. Embedded Content / Frames</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">You may not embed the Glamlink Service or place the Glamlink Service within inline links, frames, or iframes.</p>
                </div>
              </div>
              <div id="warranty-disclaimer" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">6. WARRANTY DISCLAIMER</h3>

                <div className="border-l-4 border-glamlink-teal pl-6 mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">6.1. General Disclaimer</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    THE GLAMLINK SERVICE, INCLUDING ANY GLAMLINK CONTENT, THIRD-PARTY CONTENT, PROMOTIONAL CONTENT, THE BOOKING SERVICE, OR ANY SITE-RELATED SERVICE, IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS. GLAMLINK HEREBY EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY
                    KIND, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, TITLE, NON-INFRINGEMENT AND FITNESS FOR A PARTICULAR PURPOSE.
                  </p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">6.2. No Guarantee of Service</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    GLAMLINK MAKES NO WARRANTY THAT: (I) THE GLAMLINK SERVICE WILL MEET YOUR REQUIREMENTS, (II) THE GLAMLINK SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE, (III) THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE GLAMLINK SERVICE WILL BE ACCURATE OR RELIABLE, OR (IV)
                    ANY ERRORS IN THE GLAMLINK SERVICE WILL BE CORRECTED.
                  </p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">6.3. Third-Party Responsibility</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    GLAMLINK IS NOT RESPONSIBLE AND SHALL HAVE NO LIABILITY FOR THE CONTENT, PRODUCTS, SERVICES, ACTIONS OR INACTIONS OF ANY USER, OR ANY OTHER THIRD PARTY AND GLAMLINK WILL HAVE NO LIABILITY WITH RESPECT TO ANY WARRANTY DISCLAIMED HEREIN.
                  </p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">6.4. No Guarantee of Quality or Accuracy</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">YOU ACKNOWLEDGE THAT GLAMLINK HAS NO CONTROL OVER AND DOES NOT GUARANTEE THE QUALITY, SAFETY OR LEGALITY OF PRODUCTS AND SERVICES ADVERTISED ON THE GLAMLINK SERVICE, OR THE TRUTH OR ACCURACY OF ANY THIRD-PARTY CONTENT.</p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">6.5. Limitation of Liability</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    GLAMLINK, ITS AFFILIATES AND ITS SPONSORS ARE NEITHER RESPONSIBLE NOR LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, EXEMPLARY, PUNITIVE OR OTHER DAMAGES ARISING OUT OF OR RELATING IN ANY WAY TO THE GLAMLINK SERVICE, SITE-RELATED SERVICES AND/OR CONTENT OR
                    INFORMATION CONTAINED WITHIN THE GLAMLINK SERVICE. YOUR SOLE REMEDY FOR DISSATISFACTION WITH THE GLAMLINK SERVICE AND/OR SITE-RELATED SERVICES IS TO STOP USING THE GLAMLINK SERVICE AND/OR THOSE SERVICES.
                  </p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">6.6. Jurisdictional Warranties</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    SOME JURISDICTIONS PROVIDE FOR CERTAIN WARRANTIES, LIKE THE IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. EXCEPT AS EXPRESSLY PROVIDED FOR IN THE TERMS, TO THE EXTENT PERMITTED BY LAW, WE EXCLUDE ALL WARRANTIES, GUARANTEES,
                    CONDITIONS, REPRESENTATIONS, AND UNDERTAKINGS. YOU AGREE AND ACKNOWLEDGE THAT THE LIMITATIONS AND EXCLUSIONS OF LIABILITY AND WARRANTY PROVIDED IN THESE TERMS OF USE ARE FAIR AND REASONABLE.
                  </p>
                </div>
              </div>
              {/* Section 7: Limitation of Liability */}
              <div id="limitation-of-liability" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">7. LIMITATION OF LIABILITY</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  TO THE EXTENT PERMITTED BY APPLICABLE LAW AND TO THE EXTENT THAT GLAMLINK IS OTHERWISE FOUND RESPONSIBLE FOR ANY DAMAGES, GLAMLINK IS RESPONSIBLE FOR ACTUAL DAMAGES ONLY. TO THE EXTENT PERMITTED BY LAW, IN NO EVENT SHALL GLAMLINK, ITS AFFILIATES, ITS LICENSORS, ITS SUPPLIERS OR ANY
                  THIRD PARTIES MENTIONED AT THE WEBSITE BE LIABLE FOR ANY INCIDENTAL, INDIRECT, EXEMPLARY, PUNITIVE AND CONSEQUENTIAL DAMAGES, LOST PROFITS, OR DAMAGES WHETHER BASED ON WARRANTY, CONTRACT, TORT, DELICT, OR ANY OTHER LEGAL THEORY, AND WHETHER OR NOT GLAMLINK IS ADVISED OF THE
                  POSSIBILITY OF SUCH DAMAGES. TO THE EXTENT PERMITTED BY LAW, THE REMEDIES STATED FOR YOU IN THESE TERMS OF USE ARE EXCLUSIVE AND ARE LIMITED TO THOSE EXPRESSLY PROVIDED FOR IN THESE TERMS OF USE.
                </p>
              </div>

              {/* Section 8: Unsolicited Material and Ideas */}
              <div id="unsolicited-material" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">8. UNSOLICITED MATERIAL AND IDEAS</h3>
                <div className="border-l-4 border-glamlink-teal pl-6 mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">8.1. Submissions</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    We are happy to hear from users and welcome feedback regarding the Glamlink Service. However, if you transmit unsolicited submissions to us through the Glamlink Service or otherwise, you grant Glamlink a worldwide, royalty-free, perpetual, irrevocable, non-exclusive right and
                    fully sub-licensable, assignable and transferable license to use, copy, reproduce, distribute, publish, publicly perform, publicly display, modify, adapt, translate, archive, store, and create derivative works from such submissions, and you understand and agree that such
                    submissions may be adapted, broadcast, changed, copied, disclosed, licensed, performed, posted, published, sold, transmitted, or otherwise used as Glamlink sees fit.
                  </p>

                    <h4 className="text-lg font-semibold text-gray-900 mb-3">8.2. No Compensation</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    By using the Glamlink Service and transmitting an unsolicited submission to us, you agree that you are not entitled to any compensation, credit or notice whatsoever with respect to such submission, and that by sending an unsolicited submission you waive the right to make any
                    claim against the Glamlink Service, Glamlink and its affiliated companies, officers, directors or employees relating to our use of such submission, including, without limitation, infringement of proprietary rights, unfair competition, breach of implied contract or breach of
                    confidentiality, even if material or an idea is used that is or may be substantially similar to the idea you sent.
                  </p>
                </div>
              </div>

              {/* Section 9: Indemnity */}
              <div id="indemnity" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">9. INDEMNITY</h3>
                <div className="border-l-4 border-glamlink-teal pl-6 mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">9.1. Your Obligations</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    You agree to defend, indemnify and hold harmless Glamlink, its affiliated companies, officers, directors, employees and agents, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's
                    fees) arising from:
                  </p>
                  <ul className="ml-6 mt-2 space-y-2">
                    <li className="flex items-start">
                      <span className="text-gray-700">(a) the Booking Service or any Promotional Content;</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-700">(b) any goods or services offered or sold by a Beauty Professional;</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-700">(c) any appointments, contracts, or the sale or offer for sale of any goods or services related to a Booking Link, Promotional Content, or Beauty Professional;</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-700">(d) any negligence, gross negligence, or actions or inactions of a Beauty Professional or other user;</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-700">
                        (e) any personal injury or other damages related to any interaction between you and another user in or outside of the Glamlink services, including a Booking Link, Promotional Content, or any goods or services offered or sold by a Beauty Professional or any other user;
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-700">(f) your use of and access to the Glamlink Service;</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-700">(g) your participation in any interactive area of the Glamlink Service including reviews and any material posted by you thereto;</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-700">(h) your violation of any term of these Terms of Use;</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-700">(i) your violation of any third party right, including without limitation any copyright, property, or privacy right;</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-700">(j) your violation of any law, rule or regulation of the United States, any state, or any other country;</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-700">(k) any claim that Third-Party Content posted by you or using your account caused damage to another party; and</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-700">(l) any other party's access and use of the Glamlink Service with your account.</span>
                    </li>
                  </ul>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 mt-6">9.2. Survival of Obligation</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">This defense and indemnification obligation will survive these Terms of Use and any termination of your use of the Glamlink Service.</p>
                </div>
              </div>
              <div id="dmca" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">10. DIGITAL MILLENNIUM COPYRIGHT ACT</h3>

                <div className="border-l-4 border-glamlink-teal pl-6 mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">10.1. Infringement Not Permitted</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Glamlink does not permit copyright infringing activities and infringement of intellectual property rights on the Glamlink Services will remove any content if properly notified that such content infringes on another's intellectual property rights. Glamlink reserves the right to
                    remove any content without prior notice.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-900 mb-3">10.2. DMCA Notice</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    If you are a copyright owner or an agent thereof and believe that any Third-Party Content or other Content infringes upon your copyrights, you may submit a notification pursuant to the Digital Millennium Copyright Act (&quot;DMCA&quot;) by providing our Copyright Agent with the
                    following information in writing (see 17 U.S.C 512(c)(3) for further detail):
                  </p>
                  <ul className="ml-6 mt-2 space-y-2">
                    <li className="flex items-start">
                      <span className="text-gray-700">(a) A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed;</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-700">(b) Identification of the copyrighted work claimed to have been infringed, or, if multiple copyrighted works at a single online site are covered by a single notification, a representative list of such works at that site;</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-700">
                        (c) Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled and information reasonably sufficient to permit the service provider to locate the material;
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-700">(d) Information reasonably sufficient to permit the service provider to contact you, such as an address, telephone number, and, if available, an electronic mail;</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-700">(e) A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law; and</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-700">(f) A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</span>
                    </li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mb-6 mt-4">Glamlink's designated Copyright Agent to receive notifications of claimed infringement is:</p>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <strong>Estheticians 4 You LLC</strong>
                    <br />
                    Attn: Copyright Agent
                    <br />
                    8090 S. Durango Dr Ste 102 #1033
                    <br />
                    Las Vegas, NV 89113
                    <br />
                    <a href="mailto:email-support@glamlink.net" className="text-glamlink-teal underline italic">
                      email-support@glamlink.net
                    </a>
                    <br />
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6">You acknowledge that if you fail to comply with all of the requirements of this Section, your DMCA notice may not be valid.</p>

                  <h4 className="text-lg font-semibold text-gray-900 mb-3">10.3. Counter-Notice</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    If you believe that your Third-Party Content that was removed (or to which access was disabled) is not infringing, or that you have the authorization from the copyright owner, the copyright owner's agent, or pursuant to the law, to post and use the content in your Third-Party
                    Content, you may send a counter-notice containing the following information to the Copyright Agent:
                  </p>
                  <ul className="ml-6 mt-2 space-y-2">
                    <li className="flex items-start">
                      <span className="text-gray-700">(a) Your physical or electronic signature;</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-700">(b) Identification of the content that has been removed or to which access has been disabled and the location at which the content appeared before it was removed or disabled;</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-700">(c) A statement that you have a good faith belief that the content was removed or disabled as a result of mistake or a misidentification of the content; and</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-700">
                        (d) Your name, address, telephone number, and e-mail address, a statement that you consent to the jurisdiction of the federal court in Las Vegas, Nevada, and a statement that you will accept service of process from the person who provided notification of the alleged
                        infringement.
                      </span>
                    </li>
                  </ul>

                  <h4 className="text-lg font-semibold text-gray-900 mb-3 mt-6">10.4. Effect of Counter-Notice</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    If a counter-notice is received by the Copyright Agent, the Glamlink Service may send a copy of the counter-notice to the original complaining party informing that person that it may replace the removed content or cease disabling it in 10 business days. Unless the copyright owner
                    files an action seeking a court order against the content provider, member or user, the removed content may be replaced, or access to it restored, in 10 to 14 business days or more after receipt of the counter-notice, at the Glamlink Service's sole discretion.
                  </p>
                </div>
              </div>
              {/* Section 11: Privacy Policy */}
              <div id="privacy" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">11. PRIVACY</h3>
                <div className="border-l-4 border-glamlink-teal pl-6 mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 mt-6">11.1</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Glamlink has established a Privacy Policy to explain to users how personal information is collected and used, which may be reviewed and accessed from the website:
                    <a href="https://www.glamlink.net/" className="text-glamlink-teal underline ml-1">
                      https://www.glamlink.net/
                    </a>
                  </p>

                  <h4 className="text-lg font-semibold text-gray-900 mb-3 mt-6">11.2</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Your use of the Glamlink Service signifies acknowledgement of and agreement to our Privacy Policy. You further acknowledge and agree that Glamlink may, in its sole discretion, preserve or disclose content posted by you, as well as your information, such as email addresses, IP
                    addresses, timestamps, and other user information, if required to do so by law or in the good faith belief that such preservation or disclosure is reasonably necessary to comply with legal process, enforce the Terms of Use, or respond to claims from third-parties.
                  </p>
                </div>
              </div>

              {/* Section 12: Governing Law / Disputes */}
              <div id="governing-law" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">12. GOVERNING LAW / DISPUTES</h3>
                <div className="border-l-4 border-glamlink-teal pl-6 mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 mt-6">12.1</h4>
                  <p className="text-gray-700 leading-relaxed">You agree that the Glamlink Service shall be deemed solely based in the State of Nevada.</p>

                  <h4 className="text-lg font-semibold text-gray-900 mb-3 mt-6">12.2</h4>
                  <p className="text-gray-700 leading-relaxed">The Glamlink Service shall be deemed a passive website that does not give rise to personal jurisdiction over Glamlink, either specific or general, in jurisdictions other than Nevada.</p>

                  <h4 className="text-lg font-semibold text-gray-900 mb-3 mt-6">12.3</h4>
                  <p className="text-gray-700 leading-relaxed">
                    These Terms of Use will be governed and interpreted in accordance with the internal laws of the State of Nevada applicable to agreements entered into and to be wholly performed therein, without regard to principles of conflict of laws. If any provision of this Agreement is found
                    to be invalid or unenforceable, such provision shall be severed from the remainder of these Terms of Use, which shall remain in full force and effect. These Terms of Use are governed by a mandatory arbitration clause set out below, however, if a court is necessary in whole or in
                    part to enforce these Terms of Use, You consent and submit to the sole and exclusive jurisdiction of the state and federal courts located in Clark County, Nevada and waive any objection to personal jurisdiction, to venue, or to convenience of forum.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-900 mb-3 mt-6">12.4</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Any dispute, claim or controversy arising out of or relating to the Glamlink Service, this Agreement or the breach, termination, enforcement, interpretation or validity thereof, including the determination of the scope or applicability of this agreement to arbitrate, shall be
                    determined by arbitration in Las Vegas, Nevada, before one arbitrator. At the option of the first to commence an arbitration, the arbitration shall be administered either by JAMS pursuant to its Streamlined Arbitration Rules and Procedures, or by the American Arbitration
                    Association pursuant to its Commercial Arbitration Rules. The arbitrator may not award any consequential, indirect, exemplary, special or incidental damages arising from or relating to your use of the Glamlink Service (including, without limitation, damages for loss of business
                    profits, business interruption, loss of business information, or other pecuniary loss). Judgment on the Award may be entered in any court having jurisdiction. You and we will each pay one-half of the costs and expenses of such arbitration, and each of the parties will separately
                    pay their counsel fees and expenses. Notwithstanding the parties' decision to resolve all disputes through arbitration, either party may bring an action in state or federal court in Clark County, Nevada to protect its intellectual property rights ("intellectual property rights"
                    means patents, copyrights, trademarks, and trade secrets, but not privacy or publicity rights). For any actions brought in court, You and Glamlink consent to the sole and exclusive jurisdiction of the courts located in Clark County, Nevada, including for acts occurring outside of
                    the United States.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-900 mb-3 mt-6">12.5</h4>
                  <p className="text-gray-700 leading-relaxed">You agree to file any claim regarding any aspect of the Glamlink Service or these Terms of Use within six months of the time in which the events giving rise to such claim began, or you agree to waive such claim.</p>

                  <h4 className="text-lg font-semibold text-gray-900 mb-3 mt-6">12.6</h4>
                  <p className="text-gray-700 leading-relaxed">
                    You agree that any arbitration shall be conducted in your individual capacity only and not as a class action or other representative action, and you expressly waive your right to file a class action or seek relief on a class basis. YOU AND GLAMLINK AGREE THAT EACH MAY BRING
                    CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.
                  </p>
                </div>
              </div>

              {/* Section 13: Assignment / Modification */}
              <div id="assignment-modification" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">13. ASSIGNMENT / MODIFICATION</h3>
                <div className="border-l-4 border-glamlink-teal pl-6 mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 mt-6">13.1</h4>
                  <p className="text-gray-700 leading-relaxed">These Terms of Use, and any rights and licenses granted hereunder, may not be transferred or assigned by you. Glamlink may assign these Terms of Use, and any rights and license granted hereunder without restriction.</p>

                  <h4 className="text-lg font-semibold text-gray-900 mb-3 mt-6">13.2</h4>
                  <p className="text-gray-700 leading-relaxed">
                    We reserve the right to amend these Terms of Use at any time. If we do this, we will post the amended Terms of Use on this page and indicate at the top of the page the date the Terms of Use were last revised. The most current version of these Terms of Use will supersede all
                    previous versions. Your continued use of the Glamlink Service after any such changes constitutes your acceptance of the new Terms of Use. If you do not agree to any of these terms or any future Terms of Use, do not use or access (or continue to access) the Glamlink Service.
                  </p>
                </div>
              </div>

              {/* Section 14: Ability to Accept Terms of Use */}
              <div id="ability-to-accept" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">14. ABILITY TO ACCEPT TERMS OF USE</h3>
                <div className="border-l-4 border-glamlink-teal pl-6 mt-8">
                  <p className="text-gray-700 leading-relaxed">
                    You hereby declare, represent and warrant that you (either personally or through parental or guardian consent) are fully able and competent to legally bind yourself to and abide by all of the terms, conditions, obligations, declarations, affirmations, representations, and
                    warranties set forth in these Terms of Use. The Glamlink Service is not directed to persons under 18. If you become aware that your child has provided us with personal information without your consent, please contact us. We do not knowingly collect personal information from
                    children under 13. If we become aware that a child under 13 has provided us with personal information, we take steps to remove such information and terminate the child's account.
                  </p>
                </div>
              </div>

              {/* Section 15: Consent */}
              <div id="consent" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">15. CONSENT</h3>
                <div className="border-l-4 border-glamlink-teal pl-6 mt-8">
                  <p className="text-gray-700 leading-relaxed">
                    By using the Glamlink Service in any way, you agree to comply with these Terms of Use. In addition, when using a particular service, you agree to abide by any applicable posted guidelines, which may change from time to time. Should you object to any term or condition of the Terms
                    of Use, any guidelines, or any subsequent modifications thereto or become dissatisfied with the Glamlink Service in any way, your only recourse is to immediately discontinue your use of the Glamlink Service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Questions About Our Terms?</h2>
            <p className="text-lg text-gray-600 mb-8">If you have any questions about these Terms of Use, please don't hesitate to contact us.</p>
            <div className="bg-white rounded-lg p-8 shadow-sm border">
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 text-glamlink-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:email-support@glamlink.net" className="text-glamlink-teal underline">
                    email-support@glamlink.net
                  </a>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 text-glamlink-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-700">8090 S. Durango Dr Ste 102 #1033, Las Vegas, NV 89113</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Back to Top Button */}
      <button onClick={scrollToTop} className="fixed bottom-8 right-8 p-3 bg-glamlink-teal text-white rounded-full shadow-lg hover:bg-glamlink-teal-dark transition-all duration-300 transform hover:scale-110" aria-label="Back to top">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
}
