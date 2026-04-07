"use client"

import ProviderCard from "./ProviderCard"
import { Provider } from "@/types/provider"

interface Props {
  title: string
  data: Provider[]
}

export default function AreaSection({ title, data }: Props) {

  if (!data?.length) return null

  return (

    <section className="mb-16">

      {/* <h2 className="text-2xl font-bold mb-8">
        {title}
      </h2> */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {data.map((item) => (

          <ProviderCard
            key={item.place_id}
            data={item}
          />

        ))}

      </div>

    </section>
  )
}