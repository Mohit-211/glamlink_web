import { Provider } from "@/types/provider"
import { Globe } from "lucide-react"

interface Props {
  data: Provider
  pagetype?: string
}

export default function ProviderCard({ data, pagetype }: Props) {
  return (
    <div className="border p-5 rounded-lg flex flex-col h-full">

      {/* Top Content */}
      <div className="flex-grow">

        {data?.profile_image && (
          <img
            src={data?.profile_image}
            className="w-full h-56 object-cover mb-4 rounded"
          />
        )}

        {/* Title + Website Icon */}
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-bold">
            {data?.name}
          </h2>

         {data?.details?.website && (
  <a
    href={data.details.website}
    target="_blank"
    rel="noopener noreferrer"
    title={data.details.website}   // 👈 Tooltip with URL
    className="text-gray-500 hover:text-black"
  >
    <Globe size={18} />
  </a>
)}
        </div>

        <h6 className="text-sm text-gray-600 mt-1">
          {data?.locations?.[0]?.address}
        </h6>

        {data?.specialties && (
          <p className="text-gray-600 mt-2">
            {JSON.parse(data.specialties).join(" | ")}
          </p>
        )}

        {data?.vicinity && (
          <p className="text-sm text-gray-500 mt-1">
            {data?.vicinity}
          </p>
        )}

      </div>

      {/* Bottom Section */}
      {pagetype === "featureProvider" && data?.booking_link && (
        <a
          href={data.booking_link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4"
        >
          <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 text-sm font-medium cursor-pointer">
            Book Now
          </button>
        </a>
      )}

      {/* {pagetype !== "featureProvider" && (
        <div className="flex gap-3 mt-4">
          {data?.details?.website && (
            <a
              href={data?.details?.website}
              target="_blank"
              className="bg-black text-white px-3 py-1 text-sm rounded"
            >
              Website
            </a>
          )}
        </div>
      )} */}

    </div>
  )
}