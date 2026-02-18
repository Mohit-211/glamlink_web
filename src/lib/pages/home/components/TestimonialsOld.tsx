"use client";

import Image from "next/image";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      text: "I booked facials from 3 different pros and every single one was amazing.",
      role: "Client"
    },
    {
      name: "Emily Chen",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      text: "The moment I set up my Glamlink profile, I got my first product sale.",
      role: "Professional"
    }
  ];

  return (
    <section className="bg-white">
      <div className="container-custom">
        <div className="grid lg-custom:grid-cols-2 gap-6 lg-custom:gap-0">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className={`
                p-8 lg-custom:p-6
                max-lg-custom:rounded-lg max-lg-custom:shadow-sm max-lg-custom:border max-lg-custom:border-gray-100
                ${index === 0 ? 'lg-custom:pr-6' : 'lg-custom:pl-6 lg-custom:border-l lg-custom:border-[#f4f5f5]'}
              `}
            >
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-lg text-gray-700">
                    {testimonial.text}
                  </p>
                  {/* Hidden for now
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                  */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}