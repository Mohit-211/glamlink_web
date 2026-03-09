import { Provider } from "@/types/provider"

interface Props {
  data: Provider
  pagetype?: string
}

export default function ProviderCard({ data, pagetype }: Props) {

  return (

    <div className="border p-5 rounded-lg">

      {data?.profile_image && (
        <img
          src={data?.profile_image}
          className="w-full h-56 object-fit mb-4 rounded"
        />
      )}

      <h2 className="text-lg font-bold">
        {data?.name}
      </h2>
       <h6>
        {data?.locations?.[0]?.address}
      </h6>

     {
  data?.specialties && (
    <p className="text-gray-600">
      {JSON.parse(data.specialties).join(" | ")}
    </p>
  )
}

      {data?.vicinity && (
        <p className="text-sm text-gray-500">
          {data?.vicinity}
        </p>
      )}
     {pagetype === "featureProvider" && data?.booking_link && (
  <a
    href={data.booking_link}
    target="_blank"
    rel="noopener noreferrer"
  >
   <button className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 text-sm font-medium cursor-pointer">
  Book Now
</button>
  </a>
)}
     {pagetype !=="featureProvider" &&

      <div className="flex gap-3 mt-4">

        {/* {data?.instagram && ( */}
          {/* <a
            // href={data?.instagram}
            className="bg-cyan-500 text-white px-3 py-1 text-sm rounded"
          >
            Instagram
          </a> */}
        {/* )} */}

        {data?.details?.website && (
          <a
            href={data?.details?.website }
            className="bg-black text-white px-3 py-1 text-sm rounded"
          >
            Website
          </a>
        )} 

      </div>
}
    </div>

  )

}