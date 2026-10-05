import { directoryThemeStyle } from "@/components/glamlinkDirectory/directoryTheme";
import PartnerHero from "./PartnerHero";
import { INQUIRY_SECTION_ID } from "./partnerContent";
import PartnershipWays from "./PartnershipWays";
import PartnershipInquiryForm from "./PartnershipInquiryForm";

export default function PartnerPage() {
  return (
    <div className="overflow-x-clip" style={directoryThemeStyle}>
      <PartnerHero />

      <PartnershipWays />

      <section
        id={INQUIRY_SECTION_ID}
        aria-labelledby="partner-inquiry-heading"
        className="scroll-mt-20 md:scroll-mt-24 bg-background section-glamlink"
      >
        <div className="container-glamlink">
          <div className="mx-auto w-full max-w-160">
            <div className="text-center">
              <h2 id="partner-inquiry-heading" className="section-title font-display">
                Interested in partnering with us?
              </h2>
              <p className="section-subtitle mx-auto leading-relaxed">
                Tell us a little about your brand, business or upcoming initiative. Our team will
                review your submission and reach out if there&apos;s a fit.
              </p>
            </div>

            <div className="mt-10 rounded-3xl border bg-card p-5 shadow-medium sm:p-10">
              <PartnershipInquiryForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
