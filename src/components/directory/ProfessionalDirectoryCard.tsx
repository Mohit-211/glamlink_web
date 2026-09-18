import Link from "next/link";
import { MapPin, ArrowUpRight, BadgeCheck } from "lucide-react";
import {
  DirectoryProfessional,
  getProfessionalLocation,
} from "@/lib/directoryProfessionals";

interface ProfessionalDirectoryCardProps {
  professional: DirectoryProfessional;
}

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "P";

const ProfessionalDirectoryCard = ({
  professional,
}: ProfessionalDirectoryCardProps) => {
  const location = getProfessionalLocation(professional);
  const title = professional.professional_title || professional.specialty;

  const content = (
    <div className="group relative flex flex-col h-full bg-white rounded-2xl border border-gray-100 p-6 hover:border-[#24bbcb]/40 hover:shadow-lg transition-all duration-300">
      <span className="inline-flex items-center gap-1 self-start text-[10px] font-medium tracking-wide uppercase text-[#24bbcb] bg-[#24bbcb]/8 border border-[#24bbcb]/20 rounded-full px-2.5 py-1 mb-4">
        <BadgeCheck className="h-3 w-3" />
        Professional
      </span>

      <div className="flex items-center gap-3 mb-4">
        {professional.profile_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={professional.profile_image}
            alt={professional.name}
            className="w-14 h-14 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-[#24bbcb]/10 text-[#24bbcb] flex items-center justify-center text-base font-semibold flex-shrink-0">
            {getInitials(professional.name)}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-serif text-gray-900 text-[16px] leading-snug truncate">
            {professional.name}
          </h3>
          {title && (
            <p className="text-[12px] text-gray-400 truncate">{title}</p>
          )}
        </div>
      </div>

      {location && (
        <p className="flex items-center gap-1 text-[12px] text-gray-500 mb-5">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{location}</span>
        </p>
      )}

      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[12px] font-medium text-gray-700">
          View Access Card
        </span>
        <ArrowUpRight className="h-3.5 w-3.5 text-[#24bbcb] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
      </div>
    </div>
  );

  if (!professional.business_card_link) return content;

  const isExternal = professional.business_card_link.startsWith("http");

  return isExternal ? (
    <a
      href={professional.business_card_link}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
    >
      {content}
    </a>
  ) : (
    <Link href={professional.business_card_link} className="block h-full">
      {content}
    </Link>
  );
};

export default ProfessionalDirectoryCard;
