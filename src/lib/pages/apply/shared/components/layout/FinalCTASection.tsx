"use client";

import { useState } from "react";
import Link from "next/link";

export default function FinalCTASection() {
  const [showForm, setShowForm] = useState(false);

  const scrollToForm = () => {
    const formElement = document.getElementById('get-featured-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      setShowForm(true);
      setTimeout(() => {
        const formElement = document.getElementById('get-featured-form');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <section className="py-12 bg-gradient-to-r from-glamlink-teal to-cyan-600">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Featured?
          </h2>

          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Join our community of talented beauty professionals and get discovered by clients who appreciate your expertise.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToForm}
              className="px-8 py-4 bg-white text-glamlink-teal font-bold text-lg rounded-full hover:bg-gray-100 transition-colors shadow-lg"
            >
              Apply to Get Featured
            </button>
            <a
              href="https://crm.glamlink.net"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-transparent text-white font-bold text-lg rounded-full border-2 border-white hover:bg-white/10 transition-colors"
            >
              Access E-Commerce Panel
            </a>
          </div>

          <p className="mt-8 text-white/80">
            Limited spots available • No application fee • Get featured in The Glamlink Edit
          </p>
        </div>
      </div>
    </section>
  );
}