"use client";

import React, { useEffect, useState } from "react";
import { getBusinessCardBySlug } from "@/api/Api";
import { GlamCardFormData } from "./glamcard/GlamCardForm/types";
import GlamCardLivePreview from "./glamcard/GlamCardLivePreview";

interface BusinessCardPageProps {
  slug?: string;
  mode?: "live" | "view" | "download";

}

const BusinessCardPage: React.FC<BusinessCardPageProps> = ({ slug, mode = "view" }) => {
  const [data, setData] = useState<GlamCardFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("No slug provided.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getBusinessCardBySlug(slug);
        setData(res?.data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load business card.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!data) return null;

  return (
    <GlamCardLivePreview
      data={data}
      mode={mode}
      onClose={() => console.log("Close clicked")}
      onDownload={() => console.log("Download clicked")}
      onCopyLink={() => console.log("Copy link clicked")}
    />
  );
};

export default BusinessCardPage;