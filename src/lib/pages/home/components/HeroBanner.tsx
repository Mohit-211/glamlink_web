import Link from "next/link";
import { HeroBannerProps } from "../config";
import { getFeatureIconClass, getFeatureIconTextClass, getButtonClass } from "./ui";

export default function HeroBanner({ props }: { props: HeroBannerProps }) {
  if (!props) {
    return null;
  }
  
  const { state, handlers } = props;
  const { heroData } = state;
  
  return (
    <section className="section-padding bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container-custom">
        <div className="text-center max-w-5xl mx-auto">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium mb-4">
              {heroData.subtitle}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            {heroData.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto">
            {heroData.description}
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-10 max-w-3xl mx-auto text-left">
            {heroData.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${getFeatureIconClass(index)} rounded-full flex items-center justify-center`}>
                  <svg className={`w-4 h-4 ${getFeatureIconTextClass(index)}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {handlers?.onCtaClick ? (
              <button 
                onClick={handlers.onCtaClick}
                className={`${getButtonClass("primary")} text-lg`}
              >
                {heroData.ctaText}
              </button>
            ) : (
              <Link 
                href={heroData.ctaLink}
                className={`${getButtonClass("primary")} text-lg`}
              >
                {heroData.ctaText}
              </Link>
            )}
            <Link 
              href="https://github.com/yourusername/claude-generate"
              className={`${getButtonClass("outline")} text-lg`}
            >
              View on GitHub
            </Link>
          </div>

          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            An experimental project exploring AI-assisted web development
          </div>
        </div>
      </div>
    </section>
  );
}