"use client";

import Link from "next/link";

export default function ExploreByService() {
  const services = [
    { name: "Hair", icon: "✂️" },
    { name: "Skin", icon: "✨" },
    { name: "Nails", icon: "💅" },
    { name: "Makeup", icon: "💄" },
    { name: "Wellness", icon: "🧘" },
    { name: "More", icon: "+" }
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          Explore by Service
        </h2>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {services.map((service, index) => (
            <Link 
              key={index} 
              href={`/services/${service.name.toLowerCase()}`}
              className="group"
            >
              <div className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl mb-3">{service.icon}</div>
                <h3 className="text-gray-900 font-medium group-hover:text-glamlink-teal transition-colors">
                  {service.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}