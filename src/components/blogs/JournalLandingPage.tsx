import AdSenseScript from "@/ads/AdSenseScript";
import JsonLd from "@/components/content/JsonLd";
import JournalClient, { type JournalClientProps } from "@/components/blogs/JournalClient";
import ConditionalGetFeatured from "@/components/common/ConditionalGetFeatured";

export default function JournalLandingPage(props: JournalClientProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Blog", name: "Glamlink Journal" }} />
      <AdSenseScript />
      <div className="flex-1">
        <JournalClient {...props} />
        <ConditionalGetFeatured />
      </div>
    </div>
  );
}
