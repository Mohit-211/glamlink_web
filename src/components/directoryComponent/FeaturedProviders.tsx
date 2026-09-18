"use client";

import ProviderCard from "./ProviderCard";
import ProviderCardSkeleton from "./ProviderCardSkeleton";
import { Provider } from "@/types/provider";

interface Props {
  data: Provider[];
  loading?: boolean;
}

export default function FeaturedProviders({ data, loading }: Props) {
  if (loading) {
    return (
      <section className="py-16">
        <h2 className="text-4xl font-semibold mb-10">Featured Providers</h2>

        <div className="grid md:grid-cols-3 gap-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <ProviderCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (!data?.length) {
    return <p className="py-10">No providers found</p>;
  }

  return (
    <section className="py-16">
      <h2 className="text-4xl font-semibold mb-10">Featured Providers</h2>

      <div className="grid md:grid-cols-3 gap-10">
        {data.map((item, index) => (
          <ProviderCard
            key={item.place_id || item.name || index}
            data={item}
            pagetype="featureProvider"
          />
        ))}
      </div>
    </section>
  );
}
