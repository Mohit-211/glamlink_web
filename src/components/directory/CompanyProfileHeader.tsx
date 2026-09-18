import { MapPin, Globe, Mail, Instagram, Facebook, Linkedin, Youtube, Twitter, Music2 } from "lucide-react";
import { Company } from "@/types/company";
import { getCompanyCategoryLabel, getCompanyInitials, getCompanyLocation } from "@/lib/companies";

interface CompanyProfileHeaderProps {
  company: Company;
}

const SOCIAL_ICONS: Record<string, typeof Instagram> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  youtube: Youtube,
  x: Twitter,
  tiktok: Music2,
};

const CompanyProfileHeader = ({ company }: CompanyProfileHeaderProps) => {
  const location = getCompanyLocation(company);
  const socialEntries = Object.entries(company.social || {}).filter(
    ([, url]) => !!url
  );

  return (
    <section className="max-w-[1100px] mx-auto px-5 sm:px-6 pt-10 md:pt-14">
      <div className="flex flex-col sm:flex-row sm:items-start gap-6">
        {company.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={company.logo}
            alt={company.name}
            className="w-24 h-24 rounded-2xl object-cover border border-gray-100 flex-shrink-0"
          />
        ) : (
          <div className="w-24 h-24 rounded-2xl bg-gray-100 text-gray-500 flex items-center justify-center text-2xl font-semibold flex-shrink-0">
            {getCompanyInitials(company.name)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center text-[10px] font-medium tracking-widest uppercase text-[#24bbcb] bg-[#24bbcb]/8 border border-[#24bbcb]/20 rounded-full px-3 py-1 mb-3">
            {getCompanyCategoryLabel(company)}
          </span>
          <h1 className="font-serif text-[clamp(26px,4vw,38px)] leading-tight text-gray-900">
            {company.name}
          </h1>

          {company.description && (
            <p className="mt-3 text-[15px] leading-relaxed text-gray-500 font-light max-w-2xl">
              {company.description}
            </p>
          )}

          {location && (
            <p className="flex items-center gap-1.5 text-[13px] text-gray-500 mt-4">
              <MapPin className="h-3.5 w-3.5 text-[#24bbcb] flex-shrink-0" />
              {location}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-6">
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#24bbcb] text-white text-sm font-semibold px-6 py-3 shadow-lg shadow-[#24bbcb]/25 hover:bg-[#1ea8b5] transition-colors duration-200"
              >
                <Globe className="h-4 w-4" />
                Visit Website
              </a>
            )}
            {company.email && (
              <a
                href={`mailto:${company.email}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-700 px-6 py-3 hover:border-[#24bbcb]/50 hover:text-[#24bbcb] transition-colors duration-200"
              >
                <Mail className="h-4 w-4" />
                Contact
              </a>
            )}

            {socialEntries.length > 0 && (
              <div className="flex items-center gap-2 ml-1">
                {socialEntries.map(([platform, url]) => {
                  const Icon = SOCIAL_ICONS[platform] || Globe;
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={platform}
                      className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-500 hover:border-[#24bbcb] hover:text-[#24bbcb] transition-colors duration-200"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyProfileHeader;
