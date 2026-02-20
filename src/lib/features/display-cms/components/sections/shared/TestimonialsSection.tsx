"use client";

import Image from "next/image";
import type { HomeSection } from '@/lib/pages/admin/components/content-settings/content/sections/home/types';
import { isTestimonialsSection } from '@/lib/pages/admin/components/content-settings/content/sections/home/types';

interface TestimonialsSectionProps {
  section: HomeSection;
}

export function TestimonialsSection({ section }: TestimonialsSectionProps) {
  if (!isTestimonialsSection(section)) return null;
  const { content } = section;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-12">
          {content.title}
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {content.items && content.items.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg p-8 shadow-sm">
              <div className="flex flex-col">
                <p className="text-gray-700 text-lg mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    {testimonial.image ? (
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <span className="text-white text-lg font-semibold">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
