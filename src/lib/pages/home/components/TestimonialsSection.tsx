"use client";

import { TestimonialsSectionProps } from "../config";
import { SectionContainer, SectionHeader, getTestimonialRatingClass } from "./ui";
import { EmptyState } from "@/lib/components/ui/EmptyState";

export default function TestimonialsSection({ props }: { props: TestimonialsSectionProps }) {
  if (!props) {
    return null;
  }
  
  const { state, handlers } = props;
  const { testimonials } = state;
  
  if (!testimonials || testimonials.length === 0) {
    return (
      <SectionContainer>
        <SectionHeader 
          title="What Clients Say" 
          subtitle="Hear from our satisfied customers"
        />
        <EmptyState message="Testimonials coming soon" />
      </SectionContainer>
    );
  }
  
  return (
    <SectionContainer>
      <SectionHeader 
        title="What Clients Say" 
        subtitle="Don't just take my word for it - hear from businesses that have transformed their digital presence"
      />
      
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col"
          >
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${i < testimonial.rating ? getTestimonialRatingClass(testimonial.rating) : 'text-gray-300'} fill-current`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            
            <blockquote className="text-gray-700 dark:text-gray-300 mb-6 italic flex-grow">
              "{testimonial.content}"
            </blockquote>
            
            <div className="flex items-center mt-auto">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center mr-4">
                {testimonial.avatarUrl ? (
                  <img 
                    src={testimonial.avatarUrl} 
                    alt={testimonial.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {testimonial.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {testimonial.role}{testimonial.company && `, ${testimonial.company}`}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Ready to Join These Success Stories?
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          Let's discuss how we can help transform your business challenges into digital solutions that drive growth.
        </p>
        <button
          onClick={handlers?.onScheduleClick}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          Schedule a Call
        </button>
      </div>
    </SectionContainer>
  );
}