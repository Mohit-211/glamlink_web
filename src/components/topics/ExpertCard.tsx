import Link from "next/link";
import { MapPin, Mail, ArrowUpRight } from "lucide-react";
import { TopicExpert } from "@/lib/topics";

interface ExpertCardProps {
  expert: TopicExpert;
}

const parseSpecialties = (raw?: string): string[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const ExpertCard = ({ expert }: ExpertCardProps) => {
  const specialties = parseSpecialties(expert.specialties).slice(0, 3);
  const location = expert.locations?.[0];
  const locationLine =
    location?.address ||
    [location?.address_line_1, location?.city, location?.state, location?.zip]
      .filter(Boolean)
      .join(", ");
  const initials =
    expert.name
      ?.trim()
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "P";

  const content = (
    <div className="group relative flex flex-col h-full bg-white rounded-2xl border border-gray-100 p-6 hover:border-[#23AEB8]/40 hover:shadow-lg transition-all duration-300">
      {expert.business_card_qr && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={expert.business_card_qr}
          alt={`${expert.name?.trim()} QR code`}
          className="absolute top-4 right-4 w-20 h-20 rounded-md border border-gray-100 bg-white p-1"
        />
      )}
      <div className="flex items-center gap-3 mb-4 pr-20">
        {expert.profile_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={expert.profile_image}
            alt={expert.name?.trim()}
            className="w-11 h-11 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-[#23AEB8]/10 text-[#23AEB8] flex items-center justify-center text-sm font-semibold flex-shrink-0">
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-serif text-gray-900 text-[15px] leading-snug truncate">
            {expert.name?.trim()}
          </h3>
          {(expert.professional_title || expert.business_name) && (
            <p className="text-[12px] text-gray-400 truncate">
              {expert.professional_title || expert.business_name}
            </p>
          )}
          {expert.email && (
            <p className="flex items-center gap-1 text-[11px] text-gray-400 truncate mt-0.5">
              <Mail className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{expert.email}</span>
            </p>
          )}
        </div>
      </div>

      {specialties.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {specialties.map((item, i) => (
            <span
              key={i}
              className="text-[10px] font-medium text-[#23AEB8] px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(35,174,184,0.08)",
                border: "1px solid rgba(35,174,184,0.2)",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
        {locationLine ? (
          <span className="flex items-center gap-1 text-[11px] text-gray-400 truncate">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{locationLine}</span>
          </span>
        ) : (
          <span />
        )}
        {expert.business_card_link && (
          <span className="flex items-center gap-1 text-[11px] font-medium text-[#23AEB8] group-hover:gap-1.5 transition-all duration-200">
            View profile
            <ArrowUpRight className="h-3 w-3" />
          </span>
        )}
      </div>
    </div>
  );

  if (!expert.business_card_link) {
    return content;
  }

  const isExternal = expert.business_card_link.startsWith("http");

  return isExternal ? (
    <a
      href={expert.business_card_link}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
    >
      {content}
    </a>
  ) : (
    <Link href={expert.business_card_link} className="block h-full">
      {content}
    </Link>
  );
};

export default ExpertCard;
