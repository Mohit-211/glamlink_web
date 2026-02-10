"use client";

import { useRouter } from "next/navigation";
const AccessSection: React.FC = () => {
  const router = useRouter();
  return (
    <section className="w-full bg-white py-16">
      <div className="container-glamlink">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          
          {/* Left Content */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900">
              Access by Glamlink
            </h2>

            <p className="mt-6 text-base leading-relaxed text-gray-600">
              Access by Glamlink is the link in bio built for beauty
              professionals. It replaces messy links with a single,
              structured page that answers client questions upfront and
              gives them clear actions: book, contact, view services, or
              visit your website. No endless scrolling. No guessing.
            </p>

            <p className="mt-6 text-lg font-semibold leading-relaxed text-teal-500">
              Every Access Card connects to a free Glamlink profile and
              the beauty directory, where clients discover professionals
              by location and specialty. This means your link doesn't
              just organize your business — it helps people find you.
            </p>

            <p className="mt-6 text-base leading-relaxed text-gray-600">
              Clients see what you offer, where you're located, and how
              to book within seconds. Less back-and-forth. Faster
              decisions. More bookings.
            </p>

           <button
      onClick={() => router.push("/apply/digital-card")}
      style={{
        background:
          "linear-gradient(135deg, #23aeb8 0%, #53bec6 50%, #5cc2d6 100%)",
      }}
      className="mt-10 rounded-full px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:opacity-90"
    >
      Claim Your FREE Access Card
    </button>

          </div>

          {/* Right Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-[280px] sm:w-[320px]">
              <img
                src="/access-card-preview.png"
                alt="Access Card Preview"
                className="rounded-3xl shadow-2xl"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AccessSection;
