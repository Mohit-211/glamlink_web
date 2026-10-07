import Link from "next/link";

export const CLAIM_PROFILE_HREF = "/directory-form-apply";

export default function DirectoryCTA() {
  return (
    <section
      aria-labelledby="directory-cta-heading"
      className="relative py-20 overflow-hidden bg-accent"
    >
      
      <div className="container-glamlink text-center max-w-2xl">
        {/* LABEL */}
        <p className="text-[10px] tracking-[0.22em] uppercase text-primary/80 mb-3">
          For Professionals
        </p>

        {/* HEADING */}
        <h2 id="directory-cta-heading" className="section-title font-display mb-4">
          Are you a beauty or wellness professional?
        </h2>

        {/* DESCRIPTION */}
        <p className="text-base text-muted-foreground leading-relaxed mb-8">
          Claim your profile, showcase your services and be part of the
          Glamlink community.
        </p>

        {/* CTA */}
        <Link
          href={CLAIM_PROFILE_HREF}
          className="btn-primary inline-block px-8 py-3 text-sm"
        >
          Claim Your Profile →
        </Link>
      </div>
    </section>
  );
}
