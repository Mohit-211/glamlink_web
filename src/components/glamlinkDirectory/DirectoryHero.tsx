import type { ReactNode } from "react";
import { BadgeCheck, MapPin } from "lucide-react";
import { unsplash } from "@/lib/directory/mockData";
import CommonHero from "@/components/common/CommonHero";

const HERO_IMAGES = {
  hair: unsplash("1562322140-8baeececf3df", 700),
  medSpa: unsplash("1552693673-1bf958298935", 600),
  wellness: unsplash("1600334129128-685c5582fd35", 600),
  makeup: unsplash("1487412947147-5cebf100ffc2", 300),
};

export default function DirectoryHero({ children }: { children: ReactNode }) {
  return (
    <CommonHero
      eyebrow={
        <>
          <MapPin className="w-4 h-4" aria-hidden="true" />
          Nationwide Beauty + Wellness Directory
        </>
      }
      title="Find Beauty + Wellness Professionals"
      titleHighlight="Near You"
      description="Search trusted professionals and businesses across the U.S."
      collage={{
        main: { src: HERO_IMAGES.hair, alt: "Hair stylist styling a client", label: "Hair", priority: true },
        top: { src: HERO_IMAGES.medSpa, alt: "Med spa skin treatment", label: "Skin + Med Spa" },
        bottom: { src: HERO_IMAGES.wellness, alt: "Hot stone wellness massage", label: "Wellness" },
        accent: { src: HERO_IMAGES.makeup, alt: "Makeup artistry" },
      }}
    >
      {children}

      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
        {["Glamlink-featured experts", "Google-powered listings", "Across the U.S."].map((item) => (
          <li key={item} className="flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-primary" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </CommonHero>
  );
}
