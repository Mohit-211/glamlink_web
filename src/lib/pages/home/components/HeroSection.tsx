"use client";

import { useState } from "react";
import Link from "next/link";
import useDynamicButtonWidth from "../hooks/useDynamicButtonWidth";
import UserDownloadDialog from "@/lib/components/modals/UserDownloadDialog";
import ProDownloadDialog from "@/lib/components/modals/ProDownloadDialog";
import { HomePageContent } from "@/lib/config/pageContent";
import { OptimizedImage } from "@/lib/components/ui";

interface HeroSectionProps {
  content: HomePageContent["hero"];
}

export default function HeroSection({ content }: HeroSectionProps) {
  const buttonContainerRef = useDynamicButtonWidth("HeroSectionButton");
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showProDialog, setShowProDialog] = useState(false);

  return (
    <>
      <section className="bg-gradient-to-br from-gray-50 to-white pt-8 pb-8">
        <div className="container-custom">
          <div className="grid lg-custom:grid-cols-9 gap-12 items-start">
            {/* Left Content */}
            <div className="lg-custom:col-span-4 space-y-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">{content.title}</h1>

              <p className="text-xl text-gray-600">{content.subtitle}</p>

              <div className="flex flex-col gap-4" ref={buttonContainerRef}>
                {content.buttons.map((button, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (button.action === "download-client") setShowUserDialog(true);
                      else if (button.action === "download-pro") setShowProDialog(true);
                    }}
                    className={`HeroSectionButton text-center px-6 py-3 xs:px-8 xs:py-4 text-sm xs:text-base lg-custom:text-lg xl:text-base font-medium rounded-full transition-all duration-200 transform hover:scale-105 ${
                      button.style === "primary" ? "text-white bg-glamlink-teal hover:bg-glamlink-teal-dark shadow-lg" : "text-glamlink-teal bg-white border-2 border-glamlink-teal hover:bg-gray-50"
                    }`}
                  >
                    {button.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Phone Mockup */}
            <div className="lg-custom:col-span-5 relative">
              {/* Commented out for potential future use
            <div className="relative w-80 h-[640px]">
              <div className="absolute inset-0 bg-gray-900 rounded-[3rem] shadow-2xl">
                <div className="absolute inset-4 bg-white rounded-[2.5rem] overflow-hidden">
                  <div className="h-12 bg-white flex items-center justify-between px-6 pt-2">
                    <span className="text-xs font-medium">9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-3 bg-gray-900 rounded-sm"></div>
                      <div className="w-4 h-3 bg-gray-900 rounded-sm"></div>
                      <div className="w-6 h-3 bg-gray-900 rounded-sm"></div>
                    </div>
                  </div>
                  
                  <div className="px-4 pb-4 space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Julia Parker</h3>
                          <p className="text-sm text-gray-600">Hair Weaver</p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm text-gray-600">4.87</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Professionals</h4>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-glamlink-teal text-white text-sm rounded-full">Custom Tailor</span>
                        <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">Hair</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button className="p-3 bg-gray-100 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-200 transition-colors">
                        All Professionals
                      </button>
                      <button className="p-3 bg-gray-100 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-200 transition-colors">
                        Top Tiers
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-gray-900 rounded-full"></div>
            </div>
            */}

              {/* Phone Image */}
              <div className="relative w-full">
                <OptimizedImage src="/images/hero pic-website.png" alt="Glamlink app mockup" width={400} height={800} className="w-full h-auto" priority />
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
