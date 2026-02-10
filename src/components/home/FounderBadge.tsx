import Image from "next/image";
import { Button } from "@/components/ui/button";

const FounderBadge = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container-glamlink">
        {/* Founder Badge */}
        <div className="max-w-3xl mx-auto text-center mb-24">
          {/* Badge Image */}
          <div className="flex justify-center mb-6">
            <Image
              src="https://thumbs.dreamstime.com/b/golden-shield-emblem-empty-badge-symbol-award-merit-recognition-excellence-achievement-security-shiny-polished-metallic-410628199.jpg"
              alt="Glamlink Founder Shield"
              width={200}
              height={200}
              unoptimized
              className="rounded-full"
            />
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-foreground">
            Founder Badge (First 100 Only)
          </h2>

          <p className="text-muted-foreground mb-2">
            Early professionals get exclusive visibility, permanent perks, and
            first access to new tools.
          </p>

          <p className="text-sm font-medium text-foreground">
            Join now and be recognized as a Founding Member.
          </p>
        </div>

        {/* Download Section */}
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-foreground">
            Download Glamlink for Free
          </h2>

          <p className="text-muted-foreground mb-12">
            Whether you're booking a beauty service or building your business.
          </p>

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="rounded-xl bg-gray-50 border p-6">
              <h3 className="font-semibold mb-2 text-foreground">
                For Users
              </h3>
              <p className="text-sm text-muted-foreground">
                Discover trusted pros, book instantly, and shop expert-approved
                products.
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 border p-6">
              <h3 className="font-semibold mb-2 text-foreground">
                For Professionals
              </h3>
              <p className="text-sm text-muted-foreground">
                Build your brand, grow your client base, and sell products
                directly.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="bg-teal-500 hover:bg-teal-600 text-white px-6">
              Download for Users
            </Button>

            <Button className="bg-black text-white hover:bg-black/90 px-6">
              Download for Pros
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderBadge;
