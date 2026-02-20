"use client";

interface GetFeaturedHeroProps {
  formId: string;
}

export default function GetFeaturedHero({ formId }: GetFeaturedHeroProps) {
  const handleApplyNow = () => {
    const formElement = document.getElementById(formId);
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-gradient-to-b from-glamlink-teal/10 to-white pt-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get Featured in The Glamlink Edit</h1>
          <p className="text-xl text-gray-600 mb-8">Choose your feature and apply for your spotlight article</p>
          <button onClick={handleApplyNow} className="px-8 py-3 bg-glamlink-teal text-white font-semibold rounded-full hover:bg-glamlink-teal-dark transition-colors">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}
