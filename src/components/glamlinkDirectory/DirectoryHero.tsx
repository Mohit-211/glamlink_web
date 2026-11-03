import type { ReactNode } from "react";
import { BadgeCheck } from "lucide-react";
import PageHero from "@/components/common/PageHero";

/**
 * The directory's hero: copy and the search (children), beside the map of a city's Glamlink professionals (the
 * owner, Nov 3: in place of the group photo). The search gets the wider column.
 */
export default function DirectoryHero({ map, children }: { map: ReactNode; children: ReactNode }) {
  return (
    <PageHero
      id="directory-hero"
      eyebrow="Nationwide Beauty + Wellness Directory"
      title="Find Beauty + Wellness Professionals Near You"
      subtitle="Search trusted professionals and businesses across the U.S."
      media={map}
      mediaColumns="lg:grid-cols-[minmax(0,4fr)_minmax(0,3fr)]"
    >
      {children}

      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
        {["Glamlink-featured experts", "Google-powered listings", "Across the U.S."].map((item) => (
          <li key={item} className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-secondary" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </PageHero>
  );
}
