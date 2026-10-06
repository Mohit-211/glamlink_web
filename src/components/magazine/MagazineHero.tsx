"use client";

import { Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewsletterPopup from "../NewsletterPopup/NewsletterPopup";
import CommonHero from "@/components/common/CommonHero";
import { issues2026 } from "@/data/issues";
import { unsplash } from "@/lib/directory/mockData";

// Two latest issue covers — update automatically when a new issue is added
const latestIssue = issues2026[issues2026.length - 1];
const previousIssue = issues2026[issues2026.length - 2];

const MagazineHero = () => {

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    window.open("https://mailchi.mp/glamlink/subscribe", "_blank");
  };

  return (
    <>
      <NewsletterPopup openDelay={3000} />

      <CommonHero
        title="The Glamlink"
        titleHighlight="Edit"
        description="The Glamlink Edit is your inside look at beauty and wellness. Where top professionals, top treatments and evolving innovation are spotlighted. Stories go deeper and insight actually mean something. Watch, shop beauty products and connect with professionals behind the stories."
        collage={{
          main: { src: unsplash("1604654894610-df63bc536371", 700), alt: "Editorial nail art", label: "Trends", priority: true },
          top: { src: latestIssue.cover ?? "", alt: `The Glamlink Edit, ${latestIssue.title} cover`, fit: "contain" },
          bottom: { src: previousIssue.cover ?? "", alt: `The Glamlink Edit, ${previousIssue.title} cover`, fit: "contain" },
          accent: { src: unsplash("1516975080664-ed2fc6a32937", 300), alt: "Makeup brushes" },
        }}
      >
        {/* Newsletter form – aligned heights, clean layout */}
        <div className="max-w-xl">
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row items-stretch gap-4"
          >
            {/* Input wrapper */}
            <div className="relative flex-1 min-w-0">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="email"
                placeholder="Your email address"
                className="
                w-full h-14 pl-14 pr-6 rounded-full 
                border border-gray-200 bg-white text-gray-900 
                placeholder:text-gray-400 
                outline-none focus:border-[#24bbcb] focus:ring-4 focus:ring-[#24bbcb]/15 
                transition-all duration-300 shadow-sm hover:shadow
              "
              />
            </div>

            {/* Button – same height as input */}
            <Button
              type="submit"
              className="
              h-14 px-8 min-w-[160px] 
              bg-[#24bbcb] hover:bg-[#1ea8b5] 
              text-white font-semibold rounded-full 
              shadow-md hover:shadow-lg shadow-[#24bbcb]/20 hover:shadow-[#24bbcb]/30 
              transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
              flex items-center gap-2
            "
            >
              <Sparkles className="w-4 h-4" />
              Subscribe
            </Button>
          </form>

          <p className="mt-5 text-sm text-gray-500">
            Join beauty enthusiasts • Unsubscribe anytime
          </p>
        </div>
      </CommonHero>
    </>
  );
};

export default MagazineHero;
