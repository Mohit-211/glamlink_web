"use client"

import { useRouter } from "next/navigation"

interface Service {
  name: string
  slug: string
}

interface Props {
  services: Service[]
  active: string
}

export default function ServicesTabs({ services, active }: Props) {

  const router = useRouter()

  const handleClick = (slug: string) => {

    if (slug === "all") {
      router.push("/directory")
    } else {
      router.push(`/directory/${slug}`)
    }

  }

  return (

    <div className="flex gap-3 overflow-x-auto pb-6">

      {services.map((service) => (

        <button
          key={service.slug}
          onClick={() => handleClick(service.slug)}
          className={`px-5 py-2 rounded-full border text-sm font-medium transition
          
          ${
            active === service.slug
              ? "bg-black text-white border-black"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          {service.name}
        </button>

      ))}

    </div>

  )
}