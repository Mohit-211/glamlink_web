import Link from "next/link";
import { Store } from "lucide-react";
import ProfileTile from "@/components/content/ProfileTile";
import type { ProfileCard } from "@/lib/api/types";
import { CREATE_PROFILE_HREF } from "./DirectoryCTA";
import ExploreHeading from "./ExploreHeading";

/** The directory's Explore Brands: a few brands, featured first, and the button to all of them. */
export default function ExploreBrands({ brands }: { brands: ProfileCard[] }) {
  return (
    <section
      id="explore-brands"
      aria-labelledby="explore-brands-heading"
      className="scroll-mt-24 border-t border-border/60 bg-tint py-16 md:py-24"
    >
      <div className="container-glamlink">
        <ExploreHeading
          id="explore-brands-heading"
          title="Explore Brands"
          subtitle="The brands shaping beauty + wellness, from professional skincare to the devices experts trust."
          href="/brands"
          label="Explore all brands"
        />

        {brands.length > 0 ? (
          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:mt-12 lg:grid-cols-6">
            {brands.map((brand) => (
              <li key={brand.id}>
                <ProfileTile profile={brand} sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed border-primary/25 bg-card px-6 py-12 text-center md:mt-12">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-secondary">
              <Store className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-xl font-semibold">Brands are joining Glamlink now</h3>
            <p className="mt-2 max-w-md text-muted-foreground">
              Are you a brand? Show your products and be found by professionals and their clients.
            </p>
            <Link href={CREATE_PROFILE_HREF} className="link-glamlink mt-5 text-sm">
              Create your brand&apos;s free profile
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
