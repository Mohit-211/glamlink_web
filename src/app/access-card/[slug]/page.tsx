// pages/access-card/[slug]/page.tsx
import type { Metadata } from "next";
import BusinessCardPageClient from "./BusinessCardPageClient";

const DEFAULT_OG_IMAGE = "https://glamlink.net/oglayout.png";

async function getProDataForMetadata(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}businessCard/getBusinessCard/${slug}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    const json = await res.json();
    if (json?.success === false) return null;
    return json?.data || null;
  } catch {
    return null;
  }
}

function buildLocationLabel(pro: any): string {
  const primaryLocation =
    pro?.locations?.find((l: any) => l.is_primary) || pro?.locations?.[0];
  if (!primaryLocation) return "";
  if (primaryLocation.location_type === "exact_address") {
    return primaryLocation.address?.trim() || "";
  }
  return [primaryLocation.city, primaryLocation.state]
    .map((v: string) => v?.trim())
    .filter(Boolean)
    .join(", ");
}

function buildDescription(pro: any): string {
  const specialty = pro?.professional_title || pro?.primary_specialty || "";
  const business = pro?.business_name || "";
  const location = buildLocationLabel(pro);

  const parts = [specialty, business, location].filter(Boolean);
  if (parts.length) return parts.join(" · ");

  return "View this beauty & wellness professional's Access profile on Glamlink.";
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pro = await getProDataForMetadata(slug);

  const title = pro?.name
    ? `${pro.name} | Access by Glamlink`
    : "Access by Glamlink";
  const description = buildDescription(pro);
  const image =
    typeof pro?.profile_image === "string" && pro.profile_image
      ? pro.profile_image
      : DEFAULT_OG_IMAGE;
  const url = `https://glamlink.net/access-card/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Glamlink",
      type: "profile",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function BusinessCardPage({ params }: PageProps) {
  const { slug } = await params;
  return <BusinessCardPageClient slug={slug} />;
}
