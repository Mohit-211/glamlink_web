"use client";

import { ServicesSectionProps } from "../config";
import { SectionContainer, SectionHeader, getServiceCardClass } from "./ui";
import { EmptyState } from "@/lib/components/ui/EmptyState";

export default function ServicesSection({ props }: { props: ServicesSectionProps }) {
  if (!props) {
    return null;
  }
  
  const { state, handlers } = props;
  const { services } = state;
  
  if (!services || services.length === 0) {
    return (
      <SectionContainer>
        <SectionHeader 
          title="Our Services" 
          subtitle="How we can help your business grow"
        />
        <EmptyState message="Services information coming soon" />
      </SectionContainer>
    );
  }
  
  const iconPaths: Record<string, string> = {
    CodeBracketIcon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    ServerIcon: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01",
    DevicePhoneMobileIcon: "M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3",
    ShoppingCartIcon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
  };
  
  return (
    <SectionContainer>
      <SectionHeader 
        title="What We Do" 
        subtitle="Comprehensive digital solutions tailored to your business needs"
      />
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => (
          <div 
            key={service.id}
            className={`p-6 rounded-xl ${getServiceCardClass(index)} transform hover:scale-105 transition-all duration-300 cursor-pointer`}
            onClick={() => handlers?.onServiceClick(service.id)}
          >
            <div className="w-16 h-16 mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={iconPaths[service.icon] || iconPaths.CodeBracketIcon} 
                />
              </svg>
            </div>
            
            <h3 className="text-xl font-bold mb-3 text-white">
              {service.title}
            </h3>
            
            <p className="text-white text-opacity-90 mb-4">
              {service.description}
            </p>
            
            {service.features && service.features.length > 0 && (
              <ul className="space-y-2">
                {service.features.slice(0, 3).map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg className="w-4 h-4 text-white text-opacity-75 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-white text-opacity-75">{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}