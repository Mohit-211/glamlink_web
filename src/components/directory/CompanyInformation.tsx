import { MapPin, Globe, Phone, Mail, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Company } from "@/types/company";
import { getCompanyLocation } from "@/lib/companies";

interface CompanyInformationProps {
  company: Company;
}

interface InfoRow {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}

const CompanyInformation = ({ company }: CompanyInformationProps) => {
  const location = getCompanyLocation(company);
  const about = company.about || company.description;
  const addressValue = company.address || location;

  const allRows: (InfoRow | null)[] = [
    location
      ? {
          icon: MapPin,
          label: "Location",
          value: addressValue!,
          href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            addressValue!
          )}`,
          external: true,
        }
      : null,
    company.website
      ? {
          icon: Globe,
          label: "Website",
          value: company.website.replace(/^https?:\/\//, ""),
          href: company.website,
          external: true,
        }
      : null,
    company.phone
      ? { icon: Phone, label: "Phone", value: company.phone, href: `tel:${company.phone}` }
      : null,
    company.email
      ? { icon: Mail, label: "Email", value: company.email, href: `mailto:${company.email}` }
      : null,
  ];
  const rows = allRows.filter((row): row is InfoRow => row !== null);

  if (!about && rows.length === 0) return null;

  return (
    <section className="max-w-[1100px] mx-auto px-5 sm:px-6 py-12 md:py-14">
      {about && (
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#24bbcb]" />
            <h2 className="font-serif text-2xl text-gray-900">About</h2>
          </div>
          <p className="text-[15px] leading-[1.8] text-gray-500 font-light max-w-2xl">
            {about}
          </p>
        </div>
      )}

      {rows.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {rows.map((row) => {
            const Wrapper = row.href ? "a" : "div";
            return (
              <Wrapper
                key={row.label}
                {...(row.href
                  ? {
                      href: row.href,
                      target: row.external ? "_blank" : undefined,
                      rel: "noopener noreferrer",
                    }
                  : {})}
                className={`group flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 transition-all duration-200 ${
                  row.href ? "hover:border-[#24bbcb]/40 hover:shadow-md" : ""
                }`}
              >
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#24bbcb]/8 text-[#24bbcb] flex-shrink-0 transition-colors group-hover:bg-[#24bbcb] group-hover:text-white">
                  <row.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] uppercase tracking-wide text-gray-400">
                    {row.label}
                  </p>
                  <p
                    className={`text-[14px] font-medium text-gray-800 break-words ${
                      row.href ? "group-hover:text-[#24bbcb] transition-colors" : ""
                    }`}
                  >
                    {row.value}
                  </p>
                </div>
                {row.href && (
                  <ArrowUpRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-[#24bbcb] flex-shrink-0 transition-colors" />
                )}
              </Wrapper>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CompanyInformation;
