"use client";

import Link from "next/link";
import { HomePageContent } from "@/lib/config/pageContent";
import { OptimizedImage } from "@/lib/components/ui";

// Feature flag - set to true when links are ready
const ENABLE_LINKS = false;

interface BookTrustedProsProps {
  content: HomePageContent["bookTrustedPros"];
}

export default function BookTrustedPros({ content }: BookTrustedProsProps) {
  const services = content.services;

  return (
    <section className="pt-8 pb-8 bg-white">
      <div className="container-custom">
        <div className="grid lg-custom:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const ServiceCard = (
              <>
                <div className="relative w-full overflow-hidden">
                  <OptimizedImage 
                    src={service.image} 
                    alt={service.alt} 
                    width={400}
                    height={600}
                    className={`w-full h-auto ${ENABLE_LINKS ? 'group-hover:scale-105' : ''} transition-transform duration-300`} 
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className={`text-xl lg-custom:text-base xl:text-xl font-normal text-gray-900 ${ENABLE_LINKS ? 'group-hover:text-glamlink-teal' : ''} transition-colors duration-200`}>{service.title}</h3>
                </div>
              </>
            );

            return ENABLE_LINKS ? (
              <Link 
                key={index} 
                href={`/services/${service.title.toLowerCase().replace(" ", "-")}`} 
                className="group block rounded-lg shadow-md hover:shadow-lg transition-all duration-300" 
                style={{ border: "1px solid #f7f7f7" }}
              >
                {ServiceCard}
              </Link>
            ) : (
              <div 
                key={index}
                className="block rounded-lg shadow-md transition-all duration-300 cursor-default" 
                style={{ border: "1px solid #f7f7f7" }}
              >
                {ServiceCard}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
