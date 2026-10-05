import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { unsplash } from "@/lib/directory/mockData";

export const CLAIM_PROFILE_HREF = "/directory-form-apply";

export default function DirectoryCTA() {
  return (
    <section aria-labelledby="directory-cta-heading" className="pb-20 md:pb-28">
      <div className="container-glamlink">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#24bbcb] px-6 py-14 sm:px-12 md:py-16 lg:px-16 shadow-large">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/10 blur-2xl"
          />

          <div className="relative grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 text-center lg:text-left">
              <h2
                id="directory-cta-heading"
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-white"
              >
                Are you a beauty or wellness professional?
              </h2>
              <p className="mt-4 text-base sm:text-lg text-white/85 max-w-xl mx-auto lg:mx-0">
                Claim your profile, showcase your services and be part of the Glamlink community.
              </p>
              <Link
                href={CLAIM_PROFILE_HREF}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Claim Your Profile
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="hidden lg:block lg:col-span-5">
              <div className="relative ml-auto aspect-[4/3] max-w-md overflow-hidden rounded-3xl border-4 border-white/20 shadow-large rotate-2">
                <img
                  src={unsplash("1559599101-f09722fb4948", 700)}
                  alt="Beauty professionals in their salon"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
