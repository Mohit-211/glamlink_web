import type { ReactNode } from "react";
import { BadgeCheck } from "lucide-react";
import PageHero from "@/components/common/PageHero";
import heroPhoto from "../../../public/home-hero/directory-hero.png";

/**
 * The directory's hero: copy and the search (children), over the group photo of
 * hair, med spa, injector, esthetician, wellness and grooming professionals.
 */
export default function DirectoryHero({ children }: { children: ReactNode }) {
  return (
    <PageHero
      id="directory-hero"
      eyebrow="Nationwide Beauty + Wellness Directory"
      title={
        <>
          Find Beauty + Wellness Professionals <span className="text-primary">Near You</span>
        </>
      }
      subtitle="Search trusted professionals and businesses across the U.S."
      image={heroPhoto}
      imagePosition="object-top"
    >
      {children}

      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground lg:text-foreground">
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
