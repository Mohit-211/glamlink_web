"use client";

import Image from "next/image";
import type { HomeSection } from '@/lib/pages/admin/components/content-settings/content/sections/home/types';
import { isBookTrustedProsSection } from '@/lib/pages/admin/components/content-settings/content/sections/home/types';

interface BookTrustedProsSectionProps {
  section: HomeSection;
}

export function BookTrustedProsSection({ section }: BookTrustedProsSectionProps) {
  if (!isBookTrustedProsSection(section)) return null;
  const { content } = section;

  return (
    <section className="pt-8 pb-8 bg-white">
      <div className="container-custom">
        <div className="grid lg-custom:grid-cols-3 gap-6">
          {content.services && content.services.map((service, index) => (
            <div
              key={index}
              className="block rounded-lg shadow-md transition-all duration-300 cursor-default"
              style={{ border: "1px solid #f7f7f7" }}
            >
              {service.image && (
                <div className="relative w-full overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    width={400}
                    height={600}
                    className="w-full h-auto transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-4 text-center">
                <h3 className="text-xl lg-custom:text-base xl:text-xl font-normal text-gray-900">
                  {service.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
