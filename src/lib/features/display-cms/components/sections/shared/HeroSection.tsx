"use client";

import { useState } from "react";
import Image from "next/image";
import type { HomeSection } from '@/lib/pages/admin/components/content-settings/content/sections/home/types';
import UserDownloadDialog from "@/lib/components/modals/UserDownloadDialog";
import ProDownloadDialog from "@/lib/components/modals/ProDownloadDialog";

interface HeroSectionProps {
  section: HomeSection | any; // Allow for-clients sections too
  onCtaClick?: () => void;
}

export function HeroSection({ section }: HeroSectionProps) {
  if (!section || section.type !== 'hero') return null;
  const { content } = section;

  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showProDialog, setShowProDialog] = useState(false);

  // Check if this is a for-clients hero (has phoneImages array and backgroundImage)
  const isForClientsHero = content && 'phoneImages' in content && Array.isArray(content.phoneImages);

  // Check if this is a home hero (has buttons array and single phoneImage)
  const isHomeHero = content && 'buttons' in content && Array.isArray(content.buttons);

  const handleButtonClick = (action: string) => {
    if (action === "download-client" || action === "download") {
      setShowUserDialog(true);
    } else if (action === "download-pro") {
      setShowProDialog(true);
    }
  };

  // Render For Clients Hero (with background image and 3 phone images)
  if (isForClientsHero) {
    return (
      <>
        <section className="bg-gradient-to-b from-gray-50 to-white pt-8">
          <div className="container-custom">
            <div className="flex flex-col items-center text-center space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
                {content.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                {content.subtitle}
              </p>
              <h2 className="block md:hidden text-3xl font-bold text-gray-900 text-center mb-4">
                {content.mobileSubtitle || 'Your All-In-One Beauty Platform'}
              </h2>
            </div>
          </div>

          {/* Desktop Background with Images */}
          <div
            className="hidden md:block w-full mt-12 relative h-[600px] bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: content.backgroundImage ? `url('${content.backgroundImage}')` : undefined }}
          >
            <h2 className="absolute top-8 left-1/2 transform -translate-x-1/2 text-3xl font-bold z-10 text-center whitespace-nowrap">
              {content.mobileSubtitle || 'Your All-In-One Beauty Platform'}
            </h2>
            <div className="grid absolute top-32 left-1/2 transform -translate-x-1/2 grid-cols-3 gap-8 z-10 w-[90%] max-w-6xl">
              {content.phoneImages && content.phoneImages.slice(0, 3).map((image: string, index: number) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden border-[5px] border-black">
                  {image && (
                    <Image
                      src={image}
                      alt={`Beauty platform feature ${index + 1}`}
                      width={400}
                      height={400}
                      className="w-full h-auto transition-transform duration-300 hover:scale-105"
                    />
                  )}
                </div>
              ))}
            </div>
            {content.ctaButton && (
              <button
                onClick={() => handleButtonClick(content.ctaButton.action)}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-8 py-3 bg-glamlink-teal text-white text-base font-semibold rounded-full hover:bg-glamlink-teal-dark transition-colors"
              >
                {content.ctaButton.text}
              </button>
            )}
          </div>

          {/* Mobile Images Grid */}
          <div className="container-custom">
            <div className="grid md:hidden grid-cols-1 gap-8 mt-8">
              {content.phoneImages && content.phoneImages.slice(0, 3).map((image: string, index: number) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden border-[5px] border-black">
                  {image && (
                    <Image
                      src={image}
                      alt={`Beauty platform feature ${index + 1}`}
                      width={400}
                      height={400}
                      className="w-full h-auto transition-transform duration-300 hover:scale-105"
                    />
                  )}
                </div>
              ))}
            </div>
            {content.ctaButton && (
              <div className="flex justify-center">
                <button
                  onClick={() => handleButtonClick(content.ctaButton.action)}
                  className="block md:hidden mt-8 px-8 py-3 bg-glamlink-teal text-white text-base font-semibold rounded-full hover:bg-glamlink-teal-dark transition-colors"
                >
                  {content.ctaButton.text}
                </button>
              </div>
            )}
          </div>
        </section>

        <UserDownloadDialog isOpen={showUserDialog} onClose={() => setShowUserDialog(false)} />
      </>
    );
  }

  // Render Home Hero (with single phone image and dual buttons)
  if (isHomeHero) {
    return (
      <>
        <section className="bg-gradient-to-br from-gray-50 to-white pt-8 pb-8">
          <div className="container-custom">
            <div className="grid lg-custom:grid-cols-9 gap-12 items-start">
              {/* Left Content */}
              <div className="lg-custom:col-span-4 space-y-8">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  {content.title}
                </h1>

                <p className="text-xl text-gray-600">{content.subtitle}</p>

                <div className="flex flex-col gap-4">
                  {content.buttons && content.buttons.map((button: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleButtonClick(button.action)}
                      className={`text-center px-6 py-3 xs:px-8 xs:py-4 text-sm xs:text-base lg-custom:text-lg xl:text-base font-medium rounded-full transition-all duration-200 transform hover:scale-105 ${
                        button.style === "primary"
                          ? "text-white bg-glamlink-teal hover:bg-glamlink-teal-dark shadow-lg"
                          : "text-glamlink-teal bg-white border-2 border-glamlink-teal hover:bg-gray-50"
                      }`}
                    >
                      {button.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Phone Mockup */}
              <div className="lg-custom:col-span-5 relative">
                <div className="relative w-full">
                  {content.phoneImage && (
                    <Image
                      src={content.phoneImage}
                      alt="Glamlink app mockup"
                      width={400}
                      height={800}
                      className="w-full h-auto"
                      priority
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <UserDownloadDialog isOpen={showUserDialog} onClose={() => setShowUserDialog(false)} />
        <ProDownloadDialog isOpen={showProDialog} onClose={() => setShowProDialog(false)} />
      </>
    );
  }

  // Fallback if neither structure matches
  return null;
}
