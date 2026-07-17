import { Check } from "lucide-react";

export default function AccessPricingSection() {
  const features = [
    "NFC Access Keychain",
    "Digital Access Card",
    "Glamlink Directory Profile",
    "Booking & Contact Links",
    "Photos & Videos",
    "Services & Specialties",
    "QR Code Sharing",
  ];

  return (
    <section className="section-glamlink page-soft">
      <div className="container-glamlink">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="badge-soft">Access by Glamlink</span>

          <h1 className="section-title mt-6">
            Everything your clients need to know—
            <span className="gradient-text"> in one tap.</span>
          </h1>

          <p className="section-subtitle mx-auto">
            Your Access Card combines your digital business card, link in bio,
            booking, services, reviews, photos, videos, and more into one
            professional page built for beauty & wellness professionals.
          </p>
        </div>

        {/* Features */}
        <div className="card-glamlink mt-16">
          <h2 className="text-2xl font-semibold">What's Included</h2>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-4 rounded-xl border border-border bg-background p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check size={18} />
                </div>

                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Setup */}
          <div className="card-glamlink border-primary/20">
            <span className="badge-soft">One-Time</span>

            <h3 className="mt-5 text-2xl font-semibold">
              Setup Price
            </h3>

            <div className="gradient-text mt-4 text-5xl font-bold">
              $39.99
            </div>

            <p className="mt-6 text-muted-foreground">
              Includes your NFC Access Keychain and Digital Access Card.
            </p>
          </div>

          {/* Membership */}
          <div className="card-glamlink">
            <span className="badge-soft">Membership</span>

            <h3 className="mt-5 text-2xl font-semibold">
              Profile Editing
            </h3>

            <div className="mt-4">
              <span className="text-5xl font-bold">$4.99</span>
              <span className="ml-2 text-lg text-muted-foreground">
                /month
              </span>
            </div>

            <p className="mt-6 text-muted-foreground">
              Update your photos, videos, links, promotions, and business
              information anytime.
            </p>
          </div>
        </div>

      
      </div>
    </section>
  );
}