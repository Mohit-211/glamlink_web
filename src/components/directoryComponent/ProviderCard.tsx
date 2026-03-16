"use client";

import Image from "next/image";
import { Globe } from "lucide-react";
import { Provider } from "@/types/provider";

interface Props {
  data: Provider;
  pagetype?: string;
}

export default function ProviderCard({ data, pagetype }: Props) {
  const specialties = data?.specialties ? JSON.parse(data.specialties) : [];

  const initials =
    data?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2) || "P";

  const googlePhoto = data?.photos?.[0]?.photo_reference
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photo_reference=${data.photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    : null;

  const category = data?.types?.[0]?.replaceAll("_", " ") || "Beauty Provider";

  return (
    <div className="card-glamlink flex flex-col group">
      {/* IMAGE (Featured Providers) */}
      {data?.profile_image || googlePhoto ? (
        <div className="relative w-full h-56 overflow-hidden rounded-xl mb-4">
          <Image
          unoptimized={process.env.NODE_ENV === "development"}
            src={data?.profile_image || googlePhoto}
            alt={data?.name || "provider"}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
            {initials}
          </div>

          <div className="text-sm text-muted-foreground">Beauty Provider</div>
        </div>
      )}

      {/* CONTENT */}
      <div className="flex flex-col flex-grow">
        {/* TITLE + WEBSITE */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-snug">{data?.name}</h3>

          {(data?.details?.website || data?.website) && (
            <a
              href={data?.details?.website || data?.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              title="Visit Website"
            >
              <Globe size={18} />
            </a>
          )}
        </div>

        {/* ADDRESS */}
        {(data?.locations?.[0]?.address || data?.formatted_address) && (
          <p className="text-sm text-muted-foreground mt-1">
            {data?.locations?.[0]?.address || data?.formatted_address}
          </p>
        )}

        {/* SPECIALTIES (Featured Providers) */}
        {specialties.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {specialties.slice(0, 3).map((item: string, i: number) => (
              <span key={i} className="badge-soft text-xs">
                {item}
              </span>
            ))}
          </div>
        )}

        {/* VICINITY */}
        {data?.vicinity && (
          <p className="text-xs text-muted-foreground mt-3">{data.vicinity}</p>
        )}

        {/* OPEN STATUS */}
        {data?.opening_hours && (
          <div className="mt-3 text-xs">
            {data.opening_hours.open_now ? (
              <span className="text-green-600 font-medium">Open Now</span>
            ) : (
              <span className="text-muted-foreground">Closed Now</span>
            )}
          </div>
        )}
      </div>

      {/* CTA (Featured Providers Only) */}
      {pagetype === "featureProvider" && data?.booking_link && (
        <a
          href={data.booking_link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6"
        >
          <button className="btn-primary w-full text-sm">Book Now</button>
        </a>
      )}
    </div>
  );
}
