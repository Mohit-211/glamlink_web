import type { ComponentType, SVGProps } from "react";
import { Globe } from "lucide-react";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "@/components/icons/BrandIcons";
import type { SocialLink } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { trackAs } from "./profileEvents";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * TikTok, drawn like the lucide set (24 grid, 2px round strokes). Path from Tabler Icons' "brand-tiktok"
 * (MIT license, https://github.com/tabler/tabler-icons/blob/main/LICENSE); lucide has no brand icons.
 */
function Tiktok(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917z" />
    </svg>
  );
}

const PLATFORMS: { name: string; label: string; hosts: string[]; icon: Icon }[] = [
  { name: "instagram", label: "Instagram", hosts: ["instagram.com", "instagr.am"], icon: Instagram },
  { name: "tiktok", label: "TikTok", hosts: ["tiktok.com"], icon: Tiktok },
  { name: "facebook", label: "Facebook", hosts: ["facebook.com", "fb.com", "fb.me"], icon: Facebook },
  { name: "youtube", label: "YouTube", hosts: ["youtube.com", "youtu.be"], icon: Youtube },
  { name: "linkedin", label: "LinkedIn", hosts: ["linkedin.com"], icon: Linkedin },
  { name: "x", label: "X", hosts: ["x.com", "twitter.com"], icon: Twitter },
];

function hostOf(url: string) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

/** The platform a link points to, by its address (the title is the owner's own words). */
function platformOf(link: SocialLink) {
  const host = hostOf(link.url);
  const known = PLATFORMS.find((p) => p.hosts.some((h) => host === h || host.endsWith(`.${h}`)));
  if (known) return { name: known.name, label: link.title || known.label, icon: known.icon };
  const name = (link.title || host || "link").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return { name, label: link.title || host || "Link", icon: Globe as Icon };
}

/** Only web links are shown (the API checks them; this keeps any other scheme off the page). */
const isWebLink = (url: string) => /^https?:\/\//i.test(url);

/** The page's website and social icons, as the identity row shows them. */
export default function SocialLinks({
  website,
  social,
  className,
}: {
  website: string | null;
  social: SocialLink[];
  className?: string;
}) {
  const links = social.filter((link) => link.url && isWebLink(link.url) && link.url !== website);
  const site = website && isWebLink(website) ? website : null;
  if (!site && links.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-2", className)}>
      {site && (
        <a
          href={site}
          target="_blank"
          rel="noopener noreferrer"
          className="link-glamlink inline-flex items-center gap-2 text-sm"
          {...trackAs("WEBSITE_CLICK", site)}
        >
          <Globe className="h-4.5 w-4.5" aria-hidden="true" />
          Website
        </a>
      )}
      {site && links.length > 0 && <span aria-hidden="true" className="h-5 w-px bg-border" />}
      {links.length > 0 && (
        <ul className="-mx-1.5 flex flex-wrap items-center" aria-label="Social links">
          {links.map((link) => {
            const { name, label, icon: PlatformIcon } = platformOf(link);
            return (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-accent hover:text-secondary"
                  {...trackAs("SOCIAL_CLICK", name)}
                >
                  <PlatformIcon className="h-5 w-5" />
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
