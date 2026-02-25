import React, { useEffect, useState } from "react";
import GlamCardLivePreview from "../GlamCardLivePreview";
import { initialGlamCardData } from "../initialGlamCardData";
import GlamCardForm from "./GlamCardForm";
import { GlamCardFormData } from "./types";

const GlamCardApplication: React.FC = () => {
  const [data, setData] = useState<GlamCardFormData>({} as GlamCardFormData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initialGlamCardData().then((result) => {
      setData(result);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* LEFT */}
      <div className="rounded-xl border bg-white p-6 shadow">
        <GlamCardForm data={data} setData={setData} />
      </div>

      {/* RIGHT */}
      <GlamCardLivePreview data={data} mode="live" />
    </div>
  );
};

export default GlamCardApplication;