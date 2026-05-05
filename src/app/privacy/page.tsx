"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState<string>("");

  const sections = [
    { id: "1", title: "Collection of Personal Information", anchor: "collection" },
    { id: "2", title: "Information Collected Through Technology / Cookies", anchor: "technology" },
    { id: "3", title: "Use of Personal Information", anchor: "use" },
    { id: "4", title: "Messages and Communications", anchor: "communications" },
    { id: "5", title: "Third Party Services", anchor: "third-party" },
    { id: "6", title: "Social Media / Remarketing", anchor: "social-media" },
    { id: "7", title: "Links to third party websites", anchor: "third-party-links" },
    { id: "8", title: "Security", anchor: "security" },
    { id: "9", title: "Data Retention", anchor: "data-retention" },
    { id: "10", title: "Purchase or Sale of Businesses", anchor: "business-transfer" },
    { id: "11", title: "Additional Disclosures", anchor: "disclosures" },
    { id: "12", title: "Non-Personal Information", anchor: "non-personal" },
    { id: "13", title: "Children's Information", anchor: "children" },
    { id: "14", title: "Changes and Updates", anchor: "changes" },
    { id: "15", title: "Do Not Track", anchor: "do-not-track" },
    { id: "16", title: "Your State Privacy Rights", anchor: "state-rights" },
    { id: "17", title: "International Privacy Laws / Storage and Transfer of your Data", anchor: "international" },
    { id: "18", title: "Contact Information", anchor: "contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map((section) => ({
        id: section.id,
        element: document.getElementById(section.anchor),
      }));

      const currentSection = sectionElements.find(({ element }) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom > 100;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600 mb-6">Last revised on January 25, 2025</p>
            <nav className="flex flex-wrap gap-2 justify-center">
              <Link href="/" className="text-glamlink-teal hover:text-glamlink-teal-dark">
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Privacy Policy</span>
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
                <button key={section.id} onClick={() => scrollToSection(section.anchor)} className="text-left px-4 py-2 rounded-lg transition-colors" >
                  <span className="text-sm font-medium">{section.id}.</span> {section.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border p-8 md:p-12">
              {/* Introduction */}
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-gray-700 leading-relaxed mb-6">Estheticians 4 You LLC, a Nevada limited liability company ("Glamlink" "us" or "we") are dedicated to protecting your privacy and handling any personally identifiable information we obtain from you with care and respect.</p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  This Privacy Policy sets forth our policy with respect to information, including personally identifiable information that is collected from users of and/or visitors to glamlink.net, as well as any other websites, online software, or mobile applications operated by Glamlink
                  (collectively, the "Glamlink Service").
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">This Privacy Policy applies to personally identifiable information collected through the Glamlink Service and does not apply to any other information collected by Glamlink through any other means.</p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  When this Privacy Policy uses the term "personally identifiable information," we mean information that identifies a particular individual, such as the individual's name, address, e-mail, and phone number. Personally identifiable information is also referred to in this Privacy
                  Policy as "Personal Information."
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">As used in this Privacy Policy, Glamlink includes all of its subsidiary and affiliated entities. Glamlink is referred to in this Privacy Policy as "we," "us," "our," and "ourselves."</p>
                <p className="text-gray-700 leading-relaxed mb-6">This Privacy Policy does not cover the information practices of other companies and organizations who advertise our services, and who may use cookies, web beacons (pixel tags), and other methodologies to serve personalized ads.</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <p className="text-blue-800 font-medium">BY USING THE GLAMLINK SERVICE, AND WHEN COMMUNICATE WITH US, YOU UNDERSTAND AND ACKNOWLEDGE THAT WE WILL COLLECT AND USE YOUR PERSONAL INFORMATION IN ACCORDANCE WITH THIS PRIVACY POLICY.</p>
                </div>
              </div>

              {/* Section 1: Collection of Personal Information */}
              <div id="collection" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">1. Collection of Personal Information</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Typically, the personally identifiable information we receive comes directly from users like you who are interested in using the Glamlink Service, signing up as a user of the Glamlink Service, and obtaining various products and services from us. We collect personal information when
                  you sign up as a user, contact us with inquiries, purchase products or services, or participate in promotional offers.
                </p>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">The personally identifiable information we collect includes:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-glamlink-teal mr-3 mt-1">•</span>
                      <span className="text-gray-700">Contact information, including name, email address, mailing address, age, date of birth and phone number</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-glamlink-teal mr-3 mt-1">•</span>
                      <span className="text-gray-700">Location data</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-glamlink-teal mr-3 mt-1">•</span>
                      <span className="text-gray-700">Unique identifiers such as username, account number, and password</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-glamlink-teal mr-3 mt-1">•</span>
                      <span className="text-gray-700">Internet network data, including IP addresses, browser data, or interactions with glamlink.net</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-glamlink-teal mr-3 mt-1">•</span>
                      <span className="text-gray-700">Commercial information including records of transactions and memberships purchased</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-glamlink-teal mr-3 mt-1">•</span>
                      <span className="text-gray-700">Preferences information such as the types of emails you would like to receive from us</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-glamlink-teal mr-3 mt-1">•</span>
                      <span className="text-gray-700">Promotional offers you may be interested in</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-glamlink-teal mr-3 mt-1">•</span>
                      <span className="text-gray-700">Requests made through our Booking Service</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-glamlink-teal mr-3 mt-1">•</span>
                      <span className="text-gray-700">Billing information submitted through our site to a third party payment processor who holds and manages the information</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-glamlink-teal mr-3 mt-1">•</span>
                      <span className="text-gray-700">Other personal information you voluntarily provide to us through the website, on the phone, via email, or in other communications</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 2: Information Collected Through Technology / Cookies */}
              <div id="technology" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">2. Information Collected Through Technology / Cookies</h3>
                <div className="space-y-6">
                  <div className="prose prose-lg max-w-none mb-12">
                    <p className="text-gray-700 leading-relaxed mb-6">
                      We also collect information through technology to make our sites more interesting and useful. For instance, when you come to one of our sites, your IP address is collected. An IP address is often associated with the network through which you enter the Internet, like your ISP or
                      your company. At times, we also use IP addresses to collect information regarding the frequency with which our users visit various parts of our sites. We may also use your IP Address to help diagnose problems with our servers and to administer our websites.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      When you use the Glamlink Service we may store a small amount of information on your computer. This information will be in the form of a &quot;cookie&quot; or similar file. Cookies are small files stored on your computer, not on our site. We use cookies in our interactive
                      website areas, to deliver content specific to your interests, and so you are not required to reenter your account data every time you connect to the site. Through your web browser you can choose to have your computer warn you each time a cookie is being set, or you can choose
                      to delete or turn off all cookies at any time. Each browser is a little different, so look at your browser&#39;s Help menu to learn the correct way to modify your cookie settings. For information about cookies from the FTC website visit{" "}
                      <a href="https://www.consumer.ftc.gov/articles/0042-online-tracking" target="_blank" className="text-glamlink-teal hover:underline">
                        https://www.consumer.ftc.gov/articles/0042-online-tracking
                      </a>
                      .
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Our websites may also use a variety of technical methods for tracking purposes, such as JavaScript snippets or pixel tags. We may also use these technical methods to analyze the traffic patterns on our websites, such as the frequency with which our users visit various parts of
                      our websites.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-6">We also maintain standard web logs that record data about all visitors and customers who use the Glamlink Service.</p>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Glamlink and our marketing partners including third party service providers, advertisers, advertising networks and platforms, advertising agencies, and data brokers and aggregators may use automated means to collect various types of information about you, your computer or other
                      device used to access this site or its services. This information is based on your usage of this site, including information collected automatically from this site (or by our marketing partners).
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      A representative, non-exhaustive list of the types of passively or automatically collected information may include: network or Internet protocol address and type of browser you are using (e.g., Chrome, Safari, Firefox, Edge), the type of operating system you are using, (e.g.,
                      Microsoft Windows or Mac OS), the name of your Internet service provider and domains used by such providers, mobile network, device identifiers, device settings, browser settings, the web pages of this site you have visited, pages or service visited before and after you visit a
                      page or service, the type of handheld or mobile device used to view the page or service (e.g., iOS, Android), location information, and the content and advertisements you have accessed, seen, forwarded and/or clicked on, the various time details per visit (e.g., the time spent
                      on each page or service within the site) and the details about the path followed within the site with special reference to the sequence of pages visited, other parameters about the device operating system and/or the user&#39;s IT environment, and conversion rates and marketing
                      and conversion data and statistics, reports and analytics, including without limitation your interactions to emails we send, and reviews and surveys regarding this site or any products listed on this site.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      If you are accessing a page or service from a computer or a mobile device, you may be asked to share your geo-location information with us. If you agree to the collection of location data, in most cases, you will be able to turn off such data collection at any time by accessing
                      the privacy settings of your computer, browser, or mobile device.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3: Use of Personal Information */}
              <div id="use" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">3. Use of Personal Information</h3>

                <p className="text-gray-700 leading-relaxed mb-6">
                  We may use your personally identifiable information in many ways, such as to send information you provide through the Booking Service to Beauty Professionals. In addition, sometimes we hire companies to help deliver products or services, such as a third-party content provider or a
                  company that provides payment processing. In those instances, there is a need to share your information with these companies. We may also use information collected through the Glamlink Service for research regarding the effectiveness of the Glamlink Service and our business
                  planning, marketing, advertising, and sales efforts.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  We may also take your personally identifiable information and make it non-personally identifiable, either by combining it with information about other individuals, or by removing characteristics (such as your name) that make the information personally identifiable to you. There are
                  no restrictions under this Privacy Policy upon our right to aggregate or de-personalize your personal information, and we may use and/or share the resulting non-personally identifiable information with third parties.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">We may store personally identifiable information itself or such information may be included in databases owned and maintained by our affiliates, agents, or service providers.</p>
                <p className="text-gray-700 leading-relaxed mb-6">We may use your personally identifiable information to:</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <span className="text-glamlink-teal mr-3 mt-1">•</span>
                    <span className="text-gray-700">Provide you with the Glamlink Service and any products or services you request</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-glamlink-teal mr-3 mt-1">•</span>
                    <span className="text-gray-700">Send you requested product or service information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-glamlink-teal mr-3 mt-1">•</span>
                    <span className="text-gray-700">Respond to customer service requests</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-glamlink-teal mr-3 mt-1">•</span>
                    <span className="text-gray-700">Administer your account</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-glamlink-teal mr-3 mt-1">•</span>
                    <span className="text-gray-700">Send you newsletters, text messages or email communications</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-glamlink-teal mr-3 mt-1">•</span>
                    <span className="text-gray-700">Respond to your questions and concerns</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-glamlink-teal mr-3 mt-1">•</span>
                    <span className="text-gray-700">Improve our website, app, and marketing efforts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-glamlink-teal mr-3 mt-1">•</span>
                    <span className="text-gray-700">Conduct internal quality improvement or business analysis</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-glamlink-teal mr-3 mt-1">•</span>
                    <span className="text-gray-700">Display driving directions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-glamlink-teal mr-3 mt-1">•</span>
                    <span className="text-gray-700">Process payments for bills and invoices</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-glamlink-teal mr-3 mt-1">•</span>
                    <span className="text-gray-700">Fulfill or meet the reason you provided the Personal Information to Glamlink, such as to create your account, process your transaction or respond to your inquiry.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-glamlink-teal mr-3 mt-1">•</span>
                    <span className="text-gray-700">
                      Communicate with you, including via e-mail, text message, push notification, social media and/or telephone calls. We may retain your e-mail, e-mail address and our responses to you. This information is used to answer your follow-up questions and concerns.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-glamlink-teal mr-3 mt-1">•</span>
                    <span className="text-gray-700">Measure how effectively we address your concerns.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-glamlink-teal mr-3 mt-1">•</span>
                    <span className="text-gray-700">
                      Personalize your experience and to deliver custom content and service offerings relevant to your interests, including targeted offers and ads through our Website, Mobile Apps, Communications, third-party sites, or on other devices you may use. We may ask you to voluntarily
                      provide us with information about your interests, demographics, experience with our services and contact preferences to help customize offerings to you.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-glamlink-teal mr-3 mt-1">•</span>
                    <span className="text-gray-700">If you send us a resume or curriculum vitae ("CV") to apply online for a position with Glamlink, we will use the Personal Information that you provide to match you with available Glamlink job opportunities.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-glamlink-teal mr-3 mt-1">•</span>
                    <span className="text-gray-700">To recognize you and remember your information or location when you return to our website, mobile apps and services.</span>
                  </li>
                </ul>

                <p className="text-gray-700 leading-relaxed mb-6">
                  We may use your Personal Information and usage data collected through the Glamlink Services for the performance of the services or transaction for which it was given and for the basic purpose of this site. We may use your Personal Information in connection with other products,
                  services, promotions, personalized ads, or contests we may offer, and our private, internal reporting for this site, and security assessments for this site. We may also send you messages related to certain features or your activity on this site. We may also send you news or updates
                  about changes to our site or services.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  We may use publicly available Personal Information posted on social media profile information including photos for purposes of assisting us, and our marketing partners with marketing and advertising activities and with contact management.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  We may participate with our marketing partners for purposes of providing personalized ads based on your interests. This activity is performed by collecting data and by using cookies and other tracking and data collection methodologies discussed above to transfer information to our
                  marketing partners which manage advertising activities.
                </p>

                <p className="text-gray-700 leading-relaxed">
                  Our marketing partners may also use cookies and other tracking and data collection methodologies discussed above to measure advertisement effectiveness and for other purposes that are disclosed in their own privacy policies. We have no access or control over these cookies and other
                  tracking and data collection methodologies that may be used by our marketing partners, and we have no responsibility or liability for the privacy policies and practices of these sites.
                </p>
              </div>

              {/* Section 4: Messages and Communications */}
              <div id="communications" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">4. Messages and Communications</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Comments or questions sent to us using email or messaging forms will be shared with Glamlink staff who are most able to address your concerns. We may archive your messages once we have made our best effort to provide you with a complete and satisfactory response.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  By providing a telephone number, you expressly consent and authorize us, as well as any of our related affiliates, agents or contractors, to contact you through the use of any dialing equipment (including a dialer, automatic telephone dialing system, and/or interactive voice
                  recognition system) and/or artificial or prerecorded voice or message. You expressly agree that such automated calls may be made to any telephone number (including numbers assigned to any cellular or other service for which you may be charged for the call) you provide. In addition,
                  you expressly consent and authorize the receipt of text messages from us at any telephone number (including numbers assigned to any cellular or other service for which you may be charged for the call) you provide. By providing this express consent, you specifically waive any claim
                  you may have for the making of such calls or texts, including any claim under federal or state law and specifically any claim under the Telephone Consumer Protection Act, 47 U.S.C. § 227. By providing a telephone number, you represent you are the subscriber or owner or have the
                  authority to use and provide consent to call or text the number.
                </p>

                <p className="text-gray-700 leading-relaxed">
                  By providing your email address, you expressly opt-in to the receipt of email communications from us and our affiliates, agents, or contractors for or related to goods or services, your account, and other services. By providing this express consent, you specifically waive any claim
                  you may have for the sending of such emails, including any claim under federal or state law and specifically any claim under the CAN-SPAM Act, 15 U.S.C.§ 7701, et seq. By providing an email address, you represent you are the subscriber or owner or have the authority to use and
                  provide consent to contact the email address.
                </p>
              </div>

              {/* Section 5: Third Party Services */}
              <div id="third-party" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">5. Third Party Services</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Glamlink uses a third-party vendor to help us manage our email and text messaging communications with you. When you click on a link in an email, you may temporarily be redirected through one of the vendor&#39;s servers (although this process will be invisible to you) which will
                  register that you&#39;ve clicked on that link.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Even if you have given us permission to send emails or text messages to you, you may revoke that permission at any time by following the &quot;unsubscribe&quot; information at the bottom of the email or by replying &quot;Stop&quot; to any text message you receive from us.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  We may partner with a third-party ad network to manage our advertising on other sites. Our ad network partner may use cookies, Web beacons, and other tracking technologies to collect information about your activities on this and other Websites and to then provide you with Glamlink
                  advertising on other websites.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  This Privacy Policy does not cover the use of cookies or web beacons by any third parties, including beauty professionals who use the Glamlink Service for commercial or promotional purposes (collectively, &quot;Beauty Professionals&quot;) so be sure to review the privacy policy of
                  any third-party websites and Beauty Professionals you visit.
                </p>
              </div>

              {/* Section 6: Social Media / Remarketing */}
              <div id="social-media" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">6. Social Media / Remarketing</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  When we interact with you through our content on social media platforms, third-party platforms, third-party websites, applications, integrations, and services of our marketing partners, we may obtain any information regarding your interaction with that content, such as content you
                  have viewed and information about advertisements within the content you have been shown or may have clicked on. For a description on how social media services and other third-party platforms, plug-ins, integrations or applications handle your information, please refer to their
                  respective privacy policies and terms of use, which may permit you to modify your privacy settings.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  We also may participate in remarketing, retargeting, and behavioral advertising services. In such cases, we may provide Personal Information such as your email address and phone number to a third party services such as Facebook, Google, Microsoft, or Twitter to determine if you are
                  a registered account holder with one or more services.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We also may collect publicly available Personal Information posted on social media platforms and profiles. When you engage with our content on or through social media platforms or other third party platforms, plug-ins, integrations or applications, you may allow us to have access
                  to certain Personal Information in your profile that you have added to these platforms. This may include your name, e-mail address, photo, gender, birthday, location, an ID associated with the applicable third-party platform or social media account user files, &quot;like&quot;
                  photos and videos, your list of friends or connections, people you follow and/or who follow you, or your posts or &quot;likes.&quot;
                </p>
              </div>

              {/* Section 7: Links to third party websites */}
              <div id="third-party-links" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">7. Links to third party websites</h3>
                <p className="text-gray-700 leading-relaxed">
                  The Glamlink Service includes links to other websites whose privacy practices may differ from those of Glamlink. If you submit personal information to any of those sites or to Beauty Professionals, your information is governed by their Privacy Policies. We encourage you to
                  carefully read the Privacy Policy of any website you visit.
                </p>
              </div>

              {/* Section 8: Security */}
              <div id="security" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">8. Security</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  The Glamlink Service has security measures in place that are intended to help protect against the loss, misuse, unauthorized access or alteration of information under our control both during transmission and once the information is received. These measures include encryption of
                  data using the Secure Socket Layer (SSL) system when you send your personal information electronically to the Glamlink Service.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  However, no Internet or e-mail transmission is ever fully secure or error free. In particular, e- mail sent to or from the Glamlink Service may not be secure. Therefore, you should take special care in deciding what information you send to us via e-mail. Please keep this in mind
                  when disclosing any personally identifiable information via the Internet. Although we will do our best to protect your personal information, we cannot guarantee the security of data while you are transmitting it to our site; any such transmission is at your own risk.
                </p>
              </div>

              {/* Section 9: Data Retention */}
              <div id="data-retention" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">9. Data Retention</h3>
                <p className="text-gray-700 leading-relaxed">
                  Unless required under applicable law, we will retain your personally identifiable information for our business records even after your account is deleted. This is necessary for maintaining our business and accounting records as to the services you have purchased and the payments
                  you have made.
                </p>
              </div>

              {/* Section 10: Purchase or Sale of Businesses */}
              <div id="business-transfer" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">10. Purchase or Sale of Businesses</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  We may buy, merge, or partner with other companies or businesses and in so doing, acquire or transfer information. We may also, sell, assign, or otherwise transfer such information in the regular course of business. Information collected through the Glamlink Service may be among
                  the transferred business assets. In the event that a portion or substantially all of our assets are sold or transferred to a third party, your information would likely be a transferred business asset, and you hereby agree to such a transfer.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  In the unlikely event of our bankruptcy, insolvency, reorganization, receivership, or assignment for the benefit of creditors, or the application of laws or equitable principles affecting creditors&#39; rights generally, we may not be able to control how your personal information
                  is treated, transferred, or used.
                </p>
              </div>

              {/* Section 11: Additional Disclosures */}
              <div id="disclosures" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">11. Additional Disclosures</h3>
                <p className="text-gray-700 leading-relaxed">
                  We will disclose personal information when we believe in good faith that such disclosures are required by law, including, for example, to comply with a court order or subpoena; to enforce our Privacy Policy; to protect your safety or security; and/or, protect the safety and
                  security of our websites, us, and/or third parties, including the safety and security of property that belongs to us or third parties. We may disclose personal information to any person performing audit, legal, operational, or other services for us.
                </p>
              </div>

              {/* Section 12: Non-Personal Information */}
              <div id="non-personal" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">12. Non-Personal Information</h3>
                <p className="text-gray-700 leading-relaxed">
                  We may use and share non-personal information – that is, de-identified information that cannot be used to identify you - for any lawful business purpose without any obligation or accounting to you. For example, we can use non-personal information for developing products, services,
                  and providing those offerings to other users and third parties. We may use your personal information to generate non-personal information. When we do so, we will take reasonable measures to ensure that the non-personal information is no longer personally identifiable and cannot
                  later be used to identify you. We may also disclose non-personal, aggregate, anonymous data in a de- identified format based on information collected from users to investors, and other third parties.
                </p>
              </div>

              {/* Section 13: Children's Information */}
              <div id="children" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">13. Children's Information</h3>

                <p className="text-gray-700 leading-relaxed">
                  We do not knowingly collect any information from, or sell to, children under the age of 13. If you are a parent or guardian who has discovered that your child under the age of 13 has submitted his or her personally identifiable information without your permission or consent, please
                  contact us and we will remove the information at your request.
                </p>
              </div>

              {/* Section 14: Changes and Updates */}
              <div id="changes" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">14. Changes and Updates</h3>
                <p className="text-gray-700 leading-relaxed">
                  We may revise this Privacy Policy from time to time as we add new features or modify the way in which we manage information, or as laws change that may affect our services. If we make material changes to our Privacy Policy, we will post notice of this on the Glamlink Service prior
                  to the changes becoming effective. Any revised Privacy Policy will apply both to information we already have about you at the time of the change, and any personal information created or received after the change takes effect. We include a version number on this Privacy Policy
                  consisting of the date (year, month, and day) it was last revised. We encourage you to periodically reread this Privacy Policy, to see if there have been any changes to our policies that may affect you. Your continued use of the websites after any such changes constitutes your
                  acceptance of the new Privacy Policy. If you do not agree to this Privacy Policy or any future Privacy Policy, do not use (or continue to use) the websites.
                </p>
              </div>

              {/* Section 15: Do Not Track */}
              <div id="do-not-track" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">15. Do Not Track</h3>
                <p className="text-gray-700 leading-relaxed">We currently do not participate in any "Do Not Track" frameworks that would allow us to respond to signals or other mechanisms from you regarding the collection of data.</p>
              </div>

              {/* Section 16: Your State Privacy Rights */}
              <div id="state-rights" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">16. Your State Privacy Rights</h3>

                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">State consumer privacy laws may provide their residents with additional rights regarding our use of their personal information.</p>

                  <p className="text-gray-700 leading-relaxed">California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Montana, Oregon, Tennessee, Texas, Utah, Virginia, and other states may provide (now or in the future) their state residents with rights to:</p>

                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-glamlink-teal mr-3 mt-1">•</span>
                      <span className="text-gray-700">Confirm whether we process their personal information</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-glamlink-teal mr-3 mt-1">•</span>
                      <span className="text-gray-700">Access and delete certain personal information</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-glamlink-teal mr-3 mt-1">•</span>
                      <span className="text-gray-700">Correct inaccuracies in their personal information, taking into account the information's nature and processing purpose (excluding Iowa and Utah)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-glamlink-teal mr-3 mt-1">•</span>
                      <span className="text-gray-700">Data portability</span>
                    </li>
                    <li className="flex flex-col items-start">
                      <span className="flex items-start">
                        <span className="text-glamlink-teal mr-3 mt-1">•</span>
                        <span className="text-gray-700">Opt-out of personal data processing for:</span>
                      </span>
                      <ul className="ml-6 mt-2 space-y-1">
                        <li className="flex items-start">
                          <span className="text-glamlink-teal mr-3 mt-1">•</span>
                          <span className="text-gray-700">Targeted advertising (excluding Iowa)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-glamlink-teal mr-3 mt-1">•</span>
                          <span className="text-gray-700">Sales</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-glamlink-teal mr-3 mt-1">•</span>
                          <span className="text-gray-700">Profiling in furtherance of decisions that produce legal or similarly significant effects (excluding Iowa and Utah)</span>
                        </li>
                      </ul>
                    </li>
                    <li className="flex items-start">
                      <span className="text-glamlink-teal mr-3 mt-1">•</span>
                      <span className="text-gray-700">Either limit (opt-out of) or require consent to process sensitive personal data</span>
                    </li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    The exact scope of these rights vary by state. To exercise any of these rights use the <strong>Contact Information</strong> below to state your request. We may have a reason under the law why we do not have to comply with your request or may comply with it in a more limited way
                    than you anticipated. If we do, we will explain that to you in our response.
                  </p>
                  <p className="text-gray-700 leading-relaxed">Please note that, in order to verify your identity, we may require you to provide us with information prior to accessing any records containing information about you.</p>
                </div>
              </div>

              {/* Section 17: International Privacy Laws */}
              <div id="international" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">17. International Privacy Laws / Storage and Transfer of your Data</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Glamlink is a U.S.-based company. If you are using the websites from outside the United States, please be aware that you are sending information (including potentially personally identifiable information) to the United States. Any information sent to Glamlink will be held in
                  accordance with privacy laws in the United States and this Privacy Policy.
                </p>

                <h4 className="text-lg font-semibold text-gray-900 mb-3">EEA/Switzerland/UK Data Transfers</h4>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Glamlink is a U.S.-based company with no EEA/EU/UK establishments at this time. By using the Glamlink Service, you are transmitting information to Glamlink in the United States and its service providers (in the United States and third countries). If you are a resident of another
                  country, note that the United States and other countries may not afford the same privacy protections as your country of residence.
                </p>

                <h4 className="text-lg font-semibold text-gray-900 mb-3">Special Notice to EEA, UK and Switzerland Citizens and Residents</h4>
                <p className="text-gray-700 leading-relaxed mb-6">If you are a citizen of or reside in the EEA, Switzerland, or the UK, you may be entitled to certain rights, subject to applicable exceptions, under the GDPR, Swiss, and UK data protection laws.</p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  These rights may include the right to: (i) request access to, correction of, or deletion of To submit a request to exercise your rights, please use the Contact Information below. We may have a reason under the law why we do not have to comply with your request or may comply with it
                  in a more limited way than you anticipated. If we do, we will explain that to you in our response.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">Please note that, in order to verify your identity, we may require you to provide us with information prior to accessing any records containing information about you.</p>

                <h4 className="text-lg font-semibold text-gray-900 mb-3">Other Jurisdictions</h4>
                <p className="text-gray-700 leading-relaxed">
                  If you are the resident of another state or a citizen of another jurisdiction not listed above and you believe that you have the right to request certain actions, including the right to request that personal information be deleted, please submit your request using the{" "}
                  <strong>Contact Information</strong> below.
                </p>
              </div>

              {/* Section 18: Contact Information */}
              <div id="contact" className="mb-16 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">18. Contact Information</h3>
                <p className="text-gray-700 leading-relaxed mb-6">If you have any questions about this Privacy Policy, our policies and practices concerning the Glamlink Service, your rights under this statement, and your dealings with Glamlink, please contact us.</p>
                <p className="text-gray-700 leading-relaxed">
                  Estheticians 4 You LLC <br />
                  Attn: Privacy Agent <br />
                  8090 S. Durango Dr Ste 102 #1033 <br />
                  Las Vegas, NV 89113 <br />
                  Email:{" "}
                  <a href="mailto:email-support@glamlink.net" className="text-glamlink-teal underline">
                    email-support@glamlink.net
                  </a>
                </p>
              </div>

              {/* Final Note */}
              <div className="mt-16 pt-8 border-t">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Thank You for Reading</h4>
                  <p className="text-gray-600 mb-6">We are committed to protecting your privacy and handling your personal information with care and respect. If you have any questions about this Privacy Policy, please don't hesitate to contact us.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={scrollToTop} className="px-6 py-3 bg-glamlink-teal text-white font-semibold rounded-full hover:bg-glamlink-teal-dark transition-colors">
                      Back to Top
                    </button>
                    <Link href="/terms" className="px-6 py-3 bg-white text-glamlink-teal font-semibold rounded-full border-2 border-glamlink-teal hover:bg-gray-50 transition-colors">
                      View Terms of Use
                    </Link>
                  </div>
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
