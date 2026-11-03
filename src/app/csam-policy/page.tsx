import React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

/* Same layout as the Privacy Policy and Terms of Use pages. */

const BulletList = ({ items }: { items: React.ReactNode[] }) => (
  <ul className="space-y-3">
    {items.map((item, i) => (
      <li key={i} className="flex items-start">
        <span className="text-primary mr-3 mt-1">•</span>
        <span className="text-foreground/80">{item}</span>
      </li>
    ))}
  </ul>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-10">
    <h4 className="text-lg font-semibold text-foreground mb-3">{title}</h4>
    {children}
  </div>
);

const CsamPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-muted">
      {/* Hero Section */}
      <section className="bg-background pt-28 pb-12 md:pt-36 md:pb-16">
        <div className="container-glamlink">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="section-title mb-4">
              GlamLink CSAE (Child Sexual Abuse and Exploitation) Policy
            </h1>
            <p className="text-lg text-muted-foreground mb-6">Last updated: June 10, 2025</p>
            <Breadcrumb>
              <BreadcrumbList className="justify-center">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>CSAM Policy</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16">
        <div className="container-glamlink">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-lg shadow-soft border p-8 md:p-12">
              <div className="mb-12">
                <p className="text-foreground/80 leading-relaxed mb-6">
                  At GlamLink, we are committed to maintaining a safe and respectful
                  platform for all users. We strictly prohibit any form of child sexual
                  abuse and exploitation (CSAE), including the sharing, promotion, or
                  distribution of child sexual abuse material (CSAM), grooming, or any
                  content that depicts or encourages sexual exploitation of minors.
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  This policy applies to all users and content on both{" "}
                  <strong>GlamLink (User App)</strong> and <strong>GlamLink Pro</strong>
                </p>
              </div>

              <Section title="1. Zero-Tolerance Policy">
                <p className="text-foreground/80 leading-relaxed">
                  GlamLink maintains a zero-tolerance stance toward CSAM. Any user found
                  engaging in such activity will be subject to immediate removal from
                  the platform and potential legal consequences.
                </p>
              </Section>

              <Section title="2. Prohibited Content">
                <BulletList
                  items={[
                    "Child sexual abuse material (CSAM)",
                    "Sexualized content involving minors (including real, animated, or simulated)",
                    "Grooming or sexual exploitation behavior toward minors",
                    "Any post, message, image, or video involving children in a sexually suggestive context",
                  ]}
                />
              </Section>

              <Section title="Reporting and Moderation">
                <BulletList
                  items={[
                    "Our moderation team reviews the content promptly.",
                    "If CSAM or CSAE content is identified, it is immediately removed.",
                    "The associated user account may be suspended or permanently banned.",
                    "We retain logs and media to cooperate with legal counsel for appropriate action.",
                  ]}
                />
              </Section>

              <Section title="4. Enforcement">
                <BulletList
                  items={[
                    "Remove the offending content immediately",
                    "Suspend or permanently ban the user account",
                    "Notify our legal counsel for further investigation and potential escalation",
                  ]}
                />
              </Section>

              <Section title="5. Cooperation with Authorities">
                <p className="text-foreground/80 leading-relaxed">
                  While GlamLink is not currently integrated with formal reporting
                  agencies (e.g., NCMEC), we consult with our legal team in the event of
                  any CSAE-related reports and follow the appropriate legal course of
                  action under applicable law.
                </p>
              </Section>

              <Section title="Storage and Detection">
                <BulletList
                  items={[
                    "All user-uploaded media (photos, videos, clips) is stored securely on third-party servers.",
                    "While we currently do not use automated content scanning technologies, we are exploring options to enhance proactive detection and prevention of CSAM.",
                  ]}
                />
              </Section>

              <Section title="7. Future Commitments">
                <BulletList
                  items={[
                    "Introducing content moderation guidelines for professionals and users",
                    "Implementing age verification at signup",
                    "Exploring automated content detection tools",
                  ]}
                />
              </Section>

              <Section title="8. How to Report">
                <p className="text-foreground/80 leading-relaxed mb-4">
                  If you encounter any content you believe may involve child exploitation:
                </p>
                <BulletList
                  items={[
                    <>Use the in-app &quot;Report&quot; feature available on each post</>,
                    <>
                      Or contact us directly at:{" "}
                      <a href="mailto:support@glamlink.com" className="link-glamlink underline">
                        support@glamlink.com
                      </a>
                    </>,
                  ]}
                />
              </Section>

              <div className="mt-16 pt-8 border-t">
                <p className="text-center font-semibold text-foreground">
                  GlamLink is committed to building a safe space for self-expression,
                  beauty, and creativity — free from abuse, exploitation, and harm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CsamPolicy;
