import { Check } from "lucide-react";

/* "The Benefits of an Access Profile": three equal cards under the Access hero.
   On phones the cards stack, each with its features in one column. */
const benefits = [
  {
    title: "Showcase Your Business",
    description: "Give clients a complete picture of who you are and what you do.",
    features: [
      "Professional Bio",
      "Services & Specialties",
      "Photos & Videos",
      "Business Hours",
      "Location & Map Directions",
      "Booking Links",
      "Contact Information",
      "Products & Shopping Links",
    ],
  },
  {
    title: "Connect & Share",
    description: "Make it easy for clients to find and connect with you.",
    features: [
      "Personalized Link",
      "QR Code",
      "Social Media Links",
      "Direct Contact",
      "Share Anywhere",
      "Optional NFC Keychain",
    ],
  },
  {
    title: "Grow with Glamlink",
    description: "Be discoverable through the Glamlink beauty and wellness platform.",
    features: [
      "Directory Listing",
      "Client Discovery",
      "Brand Connections",
      "Profile Analytics (Pro)",
      "Profile Updates",
    ],
  },
];

export default function AccessBenefits() {
  return (
    <section aria-labelledby="access-benefits-heading" className="section-glamlink">
      <div className="container-glamlink">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="access-benefits-heading" className="section-title text-balance">
            The Benefits of an Access Profile
          </h2>
          <p className="section-subtitle mx-auto text-lg leading-relaxed">
            Everything you need to showcase your business, connect with clients, and grow your opportunities.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 md:mt-16 md:grid-cols-3 lg:gap-8">
          {benefits.map((benefit) => (
            <li key={benefit.title} className="rounded-2xl bg-muted/50 p-7 md:p-6 lg:p-8">
              <h3 className="text-base font-semibold uppercase tracking-widest text-foreground">
                {benefit.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{benefit.description}</p>
              <ul className="mt-6 space-y-3">
                {benefit.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={2.5} aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
