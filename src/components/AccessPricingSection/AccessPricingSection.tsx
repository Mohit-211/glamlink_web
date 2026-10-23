import { Check } from "lucide-react";
import PlanPrice from "@/components/Pricing/PlanPrice";

export default function AccessPricingSection() {
  const features = [
    "Glamlink Directory Listing",
    "Digital Access Card & QR Code",
    "Bio, Specialties & Booking Link",
    "Contact Info & Social Links",
    "1 Featured Video & Up to 4 Photos",
    "Update Contact Details, Hours & Booking Links Anytime",
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
          <h2 className="text-2xl font-semibold">Free on Every Card</h2>

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
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          <div className="card-glamlink">
            <span className="badge-soft">Free</span>
            <h3 className="mt-5 text-2xl font-semibold">Free</h3>
            <div className="mt-4 text-5xl font-bold">$0</div>
            <p className="mt-6 text-muted-foreground">
              Everything above, and you keep your details current anytime.
            </p>
          </div>

          <div className="card-glamlink border-primary/20">
            <span className="badge-soft">Membership</span>
            <h3 className="mt-5 text-2xl font-semibold">Access Pro</h3>
            <div className="mt-4">
              <span className="gradient-text text-5xl font-bold"><PlanPrice product="pro" /></span>
              <span className="ml-2 text-lg text-muted-foreground">/month</span>
            </div>
            <p className="mt-6 text-muted-foreground">
              Update your featured video and photos anytime, with performance
              analytics. Priority placement in search is coming soon.
            </p>
          </div>

          <div className="card-glamlink">
            <span className="badge-soft">One-Time</span>
            <h3 className="mt-5 text-2xl font-semibold">NFC Keychain</h3>
            <div className="mt-4 text-5xl font-bold">
              <PlanPrice product="keychain" />
            </div>
            <p className="mt-6 text-muted-foreground">
              Clients tap it to open your card. Add it to Free or Access Pro.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
