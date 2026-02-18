"use client";

import { useState, useEffect } from 'react';

const bannerImages = [
  {
    url: "https://source.unsplash.com/1600x900/?beauty,makeup,professional",
    alt: "Beauty and Makeup Professional"
  },
  {
    url: "https://source.unsplash.com/1600x900/?spa,wellness,beauty",
    alt: "Spa and Wellness"
  },
  {
    url: "https://source.unsplash.com/1600x900/?skincare,cosmetics,beauty",
    alt: "Skincare and Cosmetics"
  },
  {
    url: "https://source.unsplash.com/1600x900/?salon,hairstyling,beauty",
    alt: "Salon and Hairstyling"
  },
  {
    url: "https://source.unsplash.com/1600x900/?nails,manicure,beauty",
    alt: "Nail Art and Manicure"
  }
];

export default function HeroBanner() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0 z-0">
        {bannerImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url("${image.url}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom">
        <div className="max-w-3xl">
          <h1 className="hero-title mb-6">
            The Link to the Future of Beauty
          </h1>
          
          <p className="hero-subtitle mb-4">
            Where beauty meets innovation, and possibilities are endless.
            Your go-to application for the beauty industry.
          </p>
          
          <p className="text-lg text-white/80 mb-8">
            Beauty. One Platform. Infinite Possibilities<br />
            One Platform. Infinite Possibilities. Trusted Professionals.
          </p>

          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-white">Download App Now</h3>
            
            <div className="flex flex-wrap gap-4">
              {/* App Store Button */}
              <a 
                href="#" 
                className="btn-app-store"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.24 12.37 21.24C10.84 21.24 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 16.97 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
                </svg>
                <span>Download on the<br />App Store</span>
              </a>

              {/* Google Play Button */}
              <a 
                href="#" 
                className="btn-google-play"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <span>GET IT ON<br />Google Play</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'bg-white w-8' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentImageIndex((prev) => 
          prev === 0 ? bannerImages.length - 1 : prev - 1
        )}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
        aria-label="Previous image"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={() => setCurrentImageIndex((prev) => 
          prev === bannerImages.length - 1 ? 0 : prev + 1
        )}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
        aria-label="Next image"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
}