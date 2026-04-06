"use client"
import DirectoryPage from "@/app/directory/DirectoryPage";
import ConditionalGetFeatured from "@/components/mediaKit/ConditionalGetFeatured";
import { Suspense } from "react";

export default function DirectoryMainPage() {
  return (

    <Suspense fallback={null}>

  <DirectoryPage />;
         <ConditionalGetFeatured/>
  
  </Suspense>
  )
}
