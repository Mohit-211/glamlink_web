"use client";

import { HomePageContent } from "@/lib/config/pageContent";
import { OptimizedImage } from "@/lib/components/ui";

interface TestimonialsProps {
  content: HomePageContent['testimonials'];
}

export default function Testimonials({ content }: TestimonialsProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-12">{content.title}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {content.items.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg p-8 shadow-sm"
            >
              <div className="flex flex-col">
                <p className="text-gray-700 text-lg mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <OptimizedImage
                      src={testimonial.image || '/images/default-avatar.png'}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
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