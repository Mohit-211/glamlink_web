"use client";

import RelatedArticles from "@/components/blogs/RelatedArticles";

const partners = [
  {
    id: 1,
    companyName: "Circadia Education",
    description:
      "Professional skincare education and certification training designed for beauty professionals looking to expand their expertise.",
    logo: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300",
    upcomingDates: [
      { date: "June 12", location: "Valencia, CA" },
      { date: "June 20", location: "Dallas, TX" },
      { date: "July 08", location: "Online" },
      { date: "July 22", location: "Las Vegas, NV" },
    ],
  },
  {
    id: 2,
    companyName: "ABACT Training",
    description:
      "Advanced beauty and wellness certification programs taught by industry-leading educators.",
    logo: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=300",
    upcomingDates: [{ date: "June 12", location: "Las Vegas, NV" }],
  },
  {
    id: 3,
    companyName: "Lash Map",
    description:
      "Premium lash education, workshops, and hands-on training opportunities.",
    logo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300",
    upcomingDates: [],
  },
];

export default function EducationPage() {
  return (
 <div className="min-h-screen">
      {/* Hero Section */}
<section className="relative  md:pt-20 overflow-hidden bg-white">
  {/* Subtle background texture */}
  <div className="absolute inset-0 pointer-events-none opacity-[0.006]">
    <div
      className="w-full h-full"
      style={{
        backgroundImage:
          "radial-gradient(circle at 2px 2px, #e0e0e0 1px, transparent 0)",
        backgroundSize: "50px 50px",
      }}
    />
  </div>

  <div className="container-glamlink px-5 md:px-8 relative z-10">
    <div className="max-w-5xl mx-auto text-center">
      {/* Badge */}
      <div className="mb-8">
        <span className="inline-flex px-5 py-2 rounded-full bg-[#24bbcb]/10 text-[#24bbcb] text-sm font-medium border border-[#24bbcb]/20">
          JOURNAL • EDUCATION
        </span>
      </div>

      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-light text-gray-950 tracking-tight leading-none mb-8 md:mb-10">
        <span className="italic text-[#24bbcb]">Education</span>
      </h1>

      {/* Description */}
      <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed ">
        Explore beauty and wellness trainings, certifications,
      workshops, events, and educational articles for professionals.
      </p>

    
    </div>
  </div>
</section>

   <section className="max-w-7xl mx-auto px-6 py-20">
  <div className="text-center mb-14">
    <span className="inline-block text-[#23AEB8] text-xs font-semibold tracking-[0.25em] uppercase mb-4">
      Featured Education Partners
    </span>

    <h2 className="text-4xl md:text-5xl font-serif text-[#1F2937] mb-4">
      Upcoming Trainings & Certifications
    </h2>

    <p className="max-w-3xl mx-auto text-gray-600 text-lg leading-relaxed">
      Discover training opportunities, certifications, workshops, and
      continuing education programs from trusted beauty and wellness educators.
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-8">
    {partners.map((partner) => (
      <div
        key={partner.id}
        className="bg-white rounded-[28px] border border-[#23AEB8]/10 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src={partner.logo}
            alt={partner.companyName}
            className="w-16 h-16 rounded-2xl object-cover border border-[#23AEB8]/10"
          />

          <div>
            <h3 className="text-xl font-semibold text-[#1F2937]">
              {partner.companyName}
            </h3>

            <span className="text-xs uppercase tracking-widest text-[#23AEB8]">
              Education Partner
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed mb-6">
          {partner.description}
        </p>

        {/* Upcoming Trainings */}
        <div className="mb-8">
          <h4 className="font-semibold text-[#1F2937] mb-4">
            Upcoming Trainings
          </h4>

          {partner.upcomingDates.length > 0 ? (
            <ul className="space-y-3">
              {partner.upcomingDates.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-[#23AEB8] mt-2 flex-shrink-0" />

                  <span className="text-gray-700">
                    <span className="font-medium">{item.date}</span>
                    {" — "}
                    {item.location}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="bg-[#F4FBFC] rounded-2xl px-4 py-3 text-sm text-gray-600">
              Coming Soon / View Upcoming Trainings
            </div>
          )}
        </div>

        {/* Learn More */}
        <button className="mt-auto text-[#23AEB8] font-semibold flex items-center gap-2 hover:gap-3 transition-all">
          Learn More
          <span>→</span>
        </button>
      </div>
    ))}
  </div>
</section>

     <section className="bg-[#F8FCFC] py-24">
  <div className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-14">
      <span className="inline-block text-[#23AEB8] text-xs font-semibold tracking-[0.25em] uppercase mb-4">
        Latest Education Articles
      </span>

      <h2 className="text-4xl md:text-5xl font-serif text-[#1F2937] mb-4">
        Keep Learning
      </h2>

      <p className="max-w-2xl mx-auto text-gray-600">
        Stay informed with industry insights, professional development
        resources, and educational content from beauty and wellness experts.
      </p>
    </div>

    <RelatedArticles category_id="17" />
  </div>
</section>
    </div>
  );
}