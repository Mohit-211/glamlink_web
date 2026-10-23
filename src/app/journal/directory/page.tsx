import { Suspense } from "react";
import NewsletterPopup from "@/components/NewsletterPopup/NewsletterPopup";
import DirectoryPage from "@/components/directoryComponent/DirectoryPage";

/** The journal's service directory listing (/journal/directory?service=…). */
export default function JournalDirectoryPage() {
  return (
    <>
      <NewsletterPopup openDelay={3000} />
      <div className="mx-auto mt-30 max-w-4xl px-4 pb-8 sm:px-6 lg:pb-14">
        <Suspense fallback={null}>
          <DirectoryPage />
        </Suspense>
      </div>
    </>
  );
}
