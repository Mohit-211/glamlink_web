import type { Metadata } from "next";
import PartnerPage from "@/components/partner/PartnerPage";

const TITLE = "Partner With Glamlink | Glamlink";
const DESCRIPTION =
  "Connect your brand or business with the beauty + wellness community through Glamlink partnerships, editorial, podcast, digital and industry opportunities.";

export const metadata: Metadata = {
  // `absolute` skips the root "%s | Glamlink" template so the suffix isn't doubled.
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: {
    canonical: "https://glamlink.net/partner",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://glamlink.net/partner",
    siteName: "Glamlink",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function Page() {
  return <PartnerPage />;
}
