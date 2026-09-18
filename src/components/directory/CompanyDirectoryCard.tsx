import Link from "next/link";
import { MapPin, ArrowUpRight, Building2 } from "lucide-react";
import { Company } from "@/types/company";
import { getCompanyCategoryLabel, getCompanyInitials, getCompanyLocation } from "@/lib/companies";

interface CompanyDirectoryCardProps {
  company: Company;
}

const CompanyDirectoryCard = ({ company }: CompanyDirectoryCardProps) => {
  const location = getCompanyLocation(company);

  return (
    <Link
      href={`/directory/company/${company.id}`}
      className="group flex flex-col h-full bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
    >
      <span className="inline-flex items-center gap-1 self-start text-[10px] font-medium tracking-wide uppercase text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-2.5 py-1 mb-4">
        <Building2 className="h-3 w-3" />
        Company
      </span>

      <div className="flex items-center gap-3 mb-4">
        {company.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={company.logo}
            alt={company.name}
            className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-gray-100"
          />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center text-base font-semibold flex-shrink-0">
            {getCompanyInitials(company.name)}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-serif text-gray-900 text-[16px] leading-snug truncate">
            {company.name}
          </h3>
          <p className="text-[12px] text-gray-400 truncate">
            {getCompanyCategoryLabel(company)}
          </p>
        </div>
      </div>

      {company.description && (
        <p className="text-[13px] leading-relaxed text-gray-500 font-light line-clamp-2 mb-4">
          {company.description}
        </p>
      )}

      {location && (
        <p className="flex items-center gap-1 text-[12px] text-gray-500 mb-5">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{location}</span>
        </p>
      )}

      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[12px] font-medium text-gray-700">
          View Directory Profile
        </span>
        <ArrowUpRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
      </div>
    </Link>
  );
};

export default CompanyDirectoryCard;
