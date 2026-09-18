import type { Metadata } from "next";

import JournalLandingPage from "@/components/blogs/JournalLandingPage";
import {redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Beauty Industry Journal & Insights",
  description:
    "Explore beauty industry insights, trends, tips, and expert articles.",
};

export default function JournalPage() {
    redirect("/");

  return <JournalLandingPage />;
}
