'use client';
// GlamCardDesign.tsx
import axios from "axios";
import GlamCardLivePreview from "./GlamCardLivePreview";
import { useEffect, useState } from "react";
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
        const response = await axios.get(
          `https://node.glamlink.net:5000/api/v1/businessCard/getBusinessCard/${slug}`
        );
console.log(response,"====")
        if (response.data) {
          setData(response?.data?.data); // assuming API returns GlamCardFormData structure
        }
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
  if (!data) return <p className="text-center mt-10">No data found.</p>;

  return (
  <div className="max-w-4xl mx-auto p-4 mt-20">
  <GlamCardLivePreview data={data} />
</div>

  );
};

export default GlamCardDesign;
