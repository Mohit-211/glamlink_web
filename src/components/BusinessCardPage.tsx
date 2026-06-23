"use client";
import React, { useEffect, useState } from "react";
import { getBusinessCardBySlug } from "@/api/Api";
import { GlamCardFormData } from "./glamcard/GlamCardForm/types";
import GlamCardLivePreview from "./glamcard/GlamCardLivePreview";
interface BusinessCardPageProps {
  slug?: string;
  mode?: "live" | "view" | "download";
}
const BusinessCardPage: React.FC<BusinessCardPageProps> = ({
  slug,
  mode,
}) => {
  const [data, setData] = useState<GlamCardFormData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(
    null
  );
  const [isSubscriptionError, setIsSubscriptionError] =
    useState(false);
  useEffect(() => {
    if (!slug) {
      setError("No slug provided.");
      setLoading(false);
      return;
    }
const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);
    setIsSubscriptionError(false);

    const res = await getBusinessCardBySlug(slug);

    console.log("Business Card Response:", res);

    // Handle API response with success:false
    if (res?.success === false) {
      if (res?.status === 402) {
        setIsSubscriptionError(true);
        setError(
          "This access card requires an active subscription. Please activate your subscription first."
        );
      } else {
        setError(
          res?.message || "Failed to load business card."
        );
      }
      return;
    }

    setData(res?.data);
  } catch (err: any) {
    console.error("Business Card Error:", err);

    const apiError = err?.response?.data;

    if (apiError?.status === 402) {
      setIsSubscriptionError(true);
      setError(
        apiError?.message ||
          "This access card requires an active subscription."
      );
    } else {
      setError(
        apiError?.message ||
          err?.message ||
          "Failed to load business card."
      );
    }
  } finally {
    setLoading(false);
  }
};
    fetchData();
  }, [slug]);
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-lg text-gray-600">
          Loading...
        </p>
      </div>
    );
  }
 if (error) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border p-8 text-center">
        <div className="text-6xl mb-4">
          {isSubscriptionError ? "💳" : "⚠️"}
        </div>

        <h2 className="text-2xl font-bold mb-3 text-red-600">
          {isSubscriptionError
            ? "Subscription Required"
            : "Error"}
        </h2>

        <p className="text-gray-600 mb-6">
          {error}
        </p>

        {isSubscriptionError && (
          <button
            onClick={() =>
              (window.location.href = "/pricing")
            }
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg"
          >
            Activate Subscription
          </button>
        )}
      </div>
    </div>
  );
}
  if (!data) return null;
  return (
    <GlamCardLivePreview
      data={data}
      mode={mode}
      onClose={() =>
        console.log("Close clicked")
      }
      onDownload={() =>
        console.log("Download clicked")
      }
      onCopyLink={() =>
        console.log("Copy link clicked")
      }
    />
  );
};
export default BusinessCardPage;