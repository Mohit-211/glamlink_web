import React, { useState } from "react";
import GlamCardLivePreview from "./GlamCardLivePreview";
import { initialGlamCardData } from "./initialGlamCardData";
import GlamCardForm from "./GlamCardForm/GlamCardForm";

const GlamCardApplication: React.FC = () => {
  const [data, setData] = useState(initialGlamCardData);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* LEFT */}
      <div className="rounded-xl border bg-white p-6 shadow">
        <GlamCardForm data={data} setData={setData} />
      </div>

      {/* RIGHT */}
      <GlamCardLivePreview data={data} />
    </div>
  );
};

export default GlamCardApplication;
