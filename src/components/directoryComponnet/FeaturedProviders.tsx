"use client"

import ProviderCard from "./ProviderCard"
import { Provider } from "@/types/provider"

interface Props {
  data: Provider[]
}

export default function FeaturedProviders({ data }: Props) {
  console.log(data,"data")

  if (!data?.length) {
    return <p className="py-10">No providers found</p>
  }

  return (

    <section className="py-16">

      <h2 className="text-4xl font-semibold mb-10">
        Featured Providers
      </h2>

      <div className="grid md:grid-cols-4 gap-10">

        {data.map((item) => (

          <ProviderCard
            key={item.place_id}
            data={item}
            pagetype="featureProvider"
          />

        ))}

      </div>

    </section>

  )
}