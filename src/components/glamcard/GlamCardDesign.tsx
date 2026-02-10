'use client';

import axios from "axios";
import { useEffect, useState } from "react";
import GlamCardLivePreview from "./GlamCardLivePreview";
import { GlamCardFormData } from "./GlamCardForm/types";

interface Props {
  slug: string; // Example: "alex-johnson-3916edda"
}

const GlamCardDesign: React.FC<Props> = ({ slug }) => {
  const [data, setData] = useState<GlamCardFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://node.glamlink.net:5000/api/v1/businessCard/getBusinessCard/${slug}`
        );

        if (res?.data?.data) {
          setData(res.data.data);
        } else {
          setError("No business card found.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load business card.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return <p className="mt-20 text-center">Loading...</p>;
  }

  if (error) {
    return <p className="mt-20 text-center text-red-500">{error}</p>;
  }

  if (!data) {
    return <p className="mt-20 text-center">No data found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 mt-20">
      <GlamCardLivePreview
        data={data}
        mode="view"   // 🔥 IMPORTANT
        sticky={false}
      />
    </div>
  );
};

export default GlamCardDesign;
