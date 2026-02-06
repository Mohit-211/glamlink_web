import React from "react";

const DigitalCardSection: React.FC = () => {
  return (
    <section className="w-full bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          
          {/* Left Content */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900">
              Digital Card by Glamlink
            </h2>

            <p className="mt-6 text-base leading-relaxed text-gray-600">
              The Digital Card by Glamlink is your modern business card
              built for beauty professionals. It replaces scattered links
              and outdated cards with one smart, structured page that
              gives clients everything they need in one place.
            </p>

            <p className="mt-6 text-lg font-semibold leading-relaxed text-teal-500">
              Every Digital Card connects to your free Glamlink profile and
              the beauty directory, helping clients discover you by
              location and specialty — not just follow a link.
            </p>

            <p className="mt-6 text-base leading-relaxed text-gray-600">
              Clients can instantly view your services, contact you,
              book appointments, or visit your website. Less confusion.
              Faster decisions. More bookings.
            </p>

            <button className="mt-10 rounded-full bg-teal-500 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-teal-600">
              Claim Your FREE Digital Card
            </button>
          </div>

          {/* Right Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-[280px] sm:w-[320px]">
              <img
                src="/digital-card-preview.png"
                alt="Digital Card Preview"
                className="rounded-3xl shadow-2xl"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DigitalCardSection;
