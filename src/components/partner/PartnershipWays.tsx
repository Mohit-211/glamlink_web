import PartnershipCard from "./PartnershipCard";
import { PARTNERSHIP_WAYS } from "./partnerContent";

export default function PartnershipWays() {
  return (
    <section aria-labelledby="ways-to-partner" className="section-glamlink">
      <div className="container-glamlink">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Ways to Partner
          </p>
          <h2 id="ways-to-partner" className="section-title font-display mt-4">
            Multiple touchpoints. One community.
          </h2>
        </div>

        <div className="mt-12 md:mt-14 grid grid-cols-1 min-[520px]:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {PARTNERSHIP_WAYS.map((way, index) => (
            <PartnershipCard key={way.id} way={way} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
