"use client"

import ProviderCard from "./ProviderCard"
import { Provider } from "@/types/provider"

interface Props {
  title: string
  data: Provider[]
}

export default function AreaSection({ title, data }: Props) {
  console.log(data,"datacheckkk")

  if (!data?.length) return null

  return (

    <section className="mb-16">

      {/* <h2 className="text-2xl font-bold mb-6">
        {title}
      </h2> */}

      <div className="grid md:grid-cols-2 gap-6">

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