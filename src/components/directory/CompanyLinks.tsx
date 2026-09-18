import {
  Globe,
  GraduationCap,
  CalendarCheck,
  IdCard,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Twitter,
  Music2,
  Link2,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { Company } from "@/types/company";

interface CompanyLinksProps {
  company: Company;
}

interface LinkTile {
  icon: LucideIcon;
  label: string;
  url: string;
}

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  youtube: Youtube,
  x: Twitter,
  tiktok: Music2,
};

const SOCIAL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  x: "X",
  tiktok: "TikTok",
};

const CompanyLinks = ({ company }: CompanyLinksProps) => {
  const tiles: LinkTile[] = [];

  if (company.links?.website || company.website) {
    tiles.push({ icon: Globe, label: "Website", url: company.links?.website || company.website! });
  }
  if (company.links?.education) {
    tiles.push({ icon: GraduationCap, label: "Education", url: company.links.education });
  }
  if (company.links?.booking) {
    tiles.push({ icon: CalendarCheck, label: "Booking", url: company.links.booking });
  }
  if (company.links?.directoryProfile) {
    tiles.push({ icon: IdCard, label: "Directory Profile", url: company.links.directoryProfile });
  }

  for (const [platform, url] of Object.entries(company.social || {})) {
    if (!url) continue;
    tiles.push({
      icon: SOCIAL_ICONS[platform] || Link2,
      label: SOCIAL_LABELS[platform] || platform,
      url,
    });
  }

  for (const other of company.links?.other || []) {
    if (!other.url) continue;
    tiles.push({ icon: Link2, label: other.label, url: other.url });
  }

  if (tiles.length === 0) return null;

  return (
    <section className="max-w-[1100px] mx-auto px-5 sm:px-6 py-12 md:py-14 bg-[#fafafa]">
      <h2 className="font-serif text-2xl text-gray-900 mb-6">Company Links</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {tiles.map((tile) => (
          <a
            key={`${tile.label}-${tile.url}`}
            href={tile.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 hover:border-[#24bbcb]/50 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#24bbcb]/8 text-[#24bbcb] flex-shrink-0">
              <tile.icon className="h-4 w-4" />
            </div>
            <span className="text-[13px] font-medium text-gray-700 truncate flex-1">
              {tile.label}
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-[#24bbcb] flex-shrink-0 transition-colors" />
          </a>
        ))}
      </div>
    </section>
  );
};

export default CompanyLinks;
