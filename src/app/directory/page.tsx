"use client"
import DirectoryPage from "@/app/directory/DirectoryPage";
import { Suspense } from "react";

export default function DirectoryMainPage() {
  return (

    <Suspense fallback={null}>

  <DirectoryPage />;
  </Suspense>
  )
}
