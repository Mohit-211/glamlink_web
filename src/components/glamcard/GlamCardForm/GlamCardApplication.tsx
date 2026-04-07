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
    <div className="flex gap-8 items-start">
      {/* LEFT — form, sticky, scrollable, height matches preview */}
      <div className="w-1/2 sticky top-0 h-screen overflow-hidden">
        <div className="h-full rounded-xl border bg-white p-6 shadow overflow-y-auto">
          <GlamCardForm data={data} setData={setData} />
        </div>
      </div>

      {/* RIGHT — preview, natural height, scrolls with page */}
      <div className="w-1/2">
        <GlamCardLivePreview data={data} mode="live" />
                     {/* <BusinessCardPage slug={data?.business_card_link.split('/').pop()} mode="view" /> */}

      </div>
    </div>
  );
};

export default GlamCardApplication;