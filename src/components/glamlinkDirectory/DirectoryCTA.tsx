import Link from "next/link";

/** The Access form: the one way to join (a professional or a brand), and to claim a Google listing. */
export const CREATE_PROFILE_HREF = "/access#create-profile";

export default function DirectoryCTA() {
  return (
    <section
      aria-labelledby="directory-cta-heading"
      className="relative py-20 overflow-hidden bg-accent"
    >

      <div className="container-glamlink text-center max-w-2xl">
        {/* LABEL */}
        <p className="eyebrow text-secondary mb-3">
          For Professionals and Brands
        </p>

        {/* HEADING */}
        <h2 id="directory-cta-heading" className="section-title mb-4">
          Are you a beauty or wellness professional or brand?
        </h2>

        {/* DESCRIPTION */}
        <p className="text-base text-muted-foreground leading-relaxed mb-8">
          Create your free Access profile, showcase your work and services, and
          be listed in the Glamlink Directory.
        </p>

        {/* CTA */}
        <Link
          href={CREATE_PROFILE_HREF}
          className="btn-primary inline-block px-8 py-3 text-sm"
        >
          Create Your Free Profile →
        </Link>
      </div>
    </section>
  );
}
